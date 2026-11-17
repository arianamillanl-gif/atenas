export type CatalogService = { id: string; name: string; vertice: string; familia: string }

export const SERVICE_CATALOG: CatalogService[] = [
  { id: 'SRV-CONS-ERP', name: 'Consultoría ERP – Fase I', vertice: 'Consultoría y Tecnología', familia: 'Implementación' },
  { id: 'SRV-LIC-CLOUD', name: 'Licencia SaaS Atenas Cloud', vertice: 'Tecnología', familia: 'Licenciamiento' },
  { id: 'SRV-SOP-ANUAL', name: 'Soporte y Mantenimiento Anual', vertice: 'Tecnología', familia: 'Soporte recurrente' },
  { id: 'SRV-AUD-FISC', name: 'Auditoría Fiscal Preventiva', vertice: 'Asesoría Tributaria', familia: 'Cumplimiento' },
  { id: 'SRV-CAP-INC', name: 'Capacitación In-Company', vertice: 'Formación Corporativa', familia: 'Capacitación' },
  { id: 'SRV-OUT-CONT', name: 'Outsourcing Contable Mensual', vertice: 'Servicios Contables', familia: 'Outsourcing' },
]

export const SALES_REPS = ['María González', 'Carlos Méndez', 'Andrea Salazar', 'Luis Rivas', 'Daniela Ortega']
export const FRAMEWORK_CONTRACTS = ['CM-2025-014 · Delta 360 Servicios Integrales', 'CM-2024-087 · Grupo Delta Corporativo', 'CM-2026-003 · Acuerdo Marco Tecnología']
export const PROVIDERS = ['Nexo Cloud Partners, C.A.', 'Sistemas Andinos 2020, S.A.', 'Formarte Consultores', 'TaxPro Auditores Asociados']

export type PaymentTerms = {
  modalidad: 'Contado' | 'Cuotas' | 'Recurrente'
  periodicidad: 'Única' | 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual'
  cuotas: number
  moneda: 'USD' | 'VES' | 'EUR'
  iva: 'Gravado 16%' | 'Exento' | 'Exonerado'
  retencion: 'Sin retención' | 'IVA 75%' | 'IVA 100%' | 'ISLR 2%'
  politica: 'Tasa BCV del día de pago' | 'Tasa BCV de emisión' | 'Tasa fija contractual'
  inicio: string
}

export type ServiceLine = {
  id: string
  serviceId: string
  operacion: '' | 'Venta Nueva' | 'Renovación'
  valor: 'Vendido' | 'Abonado'
  monto: string
  comision: boolean
  subcontratado: boolean
  proveedor: string
  subModo: 'monto' | 'pct'
  subValor: string
  expanded: boolean
  pago: PaymentTerms
}

export const defaultTerms = (): PaymentTerms => ({ modalidad: 'Contado', periodicidad: 'Única', cuotas: 1, moneda: 'USD', iva: 'Gravado 16%', retencion: 'Sin retención', politica: 'Tasa BCV del día de pago', inicio: '2026-11-15' })

export const emptyLine = (): ServiceLine => ({ id: crypto.randomUUID(), serviceId: '', operacion: '', valor: 'Vendido', monto: '', comision: true, subcontratado: false, proveedor: '', subModo: 'pct', subValor: '', expanded: true, pago: defaultTerms() })

export const INITIAL_LINES: ServiceLine[] = [
  { id: 'l1', serviceId: 'SRV-CONS-ERP', operacion: 'Venta Nueva', valor: 'Vendido', monto: '1797.00', comision: true, subcontratado: false, proveedor: '', subModo: 'pct', subValor: '', expanded: true, pago: { ...defaultTerms(), modalidad: 'Cuotas', periodicidad: 'Mensual', cuotas: 3 } },
  { id: 'l2', serviceId: 'SRV-LIC-CLOUD', operacion: 'Renovación', valor: 'Vendido', monto: '450.00', comision: false, subcontratado: true, proveedor: 'Nexo Cloud Partners, C.A.', subModo: 'pct', subValor: '35', expanded: false, pago: { ...defaultTerms(), retencion: 'IVA 75%' } },
  { id: 'l3', serviceId: 'SRV-CAP-INC', operacion: 'Venta Nueva', valor: 'Abonado', monto: '0.00', comision: false, subcontratado: false, proveedor: '', subModo: 'pct', subValor: '', expanded: false, pago: defaultTerms() },
]

export const parseAmount = (value: string) => {
  const n = Number.parseFloat(value.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

const usd = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const fmt = (value: number) => usd.format(value)
export const fmtUsd = (value: number) => `$${usd.format(value)}`
