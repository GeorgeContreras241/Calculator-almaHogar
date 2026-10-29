import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CalculadoraPiso } from "@/components/pisos/Layoutpisos"
import { CalculadoraTecho } from "@/components/techos/Layouttechos"
import { Productos } from "@/components/Productos"
import { Calculator, Package } from "lucide-react"
import { Header } from "@/components/ui/header"

function App() {
  const [tab, setTab] = useState("calc-techo")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-2 py-2 sm:px-4 sm:py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="overflow-x-auto -mx-2 px-2 sm:-mx-4 sm:px-4">
            <TabsList className="w-full justify-start min-w-max">
              <TabsTrigger value="calc-techo" className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calcular </span>Techo
              </TabsTrigger>
              <TabsTrigger value="calc-piso" className="gap-1.5 text-xs sm:text-sm">
                <Calculator className="w-4 h-4" />
                <span className="hidden sm:inline">Calcular </span>Piso
              </TabsTrigger>
              <TabsTrigger value="productos" className="gap-1.5 text-xs sm:text-sm">
                <Package className="w-4 h-4" />
                Productos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-2 sm:mt-6">
            <TabsContent value="calc-techo"><CalculadoraTecho /></TabsContent>
            <TabsContent value="calc-piso"><CalculadoraPiso /></TabsContent>
            <TabsContent value="productos"><Productos /></TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}

export default App
