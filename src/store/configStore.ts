import { create } from "zustand"
import { STORAGE_KEY, cargarConfiguracion, guardarConfiguracion } from "@/lib/formulas"
import type { Configuracion, TallaPiso, TipoTecho } from "@/types"

interface ConfigState {
  config: Configuracion
  agregarTallaPiso: (talla: Omit<TallaPiso, "id">) => void
  actualizarTallaPiso: (id: string, datos: Omit<TallaPiso, "id">) => void
  eliminarTallaPiso: (id: string) => void
  agregarTipoTecho: (tipo: Omit<TipoTecho, "id">) => void
  actualizarTipoTecho: (id: string, datos: Omit<TipoTecho, "id">) => void
  eliminarTipoTecho: (id: string) => void
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
}))

// Mantiene el estado sincronizado si la configuración cambia en otra pestaña.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (evento) => {
    if (evento.key === STORAGE_KEY) {
      useConfigStore.setState({ config: cargarConfiguracion() })
    }
  })
}
