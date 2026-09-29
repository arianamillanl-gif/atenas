'use client'

import { useState } from 'react'
import { Bell, Briefcase, Building2, Check, CheckCircle2, ChevronDown, ChevronRight, Clock, Eye, FileSpreadsheet, FileText, GitCompare, Hash, History, Layers, RefreshCw, Search, ShieldCheck, Sliders, User, X, XCircle } from 'lucide-react'

type Version = { version: string; date: string; actor: string; reason: string; status: 'VIGENTE' | 'SUSTITUIDA'; integration: 'EXITOSO' | 'FALLIDO'; personId: string }

const versions: Version[] = [
  { version: 'V3', date: '14/08/2026 10:22:07', actor: 'MORALES, Luis', personId: 'PER-2025-00003', reason: 'Ajuste de tarifa por renovación contractual Q3-2026 aprobado en comité comercial.', status: 'VIGENTE', integration: 'EXITOSO' },
  { version: 'V2', date: '01/07/2026 09:15:44', actor: 'RODRÍGUEZ, Ana', personId: 'PER-2024-D0047', reason: 'Corrección de plazo de pago: de 30 días a 45 días. Autorizado por Gerencia CxC.', status: 'SUSTITUIDA', integration: 'FALLIDO' },
  { version: 'V1', date: '18/06/2026 14:03:29', actor: 'PÉREZ, Carlos', personId: 'PER-2024-D0011', reason: 'Registro inicial de condiciones de la venta. Cuotas mensuales a 30 días.', status: 'SUSTITUIDA', integration: 'EXITOSO' },
]

export default function HistorialCondicionesIntegracion({ onBack }: { onBack: () => void }) {
  const [drawer, setDrawer] = useState<Version | null>(null)
  const [technicalOpen, setTechnicalOpen] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [notice, setNotice] = useState('')

  const retry = () => { setRetrying(true); window.setTimeout(() => { setRetrying(false); setNotice('Reintento de integración V2 encolado') }, 700) }

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 overflow-hidden px-6 pb-6 pt-20 text-slate-900">
      <header className="-mx-8 -mt-8 w-[calc(100%+4rem)] h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700"><span className="size-2 rounded-full bg-indigo-600" />Lo-Fi workspace · Operaciones</span>
        <div className="flex items-center gap-3"><label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 md:flex"><Search className="size-3.5" /><input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" className="w-28 bg-transparent text-xs outline-none" /><kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">⌘K</kbd></label><button type="button" aria-label="Notificaciones" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#2A4B93]" /></button><span className="mx-2 h-5 w-px bg-slate-200" /><button type="button" className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50"><span className="flex size-8 items-center justify-center rounded-full bg-[#2A4B93] text-xs font-bold text-white">MG</span><span className="hidden text-xs font-semibold sm:block">María González</span><ChevronDown className="size-3.5 text-slate-400" /></button></div>
      </header>

  <div className="mb-6 w-full border-b border-slate-200/80 bg-slate-50/50 px-8 py-6">
    <nav className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400" aria-label="Migas de pan">
      <span className="cursor-pointer hover:text-slate-700">Ventas</span><span aria-hidden="true">&gt;</span><span className="cursor-pointer hover:text-slate-700">Ventas verificadas</span><span aria-hidden="true">&gt;</span><span className="font-semibold text-slate-800">Historial de Condiciones e Integración</span>
    </nav>
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2A4B93]"><ShieldCheck className="size-3.5" aria-hidden="true" />CONTROL OPERATIVO / AUDITORÍA</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Historial de Condiciones e Integración</h1>
        <p className="mt-1 text-xs font-medium text-slate-500">Supervisa la trazabilidad de versiones comerciales y la sincronización en tiempo real de cuentas por cobrar (CxC).</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A4B93]/20 bg-[#2A4B93]/10 px-3.5 py-1.5 text-xs font-bold text-[#2A4B93] shadow-2xs"><Layers className="size-3.5" />Auditoría de versiones</span>
      </div>
    </div>
  </div>

      <div className="w-full space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-12 lg:items-center">
          <div className="grid min-w-0 grid-cols-1 gap-4 border-slate-100 pr-0 sm:grid-cols-3 lg:col-span-8 lg:border-r lg:pr-6 xl:col-span-8">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><Hash className="size-3.5" /> Venta ID / Clientify</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900"><span>VNT-2026-00312</span><span className="text-xs font-normal text-slate-400">· CLF-88312</span></div>
            </div>
            <div className="min-w-0 space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><Building2 className="size-3.5" /> Cliente</span>
              <div className="truncate text-sm font-bold text-slate-900" title="CONSTRUCTORA DEL LLANO C.A.">CONSTRUCTORA DEL LLANO C.A.</div>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><Briefcase className="size-3.5" /> Servicio</span>
              <div><div className="text-sm font-bold text-slate-900">SRV-2026-00031</div><div className="text-xs font-normal text-slate-500">Consultoría Comercial</div></div>
            </div>
          </div>
          <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 sm:px-5 lg:col-span-4 xl:col-span-4">
            <div className="min-w-0 flex-1 space-y-0.5"><span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">Importe Total</span><div className="flex items-baseline gap-1.5"><span className="text-base font-bold tracking-tight text-slate-900">18.500,00</span><span className="text-xs font-semibold text-slate-500">USD</span></div></div>
            <div className="h-8 w-px shrink-0 bg-slate-200/70" aria-hidden="true" />
            <div className="min-w-0 max-w-full flex-1 space-y-0.5 pr-0 text-right sm:pr-1"><span className="block truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">Responsable</span><span className="block max-w-full break-words text-xs font-semibold text-slate-700" title="MORALES, Luis">MORALES, Luis</span></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 border-l-4 border-l-[#2A4B93] bg-slate-50/80 p-3.5 text-xs">
          <div className="flex items-center gap-2.5"><span className="flex items-center gap-1.5 rounded-lg bg-[#2A4B93] px-2.5 py-1 text-xs font-bold text-white shadow-2xs"><Layers className="size-3.5" /> Versión Vigente: V3</span><span className="flex items-center gap-1 text-[11px] font-medium text-slate-500"><Clock className="size-3.5 text-slate-400" /> Activada: <strong className="font-semibold text-slate-700">14/08/2026 10:22:07</strong></span></div>
          <div className="flex flex-wrap items-center gap-4"><span className="flex items-center gap-1 text-[11px] font-medium text-slate-500"><User className="size-3.5 text-slate-400" /> Autor: <strong className="font-semibold text-slate-700">Morales, Luis</strong></span><span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-2xs"><FileSpreadsheet className="size-3 text-[#2A4B93]" /> 4 CxC Vinculadas</span><span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 shadow-2xs"><CheckCircle2 className="size-3.5 text-emerald-600" /> Integración Exitosa</span></div>
        </div>
      </div>

      <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="text-base font-bold text-slate-900">Línea temporal de versiones</h2></div><div className="overflow-x-auto"><table className="w-full text-left border-collapse table-fixed"><thead className="bg-slate-100/70 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><tr>{['V.NRO','FECHA · HORA','ACTOR','MOTIVO DEL CAMBIO','ESTADO NEG.','EVIDENCIA','CXC','INTEGRACIÓN','ACCIONES'].map((heading) => <th key={heading} className="px-2 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{versions.map((v) => <tr key={v.version} className={`align-top hover:bg-slate-50/70 ${v.version === 'V3' ? 'bg-slate-50/50' : ''}`}><td className="px-2 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold text-slate-700">{v.version}</span></td><td className="whitespace-nowrap px-5 py-4 text-xs text-slate-600">{v.date}</td><td className="px-2 py-4 font-semibold text-slate-700">{v.actor}<span className="block text-[10px] font-normal text-slate-400">({v.personId})</span></td><td className="w-1/3 px-4 py-3 text-xs text-slate-700 leading-relaxed align-middle"><p className="line-clamp-2 break-words" title={v.reason}>{v.reason}</p></td><td className="px-2 py-4">{v.status === 'VIGENTE' ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"><CheckCircle2 className="w-3 h-3 text-emerald-600" />Vigente</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"><Clock className="w-3 h-3 text-slate-400" />Sustituida</span>}</td><td className="px-2 py-4"><div className="flex items-center gap-1.5 whitespace-nowrap"><button type="button" onClick={() => setDrawer(v)} className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-[11px] font-medium transition-colors shadow-2xs"><Eye className="w-3 h-3 text-slate-400" />Ver detalle</button><button type="button" className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-[11px] font-medium transition-colors shadow-2xs"><GitCompare className="w-3 h-3 text-slate-400" />Comparar</button><button type="button" className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-[11px] font-medium transition-colors shadow-2xs"><FileText className="w-3 h-3 text-slate-400" />CxC vinculadas</button></div></td><td className="px-2 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-[#2A4B93]">4</span></td><td className="px-2 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${v.integration === 'EXITOSO' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{v.integration === 'EXITOSO' ? '• EXITOSO' : '✕ FALLIDO'}</span></td><td className="px-2 py-4"><div className="flex gap-2"><button type="button" onClick={() => setDrawer(v)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold hover:bg-slate-50">Ver detalle</button><button type="button" className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"><GitCompare className="size-3 text-slate-400" />Comparar</button><button type="button" className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"><FileText className="size-3 text-slate-400" />CxC vinculadas</button><button type="button" onClick={() => setNotice(`Comparación ${v.version} preparada`)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold hover:bg-slate-50">Comparar</button><button type="button" onClick={() => setNotice('Cuentas por cobrar vinculadas: 4')} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-semibold hover:bg-slate-50">CxC vinculadas</button></div></td></tr>)}</tbody></table></div></section>

      <section className="w-full space-y-4 rounded-2xl border border-amber-200/80 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold text-slate-900"><RefreshCw className="size-4 text-amber-600" />Panel de Integración y Recuperación</span><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Error Reintentable · V2</span></div><div className="grid gap-5 md:grid-cols-3"><Data label="NÚMERO DE INTENTOS" value="3" hint="intentos realizados · máx 5" /><Data label="ÚLTIMO RESULTADO" value="Falló la conexión con el servidor de facturación. El servicio no respondió en el tiempo esperado." /><Data label="ÚLTIMO INTENTO" value="01/07/2026 - 09:47:12 UTC" /></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900"><b>RECUPERACIÓN LIMPIA:</b> el reintento retoma la misma integración fallida de la v2. No crea nuevas operaciones comerciales ni duplica registros de negocio.</div><div className="mt-5 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={retry} disabled={retrying} className="flex items-center gap-2 rounded-full bg-[#2A4B93] px-6 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-[#223d78] disabled:opacity-60"><RefreshCw className={`mr-2 inline size-3.5 ${retrying ? 'animate-spin' : ''}`} />{retrying ? 'REINTENTANDO...' : 'REINTENTAR INTEGRACIÓN - V2'}</button><button type="button" onClick={() => setTechnicalOpen(!technicalOpen)} className="text-xs font-semibold text-slate-600 hover:text-[#2A4B93]">{technicalOpen ? '▲' : '▼'} DATOS TÉCNICOS <span className="font-normal text-slate-400">| ID CORRELACIÓN: CORR-2026-88392-X</span></button></div>{technicalOpen && <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-slate-300">{JSON.stringify({ correlation_id: 'CORR-2026-88392-X', retryable: true, source: 'billing-service', mode: 'append-only' }, null, 2)}</pre>}</section>

      {drawer && <div className="fixed inset-0 z-50 bg-slate-950/35" onClick={() => setDrawer(null)}><aside className="absolute right-0 top-0 h-full w-96 overflow-y-auto bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-100 pb-4"><h2 className="text-lg font-bold">Detalle {drawer.version}</h2><button type="button" aria-label="Cerrar" onClick={() => setDrawer(null)}><X className="size-4" /></button></div><div className="space-y-4 py-5"><Data label="Fecha y hora" value={drawer.date} /><Data label="Actor" value={`${drawer.actor} (${drawer.personId})`} /><Data label="Motivo del cambio" value={drawer.reason} /><Data label="Estado negocio" value={drawer.status} /><Data label="Integración" value={drawer.integration} /></div></aside></div>}
      {notice && <button type="button" onClick={() => setNotice('')} className="fixed right-6 top-20 z-[70] rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg"><Check className="mr-2 inline size-3.5" />{notice}</button>}
    </div>
  )
}

function Data({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span><span className="mt-1 block text-sm font-semibold leading-5 text-slate-800">{value}</span>{hint && <span className="mt-1 block text-[10px] text-slate-400">{hint}</span>}</div>
}
