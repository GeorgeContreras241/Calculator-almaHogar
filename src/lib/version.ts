// Detecta despliegues nuevos comparando el id de build del bundle en ejecución
// con el que publica el servidor en /version.json. Si cambió, recarga la app.

const VERSION_URL = `${import.meta.env.BASE_URL}version.json`
const VERSION_PARAM = "v"
const CHECK_INTERVAL_MS = 60_000
const RECARGA_KEY = "version-recarga"

async function obtenerVersionDesplegada(): Promise<string | null> {
  try {
    const respuesta = await fetch(`${VERSION_URL}?t=${Date.now()}`, {
      cache: "no-store",
    })
    if (!respuesta.ok) return null

    const datos = (await respuesta.json()) as { build?: unknown }
    return typeof datos.build === "string" ? datos.build : null
  } catch {
    // Sin red o sin version.json: no hay nada que comparar.
    return null
  }
}

function recargar(version: string): void {
  // Evita un bucle si el navegador sigue sirviendo el HTML viejo tras recargar.
  try {
    if (sessionStorage.getItem(RECARGA_KEY) === version) return
    sessionStorage.setItem(RECARGA_KEY, version)
  } catch {
    // sessionStorage puede no estar disponible (modo privado estricto).
  }

  // El parámetro fuerza una petición nueva del documento, saltando la caché.
  const url = new URL(window.location.href)
  url.searchParams.set(VERSION_PARAM, version)
  window.location.replace(url.toString())
}

function limpiarParametroDeVersion(): void {
  const url = new URL(window.location.href)
  if (!url.searchParams.has(VERSION_PARAM)) return

  url.searchParams.delete(VERSION_PARAM)
  window.history.replaceState(window.history.state, "", url.toString())
}

export function iniciarDeteccionDeVersion(): void {
  if (!import.meta.env.PROD) return

  limpiarParametroDeVersion()

  let comprobando = false

  const comprobar = async (): Promise<void> => {
    if (comprobando || document.visibilityState === "hidden") return
    comprobando = true

    try {
      const desplegada = await obtenerVersionDesplegada()
      if (desplegada && desplegada !== __BUILD_ID__) recargar(desplegada)
    } finally {
      comprobando = false
    }
  }

  void comprobar()

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void comprobar()
  })
  window.addEventListener("focus", () => void comprobar())
  window.setInterval(() => void comprobar(), CHECK_INTERVAL_MS)
}
