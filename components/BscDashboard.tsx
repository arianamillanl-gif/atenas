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
  Filter,
  LayoutDashboard,
  Menu,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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

const beneficiaries = [
  { name: 'María Fernanda Ruiz', amount: 780400 },
  { name: 'Carlos Mendoza', amount: 624180 },
  { name: 'Ana Sofía Torres', amount: 488900 },
  { name: 'Luis Ramírez', amount: 314650 },
  { name: 'Equipo gerencial', amount: 223370 },
]
const areas = [
  { name: 'Comercial', amount: 920500 },
  { name: 'Operaciones', amount: 618200 },
  { name: 'Marketing', amount: 452180 },
  { name: 'Finanzas', amount: 298700 },
  { name: 'Servicio', amount: 141920 },
]
const commissionTypes = [
  { name: 'Renovación', value: 34, color: '#1d4ed8' },
  { name: 'Venta Nueva', value: 27, color: '#38bdf8' },
  { name: 'On Hand', value: 18, color: '#f59e0b' },
  { name: 'Gerencial', value: 13, color: '#8b5cf6' },
  { name: 'Geomarketing', value: 8, color: '#cbd5e1' },
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

function money(value: number) { return `$${value.toLocaleString('en-US')}` }

export default function BscDashboard() {
  const [view, setView] = useState<'control' | 'analysis'>('control')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ period: 'Julio 2026', area: 'Todas', line: 'Todos', beneficiary: 'Todos', type: 'Todos', status: 'Todos' })
  const [filtersOpen, setFiltersOpen] = useState(true)

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
        <div className="bsc-subnav"><div className="bsc-subnav-bottom"><div className="bsc-module-tabs"><button className="active">Gerencial de Control</button><button>Individual de Comisiones</button><button>Operativo de Cierre</button></div></div></div>

        <div className="bsc-content">
          <section className="bsc-module-banner min-h-[112px]"><div><p className="bsc-eyebrow">BSC · COMISIONES</p><h1 className="text-xl font-bold text-white">Tablero Gerencial de Control de Comisiones</h1><p className="text-xs tracking-wider text-white/80">REVISIÓN, CONCILIACIÓN Y CIERRE MENSUAL</p></div><div className="bsc-banner-actions"><button className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-white/20"><Download aria-hidden="true" /> Exportar PDF</button></div></section>
          <section className={`bsc-filter-card ${filtersOpen ? 'is-open' : 'is-collapsed'}`}><button className="bsc-filter-header" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><div><strong>Filtros de consulta</strong><span>Contexto aplicado: Julio 2026 · Todas las áreas</span></div><ChevronDown aria-hidden="true" /></button>{filtersOpen && <div className="bsc-filter-body"><div className="bsc-filter-grid compact">{([['period', 'Período de cierre'], ['area', 'Área'], ['line', 'Línea de negocio'], ['beneficiary', 'Beneficiario'], ['type', 'Tipo de comisión'], ['status', 'Estado de comisión']] as const).map(([key, label]) => <label key={key}><span>{label}</span><div className="bsc-select"><select value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}><option>{filters[key]}</option><option>Todos</option><option>Todas</option><option>Julio 2026</option><option>Junio 2026</option></select><ChevronDown aria-hidden="true" /></div></label>)}</div><div className="flex items-center justify-end gap-3 pt-2"><button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20"><Filter className="h-4 w-4 text-slate-500" aria-hidden="true" /><span>Más filtros</span></button><button type="button" onClick={clearFilters} className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/20"><X className="h-4 w-4 text-slate-400 transition-colors group-hover:text-red-500" aria-hidden="true" /><span>Limpiar</span></button></div></div>}</section>
          {view === 'control' ? <ControlView /> : <AnalysisView search={search} setSearch={setSearch} filteredRows={filteredRows} />}
        </div>
      </main>
    </div>
  )
}

function ControlView() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  return <>
    <section className="bsc-kpi-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:!grid-cols-7 gap-3 w-full mb-6">{kpis.map(({ label, value, cases, tone, icon: Icon }) => <article className={`bsc-kpi-card ${tone} flex flex-col justify-between h-full !p-4 bg-white rounded-xl border border-slate-200 shadow-sm`} key={label} title={label}><div className="bsc-kpi-top min-w-0"><div className="bsc-kpi-icon"><Icon /></div><div className="min-h-[2.5rem] flex items-center min-w-0"><span className="min-w-0 text-xs font-medium text-slate-700 leading-tight line-clamp-2">{label}</span></div></div><div className="mt-auto"><strong className="block !text-xl font-bold text-slate-900 truncate">{value}</strong><small className="block h-7 text-[11px] leading-tight text-slate-500 line-clamp-2">{cases}</small></div></article>)}</section>
    <div className="bsc-two-col"><section className="bsc-card"><div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100"><h3 className="text-base font-bold text-slate-900 m-0">Excepciones y diferencias de conciliación</h3><button type="button" onClick={() => setIsDetailModalOpen(true)} className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none p-0"><span>Ver detalle</span><ChevronRight className="w-4 h-4" /></button></div><div className="bsc-exception-list">{exceptions.map(([name, level, cases, amount, tone]) => <div className="bsc-exception hover:bg-slate-50/80 transition-all cursor-pointer rounded-lg px-2" key={name}><div className="bsc-exception-icon"><AlertTriangle /></div><div className="bsc-exception-name"><strong>{name}</strong><span>{cases}</span></div><span className={`bsc-severity ${tone} rounded-md px-2 py-1 text-[11px] font-semibold leading-none tracking-wide ${tone === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{level}</span><strong className="bsc-exception-amount tabular-nums font-semibold text-slate-900">{amount}</strong></div>)}</div></section>
      <section className="bsc-card"><div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100"><h3 className="text-base font-bold text-slate-900 m-0">Cierre mensual · Julio 2026</h3><span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>En curso</span></div><div className="bsc-progress-list">{progress.map((item) => <div className="bsc-progress-row" key={item.label}><div className="bsc-progress-meta"><strong>{item.label}</strong><span>{item.count} comisiones · {item.percent}%</span><b>{item.amount}</b></div><div className="bsc-progress-track bg-slate-100 h-2.5 rounded-full overflow-hidden"><i className="block h-full rounded-full" style={{ width: `${item.percent}%`, background: item.color }} /></div></div>)}</div><div className="bsc-total bg-slate-50/70 border border-slate-200/60 rounded-xl p-4"><div><span>Total Comisiones Julio 2026</span><strong>968 comisiones</strong></div><strong className="tabular-nums text-2xl font-bold text-slate-900">$2,431,500</strong></div></section></div>
      {isDetailModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsDetailModalOpen(false) }}><div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="exception-detail-title"><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Revisión de conciliación</p><h2 id="exception-detail-title" className="mt-1 text-lg font-bold text-slate-900">Detalle de excepciones</h2></div><button type="button" onClick={() => setIsDetailModalOpen(false)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar detalle"><X className="h-5 w-5" /></button></div><div className="mt-4 space-y-2">{exceptions.map(([name, level, cases, amount, tone]) => <div className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-3" key={`detail-${name}`}><AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{name}</p><p className="text-xs text-slate-500">{cases}</p></div><span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${tone === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{level}</span><strong className="tabular-nums text-sm font-semibold text-slate-900">{amount}</strong></div>)}</div></div></div>}
  </>
}

function AnalysisView({ search, setSearch, filteredRows }: { search: string; setSearch: (value: string) => void; filteredRows: string[][] }) {
  return <>
    <div className="bsc-analysis-grid"><ChartCard title="Ranking por beneficiario"><ResponsiveContainer width="100%" height={235}><BarChart data={beneficiaries} layout="vertical" margin={{ left: 10, right: 12, top: 5, bottom: 5 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={125} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} /><Tooltip formatter={(v) => money(Number(v))} cursor={{ fill: '#f8fafc' }} /><Bar dataKey="amount" fill="#1d4ed8" radius={[0, 5, 5, 0]} barSize={19} /></BarChart></ResponsiveContainer></ChartCard><ChartCard title="Comisiones por tipo de comisión"><div className="bsc-donut"><ResponsiveContainer width="52%" height={205}><PieChart><Pie data={commissionTypes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={82} paddingAngle={3}>{commissionTypes.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(v) => `${v}%`} /></PieChart></ResponsiveContainer><div className="bsc-legend">{commissionTypes.map((item) => <div key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}%</strong></div>)}</div></div></ChartCard><ChartCard title="Comisiones por área"><ResponsiveContainer width="100%" height={235}><BarChart data={areas} layout="vertical" margin={{ left: 10, right: 12, top: 5, bottom: 5 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={85} tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} /><Tooltip formatter={(v) => money(Number(v))} cursor={{ fill: '#f8fafc' }} /><Bar dataKey="amount" fill="#38bdf8" radius={[0, 5, 5, 0]} barSize={19} /></BarChart></ResponsiveContainer></ChartCard></div>
    <section className="bsc-card bsc-traceability"><div className="bsc-card-heading"><div><h2>Proceso de trazabilidad</h2></div><span className="bsc-muted">Comparativo de registros, alertas y completitud</span></div><div className="bsc-trace-grid">{traceability.map((item) => <div className="bsc-trace-card" key={item.label}><span>{item.label}</span><strong>{item.records}</strong><small>registros</small><div className="bsc-alert-line"><AlertTriangle /> {item.alerts} alertas</div><div className="bsc-complete"><i style={{ width: `${item.complete}%` }} /><strong>{item.complete}%</strong></div><small>completitud</small></div>)}</div></section>
    <section className="bsc-card"><div className="bsc-card-heading"><div><h2>Detalle de controles</h2></div><div className="bsc-table-actions"><div className="bsc-table-search"><Search /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar cliente o beneficiario" /></div><button className="bsc-outline-button"><Download /> Exportar CSV</button></div></div><div className="bsc-table-wrap"><table><thead><tr>{['CLIENTE', 'ÁREA', 'BENEFICIARIO', 'TIPO COMISIÓN', 'MONTO VENTA', 'FACTURA / CXC', 'COBRO', 'REGLA APLICADA'].map((head) => <th key={head}>{head}</th>)}</tr></thead><tbody>{filteredRows.map((row) => <tr key={row[0]}>{row.map((cell, i) => <td key={`${row[0]}-${i}`}>{i === 5 || i === 6 ? <span className={`bsc-table-status ${cell === 'Conciliado' || cell === 'Emitida' ? 'ok' : 'pending'}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div><div className="bsc-pagination"><span>Mostrando {filteredRows.length} de 968 registros</span><div><button aria-label="Anterior"><ChevronLeft /></button><button className="current">1</button><button>2</button><button>3</button><button aria-label="Siguiente"><ChevronRight /></button></div></div></section>
  </>
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="bsc-card bsc-chart-card"><div className="bsc-card-heading"><div><h2>{title}</h2></div><button className="bsc-icon-button" aria-label="Más opciones"><SlidersHorizontal /></button></div>{children}</section> }
