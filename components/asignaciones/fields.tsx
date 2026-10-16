import { ChevronDown, Lock } from 'lucide-react'

export const controlClass =
  'h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 shadow-2xs outline-none transition placeholder:text-slate-400 focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10 aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:ring-red-100'

export const sectionClass = 'flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs'

export function SectionHeading({ id, title, description, children }: { id: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="m-0 text-base font-semibold text-slate-900">{title}</h2>
        {description && <p className="m-0 text-xs leading-relaxed text-slate-500 text-pretty">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export function Field({
  id,
  label,
  required,
  locked,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  required?: boolean
  locked?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500" aria-hidden="true">*</span>}
        {locked && <Lock size={11} className="text-slate-400" aria-label="Campo bloqueado" />}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="m-0 text-[11px] font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="m-0 text-[11px] text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}

export function SelectControl({
  id,
  value,
  onChange,
  error,
  placeholder,
  options,
  disabled,
  describedBy,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
  disabled?: boolean
  describedBy?: string
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : describedBy}
        className={`${controlClass} appearance-none pr-9 ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100/80 text-slate-400 shadow-none'
            : `cursor-pointer ${value ? '' : 'text-slate-400'}`
        }`}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-800">{option.label}</option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export function ReadOnlyValue({ id, value, muted }: { id: string; value: string; muted?: boolean }) {
  return (
    <output
      id={id}
      aria-readonly="true"
      className={`flex min-h-9 items-center truncate rounded-xl border border-slate-200/70 bg-slate-50/80 px-3.5 py-2 font-mono text-xs text-slate-500 ${muted ? 'italic text-slate-400' : ''}`}
      title={value}
    >
      {value}
    </output>
  )
}
