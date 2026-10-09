import type { LucideIcon } from 'lucide-react'
import { Lock, PencilLine } from 'lucide-react'

export const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100'

export const readOnlyClass =
  'h-11 w-full cursor-not-allowed rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3.5 font-mono text-sm font-medium text-slate-600 outline-none'

export function SourceBadge({ origin }: { origin?: string }) {
  if (origin) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
        <Lock size={11} aria-hidden="true" />
        {origin}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      <PencilLine size={11} aria-hidden="true" />
      Editable
    </span>
  )
}

export function Field({
  id,
  label,
  origin,
  required,
  error,
  hint,
  showSource = true,
  className = '',
  children,
}: {
  id: string
  label: string
  origin?: string
  required?: boolean
  error?: string
  hint?: string
  showSource?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 font-normal text-slate-400">· Obligatorio</span>}
        </label>
        {showSource && <SourceBadge origin={origin} />}
      </div>
      {children}
      {error ? (
        <span id={`${id}-error`} role="alert" className="text-xs text-red-600">
          {error}
        </span>
      ) : (
        hint && <span className="text-xs text-slate-400">{hint}</span>
      )}
    </div>
  )
}

export function Card({
  id,
  title,
  description,
  icon: Icon,
  aside,
  className = '',
  children,
}: {
  id: string
  title: string
  description: string
  icon: LucideIcon
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`flex scroll-mt-24 flex-col rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 ${className}`}
    >
      <header className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={18} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="m-0 text-base font-semibold text-slate-800">
              {title}
            </h2>
            <p className="m-0 mt-0.5 text-xs leading-relaxed text-slate-500 text-pretty">{description}</p>
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
      <div className="flex flex-1 flex-col gap-5 p-6">{children}</div>
    </section>
  )
}
