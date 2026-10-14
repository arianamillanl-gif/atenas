'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  HelpCircle,
  History,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'

type Status = 'Activa / Operativa' | 'Inactiva'

type HistoryRow = {
  date: string
  user: string
  field: string
  previous: string
  next: string
  action: string
}

const initialHistory: HistoryRow[] = [
  { date: '09/10/2026 · 14:30', user: 'María González', field: 'Nombre de la cartera', previous: 'Cartera Corporativa', next: 'Cartera Corporativa Norte', action: 'Actualización' },
  { date: '14/06/2026 · 11:20', user: 'María González', field: 'Estado operativo', previous: 'Inactiva', next: 'Activa / Operativa', action: 'Reactivación' },
  { date: '15/01/2026 · 10:15', user: 'Sistema', field: 'Registro de cartera', previous: '—', next: 'CAR-2026-0041', action: 'Creación' },
]

const inputClass = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2A4B93] focus:ring-4 focus:ring-[#2A4B93]/10'
const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600'

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return <label className={labelClass}>{children}{required && <span className="ml-0.5 text-red-500">*</span>}</label>
}

function SelectField({ defaultValue, children, value, onChange }: { defaultValue?: string; children: React.ReactNode; value?: string; onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void }) {
  return <div className="relative"><select value={value} defaultValue={defaultValue} onChange={onChange} className={`${inputClass} appearance-none pr-9`}>{children}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-3.5 text-slate-400" size={16} /></div>
}

function ReadonlyField({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div><FieldLabel>{label}</FieldLabel><div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600"><span className="text-slate-400">{icon}</span>{value}<LockKeyhole className="ml-auto text-slate-400" size={14} /></div></div>
}

export default function ServiciosModule() {
  const [status, setStatus] = useState<Status>('Activa / Operativa')
  const [history, setHistory] = useState(initialHistory)
  const [traceability, setTraceability] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function savePortfolio() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  function confirmStatus() {
    if (reason.trim().length < 20) return
    const nextStatus: Status = status === 'Inactiva' ? 'Activa / Operativa' : 'Inactiva'
    setStatus(nextStatus)
    setHistory((rows) => [{ date: '14/10/2026 · 09:12', user: 'María González', field: 'Estado operativo', previous: status, next: nextStatus, action: nextStatus === 'Inactiva' ? 'Inactivación' : 'Reactivación' }, ...rows])
    setStatusOpen(false)
    setReason('')
  }

  return (
    <div className="app-shell font-poppins text-slate-900">
      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div>
          <div className="brand"><div className="brand-mark">A</div><div><strong>ATENAS</strong><span>Grupo Consultor</span></div><button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={18} /></button></div>
          <div className="workspace-switch"><div className="workspace-avatar">LF</div><div><strong>Lo-Fi workspace</strong><span>Estructura comercial</span></div><ChevronDown size={15} /></div>
          <nav className="nav" aria-label="Navegación principal">
            <span className="nav-label">GENERAL</span>
            <a href="#inicio"><LayoutDashboard size={17} /> <span className="nav-label-text">Inicio</span></a>
            <a href="#cartera" className="active"><FileText size={17} /> <span className="nav-label-text">Maestro de cartera</span><span className="nav-count">1</span></a>
            <a href="#clientes"><UserRound size={17} /> <span className="nav-label-text">Clientes</span></a>
            <span className="nav-label second">GOBIERNO</span>
            <a href="#catalogos"><ShieldCheck size={17} /> <span className="nav-label-text">Catálogos maestros</span></a>
            <a href="#auditoria"><History size={17} /> <span className="nav-label-text">Auditoría</span></a>
          </nav>
        </div>
        <div className="sidebar-footer"><div className="support-card"><HelpCircle size={18} /><div><strong>¿Necesitas ayuda?</strong><span>Centro de soporte</span></div></div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div><ChevronDown size={15} /></div></div>
      </aside>

      <div className="content">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={20} /></button><div className="breadcrumb"><span>Estructura comercial</span><span>›</span><strong>Maestro de cartera</strong></div><div className="top-actions"><div className="search-box"><Search size={15} /><input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" /></div><button className="icon-button notification" aria-label="Notificaciones"><span>●</span><i /></button><div className="top-user"><div className="user-avatar">MG</div><span>María González</span></div></div></header>

        <main className="detail-page"><div className="page-wrap">
          <div className="page-heading"><div><div className="eyebrow"><ShieldCheck size={15} /> ESTRUCTURA COMERCIAL / GOBIERNO DE CARTERA</div><h1>Maestro de cartera</h1><p>Crear y mantener una cartera como entidad independiente de la asignación de clientes.</p></div><span className="status-pill green"><span className="status-dot">●</span>{status}</span></div>

          <section className="source-card"><div className="source-grid"><div><span className="meta-label"><LockKeyhole size={13} /> ID CARTERA</span><strong>CAR-2026-0041</strong></div><div><span className="meta-label"><CalendarDays size={13} /> FECHA DE REGISTRO</span><strong>15/01/2026 · 10:15</strong></div><div><span className="meta-label"><UserRound size={13} /> ÚLTIMA MODIFICACIÓN</span><strong>09/10/2026 · 14:30 <small>por María González</small></strong></div></div><button className="outline-button" onClick={() => setTraceability(true)}><History size={15} /> Ver trazabilidad del registro</button></section>

          <section className="detail-card"><div className="section-heading"><span className="step">1</span><div><h2>Definición independiente de la cartera</h2><p>Identifica el alcance y la unidad organizacional responsable.</p></div></div><div className="field-row two"><div><FieldLabel required>Código de cartera</FieldLabel><input className={inputClass} placeholder="Ej. CAR-CORP-WEST" defaultValue="CAR-CORP-NORTE" /><small className="helper">Código único interno para integración con DWH y sistemas legados.</small></div><div><FieldLabel required>Nombre de la cartera</FieldLabel><input className={inputClass} placeholder="Nombre descriptivo de la cartera" defaultValue="Cartera Corporativa Norte" /></div><div className="wide"><FieldLabel>Descripción de la cartera</FieldLabel><textarea className={`${inputClass} h-auto min-h-24 resize-y py-3`} rows={3} placeholder="Descripción del alcance, cobertura o segmento de la cartera." defaultValue="Cartera de clientes corporativos con cobertura comercial en la zona norte." /></div><div className="wide"><FieldLabel required>Unidad de negocio</FieldLabel><SelectField defaultValue="Unidad Comercial Norte"><option>Seleccionar Unidad de Negocio</option><option>Unidad Comercial Norte</option><option>Unidad Corporativa</option><option>Unidad de Servicios</option></SelectField><small className="helper">La asignación a la unidad de negocio gestiona la visibilidad jerárquica.</small></div></div></section>

          <section className="detail-card"><div className="section-heading"><span className="step">2</span><div><h2>Estado operativo, motivo y trazabilidad</h2><p>Los datos de control se registran automáticamente para conservar la auditoría.</p></div></div><div className="field-row three"><div><FieldLabel>Estado de la cartera</FieldLabel><SelectField value={status} onChange={(event) => setStatus(event.target.value as Status)}><option>Activa / Operativa</option><option>Inactiva</option></SelectField></div><ReadonlyField label="Fecha de cambio de estado" value="14/06/2026 · 11:20" icon={<Clock3 size={15} />} /><ReadonlyField label="Usuario que registra cambio" value="María González" icon={<UserRound size={15} />} /><div className="wide"><FieldLabel>Motivo de inactivación</FieldLabel><textarea disabled={status !== 'Inactiva'} value={status === 'Inactiva' ? reason : ''} onChange={(event) => setReason(event.target.value)} className={`${inputClass} h-auto min-h-20 resize-y py-3 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400`} placeholder="Motivo de ajuste administrativo o de reestructuración por el cual se inactiva la cartera." /></div></div></section>

          <section className="detail-card"><div className="section-heading"><span className="step">3</span><div><h2>Historial de modificaciones y acciones auditables</h2><p>Registro inmutable de los cambios realizados sobre la cartera.</p></div></div><div className="table-scroll"><table><thead><tr><th>FECHA / HORA</th><th>USUARIO</th><th>CAMPO MODIFICADO</th><th>VALOR ANTERIOR</th><th>VALOR NUEVO</th><th className="right">ACCIÓN</th></tr></thead><tbody>{history.map((row, index) => <tr key={`${row.date}-${index}`}><td><strong>{row.date}</strong></td><td>{row.user}</td><td>{row.field}</td><td><code>{row.previous}</code></td><td><code>{row.next}</code></td><td className="right"><button className="link-button" onClick={() => setTraceability(true)}>Detalles</button></td></tr>)}</tbody></table></div><button className="history-link" onClick={() => setTraceability(true)}><History size={15} /> Ver historial de estados / auditoría completa</button></section>
        </div></main>

        <footer className="detail-actions"><button className="outline-button" onClick={() => setCancelOpen(true)}>Cancelar</button><div className="action-group"><button className="change-status" onClick={() => setStatusOpen(true)}><AlertTriangle size={15} /> Cambiar estado</button><button className="primary-button" onClick={savePortfolio}><Check size={16} /> {saved ? 'Cartera guardada' : 'Guardar cartera'}</button></div></footer>
      </div>

      {cancelOpen && <div className="confirmation-backdrop" onClick={() => setCancelOpen(false)}><div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title" onClick={(event) => event.stopPropagation()}><div className="modal-icon"><AlertTriangle size={22} /></div><h2 id="cancel-title">¿Descartar cambios en la cartera?</h2><p>Si cancelas ahora, la información modificada no se guardará en el catálogo maestro.</p><div className="confirmation-actions"><button className="modal-cancel" onClick={() => setCancelOpen(false)}>Continuar editando</button><button className="modal-danger" onClick={() => setCancelOpen(false)}>Sí, descartar</button></div></div></div>}
      {statusOpen && <div className="confirmation-backdrop" onClick={() => setStatusOpen(false)}><div className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="status-title" onClick={(event) => event.stopPropagation()}><div className="modal-icon amber"><AlertTriangle size={22} /></div><h2 id="status-title">{status === 'Inactiva' ? 'Reactivar cartera' : 'Inactivar cartera'}</h2><p>Ingresa el motivo para que el cambio quede registrado en la auditoría.</p><FieldLabel required>Motivo del cambio</FieldLabel><textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} className={`${inputClass} h-auto min-h-24 py-3`} placeholder="Escribe al menos 20 caracteres..." /><div className="confirmation-actions"><button className="modal-cancel" onClick={() => setStatusOpen(false)}>Cancelar</button><button className="modal-confirm" disabled={reason.trim().length < 20} onClick={confirmStatus}>Confirmar cambio</button></div></div></div>}
      {traceability && <div className="drawer-backdrop" onClick={() => setTraceability(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="trace-title" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><span className="eyebrow"><History size={14} /> AUDITORÍA INMUTABLE</span><h2 id="trace-title">Trazabilidad del registro</h2><p>CAR-2026-0041</p></div><button className="icon-button" onClick={() => setTraceability(false)} aria-label="Cerrar trazabilidad"><X size={18} /></button></div><div className="drawer-body"><div className="drawer-summary"><span>3 eventos registrados</span><strong><ShieldCheck size={14} /> Cadena íntegra</strong></div>{history.map((row, index) => <div className="timeline-item" key={`${row.date}-trace-${index}`}><div className="timeline-dot"><Check size={13} /></div><div><span>{row.date}</span><strong>{row.action}: {row.field}</strong><p>{row.previous} → {row.next}</p><small>Realizado por {row.user}</small></div></div>)}</div><div className="drawer-footer"><button className="outline-button" onClick={() => setTraceability(false)}>Cerrar</button><button className="primary-button"><FileText size={15} /> Exportar auditoría</button></div></aside></div>}
    </div>
  )
}
