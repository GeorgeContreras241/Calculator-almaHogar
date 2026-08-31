import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cargarConfiguracion, calcularM2, calcularPrecioTotal, formatearMoneda, formatearNumero } from "@/lib/formulas"
import type { Configuracion, ResultadoCalculo } from "@/types"
import { Calculator, Settings } from "lucide-react"
import { ConfigPisos } from "@/components/pisos/ConfigPisos"

export function CalculadoraPiso() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [configOpen, setConfigOpen] = useState(false)
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
      const periemtroEstimado: number = (Math.sqrt(m2) * 4) / 2.44
      setResultado({ areaM2: m2, precioTotal: calcularPrecioTotal(m2, talla.precioPorPieza), perimetroM: periemtroEstimado })
    } else {
      const m2 = parseFloat(areaM)
      const periemtroEstimado: number = (Math.sqrt(m2) * 4) / 2.44
      if (isNaN(m2) || m2 <= 0) return
      setResultado({ areaM2: m2, precioTotal: calcularPrecioTotal(m2, talla.precioPorPieza), perimetroM: periemtroEstimado })
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
          <button className="ml-auto text-muted-foreground hover:text-foreground cursor-pointer" onClick={() => setConfigOpen(!configOpen)}>
            <Settings className="w-5 h-5" />
          </button>
        </CardTitle>
      </CardHeader>
      {
        !configOpen ? (
          // S
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Talla del piso</Label>
              <select value={tallaId} onChange={(e) => setTallaId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-base shadow-sm md:text-sm">
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
              <div className="rounded-lg border border-border p-3 space-y-1 bg-muted text-sm">
                <div className="font-medium text-foreground border-b border-border pb-1 mb-1">Resumen</div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Área:</span>
                  <span className="font-medium">{formatearNumero(resultado.areaM2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modelo:</span>
                  <span className="font-medium">{talla.largo}×{talla.ancho} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio:</span>
                  <span className="font-medium">{formatearMoneda(talla.precioPorPieza)}/pza</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gaurda Escobas estimado:</span>
                  <span className="font-medium">{resultado.perimetroM?.toFixed(2)} piezas</span>
                </div>

                <div className="border-t border-border pt-1 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-primary">{formatearMoneda(resultado.precioTotal ?? 0)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        ) : (
          <ConfigPisos />
        )
      }
    </Card>
  )
}
