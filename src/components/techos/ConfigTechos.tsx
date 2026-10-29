import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatearMoneda } from "@/lib/formulas"
import { useConfigStore } from "@/store/configStore"
import type { TipoTecho } from "@/types"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"

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
  const [m2, setM2] = useState("")
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState("")
  const [editLargo, setEditLargo] = useState("")
  const [editAncho, setEditAncho] = useState("")
  const [editPrecioLamina, setEditPrecioLamina] = useState("")
  const [editPrecioM2, setEditPrecioM2] = useState("")
  const [editM2, setEditM2] = useState("")

  const handleAgregar = () => {
    const l = parseFloat(largo)
    const a = parseFloat(ancho)
    const pl = parseFloat(precioLamina)
    const pm = parseFloat(precioM2)
    const m = parseFloat(m2)
    if (!nombre.trim() || isNaN(l) || isNaN(a) || isNaN(pl) || isNaN(pm) || isNaN(m)) return
    if (l <= 0 || a <= 0 || pl < 0 || pm < 0 || m <= 0) return

    agregarTipoTecho({
      nombre: nombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
      m2: m,
    })
    setNombre("")
    setLargo("")
    setAncho("")
    setPrecioLamina("")
    setPrecioM2("")
    setM2("")
  }

  const handleEliminar = (id: string) => {
    eliminarTipoTecho(id)
  }

  const handleEditar = (tipo: TipoTecho) => {
    setEditandoId(tipo.id)
    setEditNombre(tipo.nombre)
    setEditLargo(tipo.largo.toString())
    setEditAncho(tipo.ancho.toString())
    setEditPrecioLamina(tipo.precioLamina.toString())
    setEditPrecioM2(tipo.precioM2.toString())
    setEditM2(tipo.m2.toString())
  }

  const handleGuardarEdicion = () => {
    if (!editandoId) return
    const l = parseFloat(editLargo)
    const a = parseFloat(editAncho)
    const pl = parseFloat(editPrecioLamina)
    const pm = parseFloat(editPrecioM2)
    const m = parseFloat(editM2)
    if (!editNombre.trim() || isNaN(l) || isNaN(a) || isNaN(pl) || isNaN(pm) || isNaN(m)) return
    if (l <= 0 || a <= 0 || pl < 0 || pm < 0 || m <= 0) return

    actualizarTipoTecho(editandoId, {
      nombre: editNombre.trim(),
      largo: l,
      ancho: a,
      precioLamina: pl,
      precioM2: pm,
      m2: m,
    })
    setEditandoId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Configurar Techos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
          <div className="space-y-2">
            <Label htmlFor="nombre-techo">Nombre</Label>
            <Input id="nombre-techo" placeholder="Ej: Estándar" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="largo-techo">Largo lámina (cm)</Label>
            <Input id="largo-techo" type="number" placeholder="244" value={largo} onChange={(e) => setLargo(e.target.value)} min="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ancho-techo">Ancho lámina (cm)</Label>
            <Input id="ancho-techo" type="number" placeholder="122" value={ancho} onChange={(e) => setAncho(e.target.value)} min="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio-lamina">Precio lámina ($)</Label>
            <Input id="precio-lamina" type="number" placeholder="27" value={precioLamina} onChange={(e) => setPrecioLamina(e.target.value)} min="0" step="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio-m2-techo">Precio m² ($)</Label>
            <Input id="precio-m2-techo" type="number" placeholder="15" value={precioM2} onChange={(e) => setPrecioM2(e.target.value)} min="0" step="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m2-lamina">m² por lámina</Label>
            <Input id="m2-lamina" type="number" placeholder="1.8" value={m2} onChange={(e) => setM2(e.target.value)} min="0.01" step="0.01" />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAgregar} className="w-full gap-1">
              <Plus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg divide-y divide-border">
          {config.techos.tipos.length === 0 ? (
            <p className="p-2 sm:p-4 text-sm text-muted-foreground text-center">
              No hay tipos de techo configurados
            </p>
          ) : (
            config.techos.tipos.map((tipo) => (
              <div key={tipo.id} className="p-2 sm:p-3 flex items-center gap-2 text-sm flex-wrap">
                {editandoId === tipo.id ? (
                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 w-full">
                    <Input value={editNombre} onChange={(e) => setEditNombre(e.target.value)} placeholder="Nombre" aria-label="Nombre del techo" />
                    <Input type="number" value={editLargo} onChange={(e) => setEditLargo(e.target.value)} placeholder="Largo" aria-label="Largo en centímetros" min="1" />
                    <Input type="number" value={editAncho} onChange={(e) => setEditAncho(e.target.value)} placeholder="Ancho" aria-label="Ancho en centímetros" min="1" />
                    <Input type="number" value={editPrecioLamina} onChange={(e) => setEditPrecioLamina(e.target.value)} placeholder="$ Lámina" aria-label="Precio por lámina" min="0" />
                    <Input type="number" value={editPrecioM2} onChange={(e) => setEditPrecioM2(e.target.value)} placeholder="$ m²" aria-label="Precio por metro cuadrado" min="0" />
                    <Input type="number" value={editM2} onChange={(e) => setEditM2(e.target.value)} placeholder="m²/lámina" aria-label="Metros cuadrados por lámina" min="0.01" step="0.01" />
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={handleGuardarEdicion} aria-label="Guardar cambios">
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-9 w-9" onClick={() => setEditandoId(null)} aria-label="Cancelar edición">
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-medium flex-1 min-w-[80px]">{tipo.nombre}</span>
                    <span className="text-muted-foreground text-xs">{tipo.largo}×{tipo.ancho}</span>
                    <span className="font-mono text-xs border border-border rounded px-2 py-0.5">
                      {formatearMoneda(tipo.precioLamina)}/lámina
                    </span>
                    <span className="font-mono text-xs border border-border rounded px-2 py-0.5">
                      {formatearMoneda(tipo.precioM2)}/m²
                    </span>
                    <span className="font-mono text-xs border border-border rounded px-2 py-0.5">
                      {tipo.m2} m²/lámina
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
    </Card>
  )
}
