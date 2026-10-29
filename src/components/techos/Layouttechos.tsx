import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatearMoneda, calcularMaterialesPorArea, calcularMaterialesTecho } from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import type { Result, TipoTecho } from "@/types"
import { Calculator, Settings } from "lucide-react"
import { CardResult } from "@/components/ui/cardResult"
import { ConfigTechos } from "@/components/techos/ConfigTechos"

function calcularResultado(
  tipo: TipoTecho | undefined,
  modo: "laminas" | "metro",
  cantLaminas: string,
  m2: string
): Result | null {
  if (!tipo) return null

  const modelo = `${tipo.largo}×${tipo.ancho} cm`

  if (modo === "laminas") {
    const c = parseInt(cantLaminas)
    if (isNaN(c) || c <= 0) return null
    return {
      precioUnitario: tipo.precioLamina,
      total: c * tipo.precioLamina,
      areaM2: 0,
      perimetroM: 0,
      modelo,
    }
  }

  const m = parseFloat(m2)
  if (isNaN(m) || m <= 0 || tipo.m2 <= 0) return null

  return {
    precioUnitario: tipo.precioM2,
    total: m * tipo.precioM2,
    areaM2: m,
    perimetroM: Math.sqrt(m) * 4,
    modelo,
    materiales: calcularMaterialesPorArea(m, tipo.m2),
    perimetral: calcularMaterialesTecho(m),
  }
}

export function CalculadoraTecho() {
  const config = useConfigStore((s) => s.config)
  const [configOpen, setConfigOpen] = useState(false)
  const [tipoId, setTipoId] = useState("")
  const [modo, setModo] = useState<"laminas" | "metro">("metro")
  const [cantLaminas, setCantLaminas] = useState("")
  const [m2, setM2] = useState("")

  const tipos = config.techos.tipos
  const tipo = tipos.find((t) => t.id === tipoId) ?? tipos[0]
  const resultado = calcularResultado(tipo, modo, cantLaminas, m2)

  const limpiar = () => {
    setCantLaminas("")
    setM2("")
  }

  return (
    <Card>
      {/* header */}
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Calculadora de Techo
          <button type="button" aria-label="Configurar techos" className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setConfigOpen(!configOpen)}>
            <Settings className="w-5 h-5" />
          </button>
        </CardTitle>
      </CardHeader>
      {/* content */}
      {!configOpen ? (
        <CardContent className="space-y-4">
          <div className={`grid text-sm font-medium border border-gray-800 rounded-md overflow-hidden ${tipos.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {tipos.map((t) => (
              <button
                key={t.id}
                className={`px-4 py-2 ${tipo?.id === t.id ? "bg-neutral-100 text-neutral-900" : ""} cursor-pointer rounded-r-md h-max`}
                onClick={() => setTipoId(t.id)}
              >
                {t.nombre} - {formatearMoneda(t.precioLamina)} - {formatearMoneda(t.precioM2)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 text-sm font-medium border border-gray-800 rounded-md overflow-hidden">
            <button className={`px-4 py-2 ${modo === "metro" ? "bg-neutral-100 text-neutral-900" : ""} rounded-r-md cursor-pointer h-fit`}
              onClick={() => { limpiar(); setModo("metro") }}>Por m²</button>
            <button className={`px-4 py-2 ${modo === "laminas" ? "bg-neutral-100 text-neutral-900" : ""} rounded-l-md cursor-pointer h-fit`}
              onClick={() => { limpiar(); setModo("laminas") }}>Por lámina</button>
          </div>

          {modo === "laminas" ? (
            <div className="space-y-2">
              <Label>Número de láminas</Label>
              <Input type="number" placeholder="0" value={cantLaminas} onChange={(e) => setCantLaminas(e.target.value)} min="0" step="1" />
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Área (m²)</Label>
                <Input type="number" placeholder="0" value={m2} onChange={(e) => setM2(e.target.value)} min="0" step="0.01" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={limpiar} variant="outline" className="flex-1">Limpiar</Button>
          </div>

          {resultado && tipo && (
            <div className="rounded-lg border border-border p-3 space-y-1 bg-muted text-sm">
              <div className="flex justify-between items-center">
                <div className="font-medium text-foreground border-b border-border pb-1 mb-1">Resumen - {tipo?.nombre}</div>
                {modo === "metro" && resultado && (
                  <span className="text-xs text-muted-foreground">
                    {(parseFloat(m2) / tipo.m2).toFixed(2)} → {Math.ceil(parseFloat(m2) / tipo.m2)} láminas ({(Math.ceil(parseFloat(m2) / tipo.m2) * tipo.m2).toFixed(2)} m²)
                  </span>
                )}
              </div>

              {modo === "laminas" ? (
                <CardResult title="Láminas">{cantLaminas} piezas</CardResult>
              ) : (
                <>
                  <CardResult title="Área">{resultado.areaM2.toFixed(2)} m²</CardResult>
                  {resultado.perimetroM > 0 && (
                    <CardResult title="Perímetro">{resultado.perimetroM.toFixed(2)} m</CardResult>
                  )}
                </>
              )}
              <CardResult title="Modelo">{resultado.modelo}</CardResult>
              <CardResult title="Precio">{formatearMoneda(resultado.precioUnitario)}/{modo === "laminas" ? "lámina" : "m²"}</CardResult>



              {resultado.materiales && (
                <>
                  <div className="font-medium text-foreground border-t border-border pt-1 mt-1">Materiales techo</div>
                  <CardResult title="Láminas PVC">{resultado.materiales.laminasPVC} piezas</CardResult>
                  <CardResult title="Láminas exactas">{resultado.materiales.valorMaterialBruto.toFixed(2)} láminas</CardResult>
                  <CardResult title="Ómegas">{resultado.materiales.omegas} piezas</CardResult>
                  <CardResult title="Viguetas">{resultado.materiales.viguetas} piezas</CardResult>
                  <CardResult title="Tornillos blancos *10">{resultado.materiales.tornillosBlancos} piezas</CardResult>
                  <CardResult title="Tornillos negros /2">{resultado.materiales.tornillosNegros} piezas</CardResult>
                </>
              )}

              {resultado.perimetral && (
                <>
                  <div className="font-medium text-foreground border-t border-border pt-1 mt-1">Perimetral</div>
                  <CardResult title="Perimetral plástico">{resultado.perimetral.perimetralPlastico?.toFixed(2)} piezas</CardResult>
                  <CardResult title="Ángulos">{resultado.perimetral.angulos?.toFixed(2)} piezas</CardResult>
                </>
              )}

              <div className="border-t border-border pt-1 mt-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-primary">{formatearMoneda(resultado.total)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      ) : (
        <ConfigTechos />
      )}
    </Card>
  )
}
