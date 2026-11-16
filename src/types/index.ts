export interface TallaPiso {
  id: string
  nombre: string
  largo: number
  ancho: number
  precioPorM2: number
}

export interface TipoTecho {
  id: string
  nombre: string
  largo: number
  ancho: number
  precioLamina: number
  precioM2: number
  m2: number
}

export type FormaPlano = "rectangulo" | "L"

// Medidas de una pieza para cálculo y dibujo (en metros).
// La forma "L" equivale al rectángulo ancho×alto menos una esquina de recorteAncho×recorteAlto.
export interface MedidaPlano {
  forma?: FormaPlano
  ancho: number
  alto: number
  recorteAncho?: number
  recorteAlto?: number
  cantidad?: number
}

export interface TotalesMedidas {
  piezas: number
  areaM2: number
  perimetroM: number
}

interface ConfigPisos { tallas: TallaPiso[] }
interface ConfigTechos { tipos: TipoTecho[] }

export interface Configuracion {
  pisos: ConfigPisos
  techos: ConfigTechos
}

export interface ResultadoCalculo {
  areaM2: number
  perimetroM?: number
}

export interface MaterialesTechoPorArea {
  laminasPVC: number
  valorMaterialBruto : number
  omegas: number
  viguetas: number
  tornillosBlancos: number
  tornillosNegros: number
}
export interface MaterialesTecho {
  perimetralPlastico?: number
  angulos?: number
}

export interface Result {
  precioUnitario: number
  total: number
  areaM2: number
  perimetroM: number
  modelo: string
  materiales?: MaterialesTechoPorArea
  perimetral?: MaterialesTecho
  valorMaterialBruto?: MaterialesTechoPorArea
}