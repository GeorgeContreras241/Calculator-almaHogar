import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  cargarConfiguracion,
  agregarItemInventario,
  eliminarItemInventario,
  actualizarItemInventario,
  registrarVenta,
  restante,
  importarInventario,
  formatearNumero,
} from "../lib/formulas"
import type { Configuracion, ItemInventario } from "../types"
import { Plus, Trash2, Edit2, Check, X, Package, Search, Upload, ShoppingCart } from "lucide-react"

type FiltroTipo = "todos" | "agotados" | "bajos" | "completos"

export function Inventario() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [busqueda, setBusqueda] = useState("")
  const [filtro, setFiltro] = useState<FiltroTipo>("todos")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarImportar, setMostrarImportar] = useState(false)
  const [textoImportar, setTextoImportar] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [ventaId, setVentaId] = useState<string | null>(null)
  const [cantidadVenta, setCantidadVenta] = useState("")

  const [nombre, setNombre] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [vendidos, setVendidos] = useState("")

  const [editNombre, setEditNombre] = useState("")
  const [editCantidad, setEditCantidad] = useState("")
  const [editVendidos, setEditVendidos] = useState("")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  const itemsFiltrados = (config.inventario?.items || []).filter((item) => {
    const coincideBusqueda = item.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const rest = restante(item)
    switch (filtro) {
      case "agotados": return coincideBusqueda && rest === 0
      case "bajos": return coincideBusqueda && rest > 0 && rest <= 3
      case "completos": return coincideBusqueda && item.vendidos === 0
      default: return coincideBusqueda
    }
  })

  const totalStock = (config.inventario?.items || []).reduce((sum, item) => sum + item.cantidad, 0)
  const totalVendidos = (config.inventario?.items || []).reduce((sum, item) => sum + item.vendidos, 0)
  const totalRestante = totalStock - totalVendidos
  const totalAgotados = (config.inventario?.items || []).filter((i) => restante(i) === 0).length

  const handleAgregar = () => {
    const c = parseInt(cantidad)
    const v = parseInt(vendidos) || 0
    if (!nombre.trim() || isNaN(c) || c < 0) return

    const nuevaConfig = agregarItemInventario({
      nombre: nombre.trim(),
      cantidad: c,
      vendidos: v,
    })
    setConfig(nuevaConfig)
    setNombre("")
    setCantidad("")
    setVendidos("")
    setMostrarFormulario(false)
  }

  const handleEliminar = (id: string) => {
    const nuevaConfig = eliminarItemInventario(id)
    setConfig(nuevaConfig)
  }

  const handleEditar = (item: ItemInventario) => {
    setEditandoId(item.id)
    setEditNombre(item.nombre)
    setEditCantidad(item.cantidad.toString())
    setEditVendidos(item.vendidos.toString())
  }

  const handleGuardarEdit = () => {
    if (!editandoId) return
    const c = parseInt(editCantidad)
    const v = parseInt(editVendidos)
    if (!editNombre.trim() || isNaN(c)) return

    const nuevaConfig = actualizarItemInventario(editandoId, {
      nombre: editNombre.trim(),
      cantidad: c,
      vendidos: v,
    })
    setConfig(nuevaConfig)
    setEditandoId(null)
  }

  const handleVender = (id: string) => {
    const cant = parseInt(cantidadVenta)
    if (isNaN(cant) || cant <= 0) return

    const nuevaConfig = registrarVenta(id, cant)
    setConfig(nuevaConfig)
    setVentaId(null)
    setCantidadVenta("")
  }

  const handleImport = () => {
    if (!textoImportar.trim()) return
    const nuevaConfig = importarInventario(textoImportar)
    setConfig(nuevaConfig)
    setTextoImportar("")
    setMostrarImportar(false)
  }

  return (
    <div className="space-y-3">
      <Card className="border-[var(--color-border)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventario
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setMostrarImportar(!mostrarImportar)} variant="outline" className="gap-1">
                <Upload className="w-4 h-4" /> Importar
              </Button>
              <Button size="sm" onClick={() => setMostrarFormulario(!mostrarFormulario)} className="gap-1">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setFiltro("todos")}
              className={`rounded-lg p-2 text-center transition-colors cursor-pointer border ${
                filtro === "todos"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-primary)]"
                  : "bg-[var(--color-card)] text-[var(--color-card-foreground)] border-[var(--color-border)] hover:bg-[var(--color-muted)]"
              }`}
            >
              <p className="text-lg font-bold">{formatearNumero(totalStock)}</p>
              <p className="text-[10px] opacity-80">Total</p>
            </button>
            <button
              onClick={() => setFiltro("todos")}
              className={`rounded-lg p-2 text-center transition-colors cursor-pointer border ${
                filtro === "todos"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-primary)]"
                  : "bg-[var(--color-card)] text-[var(--color-card-foreground)] border-[var(--color-border)] hover:bg-[var(--color-muted)]"
              }`}
            >
              <p className="text-lg font-bold">{formatearNumero(totalVendidos)}</p>
              <p className="text-[10px] opacity-80">Vendidos</p>
            </button>
            <button
              onClick={() => setFiltro("todos")}
              className={`rounded-lg p-2 text-center transition-colors cursor-pointer border ${
                filtro === "todos"
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-[var(--color-primary)]"
                  : "bg-[var(--color-card)] text-[var(--color-card-foreground)] border-[var(--color-border)] hover:bg-[var(--color-muted)]"
              }`}
            >
              <p className="text-lg font-bold">{formatearNumero(totalRestante)}</p>
              <p className="text-[10px] opacity-80">Restante</p>
            </button>
            <button
              onClick={() => setFiltro("agotados")}
              className={`rounded-lg p-2 text-center transition-colors cursor-pointer border ${
                filtro === "agotados"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-[var(--color-card)] text-[var(--color-card-foreground)] border-[var(--color-border)] hover:bg-[var(--color-muted)]"
              }`}
            >
              <p className="text-lg font-bold">{totalAgotados}</p>
              <p className="text-[10px] opacity-80">Agotados</p>
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <Input placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9 h-9" />
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={filtro === "bajos" ? "default" : "outline"}
                onClick={() => setFiltro(filtro === "bajos" ? "todos" : "bajos")}
                className="h-9 px-2 text-xs"
              >
                Bajos
              </Button>
              <Button
                size="sm"
                variant={filtro === "completos" ? "default" : "outline"}
                onClick={() => setFiltro(filtro === "completos" ? "todos" : "completos")}
                className="h-9 px-2 text-xs"
              >
                Sin venta
              </Button>
            </div>
          </div>

          {mostrarImportar && (
            <div className="border border-[var(--color-border)] rounded-lg p-3 space-y-2 bg-[var(--color-card)]">
              <Label className="text-xs">Formato: nombre TAB cantidad TAB vendidos</Label>
              <textarea
                className="flex w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm shadow-sm min-h-[100px] font-mono"
                value={textoImportar}
                onChange={(e) => setTextoImportar(e.target.value)}
                placeholder={"rollo 90558\t10\t0\nsilicona\t72\t3\nWPC NEGRA\t10\t4"}
              />
              <div className="flex gap-2">
                <Button onClick={handleImport} size="sm">Importar</Button>
                <Button onClick={() => setMostrarImportar(false)} size="sm" variant="outline">Cancelar</Button>
              </div>
            </div>
          )}

          {mostrarFormulario && (
            <div className="border border-[var(--color-border)] rounded-lg p-3 space-y-2 bg-[var(--color-card)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input placeholder="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} className="h-9" />
                <Input type="number" placeholder="Cantidad *" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="0" className="h-9" />
                <Input type="number" placeholder="Vendidos" value={vendidos} onChange={(e) => setVendidos(e.target.value)} min="0" className="h-9" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAgregar} size="sm">Guardar</Button>
                <Button onClick={() => setMostrarFormulario(false)} size="sm" variant="outline">Cancelar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[var(--color-border)]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/50">
                  <th className="text-left py-2 px-3 font-medium text-[var(--color-muted-foreground)] text-xs">Producto</th>
                  <th className="text-center py-2 px-2 font-medium text-[var(--color-muted-foreground)] text-xs">Total</th>
                  <th className="text-center py-2 px-2 font-medium text-[var(--color-muted-foreground)] text-xs">Vendidos</th>
                  <th className="text-center py-2 px-2 font-medium text-[var(--color-muted-foreground)] text-xs">Restante</th>
                  <th className="text-center py-2 px-2 font-medium text-[var(--color-muted-foreground)] text-xs w-28"></th>
                </tr>
              </thead>
              <tbody>
                {itemsFiltrados.map((item) => {
                  const rest = restante(item)
                  const porcentaje = item.cantidad > 0 ? (item.vendidos / item.cantidad) * 100 : 0
                  return (
                    <tr key={item.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-muted)]/30 transition-colors">
                      {editandoId === item.id ? (
                        <>
                          <td className="py-1.5 px-3">
                            <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} className="h-8 text-sm" />
                          </td>
                          <td className="py-1.5 px-2">
                            <Input type="number" value={editCantidad} onChange={(e) => setEditCantidad(e.target.value)} className="h-8 text-sm w-16 mx-auto" />
                          </td>
                          <td className="py-1.5 px-2">
                            <Input type="number" value={editVendidos} onChange={(e) => setEditVendidos(e.target.value)} className="h-8 text-sm w-16 mx-auto" />
                          </td>
                          <td className="py-1.5 px-2 text-center text-xs">-</td>
                          <td className="py-1.5 px-2">
                            <div className="flex gap-1 justify-center">
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleGuardarEdit}>
                                <Check className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditandoId(null)}>
                                <X className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-3">
                            <span className="font-medium text-sm">{item.nombre}</span>
                          </td>
                          <td className="py-2 px-2 text-center text-sm font-mono">{item.cantidad}</td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-sm font-mono">{item.vendidos}</span>
                            {porcentaje > 0 && (
                              <div className="w-full bg-[var(--color-muted)] rounded-full h-1 mt-1">
                                <div
                                  className="h-1 rounded-full"
                                  style={{
                                    width: `${Math.min(porcentaje, 100)}%`,
                                    backgroundColor: porcentaje >= 100 ? '#22c55e' : porcentaje > 50 ? '#eab308' : '#3b82f6',
                                  }}
                                />
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {rest === 0 ? (
                              <span className="text-xs font-medium text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">Agotado</span>
                            ) : (
                              <span className="text-sm font-mono font-bold">{rest}</span>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {ventaId === item.id ? (
                              <div className="flex gap-1 justify-center items-center">
                                <Input
                                  type="number"
                                  placeholder="#"
                                  className="h-7 w-14 text-xs"
                                  value={cantidadVenta}
                                  onChange={(e) => setCantidadVenta(e.target.value)}
                                  min="1"
                                />
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleVender(item.id)}>
                                  <Check className="w-4 h-4 text-green-500" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setVentaId(null)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-0.5 justify-center">
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditar(item)}>
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setVentaId(item.id); setCantidadVenta("") }} disabled={rest <= 0}>
                                  <ShoppingCart className="w-3.5 h-3.5" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEliminar(item.id)}>
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {itemsFiltrados.length === 0 && (
            <div className="py-6 text-center">
              <Package className="w-10 h-10 mx-auto text-[var(--color-muted-foreground)] mb-2 opacity-50" />
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {busqueda ? "No se encontraron productos" : "No hay productos en inventario"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
