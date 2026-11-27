'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  BarChart3,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  Grid2X2,
  Search,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type DashboardFilters = {
  period: string
  area: string
  line: string
  beneficiary: string
  type: string
  status: string
}

type SelectFilterProps = {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const areas = ['Comercial', 'Operaciones', 'Consumer Insights', 'Marketing', 'Health Intelligence', 'Finanzas', 'Servicio']
const commissionTypes = ['Venta Nueva', 'On Hand', 'Renovación', 'Gerencial', 'Geomarketing']
const commissionStatuses = ['ACTIVADA', 'GENERADA', 'NO_PAGADERA', 'ANULADA', 'PAGADA']

const paidCommissions = [
  { area: 'Comercial', beneficiary: 'María F. Ruiz', type: 'Renovación', amount: 284500 },
  { area: 'Servicio', beneficiary: 'Ana S. Torres', type: 'On Hand', amount: 156800 },
]

const kpis = [
  { label: 'Pendientes de Activación', value: '$439,700', badge: '3 Casos', context: 'Activación', tone: 'text-slate-500 bg-slate-100', icon: Activity },
  { label: 'En Revisión', value: '$2,431,500', badge: '5 Casos', context: 'Validación', tone: 'text-amber-700 bg-amber-50', icon: Search },
  { label: 'Observadas', value: '$1,820,100', badge: '2 Casos', context: 'Con alertas', tone: 'text-rose-700 bg-rose-50', icon: AlertTriangle },
  { label: 'Listas para Aprobación', value: '$1,987,200', badge: '5 Casos', context: 'Aprobación', tone: 'text-emerald-700 bg-emerald-50', icon: Check },
  { label: 'Pendientes de Pago', value: '$439,700', badge: '2 Casos', context: 'Pago pendiente', tone: 'text-orange-700 bg-orange-50', icon: CircleDollarSign },
  { label: 'Pagadas', value: '$441,300', badge: '2 Casos', context: 'USD acumulado', tone: 'text-emerald-700 bg-emerald-50', icon: Check },
  { label: 'Congelado / Diferido', value: '$167,100', badge: '1 Caso', context: 'En espera', tone: 'text-violet-700 bg-violet-50', icon: AlertTriangle },
  { label: 'Condición Global Vesper / Calidad', value: '91.4%', badge: '10 Casos', context: 'Obj. ≥ 95%', tone: 'text-blue-800 bg-blue-50', icon: BarChart3 },
]

const exceptions = [
  { title: 'Diferencias de conciliación', cases: 112, priority: 'Alta', amount: '$127,400', detail: 'Diferencias entre cobros aplicados, facturas y monto conciliado.' },
  { title: 'Comisiones con pagos parciales', cases: 75, priority: 'Alta', amount: '$89,600', detail: 'Cobros parciales requieren recalcular la comisión liberable.' },
  { title: 'Cobros adelantados con comisión diferida', cases: 41, priority: 'Media', amount: '$54,200', detail: 'El cobro anticipado requiere validación antes de liberar la comisión.' },
  { title: 'Multipagos', cases: 28, priority: 'Media', amount: '$32,800', detail: 'Múltiples movimientos asociados a una misma factura.' },
  { title: 'Pagos englobados', cases: 16, priority: 'Media', amount: '$21,400', detail: 'Pagos agrupados que necesitan asignación a cuentas por cobrar.' },
]

const closingProgress = [
  { label: 'Listas para aprobación', count: '742', percent: 78.5, amount: '$1,860,097', color: '#16845b' },
  { label: 'Observadas', count: '101', percent: 12.1, amount: '$318,027', color: '#e7a928' },
  { label: 'Pendientes de ajuste', count: '48', percent: 3.6, amount: '$87,534', color: '#8b5cf6' },
  { label: 'Excluidas del cierre', count: '37', percent: 5.8, amount: '$165,842', color: '#94a3b8' },
]

const beneficiaryData = [
  { name: 'María Fernanda Ruiz', area: 'Comercial', amount: 780400, commissionTypes: ['Renovación'], commissionStatuses: ['ACTIVADA'] },
  { name: 'Carlos Mendoza', area: 'Operaciones', amount: 624180, commissionTypes: ['Venta Nueva'], commissionStatuses: ['GENERADA'] },
  { name: 'Ana Sofía Torres', area: 'Servicio', amount: 488900, commissionTypes: ['On Hand'], commissionStatuses: ['ACTIVADA'] },
  { name: 'Luis Ramírez', area: 'Comercial', amount: 314650, commissionTypes: ['Gerencial'], commissionStatuses: ['NO_PAGADERA'] },
  { name: 'Equipo gerencial', area: 'Marketing', amount: 223370, commissionTypes: ['Geomarketing'], commissionStatuses: ['ANULADA'] },
]

const typeData = [
  { name: 'Renovación', value: 34, fill: 'var(--color-renovacion)' },
  { name: 'Venta Nueva', value: 27, fill: 'var(--color-ventaNueva)' },
  { name: 'On Hand', value: 18, fill: 'var(--color-onHand)' },
  { name: 'Gerencial', value: 13, fill: 'var(--color-gerencial)' },
  { name: 'Geomarketing', value: 8, fill: 'var(--color-geomarketing)' },
]

const monthlyData = [
  { month: 'Ene', total: 1740000 },
  { month: 'Feb', total: 1820000 },
  { month: 'Mar', total: 1690000 },
  { month: 'Abr', total: 1940000 },
  { month: 'May', total: 2030000 },
  { month: 'Jun', total: 2260000 },
  { month: 'Jul', total: 2431500 },
]

const impactRows = [
  { name: 'Grupo Andino S.A.', type: 'Cliente', amount: '$284,500' },
  { name: 'Inversiones Litoral', type: 'Cliente', amount: '$198,240' },
  { name: 'Red Médica Nacional', type: 'Servicio', amount: '$156,800' },
  { name: 'Constructora Norte', type: 'Cliente', amount: '$94,120' },
  { name: 'Logística Integral', type: 'Servicio', amount: '$72,900' },
]

const traceability = [
  { label: 'Venta', records: 248, alerts: 12, complete: 95 },
  { label: 'Factura / CxC', records: 235, alerts: 18, complete: 92 },
  { label: 'Cobro', records: 198, alerts: 9, complete: 95 },
  { label: 'Regla Comisión', records: 189, alerts: 14, complete: 89 },
  { label: 'Estado de la Comisión', records: 175, alerts: 14, complete: 92 },
]

const tableRows = [
  { client: 'Grupo Andino S.A.', area: 'Comercial', beneficiary: 'María F. Ruiz', type: 'Renovación', sale: '$284,500', invoice: 'Emitida', payment: 'Conciliado', rule: 'AT-REN-04', state: 'Conciliado', commissionStatus: 'ACTIVADA' },
  { client: 'Inversiones Litoral', area: 'Operaciones', beneficiary: 'Carlos Mendoza', type: 'Venta Nueva', sale: '$198,240', invoice: 'Emitida', payment: 'Parcial', rule: 'AT-VN-11', state: 'Pendiente', commissionStatus: 'GENERADA' },
  { client: 'Red Médica Nacional', area: 'Servicio', beneficiary: 'Ana S. Torres', type: 'On Hand', sale: '$156,800', invoice: 'Emitida', payment: 'Conciliado', rule: 'AT-OH-02', state: 'Conciliado', commissionStatus: 'ACTIVADA' },
  { client: 'Constructora Norte', area: 'Comercial', beneficiary: 'Luis Ramírez', type: 'Gerencial', sale: '$94,120', invoice: 'Pendiente', payment: 'Pendiente', rule: 'AT-GER-09', state: 'Con excepciones', commissionStatus: 'NO_PAGADERA' },
  { client: 'Logística Integral', area: 'Marketing', beneficiary: 'María F. Ruiz', type: 'Geomarketing', sale: '$72,900', invoice: 'Emitida', payment: 'Conciliado', rule: 'AT-GEO-07', state: 'Conciliado', commissionStatus: 'ANULADA' },
]

const beneficiaryConfig = { amount: { label: 'Comisión', color: 'var(--chart-1)' } } satisfies ChartConfig
const areaConfig = { amount: { label: 'Comisión', color: 'var(--chart-2)' } } satisfies ChartConfig
const typeConfig = {
  renovacion: { label: 'Renovación', color: 'var(--chart-1)' },
  ventaNueva: { label: 'Venta Nueva', color: 'var(--chart-2)' },
  onHand: { label: 'On Hand', color: 'var(--chart-3)' },
  gerencial: { label: 'Gerencial', color: 'var(--chart-4)' },
  geomarketing: { label: 'Geomarketing', color: 'var(--chart-5)' },
} satisfies ChartConfig
const monthlyConfig = { total: { label: 'Total de comisiones', color: 'var(--chart-1)' } } satisfies ChartConfig

const formatMoney = (value: number) => `$${value.toLocaleString('en-US')}`

function SelectFilter({ label, value, options, onChange }: SelectFilterProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-semibold text-slate-600">{label}</span>
      <span className="relative">
        <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-700 outline-none transition focus:border-[#1e2b58] focus:ring-2 focus:ring-indigo-100">
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-3 size-4 text-slate-400" />
      </span>
    </label>
  )
}

function formatCommissionStatus(status: string) {
  const labels: Record<string, string> = {
    ACTIVADA: 'Activada',
    GENERADA: 'Generada',
    NO_PAGADERA: 'No pagadera',
    ANULADA: 'Anulada',
    PAGADA: 'Pagada',
  }
  return labels[status] ?? status.toLowerCase().replaceAll('_', ' ')
}

function ChartCard({ title, children, filters }: { title: string; children: React.ReactNode; filters: Pick<DashboardFilters, 'type' | 'status'> }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <div className="mb-4 mt-2 flex flex-wrap gap-1.5" aria-label={`Filtros activos en ${title}`}>
        <span className="max-w-full truncate rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1 text-[9px] font-medium text-[#1E2B58]">Tipo: {filters.type}</span>
        <span className="max-w-full truncate rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-1 text-[9px] font-medium text-[#334155]">Estado: {filters.status === 'Todos' ? 'Todos' : formatCommissionStatus(filters.status)}</span>
      </div>
      {children}
    </section>
  )
}

function CommissionTooltip({
  active,
  payload,
  dimension,
}: {
  active?: boolean
  payload?: Array<{ payload?: { name: string; amount: number; commissionTypes: string[]; commissionStatuses: string[] } }>
  dimension: 'Beneficiario' | 'Área'
}) {
  const datum = payload?.[0]?.payload
  if (!active || !datum) return null
  return (
    <div className="max-w-64 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] shadow-lg">
      <p className="font-semibold text-slate-800">{dimension}: {datum.name}</p>
      <p className="mt-1 text-slate-500">Tipo de comisión: {datum.commissionTypes.join(', ')}</p>
      <p className="text-slate-500">Estado de comisión: {datum.commissionStatuses.map(formatCommissionStatus).join(', ')}</p>
      <p className="mt-1 font-semibold tabular-nums text-slate-900">Monto: {formatMoney(datum.amount)}</p>
    </div>
  )
}

export default function GerencialCommissionView() {
  const [filters, setFilters] = useState<DashboardFilters>({ period: 'Julio 2026', area: 'Todas', line: 'Todos', beneficiary: 'Todos', type: 'Todos', status: 'Todos' })
  const [view, setView] = useState<'control' | 'analysis'>('control')
  const [exceptionOpen, setExceptionOpen] = useState(false)
  const [exceptionSearch, setExceptionSearch] = useState('')
  const [exceptionPriority, setExceptionPriority] = useState('Todas')
  const [selectedException, setSelectedException] = useState<string | null>(null)
  const [tableSearch, setTableSearch] = useState('')
  const [tableFilter, setTableFilter] = useState('Todos')

  const filteredExceptions = useMemo(() => exceptions.filter((item) => {
    const matchesPriority = exceptionPriority === 'Todas' || item.priority === exceptionPriority
    return matchesPriority && item.title.toLowerCase().includes(exceptionSearch.toLowerCase())
  }), [exceptionPriority, exceptionSearch])

  const filteredTableRows = useMemo(() => tableRows.filter((row) => {
    const matchesText = `${row.client} ${row.beneficiary}`.toLowerCase().includes(tableSearch.toLowerCase())
    const matchesTab = tableFilter === 'Todos' || (tableFilter === 'Pendientes' ? row.state === 'Pendiente' : row.state === tableFilter)
    const matchesArea = filters.area === 'Todas' || row.area === filters.area
    const matchesBeneficiary = filters.beneficiary === 'Todos' || row.beneficiary === filters.beneficiary
    const matchesType = filters.type === 'Todos' || row.type === filters.type
    const matchesStatus = filters.status === 'Todos' || row.commissionStatus === filters.status
    return matchesText && matchesTab && matchesArea && matchesBeneficiary && matchesType && matchesStatus
  }), [filters.area, filters.beneficiary, filters.type, tableFilter, tableSearch])

  const filteredPaidCommissions = useMemo(() => paidCommissions.filter((commission) => (
    (filters.status === 'Todos' || filters.status === 'PAGADA')
    && (filters.area === 'Todas' || commission.area === filters.area)
    && (filters.beneficiary === 'Todos' || commission.beneficiary === filters.beneficiary)
    && (filters.type === 'Todos' || commission.type === filters.type)
  )), [filters.area, filters.beneficiary, filters.status, filters.type])
  const paidKpiAmount = filteredPaidCommissions.reduce((total, commission) => total + commission.amount, 0)
  const paidKpi = { value: formatMoney(paidKpiAmount), badge: `${filteredPaidCommissions.length} ${filteredPaidCommissions.length === 1 ? 'Caso' : 'Casos'}`, context: 'USD acumulado' }

  const matchesAnalyticsFilters = (item: { name: string; amount: number; commissionTypes: string[]; commissionStatuses: string[]; area?: string }) => (
    (filters.area === 'Todas' || item.area === filters.area || item.name === filters.area)
    && (filters.beneficiary === 'Todos' || item.name === filters.beneficiary || item.name === 'María Fernanda Ruiz' && filters.beneficiary === 'María F. Ruiz' || item.name === 'Ana Sofía Torres' && filters.beneficiary === 'Ana S. Torres')
    && (filters.type === 'Todos' || item.commissionTypes.includes(filters.type))
    && (filters.status === 'Todos' || item.commissionStatuses.includes(filters.status))
  )
  const filteredBeneficiaryData = beneficiaryData.filter(matchesAnalyticsFilters)
  const filteredAreaData = Array.from(new Set(filteredBeneficiaryData.map((item) => item.area))).map((name) => {
    const entries = filteredBeneficiaryData.filter((item) => item.area === name)
    return { name, amount: entries.reduce((total, item) => total + item.amount, 0), commissionTypes: Array.from(new Set(entries.flatMap((item) => item.commissionTypes))), commissionStatuses: Array.from(new Set(entries.flatMap((item) => item.commissionStatuses))) }
  })
  const filteredTypeData = typeData.map((item) => {
    const amount = filteredBeneficiaryData.reduce((total, beneficiary) => (
      total + (beneficiary.commissionTypes.includes(item.name) ? beneficiary.amount : 0)
    ), 0)
    return { ...item, value: amount }
  }).filter((item) => item.value > 0)
  const analyticsTotal = filteredBeneficiaryData.reduce((total, item) => total + item.amount, 0)
  const formattedFilterContext = (value: string) => value === 'Todos' || value === 'Todas' ? 'Todos' : value

  const setFilter = (key: keyof DashboardFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }))
  const clearFilters = () => setFilters({ period: 'Julio 2026', area: 'Todas', line: 'Todos', beneficiary: 'Todos', type: 'Todos', status: 'Todos' })

  const exportCsv = () => {
    const content = [
      ['CLIENTE', 'ÁREA', 'BENEFICIARIO', 'TIPO COMISIÓN', 'MONTO VENTA', 'FACTURA / CXC', 'COBRO', 'REGLA APLICADA'],
      ...filteredTableRows.map((row) => [row.client, row.area, row.beneficiary, row.type, row.sale, row.invoice, row.payment, row.rule]),
    ].map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'detalle-control-comisiones-julio-2026.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-label="Control gerencial de comisiones" className="flex flex-col gap-4 font-sans">
      <section aria-label="Filtros globales" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:px-5 md:py-4">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Filtros de consulta</h2>
            <p className="mt-1 text-[11px] text-slate-500">Contexto aplicado: {filters.period} · {filters.area} · {filters.type} · {filters.status === 'Todos' ? 'Todos los estados' : formatCommissionStatus(filters.status)}</p>
          </div>
          <button type="button" onClick={clearFilters} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-[#1e2b58]">
            <X aria-hidden="true" className="size-3.5" /> Limpiar
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <SelectFilter label="Período de cierre" value={filters.period} options={['Julio 2026', 'Todos']} onChange={(value) => setFilter('period', value)} />
          <SelectFilter label="Área" value={filters.area} options={['Todas', ...areas]} onChange={(value) => setFilter('area', value)} />
          <SelectFilter label="Línea de negocio" value={filters.line} options={['Todos']} onChange={(value) => setFilter('line', value)} />
          <SelectFilter label="Beneficiario" value={filters.beneficiary} options={['Todos', ...Array.from(new Set(tableRows.map((row) => row.beneficiary)))]} onChange={(value) => setFilter('beneficiary', value)} />
          <SelectFilter label="Tipo de comisión" value={filters.type} options={['Todos', ...commissionTypes]} onChange={(value) => setFilter('type', value)} />
          <SelectFilter label="Estado de comisión" value={filters.status} options={['Todos', ...commissionStatuses]} onChange={(value) => setFilter('status', value)} />
        </div>
      </section>

      <div role="tablist" aria-label="Sub-vistas de comisiones" className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <button type="button" role="tab" aria-selected={view === 'control'} onClick={() => setView('control')} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${view === 'control' ? 'bg-[#1e2b58] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Grid2X2 aria-hidden="true" className="size-4" /> Control General del Cierre
        </button>
        <button type="button" role="tab" aria-selected={view === 'analysis'} onClick={() => setView('analysis')} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${view === 'analysis' ? 'bg-[#1e2b58] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
          <Activity aria-hidden="true" className="size-4" /> Análisis y Trazabilidad
        </button>
      </div>

      {view === 'control' ? (
        <div role="tabpanel" className="flex flex-col gap-4">
          <div aria-label="Indicadores clave del cierre">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map(({ label, value, badge, context, tone, icon: Icon }) => {
                const paidValues = label === 'Pagadas' ? paidKpi : null
                return (
                  <article key={label} className="flex h-[132px] flex-col rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex min-h-10 items-center gap-2">
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${tone}`}><Icon aria-hidden="true" className="size-4" /></span>
                      <h3 className="min-w-0 text-[11px] font-semibold leading-4 text-slate-600">{label}</h3>
                    </div>
                    <strong className="mt-1.5 text-xl font-semibold leading-6 tracking-tight tabular-nums text-slate-900">{paidValues?.value ?? value}</strong>
                    <div className={`mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px] leading-4 ${context === 'Obj. ≥ 95%' ? 'pr-9' : ''}`}>
                      <span className="shrink-0 font-semibold text-slate-500">{paidValues?.badge ?? badge}</span>
                      <span className="min-w-0 text-right font-medium text-slate-400">{paidValues?.context ?? context}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section aria-labelledby="exceptions-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 id="exceptions-title" className="text-sm font-bold text-slate-900">Excepciones y diferencias de conciliación</h2>
                <button type="button" onClick={() => setExceptionOpen(true)} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#1e2b58] hover:underline">
                  Ver detalle <ChevronRight aria-hidden="true" className="size-4" />
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {exceptions.map((item) => (
                  <button key={item.title} type="button" onClick={() => { setSelectedException(item.title); setExceptionOpen(true) }} className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-slate-50/70">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"><AlertTriangle aria-hidden="true" className="size-4" /></span>
                    <span className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-slate-800">{item.title}</strong><span className="text-[10px] text-slate-500">{item.cases} casos</span></span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.priority === 'Alta' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{item.priority}</span>
                    <strong className="w-[76px] shrink-0 text-right text-xs font-bold tabular-nums text-slate-800">{item.amount}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="closing-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 id="closing-title" className="text-sm font-bold text-slate-900">Cierre mensual · Julio 2026</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />En curso</span>
              </div>
              <div className="flex flex-col gap-4">
                {closingProgress.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px]">
                      <span className="font-semibold text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.count} comisiones · {item.percent}%</span>
                      <strong className="ml-auto tabular-nums text-slate-900">{item.amount}</strong>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} /></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                <div><span className="block text-[11px] font-semibold text-slate-600">Total Comisiones Julio 2026</span><strong className="mt-1 block text-xs text-slate-500">968 comisiones</strong></div>
                <strong className="text-lg font-bold tabular-nums text-[#1e2b58]">$2,431,500</strong>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div role="tabpanel" className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard title="Comisiones por Beneficiario" filters={filters}>
              <ChartContainer config={beneficiaryConfig} className="h-[220px] w-full aspect-auto">
                <BarChart data={filteredBeneficiaryData} layout="vertical" margin={{ left: 0, right: 82, top: 4, bottom: 4 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" hide domain={[0, 'dataMax + 650000']} />
                  <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} content={<CommissionTooltip dimension="Beneficiario" />} />
                  <Bar dataKey="amount" fill="#1E2B58" background={{ fill: '#F1F5F9', radius: 999 }} radius={[0, 5, 5, 0]} barSize={10}>
                    <LabelList dataKey="amount" position="right" formatter={(value) => formatMoney(Number(value))} className="fill-slate-600 text-[9px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>

            <ChartCard title="Comisiones por Tipo de Comisión" filters={filters}>
              <div className="relative">
                <ChartContainer config={typeConfig} className="h-[220px] w-full aspect-auto">
                  <PieChart>
                    <Pie data={filteredTypeData} dataKey="value" nameKey="name" innerRadius={57} outerRadius={82} paddingAngle={3} strokeWidth={0}>
                      {filteredTypeData.map((item) => <Cell key={item.name} fill={item.fill} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                  </PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-1">
                  <strong className="text-lg font-bold tabular-nums text-slate-900">{analyticsTotal >= 1000000 ? `$${(analyticsTotal / 1000000).toFixed(2)}M` : formatMoney(analyticsTotal)}</strong>
                  <span className="max-w-28 whitespace-normal break-normal text-center text-[9px] leading-3 text-slate-500">Total · {filters.type !== 'Todos' ? filters.type : filters.status !== 'Todos' ? formatCommissionStatus(filters.status) : 'Comisiones'}</span>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-2">
                {filteredTypeData.map((item) => <div key={item.name} className="flex min-w-0 items-center gap-2 text-[10px] text-slate-600"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.fill }} /><span className="min-w-0 flex-1 truncate">{item.name}</span><strong className="text-slate-800">{analyticsTotal ? `${Math.round(item.value / analyticsTotal * 100)}%` : '0%'}</strong></div>)}
              </div>
            </ChartCard>

            <ChartCard title="Comisiones por Área" filters={filters}>
              <ChartContainer config={areaConfig} className="h-[220px] w-full aspect-auto">
                <BarChart data={filteredAreaData} layout="vertical" margin={{ left: 0, right: 82, top: 4, bottom: 4 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" hide domain={[0, 'dataMax + 650000']} />
                  <YAxis type="category" dataKey="name" width={104} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} content={<CommissionTooltip dimension="Área" />} />
                  <Bar dataKey="amount" fill="#1E2B58" background={{ fill: '#F1F5F9', radius: 999 }} radius={[0, 5, 5, 0]} barSize={10}>
                    <LabelList dataKey="amount" position="right" formatter={(value) => formatMoney(Number(value))} className="fill-slate-600 text-[9px] tabular-nums" />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 xl:col-span-3">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div><h2 className="text-sm font-bold text-slate-900">Evolución mensual</h2><p className="mt-1 text-[11px] text-slate-500">Histórico de cierre por comisiones · Ene – Jul 2026</p></div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">+7.6%</span>
              </div>
              <ChartContainer config={monthlyConfig} className="h-[245px] w-full aspect-auto">
                <AreaChart data={monthlyData} margin={{ left: 2, right: 10, top: 10, bottom: 0 }}>
                  <defs><linearGradient id="commission-monthly-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-total)" stopOpacity={0.24} /><stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.01} /></linearGradient></defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis hide domain={['dataMin - 100000', 'dataMax + 100000']} />
                  <Tooltip content={<ChartTooltipContent formatter={(value) => formatMoney(Number(value))} />} />
                  <Area type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2.5} fill="url(#commission-monthly-fill)" />
                </AreaChart>
              </ChartContainer>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 xl:col-span-2">
              <div className="mb-4"><h2 className="text-sm font-bold text-slate-900">Impacto en Cierre de Comisiones</h2><p className="mt-1 text-[11px] text-slate-500">Ranking de incidencia en el período</p></div>
              <div className="divide-y divide-slate-100">
                {impactRows.map((row, index) => <div key={row.name} className="flex items-center gap-3 py-3"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-slate-50 text-[10px] font-bold text-slate-500">{index + 1}</span><div className="min-w-0 flex-1"><strong className="block truncate text-xs font-semibold text-slate-800">{row.name}</strong><span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${row.type === 'Cliente' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>{row.type}</span></div><strong className="shrink-0 text-xs font-bold tabular-nums text-slate-900">{row.amount}</strong></div>)}
              </div>
            </section>
          </div>

          <section aria-labelledby="traceability-title" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div><h2 id="traceability-title" className="text-sm font-bold text-slate-900">Trazabilidad del proceso</h2><p className="mt-1 text-[11px] text-slate-500">Comparativo de registros, alertas y completitud</p></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">5 etapas</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {traceability.map((item) => <article key={item.label} className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                <h3 className="min-h-8 text-[11px] font-semibold leading-4 text-slate-600">{item.label}</h3>
                <div className="mt-3 flex items-baseline gap-2"><strong className="text-2xl font-bold tracking-tight text-slate-900">{item.records}</strong><span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">registros</span></div>
                <span className="mt-3 inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700"><AlertTriangle aria-hidden="true" className="size-3" />{item.alerts} alertas</span>
                <div className="mt-4"><div className="mb-1.5 flex items-center justify-between text-[9px] font-semibold uppercase tracking-wide text-slate-500"><span>Completitud %</span><strong className="text-slate-700">{item.complete}%</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${item.complete >= 92 ? 'bg-emerald-600' : 'bg-amber-500'}`} style={{ width: `${item.complete}%` }} /></div></div>
              </article>)}
            </div>
          </section>

          <section aria-labelledby="detail-title" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between md:px-5">
              <div><h2 id="detail-title" className="text-sm font-bold text-slate-900">Detalle de control de comisiones</h2><p className="mt-1 text-[11px] text-slate-500">Registros de cierre para el período seleccionado</p></div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-9 min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 sm:w-64"><Search aria-hidden="true" className="size-3.5 shrink-0" /><input aria-label="Buscar cliente o beneficiario" value={tableSearch} onChange={(event) => setTableSearch(event.target.value)} placeholder="Buscar cliente o beneficiario" className="min-w-0 flex-1 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></label>
                <button type="button" onClick={exportCsv} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"><Download aria-hidden="true" className="size-3.5" />Exportar CSV</button>
              </div>
            </div>
            <div role="tablist" aria-label="Filtrar detalle de control" className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 py-2 md:px-5">
              {['Todos', 'Pendientes', 'Conciliados', 'Con excepciones'].map((item) => <button key={item} type="button" role="tab" aria-selected={tableFilter === item} onClick={() => setTableFilter(item)} className={`shrink-0 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${tableFilter === item ? 'bg-indigo-50 text-[#1e2b58]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>{item}</button>)}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[940px] border-collapse text-left">
                <thead className="bg-slate-50/70"><tr>{['CLIENTE', 'ÁREA', 'BENEFICIARIO', 'TIPO COMISIÓN', 'MONTO VENTA', 'FACTURA / CXC', 'COBRO', 'REGLA APLICADA'].map((heading) => <th key={heading} className="px-4 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{heading}</th>)}</tr></thead>
                <tbody>{filteredTableRows.map((row) => <tr key={row.client} className="border-t border-slate-100 transition-colors hover:bg-slate-50/70"><td className="px-4 py-3 text-xs font-semibold text-slate-800">{row.client}</td><td className="px-4 py-3 text-xs text-slate-600">{row.area}</td><td className="px-4 py-3 text-xs text-slate-600">{row.beneficiary}</td><td className="px-4 py-3 text-xs text-slate-600">{row.type}</td><td className="px-4 py-3 text-xs font-semibold tabular-nums text-slate-900">{row.sale}</td><td className="px-4 py-3 text-xs text-slate-600">{row.invoice}</td><td className="px-4 py-3 text-xs text-slate-600">{row.payment}</td><td className="px-4 py-3 text-xs font-medium text-slate-600">{row.rule}</td></tr>)}</tbody>
              </table>
              {filteredTableRows.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No se encontraron registros con los filtros seleccionados.</p>}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[10px] text-slate-500"><span>Mostrando {filteredTableRows.length ? 1 : 0}–{filteredTableRows.length} de 968 registros</span><div className="flex items-center gap-1"><button type="button" disabled aria-label="Página anterior" className="grid size-7 place-items-center rounded-md text-slate-300"><ChevronLeft className="size-4" /></button><span className="grid size-7 place-items-center rounded-md bg-indigo-50 font-semibold text-[#1e2b58]">1</span><button type="button" aria-label="Página siguiente" className="grid size-7 place-items-center rounded-md text-slate-500 hover:bg-slate-50"><ChevronRight className="size-4" /></button></div></div>
          </section>
        </div>
      )}

      <button type="button" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 z-20 grid size-10 place-items-center rounded-full bg-[#1e2b58] text-white shadow-lg transition hover:bg-[#2a3b74] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"><ArrowUp aria-hidden="true" className="size-4" /></button>

      {exceptionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setExceptionOpen(false) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="exception-dialog-title" aria-describedby="exception-dialog-description" className="flex max-h-[min(760px,92vh)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onKeyDown={(event) => { if (event.key === 'Escape') setExceptionOpen(false) }}>
            <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 md:px-6">
              <div><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#1e2b58]">REVISIÓN DE CONCILIACIÓN</p><h2 id="exception-dialog-title" className="mt-1 text-lg font-bold text-slate-900">Detalle de excepciones</h2><p id="exception-dialog-description" className="mt-1 text-xs text-slate-500">Casos que requieren seguimiento antes del cierre mensual.</p></div>
              <button type="button" aria-label="Cerrar detalle de excepciones" onClick={() => setExceptionOpen(false)} className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"><X className="size-4" /></button>
            </header>
            <div className="mx-5 mt-4 rounded-xl bg-[#1e2b58] px-4 py-3 text-white md:mx-6">
              <span className="block text-[9px] font-bold uppercase tracking-[.14em] text-indigo-200">IMPACTO TOTAL EN EXCEPCIONES</span><strong className="mt-1 block text-lg font-bold">262 casos · $333,600</strong>
            </div>
            <div className="flex flex-col gap-3 px-5 py-4 md:px-6">
              <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400"><Search aria-hidden="true" className="size-4 shrink-0" /><input autoFocus aria-label="Buscar excepción" value={exceptionSearch} onChange={(event) => setExceptionSearch(event.target.value)} placeholder="Buscar excepción..." className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></label>
              <div role="group" aria-label="Filtrar por prioridad" className="flex gap-2 overflow-x-auto">
                {['Todas', 'Alta', 'Media'].map((item) => <button key={item} type="button" aria-pressed={exceptionPriority === item} onClick={() => setExceptionPriority(item)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${exceptionPriority === item ? 'border-[#1e2b58] bg-[#1e2b58] text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>{item === 'Todas' ? 'Todas' : `${item} prioridad`}</button>)}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 md:px-6">
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {filteredExceptions.map((item) => <button key={item.title} type="button" aria-pressed={selectedException === item.title} onClick={() => setSelectedException(item.title)} className={`flex w-full items-start gap-3 p-3.5 text-left transition hover:bg-slate-50 ${selectedException === item.title ? 'bg-indigo-50/70' : 'bg-white'}`}>
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600"><AlertTriangle aria-hidden="true" className="size-4" /></span>
                  <span className="min-w-0 flex-1"><strong className="block text-xs font-semibold text-slate-800">{item.title}</strong><span className="mt-1 block text-[10px] leading-4 text-slate-500">{item.detail}</span><span className="mt-1.5 block text-[10px] font-medium text-slate-500">{item.cases} casos</span></span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.priority === 'Alta' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'}`}>{item.priority}</span>
                  <strong className="w-[76px] shrink-0 pt-1 text-right text-xs font-bold tabular-nums text-slate-800">{item.amount}</strong>
                </button>)}
                {filteredExceptions.length === 0 && <p className="px-4 py-8 text-center text-xs text-slate-500">No se encontraron excepciones.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
