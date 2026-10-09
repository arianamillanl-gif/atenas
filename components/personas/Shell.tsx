import {
  Bell,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Users,
} from 'lucide-react'

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
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
          <a href="#resumen"><LayoutDashboard size={16} />Resumen</a>
          <span className="nav-label second">GESTIÓN DE TALENTO</span>
          <a href="#personas" className="active" aria-current="page"><Users size={16} />Personas</a>
          <a href="#unidades"><Building2 size={16} />Unidades</a>
          <a href="#estructuras"><Network size={16} />Estructuras</a>
          <span className="nav-label second">CONFIGURACIÓN</span>
          <a href="#gobernanza"><ShieldCheck size={16} />Gobernanza</a>
          <a href="#ajustes"><Settings2 size={16} />Ajustes</a>
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

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6">
      <div className="flex items-center gap-3">
        <button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={19} /></button>
        <span className="workspace-top-pill"><span />Lo-Fi workspace · Gestión de talento</span>
      </div>
      <div className="top-actions">
        <label className="quick-search">
          <Search size={14} />
          <span className="sr-only">Búsqueda rápida</span>
          <input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" />
        </label>
        <button className="icon-button" aria-label="Notificaciones"><Bell size={18} /></button>
        <span className="top-user"><span className="user-avatar">MG</span>María González<ChevronDown size={14} /></span>
      </div>
    </header>
  )
}
