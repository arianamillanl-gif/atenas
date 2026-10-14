'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Package,
  Bell,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileClock,
  FileSearch,
  HelpCircle,
  History,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  PanelLeftClose,
  Search,
  Settings2,
  ShieldCheck,
  Users,
  X,
  Save,
} from 'lucide-react'

const inputClass = 'w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-2xs focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10'
const labelClass = 'mb-1.5 inline-block text-xs font-semibold text-slate-700'

function Sidebar() {
  return <aside className="sidebar hidden lg:flex">
    <div className="sidebar-content">
      <div className="brand"><img src="/logo-atenas.png" alt="ATENAS" /><button className="icon-button ml-auto" aria-label="Colapsar panel"><PanelLeftClose size={18} /></button></div>
      <div className="workspace-switch"><div className="workspace-avatar">LF</div><div><strong>Lo-Fi workspace</strong><span>Estructura comercial</span></div><ChevronDown size={15} /></div>
      <nav className="nav" aria-label="Navegación principal">
        <span className="nav-label">GENERAL</span>
        <a href="#inicio"><LayoutDashboard size={17} />Inicio</a>
        <a href="#clientes"><Users size={17} />Clientes<span className="nav-count">24</span></a>
        <span className="nav-label second">ESTRUCTURA COMERCIAL</span>
        <Link href="/servicios"><Package size={17} />Servicios</Link>
        <Link className="active" href="/maestro-cartera" aria-current="page"><FileSearch size={17} />Maestro de cartera</Link>
        <a href="#segmentos"><Settings2 size={17} />Segmentos</a>
        <a href="#unidades"><ShieldCheck size={17} />Unidades de negocio</a>
        <span className="nav-label second">GOBIERNO Y CONTROL</span>
        <a href="#auditoria"><History size={17} />Auditoría</a>
        <a href="#configuracion"><Settings2 size={17} />Configuración</a>
      </nav>
    </div>
    <div className="sidebar-footer"><div className="support-card"><CircleHelp size={17} /><div><strong>¿Necesitas ayuda?</strong><span>Centro de soporte</span></div><ChevronDown size={14} /></div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div><ChevronDown size={14} /></div></div>
  </aside>
}

const auditRows = [
  { date: "09/10/2026 · 14:30", user: "María González", field: "Nombre de la cartera", before: "Cartera West", after: "Cartera Corporativa West" },
  { date: "14/06/2026 · 11:20", user: "María González", field: "Estado operativo", before: "En revisión", after: "Activa" },
  { date: "15/01/2026 · 10:15", user: "Sistema", field: "Registro inicial", before: null, after: "Creación" },
]


export default function MaestroCarteraModule() {
  const [traceability, setTraceability] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [status, setStatus] = useState('Activa / Operativa')
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)

  function save() { setSaved(true); window.setTimeout(() => setSaved(false), 2200) }
  function confirmStatus() { if (reason.trim().length < 10) return; setStatus('Inactiva'); setStatusOpen(false); setReason('') }

  return <div className="app-shell"><Sidebar /><div className="content"><header className="topbar"><div className="flex items-center gap-3"><button className="mobile-menu icon-button" aria-label="Abrir menú"><Menu size={18} /></button><div className="breadcrumb"><span>Estructura comercial</span><span>›</span><strong>Maestro de cartera</strong></div></div><div className="top-actions"><label className="search-box hidden sm:flex"><Search size={15} /><input placeholder="Búsqueda rápida" aria-label="Búsqueda rápida" /></label><button className="icon-button notification" aria-label="Notificaciones"><Bell size={18} /><i /></button><div className="top-user"><span className="user-avatar">MG</span><span className="hidden md:inline">María González</span></div></div></header>
    <main className="detail-page"><div className="page-wrap">
      <div className="detail-breadcrumb">Catálogos maestros <span>›</span><strong>Ficha F04A</strong></div>
      <section className="mb-6"><h1 className="text-2xl font-bold text-slate-900">Maestro de cartera</h1><p className="mt-1 text-xs text-slate-500">Crear y mantener una cartera como entidad independiente de la asignación de clientes.</p></section>
      <section className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs"><div className="flex min-w-0 items-center"><div className="mr-4 grid size-11 shrink-0 place-items-center rounded-full bg-[#2A4B93] text-sm font-bold text-white">MC</div><div className="min-w-0"><div className="flex items-center gap-3"><h2 className="mr-3 truncate text-base font-bold text-slate-900">Cartera Corporativa West</h2><span className="inline-flex shrink-0 items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">● Activa</span></div><p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs font-normal text-slate-500"><span>Línea Comercial</span><span aria-hidden="true">·</span><span>Reg: 15/01/2026 · 10:15</span><span aria-hidden="true">|</span><span className="inline-flex items-center gap-1"><LockKeyhole size={12} />ID CAR-2026-0041</span><span aria-hidden="true">|</span><span>Modificado: 09/10/2026 por María González</span></p></div></div><button onClick={() => setTraceability(true)} className="ml-4 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50"><FileClock size={14} />Ver trazabilidad</button></section>
      <section className="mb-6 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs"><div><h2 className="mb-1 text-base font-bold text-slate-900">Definición independiente de la cartera</h2><p className="border-b border-slate-100 pb-4 text-xs font-normal text-slate-500">Define la identidad y la adscripción organizacional de la cartera como entidad autónoma.</p></div><div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"><div><label className={labelClass}>Código de cartera <span className="ml-0.5 text-rose-500">*</span></label><input className={inputClass} placeholder="Ej. CAR-CORP-WEST" defaultValue="CAR-CORP-WEST" /><p className="mt-1.5 text-[11px] leading-snug text-slate-400">Código único interno para integración con DWH y sistemas legados.</p></div><div className="order-3 md:col-span-2"><label className={labelClass}>Nombre de la cartera <span className="ml-0.5 text-rose-500">*</span></label><input className={inputClass} placeholder="Nombre descriptivo de la cartera" defaultValue="Cartera Corporativa West" /></div><div className="order-4 md:col-span-2"><label className={labelClass}>Descripción de la cartera</label><textarea className={`${inputClass} resize-none`} rows={2} placeholder="Descripción del alcance, cobertura o segmento de la cartera." defaultValue="Cartera independiente para la gestión comercial de clientes corporativos de la zona West." /></div><div className="order-2"><label className={labelClass}>Unidad de negocio <span className="ml-0.5 text-rose-500">*</span></label><div className="relative"><select className={`${inputClass} cursor-pointer appearance-none pr-9`} defaultValue="Unidad Corporativa"><option>Seleccionar Unidad de Negocio</option><option>Unidad Comercial Norte</option><option>Unidad Corporativa</option><option>Unidad Servicios Profesionales</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></div><p className="mt-1.5 text-[11px] text-slate-400">La asignación a la unidad de negocio gestiona la visibilidad jerárquica.</p></div></div></section>
      <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h2 className="mb-1 text-base font-bold text-slate-900">Estado operativo, motivo y trazabilidad</h2>
        <p className="mb-6 border-b border-slate-100 pb-4 text-xs font-normal text-slate-500">Los datos de auditoría y marcas de tiempo se registran automáticamente por el servidor.</p>
        <div className="mb-4 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="cartera-estado" className="mb-1.5 block text-xs font-semibold text-slate-700">Estado de la cartera *</label>
            <div className="relative">
              <select id="cartera-estado" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-9 text-xs font-medium text-slate-800 outline-none transition-all focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10">
                <option>Activa / Operativa</option>
                <option>Inactiva</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} aria-hidden="true" />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Fecha de cambio de estado</span>
            <div aria-readonly="true" className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-600">
              <span>14/06/2026 - 11:20</span>
              <LockKeyhole size={13} className="text-slate-400" aria-label="Campo bloqueado" />
            </div>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Usuario que registra cambio</span>
            <div aria-readonly="true" className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2.5 text-xs font-medium text-slate-600">
              <span>María González</span>
              <LockKeyhole size={13} className="text-slate-400" aria-label="Campo bloqueado" />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="cartera-motivo" className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
            Motivo de inactivación
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-normal text-slate-500">Condicional</span>
          </label>
          <textarea
            id="cartera-motivo"
            rows={2}
            disabled={status !== 'Inactiva'}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Motivo de ajuste administrativo o de reestructuración por el cual se inactiva la cartera."
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <p className="mt-1 text-[11px] text-slate-400">Requerido únicamente cuando el estado pase a Inactiva.</p>
        </div>
      </section>
      <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Historial de modificaciones y acciones auditables</h2>
            <p className="mt-0.5 text-xs text-slate-500">Registro inmutable de cambios en la parametrización de la cartera.</p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{auditRows.length} eventos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="mt-4 w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-3 py-2.5">Fecha / Hora</th>
                <th scope="col" className="px-3 py-2.5">Usuario</th>
                <th scope="col" className="px-3 py-2.5">Campo modificado</th>
                <th scope="col" className="px-3 py-2.5">Valor anterior</th>
                <th scope="col" className="px-3 py-2.5">Valor nuevo</th>
                <th scope="col" className="px-3 py-2.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((row) => (
                <tr key={row.date + row.field} className="border-b border-slate-100 text-xs transition-colors hover:bg-slate-50/40">
                  <td className="px-3 py-3 font-medium text-slate-800">{row.date}</td>
                  <td className="px-3 py-3 font-medium text-slate-700">{row.user}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{row.field}</td>
                  <td className="px-3 py-3">
                    {row.before ? <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] uppercase text-slate-600">{row.before}</span> : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-block rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-emerald-700">{row.after}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button type="button" onClick={() => setTraceability(true)} className="cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-[#2A4B93] shadow-2xs transition-all hover:border-[#2A4B93] hover:bg-slate-50">Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="my-3 space-y-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <p>↳ Historial inmutable — no editable · Nuevas entradas se registran únicamente por el servidor (Append-Only).</p>
          <p>↳ Cada modificación registra usuario, timestamp y valores anterior/posterior — sin posibilidad de edición ni borrado.</p>
        </div>
        <button type="button" onClick={() => setTraceability(true)} className="flex w-full cursor-pointer items-center gap-2 border-t border-slate-100 pt-3 text-xs font-semibold text-[#2A4B93] hover:underline">
          <History size={14} aria-hidden="true" />Ver historial de estados / auditoría completa
        </button>
      </section>
    </div></main>
    <footer className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-md lg:pl-[290px] lg:pr-10"><button onClick={() => setCancelOpen(true)} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">Cancelar</button><div className="flex gap-2"><button onClick={() => setStatusOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-2.5 text-xs font-semibold text-amber-800 shadow-sm transition hover:bg-amber-100">Cambiar estado</button><button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-[#2A4B93] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E366B]"><Save size={14} />{saved ? 'Cartera guardada' : 'Guardar cartera'}</button></div></footer>
    {cancelOpen && <div className="confirmation-backdrop" onClick={() => setCancelOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="cancel-title" onClick={(e) => e.stopPropagation()} className="confirmation-modal"><div className="mb-4 grid size-12 place-items-center rounded-full bg-amber-50 text-amber-600"><AlertTriangle size={22} /></div><h2 id="cancel-title">¿Descartar cambios en la cartera?</h2><p>Si cancelas ahora, la información modificada no se guardará en el catálogo maestro.</p><div className="confirmation-actions"><button onClick={() => setCancelOpen(false)} className="modal-cancel">Continuar editando</button><button onClick={() => setCancelOpen(false)} className="rounded-full bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700">Sí, descartar</button></div></div></div>}
    {statusOpen && <div className="confirmation-backdrop" onClick={() => setStatusOpen(false)}><div role="dialog" aria-modal="true" aria-labelledby="status-title" onClick={(e) => e.stopPropagation()} className="confirmation-modal"><div className="mb-4 grid size-12 place-items-center rounded-full bg-amber-50 text-amber-600"><AlertTriangle size={22} /></div><h2 id="status-title">Cambiar estado de la cartera</h2><p>Para inactivar la cartera debes registrar un motivo obligatorio. Este evento quedará en la auditoría inmutable.</p><label className={labelClass}>Motivo de inactivación *</label><textarea autoFocus value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputClass} min-h-24 resize-none py-3`} placeholder="Escribe el motivo administrativo..." /><div className="confirmation-actions mt-5"><button onClick={() => setStatusOpen(false)} className="modal-cancel">Cancelar</button><button disabled={reason.trim().length < 10} onClick={confirmStatus} className="rounded-full bg-[#2A4B93] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Confirmar cambio</button></div></div></div>}
    {traceability && <div className="drawer-backdrop" onClick={() => setTraceability(false)}><aside role="dialog" aria-modal="true" aria-labelledby="trace-title" onClick={(e) => e.stopPropagation()} className="drawer"><div className="drawer-header"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Historial de auditoría</p><h2 id="trace-title">Trazabilidad del registro</h2><p className="mt-1 text-xs text-slate-500">CAR-2026-0041 · Ficha F04A</p></div><button onClick={() => setTraceability(false)} aria-label="Cerrar trazabilidad" className="icon-button"><X size={18} /></button></div><div className="drawer-body"><span className="drawer-status inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">● Registro activo</span>{[['09/10/2026 · 14:30','María González','Actualizó el nombre de la cartera'],['14/06/2026 · 11:20','María González','Cambió el estado a Activa'],['15/01/2026 · 10:15','Sistema','Creó el registro maestro']].map(([date,user,action]) => <div key={date} className="relative border-l-2 border-slate-200 pl-5"><span className="absolute -left-[7px] top-0 size-3 rounded-full border-2 border-white bg-[#2A4B93]" /><p className="text-xs font-semibold text-slate-800">{action}</p><p className="mt-1 text-[11px] text-slate-500">{date}</p><p className="mt-2 text-xs text-slate-600">Usuario: <strong>{user}</strong></p></div>)}</div><div className="drawer-footer"><button onClick={() => setTraceability(false)} className="outline-button justify-center">Cerrar</button></div></aside></div>}
  </div></div>
}
