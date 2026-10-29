import { create } from "zustand"
import { STORAGE_KEY, cargarConfiguracion, guardarConfiguracion } from "@/lib/formulas"
import type { Configuracion, Producto, TallaPiso, TipoTecho } from "@/types"

interface ConfigState {
  config: Configuracion
  agregarTallaPiso: (talla: Omit<TallaPiso, "id">) => void
  actualizarTallaPiso: (id: string, datos: Omit<TallaPiso, "id">) => void
  eliminarTallaPiso: (id: string) => void
  agregarTipoTecho: (tipo: Omit<TipoTecho, "id">) => void
  actualizarTipoTecho: (id: string, datos: Omit<TipoTecho, "id">) => void
  eliminarTipoTecho: (id: string) => void
  agregarProducto: (producto: Omit<Producto, "id">) => void
  actualizarProducto: (id: string, datos: Omit<Producto, "id">) => void
  eliminarProducto: (id: string) => void
  importarProductos: (texto: string) => void
}

type GuardarEstado = (parcial: { config: Configuracion }) => void

function crearId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Guarda en localStorage y actualiza el estado: una sola salida para toda mutación.
function guardarYActualizar(guardar: GuardarEstado, config: Configuracion): void {
  guardarConfiguracion(config)
  guardar({ config })
}

// Formato: nombre TAB unidad TAB precio (2 columnas: nombre TAB precio).
function parsearProductos(texto: string): Producto[] {
  return texto
    .trim()
    .split("\n")
    .map((linea) => linea.split("\t").map((parte) => parte.trim()))
    .filter((partes) => partes[0] && partes.length >= 2 && partes[0].toLowerCase() !== "nombre")
    .map((partes) => {
      const tieneUnidad = partes.length >= 3
      const precio = parseFloat(tieneUnidad ? partes[2] : partes[1])

      return {
        id: crearId(),
        nombre: partes[0],
        unidad: (tieneUnidad ? partes[1] : "") || "pieza",
        precio: Number.isNaN(precio) ? 0 : precio,
        cantidad: 0,
        vendidos: 0,
      }
    })
}

export const useConfigStore = create<ConfigState>()((set, get) => ({
  config: cargarConfiguracion(),

  // Pisos
  agregarTallaPiso: (talla) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      pisos: {
        tallas: [...config.pisos.tallas, { ...talla, id: crearId() }],
      },
    })
  },

  actualizarTallaPiso: (id, datos) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      pisos: {
        tallas: config.pisos.tallas.map((talla) =>
          talla.id === id ? { ...datos, id } : talla
        ),
      },
    })
  },

  eliminarTallaPiso: (id) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      pisos: {
        tallas: config.pisos.tallas.filter((talla) => talla.id !== id),
      },
    })
  },

  // Techos
  agregarTipoTecho: (tipo) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      techos: {
        tipos: [...config.techos.tipos, { ...tipo, id: crearId() }],
      },
    })
  },

  actualizarTipoTecho: (id, datos) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      techos: {
        tipos: config.techos.tipos.map((tipo) =>
          tipo.id === id ? { ...datos, id } : tipo
        ),
      },
    })
  },

  eliminarTipoTecho: (id) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      techos: {
        tipos: config.techos.tipos.filter((tipo) => tipo.id !== id),
      },
    })
  },

  // Productos
  agregarProducto: (producto) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      productos: {
        items: [...config.productos.items, { ...producto, id: crearId() }],
      },
    })
  },

  actualizarProducto: (id, datos) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      productos: {
        items: config.productos.items.map((producto) =>
          producto.id === id ? { ...datos, id } : producto
        ),
      },
    })
  },

  eliminarProducto: (id) => {
    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      productos: {
        items: config.productos.items.filter((producto) => producto.id !== id),
      },
    })
  },

  importarProductos: (texto) => {
    const nuevos = parsearProductos(texto)
    if (nuevos.length === 0) return

    const { config } = get()
    guardarYActualizar(set, {
      ...config,
      productos: {
        items: [...config.productos.items, ...nuevos],
      },
    })
  },
}))

// Mantiene el estado sincronizado si la configuración cambia en otra pestaña.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (evento) => {
    if (evento.key === STORAGE_KEY) {
      useConfigStore.setState({ config: cargarConfiguracion() })
    }
  })
}
