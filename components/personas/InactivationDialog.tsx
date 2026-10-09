import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'

export const MIN_REASON_LENGTH = 20

type Props = {
  subject: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export default function InactivationDialog({ subject, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const baseId = useId()
  const titleId = `${baseId}-title`
  const descriptionId = `${baseId}-description`
  const reasonId = `${baseId}-reason`
  const hintId = `${baseId}-hint`

  const length = reason.trim().length
  const isValid = length >= MIN_REASON_LENGTH
  const showError = touched && !isValid

  useEffect(() => {
    textareaRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!isValid) {
      textareaRef.current?.focus()
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onCancel}>
      <form
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        noValidate
        className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200"
      >
        <span className="mb-4 flex w-fit rounded-2xl bg-amber-50 p-3 text-amber-600">
          <AlertTriangle size={20} aria-hidden="true" />
        </span>
        <h3 id={titleId} className="m-0 text-lg font-bold text-slate-900 text-balance">
          ¿Confirmar inactivación de {subject}?
        </h3>
        <p id={descriptionId} className="m-0 mt-1 text-sm leading-relaxed text-slate-500 text-pretty">
          Esta acción suspenderá la vigencia actual del registro en el sistema y quedará registrada en el historial de auditoría.
        </p>

        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor={reasonId} className="text-sm font-medium text-slate-700">
            Motivo de la inactivación <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <textarea
            ref={textareaRef}
            id={reasonId}
            rows={4}
            required
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError}
            aria-describedby={hintId}
            placeholder="Describe la justificación corporativa del cambio de estado..."
            className={`w-full resize-none rounded-xl border p-3 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-4 ${showError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'}`}
          />
          <div id={hintId} className="flex items-center justify-between gap-3 text-xs" aria-live="polite">
            <span className={showError ? 'text-red-600' : 'text-slate-500'}>
              {showError ? `Ingresa al menos ${MIN_REASON_LENGTH} caracteres.` : `Mínimo ${MIN_REASON_LENGTH} caracteres para auditoría.`}
            </span>
            <span className={`font-mono tabular-nums ${isValid ? 'text-emerald-600' : 'text-slate-400'}`}>
              {length}/{MIN_REASON_LENGTH}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            aria-disabled={!isValid}
            className={`rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-slate-800 ${isValid ? '' : 'opacity-60'}`}
          >
            Sí, inactivar registro
          </button>
        </div>
      </form>
    </div>
  )
}
