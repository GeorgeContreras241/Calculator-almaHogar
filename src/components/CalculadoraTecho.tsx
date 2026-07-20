import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  cargarConfiguracion,
  calcularM2,
  calcularMerma,
  calcularPiezasNecesarias,
  calcularPrecioLaminas,
  formatearMoneda,
  formatearNumero,
} from "../lib/formulas"
import type { Configuracion } from "../types"
import { Calculator } from "lucide-react"

type ModoCalculo = "laminas" | "metro"

export function CalculadoraTecho() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [modo, setModo] = useState<ModoCalculo>("laminas")
  const [largoArea, setLargoArea] = useState("")
  const [anchoArea, setAnchoArea] = useState("")
  const [tipoId, setTipoId] = useState("")
  const [merma, setMerma] = useState("10")
  const [resultado, setResultado] = useState<{
    areaM2: number
    areaConMerma: number
    laminasNecesarias: number
    precioTotal: number
  } | null>(null)

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  useEffect(() => {
    if (config.techos.tipos.length > 0 && !tipoId) {
      setTipoId(config.techos.tipos[0].id)
    }
  }, [config.techos.tipos, tipoId])

  const tipoSeleccionado = config.techos.tipos.find((t) => t.id === tipoId)

  const calcular = () => {
    const l = parseFloat(largoArea)
    const a = parseFloat(anchoArea)
    const m = parseFloat(merma)
    if (isNaN(l) || isNaN(a) || !tipoSeleccionado) return
    if (l <= 0 || a <= 0) return

    const areaM2 = calcularM2(l, a)
    const areaConMerma = calcularMerma(areaM2, isNaN(m) ? 0 : m)

    if (modo === "laminas") {
      const laminas = calcularPiezasNecesarias(areaConMerma, tipoSeleccionado.largo, tipoSeleccionado.ancho)
      const precioTotal = calcularPrecioLaminas(laminas, tipoSeleccionado.largo, tipoSeleccionado.ancho, tipoSeleccionado.precioM2)
      setResultado({ areaM2, areaConMerma, laminasNecesarias: laminas, precioTotal })
    } else {
      const precioTotal = areaConMerma * tipoSeleccionado.precioM2
      setResultado({ areaM2, areaConMerma, laminasNecesarias: 0, precioTotal })
    }
  }

  const limpiar = () => {
    setLargoArea("")
    setAnchoArea("")
    setMerma("10")
    setResultado(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculadora de Techo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de techo</Label>
          <select
            value={tipoId}
            onChange={(e) => setTipoId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-base shadow-sm md:text-sm"
          >
            {config.techos.tipos.length === 0 ? (
              <option value="">No hay tipos configurados</option>
            ) : (
              config.techos.tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} - {formatearMoneda(t.precioM2)}/m²
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Forma de venta</Label>
          <div className="grid grid-cols-2 rounded-md border border-[var(--color-input)] overflow-hidden">
            <button
              onClick={() => setModo("laminas")}
              className={`grid grid-cols-1 place-items-center py-2 text-sm font-medium transition-colors cursor-pointer ${modo === "laminas"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-transparent text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                }`}
            >
              Por lámina
              {
                modo === "laminas" && tipoSeleccionado && (
                  <div className="flex items-center gap-1 mt-1">
                    <Label className="text-[var(--color-primary-foreground)] text-xs">
                      Numero de láminas: 
                    </Label>
                    <input type="text" className="bg-transparent border-none focus:ring-0 w-4"  placeholder="0"/>
                  </div>
                )
              }
            </button>
            <button
              onClick={() => setModo("metro")}
              className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${modo === "metro"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-transparent text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                }`}
            >
              Por m²
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="largo-techo-calc">Largo del área (m)</Label>
            <Input
              id="largo-techo-calc"
              type="number"
              placeholder="0"
              value={largoArea}
              onChange={(e) => setLargoArea(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ancho-techo-calc">Ancho del área (m)</Label>
            <Input
              id="ancho-techo-calc"
              type="number"
              placeholder="0"
              value={anchoArea}
              onChange={(e) => setAnchoArea(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="area-techo-calc">Área (m²)</Label>
            <Input
              id="area-techo-calc"
              type="number"
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
        </div>



        <div className="flex gap-2">
          <Button onClick={calcular} className="flex-1" disabled={config.techos.tipos.length === 0}>
            Calcular
          </Button>
          <Button onClick={limpiar} variant="outline">Limpiar</Button>
        </div>

        {resultado && tipoSeleccionado && (
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-2 bg-[var(--color-muted)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Área:</span>
              <span className="font-medium">{formatearNumero(resultado.areaM2)} m²</span>
            </div>
            {parseFloat(merma) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Con merma ({merma}%):</span>
                <span className="font-medium">{formatearNumero(resultado.areaConMerma)} m²</span>
              </div>
            )}
            {modo === "laminas" && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">Láminas de {tipoSeleccionado.nombre}:</span>
                  <span className="font-medium">{resultado.laminasNecesarias}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">Área de 1 lámina:</span>
                  <span className="font-medium">{formatearNumero((tipoSeleccionado.largo * tipoSeleccionado.ancho) / 10000)} m²</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Precio {tipoSeleccionado.nombre}:</span>
              <span className="font-medium">{formatearMoneda(tipoSeleccionado.precioM2)}/m²</span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-[var(--color-primary)]">{formatearMoneda(resultado.precioTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
