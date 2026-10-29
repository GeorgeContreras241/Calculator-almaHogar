export interface TallaPiso {
  id: string
  nombre: string
  largo: number
  ancho: number
  precioPorM2: number
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
  perimetroM?: number
}

export interface MaterialesTechoPorArea {
  laminasPVC: number
  valorMaterialBruto : number
  omegas: number
  viguetas: number
  tornillosBlancos: number
  tornillosNegros: number
}
export interface MaterialesTecho {
  perimetralPlastico?: number
  angulos?: number
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