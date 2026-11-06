'use client'

import type { ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type RankedItem = { name: string; amount: number }
type ShareItem = { name: string; value: number; color: string }

const beneficiaries: RankedItem[] = [
  { name: 'María Fernanda Ruiz', amount: 780400 },
  { name: 'Carlos Mendoza', amount: 624180 },
  { name: 'Ana Sofía Torres', amount: 488900 },
  { name: 'Luis Ramírez', amount: 314650 },
  { name: 'Equipo gerencial', amount: 223370 },
]

const areas: RankedItem[] = [
  { name: 'Comercial', amount: 920500 },
  { name: 'Operaciones', amount: 618200 },
  { name: 'Marketing', amount: 452180 },
  { name: 'Finanzas', amount: 298700 },
  { name: 'Servicio', amount: 141920 },
]

const commissionTypes: ShareItem[] = [
  { name: 'Renovación', value: 34, color: '#1d4ed8' },
  { name: 'Venta Nueva', value: 27, color: '#38bdf8' },
  { name: 'On Hand', value: 18, color: '#f59e0b' },
  { name: 'Gerencial', value: 13, color: '#8b5cf6' },
  { name: 'Geomarketing', value: 8, color: '#cbd5e1' },
]

const money = (value: number) => `$${value.toLocaleString('en-US')}`

export default function AnalyticsCards() {
  return (
    <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
      <ChartCard title="Comisiones por Beneficiario">
        <RankedBarList items={beneficiaries} color="#1d4ed8" label="Comisiones por beneficiario" />
      </ChartCard>
      <ChartCard title="Comisiones por Tipo de Comisión">
        <CommissionTypeDonut items={commissionTypes} total="$1,144.9K" />
      </ChartCard>
      <ChartCard title="Comisiones por Área">
        <RankedBarList items={areas} color="#38bdf8" label="Comisiones por área" />
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex h-10 items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="m-0 truncate text-sm font-bold leading-none text-slate-900">{title}</h3>
        <button
          type="button"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label={`Opciones de ${title}`}
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </button>
      </header>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </section>
  )
}

function RankedBarList({ items, color, label }: { items: RankedItem[]; color: string; label: string }) {
  const max = Math.max(...items.map((item) => item.amount))

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0" aria-label={label}>
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate whitespace-nowrap text-xs font-medium text-slate-700" title={item.name}>
            {item.name}
          </span>
          <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div className="h-full rounded-full" style={{ width: `${(item.amount / max) * 100}%`, background: color }} />
          </div>
          <span className="w-20 shrink-0 whitespace-nowrap text-right text-xs font-semibold tabular-nums text-slate-900">
            {money(item.amount)}
          </span>
        </li>
      ))}
    </ul>
  )
}

function CommissionTypeDonut({ items, total }: { items: ShareItem[]; total: string }) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={3}
              stroke="none"
              isAnimationActive={false}
            >
              {items.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <strong className="text-sm font-bold tabular-nums leading-none text-slate-900">{total}</strong>
          <span className="text-[11px] leading-none text-slate-500">Total</span>
        </div>
      </div>
      <ul className="m-0 flex list-none flex-col gap-3 p-0" aria-label="Distribución por tipo de comisión">
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate whitespace-nowrap text-xs font-medium text-slate-700">{item.name}</span>
            <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-900">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
