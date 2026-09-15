export interface TallaPiso {
  id: string
  nombre: string
  largo: number
  ancho: number
  precioPorPieza: number
}

export interface TipoTecho {
  id: string
  nombre: string
  largo: number
  ancho: number
  precioLamina: number
  precioM2: number
  m2: number
}

export interface Producto {
  id: string
  nombre: string
  unidad: string
  precio: number
  cantidad: number
  vendidos: number
}

interface ConfigPisos { tallas: TallaPiso[] }
interface ConfigTechos { tipos: TipoTecho[] }
interface ConfigProductos { items: Producto[] }

export interface Configuracion {
  pisos: ConfigPisos
  techos: ConfigTechos
  productos: ConfigProductos

}

export interface ResultadoCalculo {
  areaM2: number
  precioTotal?: number
  perimetroM?: number
}

export interface MaterialesTechoPorArea {
  laminasPVC: number
  valorMaterialBruto : number
  omegas: number
  viguetas: number
  tornillosEstructura: number
  tornillosPVC: number
  chazosTecho: number
}
export interface MaterialesTecho {
  perimetralPlastico?: number
  angulos?: number
  chazosPared?: number
}

export interface Result {
  precioUnitario: number
  total: number
  areaM2: number
  perimetroM: number
  modelo: string
  materiales?: MaterialesTechoPorArea
  perimetral?: MaterialesTecho
  valorMaterialBruto?: MaterialesTechoPorArea
}