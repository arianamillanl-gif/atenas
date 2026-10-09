export type PersonaForm = {
  firstNames: string
  lastNames: string
  email: string
  phone: string
  status: EmploymentStatus
  validFrom: string
  validTo: string
  reason: string
  mainUnit: string
}

export type FormErrors = Partial<Record<keyof PersonaForm, string>>

export const EMPLOYMENT_STATUSES = ['Activo', 'En revisión', 'Licencia', 'Suspendido', 'Baja definitiva'] as const
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]
export const DRASTIC_STATUSES: EmploymentStatus[] = ['Suspendido', 'Baja definitiva']

export type RoleRecord = {
  id: string
  role: string
  structure: string
  start: string
  end: string | null
  principal: boolean
}

export const ROLE_CONDITIONS = ['Titular', 'Encargado(a)', 'Interino(a)'] as const
export type RoleCondition = (typeof ROLE_CONDITIONS)[number]

export type OrgRoleRecord = {
  id: string
  role: string
  condition: RoleCondition
  start: string
  end: string | null
}

export const ORG_ROLES = ['Gerente de área', 'Consultor(a) senior', 'Consultor(a)', 'Especialista tributario', 'Supervisor(a) de auditoría']

export const initialOrgRoles: OrgRoleRecord[] = [
  { id: 'o-3', role: 'Consultor(a) senior', condition: 'Titular', start: '2025-01-01', end: null },
  { id: 'o-2', role: 'Supervisor(a) de auditoría', condition: 'Encargado(a)', start: '2024-04-15', end: '2024-12-31' },
  { id: 'o-1', role: 'Consultor(a)', condition: 'Titular', start: '2023-02-01', end: '2024-12-31' },
]

export function rangesOverlap(a: { start: string; end: string | null }, b: { start: string; end: string | null }) {
  const open = '9999-12-31'
  return a.start <= (b.end ?? open) && b.start <= (a.end ?? open)
}

export const ADSCRIPTION_TYPES = ['Secundaria', 'Temporal'] as const
export type AdscriptionType = (typeof ADSCRIPTION_TYPES)[number]

export type AdscriptionRecord = {
  id: string
  unit: string
  type: AdscriptionType
  start: string
  end: string | null
  active: boolean
}

export const initialAdscriptions: AdscriptionRecord[] = [
  { id: 'a-2', unit: 'Talento Humano', type: 'Secundaria', start: '2025-01-01', end: null, active: true },
  { id: 'a-1', unit: 'Auditoría Externa', type: 'Temporal', start: '2024-04-15', end: '2024-12-31', active: false },
]

export const UNIT_TREE: { area: string; units: string[] }[] = [
  { area: 'Dirección General', units: ['Gerencia de Operaciones', 'Gerencia de Planificación'] },
  { area: 'Dirección de Consultoría', units: ['Consultoría Tributaria', 'Consultoría Financiera', 'Auditoría Externa'] },
  { area: 'Dirección de Soporte', units: ['Talento Humano', 'Tecnología', 'Administración y Finanzas'] },
]

export const ALL_UNITS = UNIT_TREE.flatMap((group) => group.units)

export const STRUCTURES = ['Comité de Calidad', 'Equipo Cierre Fiscal 2026', 'Célula de Datos ATENAS', 'Mesa de Gobernanza', 'Proyecto Migración ERP']
export const ROLES = ['Coordinador(a)', 'Analista senior', 'Analista', 'Revisor(a)', 'Asesor(a) externo', 'Auditor(a) líder']

export const PERSONA_ID = 'PER-2026-8912'
export const TODAY = '2026-10-09'

export const initialForm: PersonaForm = {
  firstNames: 'Andrea Carolina',
  lastNames: 'Rivas Mendoza',
  email: 'andrea.rivas@atenas.com.ve',
  phone: '+58 412-555-0198',
  status: 'Activo',
  validFrom: '2023-02-01',
  validTo: '',
  reason: '',
  mainUnit: 'Consultoría Tributaria',
}

export const initialRoles: RoleRecord[] = [
  { id: 'r-4', role: 'Auditor(a) líder', structure: 'Equipo Cierre Fiscal 2026', start: '2026-01-15', end: null, principal: true },
  { id: 'r-3', role: 'Revisor(a)', structure: 'Comité de Calidad', start: '2025-06-01', end: null, principal: false },
  { id: 'r-2', role: 'Analista senior', structure: 'Célula de Datos ATENAS', start: '2024-03-10', end: '2025-12-31', principal: false },
  { id: 'r-1', role: 'Analista', structure: 'Proyecto Migración ERP', start: '2023-02-01', end: '2024-03-09', principal: false },
]

export function formatDate(value: string | null) {
  if (!value) return 'Actual'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}
