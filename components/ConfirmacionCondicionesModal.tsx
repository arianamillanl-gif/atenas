'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

type SummaryRow = { label: string; value: string; mono?: boolean }

type ConfirmacionCondicionesModalProps = {
  version: string
  rows: SummaryRow[]
  installmentsCount: number
  installmentAmount: string
  missingFields: string[]
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmacionCondicionesModal({
  version,
  rows,
  installmentsCount,
  installmentAmount,
  missingFields,
  onClose,
  onConfirm,
}: ConfirmacionCondicionesModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const canConfirm = missingFields.length === 0

  useEffect(() => {
    dialogRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden backdrop-blur-md outline-none"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 id="confirm-title" className="text-lg font-bold text-slate-900">{`Previsualización de Condiciones ${version}`}</h2>
            <p id="confirm-description" className="text-xs text-slate-500 mt-0.5">Revisa el resumen antes de registrar la versión técnica de condiciones</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar previsualización" className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {rows.map((row) => (
                <div key={row.label} className="min-w-0">
                  <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{row.label}</dt>
                  <dd className={`mt-0.5 truncate text-sm font-semibold text-slate-900 ${row.mono ? 'font-mono tabular-nums' : ''}`}>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Desglose de cuotas</span>
              <span className="text-sm font-semibold text-slate-900">
                {`${installmentsCount} ${installmentsCount === 1 ? 'cuota' : 'cuotas'} · `}
                <span className="font-mono tabular-nums">{installmentAmount}</span>
              </span>
            </div>
          </div>

          {!canConfirm && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800" role="alert">
              <p className="font-semibold">Completa los campos obligatorios antes de confirmar:</p>
              <ul className="mt-1.5 list-disc pl-4 space-y-0.5">
                {missingFields.map((field) => <li key={field}>{field}</li>)}
              </ul>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs flex gap-2 items-center">
            <AlertTriangle aria-hidden="true" className="w-4 h-4 shrink-0 text-amber-600" />
            <p>La confirmación guarda la versión técnica de las condiciones. La generación de CxC internas es una solicitud separada que se procesará a continuación.</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
            Volver a editar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm}
            className="bg-[#2A4B93] hover:bg-[#1e366b] text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2 transition-colors disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
          >
            <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
            Confirmar y Solicitar Generación
          </button>
        </div>
      </div>
    </div>
  )
}
