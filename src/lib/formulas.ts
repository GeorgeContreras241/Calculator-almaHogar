import type { Configuracion, MaterialesTechoPorArea, MaterialesTecho, MedidaPlano, TallaPiso, TotalesMedidas } from '@/types'

export const STORAGE_KEY = 'techos-pisos-config'

const DEFAULT_CONFIG: Configuracion = {
  pisos: {
    tallas: [
      { id: '1', nombre: 'Techo L', largo: 60, ancho: 60, precioPorM2: 54000 },
      { id: '2', nombre: 'Techo XL', largo: 80, ancho: 80, precioPorM2: 55000 },
    ],
  },
  techos: {
    tipos: [
      { id: '1', nombre: 'Techo 30cm', largo: 595, ancho: 30, precioLamina: 27000, precioM2: 23000, m2: 1.8 },
      { id: '2', nombre: 'Techo 25cm', largo: 595, ancho: 25, precioLamina: 25000, precioM2: 21000, m2: 1.5 },
    ],
  },
}

interface ConfiguracionGuardada {
  pisos?: { tallas?: unknown }
  techos?: { tipos?: unknown }
}

function esArreglo<T>(valor: unknown): valor is T[] {
  return Array.isArray(valor)
}

function configuracionPorDefecto(): Configuracion {
  return structuredClone(DEFAULT_CONFIG)
}

type TallaPisoGuardada = Partial<TallaPiso> & { precioPorPieza?: number }

// Compatibilidad: versiones anteriores guardaban el precio por m² como precioPorPieza.
function migrarTallaPiso(talla: TallaPisoGuardada): TallaPiso {
  const { precioPorPieza, ...resto } = talla
  return {
    ...(resto as TallaPiso),
    precioPorM2: talla.precioPorM2 ?? precioPorPieza ?? 0,
  }
}

export function cargarConfiguracion(): Configuracion {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return configuracionPorDefecto()

    const guardada = JSON.parse(data) as ConfiguracionGuardada
    const porDefecto = configuracionPorDefecto()

    const tallasGuardadas = guardada.pisos?.tallas
    const tiposGuardados = guardada.techos?.tipos

    return {
      pisos: {
        tallas: esArreglo<TallaPisoGuardada>(tallasGuardadas)
          ? tallasGuardadas.map(migrarTallaPiso)
          : porDefecto.pisos.tallas,
      },
      techos: {
        tipos: esArreglo<Configuracion['techos']['tipos'][number]>(tiposGuardados)
          ? tiposGuardados
          : porDefecto.techos.tipos,
      },
    }
  } catch {
    return configuracionPorDefecto()
  }
}

export function guardarConfiguracion(config: Configuracion): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  } catch (error) {
    console.error('No se pudo guardar la configuración', error)
  }
}

export const calcularMaterialesPorArea = (m2: number, areaPorLaminaPVC: number): MaterialesTechoPorArea => {
  if (m2 <= 0 || areaPorLaminaPVC <= 0) {
    return {
      laminasPVC: 0,
      valorMaterialBruto: 0,
      omegas: 0,
      viguetas: 0,
      tornillosBlancos: 0,
      tornillosNegros: 0,
    }
  }

  const laminasPVC = Math.ceil(m2 / areaPorLaminaPVC)
  const tornillosBlancos = laminasPVC * 10

  return {
    laminasPVC,
    valorMaterialBruto: m2 / areaPorLaminaPVC,
    omegas: m2 / 2,
    viguetas: (m2 / 2) / 2,
    tornillosBlancos,
    tornillosNegros: tornillosBlancos / 2,
  }
}

export function calcularMaterialesTecho(
  area: number
): MaterialesTecho {
  const perimetro = Math.sqrt(area) * 4
  return {
    perimetralPlastico: perimetro / 5.95,
    angulos: perimetro / 2.44,
  }
}

// Fórmulas
export function calcularM2(largo: number, ancho: number): number { return largo * ancho }
export function calcularPrecioTotal(cantidad: number, precioUnitario: number): number {
  return cantidad * precioUnitario
}

// Convierte el área a piezas completas según las medidas de la pieza (en cm).
export function calcularPiezasPiso(areaM2: number, largoCm: number, anchoCm: number): number {
  const areaPieza = (largoCm / 100) * (anchoCm / 100)
  if (areaM2 <= 0 || areaPieza <= 0) return 0
  return Math.ceil(areaM2 / areaPieza)
}

function limitar(valor: number | undefined, maximo: number): number {
  if (valor === undefined || !Number.isFinite(valor)) return 0
  return Math.min(Math.max(valor, 0), maximo)
}

// Perímetro exterior de un rectángulo con una esquina recortada (L).
// Si el recorte ocupa una dimensión completa, la figura degenera en un rectángulo menor.
function perimetroForma(
  ancho: number,
  alto: number,
  recorteAncho: number,
  recorteAlto: number
): number {
  if (recorteAncho <= 0 || recorteAlto <= 0) return 2 * (ancho + alto)
  if (recorteAncho >= ancho && recorteAlto >= alto) return 0
  if (recorteAncho >= ancho) return 2 * (ancho + alto - recorteAlto)
  if (recorteAlto >= alto) return 2 * (ancho + alto - recorteAncho)
  return 2 * (ancho + alto)
}

// Suma área y perímetro de varias piezas (medidas en metros).
// Las filas con medidas o cantidad inválidas se ignoran.
export function calcularTotalesPiezas(piezas: MedidaPlano[]): TotalesMedidas {
  return piezas.reduce<TotalesMedidas>(
    (totales, pieza) => {
      const { ancho, alto, cantidad = 1 } = pieza
      if (!(ancho > 0) || !(alto > 0) || !(cantidad > 0)) return totales

      const esL = pieza.forma === "L"
      const recorteAncho = esL ? limitar(pieza.recorteAncho, ancho) : 0
      const recorteAlto = esL ? limitar(pieza.recorteAlto, alto) : 0
      const area = Math.max(0, ancho * alto - recorteAncho * recorteAlto)

      return {
        piezas: totales.piezas + cantidad,
        areaM2: totales.areaM2 + area * cantidad,
        perimetroM:
          totales.perimetroM +
          perimetroForma(ancho, alto, recorteAncho, recorteAlto) * cantidad,
      }
    },
    { piezas: 0, areaM2: 0, perimetroM: 0 }
  )
}

export function formatearMoneda(v: number): string { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v) }
export function formatearNumero(v: number): string { return Math.round(v).toString() }
