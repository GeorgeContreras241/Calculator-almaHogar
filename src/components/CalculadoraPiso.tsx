import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cargarConfiguracion, calcularM2, calcularPrecioTotal, formatearMoneda, formatearNumero } from "../lib/formulas"
import type { Configuracion, ResultadoCalculo } from "../types"
import { Calculator } from "lucide-react"

export function CalculadoraPiso() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [tallaId, setTallaId] = useState("")
  const [modo, setModo] = useState<"medida" | "mt2">("medida")
  const [area, setArea] = useState({ largo: "", ancho: "" })
  const [areaM, setAreaM] = useState("")
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)

  useEffect(() => { setConfig(cargarConfiguracion()) }, [])

  useEffect(() => {
    if (config.pisos.tallas.length > 0 && !tallaId) setTallaId(config.pisos.tallas[0].id)
  }, [config.pisos.tallas, tallaId])

  const talla = config.pisos.tallas.find((t) => t.id === tallaId)

  const calcular = () => {
    if (!talla) return
    if (modo === "medida") {
      const l = parseFloat(area.largo), a = parseFloat(area.ancho)
      if (isNaN(l) || isNaN(a) || l <= 0 || a <= 0) return
      const m2 = calcularM2(l, a)
      setResultado({ areaM2: m2, precioTotal: calcularPrecioTotal(m2, talla.precioPorPieza) })
    } else {
      const m = parseFloat(areaM)
      if (isNaN(m) || m <= 0) return
      setResultado({ areaM2: m, precioTotal: calcularPrecioTotal(m, talla.precioPorPieza) })
    }
  }

  const limpiar = () => { setArea({ largo: "", ancho: "" }); setAreaM(""); setResultado(null) }

  const opciones = config.pisos.tallas.map((t) => ({
    value: t.id, label: `${t.nombre} - ${t.largo}×${t.ancho} cm - ${formatearMoneda(t.precioPorPieza)}/pza`
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Calculadora de Piso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Talla del piso</Label>
          <select value={tallaId} onChange={(e) => setTallaId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-base shadow-sm md:text-sm">
            {opciones.length === 0
              ? <option value="">No hay tallas configuradas</option>
              : opciones.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 text-sm font-medium border border-gray-800 rounded-md overflow-hidden">
          <button className={`px-4 py-2 ${modo === "medida" ? "bg-neutral-100 text-neutral-900" : ""} rounded-l-md cursor-pointer h-9`} onClick={() => setModo("medida")}>Medida</button>
          <button className={`px-4 py-2 ${modo === "mt2" ? "bg-neutral-100 text-neutral-900" : ""} rounded-r-md cursor-pointer h-9`} onClick={() => setModo("mt2")}>Mt²</button>
        </div>

        {modo === "medida" ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Largo (m)</Label>
              <Input type="number" placeholder="0" value={area.largo} onChange={(e) => setArea({ ...area, largo: e.target.value })} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Ancho (m)</Label>
              <Input type="number" placeholder="0" value={area.ancho} onChange={(e) => setArea({ ...area, ancho: e.target.value })} min="0" step="0.01" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>Área (m²)</Label>
            <Input type="number" placeholder="0" value={areaM} onChange={(e) => setAreaM(e.target.value)} min="0" step="0.01" />
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={calcular} className="flex-1" disabled={!talla}>Calcular</Button>
          <Button onClick={limpiar} variant="outline">Limpiar</Button>
        </div>

        {resultado && talla && (
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-2 bg-[var(--color-muted)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Área:</span>
              <span className="font-medium">{formatearNumero(resultado.areaM2)} m²</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Precio por pieza:</span>
              <span className="font-medium">{formatearMoneda(talla.precioPorPieza)}</span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-[var(--color-primary)]">{formatearMoneda(resultado.precioTotal ?? 0)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
