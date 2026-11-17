'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Check, Info, Lock, X } from 'lucide-react'
import { fmt } from '../data'
import type { ListSale } from '../list-data'
import { CONDITION_STYLE } from './status'

function LockedField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="flex h-10 items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 text-[13px] font-medium text-slate-700">
        <span className="min-w-0 truncate">{children}</span>
        <Lock size={13} className="shrink-0 text-slate-400" aria-label="Solo lectura" />
      </div>
    </div>
  )
}

function Callout({ tone, icon, title, body, onDismiss }: { tone: 'warning' | 'info'; icon: React.ReactNode; title: string; body: string; onDismiss: () => void }) {
  const styles = tone === 'warning'
    ? { box: 'bg-amber-50/80 border-amber-200', title: 'text-amber-900', body: 'text-amber-800/80', icon: 'text-amber-600', close: 'text-amber-700/60 hover:bg-amber-100 hover:text-amber-900' }
    : { box: 'bg-indigo-50/60 border-indigo-200/80', title: 'text-indigo-950', body: 'text-indigo-900/70', icon: 'text-indigo-600', close: 'text-indigo-700/60 hover:bg-indigo-100 hover:text-indigo-900' }
  return (
    <div role={tone === 'warning' ? 'alert' : 'note'} className={`flex gap-2.5 rounded-xl border p-3.5 ${styles.box}`}>
      <span className={`mt-0.5 shrink-0 ${styles.icon}`} aria-hidden="true">{icon}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className={`text-[13px] font-semibold ${styles.title}`}>{title}</p>
        <p className={`text-xs leading-relaxed ${styles.body}`}>{body}</p>
      </div>
      <button type="button" onClick={onDismiss} aria-label={`Descartar aviso: ${title}`} className={`grid size-6 shrink-0 place-items-center rounded-md transition ${styles.close}`}><X size={13} /></button>
    </div>
  )
}

type Props = { sale: ListSale; onClose: () => void; onOpenDetail: () => void }

export default function SaleDrawer({ sale, onClose, onOpenDetail }: Props) {
  const [showWarning, setShowWarning] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const missing = [...(!sale.rep ? ['responsable'] : []), ...(sale.breakdown.length === 0 ? ['desglose de servicios'] : [])]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} aria-hidden="true" className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-drawer-title"
        className={`relative flex h-full w-[440px] max-w-full flex-col justify-between border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Detalle de venta</p>
            <h2 id="sale-drawer-title" className="text-xl font-bold text-[#1E2B58] tabular-nums">{sale.ref}</h2>
            <span className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${CONDITION_STYLE[sale.condition]}`}>{sale.condition}</span>
          </div>
          <button type="button" autoFocus onClick={onClose} aria-label="Cerrar detalle de venta" className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          <LockedField label="Cliente">{sale.client}</LockedField>
          <div className="grid grid-cols-2 gap-3">
            <LockedField label="Clientify ID"><span className="tabular-nums">{sale.ref}</span></LockedField>
            <LockedField label="Monto total"><span className="tabular-nums">{fmt(sale.amount)} USD</span></LockedField>
          </div>
          <LockedField label="Responsable">{sale.rep || <span className="text-slate-400">—</span>}</LockedField>

          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Servicios / Desglose por vértice</p>
            {sale.breakdown.length === 0 ? (
              <div className="flex h-10 items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-slate-50 px-3 text-[13px] text-slate-500">
                <span className="truncate">Sin desglosar · Pendiente de atribución</span>
                <Lock size={13} className="shrink-0 text-slate-400" aria-label="Solo lectura" />
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {sale.breakdown.map((line, index) => (
                  <li key={`${line.name}-${index}`} className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-[13px] font-semibold text-slate-800 text-pretty">{line.name}</p>
                      <p className="shrink-0 text-[13px] font-bold text-[#1E2B58] tabular-nums">${fmt(line.amount)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-[#1E2B58]/[0.07] px-2 py-0.5 text-[11px] font-semibold text-[#1E2B58]">{line.vertice}</span>
                      {line.abonado && <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700"><Lock size={10} aria-hidden="true" />Abonado $0</span>}
                      {line.subcontratado && <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">Subcontratado</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {(missing.length > 0 && showWarning) || showInfo ? (
            <div className="flex flex-col gap-3">
              {missing.length > 0 && showWarning && (
                <Callout tone="warning" icon={<AlertTriangle size={15} />} title="Atributos sin resolver en el origen" body={`Falta: ${missing.join(', ')}.`} onDismiss={() => setShowWarning(false)} />
              )}
              {showInfo && (
                <Callout tone="info" icon={<Info size={15} />} title="Las condiciones comerciales se registran en el detalle" body="Desglose por vértice, soporte contractual, subcontratación, base económica y vista previa de CxC." onDismiss={() => setShowInfo(false)} />
              )}
            </div>
          ) : null}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
          <button type="button" onClick={onClose} className="h-10 rounded-full border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50">Cerrar</button>
          <button type="button" onClick={onOpenDetail} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1E2B58] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#16203F]"><Check size={15} aria-hidden="true" />Abrir detalle</button>
        </footer>
      </aside>
    </div>
  )
}
