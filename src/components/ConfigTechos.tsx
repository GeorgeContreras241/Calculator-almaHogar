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
  const [precioLamina, setPrecioLamina] = useState("")
  const [precioM2, setPrecioM2] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editLargo, setEditLargo] = useState("")
  const [editAncho, setEditAncho] = useState("")
  const [editPrecioLamina, setEditPrecioLamina] = useState("")
  const [editPrecioM2, setEditPrecioM2] = useState("")

  useEffect(() => {
    setConfig(cargarConfiguracion())
  }, [])

  const handleAgregar = () => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const pl = parseFloat(precioLamina)
    const pm = parseFloat(precioM2)
    if (!nombre.trim() || isNaN(l) || isNaN(a) || isNaN(pl) || isNaN(pm)) return
    if (l <= 0 || a <= 0 || pl < 0 || pm < 0) return

    const nuevaConfig = agregarTipoTecho({
      nombre: nombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
    })
    setConfig(nuevaConfig)
    setNombre("")
    setLargo("")
    setAncho("")
    setPrecioLamina("")
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
    setEditPrecioLamina(tipo.precioLamina.toString())
    setEditPrecioM2(tipo.precioM2.toString())
  }

  const handleGuardarEdicion = () => {
    if (!editandoId) return
    const l = parseFloat(editLargo)
    const a = parseFloat(editAncho)
    const pl = parseFloat(editPrecioLamina)
    const pm = parseFloat(editPrecioM2)
    if (!editNombre.trim() || isNaN(l) || isNaN(a) || isNaN(pl) || isNaN(pm)) return

    const nuevaConfig = actualizarTipoTecho(editandoId, {
      nombre: editNombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
    })
    setConfig(nuevaConfig)
    setEditandoId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configurar Techos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input placeholder="Ej: Estándar" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Largo lámina (cm)</Label>
            <Input type="number" placeholder="244" value={largo} onChange={(e) => setLargo(e.target.value)} min="1" />
          </div>
          <div className="space-y-2">
            <Label>Ancho lámina (cm)</Label>
            <Input type="number" placeholder="122" value={ancho} onChange={(e) => setAncho(e.target.value)} min="1" />
          </div>
          <div className="space-y-2">
            <Label>Precio lámina ($)</Label>
            <Input type="number" placeholder="27" value={precioLamina} onChange={(e) => setPrecioLamina(e.target.value)} min="0" step="1" />
          </div>
          <div className="space-y-2">
            <Label>Precio m² ($)</Label>
            <Input type="number" placeholder="15" value={precioM2} onChange={(e) => setPrecioM2(e.target.value)} min="0" step="1" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAgregar} className="w-full gap-1">
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        </div>

        <div className="border border-[var(--color-border)] rounded-lg divide-y divide-[var(--color-border)]">
          {config.techos.tipos.length === 0 ? (
            <p className="p-4 text-sm text-[var(--color-muted-foreground)] text-center">
              No hay tipos de techo configurados
            </p>
          ) : (
            config.techos.tipos.map((tipo) => (
              <div key={tipo.id} className="p-3 flex items-center gap-2 text-sm flex-wrap">
                {editandoId === tipo.id ? (
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 w-full">
                    <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} placeholder="Nombre" />
                    <Input type="number" value={editLargo} onChange={(e) => setEditLargo(e.target.value)} placeholder="Largo" />
                    <Input type="number" value={editAncho} onChange={(e) => setEditAncho(e.target.value)} placeholder="Ancho" />
                    <Input type="number" value={editPrecioLamina} onChange={(e) => setEditPrecioLamina(e.target.value)} placeholder="$ Lámina" />
                    <Input type="number" value={editPrecioM2} onChange={(e) => setEditPrecioM2(e.target.value)} placeholder="$ m²" />
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={handleGuardarEdicion}>
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditandoId(null)}>
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-medium flex-1 min-w-[80px]">{tipo.nombre}</span>
                    <span className="text-[var(--color-muted-foreground)] text-xs">{tipo.largo}×{tipo.ancho}</span>
                    <span className="font-mono text-xs border border-[var(--color-border)] rounded px-2 py-0.5">
                      {formatearMoneda(tipo.precioLamina)}/lámina
                    </span>
                    <span className="font-mono text-xs border border-[var(--color-border)] rounded px-2 py-0.5">
                      {formatearMoneda(tipo.precioM2)}/m²
                    </span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditar(tipo)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEliminar(tipo.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
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
