import { Home } from "lucide-react"

export const Header = () => {
    return (
        <header className="border-b border-border bg-card">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                        <Home className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Techos, Pisos & PVC</h1>
                        <p className="text-sm text-muted-foreground">Calculadora de materiales</p>
                    </div>
                </div>
            </div>
        </header>
    )
}