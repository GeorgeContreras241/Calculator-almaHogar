import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  cargarConfiguracion,
  agregarProducto,
  eliminarProducto,
  actualizarProducto,
  formatearMoneda,
} from "../lib/formulas"
import type { Configuracion, Producto } from "../types"
import { Plus, Trash2, Edit2, Check, X, Package, Search } from "lucide-react"

export function ListaProductos() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)

  const [nombre, setNombre] = useState("")
  const [unidad, setUnidad] = useState("pieza")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")

  const [editNombre, setEditNombre] = useState("")
  const [editUnidad, setEditUnidad] = useState("")
  const [editPrecio, setEditPrecio] = useState("")
  const [editDescripcion, setEditDescripcion] = useState("")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  const productosFiltrados = config.productos?.productos?.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleAgregar = () => {
    const p = parseFloat(precio)
    if (!nombre.trim() || isNaN(p) || p < 0) return

    const nuevaConfig = agregarProducto({
      nombre: nombre.trim(),
      unidad: unidad.trim() || "pieza",
      precio: p,
      descripcion: descripcion.trim() || undefined,
    })
    setConfig(nuevaConfig)
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  const handleEliminar = (id: string) => {
    const nuevaConfig = eliminarProducto(id)
    setConfig(nuevaConfig)
  }

  const handleEditar = (producto: Producto) => {
    setEditandoId(producto.id)
    setEditNombre(producto.nombre)
    setEditUnidad(producto.unidad)
    setEditPrecio(producto.precio.toString())
    setEditDescripcion(producto.descripcion || "")
  }

  const handleGuardarEdicion = () => {
    if (!editandoId) return
    const p = parseFloat(editPrecio)
    if (!editNombre.trim() || isNaN(p) || p < 0) return

    const nuevaConfig = actualizarProducto(editandoId, {
      nombre: editNombre.trim(),
      unidad: editUnidad.trim() || "pieza",
      precio: p,
      descripcion: editDescripcion.trim() || undefined,
    })
    setConfig(nuevaConfig)
    setEditandoId(null)
  }

  const handleCancelarEdicion = () => {
    setEditandoId(null)
  }

  const limpiarFormulario = () => {
    setNombre("")
    setUnidad("pieza")
    setPrecio("")
    setDescripcion("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Productos
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              {mostrarFormulario ? "Cancelar" : "Agregar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mostrarFormulario && (
            <div className="border rounded-lg p-4 space-y-3 bg-[var(--color-muted)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="nombre-prod">Nombre *</Label>
                  <Input
                    id="nombre-prod"
                    placeholder="Ej: Silicón, Tornillo, etc."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidad-prod">Unidad</Label>
                  <select
                    id="unidad-prod"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-base shadow-sm md:text-sm"
                  >
                    <option value="pieza">Pieza</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="lt">Litro (lt)</option>
                    <option value="ml">Metro lineal (ml)</option>
                    <option value="m2">Metro cuadrado (m²)</option>
                    <option value="caja">Caja</option>
                    <option value="paquete">Paquete</option>
                    <option value="rollo">Rollo</option>
                    <option value="tubo">Tubo</option>
                    <option value="bulto">Bulto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio-prod">Precio ($) *</Label>
                  <Input
                    id="precio-prod"
                    type="number"
                    placeholder="0.00"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc-prod">Descripción (opcional)</Label>
                  <Input
                    id="desc-prod"
                    placeholder="Detalle del producto"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAgregar} className="w-full gap-1">
                <Check className="w-4 h-4" /> Guardar Producto
              </Button>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {productosFiltrados?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="w-12 h-12 mx-auto text-[var(--color-muted-foreground)] mb-2" />
            <p className="text-[var(--color-muted-foreground)]">
              {busqueda ? "No se encontraron productos" : "No hay productos registrados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {productosFiltrados.map((producto) => (
            <Card key={producto.id} className="relative">
              <CardContent className="p-4">
                {editandoId === producto.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      placeholder="Nombre"
                      className="font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={editUnidad}
                        onChange={(e) => setEditUnidad(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="pieza">Pieza</option>
                        <option value="kg">Kg</option>
                        <option value="lt">Litro</option>
                        <option value="ml">Metro lineal</option>
                        <option value="m2">m²</option>
                        <option value="caja">Caja</option>
                        <option value="paquete">Paquete</option>
                        <option value="rollo">Rollo</option>
                        <option value="tubo">Tubo</option>
                        <option value="bulto">Bulto</option>
                      </select>
                      <Input
                        type="number"
                        value={editPrecio}
                        onChange={(e) => setEditPrecio(e.target.value)}
                        placeholder="Precio"
                      />
                    </div>
                    <Input
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      placeholder="Descripción"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleGuardarEdicion} className="flex-1 gap-1">
                        <Check className="w-3 h-3" /> Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelarEdicion}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm truncate">{producto.nombre}</h3>
                        {producto.descripcion && (
                          <p className="text-xs text-[var(--color-muted-foreground)] truncate mt-0.5">
                            {producto.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditar(producto)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEliminar(producto.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[var(--color-primary)]">
                        {formatearMoneda(producto.precio)}
                      </span>
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        / {producto.unidad}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {config.productos?.productos?.length > 0 && (
        <div className="text-xs text-center text-[var(--color-muted-foreground)]">
          {config.productos.productos.length} producto(s) registrado(s)
        </div>
      )}
    </div>
  )
}
