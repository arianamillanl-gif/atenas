'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, Lock, Search } from 'lucide-react'

export const NAVY = '#1E2B58'
export const controlClass = 'h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3.5 text-[13px] font-medium text-slate-700 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#1E2B58] focus:ring-4 focus:ring-[#1E2B58]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

export function FieldLabel({ htmlFor, children, required = false }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-slate-600">
      {children}
      {required && <span className="ml-0.5 text-rose-500" aria-hidden="true">*</span>}
    </label>
  )
}

export function ReadOnlyField({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-600">{label}<Lock size={11} className="text-slate-300" aria-label="Solo lectura" /></span>
      <div className={`flex h-10 items-center rounded-xl border px-3.5 text-[13px] ${highlight ? 'border-[#1E2B58]/15 bg-[#1E2B58]/[0.04] font-semibold text-[#1E2B58] tabular-nums' : 'border-slate-200/80 bg-slate-50 font-medium text-slate-700'}`}>{value}</div>
    </div>
  )
}

export function NativeSelect({ id, value, onChange, options, placeholder, disabled }: { id?: string; value: string; onChange: (value: string) => void; options: readonly string[]; placeholder?: string; disabled?: boolean }) {
  return (
    <div className="relative">
      <select id={id} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className={`${controlClass} appearance-none pr-9 ${value ? '' : 'text-slate-400'}`}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <ChevronDown aria-hidden="true" size={15} className="pointer-events-none absolute right-3 top-3 text-slate-400" />
    </div>
  )
}

export function SearchableSelect({ id, value, onChange, options, placeholder = 'Seleccionar…', clearable = false, invalid = false }: { id?: string; value: string; onChange: (value: string) => void; options: { value: string; label: string; hint?: string }[]; placeholder?: string; clearable?: boolean; invalid?: boolean }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((option) => option.value === value)
  const filtered = options.filter((option) => `${option.label} ${option.hint ?? ''}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const pick = (next: string) => { onChange(next); setOpen(false); setQuery('') }

  return (
    <div ref={ref} className="relative">
      <button id={id} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId} aria-invalid={invalid} onClick={() => setOpen((v) => !v)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }} className={`${controlClass} flex items-center justify-between gap-2 text-left ${invalid ? 'border-rose-300' : ''}`}>
        <span className={`truncate ${selected ? '' : 'font-normal text-slate-400'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" size={15} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1.5 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3">
            <Search size={14} className="text-slate-400" aria-hidden="true" />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229 && filtered[0]) { event.preventDefault(); pick(filtered[0].value) } }} aria-label="Buscar opción" placeholder="Buscar…" className="h-9 w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400" />
          </div>
          <ul id={listId} role="listbox" className="max-h-56 overflow-y-auto p-1">
            {clearable && <li role="option" aria-selected={!value}><button type="button" onClick={() => pick('')} className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-slate-400 hover:bg-slate-50">Sin asociar</button></li>}
            {filtered.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button type="button" onClick={() => pick(option.value)} className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-slate-700 hover:bg-slate-50">
                  <span className="min-w-0"><span className="block truncate font-medium">{option.label}</span>{option.hint && <span className="block truncate text-[11px] text-slate-400">{option.hint}</span>}</span>
                  {option.value === value && <Check size={14} className="shrink-0 text-[#1E2B58]" />}
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="px-3 py-3 text-center text-xs text-slate-400">Sin resultados</li>}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50">
      <span className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-[#1E2B58]' : 'bg-slate-200'}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
      </span>
      <span className={`text-xs font-semibold ${checked ? 'text-[#1E2B58]' : 'text-slate-500'}`}>{checked ? 'Sí' : 'No'}</span>
    </button>
  )
}

export function Segmented<T extends string>({ value, onChange, options, label, compact = false }: { value: T; onChange: (value: T) => void; options: { value: T; label: string }[]; label: string; compact?: boolean }) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex rounded-xl border border-slate-200/80 bg-slate-50 p-1 ${compact ? 'h-9' : 'h-10'}`}>
      {options.map((option) => (
        <button key={option.value} type="button" role="radio" aria-checked={value === option.value} onClick={() => onChange(option.value)} className={`min-w-0 flex-1 rounded-lg font-semibold transition ${compact ? 'whitespace-nowrap px-1 text-[10px]' : 'truncate px-2 text-xs'} ${value === option.value ? 'bg-white text-[#1E2B58] shadow-sm ring-1 ring-slate-200/80' : 'text-slate-500 hover:text-slate-700'}`}>
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} aria-hidden={!open} inert={!open}>
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export function SectionCard({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 text-left">
          <h2 className="text-base font-semibold leading-snug text-slate-900 text-balance">{title}</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500 text-pretty">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
