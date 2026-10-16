import { CalendarX2, FilePlus2, type LucideIcon } from 'lucide-react'

import type { AuditEvent } from '../TraceabilityDrawer'

export const TODAY = '2026-10-16'
export const MIN_REASON = 20
export const CURRENT_USER = { name: 'María González', role: 'Administradora' }

export const ASSIGNMENT_TYPES = ['Principal', 'Secundaria', 'Especial'] as const
export type AssignmentType = (typeof ASSIGNMENT_TYPES)[number]

export type CanonicalClient = { id: string; name: string; rif: string; initials: string }
export type Portfolio = { id: string; name: string; owner: string }

export type Assignment = {
  id: string
  clientId: string
  portfolioId: string
  type: AssignmentType
  from: string
  to: string | null
  author: string
  createdAt: string
  reason: string
  closeReason?: string
}

export type AssignmentEvent = AuditEvent & { clientId: string; assignmentId: string }

export type AssignmentDraft = {
  clientId: string
  portfolioId: string
  type: AssignmentType
  from: string
  to: string
  reason: string
}

export type DraftErrors = Partial<Record<keyof AssignmentDraft, string>>

export const clients: CanonicalClient[] = [
  { id: 'CLI-2026-0089', name: 'CONSTRUCTORA DEL LLANO C.A.', rif: 'J-30567812-4', initials: 'AC' },
  { id: 'CLI-2026-0102', name: 'INVERSIONES ORINOCO 2020 C.A.', rif: 'J-41208833-0', initials: 'IO' },
  { id: 'CLI-2026-0117', name: 'DISTRIBUIDORA ANDINA S.A.', rif: 'J-29874410-7', initials: 'DA' },
  { id: 'CLI-2026-0124', name: 'TECNOLOGÍAS DEL CARIBE C.A.', rif: 'J-50033218-2', initials: 'TC' },
  { id: 'CLI-2026-0131', name: 'AGROPECUARIA LOS SAMANES C.A.', rif: 'J-31766540-9', initials: 'AS' },
]

export const portfolios: Portfolio[] = [
  { id: 'CRT-001', name: 'Cartera Corporativa West', owner: 'Andrea Rivas' },
  { id: 'CRT-002', name: 'Cartera Industrial Centro', owner: 'Carlos Méndez' },
  { id: 'CRT-003', name: 'Cartera Pymes Oriente', owner: 'Gabriela Torres' },
  { id: 'CRT-004', name: 'Cartera Grandes Cuentas', owner: 'Andrea Rivas' },
  { id: 'CRT-005', name: 'Cartera Sector Público', owner: 'José Paredes' },
]

export const initialAssignments: Assignment[] = [
  { id: 'ASG-2026-0089', clientId: 'CLI-2026-0089', portfolioId: 'CRT-001', type: 'Principal', from: '2024-07-01', to: null, author: 'María González', createdAt: '2024-07-01', reason: 'Crecimiento de facturación anual; se traslada a gestión corporativa con ejecutivo dedicado.' },
  { id: 'ASG-2024-0004', clientId: 'CLI-2026-0089', portfolioId: 'CRT-003', type: 'Principal', from: '2024-01-01', to: '2024-06-30', author: 'María González', createdAt: '2023-12-20', reason: 'Reorganización territorial de carteras para el ejercicio 2024.' },
  { id: 'ASG-2023-0011', clientId: 'CLI-2026-0089', portfolioId: 'CRT-002', type: 'Principal', from: '2023-02-01', to: '2023-12-31', author: 'Luis Herrera', createdAt: '2023-02-01', reason: 'Asignación inicial desde carga masiva del catálogo de clientes.' },
  { id: 'ASG-2025-0140', clientId: 'CLI-2026-0102', portfolioId: 'CRT-004', type: 'Principal', from: '2025-03-15', to: null, author: 'Luis Herrera', createdAt: '2025-03-14', reason: 'Alta de cliente estratégico con volumen proyectado superior al umbral de grandes cuentas.' },
  { id: 'ASG-2025-0071', clientId: 'CLI-2026-0117', portfolioId: 'CRT-003', type: 'Especial', from: '2025-01-10', to: '2026-05-31', author: 'María González', createdAt: '2025-01-09', reason: 'Atención especial temporal durante proceso de reestructuración de deuda.' },
]

export const portfolioName = (id: string) => portfolios.find((item) => item.id === id)?.name ?? id
export const clientName = (id: string) => clients.find((item) => item.id === id)?.name ?? id

export const isActive = (assignment: Assignment) => !assignment.to || assignment.to >= TODAY

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function shiftDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function buildEvent(
  assignment: Assignment,
  kind: 'create' | 'close',
  overrides: Partial<Pick<AuditEvent, 'date' | 'time' | 'detail' | 'user' | 'reference'>> = {},
): AssignmentEvent {
  const icon: LucideIcon = kind === 'create' ? FilePlus2 : CalendarX2
  const date = kind === 'create' ? assignment.createdAt : (assignment.to ?? TODAY)
  return {
    clientId: assignment.clientId,
    assignmentId: assignment.id,
    date: formatDate(date),
    time: kind === 'create' ? '09:00' : '18:00',
    user: assignment.author,
    role: assignment.author === CURRENT_USER.name ? CURRENT_USER.role : 'Analista comercial',
    action: kind === 'create' ? 'Registro de asignación' : 'Cierre de vigencia',
    detail:
      kind === 'create'
        ? `${assignment.id} · ${portfolioName(assignment.portfolioId)} (${assignment.type}) vigente desde ${formatDate(assignment.from)}. Motivo: ${assignment.reason}`
        : `${assignment.id} · vigencia en ${portfolioName(assignment.portfolioId)} cerrada al ${formatDate(date)}.${assignment.closeReason ? ` Motivo: ${assignment.closeReason}` : ''}`,
    reference: `AUD-${assignment.id}-${kind === 'create' ? 'A' : 'C'}`,
    icon,
    tone: kind === 'create' ? 'primary' : 'accent',
    ...overrides,
  }
}

export const initialEvents: AssignmentEvent[] = initialAssignments
  .flatMap((assignment) => (assignment.to ? [buildEvent(assignment, 'close'), buildEvent(assignment, 'create')] : [buildEvent(assignment, 'create')]))
  .sort((a, b) => b.date.split('/').reverse().join('').localeCompare(a.date.split('/').reverse().join('')))
