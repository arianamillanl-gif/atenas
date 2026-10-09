import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  icon: LucideIcon
  title: string
  description: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ icon: Icon, title, description, confirmLabel, cancelLabel = 'Cancelar', onConfirm, onCancel }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    cancelRef.current?.focus()
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs" onClick={onCancel}>
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-[#ECB421]/20 text-amber-700">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 id="confirm-title" className="m-0 text-base font-semibold text-slate-800">{title}</h2>
          <div id="confirm-description" className="text-sm leading-relaxed text-slate-500">{description}</div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" onClick={onCancel} className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-[#1E366B] active:bg-[#162850]">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
