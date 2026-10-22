"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  ChevronDown,
  FileText,
  FileUp,
  Lock,
  MoreVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";

const records = [
  { id: "ING-2026-0048", date: "18/10/2026", reference: "TRF-8820194", method: "Transferencia", client: "Corporación Andina, C.A.", amount: "USD 2,450.00", status: "Disponible", application: "Pendiente" },
  { id: "ING-2026-0047", date: "17/10/2026", reference: "ZEL-339021", method: "Pago móvil", client: "Servicios Delta, S.A.", amount: "USD 980.00", status: "Aplicado", application: "Aplicado" },
  { id: "ING-2026-0046", date: "16/10/2026", reference: "DEP-110284", method: "Depósito", client: "Pendiente de identificación", amount: "VES 18,500.00", status: "Registrado", application: "Pendiente" },
  { id: "ING-2026-0045", date: "14/10/2026", reference: "TRF-8813201", method: "Transferencia", client: "Inversiones Meridiano", amount: "EUR 1,200.00", status: "Reversado", application: "No aplica" },
];

const inputClass = "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500";

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Registrado: "border-sky-200 bg-sky-50 text-sky-700", Disponible: "border-emerald-200 bg-emerald-50 text-emerald-700", Aplicado: "border-violet-200 bg-violet-50 text-violet-700", Pendiente: "border-amber-200 bg-amber-50 text-amber-700", Reversado: "border-rose-200 bg-rose-50 text-rose-700", "No aplica": "border-slate-200 bg-slate-50 text-slate-500",
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[value] ?? styles.Pendiente}`}>{value}</span>;
}

function SelectField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={labelClass}>{label}</label><div className="relative"><select className={`${inputClass} appearance-none pr-8`}>{children}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /></div></div>;
}

export default function CobroIngresoModule() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tab, setTab] = useState("Todos");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState(false);
  const [client, setClient] = useState("Corporación Andina, C.A.");
  const [clientOpen, setClientOpen] = useState(false);
  const [amount, setAmount] = useState("2450");
  const [rate, setRate] = useState("36.50");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const referenceAmount = useMemo(() => (Number(amount || 0) * Number(rate || 0)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), [amount, rate]);
  const filtered = records.filter((record) => {
    const matchesTab = tab === "Todos" || record.status === tab.slice(0, -1) || record.application === tab.slice(0, -1);
    return matchesTab && (!query || [record.id, record.reference, record.client, record.amount].join(" ").toLowerCase().includes(query.toLowerCase()));
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => { setSaved(false); setDrawerOpen(false); }, 1000);
  }

  return <div className="app-shell">
    <aside className="sidebar hidden lg:flex"><div className="sidebar-content"><div className="brand"><img src="/logo-atenas.png" alt="ATENAS" /></div><div className="workspace-switch"><div className="workspace-avatar">LF</div><div><strong>Lo-Fi workspace</strong><span>Tesorería</span></div><ChevronDown size={15} /></div><nav className="nav" aria-label="Navegación principal"><span className="nav-label">MENÚ PRINCIPAL</span><a href="#resumen">Resumen</a><span className="nav-label second">GESTIÓN</span><a href="/personas">Personas</a><a href="/servicios">Servicios</a><a href="/maestro-cartera">Maestro de cartera</a><a href="/asignaciones">Asignaciones de cartera</a><a href="/estructuras">Estructuras</a><a className="active" href="/cobro-ingreso" aria-current="page">Cobro / Ingreso</a><span className="nav-label second">CONFIGURACIÓN</span><a href="#gobernanza">Gobernanza</a><a href="#ajustes">Ajustes</a></nav></div><div className="sidebar-footer"><div className="support-card">¿Necesitas ayuda?</div><div className="user-card"><div className="user-avatar">MG</div><div><strong>María González</strong><span>Administradora</span></div></div></div></aside>
    <div className="content"><header className="topbar"><div className="breadcrumb"><span>Tesorería</span><span>›</span><strong>Cobro / Ingreso</strong></div><div className="top-user"><span className="user-avatar">MG</span><span className="hidden md:inline">María González</span></div></header>
      <main className="detail-page"><div className="page-wrap">
        <div className="detail-breadcrumb">Tesorería <span>›</span> <strong>Cobro / Ingreso</strong></div>
        <div className="page-heading"><div><div className="eyebrow">TESORERÍA</div><h1>Cobro / Ingreso</h1><p>Consulta, aplica o gestiona los movimientos de ingreso en tesorería.</p></div><button type="button" className="primary-button" onClick={() => setDrawerOpen(true)}>+ Registrar Ingreso</button></div>
        <section className="kpi-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}><div className="kpi-card"><span>Total Recibido</span><strong>USD 42,680.00</strong><small>4 movimientos</small></div><div className="kpi-card"><span>Pendiente de Identificación</span><strong>USD 3,240.00</strong><small>Requiere revisión</small></div><div className="kpi-card"><span>Aplicado a CxC</span><strong>USD 31,840.00</strong><small>74.6% del total</small></div></section>
        <section className="panel"><div className="results-header"><div><div className="section-title">Histórico de Cobros / Ingresos <span className="result-count">{filtered.length}</span></div><p className="result-filter-note">Consulta y gestiona los ingresos registrados en tesorería.</p></div><div className="search-box"><Search size={14} /><input aria-label="Buscar en el histórico" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por ID, referencia o cliente" /></div></div>
          <div className="condition-tabs">{[["Todos", 4], ["Registrados", 1], ["Disponibles", 1], ["Aplicados", 1], ["Reversados", 1]].map(([label, count]) => <button type="button" key={label} onClick={() => setTab(String(label))} className={`tab ${tab === label ? "active" : ""}`}>{label}<span>{count}</span></button>)}</div>
          <div className="table-scroll"><table><thead><tr><th>ID / Fecha</th><th>Referencia / Medio</th><th>Cliente</th><th className="right">Importe</th><th>Estado</th><th className="right">Acciones</th></tr></thead><tbody>{filtered.map((record) => <tr key={record.id}><td><strong>{record.id}</strong><small>{record.date}</small></td><td><strong>{record.reference}</strong><small>{record.method}</small></td><td>{record.client}</td><td className="right"><strong>{record.amount}</strong></td><td><div className="flex flex-wrap gap-1.5"><StatusBadge value={record.status} /><StatusBadge value={record.application} /></div></td><td><div className="actions-cell"><button type="button" className="row-action">Consultar / Aplicar</button><div className="row-menu"><button type="button" className="icon-button" aria-label={`Más acciones para ${record.id}`} onClick={() => setMenu(menu === record.id ? null : record.id)}><MoreVertical size={16} /></button>{menu === record.id && <div className="row-menu-popover"><button type="button" onClick={() => setMenu(null)}>Ver comprobante digital</button><button type="button" onClick={() => setMenu(null)}>Trazabilidad del registro</button><button type="button" onClick={() => setMenu(null)}>Reversar ingreso</button></div>}</div></div></td></tr>)}</tbody></table></div>
        </section>
      </div></main>
    </div>
    {drawerOpen && <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}><form className="drawer" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="drawer-title"><header className="drawer-header"><div><div className="eyebrow">FICHA F05</div><h2 id="drawer-title">REGISTRAR NUEVO INGRESO</h2></div><button type="button" className="icon-button" onClick={() => setDrawerOpen(false)} aria-label="Cerrar"><X size={20} /></button></header><div className="drawer-body"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-slate-900">ING-2026-0048</strong><StatusBadge value="Registrado" /><StatusBadge value="Pendiente" /></div><div className="drawer-section"><h3>FECHAS</h3><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Fecha de registro</label><div className="relative"><input className={`${inputClass} pr-8`} type="date" defaultValue="2026-10-18" /><Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /></div></div><div><label className={labelClass}>Fecha valor banco</label><input className={inputClass} type="date" defaultValue="2026-10-18" /></div></div></div><div className="drawer-section"><h3>TRAZABILIDAD, ORIGEN Y ASOCIACIÓN DE CLIENTE</h3><div className="flex flex-col gap-3"><SelectField label="Unidad de negocio"><option>Unidad Corporativa</option><option>Unidad Comercial Norte</option></SelectField><SelectField label="Banco receptor / cuenta"><option>Banco Nacional · **** 4821</option><option>Banco Mercantil · **** 1930</option></SelectField><div><label className={labelClass}>Nro. referencia bancaria</label><input className={inputClass} defaultValue="TRF-8820194" /></div><SelectField label="Medio de ingreso"><option>Transferencia</option><option>Pago móvil</option><option>Zelle</option><option>Depósito</option></SelectField><div className="relative"><label className={labelClass}>Cliente asociado</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} /><input className={`${inputClass} pl-9`} value={client} disabled={pendingId} onFocus={() => setClientOpen(true)} onChange={(event) => { setClient(event.target.value); setClientOpen(true); }} /></div>{clientOpen && !pendingId && <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"><button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => { setClient("Corporación Andina, C.A."); setClientOpen(false); }}>Corporación Andina, C.A.</button><button type="button" className="block w-full px-3 py-2 text-left text-xs hover:bg-slate-50" onClick={() => { setClient("Inversiones Meridiano"); setClientOpen(false); }}>Inversiones Meridiano</button></div>}</div><label className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700"><input type="checkbox" checked={pendingId} onChange={(event) => setPendingId(event.target.checked)} className="mt-0.5 accent-[#2A4B93]" />Pendiente de identificación</label></div></div><div className="drawer-section"><h3>VALORES FINANCIEROS Y MONEDAS MULTIVARIABLE</h3><div className="grid grid-cols-2 gap-3"><SelectField label="Moneda original"><option>USD</option><option>VES</option><option>EUR</option><option>BRL</option></SelectField><div><label className={labelClass}>Importe original</label><input className={inputClass} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></div><SelectField label="Moneda de referencia"><option>VES</option><option>USD</option></SelectField><div><label className={labelClass}>Tasa de cambio</label><input className={inputClass} type="number" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} /></div></div><div className="detail-field calculated mt-3"><span>Importe de referencia - calculado</span><strong><Lock size={13} /> {referenceAmount} VES</strong></div></div><div className="drawer-section"><h3>COMPROBANTE Y OBSERVACIONES</h3><label className="flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-3 text-center hover:border-[#2A4B93]"><FileUp size={20} className="mb-1 text-[#2A4B93]" /><span className="text-xs font-semibold text-slate-700">Haz clic para seleccionar o arrastra el archivo</span><span className="text-[10px] text-slate-400">PDF, PNG o JPG · Tamaño máximo 10 MB</span><input type="file" className="sr-only" /></label><div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-xs"><span className="flex items-center gap-2 truncate"><FileText size={15} className="text-rose-500" /> comprobante_trf_8820194.pdf</span><span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700"><Lock size={12} /> Carga segura <Trash2 size={13} /></span></div><label className={`${labelClass} mt-2`}>Observaciones de ingreso</label><textarea className="w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-[#2A4B93]" rows={4} maxLength={500} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Añade información relevante sobre este ingreso..." /><div className="text-right text-[10px] text-slate-400">{notes.length} / 500</div></div></div><footer className="drawer-footer"><button type="button" className="outline-button" onClick={() => setDrawerOpen(false)}>Cancelar</button><button type="submit" className="primary-button">{saved ? "Ingreso registrado" : "Registrar Ingreso"}</button></footer></form></div>}
  </div>;
}
