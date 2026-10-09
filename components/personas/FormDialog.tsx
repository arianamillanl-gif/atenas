import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type Props = {
  title: string
  description: string
  submitLabel: string
  submitDisabled?: boolean
  onSubmit: () => void
  onCancel: () => void
  children: React.ReactNode
}

export default function FormDialog({ title, description, submitLabel, submitDisabled, onSubmit, onCancel, children }: Props) {
  const panelRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('select, input')?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs" onClick={onCancel}>
      <form
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-dialog-title"
        aria-describedby="form-dialog-description"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault()
          if (!submitDisabled) onSubmit()
        }}
        className="flex w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-1">
            <h2 id="form-dialog-title" className="m-0 font-sans text-lg font-bold text-[#2A4B93]">{title}</h2>
            <p id="form-dialog-description" className="m-0 text-sm leading-relaxed text-slate-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="flex flex-col gap-5 px-6 py-6">{children}</div>
        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="h-11 rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitDisabled}
            className="h-11 rounded-full bg-[#2A4B93] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#223d7a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitLabel}
          </button>
        </footer>
      </form>
    </div>
  )
}
