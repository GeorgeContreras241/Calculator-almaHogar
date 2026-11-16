import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Settings } from "lucide-react"
import { ConfigTechos } from "@/components/techos/ConfigTechos"
import { CalculadoraTechoPorArea } from "@/components/techos/CalculadoraTechoPorArea"
import { CalculadoraTechoPorMedidas } from "@/components/techos/CalculadoraTechoPorMedidas"

type Vista = "area" | "medidas"

export function CalculadoraTecho() {
  const [configOpen, setConfigOpen] = useState(false)
  const [vista, setVista] = useState<Vista>("area")

  return (
    <div className="space-y-3">
      {/* selector de vista, fuera del contenedor de la calculadora */}
      {!configOpen && (
        <div
          role="group"
          aria-label="Tipo de cálculo"
          className="grid grid-cols-2 text-xs font-medium border border-border rounded-md overflow-hidden text-muted-foreground"
        >
          <button
            type="button"
            aria-pressed={vista === "area"}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${vista === "area" ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
            onClick={() => setVista("area")}
          >
            Por área
          </button>
          <button
            type="button"
            aria-pressed={vista === "medidas"}
            className={`px-3 py-1.5 cursor-pointer transition-colors ${vista === "medidas" ? "bg-foreground/10 text-foreground" : "hover:bg-foreground/5"}`}
            onClick={() => setVista("medidas")}
          >
            Por medidas
          </button>
        </div>
      )}

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
        {configOpen ? (
          <ConfigTechos />
        ) : (
          <CardContent className="space-y-4">
            {vista === "area" ? (
              <CalculadoraTechoPorArea />
            ) : (
              <CalculadoraTechoPorMedidas />
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
