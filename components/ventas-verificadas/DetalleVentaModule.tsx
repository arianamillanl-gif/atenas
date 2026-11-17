'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ChevronRight, Clock3, FileSearch, History, Save, Send, X } from 'lucide-react'
import { Sidebar, Topbar } from '../personas/Shell'
import { INITIAL_LINES, SERVICE_CATALOG, fmt, parseAmount, type ServiceLine } from './data'
import type { ListSale } from './list-data'
import CabeceraAcuerdo, { type HeaderState } from './CabeceraAcuerdo'
import SoporteEvidencia, { missingSupport, type SupportState } from './SoporteEvidencia'
import DesgloseServicios from './DesgloseServicios'
import VistaPreviaCxC from './VistaPreviaCxC'

const HISTORY = [
  { title: 'Venta importada desde Clientify', who: 'Integración ETL', when: '02/11/2026 · 09:14' },
  { title: 'Venta verificada por Tesorería', who: 'María González', when: '03/11/2026 · 10:02' },
  { title: 'Borrador de desglose guardado', who: 'Carlos Méndez', when: '10/11/2026 · 16:41' },
]

function missingLines(lines: ServiceLine[]) {
  const issues: string[] = []
  lines.forEach((line, i) => {
    const n = i + 1
    if (!line.serviceId) issues.push(`Servicio ${n}: entregable`)
    if (!line.operacion) issues.push(`Servicio ${n}: tipo de operación`)
    if (line.valor === 'Vendido' && parseAmount(line.monto) <= 0) issues.push(`Servicio ${n}: monto asignado`)
    if (line.subcontratado && (!line.proveedor || !line.subValor)) issues.push(`Servicio ${n}: datos de subcontratación`)
  })
  return issues
}

export default function DetalleVentaModule({ sale }: { sale: ListSale }) {
  const [collapsed, setCollapsed] = useState(false)
  const [header, setHeader] = useState<HeaderState>({ responsable: sale.rep, contratoMarco: '', unificado: false })
  const [support, setSupport] = useState<SupportState>({ referencia: 'CT-2026-0412', tipo: 'Contrato firmado', documento: '', fechaDoc: '2026-11-02', inicio: '2026-11-15', fin: '', observacion: '', files: { contrato: null, orden: null, rif: null } })
  const [lines, setLines] = useState<ServiceLine[]>(INITIAL_LINES)
  const [status, setStatus] = useState<'Pendiente Condiciones' | 'En aprobación'>('Pendiente Condiciones')
  const [toast, setToast] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)

  const assigned = lines.reduce((sum, l) => sum + (l.valor === 'Abonado' ? 0 : parseAmount(l.monto)), 0)
  const balanced = Math.round((sale.amount - assigned) * 100) === 0
  const missing = [...(!header.responsable ? ['Responsable comercial'] : []), ...missingSupport(support), ...missingLines(lines)]
  const canSubmit = balanced && missing.length === 0 && status === 'Pendiente Condiciones'
  const blocker = !balanced ? 'El desglose de servicios no coincide con el total de Clientify.' : missing.length ? `Faltan ${missing.length} campo(s): ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? '…' : ''}` : ''

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }

  const verticeCount = new Set(lines.map((l) => SERVICE_CATALOG.find((s) => s.id === l.serviceId)?.vertice).filter(Boolean)).size

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} active="ventas" />
      <section className="content flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
        <Topbar section="Ventas" />
        <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
              <span>Ventas</span><ChevronRight size={12} aria-hidden="true" />
              <Link href="/ventas-verificadas" className="transition hover:text-slate-700">Ventas verificadas</Link><ChevronRight size={12} aria-hidden="true" />
              <span aria-current="page" className="font-semibold text-slate-700">Detalle <span className="tabular-nums">{sale.ref}</span></span>
            </nav>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-3">
                <Link href="/ventas-verificadas" aria-label="Volver a ventas verificadas" className="mt-1 grid size-9 shrink-0 place-items-center rounded-xl border border-slate-200/80 bg-white text-slate-500 shadow-sm transition hover:text-slate-800"><ArrowLeft size={16} /></Link>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1E2B58]">ATENAS-85 · Desglose de servicios</p>
                  <h1 className="mt-1 text-2xl font-semibold text-slate-900 text-balance md:text-[28px]">Detalle de Venta Verificada</h1>
                  <p className="mt-1 text-[13px] text-slate-500"><span className="font-semibold text-slate-700 tabular-nums">{sale.ref}</span> · {sale.client} · <span className="font-semibold text-[#1E2B58] tabular-nums">${fmt(sale.amount)}</span> · <span className="tabular-nums">{lines.length}</span> servicios · <span className="tabular-nums">{verticeCount}</span> vértices</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} />Verificado</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status === 'En aprobación' ? 'border-sky-200 bg-sky-50 text-sky-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}><Clock3 size={13} />{status}</span>
              </div>
            </div>
          </div>

          <CabeceraAcuerdo sale={sale} value={header} onChange={setHeader} />
          <SoporteEvidencia value={support} onChange={setSupport} />
          <DesgloseServicios total={sale.amount} lines={lines} onChange={setLines} />
          <VistaPreviaCxC lines={lines} />
        </div>

        <footer className="sticky bottom-0 z-30 flex flex-col gap-3 border-t border-slate-200/80 bg-white/90 px-4 py-3.5 backdrop-blur-md md:flex-row md:items-center md:justify-between md:px-8">
          <button type="button" onClick={() => setHistoryOpen(true)} className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-slate-200/80 bg-white px-5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50"><History size={15} />Consultar historial</button>
          <div className="flex flex-col items-stretch gap-2 md:items-end">
            {blocker && status === 'Pendiente Condiciones' && <p className="text-[11px] font-medium text-amber-700 md:text-right" id="submit-blocker">{blocker}</p>}
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <button type="button" disabled title="Disponible cuando la venta sea aprobada" className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-5 text-[13px] font-medium text-slate-400 disabled:cursor-not-allowed"><FileSearch size={15} />Consultar CxC</button>
              <button type="button" onClick={() => notify('Borrador guardado correctamente')} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-5 text-[13px] font-semibold text-[#1E2B58] transition hover:bg-slate-50"><Save size={15} />Guardar borrador</button>
              <button type="button" disabled={!canSubmit} aria-describedby={blocker ? 'submit-blocker' : undefined} onClick={() => { setStatus('En aprobación'); notify('Venta enviada a aprobación') }} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1E2B58] px-6 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#16203F] disabled:cursor-not-allowed disabled:opacity-40"><Send size={15} />{status === 'En aprobación' ? 'Enviado a aprobación' : 'Enviar a aprobación'}</button>
            </div>
          </div>
        </footer>
      </section>

      {toast && <div role="status" className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#1E2B58] px-5 py-2.5 text-[13px] font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2"><CheckCircle2 size={15} />{toast}</div>}

      {historyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[2px]" onClick={() => setHistoryOpen(false)} onKeyDown={(e) => { if (e.key === 'Escape') setHistoryOpen(false) }}>
          <aside role="dialog" aria-modal="true" aria-labelledby="hist-title" onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white shadow-xl animate-in slide-in-from-right">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 id="hist-title" className="text-base font-semibold text-slate-900">Historial de la venta</h2>
              <button type="button" autoFocus onClick={() => setHistoryOpen(false)} aria-label="Cerrar historial" className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"><X size={16} /></button>
            </header>
            <ol className="flex flex-col gap-5 px-6 py-6">
              {[...HISTORY, ...(status === 'En aprobación' ? [{ title: 'Enviada a aprobación', who: header.responsable, when: 'Hoy' }] : [])].reverse().map((event) => (
                <li key={event.title} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#1E2B58]" />
                  <div><p className="text-[13px] font-semibold text-slate-800">{event.title}</p><p className="text-xs text-slate-500">{event.who} · <span className="tabular-nums">{event.when}</span></p></div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}
    </main>
  )
}
