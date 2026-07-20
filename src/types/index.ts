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
}

export interface Producto {
  id: string
  nombre: string
  unidad: string
  precio: number
  descripcion?: string
}

export interface ItemInventario {
  id: string
  nombre: string
  cantidad: number
  vendidos: number
}

export interface ConfigPisos {
  tallas: TallaPiso[]
}

export interface ConfigTechos {
  tipos: TipoTecho[]
}

export interface ConfigProductos {
  productos: Producto[]
}

export interface ConfigInventario {
  items: ItemInventario[]
}

export interface Configuracion {
  pisos: ConfigPisos
  techos: ConfigTechos
  productos: ConfigProductos
  inventario: ConfigInventario
}

export interface Dimensiones {
  largo: number
  ancho: number
}

export interface ResultadoCalculo {
  areaM2: number
  piezasNecesarias?: number
  areaTotalCubierta?: number
  precioTotal?: number
}
