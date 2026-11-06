'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDownAZ, ArrowDownWideNarrow, Download, Maximize2, SlidersHorizontal } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type DataPoint = { name: string; value: number; color?: string }
type SortMode = 'amount' | 'alpha'

const beneficiaries: DataPoint[] = [
  { name: 'María Fernanda Ruiz', value: 780400 },
  { name: 'Carlos Mendoza', value: 624180 },
  { name: 'Ana Sofía Torres', value: 488900 },
  { name: 'Luis Ramírez', value: 314650 },
  { name: 'Equipo gerencial', value: 223370 },
]

const areas: DataPoint[] = [
  { name: 'Comercial', value: 920500 },
  { name: 'Operaciones', value: 618200 },
  { name: 'Marketing', value: 452180 },
  { name: 'Finanzas', value: 298700 },
  { name: 'Servicio', value: 141920 },
]

const commissionTypes: DataPoint[] = [
  { name: 'Renovación', value: 34, color: '#1d4ed8' },
  { name: 'Venta Nueva', value: 27, color: '#38bdf8' },
  { name: 'On Hand', value: 18, color: '#f59e0b' },
  { name: 'Gerencial', value: 13, color: '#8b5cf6' },
  { name: 'Geomarketing', value: 8, color: '#cbd5e1' },
]

const money = (value: number) => `$${value.toLocaleString('en-US')}`
const percent = (value: number) => `${value}%`

const menuItemClass = 'gap-2 text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900'

export default function AnalyticsCards() {
  return (
    <div className="mb-6 grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
      <AnalyticsCard
        title="Comisiones por Beneficiario"
        data={beneficiaries}
        valueHeader="Monto"
        formatValue={money}
        render={(items) => <RankedBarList items={items} color="#1d4ed8" label="Comisiones por beneficiario" />}
      />
      <AnalyticsCard
        title="Comisiones por Tipo de Comisión"
        data={commissionTypes}
        valueHeader="Porcentaje"
        formatValue={percent}
        render={(items) => <CommissionTypeDonut items={items} total="$1,144.9K" />}
      />
      <AnalyticsCard
        title="Comisiones por Área"
        data={areas}
        valueHeader="Monto"
        formatValue={money}
        render={(items) => <RankedBarList items={items} color="#38bdf8" label="Comisiones por área" />}
      />
    </div>
  )
}

function sortData(data: DataPoint[], mode: SortMode) {
  return [...data].sort((a, b) => (mode === 'amount' ? b.value - a.value : a.name.localeCompare(b.name, 'es')))
}

function downloadCsv(title: string, valueHeader: string, data: DataPoint[]) {
  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`
  const csv = [['Nombre', valueHeader], ...data.map((item) => [item.name, String(item.value)])]
    .map((row) => row.map(escape).join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `${title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function AnalyticsCard({
  title,
  data,
  valueHeader,
  formatValue,
  render,
}: {
  title: string
  data: DataPoint[]
  valueHeader: string
  formatValue: (value: number) => string
  render: (items: DataPoint[]) => ReactNode
}) {
  const [sortMode, setSortMode] = useState<SortMode>('amount')
  const [isExpanded, setIsExpanded] = useState(false)
  const items = useMemo(() => sortData(data, sortMode), [data, sortMode])

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex h-10 items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="m-0 truncate text-sm font-bold leading-none text-slate-900">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500/30 data-popup-open:bg-slate-100 data-popup-open:text-slate-600"
            aria-label={`Opciones de ${title}`}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 border border-slate-200 bg-white shadow-lg ring-0">
            <DropdownMenuItem className={menuItemClass} onClick={() => setIsExpanded(true)}>
              <Maximize2 className="size-4 text-slate-400" aria-hidden="true" />
              Ver en pantalla completa
            </DropdownMenuItem>
            <DropdownMenuItem className={menuItemClass} onClick={() => downloadCsv(title, valueHeader, items)}>
              <Download className="size-4 text-slate-400" aria-hidden="true" />
              Exportar datos (CSV)
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400">Ordenar por</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
                <DropdownMenuRadioItem value="amount" className={menuItemClass}>
                  <ArrowDownWideNarrow className="size-4 text-slate-400" aria-hidden="true" />
                  Mayor monto
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alpha" className={menuItemClass}>
                  <ArrowDownAZ className="size-4 text-slate-400" aria-hidden="true" />
                  Alfabético
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <div className="flex flex-1 flex-col justify-center">{render(items)}</div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="border border-slate-200 bg-white p-6 text-slate-900 sm:max-w-2xl">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-base font-bold text-slate-900">{title}</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Julio 2026 · Ordenado por {sortMode === 'amount' ? 'mayor monto' : 'orden alfabético'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">{render(items)}</div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[11px] uppercase tracking-wider text-slate-400">
                <th className="py-2 font-medium">Nombre</th>
                <th className="py-2 text-right font-medium">{valueHeader}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.name} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 font-medium text-slate-700">{item.name}</td>
                  <td className="py-2 text-right font-semibold tabular-nums text-slate-900">{formatValue(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function RankedBarList({ items, color, label }: { items: DataPoint[]; color: string; label: string }) {
  const max = Math.max(...items.map((item) => item.value))

  return (
    <ul className="m-0 flex list-none flex-col gap-4 p-0" aria-label={label}>
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate whitespace-nowrap text-xs font-medium text-slate-700" title={item.name}>
            {item.name}
          </span>
          <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
          </div>
          <span className="w-20 shrink-0 whitespace-nowrap text-right text-xs font-semibold tabular-nums text-slate-900">
            {money(item.value)}
          </span>
        </li>
      ))}
    </ul>
  )
}

function CommissionTypeDonut({ items, total }: { items: DataPoint[]; total: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-4">
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
          <li key={item.name} className="flex items-center gap-1.5">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: item.color }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate whitespace-nowrap text-xs font-medium text-slate-700" title={item.name}>{item.name}</span>
            <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-900">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
