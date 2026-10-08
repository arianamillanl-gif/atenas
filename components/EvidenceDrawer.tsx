'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CheckCircle2, Download, FileText, ShieldCheck, X } from 'lucide-react'
import type { Alias } from './AliasMapping'

export default function EvidenceDrawer({ alias, onClose }: { alias: Alias; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)
  const fileName = alias.name === 'Empresa Alfa C.A.' ? 'Comprobante_RIF_Alfa.pdf' : `Evidencia_${alias.name.replaceAll(' ', '_')}.pdf`

  const requestClose = useCallback(() => {
    setVisible(false)
    window.setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true))
    closeRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && requestClose()
    window.addEventListener('keydown', handleKey)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', handleKey) }
  }, [requestClose])

  return <>
    <div aria-hidden="true" onClick={requestClose} className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} />
    <aside role="dialog" aria-modal="true" aria-labelledby="evidence-title" className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md transform flex-col border-l border-slate-200 bg-white font-[Poppins,sans-serif] shadow-2xl transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="min-w-0 max-w-[65%] flex-1">
          <p className="!m-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Validación documental</p>
          <h2 id="evidence-title" className="!m-0 mt-1 truncate !text-base font-semibold !text-slate-900">{fileName}</h2>
          <p className="!m-0 mt-1 truncate text-xs text-slate-500">{alias.name}</p>
        </div>
        <button ref={closeRef} type="button" aria-label="Cerrar visor de evidencia" onClick={requestClose} className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/15"><X size={18} aria-hidden="true" /></button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 p-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-[#2A4B93] shadow-sm"><FileText size={30} aria-hidden="true" /></span>
          <p className="!m-0 mt-4 text-sm font-semibold text-slate-800">Documento PDF</p>
          <p className="!m-0 mt-1 text-xs text-slate-500">Vista previa disponible para auditoría</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"><ShieldCheck size={14} aria-hidden="true" />Integridad verificada</span>
        </div>

        <section className="mt-6" aria-labelledby="metadata-title">
          <h3 id="metadata-title" className="!m-0 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Metadatos del archivo</h3>
          <dl className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200">
            {[
              ['Nombre del archivo', fileName], ['Peso', '2.4 MB'], ['Fecha de carga', '02 sep 2026 · 16:08'], ['Usuario responsable', 'Luis Herrera'], ['Método de homologación', alias.method],
            ].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-4 px-4 py-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="m-0 max-w-[58%] text-right text-xs font-medium text-slate-800">{value}</dd></div>)}
          </dl>
        </section>
      </div>

      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
        <button type="button" onClick={() => window.alert('La descarga del documento estará disponible en la versión conectada.')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"><Download size={15} aria-hidden="true" />Descargar documento</button>
        <button type="button" onClick={requestClose} className="inline-flex items-center gap-2 rounded-full bg-[#2A4B93] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1E366B] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/20"><CheckCircle2 size={15} aria-hidden="true" />Cerrar visor</button>
      </footer>
    </aside>
  </>
}
