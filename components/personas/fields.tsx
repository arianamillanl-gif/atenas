import type { LucideIcon } from 'lucide-react'
import { Lock } from 'lucide-react'

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100'

export const readOnlyClass =
  'w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-4 pr-28 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200'

export function ReadOnlyInput({ id, value, origin }: { id: string; value: string; origin: string }) {
  return (
    <div className="relative">
      <input id={id} className={readOnlyClass} value={value} readOnly aria-readonly="true" aria-describedby={`${id}-origin`} />
      <span
        id={`${id}-origin`}
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1.5 text-xs font-medium text-slate-400"
      >
        <Lock size={12} aria-hidden="true" />
        <span className="sr-only">Solo lectura, origen:</span>
        {origin}
      </span>
    </div>
  )
}

export function Field({
  id,
  label,
  required,
  error,
  hint,
  className = '',
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-400" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only"> (obligatorio)</span>}
      </label>
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
      className={`flex scroll-mt-24 flex-col gap-8 border-b border-slate-100 pb-10 last:border-b-0 last:pb-0 ${className}`}
    >
      <header className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <Icon size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
          <div className="min-w-0">
            <h3 id={`${id}-title`} className="m-0 text-base font-semibold text-slate-900">
              {title}
            </h3>
            <p className="m-0 mt-1 text-sm leading-relaxed text-slate-500 text-pretty">{description}</p>
          </div>
        </div>
        {aside && <div className="shrink-0">{aside}</div>}
      </header>
      <div className="flex flex-1 flex-col gap-6">{children}</div>
    </section>
  )
}
