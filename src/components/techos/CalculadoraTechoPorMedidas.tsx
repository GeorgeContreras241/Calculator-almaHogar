import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlanoTecho } from "@/components/techos/PlanoTecho"
import { ResultadoTecho } from "@/components/techos/ResultadoTecho"
import {
  areaLamina,
  calcularMaterialesPorArea,
  calcularMaterialesTecho,
  calcularPrecioTotal,
  calcularTotalesPiezas,
  formatearMoneda,
} from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import type { FormaPlano, Result } from "@/types"
import { Plus, Trash2 } from "lucide-react"

interface Pieza {
  id: number
  forma: FormaPlano
  ancho: string
  alto: string
  recorteAncho: string
  recorteAlto: string
  cantidad: string
}

type CampoTexto = "ancho" | "alto" | "recorteAncho" | "recorteAlto" | "cantidad"



const filaVacia = (id:number): Pieza => {
return{
  id,
    forma: "rectangulo",
    ancho: "",
    alto: "",
    recorteAncho: "",
    recorteAlto: "",
    cantidad: "1",
}
}

export function CalculadoraTechoPorMedidas() {
  const config = useConfigStore((s) => s.config)
  const siguienteId = useRef(2)
  const [piezas, setPiezas] = useState<Pieza[]>([filaVacia(1)])
  const [tipoId, setTipoId] = useState("")

  const actualizar = (id: number, campo: CampoTexto, valor: string) => {
    setPiezas((prev) =>
      prev.map((pieza) => (pieza.id === id ? { ...pieza, [campo]: valor } : pieza))
    )
  }

  const cambiarForma = (id: number, forma: FormaPlano) => {
    setPiezas((prev) =>
      prev.map((pieza) => (pieza.id === id ? { ...pieza, forma } : pieza))
    )
  }

  const agregar = () => {
    setPiezas((prev) => [...prev, filaVacia(siguienteId.current++)])
  }

  const eliminar = (id: number) => {
    setPiezas((prev) => {
      const restantes = prev.filter((pieza) => pieza.id !== id)
      return restantes.length > 0 ? restantes : [filaVacia(siguienteId.current++)]
    })
  }

  const limpiar = () => setPiezas([filaVacia(siguienteId.current++)])

  const medidas = piezas
    .map((pieza) => {
      const cantidad = parseInt(pieza.cantidad)
      return {
        forma: pieza.forma,
        ancho: parseFloat(pieza.ancho),
        alto: parseFloat(pieza.alto),
        recorteAncho: parseFloat(pieza.recorteAncho),
        recorteAlto: parseFloat(pieza.recorteAlto),
        cantidad: Number.isNaN(cantidad) ? 1 : cantidad,
      }
    })
    .filter((pieza) => pieza.ancho > 0 && pieza.alto > 0 && pieza.cantidad > 0)

  const totales = calcularTotalesPiezas(medidas)

  const tipos = config.techos.tipos
  const tipo = tipos.find((t) => t.id === tipoId) ?? tipos[0]
  const areaPorLamina = tipo ? areaLamina(tipo) : 0

  const resultado: Result | null =
    tipo && totales.areaM2 > 0 && areaPorLamina > 0
      ? {
          precioUnitario: tipo.precioM2,
          total: calcularPrecioTotal(totales.areaM2, tipo.precioM2),
          areaM2: totales.areaM2,
          perimetroM: totales.perimetroM,
          modelo: `${tipo.largo}×${tipo.ancho} cm`,
          materiales: calcularMaterialesPorArea(totales.areaM2, areaPorLamina),
          perimetral: calcularMaterialesTecho(totales.areaM2, totales.perimetroM),
        }
      : null

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-xs font-medium text-muted-foreground">Tipo de techo</span>
        <div
          role="group"
          aria-label="Tipo de techo"
          className={`grid text-xs font-medium border border-border rounded-md overflow-hidden text-muted-foreground ${tipos.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {tipos.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tipo?.id === t.id}
              className={`px-3 py-1.5 cursor-pointer transition-colors ${tipo?.id === t.id ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
              onClick={() => setTipoId(t.id)}
            >
              {t.nombre} - {formatearMoneda(t.precioLamina)} - {formatearMoneda(t.precioM2)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium">Medidas del techo</h3>
        <p className="text-xs text-muted-foreground">
          Ingresa ancho y alto de cada pieza en metros. Para una habitación en L, usa la forma L y
          ajusta el recorte de la esquina.
        </p>
      </div>

      <div className="space-y-3">
        {piezas.map((pieza, indice) => {
          const esL = pieza.forma === "L"

          return (
            <div key={pieza.id} className="space-y-2 rounded-md border border-border p-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Pieza {indice + 1}
                </span>

                <div
                  role="group"
                  aria-label={`Forma de la pieza ${indice + 1}`}
                  className="grid grid-cols-2 overflow-hidden rounded border border-border text-[0.65rem] font-medium text-muted-foreground"
                >
                  <button
                    type="button"
                    aria-pressed={!esL}
                    className={`px-2 py-1 cursor-pointer transition-colors ${!esL ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
                    onClick={() => cambiarForma(pieza.id, "rectangulo")}
                  >
                    Rectángulo
                  </button>
                  <button
                    type="button"
                    aria-pressed={esL}
                    className={`px-2 py-1 cursor-pointer transition-colors ${esL ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
                    onClick={() => cambiarForma(pieza.id, "L")}
                  >
                    L
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_1fr_5.5rem_auto]">
                <div className="space-y-1">
                  <Label htmlFor={`ancho-${pieza.id}`} className="text-xs">Ancho (m)</Label>
                  <Input
                    id={`ancho-${pieza.id}`}
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={pieza.ancho}
                    onChange={(e) => actualizar(pieza.id, "ancho", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`alto-${pieza.id}`} className="text-xs">Alto (m)</Label>
                  <Input
                    id={`alto-${pieza.id}`}
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={pieza.alto}
                    onChange={(e) => actualizar(pieza.id, "alto", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`cantidad-${pieza.id}`} className="text-xs">Cantidad</Label>
                  <Input
                    id={`cantidad-${pieza.id}`}
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={pieza.cantidad}
                    onChange={(e) => actualizar(pieza.id, "cantidad", e.target.value)}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Eliminar pieza ${indice + 1}`}
                  onClick={() => eliminar(pieza.id)}
                >
                  <Trash2 />
                </Button>
              </div>

              {esL && (
                <div className="grid grid-cols-2 items-end gap-2 sm:grid-cols-[1fr_1fr_5.5rem_auto]">
                  <div className="space-y-1">
                    <Label htmlFor={`recorte-ancho-${pieza.id}`} className="text-xs">
                      Recorte ancho (m)
                    </Label>
                    <Input
                      id={`recorte-ancho-${pieza.id}`}
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      min="0"
                      max={pieza.ancho || undefined}
                      step="0.01"
                      value={pieza.recorteAncho}
                      onChange={(e) => actualizar(pieza.id, "recorteAncho", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`recorte-alto-${pieza.id}`} className="text-xs">
                      Recorte alto (m)
                    </Label>
                    <Input
                      id={`recorte-alto-${pieza.id}`}
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      min="0"
                      max={pieza.alto || undefined}
                      step="0.01"
                      value={pieza.recorteAlto}
                      onChange={(e) => actualizar(pieza.id, "recorteAlto", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={agregar}>
          <Plus /> Agregar pieza
        </Button>
        <Button type="button" variant="outline" onClick={limpiar}>
          Limpiar
        </Button>
      </div>

      <PlanoTecho piezas={medidas} className="mx-auto w-full max-w-md" />

      {resultado && tipo && (
        <ResultadoTecho
          resultado={resultado}
          tipo={tipo}
          modo="metro"
          cantLaminas=""
          m2={String(totales.areaM2)}
          piezas={totales.piezas}
        />
      )}
    </div>
  )
}
