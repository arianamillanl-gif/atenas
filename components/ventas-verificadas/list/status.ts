import type { ConditionStatus } from '../list-data'

export const CONDITION_STYLE: Record<ConditionStatus, string> = {
  'Sin Condiciones': 'border-slate-200 bg-slate-50 text-slate-600',
  'En Borrador': 'border-amber-200 bg-amber-50 text-amber-700',
  'Por aprobar': 'border-sky-200 bg-sky-50 text-sky-700',
  Vigente: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rechazada: 'border-rose-200 bg-rose-50 text-rose-700',
}
