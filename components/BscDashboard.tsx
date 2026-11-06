'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import AnalyticsCards from './analytics-cards'

const kpis = [
  { label: 'Pendientes de Activación', value: '$439,700', cases: '3 Casos', tone: 'slate', icon: RefreshCw },
  { label: 'En Revisión', value: '$2,431,500', cases: '5 Casos', tone: 'amber', icon: ClipboardCheck },
  { label: 'Observadas', value: '$1,820,100', cases: '2 Casos', tone: 'rose', icon: AlertTriangle },
  { label: 'Listas para Aprobación', value: '$1,987,200', cases: '5 Casos', tone: 'emerald', icon: ShieldCheck },
  { label: 'Pendientes de Pago', value: '$439,700', cases: '2 Casos', tone: 'orange', icon: CircleDollarSign },
  { label: 'Congelado / Diferido', value: '$167,100', cases: '1 Caso', tone: 'violet', icon: BookOpen },
  { label: 'Condición Global Vesper / Calidad', value: '91.4%', cases: '10 Casos · Objetivo ≥ 95%', tone: 'blue', icon: BarChart3 },
]

const progress = [
  { label: 'Listas para aprobación', count: '742', percent: 78.5, amount: '$1,860,097', color: '#1d4ed8' },
  { label: 'Observadas', count: '101', percent: 12.1, amount: '$318,027', color: '#f59e0b' },
  { label: 'Pendientes de ajuste', count: '48', percent: 3.6, amount: '$87,534', color: '#8b5cf6' },
  { label: 'Excluidas del cierre', count: '37', percent: 5.8, amount: '$165,842', color: '#cbd5e1' },
]
const exceptions = [
  ['Diferencias de conciliación', 'Alta', '112 casos', '$127,400', 'critical'],
  ['Comisiones con pagos parciales', 'Alta', '75 casos', '$89,600', 'critical'],
  ['Cobros adelantados con comisión diferida', 'Media', '41 casos', '$54,200', 'medium'],
  ['Multipagos', 'Media', '28 casos', '$32,800', 'medium'],
  ['Pagos englobados', 'Media', '16 casos', '$21,400', 'medium'],
] as const

const monthlyEvolution = [
  { month: 'Ene', value: 1680000 },
  { month: 'Feb', value: 1810000 },
  { month: 'Mar', value: 1760000 },
  { month: 'Abr', value: 2050000 },
  { month: 'May', value: 2180000 },
  { month: 'Jun', value: 2260000 },
  { month: 'Jul', value: 2431500 },
]

const closingImpact = [
  { name: 'Grupo Andino S.A.', type: 'Cliente', value: 284500 },
  { name: 'Inversiones Litoral', type: 'Cliente', value: 198240 },
  { name: 'Red Médica Nacional', type: 'Servicio', value: 156800 },
  { name: 'Constructora Norte', type: 'Cliente', value: 94120 },
  { name: 'Logística Integral', type: 'Servicio', value: 72900 },
]

const traceability = [
  { label: 'Venta', records: 248, alerts: 12, complete: 95 },
  { label: 'Factura / CxC', records: 235, alerts: 18, complete: 92 },
  { label: 'Cobro', records: 198, alerts: 9, complete: 95 },
  { label: 'Regla Comisión', records: 189, alerts: 14, complete: 89 },
  { label: 'Estado de la Comisión', records: 175, alerts: 14, complete: 92 },
]
const rows = [
  ['Grupo Andino S.A.', 'Comercial', 'María F. Ruiz', 'Renovación', '$284,500', 'Emitida', 'Conciliado', 'AT-REN-04'],
  ['Inversiones Litoral', 'Operaciones', 'Carlos Mendoza', 'Venta Nueva', '$198,240', 'Emitida', 'Parcial', 'AT-VN-11'],
  ['Red Médica Nacional', 'Servicio', 'Ana S. Torres', 'On Hand', '$156,800', 'Emitida', 'Conciliado', 'AT-OH-02'],
  ['Constructora Norte', 'Comercial', 'Luis Ramírez', 'Gerencial', '$94,120', 'Pendiente', 'Pendiente', 'AT-GER-09'],
  ['Logística Integral', 'Marketing', 'María F. Ruiz', 'Geomarketing', '$72,900', 'Emitida', 'Conciliado', 'AT-GEO-07'],
]

export default function BscDashboard() {
  const [view, setView] = useState<'control' | 'analysis'>('control')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ period: 'Julio 2026', area: 'Todas', line: 'Todos', beneficiary: 'Todos', type: 'Todos', status: 'Todos' })
  const filteredRows = useMemo(() => rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(search.toLowerCase()))), [search])
  const clearFilters = () => setFilters({ period: 'Julio 2026', area: 'Todas', line: 'Todos', beneficiary: 'Todos', type: 'Todos', status: 'Todos' })

  return (
    <div className="bsc-shell">
      <aside className={`bsc-sidebar ${sidebarOpen ? '' : 'is-collapsed'}`}>
        <div>
          <div className="bsc-brand"><div className="bsc-brand-mark">A</div>{sidebarOpen && <div><strong>ATENAS</strong><span>ERP · v2.0</span></div>}<button className="bsc-icon-button sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Colapsar menú"><Menu /></button></div>
          <div className="bsc-workspace"><div className="bsc-avatar">AT</div>{sidebarOpen && <div><strong>Grupo Atenas</strong><span>Operación global</span></div>}<ChevronDown /></div>
  <nav className="bsc-nav" aria-label="Navegación global">
  <p className="bsc-nav-heading">MENÚ PRINCIPAL</p>
  {[[LayoutDashboard, 'Resumen'], [CircleDollarSign, 'Ventas verificadas'], [Users, 'Clientes'], [BarChart3, 'Reportes']].map(([Icon, label]) => <button key={label as string} className="bsc-nav-item"><Icon />{sidebarOpen && <span>{label}</span>}</button>)}
  <p className="bsc-nav-heading bsc-nav-heading-secondary">GESTIÓN</p>
  {[[Settings2, 'Integraciones'], [ShieldCheck, 'BSC Comisiones']].map(([Icon, label]) => <button key={label as string} className={`bsc-nav-item ${label === 'BSC Comisiones' ? 'active' : ''}`}><Icon />{sidebarOpen && <span>{label}</span>}</button>)}
  </nav>
  </div>
  <div className="bsc-side-footer"><div className="bsc-user"><div className="bsc-avatar user">MG</div>{sidebarOpen && <div><strong>María González</strong><span>Directora General</span></div>}<ChevronDown /></div></div>
      </aside>

      <main className="bsc-main">
        <header className="bsc-topbar"><div className="bsc-search"><Search /><input placeholder="Buscar en ATENAS" aria-label="Buscar" /><kbd>⌘ K</kbd></div><div className="bsc-top-actions"><button className="bsc-icon-button" aria-label="Notificaciones"><Bell /><i /></button><div className="bsc-profile"><div className="bsc-avatar user">MG</div><div><strong>María González</strong><span>Directora General</span></div><ChevronDown /></div></div></header>
                <div className="bsc-content">
          <section className="bsc-module-banner mt-6 mb-4 min-h-0 py-3 px-5"><div><p className="bsc-eyebrow text-[10px] uppercase font-bold tracking-wider text-indigo-300">BSC · COMISIONES</p><h1 className="text-base font-bold tracking-tight text-white">Tablero Gerencial de Control de Comisiones</h1><p className="text-[11px] text-indigo-200 mt-0.5">REVISIÓN, CONCILIACIÓN Y CIERRE MENSUAL</p></div><div className="bsc-banner-actions"><button className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-sm transition-all hover:bg-white/20"><Download aria-hidden="true" /> Exportar PDF</button></div></section>

          <section className="bsc-filter-bar bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm mb-6" aria-label="Filtros de consulta"><div className="bsc-filter-controls gap-3">{([['period', 'Período de cierre'], ['area', 'Área'], ['line', 'Línea de negocio'], ['beneficiary', 'Beneficiario'], ['type', 'Tipo de comisión'], ['status', 'Estado de comisión']] as const).map(([key, label]) => <label key={key}><span>{label}</span><div className="bsc-select"><select value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}><option>{filters[key]}</option><option>Todos</option><option>Todas</option><option>Julio 2026</option><option>Junio 2026</option></select><ChevronDown aria-hidden="true" /></div></label>)}<button type="button" onClick={clearFilters} className="bsc-filter-clear"><X aria-hidden="true" /><span>Limpiar</span></button></div></section>
          <nav className="mb-6 flex items-center gap-1 border-b border-slate-200 px-1" aria-label="Vista del tablero"><button type="button" onClick={() => setView('control')} className={`relative px-4 py-3 text-sm transition-colors ${view === 'control' ? 'font-semibold text-blue-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-600' : 'font-medium text-slate-500 hover:text-slate-800'}`}>Control General del Cierre</button><button type="button" onClick={() => setView('analysis')} className={`relative px-4 py-3 text-sm transition-colors ${view === 'analysis' ? 'font-semibold text-blue-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue-600' : 'font-medium text-slate-500 hover:text-slate-800'}`}>Análisis y Trazabilidad</button></nav>
          {view === 'control' ? <ControlView /> : <AnalysisView search={search} setSearch={setSearch} filteredRows={filteredRows} />}
        </div>
      </main>
    </div>
  )
}

function ControlView() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [detailSearch, setDetailSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'Todas' | 'Alta' | 'Media'>('Todas')
  const visibleExceptions = exceptions.filter(([name, level]) => {
    const matchesSearch = name.toLowerCase().includes(detailSearch.toLowerCase())
    const matchesPriority = priorityFilter === 'Todas' || level === priorityFilter
    return matchesSearch && matchesPriority
  })

  return <>
    <section className="bsc-kpi-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:!grid-cols-7 gap-1.5 w-full mb-4">{kpis.map(({ label, value, cases, tone, icon: Icon }) => <article className={`bsc-kpi-card ${tone} flex min-w-0 flex-col justify-between h-full !p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm`} key={label} title={label}><div className="bsc-kpi-top min-w-0"><div className="bsc-kpi-icon"><Icon /></div><div className="flex min-h-[2rem] min-w-0 items-center"><span className="min-w-0 text-[9px] font-medium leading-[1.15] text-slate-700">{label}</span></div></div><div className="mt-1.5"><strong className="block whitespace-nowrap text-base font-bold tabular-nums text-slate-900">{value}</strong><small className="mt-0.5 block min-h-6 text-[10px] leading-tight text-slate-500">{cases}</small></div></article>)}</section>
    <div className="bsc-two-col"><section className="bsc-card"><div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100"><h3 className="text-base font-bold text-slate-900 m-0">Excepciones y diferencias de conciliación</h3><button type="button" onClick={() => setIsDetailModalOpen(true)} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none p-0"><span>Ver detalle</span><ChevronRight className="w-4 h-4" /></button></div><div className="bsc-exception-list">{exceptions.map(([name, level, cases, amount, tone]) => <div className="bsc-exception hover:bg-slate-50/80 transition-all cursor-pointer rounded-lg px-2" key={name}><div className="bsc-exception-icon"><AlertTriangle /></div><div className="bsc-exception-name"><strong>{name}</strong><span>{cases}</span></div><span className={`bsc-severity ${tone} rounded-md px-2 py-1 text-[11px] font-semibold leading-none tracking-wide ${tone === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{level}</span><strong className="bsc-exception-amount tabular-nums font-semibold text-slate-900">{amount}</strong></div>)}</div></section>
      <section className="bsc-card"><div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100"><h3 className="text-base font-bold text-slate-900 m-0">Cierre mensual · Julio 2026</h3><span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>En curso</span></div><div className="bsc-progress-list">{progress.map((item) => <div className="bsc-progress-row" key={item.label}><div className="bsc-progress-meta"><strong>{item.label}</strong><span>{item.count} comisiones · {item.percent}%</span><b>{item.amount}</b></div><div className="bsc-progress-track bg-slate-100 h-2.5 rounded-full overflow-hidden"><i className="block h-full rounded-full" style={{ width: `${item.percent}%`, background: item.color }} /></div></div>)}</div><div className="bsc-total bg-slate-50/70 border border-slate-200/60 rounded-xl p-4"><div><span>Total Comisiones Julio 2026</span><strong>968 comisiones</strong></div><strong className="tabular-nums text-2xl font-bold text-slate-900">$2,431,500</strong></div></section></div>
      {isDetailModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsDetailModalOpen(false) }}><div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="exception-detail-title"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Revisión de conciliación</p><h2 id="exception-detail-title" className="mt-1 text-xl font-bold text-slate-900">Detalle de excepciones</h2><p className="mt-1 text-sm text-slate-500">Casos que requieren seguimiento antes del cierre mensual.</p></div><button type="button" onClick={() => setIsDetailModalOpen(false)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar detalle"><X className="h-5 w-5" /></button></div><div className="mt-5 mb-6 flex items-center justify-between gap-4 rounded-xl bg-slate-900 p-4 text-white"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-300">Impacto Total en Excepciones</p><strong className="mt-1 block text-lg font-bold">262 casos · $333,600</strong></div><AlertTriangle className="h-6 w-6 text-amber-300" aria-hidden="true" /></div><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-xs"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /><input value={detailSearch} onChange={(event) => setDetailSearch(event.target.value)} placeholder="Buscar excepción..." aria-label="Buscar excepción" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></div><div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por prioridad">{(['Todas', 'Alta', 'Media'] as const).map((filter) => <button key={filter} type="button" onClick={() => setPriorityFilter(filter)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${priorityFilter === filter ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>{filter === 'Alta' ? 'Alta prioridad' : filter === 'Media' ? 'Media prioridad' : 'Todas'}</button>)}</div></div><div className="space-y-0.5">{visibleExceptions.length > 0 ? visibleExceptions.map(([name, level, cases, amount, tone]) => <div className="mb-2.5 flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 transition-all hover:border-slate-300 hover:shadow-sm" key={`detail-${name}`}><div className="flex min-w-0 items-center gap-3"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{name}</p><p className="text-xs text-slate-500">{cases}</p></div></div><div className="flex shrink-0 items-center gap-3"><span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${tone === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{level}</span><strong className="min-w-[5.5rem] text-right tabular-nums text-sm font-bold text-slate-900">{amount}</strong><ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" /></div></div>) : <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">No se encontraron excepciones con estos filtros.</div>}</div></div></div>}
  </>
}

function AnalysisView({ search, setSearch, filteredRows }: { search: string; setSearch: (value: string) => void; filteredRows: string[][] }) {
  const visibleRows = filteredRows

  return <>
    <AnalyticsCards />
<section className="mb-5 grid w-full grid-cols-1 gap-4 lg:grid-cols-12">
  <article className="bsc-card min-w-0 lg:col-span-7">

        <div className="bsc-card-heading"><div><h2 className="!text-xs !font-bold">Evolución mensual</h2><span className="bsc-muted !text-[10px] !text-slate-500">Histórico de cierre · ID S4-G05</span></div><span className="bsc-muted !text-[10px] !text-slate-500">Julio 2026</span></div>
        <div className="h-40 w-full pt-1" aria-label="Evolución mensual del cierre por comisiones">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyEvolution} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} width={42} />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString('en-US')}`, 'Cierre']} labelFormatter={(label) => `${label} 2026`} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#1d4ed8" strokeWidth={2.5} dot={{ r: 3, fill: '#1d4ed8', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="bsc-card min-w-0 !p-3 lg:col-span-5">
        <div className="bsc-card-heading !mb-2"><div><h2 className="!text-xs !font-bold">Cliente o Servicio que inciden en el Cierre por Comisiones</h2><span className="bsc-muted !text-[10px] !text-slate-500">Ranking de impacto en el periodo</span></div></div>
        <div className="overflow-x-auto pt-0.5"><table className="w-full text-left text-[11px]"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500"><th className="py-1.5 font-semibold">Cuenta / servicio</th><th className="py-1.5 font-semibold">Tipo</th><th className="py-1.5 text-right font-semibold">Impacto</th></tr></thead><tbody>{closingImpact.map((item) => <tr key={item.name} className="border-b border-slate-50 last:border-0"><td className="py-1.5 font-medium text-slate-700">{item.name}</td><td className="py-1.5 font-medium text-slate-500">{item.type}</td><td className="py-1.5 text-right font-bold tabular-nums text-slate-900">${item.value.toLocaleString('en-US')}</td></tr>)}</tbody></table></div>
      </article>
    </section>
    <section className="bsc-card bsc-traceability !rounded-xl !border-slate-200/80 !p-4 !shadow-sm"><div className="bsc-card-heading"><div><h2>Trazabilidad del proceso</h2></div><span className="bsc-muted">Comparativo de registros, alertas y completitud</span></div><div className="bsc-trace-grid">{traceability.map((item) => <article className="bsc-trace-card" key={item.label}><span className="bsc-trace-label">{item.label}</span><div className="bsc-trace-count"><strong>{item.records}</strong><small>registros</small></div><div className="bsc-alert-line"><AlertTriangle aria-hidden="true" /> <span>{item.alerts} alertas</span></div><div className="bsc-complete"><div className="bsc-complete-meta"><span>Completitud</span><strong>{item.complete}%</strong></div><div className="bsc-complete-track" role="progressbar" aria-label={`Completitud de ${item.label}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.complete}><i style={{ width: `${item.complete}%` }} /></div></div></article>)}</div></section>
    <section className="bsc-card"><div className="flex flex-col gap-4 border-b border-slate-200/60 pb-4 mb-4 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-base font-bold text-slate-900">Detalle de control de comisiones</h2><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="bsc-table-search max-w-xs"><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o beneficiario" /></div><button className="bsc-outline-button"><Download /> Exportar CSV</button></div></div>{/* Filtros de pestañas superiores */}
	<div className="mb-4 flex items-center gap-2">
  {[
    { name: "Todos", count: 5, active: true },
    { name: "Pendientes", count: 1, active: false },
    { name: "Conciliados", count: 3, active: false },
    { name: "Con excepciones", count: 2, active: false },
  ].map((tab, idx) => (
    <button
      key={idx}
      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
        tab.active
          ? "bg-indigo-50 text-indigo-700 shadow-sm"
          : "bg-transparent text-slate-600 hover:text-slate-900"
      }`}
    >
      <span>{tab.name}</span>
      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${tab.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
        {tab.count}
      </span>
    </button>
  ))}
</div><div className="bsc-table-wrap"><table><thead><tr>{['CLIENTE', 'ÁREA', 'BENEFICIARIO', 'TIPO COMISIÓN', 'MONTO VENTA', 'FACTURA / CXC', 'COBRO', 'REGLA APLICADA'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{visibleRows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${i}`}>{i === 5 || i === 6 ? (() => { const isPositive = cell === 'Conciliado' || cell === 'Emitida'; const StatusIcon = isPositive ? ShieldCheck : AlertTriangle; return <span className={`bsc-table-status ${isPositive ? 'ok' : 'pending'}`}><StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />{cell}</span> })() : cell}</td>)}</tr>)}</tbody></table></div>{/* Paginador inferior derecho */}
<div className="flex items-center justify-end gap-1.5 mt-4">
  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-transparent text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100" aria-label="Página anterior">
    &lt;
  </button>
  {[1, 2, 3].map((page) => (
    <button
      key={page}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium transition-colors ${
        page === 1
          ? "border-[#1e1b4b] bg-[#1e1b4b] text-white shadow-sm"
          : "bg-transparent text-slate-600 hover:bg-slate-100"
      }`}
    >
      {page}
    </button>
  ))}
  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-transparent text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100" aria-label="Página siguiente">
    &gt;
  </button>
</div></section>
  </>
}

