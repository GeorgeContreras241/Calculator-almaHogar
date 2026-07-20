import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  cargarConfiguracion,
  agregarTipoTecho,
  eliminarTipoTecho,
  actualizarTipoTecho,
  formatearMoneda,
} from "../lib/formulas"
import type { Configuracion, TipoTecho } from "../types"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"

export function ConfigTechos() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [nombre, setNombre] = useState("")
  const [largo, setLargo] = useState("")
  const [ancho, setAncho] = useState("")
  const [precioM2, setPrecioM2] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editLargo, setEditLargo] = useState("")
  const [editAncho, setEditAncho] = useState("")
  const [editPrecioM2, setEditPrecioM2] = useState("")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  const handleAgregar = () => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const p = parseFloat(precioM2)
    if (!nombre.trim() || isNaN(l) || isNaN(a) || isNaN(p)) return
    if (l <= 0 || a <= 0 || p < 0) return

    const nuevaConfig = agregarTipoTecho({
      nombre: nombre.trim(),
      largo: l,
      ancho: a,
      precioM2: p,
    })
    setConfig(nuevaConfig)
    setNombre("")
    setLargo("")
    setAncho("")
    setPrecioM2("")
  }

  const handleEliminar = (id: string) => {
    const nuevaConfig = eliminarTipoTecho(id)
    setConfig(nuevaConfig)
  }

  const handleEditar = (tipo: TipoTecho) => {
    setEditandoId(tipo.id)
    setEditNombre(tipo.nombre)
    setEditLargo(tipo.largo.toString())
    setEditAncho(tipo.ancho.toString())
    setEditPrecioM2(tipo.precioM2.toString())
  }

  const handleGuardarEdicion = () => {
    if (!editandoId) return
    const l = parseFloat(editLargo)
    const a = parseFloat(editAncho)
    const p = parseFloat(editPrecioM2)
    if (!editNombre.trim() || isNaN(l) || isNaN(a) || isNaN(p)) return

    const nuevaConfig = actualizarTipoTecho(editandoId, {
      nombre: editNombre.trim(),
      largo: l,
      ancho: a,
      precioM2: p,
    })
    setConfig(nuevaConfig)
    setEditandoId(null)
  }

  const handleCancelarEdicion = () => {
    setEditandoId(null)
  }

  const precioPorLamina = (tipo: TipoTecho) => {
    return (tipo.largo * tipo.ancho / 10000) * tipo.precioM2
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configurar Techos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label htmlFor="nombre-techo">Nombre</Label>
            <Input
              id="nombre-techo"
              placeholder="Ej: Estándar"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="largo-techo">Largo lámina (cm)</Label>
            <Input
              id="largo-techo"
              type="number"
              placeholder="244"
              value={largo}
              onChange={(e) => setLargo(e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ancho-techo">Ancho lámina (cm)</Label>
            <Input
              id="ancho-techo"
              type="number"
              placeholder="122"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio-techo">Precio por m² ($)</Label>
            <Input
              id="precio-techo"
              type="number"
              placeholder="35"
              value={precioM2}
              onChange={(e) => setPrecioM2(e.target.value)}
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

        <div className="border rounded-lg divide-y">
          {config.techos.tipos.length === 0 ? (
            <p className="p-4 text-sm text-[var(--color-muted-foreground)] text-center">
              No hay tipos de techo configurados
            </p>
          ) : (
            config.techos.tipos.map((tipo) => (
              <div key={tipo.id} className="p-3 flex items-center gap-3 text-sm">
                {editandoId === tipo.id ? (
                  <>
                    <Input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="w-32"
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
                      value={editPrecioM2}
                      onChange={(e) => setEditPrecioM2(e.target.value)}
                      className="w-24"
                      placeholder="Precio/m²"
                    />
                    <span className="text-xs text-muted-foreground">/m²</span>
                    <Button size="icon" variant="ghost" onClick={handleGuardarEdicion}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelarEdicion}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="font-medium flex-1">{tipo.nombre}</span>
                    <span className="text-muted-foreground">{tipo.largo}×{tipo.ancho}</span>
                    <span className="font-mono">{formatearMoneda(tipo.precioM2)}/m²</span>
                    <span className="text-xs text-muted-foreground border rounded px-2 py-0.5">
                      {formatearMoneda(precioPorLamina(tipo))}/lámina
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => handleEditar(tipo)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEliminar(tipo.id)}>
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
