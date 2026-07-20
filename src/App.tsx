import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { ConfigPisos } from "./components/ConfigPisos"
import { ConfigTechos } from "./components/ConfigTechos"
import { CalculadoraPiso } from "./components/CalculadoraPiso"
import { CalculadoraTecho } from "./components/CalculadoraTecho"
import { ListaProductos } from "./components/ListaProductos"
import { Inventario } from "./components/Inventario"
import { Settings, Calculator, Home, Package, Box } from "lucide-react"
import './App.css'

function App() {
  const [tab, setTab] = useState("calc-piso")

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-foreground)]">Techos, Pisos & PVC</h1>
              <p className="text-sm text-[var(--color-muted-foreground)]">Calculadora de materiales</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="w-full justify-start min-w-max">
              <TabsTrigger value="calc-piso" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calcular </span>Piso
              </TabsTrigger>
              <TabsTrigger value="calc-techo" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calcular </span>Techo
              </TabsTrigger>
              <TabsTrigger value="inventario" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Box className="w-4 h-4" />
                Inventario
              </TabsTrigger>
              <TabsTrigger value="productos" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Package className="w-4 h-4" />
                Precios
              </TabsTrigger>
              <TabsTrigger value="config-piso" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Config </span>Pisos
              </TabsTrigger>
              <TabsTrigger value="config-techo" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Config </span>Techos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="calc-piso" currentValue={tab}>
              <CalculadoraPiso />
            </TabsContent>
            <TabsContent value="calc-techo" currentValue={tab}>
              <CalculadoraTecho />
            </TabsContent>
            <TabsContent value="inventario" currentValue={tab}>
              <Inventario />
            </TabsContent>
            <TabsContent value="productos" currentValue={tab}>
              <ListaProductos />
            </TabsContent>
            <TabsContent value="config-piso" currentValue={tab}>
              <ConfigPisos />
            </TabsContent>
            <TabsContent value="config-techo" currentValue={tab}>
              <ConfigTechos />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default App
