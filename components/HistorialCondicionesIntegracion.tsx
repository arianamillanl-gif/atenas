'use client'

import { useState } from 'react'
import { Bell, Briefcase, Building2, Check, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Clock, Code2, Copy, Eye, FileSpreadsheet, FileText, GitCompare, Hash, History, Layers, RefreshCw, Search, ShieldAlert, ShieldCheck, Sliders, User, X, XCircle } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

  const retry = () => { setRetrying(true); window.setTimeout(() => { setRetrying(false); setNotice('Reintento de integración V2 encolado') }, 700) }
  const jsonPayload = JSON.stringify({ correlation_id: 'CORR-2026-88392-X', retryable: true, source: 'billing-service', mode: 'append-only' }, null, 2)
  const copyPayload = async () => { await navigator.clipboard.writeText(jsonPayload); setCopied(true); window.setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-hidden bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-8">
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"><span className="size-2 rounded-full bg-purple-600" aria-hidden="true" />Lo-Fi workspace · Operaciones</span>
        <div className="flex items-center gap-4">
          <div className="flex w-64 items-center justify-between rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs text-slate-400"><span className="flex items-center gap-2"><Search className="size-3.5" aria-hidden="true" />Búsqueda rápida</span><kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500">⌘K</kbd></div>
          <button type="button" aria-label="Notificaciones" className="relative text-slate-500"><Bell className="size-4" /><span className="absolute -right-1 -top-1 size-1.5 rounded-full bg-[#2A4B93]" /></button>
          <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
          <div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-[#2A4B93] text-xs font-bold text-white">MG</span><span className="text-xs font-semibold text-slate-700">María González</span><ChevronDown className="size-3.5 text-slate-400" /></div>
        </div>
      </header>
      <main className="space-y-6 px-8 pb-8">
  <div className="w-full space-y-3 border-b border-slate-200/80 pb-5 pt-6">
    <nav className="flex items-center gap-2 text-xs font-medium text-slate-400" aria-label="Migas de pan">
      <span className="cursor-pointer transition-colors hover:text-slate-700">Ventas</span><span className="text-slate-300">&gt;</span><span className="cursor-pointer transition-colors hover:text-slate-700">Ventas verificadas</span><span className="text-slate-300">&gt;</span><span className="font-semibold text-slate-800">Historial de Condiciones e Integración</span>
    </nav>
    <div className="flex flex-col justify-between gap-4 pt-1 sm:flex-row sm:items-end">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2A4B93]"><ShieldCheck className="size-3.5" aria-hidden="true" />CONTROL OPERATIVO / AUDITORÍA</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Historial de Condiciones e Integración</h1>
        <p className="text-xs font-medium text-slate-500">Supervisa la trazabilidad de versiones comerciales y la sincronización en tiempo real de cuentas por cobrar (CxC).</p>
      </div>
      <div className="shrink-0"><span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A4B93]/20 bg-[#2A4B93]/10 px-3.5 py-1.5 text-xs font-bold text-[#2A4B93] shadow-2xs"><Layers className="size-3.5" />Auditoría de versiones</span></div>
    </div>
  </div>

      <section className="w-full space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
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
      </section>

      <section className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs"><div className="border-b border-slate-100 bg-slate-50/30 px-6 py-4"><h2 className="text-sm font-bold tracking-tight text-slate-900">Línea temporal de versiones</h2><p className="mt-0.5 text-[11px] font-medium text-slate-400">Historial de cambios y trazabilidad de la operación</p></div><div className="overflow-x-auto"><table className="w-full table-auto border-collapse text-left"><thead className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400"><tr>{['V.NRO','FECHA · HORA','ACTOR','MOTIVO DEL CAMBIO','ESTADO NEG.','EVIDENCIA','CXC','INTEGRACIÓN','ACCIONES'].map((heading) => <th key={heading} className="px-2 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 text-xs text-slate-700">{versions.map((v) => <tr key={v.version} className={`align-top hover:bg-slate-50/70 ${v.version === 'V3' ? 'bg-slate-50/50' : ''}`}><td className="px-2 py-4"><span className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200/60 bg-slate-100 text-xs font-bold text-slate-800">{v.version}</span></td><td className="whitespace-nowrap px-3 py-3 text-xs text-slate-600"><span className="block font-semibold text-slate-700">{v.date.split(' ')[0]}</span><span className="mt-0.5 block text-[10px] text-slate-400">{v.date.split(' ')[1]}</span></td><td className="whitespace-nowrap px-3 py-3"><span className="block font-bold text-slate-800">{v.actor}</span><span className="mt-0.5 block font-mono text-[10px] font-normal text-slate-400">{v.personId}</span></td><td className="w-[260px] max-w-[260px] px-4 py-3 text-xs leading-relaxed text-slate-700 align-middle"><p className="line-clamp-2 break-words" title={v.reason}>{v.reason}</p></td><td className="px-2 py-4">{v.status === 'VIGENTE' ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60"><CheckCircle2 className="w-3 h-3 text-emerald-600" />Vigente</span> : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60"><Clock className="w-3 h-3 text-slate-400" />Sustituida</span>}</td><td className="px-4 py-3 text-center"><button type="button" onClick={() => setDrawer(v)} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"><Eye className="size-3.5 text-slate-500" />Ver</button></td><td className="px-2 py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-[#2A4B93]">4</span></td><td className="px-2 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${v.integration === 'EXITOSO' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{v.integration === 'EXITOSO' ? '• EXITOSO' : '✕ FALLIDO'}</span></td><td className="px-4 py-3"><div className="flex items-center justify-end gap-1.5"><button type="button" onClick={() => setDrawer(v)} className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#2A4B93] px-3.5 py-1.5 text-[11px] font-semibold text-white shadow-xs transition-all hover:bg-[#1e366b]"><Eye className="h-3 w-3" />Ver detalle</button><button type="button" onClick={() => setNotice(`Comparación ${v.version} preparada`)} className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200/80 bg-slate-100 px-3.5 py-1.5 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-200/80"><GitCompare className="h-3 w-3 text-slate-500" />Comparar</button><button type="button" onClick={() => setNotice('Cuentas por cobrar vinculadas: 4')} className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100"><FileText className="h-3 w-3 text-slate-400" />CxC vinculadas</button></div></td></tr>)}</tbody></table></div></section>

      <section className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/30 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">Panel de Integración y Recuperación</h3>
            <p className="mt-0.5 text-[11px] font-medium text-slate-400">Sincronización con el servidor de facturación</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"><span className="size-1.5 animate-pulse rounded-full bg-amber-500" />Error Reintentable · V2</span>
        </div>
        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-3.5"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Número de intentos</span><div className="mt-1 text-xl font-extrabold text-slate-900">3 <span className="text-sm font-medium text-slate-400">/ 5</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-3/5 rounded-full bg-[#2A4B93]" /></div><span className="mt-1.5 block text-[10px] text-slate-400">2 intentos restantes</span></div>
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-3.5"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Último resultado</span><span className="mt-2 inline-flex rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700">Fallido</span><p className="mt-1.5 text-xs leading-4 text-slate-600">Falló la conexión con el servidor de facturación.</p></div>
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/70 p-3.5"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fecha y hora</span><div className="mt-2 flex items-center gap-1.5 text-sm font-bold text-slate-800"><Clock className="size-4 text-slate-400" />01/07/2026 09:47:12</div><span className="mt-1 block text-[10px] font-medium text-slate-400">UTC · último intento</span></div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5 text-xs leading-5 text-amber-900"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" /><p><strong>Garantía de idempotencia / Recuperación limpia:</strong> el reintento retoma la misma integración fallida de la V2. No crea nuevas operaciones comerciales ni duplica registros de negocio.</p></div>
          <div className="flex flex-col items-stretch justify-between gap-3 pt-1 sm:flex-row sm:items-center"><button type="button" onClick={retry} disabled={retrying} className="flex items-center justify-center gap-2 rounded-full bg-[#2A4B93] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1e366b] active:scale-[0.99] disabled:opacity-60"><RefreshCw className={`size-3.5 ${retrying ? 'animate-spin' : ''}`} />{retrying ? 'REINTENTANDO...' : 'REINTENTAR INTEGRACIÓN – V2'}</button><div className="flex items-center justify-between gap-2 sm:justify-end"><span className="rounded-full border border-slate-200/80 bg-slate-100 px-3 py-1 font-mono text-[11px] text-slate-500">CORR-2026-88392-X</span><button type="button" onClick={() => setTechnicalOpen(!technicalOpen)} aria-expanded={technicalOpen} className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100/80 hover:text-slate-900"><Code2 className="size-3.5 text-slate-400" /><span>Datos técnicos</span>{technicalOpen ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}</button></div></div>
          {technicalOpen && <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-slate-100 shadow-inner"><div className="mb-3 flex items-center justify-between border-b border-slate-700 pb-2 text-slate-400"><span>Payload de Integración / Correlation ID</span><button type="button" onClick={copyPayload} className="inline-flex items-center gap-1 text-slate-300 hover:text-white">{copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}{copied ? 'Copiado' : 'Copiar'}</button></div><pre className="overflow-x-auto whitespace-pre-wrap">{jsonPayload}</pre></div>}
        </div>
      </section>

      {drawer && <><div className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs" onClick={() => setDrawer(null)} /><div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-200 bg-white shadow-2xl"><section role="dialog" aria-modal="true" aria-labelledby="version-detail-title" className="flex h-full flex-col overflow-hidden rounded-l-3xl bg-white" onClick={(e) => e.stopPropagation()}><header className="flex shrink-0 items-start justify-between border-b border-slate-100 p-6"><div><h2 id="version-detail-title" className="text-xl font-bold text-slate-900">Detalle {drawer.version}</h2><p className="mt-1 text-xs text-slate-400">Historial de condiciones comerciales</p><span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{drawer.status === 'VIGENTE' ? '• Versión Activa' : 'Sin condiciones'}</span></div><button type="button" aria-label="Cerrar detalle de versión" onClick={() => setDrawer(null)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="size-5" /></button></header><div className="flex-1 space-y-4 overflow-y-auto p-6"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><ReadonlyField label="Fecha y Hora" value={drawer.date} /><ReadonlyField label="Estado Negocio" value={drawer.status} tone={drawer.status === 'VIGENTE' ? 'success' : 'muted'} /><div className="sm:col-span-2"><ReadonlyField label="Actor" value={`${drawer.actor} - ${drawer.personId}`} /></div><div className="sm:col-span-2"><ReadonlyField label="Motivo del cambio" value={drawer.reason} multiline /></div><ReadonlyField label="Integración" value={`• ${drawer.integration}`} tone={drawer.integration === 'EXITOSO' ? 'success' : 'danger'} /><ReadonlyField label="CxC Vinculadas" value="4 registros" /></div><div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resumen de versión</span><strong className="mt-1 block text-lg font-bold text-slate-900">{drawer.version} · {drawer.status}</strong><span className="text-xs text-slate-500">Condiciones comerciales auditadas</span></div></div><footer className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white p-6"><button type="button" onClick={() => setDrawer(null)} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cerrar</button><button type="button" onClick={() => setNotice(`Historial completo de ${drawer.version}`)} className="rounded-full bg-[#2A4B93] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e366b]">Ver historial completo</button></footer></section></div></>}
      {notice && <button type="button" onClick={() => setNotice('')} className="fixed right-6 top-20 z-[70] rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg"><Check className="mr-2 inline size-3.5" />{notice}</button>}
      </main>
    </div>
  )
}

function ReadonlyField({ label, value, tone = 'default', multiline = false }: { label: string; value: string; tone?: 'default' | 'success' | 'danger' | 'muted'; multiline?: boolean }) {
  const toneClass = tone === 'success' ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700' : tone === 'danger' ? 'border-red-200 bg-red-50/70 text-red-700' : tone === 'muted' ? 'border-slate-200 bg-slate-100 text-slate-600' : 'border-slate-200/80 bg-slate-50/70 text-slate-800'
  return <div><span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span><div className={`rounded-xl border px-4 py-3 text-sm font-medium ${toneClass} ${multiline ? 'min-h-20 leading-5' : ''}`}>{value}</div></div>
}

function Data({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span><span className="mt-1 block text-sm font-semibold leading-5 text-slate-800">{value}</span>{hint && <span className="mt-1 block text-[10px] text-slate-400">{hint}</span>}</div>
}
