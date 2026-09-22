'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  LayoutDashboard,
  Lock,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react'

type Sale = {
  id: string
  client: string
  service: string
  date: string
  amount: string
  owner: string
  origin: 'Verificado' | 'Pendiente'
  condition: 'Sin condiciones' | 'En borrador' | 'Vigente' | 'Observada' | 'Retenidas'
  integration: 'OK' | 'Error integración'
  updated: string
  action: string
}

const sales: Sale[] = [
  { id: 'CLF-2026-00441', client: 'Empresa Alfa C.A.', service: 'Consultoría ERP', date: '02/08/2026', amount: '4,800.00', owner: 'M. González', origin: 'Verificado', condition: 'Sin condiciones', integration: 'OK', updated: '07/08/2026 09:14', action: 'Completar condiciones' },
  { id: 'CLF-2026-00438', client: 'Distribuidora Beta', service: 'Licencia Software', date: '01/08/2026', amount: '1,200.00', owner: 'C. Pérez', origin: 'Verificado', condition: 'En borrador', integration: 'OK', updated: '06/08/2026 16:52', action: 'Continuar borrador' },
  { id: 'CLF-2026-00430', client: 'Grupo Gamma Ltd.', service: 'Soporte Anual', date: '29/07/2026', amount: '620.00', owner: 'L. Rodríguez', origin: 'Verificado', condition: 'Vigente', integration: 'OK', updated: '04/08/2026 08:05', action: 'Completar condiciones' },
  { id: 'CLF-2026-00427', client: 'Servicios Delta', service: 'Implementación', date: '28/07/2026', amount: '9,500.00', owner: 'M. González', origin: 'Verificado', condition: 'Observada', integration: 'OK', updated: '06/08/2026 16:52', action: 'Completar condiciones' },
  { id: 'CLF-2026-00419', client: 'Inversiones Epsilon', service: 'Consultoría ERP', date: '25/07/2026', amount: '3,100.00', owner: 'A. Torres', origin: 'Verificado', condition: 'Retenidas', integration: 'OK', updated: '03/08/2026 14:22', action: 'Completar condiciones' },
  { id: 'CLF-2026-00412', client: 'Tech Zeta S.A.', service: 'Licencia Software', date: '22/07/2026', amount: '2,400.00', owner: 'C. Pérez', origin: 'Verificado', condition: 'Sin condiciones', integration: 'Error integración', updated: '02/08/2026 17:48', action: 'Reintentar' },
]

const conditionTone: Record<Sale['condition'], string> = {
  'Sin condiciones': 'neutral',
  'En borrador': 'amber',
  Vigente: 'green',
  Observada: 'orange',
  Retenidas: 'red',
}

function StatusPill({ children, tone = 'neutral', icon: Icon = FileCheck2 }: { children: React.ReactNode; tone?: string; icon?: typeof Check }) {
  return <span className={`status-pill ${tone}`}><Icon size={13} strokeWidth={2.25} />{children}</span>
}

const conditionIcon: Record<Sale['condition'], typeof Check> = {
  'Sin condiciones': FileCheck2,
  'En borrador': SlidersHorizontal,
  Vigente: Check,
  Observada: AlertTriangle,
  Retenidas: AlertTriangle,
}

function OriginPill({ origin }: { origin: Sale['origin'] }) {
  return <StatusPill tone={origin === 'Verificado' ? 'green' : 'amber'} icon={origin === 'Verificado' ? Check : AlertCircle}>{origin}</StatusPill>
}

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return <span className="action-tooltip" data-tooltip={label}>{children}</span>
}

const actionCopy: Record<string, { label: string; tooltip: string }> = {
  'Completar condiciones': { label: 'Completar', tooltip: 'Completar y verificar condiciones comerciales' },
  'Continuar borrador': { label: 'Continuar', tooltip: 'Continuar edición del borrador' },
  'Reintentar integración': { label: 'Reintentar', tooltip: 'Reintentar proceso de integración' },
}

function SelectField({ label, value, placeholder }: { label: string; value?: string; placeholder: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <button type="button" className="select-field"><span className={value ? 'selected' : ''}>{value ?? placeholder}</span><ChevronDown size={14} /></button>
    </label>
  )
}

export default function Page() {
  const [search, setSearch] = useState('')
  const [searchDraft, setSearchDraft] = useState('')
  const [activeCondition, setActiveCondition] = useState('Todos')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [dateFromDisplay, setDateFromDisplay] = useState('')
  const [dateToDisplay, setDateToDisplay] = useState('')
  const [paymentDays, setPaymentDays] = useState('15')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [confirmation, setConfirmation] = useState<'draft' | 'confirm' | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [selected, setSelected] = useState<Sale | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchDraft), 300)
    return () => window.clearTimeout(timer)
  }, [searchDraft])

  const filteredSales = useMemo(() => sales.filter((sale) => {
    const matchesSearch = `${sale.id} ${sale.client} ${sale.service} ${sale.owner}`.toLowerCase().includes(search.toLowerCase())
    const matchesCondition = activeCondition === 'Todos' || sale.condition === activeCondition
    return matchesSearch && matchesCondition
  }), [search, activeCondition])

  const clearFilters = () => { setSearch(''); setSearchDraft(''); setActiveCondition('Todos'); setDateFrom(''); setDateTo(''); setDateFromDisplay(''); setDateToDisplay(''); setNotice('Filtros restablecidos') }
  const applyFilters = () => { setSearch(searchDraft); setNotice('Búsqueda actualizada') }
  const openSale = (sale: Sale) => { setSelected(sale); setPaymentDays('15'); setNotes(''); setValidationError('') }
  const submitSale = (mode: 'draft' | 'confirm') => { const days = Number(paymentDays); if (days > 30) { setValidationError('El plazo de pago no puede superar los 30 días permitidos.'); return } setConfirmation(mode) }
  const confirmSale = () => { if (!confirmation) return; setSaving(true); window.setTimeout(() => { setSaving(false); setConfirmation(null); setNotice(confirmation === 'draft' ? 'Venta guardada como borrador' : 'Venta confirmada y aplicada'); setSelected(null) }, 700) }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <header className="brand"><img src="/logo-atenas.png" alt="ATENAS Grupo Consultor" className="h-9 md:h-10 w-auto object-contain bg-transparent" /><button className="icon-button sidebar-close" aria-label={isCollapsed ? 'Expandir menú' : 'Contraer menú'} onClick={() => setIsCollapsed((collapsed) => !collapsed)}>{isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button></header>
        <div className="sidebar-content"><div className="workspace-switch"><span className="workspace-avatar">LO</span><div><strong>Lo-Fi workspace</strong><span>Operaciones</span></div><ChevronDown size={15} /></div>
        <nav className="nav"><span className="nav-label">MENÚ PRINCIPAL</span><a href="#resumen"><LayoutDashboard size={16} />Resumen</a><a href="#ventas" className="active"><FileCheck2 size={16} />Ventas verificadas<span className="nav-count">6</span></a><a href="#clientes"><UserRound size={16} />Clientes</a><a href="#reportes"><SlidersHorizontal size={16} />Reportes</a><span className="nav-label second">CONFIGURACIÓN</span><a href="#integraciones"><Sparkles size={16} />Integraciones</a><a href="#ajustes"><Settings2 size={16} />Ajustes</a></nav></div>
        <footer className="sidebar-footer"><div className="support-card"><CircleHelp size={17} /><div><strong>¿Necesitas ayuda?</strong><span>Revisa la guía de operación</span></div><ChevronRight size={14} /></div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div><MoreHorizontal size={16} /></div></footer>
      </aside>

      <section className="content">
        <header className="topbar"><button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={19} /></button><div className="breadcrumb">Ventas <ChevronRight size={14} /> <strong>Ventas verificadas</strong></div><div className="top-actions"><button className="icon-button" aria-label="Ayuda"><CircleHelp size={18} /></button><button className="icon-button notification" aria-label="Notificaciones"><Bell size={18} /><i /></button><div className="top-user">MG <ChevronDown size={14} /></div></div></header>
        <div className="page-wrap">
          <div className="page-heading"><div><div className="eyebrow"><ShieldCheck size={14} /> CONTROL OPERATIVO / VENTAS</div><h1>Ventas verificadas pendientes de condiciones</h1><p>Supervisa el estado de las condiciones y la integración de tus ventas verificadas.</p></div><div className="heading-actions"><button className="outline-button"><RefreshCw size={15} />Actualizar</button></div></div>

          <section className="kpi-grid" aria-label="Resumen de ventas"><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon muted"><FileCheck2 size={17} /></div><span>Sin condiciones</span></div><strong>2</strong><small>33.3% del total <ArrowUp size={12} /></small></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon amber"><SlidersHorizontal size={17} /></div><span>En borrador</span></div><strong>1</strong><small>16.7% del total</small></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon green"><Check size={17} /></div><span>Vigentes</span></div><strong>1</strong><small>16.7% del total <ArrowUp size={12} /></small></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon orange"><AlertTriangle size={17} /></div><span>Observadas / retenidas</span></div><strong>2</strong><small>Requieren atención <ArrowDown size={12} /></small></div><div className="kpi-card"><div className="kpi-top"><div className="kpi-icon red"><AlertTriangle size={17} /></div><span>Error integración</span></div><strong>1</strong><small>Reintento disponible</small></div></section>

          <section className="panel filters-panel"><button className="panel-title" onClick={() => setFiltersOpen(!filtersOpen)}><span>Filtros avanzados</span><span className="panel-rule" /><span className="filter-summary">{activeCondition === 'Todos' ? 'Todos los registros' : activeCondition}</span><ChevronDown className={filtersOpen ? 'rotate' : ''} size={16} /></button>{filtersOpen && <div className="filters-content"><div className="field-row"><SelectField label="Cliente" placeholder="Seleccionar cliente" /><label className="field"><span>Ref. venta / Clientify ID</span><input value={searchDraft} onChange={(e) => setSearchDraft(e.target.value)} placeholder="Buscar referencia" /></label><SelectField label="Servicio" placeholder="Todos los servicios" /><SelectField label="Responsable comercial" placeholder="Todos los responsables" /></div><div className="field-row"><label className="field"><span>Fecha econ. desde</span><input inputMode="numeric" value={dateFromDisplay} onChange={(e) => { const digits = e.target.value.replace(/\D/g, '').slice(0, 8); const display = digits.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3').replace(/\/$/, ''); const [day, month, year] = display.split('/'); setDateFromDisplay(display); setDateFrom(day?.length === 2 && month?.length === 2 && year?.length === 4 ? `${year}-${month}-${day}` : '') }} placeholder="DD/MM/AAAA" aria-label="Fecha económica desde" /></label><label className="field"><span>Fecha econ. hasta</span><input inputMode="numeric" value={dateToDisplay} onChange={(e) => { const digits = e.target.value.replace(/\D/g, '').slice(0, 8); const display = digits.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3').replace(/\/$/, ''); const [day, month, year] = display.split('/'); setDateToDisplay(display); setDateTo(day?.length === 2 && month?.length === 2 && year?.length === 4 ? `${year}-${month}-${day}` : '') }} placeholder="DD/MM/AAAA" aria-label="Fecha económica hasta" /></label><SelectField label="Estado de condiciones" placeholder="Todos" /><SelectField label="Estado de integración" placeholder="Todos" /></div><div className="filter-footer"><button className="link-button" onClick={clearFilters}><X size={14} />Limpiar filtros</button><button className="dark-button" onClick={applyFilters}><Search size={14} />Buscar</button></div></div>}</section>

          <section className="panel results-panel" id="ventas"><div className="results-header"><div className="section-title"><strong>Resultados</strong><span className="result-count">{filteredSales.length} registros</span></div><span className="result-filter-note">Usa los filtros avanzados para buscar</span></div><div className="condition-tabs">{['Todos', 'Sin condiciones', 'En borrador', 'Vigente', 'Observada', 'Retenidas'].map((item) => <button key={item} className={activeCondition === item ? 'tab active' : 'tab'} onClick={() => setActiveCondition(item)}>{item}{item !== 'Todos' && <span>{sales.filter((s) => s.condition === item).length}</span>}</button>)}</div><div className="table-scroll w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm p-1"><table><thead><tr><th className="col-ref">Ref. venta <small>(Clientify ID)</small></th><th className="col-client">Cliente</th><th>Servicio</th><th>Fecha econ.</th><th className="col-amount right">Importe</th><th>Responsable</th><th className="col-origin">Estado origen</th><th className="col-condition">Estado condiciones</th><th className="col-integration">Integración</th><th className="col-updated">Últ. actualización</th><th className="col-actions" /></tr></thead><tbody>{filteredSales.map((sale) => <tr key={sale.id}><td className="col-ref"><strong>{sale.id}</strong><small>CLF-{sale.id.slice(-6)}</small></td><td className="col-client">{sale.client}</td><td>{sale.service}</td><td>{sale.date}</td><td className="col-amount right"><strong>{sale.amount}</strong><small>USD</small></td><td>{sale.owner}</td><td className="col-origin"><OriginPill origin={sale.origin} /></td><td className="col-condition"><StatusPill tone={conditionTone[sale.condition]} icon={conditionIcon[sale.condition]}>{sale.condition}</StatusPill></td><td className="col-integration"><StatusPill tone={sale.integration === 'OK' ? 'green' : 'red'} icon={sale.integration === 'OK' ? Check : AlertCircle}>{sale.integration}</StatusPill></td><td className="updated col-updated">{sale.updated}</td><td><span className="actions-cell"><Tooltip label={(actionCopy[sale.action] ?? { tooltip: sale.action }).tooltip}><button className="row-action h-8 py-1 px-4 text-[12px] font-semibold bg-[#2A4B93] hover:bg-[#223d78] text-white inline-flex items-center gap-1.5 rounded-full transition-all" onClick={() => openSale(sale)}>{(actionCopy[sale.action] ?? { label: sale.action.split(' ')[0] }).label}<ChevronRight size={14} /></button></Tooltip><span className="row-menu"><button className="more-button" aria-label={`Más acciones para ${sale.id}`} onClick={() => setOpenMenu(openMenu === sale.id ? null : sale.id)}><MoreHorizontal size={15} /></button>{openMenu === sale.id && <div className="row-menu-popover"><button onClick={() => { setSelected(sale); setOpenMenu(null) }}>Consultar venta</button></div>}</span></span></td></tr>)}</tbody></table></div><div className="results-footer"><span>Mostrando <strong>{filteredSales.length}</strong> de 6 registros</span><div className="pagination"><button aria-label="Anterior"><ChevronLeft size={14} /></button><button className="current">1</button><button>2</button><button>3</button><button aria-label="Siguiente"><ChevronRight size={14} /></button></div></div></section>
          <footer className="footer"><span>ATENAS · P85-01/02 · Lo-Fi · v0.2</span><span>insight_hub.fct_venta</span></footer>
        </div>
      </section>
      {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow">DETALLE DE VENTA</span><h2>{selected.id}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Cerrar detalle"><X size={18} /></button></div><div className="drawer-body"><span className="drawer-status"><StatusPill tone={conditionTone[selected.condition]}>{selected.condition}</StatusPill></span>{validationError && <div className="validation-summary"><AlertTriangle size={16} /><div><strong>Revisa la información</strong><span>{validationError}</span></div></div>}<div className="detail-field readonly"><span>Cliente <Lock size={12} /></span><strong>{selected.client}</strong></div><div className="detail-grid"><div className="detail-field readonly"><span>Clientify ID <Lock size={12} /></span><strong>{selected.id}</strong></div><div className="detail-field readonly"><span>Monto total <Lock size={12} /></span><strong>{selected.amount} USD</strong></div><div className="detail-field editable"><label htmlFor="payment-days">Plazo de pago</label><input id="payment-days" type="number" min="0" max="30" value={paymentDays} onChange={(e) => { setPaymentDays(e.target.value); setValidationError('') }} /><small>días</small></div><div className="detail-field editable"><label htmlFor="commercial-conditions">Condiciones comerciales</label><input id="commercial-conditions" defaultValue="Pago contra entrega" /></div></div><div className="detail-field calculated"><span>Comisión proyectada</span><strong>{selected.amount} × 3% = $144.00 USD</strong></div><div className="detail-field editable"><label htmlFor="sale-notes">Notas</label><textarea id="sale-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Añade una nota opcional" /></div></div><div className="drawer-footer"><button className="outline-button" onClick={() => submitSale('draft')} disabled={saving}>Guardar como borrador</button><button className="primary-button" onClick={() => submitSale('confirm')} disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />}Confirmar y Aplicar</button></div></aside></div>}
      {confirmation && <div className="confirmation-backdrop" role="presentation"><section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="confirmation-title"><h2 id="confirmation-title">¿Confirmar y aplicar condiciones de venta?</h2><p>Estás a punto de actualizar las condiciones comerciales de la venta <strong>{selected?.id ?? 'CLF-2026-00441'}</strong>. Esta acción registrará la transacción en el historial de auditoría.</p><div className="confirmation-actions"><button className="modal-cancel" onClick={() => setConfirmation(null)} disabled={saving}>Cancelar</button><button className="modal-confirm" onClick={confirmSale} disabled={saving}>{saving ? <LoaderCircle className="spin" size={15} /> : <Check size={15} />}Sí, aplicar cambios</button></div></section></div>}
      {notice && <button className="toast" onClick={() => setNotice('')}><Check size={15} />{notice}<X size={14} /></button>}
    </main>
  )
}
