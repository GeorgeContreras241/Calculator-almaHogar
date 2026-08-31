import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cargarConfiguracion, formatearMoneda, formatearNumero, calcularMaterialesPorArea, calcularMaterialesTecho, redondearArribaDecimal } from "@/lib/formulas"
import type { Configuracion, Result } from "@/types"
import { Calculator, Settings } from "lucide-react"
import { CardResult } from "@/components/ui/cardResult"
import { ConfigTechos } from "@/components/techos/ConfigTechos"

export function CalculadoraTecho() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [configOpen, setConfigOpen] = useState(false)
  const [tipoId, setTipoId] = useState("")
  const [modo, setModo] = useState<"laminas" | "metro">("laminas")
  const [cantLaminas, setCantLaminas] = useState("")
  const [m2, setM2] = useState("")
  const [perimetro, setPerimetro] = useState("")
  const [resultado, setResultado] = useState<Result | null>(null)

  useEffect(() => { setConfig(cargarConfiguracion()) }, [])

  useEffect(() => {
    if (config.techos.tipos.length > 0 && !tipoId) setTipoId(config.techos.tipos[0].id)
  }, [config.techos.tipos, tipoId])

  const tipo = config.techos.tipos.find((t) => t.id === tipoId)

  const calcular = () => {
    if (!tipo) return
    if (modo === "laminas") {
      const c = parseInt(cantLaminas)
      if (isNaN(c) || c <= 0) return
      setResultado({
        precioUnitario: tipo.precioLamina,
        total: c * tipo.precioLamina,
        areaM2: 0,
        perimetroM: 0,
        modelo: `${tipo.largo}×${tipo.ancho} cm`,
      })
    } else {
      const m = parseFloat(m2)
      if (isNaN(m) || m <= 0) return
      const perimetroCalculado = Math.sqrt(m) * 4

      const materiales = calcularMaterialesPorArea(m, 1.8)
      const perimetral = calcularMaterialesTecho(m)
      setResultado({
        precioUnitario: tipo.precioM2,
        total: m * tipo.precioM2,
        areaM2: m,
        perimetroM: perimetroCalculado,
        modelo: `${tipo.largo}×${tipo.ancho} cm`,
        materiales,
        perimetral,
      })
    }
  }

  const limpiar = () => {
    setCantLaminas(""); setM2(""); setPerimetro(""); setResultado(null)
  }

  const opciones = config.techos.tipos.map((t) => ({
    value: t.id, label: `${t.nombre} - ${formatearMoneda(t.precioLamina)}/lámina | ${formatearMoneda(t.precioM2)}/m²`
  }))
  console.log(resultado)

  return (
    <Card>
      {/* header */}
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Calculadora de Techo
          <button className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setConfigOpen(!configOpen)}>
            <Settings className="w-5 h-5" />
          </button>
        </CardTitle>
      </CardHeader>
      {/* content */}
      {!configOpen ? (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de techo</Label>
            <select value={tipoId} onChange={(e) => setTipoId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-base shadow-sm md:text-sm">
              {opciones.length === 0
                ? <option value="">No hay tipos configurados</option>
                : opciones.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 text-sm font-medium border border-gray-800 rounded-md overflow-hidden">
            <button className={`px-4 py-2 ${modo === "laminas" ? "bg-neutral-100 text-neutral-900" : ""} rounded-l-md cursor-pointer h-9`} onClick={() => { limpiar(); setModo("laminas") }}>Por lámina</button>
            <button className={`px-4 py-2 ${modo === "metro" ? "bg-neutral-100 text-neutral-900" : ""} rounded-r-md cursor-pointer h-9`} onClick={() => { limpiar(); setModo("metro") }}>Por m²</button>
          </div>

          {modo === "laminas" ? (
            <div className="space-y-2">
              <Label>Número de láminas</Label>
              <Input type="number" placeholder="0" value={cantLaminas} onChange={(e) => setCantLaminas(e.target.value)} min="0" step="1" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Área (m²)</Label>
                <Input type="number" placeholder="0" value={m2} onChange={(e) => setM2(e.target.value)} min="0" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Perímetro (m) <span className="text-xs text-muted-foreground">opcional</span></Label>
                <Input type="number" placeholder="0" value={perimetro} onChange={(e) => setPerimetro(e.target.value)} min="0" step="0.1" />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={calcular} className="flex-1" disabled={!tipo}>Calcular</Button>
            <Button onClick={limpiar} variant="outline">Limpiar</Button>
          </div>

          {resultado && tipo && (
            <div className="rounded-lg border border-border p-3 space-y-1 bg-muted text-sm">
              <div className="flex justify-between items-center">
                <div className="font-medium text-foreground border-b border-border pb-1 mb-1">Resumen</div>
                {modo === "metro" && resultado && (
                  <span className="text-xs text-muted-foreground">
                    {(parseFloat(m2) / 1.8).toFixed(2)} → {Math.ceil(parseFloat(m2) / 1.8)} láminas ({(Math.ceil(parseFloat(m2) / 1.8) * 1.8).toFixed(2)} m²)
                  </span>
                )}
              </div>

              {modo === "laminas" ? (
                <CardResult title="Láminas">{cantLaminas} piezas</CardResult>
              ) : (
                <>
                  <CardResult title="Área">{formatearNumero(resultado.areaM2)} m²</CardResult>
                  {resultado.perimetroM > 0 && (
                    <CardResult title="Perímetro">{formatearNumero(resultado.perimetroM)} m</CardResult>
                  )}
                </>
              )}
              <CardResult title="Modelo">{resultado.modelo}</CardResult>
              <CardResult title="Precio">{formatearMoneda(resultado.precioUnitario)}/{modo === "laminas" ? "lámina" : "m²"}</CardResult>



              {resultado.materiales && (
                <>
                  <div className="font-medium text-foreground border-t border-border pt-1 mt-1">Materiales techo</div>
                  <CardResult title="Láminas PVC">{resultado.materiales.laminasPVC} piezas</CardResult>
                  <CardResult title="Valor Neto Laminas">{resultado.materiales.valorMaterialBruto.toFixed(2)} piezas</CardResult>
                  <CardResult title="Ómegas">{resultado.materiales.omegas} piezas</CardResult>
                  <CardResult title="Viguetas">{resultado.materiales.viguetas} piezas</CardResult>
                  <CardResult title="Tornillos estructura">{resultado.materiales.tornillosEstructura} piezas</CardResult>
                  <CardResult title="Tornillos PVC">{resultado.materiales.tornillosPVC} piezas</CardResult>
                  <CardResult title="Chazos techo">{resultado.materiales.chazosTecho} piezas</CardResult>
                </>
              )}

              {resultado.perimetral && (
                <>
                  <div className="font-medium text-foreground border-t border-border pt-1 mt-1">Perimetral</div>
                  <CardResult title="Perimetral plástico">{resultado.perimetral.perimetralPlastico.toFixed(2)} piezas</CardResult>
                  <CardResult title="Ángulos">{resultado.perimetral.angulos?.toFixed(2)} piezas</CardResult>
                  <CardResult title="Chazos pared">{resultado.perimetral.chazosPared?.toFixed(2)} piezas</CardResult>
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
