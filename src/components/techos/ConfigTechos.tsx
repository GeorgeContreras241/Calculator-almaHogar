import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { areaLamina, formatearMoneda } from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import type { TipoTecho } from "@/types"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"

const campo = "h-8 text-sm"

export function ConfigTechos() {
  const config = useConfigStore((s) => s.config)
  const agregarTipoTecho = useConfigStore((s) => s.agregarTipoTecho)
  const actualizarTipoTecho = useConfigStore((s) => s.actualizarTipoTecho)
  const eliminarTipoTecho = useConfigStore((s) => s.eliminarTipoTecho)

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

  const handleAgregar = () => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const pl = parseFloat(precioLamina)
    const pm = parseFloat(precioM2)
    if (!nombre.trim() || isNaN(l) || isNaN(a) || isNaN(pl) || isNaN(pm)) return
    if (l <= 0 || a <= 0 || pl < 0 || pm < 0) return

    agregarTipoTecho({
      nombre: nombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
    })
    setNombre("")
    setLargo("")
    setAncho("")
    setPrecioLamina("")
    setPrecioM2("")
  }

  const handleEliminar = (id: string) => {
    if (editandoId === id) setEditandoId(null)
    eliminarTipoTecho(id)
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
    if (l <= 0 || a <= 0 || pl < 0 || pm < 0) return

    actualizarTipoTecho(editandoId, {
      nombre: editNombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
    })
    setEditandoId(null)
  }

  return (
    <CardContent className="space-y-3 p-2 pt-0 sm:p-4 sm:pt-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label htmlFor="nombre-techo" className="text-xs">Nombre</Label>
          <Input id="nombre-techo" className={campo} placeholder="Ej: 30cm" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="largo-techo" className="text-xs">Largo (cm)</Label>
          <Input id="largo-techo" className={campo} type="number" placeholder="595" value={largo} onChange={(e) => setLargo(e.target.value)} min="1" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="ancho-techo" className="text-xs">Ancho (cm)</Label>
          <Input id="ancho-techo" className={campo} type="number" placeholder="30" value={ancho} onChange={(e) => setAncho(e.target.value)} min="1" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="precio-lamina" className="text-xs">$/lámina</Label>
          <Input id="precio-lamina" className={campo} type="number" placeholder="27000" value={precioLamina} onChange={(e) => setPrecioLamina(e.target.value)} min="0" step="1" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="precio-m2-techo" className="text-xs">$/m²</Label>
          <Input id="precio-m2-techo" className={campo} type="number" placeholder="23000" value={precioM2} onChange={(e) => setPrecioM2(e.target.value)} min="0" step="1" />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAgregar} size="sm" className="w-full h-8 gap-1">
            <Plus className="w-3.5 h-3.5" /> Agregar
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-md divide-y divide-border">
        {config.techos.tipos.length === 0 ? (
          <p className="p-3 text-xs text-muted-foreground text-center">
            No hay tipos de techo configurados
          </p>
        ) : (
          config.techos.tipos.map((tipo) => (
            <div key={tipo.id} className="px-2 py-1.5 flex items-center gap-2 text-sm flex-wrap">
              {editandoId === tipo.id ? (
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 w-full">
                  <Input className="h-7 text-xs" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} placeholder="Nombre" aria-label="Nombre del techo" />
                  <Input className="h-7 text-xs" type="number" value={editLargo} onChange={(e) => setEditLargo(e.target.value)} placeholder="Largo" aria-label="Largo en centímetros" min="1" />
                  <Input className="h-7 text-xs" type="number" value={editAncho} onChange={(e) => setEditAncho(e.target.value)} placeholder="Ancho" aria-label="Ancho en centímetros" min="1" />
                  <Input className="h-7 text-xs" type="number" value={editPrecioLamina} onChange={(e) => setEditPrecioLamina(e.target.value)} placeholder="$ Lámina" aria-label="Precio por lámina" min="0" />
                  <Input className="h-7 text-xs" type="number" value={editPrecioM2} onChange={(e) => setEditPrecioM2(e.target.value)} placeholder="$ m²" aria-label="Precio por metro cuadrado" min="0" />
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleGuardarEdicion} aria-label="Guardar cambios">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditandoId(null)} aria-label="Cancelar edición">
                      <X className="w-3.5 h-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="font-medium flex-1 min-w-[80px]">{tipo.nombre}</span>
                  <span className="text-muted-foreground text-xs">{tipo.largo}×{tipo.ancho} cm</span>
                  <span className="font-mono text-xs border border-border rounded px-1.5 py-0.5">
                    {formatearMoneda(tipo.precioLamina)}/lámina
                  </span>
                  <span className="font-mono text-xs border border-border rounded px-1.5 py-0.5">
                    {formatearMoneda(tipo.precioM2)}/m²
                  </span>
                  <span className="font-mono text-xs border border-border rounded px-1.5 py-0.5">
                    {areaLamina(tipo).toFixed(2)} m²/lámina
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditar(tipo)} aria-label={`Editar ${tipo.nombre}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEliminar(tipo.id)} aria-label={`Eliminar ${tipo.nombre}`}>
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
  )
}
