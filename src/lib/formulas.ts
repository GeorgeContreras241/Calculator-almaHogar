import type { Configuracion, TallaPiso, TipoTecho, Producto } from '../types'

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
      { id: '1', nombre: 'Estándar', largo: 244, ancho: 122, precioLamina: 27, precioM2: 15 },
      { id: '2', nombre: 'PVC', largo: 244, ancho: 122, precioLamina: 45, precioM2: 28 },
    ],
  },
  productos: { items: [] },
}

export function cargarConfiguracion(): Configuracion {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return DEFAULT_CONFIG
    const p = JSON.parse(data)
    const viejos = p.productos?.productos || []
    return {
      pisos: p.pisos || DEFAULT_CONFIG.pisos,
      techos: p.techos || DEFAULT_CONFIG.techos,
      productos: p.productos?.items ? p.productos : { items: viejos },
    }
  } catch { return DEFAULT_CONFIG }
}

function guardarConfiguracion(config: Configuracion): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

// Pisos
export function agregarTallaPiso(t: Omit<TallaPiso, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  c.pisos.tallas.push({ ...t, id: Date.now().toString() })
  guardarConfiguracion(c); return c
}
export function eliminarTallaPiso(id: string): Configuracion {
  const c = cargarConfiguracion()
  c.pisos.tallas = c.pisos.tallas.filter((t) => t.id !== id)
  guardarConfiguracion(c); return c
}
export function actualizarTallaPiso(id: string, datos: Omit<TallaPiso, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  const i = c.pisos.tallas.findIndex((t) => t.id === id)
  if (i !== -1) c.pisos.tallas[i] = { ...datos, id }
  guardarConfiguracion(c); return c
}

// Techos
export function agregarTipoTecho(t: Omit<TipoTecho, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  c.techos.tipos.push({ ...t, id: Date.now().toString() })
  guardarConfiguracion(c); return c
}
export function eliminarTipoTecho(id: string): Configuracion {
  const c = cargarConfiguracion()
  c.techos.tipos = c.techos.tipos.filter((t) => t.id !== id)
  guardarConfiguracion(c); return c
}
export function actualizarTipoTecho(id: string, datos: Omit<TipoTecho, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  const i = c.techos.tipos.findIndex((t) => t.id === id)
  if (i !== -1) c.techos.tipos[i] = { ...datos, id }
  guardarConfiguracion(c); return c
}

// Productos (unificado)
export function agregarProducto(p: Omit<Producto, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  c.productos.items.push({ ...p, id: Date.now().toString() })
  guardarConfiguracion(c); return c
}
export function eliminarProducto(id: string): Configuracion {
  const c = cargarConfiguracion()
  c.productos.items = c.productos.items.filter((p) => p.id !== id)
  guardarConfiguracion(c); return c
}
export function actualizarProducto(id: string, datos: Omit<Producto, 'id'>): Configuracion {
  const c = cargarConfiguracion()
  const i = c.productos.items.findIndex((p) => p.id === id)
  if (i !== -1) c.productos.items[i] = { ...datos, id }
  guardarConfiguracion(c); return c
}

export function importarProductos(texto: string): Configuracion {
  const c = cargarConfiguracion()
  const lineas = texto.trim().split('\n')
  for (const linea of lineas) {
    const partes = linea.split('\t')
    if (partes.length >= 2) {
      c.productos.items.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        nombre: partes[0].trim(),
        unidad: 'pieza',
        precio: 0,
        cantidad: parseInt(partes[1]) || 0,
        vendidos: parseInt(partes[2]) || 0,
      })
    }
  }
  guardarConfiguracion(c); return c
}

// Fórmulas
export function calcularM2(largo: number, ancho: number): number { return largo * ancho }
export function calcularMerma(area: number, pct: number): number { return area * (1 + pct / 100) }
export function calcularPrecioTotal(cant: number, precio: number): number { return cant * precio }
export function formatearMoneda(v: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(v) }
export function formatearNumero(v: number): string { return Math.round(v).toString() }
