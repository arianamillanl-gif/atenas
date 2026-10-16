'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

type DiscardChangesModalProps = {
  onConfirm: () => void
  onCancel: () => void
}

export default function DiscardChangesModal({ onConfirm, onCancel }: DiscardChangesModalProps) {
  const stayRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    stayRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onMouseDown={(event) => event.target === event.currentTarget && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="discard-title"
        aria-describedby="discard-description"
        className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200"
      >
        <div className="flex flex-col">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mb-1">
            <AlertTriangle size={22} aria-hidden="true" />
          </div>
          <h2 id="discard-title" className="m-0 mt-3 text-base font-bold text-slate-900 tracking-tight text-balance">
            ¿Descartar los cambios no guardados?
          </h2>
          <p id="discard-description" className="m-0 text-xs text-slate-600 leading-relaxed mt-1 text-pretty">
            Ha introducido o modificado información en la asignación de cartera. Si continúa, todos los datos no guardados se perderán permanentemente y la pantalla se restablecerá.
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            ref={stayRef}
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold transition-all active:scale-95 shadow-2xs"
          >
            Continuar editando
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-xs font-semibold transition-all active:scale-95 shadow-sm shadow-rose-600/20"
          >
            Sí, descartar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
