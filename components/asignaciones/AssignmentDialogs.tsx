'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Info } from 'lucide-react'

import { controlClass } from './fields'

const MIN_CLOSE_REASON = 20

function DialogShell({
  labelId,
  descriptionId,
  onCancel,
  children,
}: {
  labelId: string
  descriptionId: string
  onCancel: () => void
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs" onClick={onCancel}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-6 shadow-2xl"
      >
        {children}
      </section>
    </div>
  )
}

const secondaryButton = 'rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50'

export function CloseValidityDialog({
  subject,
  onConfirm,
  onCancel,
}: {
  subject: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const length = reason.trim().length
  const invalid = length < MIN_CLOSE_REASON

  useEffect(() => textareaRef.current?.focus(), [])

  const submit = () => {
    setTouched(true)
    if (!invalid) onConfirm(reason.trim())
  }

  return (
    <DialogShell labelId="close-title" descriptionId="close-description" onCancel={onCancel}>
      <span className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <AlertTriangle size={18} aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 id="close-title" className="m-0 text-base font-semibold text-slate-900">¿Confirmar cierre de vigencia de la asignación?</h2>
        <p id="close-description" className="m-0 text-xs leading-relaxed text-slate-500">
          Esta acción establecerá la fecha de término de la asignación activa{' '}
          <strong className="font-semibold text-slate-700">{subject}</strong>. La cartera quedará sin vinculación vigente hasta que se
          registre una nueva reasignación.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="close-reason" className="text-xs font-semibold text-slate-700">
          Motivo de cierre <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          ref={textareaRef}
          id="close-reason"
          rows={3}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          aria-invalid={touched && invalid}
          aria-describedby="close-reason-help"
          placeholder="Describa la causa administrativa o comercial del cierre..."
          className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`}
        />
        <p id="close-reason-help" className={`m-0 text-[11px] ${touched && invalid ? 'font-medium text-red-600' : 'text-slate-400'}`}>
          {touched && invalid ? `Faltan ${MIN_CLOSE_REASON - length} caracteres para el mínimo requerido.` : `${length}/${MIN_CLOSE_REASON} caracteres mínimos`}
        </p>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancelar</button>
        <button
          type="button"
          onClick={submit}
          className="rounded-full bg-amber-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
        >
          Confirmar cierre
        </button>
      </div>
    </DialogShell>
  )
}

export function ReassignDialog({
  fromPortfolio,
  toPortfolio,
  closingDate,
  onConfirm,
  onCancel,
}: {
  fromPortfolio: string
  toPortfolio: string
  closingDate: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  useEffect(() => cancelRef.current?.focus(), [])

  return (
    <DialogShell labelId="reassign-title" descriptionId="reassign-description" onCancel={onCancel}>
      <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-[#2A4B93]">
        <Info size={18} aria-hidden="true" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h2 id="reassign-title" className="m-0 text-base font-semibold text-slate-900">¿Desea reasignar el cliente a una nueva cartera?</h2>
        <p id="reassign-description" className="m-0 text-xs leading-relaxed text-slate-500">
          Se cerrará automáticamente la vigencia previa con fecha de ayer y se creará el nuevo registro inmutable.
        </p>
      </div>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 text-xs">
        <dt className="text-slate-400">Cartera actual</dt>
        <dd className="m-0 truncate font-medium text-slate-700">{fromPortfolio}</dd>
        <dt className="text-slate-400">Cierre previo</dt>
        <dd className="m-0 font-medium tabular-nums text-slate-700">{closingDate}</dd>
        <dt className="text-slate-400">Nueva cartera</dt>
        <dd className="m-0 truncate font-semibold text-[#2A4B93]">{toPortfolio}</dd>
      </dl>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button ref={cancelRef} type="button" onClick={onCancel} className={secondaryButton}>Continuar editando</button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-[#2A4B93] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#1E366B]"
        >
          Sí, aplicar reasignación
        </button>
      </div>
    </DialogShell>
  )
}
