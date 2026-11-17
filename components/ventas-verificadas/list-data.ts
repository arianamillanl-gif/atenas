import { SALES_REPS, SERVICE_CATALOG } from './data'

export type ConditionStatus = 'Sin Condiciones' | 'En Borrador' | 'Por aprobar' | 'Vigente' | 'Rechazada'
export type IntegrationStatus = 'Pendiente' | 'Sincronizado' | 'Error'
export type CxcStatus = 'No iniciada' | 'En preparación' | 'Lista para generar' | 'Generada' | 'Bloqueada'

export type ListSale = {
  ref: string
  client: string
  unit: string
  services: string[]
  date: string
  isoDate: string
  amount: number
  rep: string
  condition: ConditionStatus
  integration: IntegrationStatus
  cxc: CxcStatus
}

const CLIENTS: [string, string][] = [
  ['Distribuidora Inmarket, C.A', 'Consultoría y Tecnología'],
  ['Inversiones Delta 360, C.A.', 'Consultoría y Tecnología'],
  ['Empresa Alfa C.A.', 'Tecnología'],
  ['Distribuidora Orinoco, S.A.', 'Asesoría Tributaria'],
  ['Farmacias Caribe, C.A.', 'Servicios Contables'],
  ['Constructora Ávila 21', 'Formación Corporativa'],
  ['Alimentos Los Andes, C.A.', 'Servicios Contables'],
  ['Grupo Mercantil Zulia', 'Asesoría Tributaria'],
  ['Transporte Guayana Express', 'Tecnología'],
  ['Clínica Santa Paula, C.A.', 'Consultoría y Tecnología'],
  ['Seguros La Previsora Sur', 'Formación Corporativa'],
  ['Textiles Margarita, S.A.', 'Servicios Contables'],
]

const SCRIPTED: Partial<Record<number, ConditionStatus>> = { 2: 'En Borrador', 4: 'Vigente', 5: 'Por aprobar', 7: 'En Borrador', 9: 'Vigente', 11: 'Rechazada', 14: 'En Borrador', 18: 'Vigente' }

const CXC_BY_CONDITION: Record<ConditionStatus, CxcStatus> = {
  'Sin Condiciones': 'No iniciada',
  'En Borrador': 'En preparación',
  'Por aprobar': 'Lista para generar',
  Vigente: 'Generada',
  Rechazada: 'Bloqueada',
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildSales(): ListSale[] {
  const rand = seeded(85)
  const start = Date.UTC(2026, 10, 14)
  return Array.from({ length: 151 }, (_, i) => {
    const [client, unit] = i === 0 ? CLIENTS[0] : CLIENTS[1 + Math.floor(rand() * (CLIENTS.length - 1))]
    const condition = SCRIPTED[i] ?? 'Sin Condiciones'
    const day = new Date(start - Math.floor(i * 0.9) * 86400000)
    const isoDate = day.toISOString().slice(0, 10)
    const serviceCount = condition === 'Sin Condiciones' ? 0 : 1 + Math.floor(rand() * 3)
    const firstService = (i * 5 + 3) % SERVICE_CATALOG.length
    return {
      ref: i === 0 ? '33505745' : String(33505745 - i * 37 - Math.floor(rand() * 30)),
      client,
      unit,
      services: Array.from({ length: serviceCount }, (_, k) => SERVICE_CATALOG[(firstService + k) % SERVICE_CATALOG.length].name),
      date: isoDate.split('-').reverse().join('/'),
      isoDate,
      amount: i === 0 ? 2397 : Math.round((800 + rand() * 48000) * 100) / 100,
      rep: SALES_REPS[i === 0 ? 0 : Math.floor(rand() * SALES_REPS.length)],
      condition,
      integration: condition === 'Vigente' ? 'Sincronizado' : 'Pendiente',
      cxc: CXC_BY_CONDITION[condition],
    }
  })
}

export const LIST_SALES = buildSales()

export const findSale = (ref: string) => LIST_SALES.find((sale) => sale.ref === ref)
