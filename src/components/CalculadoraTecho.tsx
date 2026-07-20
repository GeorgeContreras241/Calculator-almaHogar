import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cargarConfiguracion, calcularMerma, formatearMoneda, formatearNumero } from "../lib/formulas"
import type { Configuracion } from "../types"
import { Calculator } from "lucide-react"

export function CalculadoraTecho() {
  const [config, setConfig] = useState<Configuracion>(cargarConfiguracion)
  const [tipoId, setTipoId] = useState("")
  const [modo, setModo] = useState<"laminas" | "metro">("laminas")
  const [cantLaminas, setCantLaminas] = useState("")
  const [area, setArea] = useState({ m2: "", merma: "10" })
  const [resultado, setResultado] = useState<{ precioUnitario: number; total: number } | null>(null)

  useEffect(() => { setConfig(cargarConfiguracion()) }, [])

  useEffect(() => {
    if (config.techos.tipos.length > 0 && !tipoId) setTipoId(config.techos.tipos[0].id)
  }, [config.techos.tipos, tipoId])

  const tipo = config.techos.tipos.find((t) => t.id === tipoId)

  const calcular = () => {
    if (!tipo) return
    if (modo === "laminas") {
      const c = parseInt(cantLaminas)
      if (isNaN(c) || c <= 0) return
      setResultado({ precioUnitario: tipo.precioLamina, total: c * tipo.precioLamina })
    } else {
      const m = parseFloat(area.m2), merma = parseFloat(area.merma)
      if (isNaN(m) || m <= 0) return
      const conMerma = calcularMerma(m, isNaN(merma) ? 0 : merma)
      setResultado({ precioUnitario: tipo.precioM2, total: conMerma * tipo.precioM2 })
    }
  }

  const limpiar = () => { setCantLaminas(""); setArea({ m2: "", merma: "10" }); setResultado(null) }

  const opciones = config.techos.tipos.map((t) => ({
    value: t.id, label: `${t.nombre} - ${formatearMoneda(t.precioLamina)}/lámina | ${formatearMoneda(t.precioM2)}/m²`
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="w-5 h-5" /> Calculadora de Techo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de techo</Label>
          <select value={tipoId} onChange={(e) => setTipoId(e.target.value)}
            className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] text-[var(--color-foreground)] px-3 py-1 text-base shadow-sm md:text-sm">
            {opciones.length === 0
              ? <option value="">No hay tipos configurados</option>
              : opciones.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 text-sm font-medium border border-gray-800 rounded-md overflow-hidden">
          <button className={`px-4 py-2 ${modo === "laminas" ? "bg-neutral-100 text-neutral-900" : ""} rounded-l-md cursor-pointer h-9`} onClick={() => setModo("laminas")}>Por lámina</button>
          <button className={`px-4 py-2 ${modo === "metro" ? "bg-neutral-100 text-neutral-900" : ""} rounded-r-md cursor-pointer h-9`} onClick={() => setModo("metro")}>Por m²</button>
        </div>

        {modo === "laminas" ? (
          <div className="space-y-2">
            <Label>Número de láminas</Label>
            <Input type="number" placeholder="0" value={cantLaminas} onChange={(e) => setCantLaminas(e.target.value)} min="0" step="1" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Área (m²)</Label>
              <Input type="number" placeholder="0" value={area.m2} onChange={(e) => setArea({ ...area, m2: e.target.value })} min="0" step="0.01" />
            </div>
            <div className="space-y-2">
              <Label>Merma (%)</Label>
              <Input type="number" placeholder="10" value={area.merma} onChange={(e) => setArea({ ...area, merma: e.target.value })} min="0" max="100" step="1" />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={calcular} className="flex-1" disabled={!tipo}>Calcular</Button>
          <Button onClick={limpiar} variant="outline">Limpiar</Button>
        </div>

        {resultado && tipo && (
          <div className="rounded-lg border border-[var(--color-border)] p-4 space-y-2 bg-[var(--color-muted)]">
            {modo === "laminas" && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Láminas:</span>
                <span className="font-medium">{cantLaminas}</span>
              </div>
            )}
            {modo === "metro" && parseFloat(area.merma) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-muted-foreground)]">Con merma ({area.merma}%):</span>
                <span className="font-medium">{formatearNumero(parseFloat(area.m2) * (1 + parseFloat(area.merma) / 100))} m²</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-muted-foreground)]">Precio unitario:</span>
              <span className="font-medium">{modo === "laminas" ? formatearMoneda(tipo.precioLamina) + "/lámina" : formatearMoneda(tipo.precioM2) + "/m²"}</span>
            </div>
            <div className="border-t border-[var(--color-border)] pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg text-[var(--color-primary)]">{formatearMoneda(resultado.total)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
