# Techos, Pisos & PVC

Calculadora de materiales para instalación de techos, pisos y PVC. Permite calcular láminas, omegas, viguetas, tornillos, perimetral y costos por proyecto.

## Características

- **Calculadora de Piso** — por medida (largo × ancho) o directo en m², con precio por m² y número de piezas necesarias
- **Calculadora de Techo** — por lámina o por m², con materiales (láminas PVC, ómegas, viguetas, tornillos, chazos) y perimetral
- **Catálogo de Productos** — lista de productos con precios, búsqueda, importación y edición
- **Configuración inline** — agregar/editar/eliminar tallas de piso y tipos de techo directo desde cada calculadora
- **Persistencia** — toda la configuración se guarda automáticamente en `localStorage` y se sincroniza entre pestañas
- **Dark mode** — tema oscuro nativo, optimizado para uso en móvil

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4
- Zustand (estado global)
- Lucide React (iconos)

## Instalación

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Estructura

```
src/
├── components/
│   ├── pisos/
│   │   ├── Layoutpisos.tsx        # Calculadora de piso con config inline
│   │   └── ConfigPisos.tsx        # Configuración de tallas y precios
│   ├── techos/
│   │   ├── Layouttechos.tsx       # Calculadora de techo con config inline
│   │   └── ConfigTechos.tsx       # Configuración de tipos y precios
│   ├── Productos.tsx              # Catálogo de productos
│   └── ui/                        # Componentes base (Button, Card, Input, Tabs, etc.)
├── lib/
│   ├── formulas.ts                # Cálculos y persistencia en localStorage
│   └── utils.ts                   # Utilidades
├── store/
│   └── configStore.ts             # Estado global (Zustand) y acciones sobre la configuración
├── types/
│   └── index.ts                   # Definiciones de tipos
├── App.tsx                        # Layout principal con tabs
└── main.tsx
```
