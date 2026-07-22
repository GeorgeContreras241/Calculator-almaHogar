import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalculadoraPiso } from "@/components/pisos/Layoutpisos"
import { CalculadoraTecho } from "@/components/techos/Layouttechos"
import { Productos } from "@/components/Productos"
import { Calculator, Package } from "lucide-react"
import { Header } from "@/components/ui/header"

function App() {
  const [tab, setTab] = useState("calc-piso")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

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
              <TabsTrigger value="productos" currentValue={tab} onValueChange={setTab} className="gap-1.5 text-xs sm:text-sm">
                <Package className="w-4 h-4" />
                Productos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="calc-piso" currentValue={tab}><CalculadoraPiso /></TabsContent>
            <TabsContent value="calc-techo" currentValue={tab}><CalculadoraTecho /></TabsContent>
            <TabsContent value="productos" currentValue={tab}><Productos /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default App
