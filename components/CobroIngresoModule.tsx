"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Check, ChevronDown, CircleAlert, History, Lock, Search, X } from "lucide-react"

type Candidate = {
  id: string
  status: "Pendiente" | "Parcial"
  executive: string
  balance: number
  applied: number
  application: "Total" | "Parcial"
}

type HistoryRow = {
  code: string
  date: string
  amount: number
  type: "Aplicación" | "Reverso"
  cxc: string
  actor: string
}

const incomeTotal = 12500
const initialCandidates: Candidate[] = [
  { id: "CXC-2026-00187", status: "Pendiente", executive: "R. Medina", balance: 4200, applied: 4200, application: "Total" },
  { id: "CXC-2026-00192", status: "Parcial", executive: "A. Torres", balance: 3600, applied: 2800, application: "Parcial" },
  { id: "CXC-2026-00201", status: "Pendiente", executive: "L. Vargas", balance: 5100, applied: 0, application: "Total" },
  { id: "CXC-2026-00208", status: "Pendiente", executive: "M. Rojas", balance: 2400, applied: 0, application: "Total" },
]

const initialHistory: HistoryRow[] = [
  { code: "APP-2026-0018", date: "15/07/2026 · 10:42", amount: 7000, type: "Aplicación", cxc: "CXC-2026-00176", actor: "M. González · Conciliación bancaria" },
  { code: "REV-2026-0004", date: "12/07/2026 · 16:18", amount: 1200, type: "Reverso", cxc: "CXC-2026-00152", actor: "J. Paredes · Diferencia de referencia" },
]

const money = (value: number) => value.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const badge: Record<string, string> = {
  Disponible: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pendiente: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Parcial: "bg-blue-50 text-blue-700 border-blue-200",
  Aplicación: "bg-violet-50 text-violet-700 border-violet-200",
  Reverso: "bg-rose-50 text-rose-700 border-rose-200",
}

function StatusBadge({ children }: { children: string }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badge[children] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}>{children}</span>
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">{children}</label>
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4" role="presentation" onMouseDown={onClose}>
    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">Revisa los datos antes de continuar.</p></div><button type="button" aria-label="Cerrar" onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100"><X /></button></div>
      {children}
    </div>
  </div>
}

export default function CobroIngresoModule() {
  const [candidates, setCandidates] = useState(initialCandidates)
  const [selected, setSelected] = useState<string[]>(["CXC-2026-00187", "CXC-2026-00192"])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("Todas")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reverseRow, setReverseRow] = useState<HistoryRow | null>(null)
  const [reason, setReason] = useState("")
  const [history, setHistory] = useState(initialHistory)
  const [saved, setSaved] = useState(false)

  const appliedTotal = useMemo(() => candidates.filter((row) => selected.includes(row.id)).reduce((sum, row) => sum + row.applied, 0), [candidates, selected])
  const remaining = incomeTotal - appliedTotal
  const filtered = candidates.filter((row) => (filter === "Todas" || row.status === filter) && `${row.id} ${row.executive}`.toLowerCase().includes(query.toLowerCase()))

  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]) }
  function updateAmount(id: string, value: string) { const amount = Math.max(0, Math.min(Number(value) || 0, candidates.find((row) => row.id === id)?.balance ?? 0)); setCandidates((rows) => rows.map((row) => row.id === id ? { ...row, applied: amount, application: amount >= row.balance ? "Total" : "Parcial" } : row)) }
  function applyMax(id: string) { const row = candidates.find((candidate) => candidate.id === id); if (!row) return; updateAmount(id, String(row.balance)); if (!selected.includes(id)) toggle(id) }
  function reverse() { if (!reverseRow || reason.trim().length < 15) return; setHistory((rows) => [...rows, { code: `REV-2026-${String(rows.length + 5).padStart(4, "0")}`, date: "23/10/2026 · 11:06", amount: reverseRow.amount, type: "Reverso", cxc: reverseRow.cxc, actor: `María González · ${reason.trim()}` }]); setReverseRow(null); setReason("") }

  return <div className="app-shell"><aside className="sidebar hidden lg:flex"><div className="sidebar-content"><div className="brand"><img src="/logo-atenas.png" alt="ATENAS" /></div><div className="workspace-switch"><div className="workspace-avatar">LF</div><div><strong>Lo-Fi workspace</strong><span>Tesorería</span></div><ChevronDown size={15} /></div><nav className="nav" aria-label="Navegación principal"><span className="nav-label">MENÚ PRINCIPAL</span><a href="#resumen">Resumen</a><span className="nav-label second">GESTIÓN</span><a href="/personas">Personas</a><a href="/maestro-cartera">Maestro de cartera</a><a href="/asignaciones">Asignaciones de cartera</a><a className="active" href="/cobro-ingreso" aria-current="page">Aplicación a CxC</a><a href="/estructuras">Estructuras</a></nav></div><div className="sidebar-footer"><div className="support-card">¿Necesitas ayuda?</div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div></div></div></aside><div className="content"><header className="topbar"><div className="breadcrumb"><span>Tesorería</span><span>›</span><strong>Aplicación a CxC</strong></div><div className="top-user"><span className="user-avatar">MG</span><span className="hidden md:inline">María González</span></div></header><main className="detail-page"><div className="page-wrap max-w-[1600px]"><div className="detail-breadcrumb">Tesorería <span>›</span> <strong>Aplicación a CxC</strong></div><div className="mb-7"><p className="detail-eyebrow">TESORERÍA · CUENTAS POR COBRAR</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Aplicación de Ingresos a Cuentas por Cobrar</h1><p className="mt-2 max-w-3xl text-xs text-slate-500">Aplica total o parcialmente un ingreso disponible a una o varias CxC del cliente, conservando saldo, historial y reversos.</p></div>

<section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">Origen y control de fechas</h2></div><div className="grid gap-4 md:grid-cols-[minmax(340px,1.45fr)_minmax(220px,1fr)_minmax(250px,1fr)]"><div className="min-w-0"><FieldLabel>Ingreso bancario disponible</FieldLabel><select className="input-class w-full min-w-[340px] whitespace-nowrap" defaultValue="ING-2026-00068-BNC" aria-label="Ingreso bancario disponible"><option>ING-2026-00068-BNC · 00203991 · USD 12.500,00</option><option>ING-2026-00064-BNC · 00203811 · USD 4.800,00</option></select></div><div className="min-w-0"><FieldLabel>Fecha contable de aplicación</FieldLabel><div className="relative"><input className="input-class w-full pr-10" type="date" defaultValue="2026-07-15" aria-label="Fecha contable de aplicación" /><CalendarDays className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></div></div><div className="flex min-w-0 items-end gap-3"><StatusBadge>Disponible</StatusBadge><p className="pb-1 text-[11px] leading-4 text-slate-500">Estado del ingreso: Disponible para aplicación</p></div></div></section>

<section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-sm font-semibold text-slate-800">Resumen del ingreso seleccionado</h2><div className="grid gap-4 md:grid-cols-4">{[["Moneda origen", "USD"], ["Saldo disponible", `${money(incomeTotal)} USD`], ["Ref. bancaria", "BNC-00203991"], ["Fecha ing.", "15/07/2026"]].map(([label, value]) => <div key={label}><FieldLabel>{label}</FieldLabel><div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-semibold text-slate-600"><Lock size={13} className="text-slate-400" />{value}</div></div>)}</div></section>

<section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"><div><h2 className="text-sm font-semibold text-slate-800">Cuentas por cobrar candidatas</h2><p className="mt-1 text-xs text-slate-500">Selecciona las obligaciones que recibirán la aplicación.</p></div><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} /><input className="input-class rounded-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar CxC por documento o cliente..." /></div></div><div className="mt-4 flex gap-2"><div role="tablist" aria-label="Filtrar CxC">{["Todas", "Pendiente", "Parcial"].map((item) => <button type="button" role="tab" aria-selected={filter === item} key={item} onClick={() => setFilter(item)} className={`mr-2 rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item ? "bg-[#2A4B93] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{item}</button>)}</div></div></div><div className="table-scroll rounded-none border-0 border-t"><table className="min-w-[1280px]"><thead><tr><th className="w-16">Selección</th><th className="min-w-[165px]">Documento</th><th>Estado</th><th className="min-w-[160px]">Ejecutivo responsable</th><th className="min-w-[150px] text-right">Saldo CxC</th><th className="min-w-[140px]">Tipo aplicación</th><th className="min-w-[165px] text-right">Monto a aplicar</th><th className="min-w-[145px] text-right">Diferencial cambiario</th><th className="sticky right-0 z-10 min-w-[120px] bg-[#fbfdff] text-right">Acciones</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td><input aria-label={`Seleccionar ${row.id}`} type="checkbox" checked={selected.includes(row.id)} onChange={() => toggle(row.id)} className="size-4 accent-[#2A4B93]" /></td><td><strong>{row.id}</strong></td><td><StatusBadge>{row.status}</StatusBadge></td><td>{row.executive}</td><td className="text-right font-medium">{money(row.balance)} USD</td><td><select className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs" value={row.application} onChange={(event) => updateAmount(row.id, event.target.value === "Total" ? String(row.balance) : String(Math.min(row.applied, row.balance - 0.01)))}><option>Total</option><option>Parcial</option></select></td><td className="text-right"><input aria-label={`Monto a aplicar ${row.id}`} type="number" min="0" max={row.balance} step="0.01" value={selected.includes(row.id) ? row.applied : 0} onChange={(event) => updateAmount(row.id, event.target.value)} className="w-32 rounded-lg border border-slate-200 px-2.5 py-2 text-right text-xs font-semibold outline-none focus:border-[#2A4B93]" /></td><td className="text-right text-slate-500">0,00 USD</td><td className="sticky right-0 z-10 bg-white text-right"><button type="button" onClick={() => selected.includes(row.id) ? toggle(row.id) : applyMax(row.id)} className="rounded-full border border-[#2A4B93] px-3 py-1.5 text-[11px] font-semibold text-[#2A4B93] hover:bg-blue-50">{selected.includes(row.id) ? "Quitar" : "Aplicar max"}</button></td></tr>)}</tbody></table></div></section>

<section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><div className="rounded-lg bg-blue-50 p-2 text-[#2A4B93]"><Check size={16} /></div><div><h2 className="text-sm font-semibold text-slate-800">Consola de cuadre y resumen financiero</h2><p className="text-xs text-slate-500">Cálculo actualizado en tiempo real.</p></div></div><div className="grid gap-3 md:grid-cols-3"><div className="rounded-lg bg-slate-50 p-4"><span className="block text-[10px] font-bold uppercase text-slate-400">Monto total ingreso</span><strong className="mt-2 block text-lg text-slate-800">{money(incomeTotal)} USD</strong></div><div className="rounded-lg bg-violet-50 p-4"><span className="block text-[10px] font-bold uppercase text-violet-500">Total aplicado a CxC</span><strong className="mt-2 block text-lg text-violet-700">{money(appliedTotal)} USD</strong></div><div className="rounded-lg bg-blue-50 p-4"><span className="block text-[10px] font-bold uppercase text-blue-500">Remanente disponible</span><strong className="mt-2 block text-lg text-blue-700">{money(remaining)} USD</strong></div></div><div className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-xs font-semibold ${remaining >= 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{remaining >= 0 ? <Check size={16} /> : <CircleAlert size={16} />}{remaining >= 0 ? "VALIDACIÓN VISUAL: CUADRE VÁLIDO" : "ALERTA: EL MONTO APLICADO EXCEDE EL DISPONIBLE"}</div></section>

<section className="mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 p-5"><div><h2 className="text-sm font-semibold text-slate-800">Historial de aplicaciones y reversos</h2><p className="mt-1 text-xs text-slate-500">Registro de auditoría de movimientos sobre este ingreso.</p></div><History size={18} className="text-slate-400" /></div><div className="table-scroll rounded-none border-0"><table className="min-w-[950px]"><thead><tr><th>Código</th><th>Fecha / hora</th><th className="text-right">Monto aplicado</th><th>Tipo</th><th>CxC afectada</th><th>Actor / motivo</th><th className="sticky right-0 z-10 bg-[#fbfdff] text-right">Acciones</th></tr></thead><tbody>{history.map((row) => <tr key={row.code}><td><strong>{row.code}</strong></td><td>{row.date}</td><td className="text-right font-medium">{money(row.amount)} USD</td><td><StatusBadge>{row.type}</StatusBadge></td><td>{row.cxc}</td><td className="max-w-[280px] truncate">{row.actor}</td><td className="sticky right-0 bg-white text-right"><button type="button" disabled={row.type === "Reverso"} title={row.type === "Reverso" ? "No se puede re-ejecutar un reverso" : "Reversar aplicación"} onClick={() => setReverseRow(row)} className="rounded-full border border-rose-300 px-3 py-1.5 text-[11px] font-semibold text-rose-600 disabled:cursor-not-allowed disabled:opacity-40">Reversar</button></td></tr>)}</tbody></table></div></section>

<div className="sticky bottom-0 z-20 -mx-10 flex items-center justify-between gap-4 border-t border-slate-200 bg-white/95 px-5 py-4 backdrop-blur"><button type="button" onClick={() => { setCandidates(initialCandidates); setSelected([]); setSaved(false) }} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><div className="flex items-center gap-3"><span className="hidden text-xs text-slate-500 sm:inline">{saved ? "Aplicación confirmada" : `${selected.length} CxC seleccionadas`}</span><button type="button" disabled={remaining < 0 || appliedTotal === 0} onClick={() => setConfirmOpen(true)} className="rounded-full bg-[#2A4B93] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#203b78] disabled:cursor-not-allowed disabled:opacity-45">Confirmar y liquidar aplicación</button></div></div></div></main></div>

{confirmOpen && <Modal title="Confirmación de liquidación" onClose={() => setConfirmOpen(false)}><div className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex justify-between"><span className="text-slate-500">Ingreso disponible</span><strong>{money(incomeTotal)} USD</strong></div><div className="mt-3 flex justify-between"><span className="text-slate-500">Total a aplicar</span><strong className="text-violet-700">{money(appliedTotal)} USD</strong></div><div className="mt-3 flex justify-between border-t border-slate-200 pt-3"><span className="text-slate-500">Remanente</span><strong className="text-blue-700">{money(remaining)} USD</strong></div></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setConfirmOpen(false)} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancelar</button><button type="button" onClick={() => { setSaved(true); setConfirmOpen(false) }} className="rounded-full bg-[#2A4B93] px-4 py-2 text-xs font-semibold text-white">Sí, confirmar aplicación</button></div></Modal>}
{reverseRow && <Modal title="Reversión de aplicación" onClose={() => { setReverseRow(null); setReason("") }}><p className="mb-4 text-xs text-slate-500">Se reversará <strong>{money(reverseRow.amount)} USD</strong> de {reverseRow.cxc}. Esta acción quedará registrada en la auditoría.</p><label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="reverse-reason">Motivo del reverso <span className="text-rose-600">*</span></label><textarea id="reverse-reason" value={reason} onChange={(event) => setReason(event.target.value)} minLength={15} rows={4} className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10" placeholder="Describe el motivo (mínimo 15 caracteres)" /><div className="mt-1 text-right text-[11px] text-slate-400">{reason.trim().length}/15 caracteres mínimos</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setReverseRow(null)} className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancelar</button><button type="button" disabled={reason.trim().length < 15} onClick={reverse} className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Confirmar Reverso</button></div></Modal>}</div>
}
