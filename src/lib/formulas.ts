import type { Configuracion, TallaPiso, TipoTecho, Producto, ItemInventario } from '../types'

const STORAGE_KEY = 'techos-pisos-config'

const DEFAULT_CONFIG: Configuracion = {
  pisos: {
    tallas: [
      { id: '1', nombre: '60x60 cm', largo: 60, ancho: 60, precioPorPieza: 85 },
      { id: '2', nombre: '80x80 cm', largo: 80, ancho: 80, precioPorPieza: 120 },
      { id: '3', nombre: '100x100 cm', largo: 100, ancho: 100, precioPorPieza: 180 },
    ],
  },
  techos: {
    tipos: [
      { id: '1', nombre: 'Estándar', largo: 244, ancho: 122, precioM2: 35 },
      { id: '2', nombre: 'PVC', largo: 244, ancho: 122, precioM2: 55 },
    ],
  },
  productos: {
    productos: [],
  },
  inventario: {
    items: [],
  },
}

export function cargarConfiguracion(): Configuracion {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return DEFAULT_CONFIG
    const parsed = JSON.parse(data)
    return {
      pisos: parsed.pisos || DEFAULT_CONFIG.pisos,
      techos: parsed.techos || DEFAULT_CONFIG.techos,
      productos: parsed.productos || { productos: [] },
      inventario: parsed.inventario || { items: [] },
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function guardarConfiguracion(config: Configuracion): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function agregarTallaPiso(talla: Omit<TallaPiso, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const nuevaTalla: TallaPiso = {
    ...talla,
    id: Date.now().toString(),
  }
  config.pisos.tallas.push(nuevaTalla)
  guardarConfiguracion(config)
  return config
}

export function eliminarTallaPiso(id: string): Configuracion {
  const config = cargarConfiguracion()
  config.pisos.tallas = config.pisos.tallas.filter((t) => t.id !== id)
  guardarConfiguracion(config)
  return config
}

export function actualizarTallaPiso(id: string, datos: Omit<TallaPiso, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const index = config.pisos.tallas.findIndex((t) => t.id === id)
  if (index !== -1) {
    config.pisos.tallas[index] = { ...datos, id }
  }
  guardarConfiguracion(config)
  return config
}

export function agregarTipoTecho(tipo: Omit<TipoTecho, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const nuevoTipo: TipoTecho = {
    ...tipo,
    id: Date.now().toString(),
  }
  config.techos.tipos.push(nuevoTipo)
  guardarConfiguracion(config)
  return config
}

export function eliminarTipoTecho(id: string): Configuracion {
  const config = cargarConfiguracion()
  config.techos.tipos = config.techos.tipos.filter((t) => t.id !== id)
  guardarConfiguracion(config)
  return config
}

export function actualizarTipoTecho(id: string, datos: Omit<TipoTecho, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const index = config.techos.tipos.findIndex((t) => t.id === id)
  if (index !== -1) {
    config.techos.tipos[index] = { ...datos, id }
  }
  guardarConfiguracion(config)
  return config
}

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(valor)
}

export function formatearNumero(valor: number): string {
  return Math.round(valor).toString()
}

export function calcularM2(largo: number, ancho: number): number {
  return largo * ancho
}

export function calcularMerma(areaM2: number, mermaPorcentaje: number): number {
  return areaM2 * (1 + mermaPorcentaje / 100)
}

export function calcularPiezasNecesarias(areaTotal: number, largoPieza: number, anchoPieza: number): number {
  const areaPiezaM2 = (largoPieza * anchoPieza) / 10000
  if (areaPiezaM2 === 0) return 0
  return Math.ceil(areaTotal / areaPiezaM2)
}

export function calcularPrecioTotal(piezas: number, precioPorPieza: number): number {
  return piezas * precioPorPieza
}

export function calcularPrecioLaminas(laminas: number, largoLamina: number, anchoLamina: number, precioM2: number): number {
  const areaLaminaM2 = (largoLamina * anchoLamina) / 10000
  return laminas * areaLaminaM2 * precioM2
}

export function agregarProducto(producto: Omit<Producto, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const nuevoProducto: Producto = {
    ...producto,
    id: Date.now().toString(),
  }
  config.productos.productos.push(nuevoProducto)
  guardarConfiguracion(config)
  return config
}

export function eliminarProducto(id: string): Configuracion {
  const config = cargarConfiguracion()
  config.productos.productos = config.productos.productos.filter((p) => p.id !== id)
  guardarConfiguracion(config)
  return config
}

export function actualizarProducto(id: string, datos: Omit<Producto, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const index = config.productos.productos.findIndex((p) => p.id === id)
  if (index !== -1) {
    config.productos.productos[index] = { ...datos, id }
  }
  guardarConfiguracion(config)
  return config
}

export function agregarItemInventario(item: Omit<ItemInventario, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const nuevoItem: ItemInventario = {
    ...item,
    id: Date.now().toString(),
  }
  config.inventario.items.push(nuevoItem)
  guardarConfiguracion(config)
  return config
}

export function eliminarItemInventario(id: string): Configuracion {
  const config = cargarConfiguracion()
  config.inventario.items = config.inventario.items.filter((i) => i.id !== id)
  guardarConfiguracion(config)
  return config
}

export function actualizarItemInventario(id: string, datos: Omit<ItemInventario, 'id'>): Configuracion {
  const config = cargarConfiguracion()
  const index = config.inventario.items.findIndex((i) => i.id === id)
  if (index !== -1) {
    config.inventario.items[index] = { ...datos, id }
  }
  guardarConfiguracion(config)
  return config
}

export function registrarVenta(id: string, cantidad: number): Configuracion {
  const config = cargarConfiguracion()
  const item = config.inventario.items.find((i) => i.id === id)
  if (item) {
    item.vendidos = Math.min(item.vendidos + cantidad, item.cantidad)
  }
  guardarConfiguracion(config)
  return config
}

export function restante(item: ItemInventario): number {
  return item.cantidad - item.vendidos
}

export function importarInventario(texto: string): Configuracion {
  const lineas = texto.trim().split('\n')
  const config = cargarConfiguracion()
  const nuevosItems: ItemInventario[] = []

  for (const linea of lineas) {
    const partes = linea.split('\t')
    if (partes.length >= 4) {
      const nombre = partes[0].trim()
      const cantidad = parseInt(partes[1]) || 0
      const vendidos = parseInt(partes[2]) || 0
      if (nombre) {
        nuevosItems.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
          nombre,
          cantidad,
          vendidos,
        })
      }
    }
  }

  config.inventario.items = [...config.inventario.items, ...nuevosItems]
  guardarConfiguracion(config)
  return config
}
