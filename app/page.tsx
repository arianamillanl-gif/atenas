'use client'

import { useMemo, useState } from 'react'
import {
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
  Filter,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
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

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`status-pill ${tone}`}><span className="status-dot" />{children}</span>
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
  const [activeCondition, setActiveCondition] = useState('Todos')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [selected, setSelected] = useState<Sale | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const filteredSales = useMemo(() => sales.filter((sale) => {
    const matchesSearch = `${sale.id} ${sale.client} ${sale.service} ${sale.owner}`.toLowerCase().includes(search.toLowerCase())
    const matchesCondition = activeCondition === 'Todos' || sale.condition === activeCondition
    return matchesSearch && matchesCondition
  }), [search, activeCondition])

  const clearFilters = () => { setSearch(''); setActiveCondition('Todos'); setNotice('Filtros restablecidos') }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">A</div><div><strong>ATENAS</strong><span>Gestión Comercial</span></div><button className="icon-button sidebar-close" aria-label="Cerrar menú"><PanelLeftClose size={16} /></button></div>
        <div className="workspace-switch"><span className="workspace-avatar">LO</span><div><strong>Lo-Fi workspace</strong><span>Operaciones</span></div><ChevronDown size={15} /></div>
        <nav className="nav"><span className="nav-label">MENÚ PRINCIPAL</span><a href="#resumen"><LayoutDashboard size={16} />Resumen</a><a href="#ventas" className="active"><FileCheck2 size={16} />Ventas verificadas<span className="nav-count">6</span></a><a href="#clientes"><UserRound size={16} />Clientes</a><a href="#reportes"><SlidersHorizontal size={16} />Reportes</a><span className="nav-label second">CONFIGURACIÓN</span><a href="#integraciones"><Sparkles size={16} />Integraciones</a><a href="#ajustes"><Settings2 size={16} />Ajustes</a></nav>
        <div className="sidebar-footer"><div className="support-card"><CircleHelp size={17} /><div><strong>¿Necesitas ayuda?</strong><span>Revisa la guía de operación</span></div><ChevronRight size={14} /></div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div><MoreHorizontal size={16} /></div></div>
      </aside>

      <section className="content">
        <header className="topbar"><button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={19} /></button><div className="breadcrumb">Ventas <ChevronRight size={14} /> <strong>Ventas verificadas</strong></div><div className="top-actions"><button className="icon-button" aria-label="Ayuda"><CircleHelp size={18} /></button><button className="icon-button notification" aria-label="Notificaciones"><Bell size={18} /><i /></button><div className="top-user">MG <ChevronDown size={14} /></div></div></header>
        <div className="page-wrap">
          <div className="page-heading"><div><div className="eyebrow"><ShieldCheck size={14} /> CONTROL OPERATIVO / VENTAS</div><h1>Ventas verificadas pendientes de condiciones</h1><p>Supervisa el estado de las condiciones y la integración de tus ventas verificadas.</p></div><div className="heading-actions"><button className="outline-button"><RefreshCw size={15} />Actualizar</button></div></div>

          <section className="kpi-grid" aria-label="Resumen de ventas"><div className="kpi-card"><div className="kpi-icon muted"><FileCheck2 size={17} /></div><span>Sin condiciones</span><strong>2</strong><small>33.3% del total <ArrowUp size={12} /></small></div><div className="kpi-card"><div className="kpi-icon amber"><SlidersHorizontal size={17} /></div><span>En borrador</span><strong>1</strong><small>16.7% del total</small></div><div className="kpi-card"><div className="kpi-icon green"><Check size={17} /></div><span>Vigentes</span><strong>1</strong><small>16.7% del total <ArrowUp size={12} /></small></div><div className="kpi-card"><div className="kpi-icon orange"><AlertTriangle size={17} /></div><span>Observadas / retenidas</span><strong>2</strong><small>Requieren atención <ArrowDown size={12} /></small></div><div className="kpi-card"><div className="kpi-icon red"><AlertTriangle size={17} /></div><span>Error integración</span><strong>1</strong><small>Reintento disponible</small></div></section>

          <section className="panel filters-panel"><button className="panel-title" onClick={() => setFiltersOpen(!filtersOpen)}><span>Filtros avanzados</span><span className="panel-rule" /><span className="filter-summary">{activeCondition === 'Todos' ? 'Todos los registros' : activeCondition}</span><ChevronDown className={filtersOpen ? 'rotate' : ''} size={16} /></button>{filtersOpen && <div className="filters-content"><div className="field-row"><SelectField label="Cliente" placeholder="Seleccionar cliente" /><SelectField label="Ref. venta / Clientify ID" placeholder="Buscar referencia" /><SelectField label="Servicio" placeholder="Todos los servicios" /><SelectField label="Responsable comercial" placeholder="Todos los responsables" /></div><div className="field-row"><label className="field"><span>Fecha econ. desde</span><input placeholder="dd/mm/aaaa" /></label><label className="field"><span>Fecha econ. hasta</span><input placeholder="dd/mm/aaaa" /></label><SelectField label="Estado de condiciones" placeholder="Todos" /><SelectField label="Estado de integración" placeholder="Todos" /></div><div className="filter-footer"><button className="link-button" onClick={clearFilters}><X size={14} />Limpiar filtros</button><button className="dark-button" onClick={() => setNotice('Búsqueda actualizada')}><Search size={14} />Buscar</button></div></div>}</section>

          <section className="panel results-panel" id="ventas"><div className="results-header"><div className="section-title"><strong>Resultados</strong><span className="result-count">{filteredSales.length} registros</span></div><div className="result-tools"><div className="search-box"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar en resultados..." aria-label="Buscar en resultados" /></div><button className="outline-button compact"><Filter size={14} />Filtrar</button></div></div><div className="condition-tabs">{['Todos', 'Sin condiciones', 'En borrador', 'Vigente', 'Observada', 'Retenidas'].map((item) => <button key={item} className={activeCondition === item ? 'tab active' : 'tab'} onClick={() => setActiveCondition(item)}>{item}{item !== 'Todos' && <span>{sales.filter((s) => s.condition === item).length}</span>}</button>)}</div><div className="table-wrap"><table><thead><tr><th>Ref. venta <small>(Clientify ID)</small></th><th>Cliente</th><th>Servicio</th><th>Fecha econ.</th><th className="right">Importe</th><th>Responsable</th><th>Estado origen</th><th>Estado condiciones</th><th>Integración</th><th>Últ. actualización</th><th /></tr></thead><tbody>{filteredSales.map((sale) => <tr key={sale.id}><td><strong>{sale.id}</strong><small>CLF-{sale.id.slice(-6)}</small></td><td>{sale.client}</td><td>{sale.service}</td><td>{sale.date}</td><td className="right"><strong>{sale.amount}</strong><small>USD</small></td><td>{sale.owner}</td><td><StatusPill tone="green">{sale.origin}</StatusPill></td><td><StatusPill tone={conditionTone[sale.condition]}>{sale.condition}</StatusPill></td><td><StatusPill tone={sale.integration === 'OK' ? 'green' : 'red'}>{sale.integration}</StatusPill></td><td className="updated">{sale.updated}</td><td><button className="row-action" onClick={() => setSelected(sale)}>{sale.action}<ChevronRight size={13} /></button><span className="row-menu"><button className="more-button" aria-label={`Más acciones para ${sale.id}`} onClick={() => setOpenMenu(openMenu === sale.id ? null : sale.id)}><MoreHorizontal size={15} /></button>{openMenu === sale.id && <div className="row-menu-popover"><button onClick={() => { setSelected(sale); setOpenMenu(null) }}>Consultar venta</button></div>}</span></td></tr>)}</tbody></table></div><div className="results-footer"><span>Mostrando <strong>{filteredSales.length}</strong> de 6 registros</span><div className="pagination"><button aria-label="Anterior"><ChevronLeft size={14} /></button><button className="current">1</button><button>2</button><button>3</button><button aria-label="Siguiente"><ChevronRight size={14} /></button></div></div></section>
          <footer className="footer"><span>ATENAS · P85-01/02 · Lo-Fi · v0.2</span><span>insight_hub.fct_venta</span></footer>
        </div>
      </section>
      {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow">DETALLE DE VENTA</span><h2>{selected.id}</h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Cerrar detalle"><X size={18} /></button></div><div className="drawer-body"><StatusPill tone={conditionTone[selected.condition]}>{selected.condition}</StatusPill><div className="detail-block"><span>Cliente</span><strong>{selected.client}</strong></div><div className="detail-grid"><div><span>Servicio</span><strong>{selected.service}</strong></div><div><span>Importe</span><strong>{selected.amount} USD</strong></div><div><span>Fecha económica</span><strong>{selected.date}</strong></div><div><span>Responsable</span><strong>{selected.owner}</strong></div></div><div className="attention"><AlertTriangle size={16} /><div><strong>Condiciones pendientes</strong><span>Completa la información requerida para habilitar la venta.</span></div></div></div><div className="drawer-footer"><button className="outline-button" onClick={() => setSelected(null)}>Cancelar</button><button className="primary-button" onClick={() => { setNotice('Venta actualizada'); setSelected(null) }}><Check size={15} />Guardar cambios</button></div></aside></div>}
      {notice && <button className="toast" onClick={() => setNotice('')}><Check size={15} />{notice}<X size={14} /></button>}
    </main>
  )
}
