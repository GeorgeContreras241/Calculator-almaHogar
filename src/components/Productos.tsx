import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { formatearMoneda } from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import { Plus, Trash2, Edit2, Check, X, Package, Search, Upload } from "lucide-react"

export function Productos() {
  const config = useConfigStore((s) => s.config)
  const agregarProducto = useConfigStore((s) => s.agregarProducto)
  const actualizarProducto = useConfigStore((s) => s.actualizarProducto)
  const eliminarProducto = useConfigStore((s) => s.eliminarProducto)
  const importarProductos = useConfigStore((s) => s.importarProductos)

  const [busqueda, setBusqueda] = useState("")
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarImport, setMostrarImport] = useState(false)
  const [textoImport, setTextoImport] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nombre: "", unidad: "pieza", precio: "" })
  const [editForm, setEditForm] = useState({ nombre: "", unidad: "", precio: "" })

  const items = (config.productos?.items || []).filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const guardar = () => {
    const p = parseFloat(form.precio)
    if (!form.nombre.trim() || isNaN(p) || p < 0) return
    agregarProducto({ nombre: form.nombre.trim(), unidad: form.unidad, precio: p, cantidad: 0, vendidos: 0 })
    setForm({ nombre: "", unidad: "pieza", precio: "" })
    setMostrarForm(false)
  }

  const guardarEdit = () => {
    if (!editId) return
    const p = parseFloat(editForm.precio)
    if (!editForm.nombre.trim() || isNaN(p) || p < 0) return
    const actual = (config.productos?.items || []).find((i) => i.id === editId)
    actualizarProducto(editId, {
      nombre: editForm.nombre.trim(), unidad: editForm.unidad, precio: p,
      cantidad: actual?.cantidad ?? 0, vendidos: actual?.vendidos ?? 0,
    })
    setEditId(null)
  }

  const importar = () => {
    if (!textoImport.trim()) return
    importarProductos(textoImport)
    setTextoImport(""); setMostrarImport(false)
  }

  const selectCls = "flex h-8 w-full rounded-md border border-input bg-background text-foreground px-2 text-sm"
  const unidadOpts = ["pieza","kg","lt","ml","m²","caja","paquete","rollo","tubo","bulto"]

  return (
    <div className="space-y-3">
      <Card className="border-border">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" /> Productos
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setMostrarImport(!mostrarImport)} className="gap-1">
                <Upload className="w-4 h-4" /> Importar
              </Button>
              <Button size="sm" onClick={() => setMostrarForm(!mostrarForm)} className="gap-1">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input aria-label="Buscar producto" placeholder="Buscar producto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="pl-9 h-9" />
          </div>

          {mostrarImport && (
            <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
              <Label htmlFor="productos-import" className="text-xs">Formato: nombre TAB unidad TAB precio</Label>
              <textarea id="productos-import" className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] font-mono" value={textoImport} onChange={(e) => setTextoImport(e.target.value)} placeholder={"silicona\tpieza\t85\ntornillo\tkg\t120"} />
              <div className="flex gap-2">
                <Button onClick={importar} size="sm">Importar</Button>
                <Button onClick={() => setMostrarImport(false)} size="sm" variant="outline">Cancelar</Button>
              </div>
            </div>
          )}

          {mostrarForm && (
            <div className="border border-border rounded-lg p-3 space-y-2 bg-card">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="producto-nombre" className="text-xs">Nombre *</Label>
                  <Input id="producto-nombre" placeholder="Producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="producto-unidad" className="text-xs">Unidad</Label>
                  <select id="producto-unidad" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} className={selectCls}>
                    {unidadOpts.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="producto-precio" className="text-xs">Precio ($) *</Label>
                  <Input id="producto-precio" type="number" placeholder="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="h-8 text-sm" min="0" step="1" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={guardar} size="sm">Guardar</Button>
                <Button onClick={() => setMostrarForm(false)} size="sm" variant="outline">Cancelar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs">Producto</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground text-xs">Unidad</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground text-xs">Precio</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground text-xs w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                    {editId === p.id ? (
                      <>
                        <td className="py-1.5 px-3"><Input value={editForm.nombre} onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} className="h-7 text-xs" aria-label="Nombre del producto" /></td>
                        <td className="py-1.5 px-2">
                          <select value={editForm.unidad} onChange={(e) => setEditForm({ ...editForm, unidad: e.target.value })} className="h-7 text-xs rounded border border-input bg-background text-foreground px-1" aria-label="Unidad del producto">
                            {unidadOpts.map((u) => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className="py-1.5 px-2"><Input type="number" value={editForm.precio} onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })} className="h-7 text-xs w-20 mx-auto" aria-label="Precio del producto" min="0" /></td>
                        <td className="py-1.5 px-2">
                          <div className="flex gap-1 justify-center">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={guardarEdit} aria-label="Guardar cambios"><Check className="w-3.5 h-3.5 text-green-500" /></Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditId(null)} aria-label="Cancelar edición"><X className="w-3.5 h-3.5 text-red-500" /></Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-3 font-medium text-sm">{p.nombre}</td>
                        <td className="py-2 px-2 text-center text-xs text-muted-foreground">{p.unidad}</td>
                        <td className="py-2 px-2 text-center font-mono text-sm font-bold text-primary">{formatearMoneda(p.precio)}</td>
                        <td className="py-2 px-2">
                          <div className="flex gap-0.5 justify-center">
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditId(p.id); setEditForm({ nombre: p.nombre, unidad: p.unidad, precio: p.precio.toString() }) }} aria-label={`Editar ${p.nombre}`}>
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => eliminarProducto(p.id)} aria-label={`Eliminar ${p.nombre}`}>
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <div className="py-6 text-center">
              <Package className="w-10 h-10 mx-auto text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">{busqueda ? "No se encontraron productos" : "No hay productos"}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
