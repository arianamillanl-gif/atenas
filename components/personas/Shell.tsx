import Link from 'next/link'
import {
  ArrowLeftRight,
  BadgeCheck,
  BriefcaseBusiness,
  Bell,
  FileSearch,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Menu,
  MoreHorizontal,
  Network,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Users,
} from 'lucide-react'

type NavKey = 'bsc' | 'ventas' | 'cobro' | 'registrar' | 'aplicacion' | 'cartera' | 'asignaciones' | 'estructuras' | 'personas' | 'servicios'

const NAV_ROUTES: Record<NavKey, string> = {
  bsc: '/bsc-comisiones',
  ventas: '/ventas-verificadas',
  cobro: '/bsc-comisiones?view=cobro-ingreso',
  registrar: '/bsc-comisiones?view=registrar-ingresos',
  aplicacion: '/cobro-ingreso',
  cartera: '/maestro-cartera',
  asignaciones: '/asignaciones',
  estructuras: '/estructuras',
  personas: '/personas',
  servicios: '/servicios',
}

function NavLink({ id, active, children }: { id: NavKey; active: NavKey; children: React.ReactNode }) {
  const isActive = id === active
  return (
    <Link href={NAV_ROUTES[id] ?? `#${id}`} className={isActive ? 'active' : undefined} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  )
}

export function Sidebar({ collapsed = false, onToggle = () => {}, active = 'personas' }: { collapsed?: boolean; onToggle?: () => void; active?: NavKey }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <header className="brand">
        <img src="/logo-atenas.png" alt="ATENAS Grupo Consultor" />
        <button className="icon-button sidebar-close" onClick={onToggle} aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}>
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </header>
      <div className="sidebar-content">
        <div className="workspace-switch">
          <span className="workspace-avatar">LO</span>
          <div>
            <strong>Lo-Fi workspace</strong>
            <span>Tesorería</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="nav" aria-label="Menú principal">
          <span className="nav-label">DIRECCIÓN Y COMISIONES</span>
          <NavLink id="bsc" active={active}><BriefcaseBusiness size={16} />BSC Comisiones</NavLink>
          <span className="nav-label">OPERACIÓN COMERCIAL</span>
          <NavLink id="ventas" active={active}><BadgeCheck size={16} />Ventas verificadas</NavLink>
          <span className="nav-label">TESORERÍA Y COBRANZAS</span>
          <NavLink id="cobro" active={active}><CreditCard size={16} />Cobro/Ingreso</NavLink>
          <NavLink id="registrar" active={active}><ArrowLeftRight size={16} />Registrar ingresos</NavLink>
          <NavLink id="aplicacion" active={active}><FileSearch size={16} />Aplicación de ingresos a cuentas por cobrar</NavLink>
          <span className="nav-label">CARTERA Y ESTRUCTURA</span>
          <NavLink id="cartera" active={active}><FileSearch size={16} />Maestro de cartera</NavLink>
          <NavLink id="asignaciones" active={active}><ArrowLeftRight size={16} />Asignación de cartera</NavLink>
          <NavLink id="estructuras" active={active}><Network size={16} />Estructura comercial</NavLink>
          <NavLink id="personas" active={active}><Users size={16} />Personas</NavLink>
          <NavLink id="servicios" active={active}><Package size={16} />Servicios</NavLink>
        </nav>
      </div>
      <footer className="sidebar-footer">
        <div className="support-card">
          <CircleHelp size={17} />
          <div>
            <strong>¿Necesitas ayuda?</strong>
            <span>Revisa la guía de operación</span>
          </div>
          <ChevronRight size={14} />
        </div>
        <div className="user-card">
          <div className="user-avatar">MG</div>
          <div>
            <strong>María González</strong>
            <span>Administradora</span>
          </div>
          <MoreHorizontal size={16} />
        </div>
      </footer>
    </aside>
  )
}

export function Topbar({ section = 'Gestión de talento' }: { section?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6">
      <div className="flex items-center gap-3">
        <button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={19} /></button>
        <span className="workspace-top-pill"><span />Lo-Fi workspace · {section}</span>
      </div>
      <div className="top-actions">
        <label className="quick-search">
          <Search size={14} />
          <span className="sr-only">Búsqueda rápida</span>
          <input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" />
        </label>
        <button className="icon-button notification" aria-label="Notificaciones, hay elementos nuevos"><Bell size={18} /><i aria-hidden="true" /></button>
        <span className="top-user"><span className="user-avatar">MG</span>María González<ChevronDown size={14} /></span>
      </div>
    </header>
  )
}
