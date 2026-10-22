"use client"

import { useMemo, useState } from "react"
import {   ChevronDown, MoreVertical, Search, Upload, X, Trash2, LockKeyhole, FileText } from "lucide-react"

type Status = "Registrado" | "Disponible" | "Aplicado" | "Reversado"
type RecordItem = { id: string; date: string; reference: string; method: string; client: string; amount: string; status: Status }

const records: RecordItem[] = [
  { id: "ING-2026-0048", date: "18/10/2026", reference: "TRF-8820194", method: "Transferencia", client: "Corporación Andina, C.A.", amount: "USD 2,450.00", status: "Disponible" },
  { id: "ING-2026-0047", date: "17/10/2026", reference: "ZEL-339021", method: "Pago móvil", client: "Servicios Delta, S.A.", amount: "USD 980.00", status: "Aplicado" },
  { id: "ING-2026-0046", date: "16/10/2026", reference: "DEP-110284", method: "Depósito bancario", client: "Pendiente de identificación", amount: "VES 18,500.00", status: "Registrado" },
  { id: "ING-2026-0045", date: "14/10/2026", reference: "TRF-8813201", method: "Transferencia", client: "Inversiones Meridiano", amount: "EUR 1,200.00", status: "Reversado" },
]
const tabs = ["Todos", "Registrados", "Disponibles", "Aplicados", "Reversados"] as const
const statusClass: Record<Status, string> = { Registrado: "border-blue-200 bg-blue-50 text-blue-700", Disponible: "border-emerald-200 bg-emerald-50 text-emerald-700", Aplicado: "border-violet-200 bg-violet-50 text-violet-700", Reversado: "border-rose-200 bg-rose-50 text-rose-700" }

function Badge({ status }: { status: Status }) { return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClass[status]}`}><span className="size-1.5 rounded-full bg-current" />{status}</span> }

export default function CobroIngresoModule() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Todos")
  const [query, setQuery] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [dragging, setDragging] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const [notice, setNotice] = useState("")
  const filtered = useMemo(() => records.filter((record) => {
    const matchesTab = tab === "Todos" || record.status === tab.slice(0, -1)
    const haystack = `${record.id} ${record.reference} ${record.client} ${record.amount}`.toLowerCase()
    return matchesTab && haystack.includes(query.toLowerCase())
  }), [query, tab])
  const selectFile = (next: File | undefined) => { if (next && ["application/pdf", "image/png", "image/jpeg"].includes(next.type) && next.size <= 10 * 1024 * 1024) setFile(next) }
  const register = () => { setDrawerOpen(false); setFile(null); setNotes(""); setNotice("Ingreso registrado correctamente"); window.setTimeout(() => setNotice(""), 3000) }
  const count = (name: string) => name === "Todos" ? records.length : records.filter((record) => record.status === name.slice(0, -1)).length

  return <div className="app-shell">
    <aside className="sidebar hidden lg:flex"><div className="sidebar-content"><div className="brand"><img src="/logo-atenas.png" alt="ATENAS Grupo Consultor" /></div><div className="workspace-switch"><div className="workspace-avatar">LF</div><div><strong>Lo-Fi workspace</strong><span>Tesorería</span></div><ChevronDown size={15} /></div><nav className="nav" aria-label="Navegación principal"><span className="nav-label">MENÚ PRINCIPAL</span><a href="/servicios">Resumen</a><span className="nav-label second">GESTIÓN</span><a href="/personas">Personas</a><a href="/servicios">Servicios</a><a href="/maestro-cartera">Maestro de cartera</a><a href="/asignaciones">Asignaciones de cartera</a><a className="active" href="/cobro-ingreso" aria-current="page">Cobro / Ingreso</a><span className="nav-label second">CONFIGURACIÓN</span><a href="#gobernanza">Gobernanza</a><a href="#ajustes">Ajustes</a></nav></div><div className="sidebar-footer"><div className="support-card">¿Necesitas ayuda?</div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div></div></div></aside>
    <div className="content"><header className="topbar"><div className="breadcrumb"><span>Tesorería</span><span>›</span><strong>Cobro / Ingreso</strong></div><div className="top-user"><span className="user-avatar">MG</span><span className="hidden md:inline">María González</span></div></header>
      <main className="page-wrap income-page"><div className="breadcrumb income-breadcrumb">Gestión <span>›</span> <strong>Cobro / Ingreso</strong></div><header className="income-heading"><div><span className="eyebrow">TESORERÍA / CONTROL FINANCIERO</span><h1>Cobro / Ingreso</h1><p>Histórico de cobros recibidos y movimientos de ingreso.</p></div><button className="primary-button" onClick={() => setDrawerOpen(true)}>+ Registrar Ingreso</button></header>
        <section className="income-kpis"><div><span>Total recibido</span><strong>USD 42,680.00</strong><small>+12.4% este mes</small></div><div><span>Pendiente de identificación</span><strong>USD 3,240.00</strong><small>3 ingresos</small></div><div><span>Aplicado a CxC</span><strong>USD 31,840.00</strong><small>74.6% conciliado</small></div></section>
        <section className="income-panel"><div className="income-toolbar"><div><h2>Histórico de ingresos</h2><p>Consulta, aplica o revierte movimientos registrados.</p></div><label className="income-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID, referencia o cliente" /></label></div><div className="income-tabs" role="tablist">{tabs.map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}<span>{count(item)}</span></button>)}</div><div className="income-table-wrap"><table className="income-table"><thead><tr><th>ID / FECHA</th><th>REFERENCIA / MEDIO</th><th>CLIENTE</th><th className="text-right">IMPORTE</th><th>ESTADO</th><th className="text-right">ACCIÓN</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><strong>{record.id}</strong><small>{record.date}</small></td><td><strong>{record.reference}</strong><small>{record.method}</small></td><td>{record.client}</td><td className="text-right font-semibold">{record.amount}</td><td><Badge status={record.status} /></td><td className="text-right"><div className="income-actions"><button className="outline-pill" onClick={() => setNotice(`Consultando ${record.id}`)}>Consultar / Aplicar</button><span className="relative"><button className="menu-trigger" aria-label={`Más acciones para ${record.id}`} onClick={() => setMenu(menu === record.id ? null : record.id)}><MoreVertical size={16} /></button>{menu === record.id && <span className="income-menu"><button onClick={() => { setNotice(`Ingreso ${record.id} seleccionado`); setMenu(null) }}>Ver detalle</button><button className="danger" onClick={() => { setNotice("Reversión requiere confirmación de auditoría"); setMenu(null) }}>Reversar ingreso</button></span>}</span></div></td></tr>)}</tbody></table></div></section>
      </main>
    </div>
    {drawerOpen && <div className="income-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDrawerOpen(false)}><aside className="income-drawer" role="dialog" aria-modal="true" aria-labelledby="income-drawer-title"><header><div><span className="eyebrow">TESORERÍA</span><h2 id="income-drawer-title">Registrar nuevo ingreso</h2><p>Registra un comprobante recibido para su posterior conciliación.</p></div><button className="icon-button" aria-label="Cerrar" onClick={() => setDrawerOpen(false)}><X size={18} /></button></header><div className="income-drawer-body"><label className={labelClass}>Comprobante digital <span>*</span></label>{file ? <div className="uploaded-file"><FileText size={20} /><div><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(1)} MB</small></div><span className="secure-badge"><LockKeyhole size={12} /> Carga segura</span><button aria-label="Eliminar comprobante" onClick={() => setFile(null)}><Trash2 size={16} /></button></div> : <label className={`income-dropzone ${dragging ? "dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFile(event.dataTransfer.files[0]) }}><Upload size={22} /><strong>Arrastra tu comprobante aquí</strong><span>o haz clic para seleccionar PDF, PNG o JPG · Máx. 10 MB</span><input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(event) => selectFile(event.target.files?.[0])} /></label>}<label className={labelClass} htmlFor="income-notes">Observaciones de ingreso</label><textarea id="income-notes" maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Añade información relevante sobre este ingreso..." /><small className="audit-note">Auditado por bitácora de sistema <span>{notes.length} / 500</span></small></div><footer><button className="outline-pill" onClick={() => setDrawerOpen(false)}>Cancelar</button><button className="primary-button" disabled={!file} onClick={register}>Registrar Ingreso</button></footer></aside></div>}
    {notice && <button className="income-toast" onClick={() => setNotice("")}>{notice}</button>}
  </div>
}

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700"
