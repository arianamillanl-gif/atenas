'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Archive,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FilePlus2,
  FileSearch,
  LayoutDashboard,
  Lock,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  X,
} from 'lucide-react'

type Alias = { name: string; source: string; method: string; validity: string; status: 'Vigente' | 'Inactivo'; evidence: string }

const initialAliases: Alias[] = [
  { name: 'Alfa Consultoría Integral', source: 'Clientify', method: 'ETL automático', validity: '01/01/2026 — Actual', status: 'Vigente', evidence: 'Ver evidencia' },
  { name: 'Empresa Alfa C.A.', source: 'Factura electrónica', method: 'Homologación manual', validity: '12/08/2024 — Actual', status: 'Vigente', evidence: 'Ver evidencia' },
  { name: 'ALFA CONS. INTEGRAL', source: 'CRM histórico', method: 'Regla de coincidencia', validity: '14/03/2022 — 11/08/2024', status: 'Inactivo', evidence: 'Ver evidencia' },
]

function Field({ label, children, hint, className = '' }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return <div className={`client-field ${className}`}><label>{label}</label>{children}{hint && <span className="client-field-hint">{hint}</span>}</div>
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <header className="brand"><img src="/logo-atenas.png" alt="ATENAS Grupo Consultor" /><button className="icon-button sidebar-close" onClick={onToggle} aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}>{collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button></header>
    <div className="sidebar-content"><div className="workspace-switch"><span className="workspace-avatar">LO</span><div><strong>Lo-Fi workspace</strong><span>Operaciones</span></div><ChevronDown size={15} /></div><nav className="nav"><span className="nav-label">MENÚ PRINCIPAL</span><a href="#resumen"><LayoutDashboard size={16} />Resumen</a><a href="#ventas"><FilePlus2 size={16} />Ventas verificadas</a><a href="#clientes" className="active"><UserRound size={16} />Clientes y alias</a><a href="#reportes"><SlidersHorizontal size={16} />Reportes</a><span className="nav-label second">CONFIGURACIÓN</span><a href="#integraciones"><ShieldCheck size={16} />Integraciones</a><a href="#ajustes"><Settings2 size={16} />Ajustes</a></nav></div>
    <footer className="sidebar-footer"><div className="support-card"><CircleHelp size={17} /><div><strong>¿Necesitas ayuda?</strong><span>Revisa la guía de operación</span></div><ChevronRight size={14} /></div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div><MoreHorizontal size={16} /></div></footer>
  </aside>
}

export default function ClientesAlias() {
  const [collapsed, setCollapsed] = useState(false)
  const [aliases, setAliases] = useState(initialAliases)
  const [commercialName, setCommercialName] = useState('Alfa Consultoría Integral')
  const [category, setCategory] = useState('Corporativo')
  const [status, setStatus] = useState('Activo')
  const [reason, setReason] = useState('')
  const [collisionReason, setCollisionReason] = useState('')
  const [modal, setModal] = useState<'cancel' | number | null>(null)
  const [notice, setNotice] = useState('')

  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3500) }
  const inactivate = (index: number) => { setAliases((current) => current.map((alias, item) => item === index ? { ...alias, status: 'Inactivo', validity: `${alias.validity.split(' — ')[0]} — 07/10/2026` } : alias)); setModal(null); flash('Alias inactivado y conservado en el historial') }

  return <main className="app-shell"><Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /><section className="content">
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6"><div className="flex items-center gap-3"><button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={19} /></button><span className="workspace-top-pill"><span />Lo-Fi workspace · Operaciones</span></div><div className="top-actions"><label className="quick-search"><Search size={14} /><span className="sr-only">Búsqueda rápida</span><input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" /></label><button className="icon-button" aria-label="Notificaciones"><Bell size={18} /></button><span className="top-user"><span className="user-avatar">MG</span>María González<ChevronDown size={14} /></span></div></header>
    <div className="page-wrap clients-page"><nav className="client-breadcrumb" aria-label="Migas de pan"><span>Gobierno de datos</span><ChevronRight size={14} /><strong>Clientes y alias</strong></nav>
      <div className="client-heading"><div><div className="eyebrow"><ShieldCheck size={14} /> MAESTRO DE IDENTIDADES</div><h1>CLIENTES Y ALIAS</h1><p>Administra la identidad canónica, sus denominaciones y la trazabilidad operativa.</p></div><div className="client-heading-meta"><span className="system-id"><Lock size={12} /> ID: 11-2016</span><button className="trace-link" onClick={() => flash('Trazabilidad disponible en el historial de auditoría')}><FileSearch size={15} />Ver trazabilidad del registro</button></div></div>

      <section className="client-card"><div className="client-card-header"><div><h2>Ficha canónica del cliente</h2><p>Los datos de origen se conservan sin sobrescritura. Los campos editables requieren autorización.</p></div><span className="status-badge active"><Check size={13} /> Registro activo</span></div><div className="client-form-grid">
        <Field label="Razón social"><input className="origin-input" value="Empresa Alfa C.A." readOnly aria-readonly="true" /><span className="field-lock"><Lock size={12} /> Clientify / ETL</span></Field>
        <Field label="RIF / NIT / RUC" hint="Coincidencia fiscal verificada"><div className="input-with-status"><input className="origin-input" value="J-40123456-7" readOnly aria-readonly="true" /><span className="fiscal-ok"><Check size={13} /> Único</span></div></Field>
        <Field label="Identificador de sistema"><input className="calculated-input" value="ID: 11-2016" readOnly aria-readonly="true" /></Field>
        <Field label="Nombre comercial"><input value={commercialName} onChange={(event) => setCommercialName(event.target.value)} /></Field>
        <Field label="Tipo de persona"><select defaultValue="Jurídica"><option>Jurídica</option><option>Natural</option><option>Entidad pública</option></select></Field>
        <Field label="Categoría de cliente"><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Corporativo</option><option>PYME</option><option>Sector público</option><option>Particular</option></select></Field>
        <Field label="Estado operacional"><select value={status} onChange={(event) => setStatus(event.target.value)}><option>Activo</option><option>En revisión</option><option>Inactivo</option></select></Field>
        <Field label="Motivo de cambio"><input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Describe el motivo de la actualización" /></Field>
      </div></section>

      <section className="client-card"><div className="client-card-header"><div><h2>Mapeo de alias y homologación</h2><p>Las vigencias se cierran, nunca se eliminan, para preservar el histórico del cliente.</p></div><button className="primary-button" onClick={() => flash('Nuevo alias listo para registrar')}><FilePlus2 size={15} />Agregar nuevo alias</button></div><div className="alias-table-wrap"><table className="alias-table"><thead><tr><th>Denominación / alias encontrado</th><th>Fuente</th><th>Método</th><th>Vigencia</th><th>Estado</th><th>Evidencia</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{aliases.map((alias, index) => <tr key={alias.name}><td><strong>{alias.name}</strong><small>{index === 0 ? 'Denominación preferida' : 'Registro histórico'}</small></td><td>{alias.source}</td><td>{alias.method}</td><td><span className="validity"><Clock3 size={13} />{alias.validity}</span></td><td><span className={`status-badge ${alias.status === 'Vigente' ? 'active' : 'inactive'}`}>{alias.status}</span></td><td><button className="evidence-link" onClick={() => flash(`Evidencia de ${alias.name}`)}><FileSearch size={14} />{alias.evidence}</button></td><td><button className="row-more" aria-label={`Acciones para ${alias.name}`} onClick={() => alias.status === 'Vigente' && setModal(index)}><MoreHorizontal size={17} /></button></td></tr>)}</tbody></table></div></section>

      <section className="client-card collision-card"><div className="client-card-header"><div><h2><AlertTriangle size={20} /> Resolución manual de identidad</h2><p>Se detectó una posible colisión fiscal. La homologación requiere evidencia y responsable.</p></div><span className="status-badge warning"><AlertTriangle size={13} /> Requiere revisión</span></div><div className="collision-alert"><AlertTriangle size={17} /><div><strong>Coincidencia fiscal detectada</strong><span>El RIF aparece asociado a 2 denominaciones en fuentes activas.</span></div></div><div className="collision-grid"><Field label="Motivo de homologación" className="wide-field"><textarea value={collisionReason} onChange={(event) => setCollisionReason(event.target.value)} placeholder="Explica por qué ambas denominaciones corresponden a la misma identidad" rows={3} required /></Field><Field label="Responsable"><input value="María González" readOnly className="origin-input" /><span className="field-lock"><Lock size={12} /> Sesión actual</span></Field><Field label="Fecha de vigencia"><input type="date" defaultValue="2026-10-07" /></Field><Field label="Evidencia documental" className="wide-field"><button className="upload-box" onClick={() => flash('Selector de evidencia abierto')}><Paperclip size={17} /><span><strong>Adjuntar evidencia</strong><small>PDF, XLSX o imagen · Máx. 10 MB</small></span></button></Field></div></section>

      <footer className="footer"><span>ATENAS · P85-01/02 · Lo-Fi · v0.2</span><span>master_cliente_alias</span></footer>
    </div>
    <div className="client-actions left-0 right-0 w-full"><button className="cancel-action" onClick={() => setModal('cancel')}>Cancelar</button><div className="client-actions-buttons"><button className="outline-button" onClick={() => flash('Conflicto listo para resolver')}><Check size={15} />Resolver conflicto</button><button className="primary-button save-action" onClick={() => flash('Cambios autorizados guardados correctamente')}><Check size={15} />Guardar cambios autorizados</button></div></div>
  </section>{notice && <div className="client-toast"><Check size={16} />{notice}</div>}
    {modal === 'cancel' && <div className="confirmation-backdrop"><section className="confirmation-modal client-confirm" role="dialog" aria-modal="true" aria-labelledby="cancel-title"><div className="warning-icon"><AlertTriangle size={22} /></div><h2 id="cancel-title">¿Descartar cambios no guardados?</h2><p>Los cambios realizados en la ficha canónica y la resolución manual se perderán. El histórico permanecerá intacto.</p><div className="confirmation-actions"><button className="modal-cancel" onClick={() => setModal(null)}>Seguir editando</button><button className="modal-confirm amber-confirm" onClick={() => { setModal(null); flash('Cambios descartados') }}>Descartar cambios</button></div></section></div>}
    {typeof modal === 'number' && <div className="confirmation-backdrop"><section className="confirmation-modal client-confirm" role="dialog" aria-modal="true" aria-labelledby="alias-title"><div className="warning-icon"><Archive size={22} /></div><h2 id="alias-title">¿Inactivar este alias?</h2><p>Se cerrará su vigencia, pero el registro físico y su evidencia permanecerán disponibles en el historial.</p><div className="confirmation-actions"><button className="modal-cancel" onClick={() => setModal(null)}>Cancelar</button><button className="modal-confirm amber-confirm" onClick={() => inactivate(modal)}>Inactivar alias</button></div></section></div>}
  </main>
}
