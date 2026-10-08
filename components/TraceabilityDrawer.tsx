'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FilePlus2, GitMerge, History, RefreshCw, ShieldCheck, X } from 'lucide-react'

type AuditEvent = {
  date: string
  time: string
  user: string
  role: string
  action: string
  detail: string
  reference: string
  icon: typeof FilePlus2
  tone: 'primary' | 'accent' | 'neutral'
}

const events: AuditEvent[] = [
  { date: '14 sep 2026', time: '10:42', user: 'María González', role: 'Administradora', action: 'Actualización de estado', detail: 'Estado de la ficha cambiado de "En revisión" a "Activo" tras validación fiscal.', reference: 'AUD-2026-0914-0042', icon: RefreshCw, tone: 'primary' },
  { date: '02 sep 2026', time: '16:08', user: 'Luis Herrera', role: 'Analista de datos', action: 'Homologación de alias', detail: 'Alias "Alfa Consultores C.A." vinculado a la identidad canónica por coincidencia de RIF.', reference: 'AUD-2026-0902-0117', icon: GitMerge, tone: 'accent' },
  { date: '21 ago 2026', time: '09:15', user: 'Sistema ATENAS', role: 'Proceso automático', action: 'Validación fiscal', detail: 'RIF J-12345678-9 verificado contra el registro tributario. Resultado: coincidencia exacta.', reference: 'AUD-2026-0821-0003', icon: ShieldCheck, tone: 'neutral' },
  { date: '18 ago 2026', time: '11:30', user: 'María González', role: 'Administradora', action: 'Creación de ficha', detail: 'Registro inicial de la identidad "Empresa Alfa C.A." con categoría Corporativo.', reference: 'AUD-2026-0818-0021', icon: FilePlus2, tone: 'primary' },
]

const toneStyles = {
  primary: 'bg-[#2A4B93]/10 text-[#2A4B93] ring-[#2A4B93]/15',
  accent: 'bg-[#ECB421]/15 text-[#9a7210] ring-[#ECB421]/30',
  neutral: 'bg-slate-100 text-slate-500 ring-slate-200',
}

export default function TraceabilityDrawer({ recordId, onClose }: { recordId: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    closeRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && requestClose()
    window.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', handleKey)
    }
  }, [requestClose])

  return <>
    <div aria-hidden="true" onClick={requestClose} className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} />
    <aside role="dialog" aria-modal="true" aria-labelledby="trace-title" className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col border-l border-slate-200 bg-white font-[Poppins,sans-serif] shadow-2xl transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#2A4B93]/10 text-[#2A4B93]"><History size={18} aria-hidden="true" /></span>
          <div className="min-w-0">
            <p className="!m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Historial de auditoría</p>
            <h2 id="trace-title" className="!m-0 mt-0.5 !text-base font-semibold !text-slate-900">Trazabilidad del registro</h2>
            <p className="!m-0 mt-0.5 truncate font-mono text-[11px] text-slate-500">{recordId}</p>
          </div>
        </div>
        <button ref={closeRef} type="button" aria-label="Cerrar panel" onClick={requestClose} className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/15"><X size={18} aria-hidden="true" /></button>
      </header>

      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
        <span>{events.length} eventos registrados</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">Cadena íntegra</span>
      </div>

      <ol className="!m-0 min-h-0 flex-1 !list-none overflow-y-auto overscroll-contain !px-6 !py-5">
        {events.map((event, index) => {
          const Icon = event.icon
          const isLast = index === events.length - 1
          return <li key={event.reference} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && <span aria-hidden="true" className="absolute left-[17px] top-10 bottom-0 w-px bg-slate-200" />}
            <span className={`relative flex size-9 shrink-0 items-center justify-center rounded-full ring-4 ${toneStyles[event.tone]}`}><Icon size={15} aria-hidden="true" /></span>
            <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="!m-0 !text-[13px] font-semibold !text-slate-900">{event.action}</h3>
                <time className="text-[11px] text-slate-400">{event.date} · {event.time}</time>
              </div>
              <p className="!m-0 mt-1 text-xs text-slate-500"><span className="font-medium text-slate-700">{event.user}</span> · {event.role}</p>
              <p className="!m-0 mt-2.5 text-xs leading-relaxed text-slate-600">{event.detail}</p>
              <code className="mt-3 inline-block rounded-lg bg-white px-2 py-1 font-mono text-[10px] text-slate-500 ring-1 ring-slate-200">{event.reference}</code>
            </div>
          </li>
        })}
      </ol>

      <footer className="flex shrink-0 justify-end border-t border-slate-200 bg-white px-6 py-4">
        <button type="button" onClick={requestClose} className="min-w-36 rounded-2xl bg-[#2A4B93] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#233f7c] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/20">Cerrar panel</button>
      </footer>
    </aside>
  </>
}
