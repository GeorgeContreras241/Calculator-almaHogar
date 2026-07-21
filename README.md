# Techos, Pisos & PVC

Calculadora de materiales para instalación de techos, pisos y PVC. Permite calcular láminas, omegas, viguetas, tornillos, perimetral y costos por proyecto.

## Características

- **Calculadora de Piso** — por medida (largo × ancho) o directo en m², con precio por pieza
- **Calculadora de Techo** — por lámina o por m², con materiales (láminas PVC, ómegas, viguetas, tornillos, chazos) y perimetral
- **Catálogo de Productos** — lista de productos con precios, búsqueda, importación y edición
- **Configuración inline** — agregar/editar/eliminar tallas de piso y tipos de techo directo desde cada calculadora
- **Persistencia** — toda la configuración se guarda automáticamente en `localStorage`
- **Dark mode** — tema oscuro nativo, optimizado para uso en móvil

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4
- Lucide React (iconos)

## Instalación

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Estructura

```
src/
├── components/
│   ├── pisos/
│   │   ├── CalculadoraPiso.tsx    # Calculadora de piso con config inline
│   │   ├── ConfigPisos.tsx        # Configuración de tallas y precios
│   │   └── Layoutpisos.tsx
│   ├── CalculadoraTecho.tsx       # Calculadora de techo con config inline
│   ├── ConfigTechos.tsx           # Configuración de tipos y precios
│   ├── Productos.tsx              # Catálogo de productos
│   └── ui/                        # Componentes base (Button, Card, Input, etc.)
├── lib/
│   ├── formulas.ts                # Funciones de cálculo y persistencia
│   └── utils.ts                   # Utilidades
├── types/
│   └── index.ts                   # Definiciones de tipos
├── App.tsx                        # Layout principal con tabs
└── main.tsx
```
