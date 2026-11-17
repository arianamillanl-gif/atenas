import { ArrowDown, ArrowUp } from 'lucide-react'
import type { ListSale } from '../list-data'

type Kpi = { label: string; value: number; note: string; tone: string; trend?: 'up' | 'down' }

export default function KpiGrid({ sales }: { sales: ListSale[] }) {
  const total = sales.length
  const count = (condition: ListSale['condition']) => sales.filter((s) => s.condition === condition).length
  const pct = (n: number) => `${((n / total) * 100).toFixed(1)}% del total`
  const errors = sales.filter((s) => s.integration === 'Error').length
  const sin = count('Sin Condiciones')
  const vigentes = count('Vigente')

  const kpis: Kpi[] = [
    { label: 'Sin condiciones', value: sin, note: pct(sin), tone: 'bg-slate-100 text-slate-600', trend: 'up' },
    { label: 'En borrador', value: count('En Borrador'), note: pct(count('En Borrador')), tone: 'bg-amber-50 text-amber-700' },
    { label: 'Por aprobar', value: count('Por aprobar'), note: pct(count('Por aprobar')), tone: 'bg-sky-50 text-sky-700' },
    { label: 'Vigentes', value: vigentes, note: pct(vigentes), tone: 'bg-emerald-50 text-emerald-700', trend: 'up' },
    { label: 'Observadas / retenidas', value: 0, note: 'Requieren atención', tone: 'bg-orange-50 text-orange-700', trend: 'down' },
    { label: 'Error integración', value: errors, note: 'Reintento disponible', tone: 'bg-rose-50 text-rose-700' },
  ]

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Indicadores de estado">
      {kpis.map((kpi) => (
        <li key={kpi.label} className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm xl:p-3.5">
          <p className="min-h-8 text-xs font-medium leading-snug text-slate-500">{kpi.label}</p>
          <p className="text-[28px] font-semibold leading-none text-[#1E2B58] tabular-nums">{kpi.value}</p>
          <span className={`mt-auto inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold leading-snug xl:rounded-lg ${kpi.tone}`}>
            <span className="tabular-nums">{kpi.note}</span>
            {kpi.trend === 'up' && <ArrowUp size={11} aria-label="al alza" />}
            {kpi.trend === 'down' && <ArrowDown size={11} aria-label="a la baja" />}
          </span>
        </li>
      ))}
    </ul>
  )
}
