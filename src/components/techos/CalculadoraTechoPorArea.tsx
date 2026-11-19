import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  areaLamina,
  calcularMaterialesPorArea,
  calcularMaterialesTecho,
  formatearMoneda,
} from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import type { Result, TipoTecho } from "@/types"
import { ResultadoTecho } from "@/components/techos/ResultadoTecho"

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
  const areaPorLamina = areaLamina(tipo)
  if (isNaN(m) || m <= 0 || areaPorLamina <= 0) return null

  return {
    precioUnitario: tipo.precioM2,
    total: m * tipo.precioM2,
    areaM2: m,
    perimetroM: Math.sqrt(m) * 4,
    modelo,
    materiales: calcularMaterialesPorArea(m, areaPorLamina),
    perimetral: calcularMaterialesTecho(m),
  }
}

export function CalculadoraTechoPorArea() {
  const config = useConfigStore((s) => s.config)
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
    <>
      <div className={`grid text-xs font-medium border border-border rounded-md overflow-hidden text-muted-foreground ${tipos.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {tipos.map((t) => (
          <button
            key={t.id}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${tipo?.id === t.id ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
            onClick={() => setTipoId(t.id)}
          >
            {t.nombre} - {formatearMoneda(t.precioLamina)} - {formatearMoneda(t.precioM2)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 text-xs font-medium border border-border rounded-md overflow-hidden text-muted-foreground">
        <button
          className={`px-3 py-1.5 cursor-pointer transition-colors ${modo === "metro" ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
          onClick={() => { limpiar(); setModo("metro") }}
        >
          Por m²
        </button>
        <button
          className={`px-3 py-1.5 cursor-pointer transition-colors ${modo === "laminas" ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
          onClick={() => { limpiar(); setModo("laminas") }}
        >
          Por lámina
        </button>
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
        <ResultadoTecho
          resultado={resultado}
          tipo={tipo}
          modo={modo}
          cantLaminas={cantLaminas}
          m2={m2}
        />
      )}
    </>
  )
}
