import Link from 'next/link'
import {
  ArrowLeftRight,
  Bell,
  FileSearch,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Network,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Users,
} from 'lucide-react'

type NavKey = 'resumen' | 'personas' | 'servicios' | 'cartera' | 'asignaciones' | 'unidades' | 'estructuras' | 'gobernanza' | 'ajustes'

const NAV_ROUTES: Partial<Record<NavKey, string>> = {
  personas: '/personas',
  servicios: '/servicios',
  cartera: '/maestro-cartera',
  asignaciones: '/asignaciones',
  estructuras: '/estructuras',
}

function NavLink({ id, active, children }: { id: NavKey; active: NavKey; children: React.ReactNode }) {
  const isActive = id === active
  return (
    <Link href={NAV_ROUTES[id] ?? `#${id}`} className={isActive ? 'active' : undefined} aria-current={isActive ? 'page' : undefined}>
      {children}
    </Link>
  )
}

export function Sidebar({ collapsed, onToggle, active = 'personas' }: { collapsed: boolean; onToggle: () => void; active?: NavKey }) {
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
            <span>Gestión de talento</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <nav className="nav" aria-label="Menú principal">
          <span className="nav-label">MENÚ PRINCIPAL</span>
          <NavLink id="resumen" active={active}><LayoutDashboard size={16} />Resumen</NavLink>
          <span className="nav-label second">GESTIÓN</span>
          <NavLink id="personas" active={active}><Users size={16} />Personas</NavLink>
          <NavLink id="servicios" active={active}><Package size={16} />Servicios</NavLink>
          <NavLink id="cartera" active={active}><FileSearch size={16} />Maestro de cartera</NavLink>
          <NavLink id="asignaciones" active={active}><ArrowLeftRight size={16} />Asignaciones de cartera</NavLink>
          <NavLink id="unidades" active={active}><Building2 size={16} />Unidades</NavLink>
          <NavLink id="estructuras" active={active}><Network size={16} />Estructuras</NavLink>
          <span className="nav-label second">CONFIGURACIÓN</span>
          <NavLink id="gobernanza" active={active}><ShieldCheck size={16} />Gobernanza</NavLink>
          <NavLink id="ajustes" active={active}><Settings2 size={16} />Ajustes</NavLink>
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
