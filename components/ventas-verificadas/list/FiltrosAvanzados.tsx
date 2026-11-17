'use client'

import { useState } from 'react'
import { ChevronDown, Search, SlidersHorizontal } from 'lucide-react'
import { SALES_REPS, SERVICE_CATALOG } from '../data'
import { LIST_SALES } from '../list-data'

export type Filters = {
  cliente: string
  ref: string
  servicio: string
  responsable: string
  desde: string
  hasta: string
  condicion: string
  integracion: string
  cxc: string
}

export const EMPTY_FILTERS: Filters = { cliente: '', ref: '', servicio: '', responsable: '', desde: '', hasta: '', condicion: '', integracion: '', cxc: '' }

const CLIENT_OPTIONS = [...new Set(LIST_SALES.map((s) => s.client))].sort()
const control = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-800 outline-none transition focus:border-[#1E2B58]/40 focus:ring-2 focus:ring-[#1E2B58]/15'

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-slate-600">{label}</label>
      {children}
    </div>
  )
}

function Select({ id, value, onChange, options, placeholder = 'Todos' }: { id: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${control} cursor-pointer ${value ? '' : 'text-slate-400'}`}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o} className="text-slate-800">{o}</option>)}
    </select>
  )
}

export default function FiltrosAvanzados({ onSearch, activeCount }: { onSearch: (filters: Filters) => void; activeCount: number }) {
  const [open, setOpen] = useState(true)
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS)
  const set = (key: keyof Filters) => (value: string) => setDraft((d) => ({ ...d, [key]: value }))

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="filtros-panel" className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-2.5">
          <SlidersHorizontal size={16} className="text-slate-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-900">Filtros avanzados</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">{activeCount ? `${activeCount} filtro(s) activo(s)` : 'Todos los registros'}</span>
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <form id="filtros-panel" onSubmit={(e) => { e.preventDefault(); onSearch(draft) }} className="grid grid-cols-1 gap-4 border-t border-slate-100 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="f-cliente" label="Cliente"><Select id="f-cliente" value={draft.cliente} onChange={set('cliente')} options={CLIENT_OPTIONS} /></Field>
          <Field id="f-ref" label="Ref. venta / Clientify ID"><input id="f-ref" value={draft.ref} onChange={(e) => set('ref')(e.target.value)} inputMode="numeric" placeholder="Ej. 33505745" className={`${control} placeholder:text-slate-400`} /></Field>
          <Field id="f-servicio" label="Servicio"><Select id="f-servicio" value={draft.servicio} onChange={set('servicio')} options={SERVICE_CATALOG.map((s) => s.name)} /></Field>
          <Field id="f-resp" label="Responsable comercial"><Select id="f-resp" value={draft.responsable} onChange={set('responsable')} options={SALES_REPS} /></Field>
          <Field id="f-desde" label="Fecha econ. desde"><input id="f-desde" type="date" value={draft.desde} onChange={(e) => set('desde')(e.target.value)} className={control} /></Field>
          <Field id="f-hasta" label="Fecha econ. hasta"><input id="f-hasta" type="date" value={draft.hasta} min={draft.desde || undefined} onChange={(e) => set('hasta')(e.target.value)} className={control} /></Field>
          <Field id="f-cond" label="Estado de condiciones"><Select id="f-cond" value={draft.condicion} onChange={set('condicion')} options={['Sin Condiciones', 'En Borrador', 'Por aprobar', 'Vigente', 'Rechazada']} /></Field>
          <Field id="f-int" label="Estado de integración"><Select id="f-int" value={draft.integracion} onChange={set('integracion')} options={['Pendiente', 'Sincronizado', 'Error']} /></Field>
          <Field id="f-cxc" label="Preparación de CxC"><Select id="f-cxc" value={draft.cxc} onChange={set('cxc')} options={['No iniciada', 'En preparación', 'Lista para generar', 'Generada', 'Bloqueada']} /></Field>
          <div className="flex items-end justify-end gap-2 sm:col-span-2 lg:col-span-3">
            <button type="button" onClick={() => { setDraft(EMPTY_FILTERS); onSearch(EMPTY_FILTERS) }} className="h-10 rounded-full px-4 text-[13px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">Limpiar</button>
            <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1E2B58] px-6 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#16203F]"><Search size={15} aria-hidden="true" />Buscar</button>
          </div>
        </form>
      )}
    </section>
  )
}
