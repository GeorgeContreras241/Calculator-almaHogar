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
  calcularPrecioTotal,
  formatearMoneda,
  formatearNumero,
} from "../lib/formulas"
import type { Configuracion, ResultadoCalculo } from "../types"
import { Calculator } from "lucide-react"

export function CalculadoraPiso() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)

  // Se puede agrupar el estadp de largo y ancho
  const [largoArea, setLargoArea] = useState("")
  const [anchoArea, setAnchoArea] = useState("")

  // Metraje Cuadrado
  const [areaM, setAreaM] = useState(0)
  
  // ni idea de que es esto
  const [tallaId, setTallaId] = useState("")

  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null)
  const [modo, setModo] = useState<"medida" | "mt2">("medida")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  useEffect(() => {
    if (config.pisos.tallas.length > 0 && !tallaId) {
      setTallaId(config.pisos.tallas[0].id)
    }
  }, [config.pisos.tallas, tallaId])

  const tallaSeleccionada = config.pisos.tallas.find((t) => t.id === tallaId)


  const calcular = () => {
    const l = parseFloat(largoArea)
    const a = parseFloat(anchoArea)
    const areaM2 = calcularM2(l, a)
    if (isNaN(l) || isNaN(a) || !tallaSeleccionada) return
    if (l <= 0 || a <= 0) return


    // Operacion para calcular el area por medida
    if(modo === "medida") {
      setResultado({
        areaM2,
        precioTotal: calcularPrecioTotal(areaM2, tallaSeleccionada.precioPorPieza),
      })
      return
    }

    // Operacion para calcular el area por mt2
    if(modo == "mt2") {
      console.log("Calculando por mt2")
      console.log("Area M2: ", areaM)
      setResultado({
        areaM2: areaM,
        precioTotal: calcularPrecioTotal(areaM, tallaSeleccionada.precioPorPieza),
      })
    }
    
  }

  const limpiar = () => {
    setLargoArea("")
    setAnchoArea("")
    setResultado(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculadora de Piso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Talla del piso</Label>
          <select
            value={tallaId}
            onChange={(e) => setTallaId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-base shadow-sm md:text-sm"
          >
            {config.pisos.tallas.length === 0 ? (
              <option value="">No hay tallas configuradas</option>
            ) : (
              config.pisos.tallas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} - {t.largo}×{t.ancho} cm - {formatearMoneda(t.precioPorPieza)}/pza
                </option>
              ))
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 text-sm font-medium border border-gray-800 rounded-md overflow-hidden">
          <button 
            className={`px-4 py-2 ${modo === "medida" ? "bg-neutral-100 text-neutral-900" : ""} rounded-l-md cursor-pointer h-9`}
            onClick={() => setModo("medida")}
          >
            Medida
          </button>
          <button   
            className={`px-4 py-2 ${modo === "mt2" ? "bg-neutral-100 text-neutral-900" : ""} rounded-r-md cursor-pointer h-9`}
            onClick={() => setModo("mt2")}
          >
            Mt²
          </button>
        </div>
        {
          modo === "medida" ? (
            <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="largo-piso-calc">Largo del área (m)</Label>
            <Input
              id="largo-piso-calc"
              type="number"
              placeholder="0.00"
              value={largoArea}
              onChange={(e) => setLargoArea(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ancho-piso-calc">Ancho del área (m)</Label>
            <Input
              id="ancho-piso-calc"
              type="number"
              placeholder="0.00"
              value={anchoArea}
              onChange={(e) => setAnchoArea(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
   
        </div>  
          ) : (
            <div className="space-y-2">
              <Label htmlFor="area-piso-calc">Área (m²)</Label>
              <Input
                id="area-piso-calc"
                type="number"
                placeholder="0.00"
                value={areaM}
                onChange={(e) => setAreaM(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )
        }


        

        <div className="flex gap-2">
          <Button onClick={calcular} className="flex-1" disabled={config.pisos.tallas.length === 0}>
            Calcular
          </Button>
          <Button onClick={limpiar} variant="outline">Limpiar</Button>
        </div>

        {resultado && tallaSeleccionada && (
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-2 bg-[var(--color-muted)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Área:</span>
              <span className="font-medium">{formatearNumero(resultado.areaM2)} m²</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Piezas de {tallaSeleccionada.nombre}:</span>
              {/* <span className="font-medium">{resultado.piezasNecesarias}</span> */}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Precio por pieza:</span>
              <span className="font-medium">{formatearMoneda(tallaSeleccionada.precioPorPieza)}</span>
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
