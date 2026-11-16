import { cn } from "@/lib/utils"
import type { MedidaPlano } from "@/types"

interface PlanoTechoProps {
  piezas: MedidaPlano[]
  className?: string
}

const VIEWBOX = { ancho: 240, alto: 170 }
const MARGEN = { izquierda: 34, derecha: 14, arriba: 14, abajo: 30 }

function formatearNumero(valor: number): string {
  return String(Number(valor.toFixed(2)))
}

function formatearMedida(valor: number): string {
  return `${formatearNumero(valor)} m`
}

function limitar(valor: number | undefined, maximo: number): number {
  if (valor === undefined || !Number.isFinite(valor)) return 0
  return Math.min(Math.max(valor, 0), maximo)
}

// Escala la pieza al área disponible del SVG conservando su proporción.
function geometriaPieza({ ancho, alto }: MedidaPlano) {
  const disponibleAncho = VIEWBOX.ancho - MARGEN.izquierda - MARGEN.derecha
  const disponibleAlto = VIEWBOX.alto - MARGEN.arriba - MARGEN.abajo
  const escala = Math.min(disponibleAncho / ancho, disponibleAlto / alto)
  const w = ancho * escala
  const h = alto * escala

  return {
    x: MARGEN.izquierda + (disponibleAncho - w) / 2,
    y: MARGEN.arriba + (disponibleAlto - h) / 2,
    w,
    h,
    escala,
  }
}

// Contorno de la L: rectángulo completo menos la esquina superior derecha.
function rutaL(medida: MedidaPlano, geometria: ReturnType<typeof geometriaPieza>): string {
  const { x, y, w, h, escala } = geometria
  const recorteAncho = limitar(medida.recorteAncho, medida.ancho) * escala
  const recorteAlto = limitar(medida.recorteAlto, medida.alto) * escala

  return `M ${x} ${y} H ${x + w - recorteAncho} V ${y + recorteAlto} H ${x + w} V ${y + h} H ${x} Z`
}

function descripcion(medida: MedidaPlano): string {
  const base = `Pieza de ${formatearMedida(medida.ancho)} por ${formatearMedida(medida.alto)}`
  if (medida.forma !== "L") return base

  const recorteAncho = limitar(medida.recorteAncho, medida.ancho)
  const recorteAlto = limitar(medida.recorteAlto, medida.alto)
  return `${base} con recorte de ${formatearMedida(recorteAncho)} por ${formatearMedida(recorteAlto)}`
}

function PlanoPieza({ medida }: { medida: MedidaPlano }) {
  const { ancho, alto, cantidad = 1, forma = "rectangulo" } = medida
  const geometria = geometriaPieza(medida)
  const { x, y, w, h } = geometria
  const esL = forma === "L"

  const relleno = "fill-muted stroke-foreground/30"
  const lineaCota = "stroke-muted-foreground"
  const textoCota = "fill-muted-foreground"

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.ancho} ${VIEWBOX.alto}`}
      role="img"
      aria-label={descripcion(medida)}
      className="h-auto w-full text-foreground"
    >
      <title>{descripcion(medida)}</title>

      {esL ? (
        <path
          d={rutaL(medida, geometria)}
          strokeWidth="1"
          strokeLinejoin="round"
          className={relleno}
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="2"
          strokeWidth="1"
          className={relleno}
        />
      )}

      {cantidad > 1 && (
        <text
          x={x + w - 6}
          y={y + 13}
          textAnchor="end"
          fontSize="9"
          className={textoCota}
        >
          ×{cantidad}
        </text>
      )}

      {/* Cota horizontal (ancho total) */}
      <g className={lineaCota} strokeWidth="1">
        <line x1={x} y1={y + h + 12} x2={x + w} y2={y + h + 12} />
        <line x1={x} y1={y + h + 8} x2={x} y2={y + h + 16} />
        <line x1={x + w} y1={y + h + 8} x2={x + w} y2={y + h + 16} />
      </g>
      <text
        x={x + w / 2}
        y={y + h + 24}
        textAnchor="middle"
        fontSize="9"
        className={textoCota}
      >
        {formatearMedida(ancho)}
      </text>

      {/* Cota vertical (alto total) */}
      <g className={lineaCota} strokeWidth="1">
        <line x1={x - 12} y1={y} x2={x - 12} y2={y + h} />
        <line x1={x - 16} y1={y} x2={x - 8} y2={y} />
        <line x1={x - 16} y1={y + h} x2={x - 8} y2={y + h} />
      </g>
      <text
        x={x - 24}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        transform={`rotate(-90 ${x - 24} ${y + h / 2})`}
        className={textoCota}
      >
        {formatearMedida(alto)}
      </text>
    </svg>
  )
}

function etiqueta(medida: MedidaPlano, indice: number, total: number): string {
  const partes: string[] = []

  if (total > 1) partes.push(`Pieza ${indice + 1}`)

  if (medida.forma === "L") {
    const recorteAncho = limitar(medida.recorteAncho, medida.ancho)
    const recorteAlto = limitar(medida.recorteAlto, medida.alto)
    partes.push(
      `Recorte ${formatearNumero(recorteAncho)} × ${formatearNumero(recorteAlto)} m`
    )
  }

  return partes.join(" · ")
}

export function PlanoTecho({ piezas, className }: PlanoTechoProps) {
  const validas = piezas.filter((pieza) => pieza.ancho > 0 && pieza.alto > 0)
  if (validas.length === 0) return null

  return (
    <div
      className={cn(
        "grid gap-2",
        validas.length > 1 && "sm:grid-cols-2",
        className
      )}
    >
      {validas.map((pieza, indice) => {
        const texto = etiqueta(pieza, indice, validas.length)

        return (
          <figure key={indice} className="m-0 max-w-60 justify-self-center">
            <PlanoPieza medida={pieza} />
            {texto && (
              <figcaption className="text-center text-[0.65rem] text-muted-foreground">
                {texto}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
