'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Eye,
  GitCompareArrows,
  History,
  Info,
  Lock,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'

type Version = {
  version: string
  date: string
  actor: string
  reason: string
  status: 'VIGENTE' | 'SUSTITUIDA'
  integration: 'EXITOSO' | 'FALLIDO'
}

const versions: Version[] = [
  { version: 'V3', date: '14/08/2026 10:22', actor: 'MORALES, Luis', reason: 'Ajuste de tarifa por renovación contractual...', status: 'VIGENTE', integration: 'EXITOSO' },
  { version: 'V2', date: '01/07/2026 09:15', actor: 'RODRÍGUEZ, Ana', reason: 'Corrección de plazo de pago de 30 a 45 días...', status: 'SUSTITUIDA', integration: 'FALLIDO' },
  { version: 'V1', date: '18/06/2026 14:03', actor: 'PÉREZ, Carlos', reason: 'Registro inicial de condiciones...', status: 'SUSTITUIDA', integration: 'EXITOSO' },
]

const installments = ['00441', '00442', '00443', '00444']

export default function HistorialCondicionesIntegracion({ onBack }: { onBack: () => void }) {
  const [drawer, setDrawer] = useState<'detail' | 'cxc' | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<Version>(versions[0])
  const [showCompare, setShowCompare] = useState(false)
  const [technicalOpen, setTechnicalOpen] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [notice, setNotice] = useState('')

  const openDetail = (version: Version) => { setSelectedVersion(version); setDrawer('detail') }
  const retryIntegration = () => { setRetrying(true); window.setTimeout(() => { setRetrying(false); setNotice('Reintento de integración V2 encolado') }, 700) }

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50 text-slate-900">
      <header className="w-full h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
        <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-700"><span className="size-2 rounded-full bg-indigo-600" aria-hidden="true" />Lo-Fi workspace · Operaciones</span>
        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 md:flex"><Search className="size-3.5" aria-hidden="true" /><span className="sr-only">Búsqueda rápida</span><input aria-label="Búsqueda rápida" placeholder="Búsqueda rápida" className="w-28 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /><kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘K</kbd></label>
          <button type="button" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones"><Bell className="size-4" /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#2A4B93]" /></button><span className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />
          <button type="button" className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50"><span className="flex size-8 items-center justify-center rounded-full bg-[#2A4B93] text-xs font-bold text-white">MG</span><span className="hidden text-xs font-semibold text-slate-700 sm:block">María González</span><ChevronDown className="size-3.5 text-slate-400" /></button>
        </div>
      </header>

      <main className="w-full flex-1 p-8 space-y-6 overflow-y-auto pb-24">
        <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Migas de pan"><span className="text-slate-400">Ventas</span><ChevronRight className="size-3.5 text-slate-300" /><span>Ventas verificadas</span><ChevronRight className="size-3.5 text-slate-300" /><button type="button" onClick={onBack} className="hover:text-[#2A4B93] hover:underline">Detalle VTA-2026-00312</button><ChevronRight className="size-3.5 text-slate-300" /><span className="font-semibold text-slate-800">Historial de Condiciones e Integración</span></nav>
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#2A4B93]"><History className="size-4" />Auditoría operativa</div><h1 className="text-2xl font-bold tracking-tight text-slate-900">Historial de Condiciones e Integración</h1><p className="mt-1 text-sm text-slate-500">Seguimiento append-only de versiones, evidencias e integración de cuentas por cobrar.</p></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">READONLY / APPEND-ONLY</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full border-t border-slate-100 pt-5"><InfoField label="VENTA_ID / CLIENTIFY_ID" value="VNT-2026-00312 · CLF-88312" /><InfoField label="CLIENTE" value="CONSTRUCTORA DEL LLANO C.A." /><InfoField label="SERVICIO" value="SRV-2026-00031 · Consultoría Comercial" /><InfoField label="RESPONSABLE / IMPORTE" value="MORALES, LUIS | USD 18.500,00" /></div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#2A4B93]/15 bg-[#2A4B93]/5 p-4"><div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs"><strong className="text-[#2A4B93]">Versión Activa: V3</strong><span><b>Activada:</b> 2026-08-14 10:22:07</span><span><b>Autor:</b> Morales, Luis</span><span><b>CxC Vinculadas:</b> 4</span></div><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">INTEGRACIÓN EXITOSA</span></div>
        </section>

        <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><h2 className="text-base font-bold text-slate-800">Línea temporal de versiones</h2><p className="text-xs text-slate-500">Historial inmutable de cambios comerciales</p></div><span className="text-xs font-medium text-slate-500">3 versiones</span></div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr>{['V.NRO','FECHA/HORA','ACTOR','MOTIVO DEL CAMBIO','ESTADO NEG.','EVIDENCIA','CXC','INTEGRACIÓN','ACCIONES'].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{versions.map((version) => <tr key={version.version} className="align-middle hover:bg-slate-50/70"><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 font-bold ${version.status === 'VIGENTE' ? 'bg-[#2A4B93]/10 text-[#2A4B93]' : 'bg-slate-100 text-slate-600'}`}>{version.version}</span></td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{version.date}</td><td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">{version.actor}</td><td className="max-w-xs px-4 py-4 text-slate-600">{version.reason}</td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${version.status === 'VIGENTE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{version.status}</span></td><td className="px-4 py-4"><button type="button" onClick={() => openDetail(version)} className="font-semibold text-[#2A4B93] hover:underline"><Eye className="mr-1 inline size-3.5" />Ver</button></td><td className="px-4 py-4"><button type="button" onClick={() => setDrawer('cxc')} className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-[#2A4B93]">4 CxC</button></td><td className="px-4 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${version.integration === 'EXITOSO' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{version.integration}</span></td><td className="px-4 py-4"><div className="flex gap-1.5"><button type="button" onClick={() => openDetail(version)} className="rounded-lg border border-slate-200 px-2 py-1 font-medium text-slate-600 hover:bg-slate-50">Ver detalle</button>{version.version === 'V2' && <button type="button" onClick={() => setShowCompare(true)} className="inline-flex items-center gap-1 rounded-lg border border-[#2A4B93]/20 px-2 py-1 font-medium text-[#2A4B93] hover:bg-blue-50"><GitCompareArrows className="size-3" />Comparar</button>}</div></td></tr>)}</tbody></table></div></section>

        <section className="w-full rounded-2xl border border-rose-200 bg-white p-6 shadow-sm"><div className="mb-4 flex items-start justify-between"><div><h2 className="text-base font-bold text-slate-800">Integración y recuperación · V2</h2><p className="mt-1 text-xs text-slate-500">Control de reintento sobre la operación fallida original</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">FALLIDO</span></div><div className="grid gap-4 md:grid-cols-3"><InfoField label="INTENTOS REALIZADOS" value="3 / 5" /><InfoField label="ÚLTIMO RESULTADO" value="Falló la conexión con el servidor de facturación. El servicio no respondió en el tiempo esperado." /><InfoField label="ÚLTIMO INTENTO" value="01/07/2026 - 09:47:12 UTC" /></div><div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800"><b>RECUPERACIÓN LIMPIA:</b> el reintento retoma la misma integración fallida de la v2. No crea nuevas operaciones comerciales ni duplica registros de negocio.</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><button type="button" onClick={retryIntegration} disabled={retrying} className="inline-flex items-center gap-2 rounded-xl bg-[#2A4B93] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1f3870] disabled:opacity-60"><RefreshCw className={`size-3.5 ${retrying ? 'animate-spin' : ''}`} />{retrying ? 'Reintentando...' : 'REINTENTAR INTEGRACIÓN - V2'}</button><button type="button" onClick={() => setTechnicalOpen((open) => !open)} className="text-xs font-semibold text-slate-600 hover:text-[#2A4B93]"><span>{technicalOpen ? '▲' : '▼'} DATOS TÉCNICOS</span> <span className="text-slate-400">| ID CORRELACIÓN: CORR-2026-88392-X</span></button></div>{technicalOpen && <div className="mt-4 rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-slate-300">correlation_id: CORR-2026-88392-X<br />retryable: true<br />source: billing-service<br />mode: append-only</div>}</section>
      </main>

      <button type="button" onClick={onBack} className="fixed bottom-5 left-6 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-lg hover:bg-slate-50"><ArrowLeft className="size-3.5" />Volver al detalle</button>

      {drawer && <div className="fixed inset-0 z-50 bg-slate-950/35" onClick={() => setDrawer(null)}><aside className="absolute right-0 top-0 h-full w-96 overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#2A4B93]">Panel readonly</p><h2 className="text-lg font-bold text-slate-900">{drawer === 'detail' ? `Detalle ${selectedVersion.version}` : 'CxC vinculadas'}</h2></div><button type="button" onClick={() => setDrawer(null)} aria-label="Cerrar panel" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="size-4" /></button></div>{drawer === 'detail' ? <div className="space-y-4 py-5">{[['Versión', selectedVersion.version], ['Fecha y hora', selectedVersion.date], ['Actor', selectedVersion.actor], ['Motivo', selectedVersion.reason], ['Estado negocio', selectedVersion.status], ['Integración', selectedVersion.integration], ['Evidencia', 'Evidencia documental adjunta']].map(([label, value]) => <InfoField key={label} label={label} value={value} />)}<div className="flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500"><Lock className="size-3.5" />Registro de solo lectura · APPEND-ONLY · no editable</div></div> : <div className="space-y-3 py-5">{installments.map((id, index) => <div key={id} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><strong className="text-sm text-slate-800">CXC-2026-{id}</strong><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">ACTIVA</span></div><p className="mt-2 text-xs text-slate-500">Vencimiento: {['15/08/2026','15/09/2026','15/10/2026','15/11/2026'][index]}</p><strong className="mt-1 block text-sm text-slate-800">USD 4,625.00</strong></div>)}</div>}</aside></div>}

      {showCompare && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><p className="text-[10px] font-bold uppercase tracking-wide text-[#2A4B93]">Comparación auditada</p><h2 className="text-lg font-bold text-slate-900">V2 vs V3</h2></div><button type="button" onClick={() => setShowCompare(false)} aria-label="Cerrar comparación" className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="size-4" /></button></div><div className="grid grid-cols-2 gap-4 p-6"><div className="rounded-xl bg-slate-50 p-4"><h3 className="mb-4 text-xs font-bold text-slate-600">V2 · ANTERIOR</h3>{[['Plazo de pago','30 días'],['Tarifa','USD 17.800,00'],['Motivo','Corrección de plazo']].map(([label, value]) => <div key={label} className="mb-3"><span className="block text-[10px] uppercase text-slate-500">{label}</span><span className="text-sm font-semibold text-rose-700 line-through">{value}</span></div>)}</div><div className="rounded-xl bg-emerald-50/60 p-4"><h3 className="mb-4 text-xs font-bold text-emerald-700">V3 · POSTERIOR</h3>{[['Plazo de pago','45 días'],['Tarifa','USD 18.500,00'],['Motivo','Renovación contractual']].map(([label, value]) => <div key={label} className="mb-3"><span className="block text-[10px] uppercase text-slate-500">{label}</span><span className="text-sm font-bold text-emerald-700">{value}</span></div>)}</div></div></div></div>}
      {notice && <button type="button" onClick={() => setNotice('')} className="fixed right-6 top-20 z-[70] rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-lg"><Check className="mr-2 inline size-3.5" />{notice}</button>}
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return <div><span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</span><span className="block text-xs font-semibold leading-5 text-slate-800">{value}</span></div>
}
