import { CardResult } from "@/components/ui/cardResult"
import { formatearMoneda } from "@/lib/formulas"
import type { Result, TipoTecho } from "@/types"

interface ResultadoTechoProps {
  resultado: Result
  tipo: TipoTecho
  modo: "laminas" | "metro"
  cantLaminas: string
  m2: string
}

export function ResultadoTecho({ resultado, tipo, modo, cantLaminas, m2 }: ResultadoTechoProps) {
  return (
    <div className="rounded-lg border border-border p-3 space-y-1 bg-muted text-sm">
      <div className="flex justify-between items-center">
        <div className="font-medium text-foreground border-b border-border pb-1 mb-1">
          Resumen - {tipo.nombre}
        </div>
        {modo === "metro" && (
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
      <CardResult title="Precio">
        {formatearMoneda(resultado.precioUnitario)}/{modo === "laminas" ? "lámina" : "m²"}
      </CardResult>

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
  )
}
