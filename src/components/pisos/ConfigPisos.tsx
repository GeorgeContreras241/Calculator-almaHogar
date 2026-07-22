import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  cargarConfiguracion,
  agregarTallaPiso,
  eliminarTallaPiso,
  actualizarTallaPiso,
  formatearMoneda,
} from "@/lib/formulas"
import type { Configuracion, TallaPiso } from "@/types"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"

export function ConfigPisos() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [nombre, setNombre] = useState("")
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [precio, setPrecio] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editLargo, setEditLargo] = useState("")
  const [editAncho, setEditAncho] = useState("")
  const [editPrecio, setEditPrecio] = useState("")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  const handleAgregar = () => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const p = parseFloat(precio)
    if (!nombre.trim() || isNaN(l) || isNaN(a) || isNaN(p)) return
    if (l <= 0 || a <= 0 || p < 0) return

    const nuevaConfig = agregarTallaPiso({
      nombre: nombre.trim(),
      largo: l,
      ancho: a,
      precioPorPieza: p,
    })
    setConfig(nuevaConfig)
    setNombre("")
    setLargo("")
    setAncho("")
    setPrecio("")
  }

  const handleEliminar = (id: string) => {
    const nuevaConfig = eliminarTallaPiso(id)
    setConfig(nuevaConfig)
  }

  const handleEditar = (talla: TallaPiso) => {
    setEditandoId(talla.id)
    setEditNombre(talla.nombre)
    setEditLargo(talla.largo.toString())
    setEditAncho(talla.ancho.toString())
    setEditPrecio(talla.precioPorPieza.toString())
  }

  const handleGuardarEdicion = () => {
    if (!editandoId) return
    const l = parseFloat(editLargo)
    const a = parseFloat(editAncho)
    const p = parseFloat(editPrecio)
    if (!editNombre.trim() || isNaN(l) || isNaN(a) || isNaN(p)) return

    const nuevaConfig = actualizarTallaPiso(editandoId, {
      nombre: editNombre.trim(),
      largo: l,
      ancho: a,
      precioPorPieza: p,
    })
    setConfig(nuevaConfig)
    setEditandoId(null)
  }

  const handleCancelarEdicion = () => {
    setEditandoId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configurar Pisos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label htmlFor="nombre-piso">Nombre</Label>
            <Input
              id="nombre-piso"
              placeholder="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="largo-piso">Largo (cm)</Label>
            <Input
              id="largo-piso"
              type="number"
              placeholder="60"
              value={largo}
              onChange={(e) => setLargo(e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ancho-piso">Ancho (cm)</Label>
            <Input
              id="ancho-piso"
              type="number"
              placeholder="60"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio-piso">Precio/m² ($)</Label>
            <Input
              id="precio-piso"
              type="number"
              placeholder="85"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              min="0"
              step="1"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAgregar} className="w-full gap-1">
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        </div>

        <div className="border border-gray-800 rounded-lg divide-y divide-gray-700">
          {config.pisos.tallas.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No hay tallas configuradas
            </p>
          ) : (
            config.pisos.tallas.map((talla) => (
              <div key={talla.id} className="p-3 flex items-center gap-3 text-sm">
                {editandoId === talla.id ? (
                  <>
                    <Input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="w-40"
                      placeholder="Nombre"
                    />
                    <Input
                      type="number"
                      value={editLargo}
                      onChange={(e) => setEditLargo(e.target.value)}
                      className="w-20"
                      placeholder="Largo"
                    />
                    <span className="text-muted-foreground">×</span>
                    <Input
                      type="number"
                      value={editAncho}
                      onChange={(e) => setEditAncho(e.target.value)}
                      className="w-20"
                      placeholder="Ancho"
                    />
                    <span className="text-muted-foreground">cm - $</span>
                    <Input
                      type="number"
                      value={editPrecio}
                      onChange={(e) => setEditPrecio(e.target.value)}
                      className="w-24"
                      placeholder="Precio"
                    />
                    <Button size="icon" variant="ghost" onClick={handleGuardarEdicion}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelarEdicion}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="font-medium flex-1">{talla.nombre}</span>
                    <span className="text-muted-foreground">{talla.largo}×{talla.ancho} cm</span>
                    <span className="font-mono">{formatearMoneda(talla.precioPorPieza)}/pza</span>
                    {/* <span className="text-xs text-muted-foreground border rounded px-2 py-0.5">
                      ≈ {formatearMoneda(precioM2(talla))}/m²
                    </span> */}
                    <Button size="icon" variant="ghost" onClick={() => handleEditar(talla)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEliminar(talla.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
