'use client'

import { useState, type FormEvent } from 'react'
import { Archive, Calendar, Clock3, FilePlus2, FileSearch, MoreHorizontal, Plus, X } from 'lucide-react'

export type Alias = { name: string; source: string; method: string; validity: string; status: 'Vigente' | 'Inactivo'; evidence: string }

const SOURCES = ['Clientify', 'Factura electrónica', 'CRM histórico', 'Registro fiscal', 'Carga manual']
const METHODS = ['ETL automático', 'Homologación manual', 'Regla de coincidencia']

const inputBase = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#2A4B93] focus:ring-4 focus:ring-[#2A4B93]/10'
const labelBase = 'text-xs font-semibold text-slate-700'

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

function StatusBadge({ status }: { status: Alias['status'] }) {
  return status === 'Vigente'
    ? <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />Vigente</span>
    : <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-500"><span className="size-1.5 rounded-full bg-slate-400" aria-hidden="true" />Inactivo</span>
}

function AddAliasModal({ existingNames, onClose, onSave }: { existingNames: string[]; onClose: () => void; onSave: (alias: Alias) => void }) {
  const [name, setName] = useState('')
  const [source, setSource] = useState(SOURCES[0])
  const [method, setMethod] = useState(METHODS[1])
  const [date, setDate] = useState('2026-10-08')
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('La denominación es obligatoria.')
    if (existingNames.some((existing) => existing.toLowerCase() === trimmed.toLowerCase())) return setError('Esta denominación ya está registrada en el historial.')
    if (!date) return setError('Indica la fecha de vigencia.')
    onSave({ name: trimmed, source, method, validity: `${formatDate(date)} — Actual`, status: 'Vigente', evidence: 'Ver evidencia' })
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm" onClick={onClose} onKeyDown={(event) => event.key === 'Escape' && onClose()}>
    <section role="dialog" aria-modal="true" aria-labelledby="add-alias-title" className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
      <header className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#2A4B93]/10 text-[#2A4B93]"><FilePlus2 size={18} aria-hidden="true" /></span>
          <div>
            <h2 id="add-alias-title" className="m-0 text-base font-semibold text-slate-900">Registrar nuevo alias</h2>
            <p className="m-0 mt-0.5 text-xs leading-relaxed text-slate-500">El alias se asociará a la identidad canónica con vigencia abierta.</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="flex size-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={16} /></button>
      </header>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="flex flex-col gap-2">
          <label htmlFor="alias-name" className={labelBase}>Denominación / Alias</label>
          <input id="alias-name" autoFocus value={name} onChange={(event) => { setName(event.target.value); setError('') }} placeholder="Ej. Alfa Consultores C.A." maxLength={120} required aria-invalid={Boolean(error)} aria-describedby={error ? 'alias-error' : undefined} className={inputBase} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="alias-source" className={labelBase}>Fuente</label>
            <select id="alias-source" value={source} onChange={(event) => setSource(event.target.value)} className={`${inputBase} cursor-pointer`}>{SOURCES.map((option) => <option key={option}>{option}</option>)}</select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="alias-method" className={labelBase}>Método</label>
            <select id="alias-method" value={method} onChange={(event) => setMethod(event.target.value)} className={`${inputBase} cursor-pointer`}>{METHODS.map((option) => <option key={option}>{option}</option>)}</select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="alias-date" className={labelBase}>Fecha de vigencia</label>
          <div className="relative">
            <Calendar size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2A4B93]" />
            <input id="alias-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} onClick={(event) => event.currentTarget.showPicker?.()} className={`${inputBase} cursor-pointer pl-10 [&::-webkit-calendar-picker-indicator]:hidden`} />
          </div>
        </div>

        {error && <p id="alias-error" role="alert" className="m-0 rounded-xl border border-red-200/60 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">{error}</p>}

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="h-10 rounded-full border border-slate-200 bg-white px-5 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50">Cancelar</button>
          <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2A4B93] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#223d78] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/20"><Plus size={15} aria-hidden="true" />Guardar y registrar</button>
        </footer>
      </form>
    </section>
  </div>
}

function RowActions({ alias, onViewEvidence, onInactivate }: { alias: Alias; onViewEvidence: () => void; onInactivate: () => void }) {
  const [open, setOpen] = useState(false)
  const run = (action: () => void) => { setOpen(false); action() }

  return <div className="relative inline-flex" onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}>
    <button type="button" aria-label={`Acciones para ${alias.name}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex size-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"><MoreHorizontal size={17} /></button>
    {open && <>
      <button type="button" tabIndex={-1} aria-hidden="true" className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
      <div role="menu" className="absolute right-0 top-9 z-20 w-64 whitespace-nowrap overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg">
        <button role="menuitem" type="button" onClick={() => run(onViewEvidence)} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-slate-700 transition hover:bg-slate-50"><FileSearch size={15} className="text-[#2A4B93]" aria-hidden="true" />Ver evidencia</button>
        {alias.status === 'Vigente'
          ? <button role="menuitem" type="button" onClick={() => run(onInactivate)} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-amber-800 transition hover:bg-amber-50"><Archive size={15} aria-hidden="true" />Inactivar / Cerrar vigencia</button>
          : <span role="menuitem" aria-disabled="true" className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-slate-400"><Archive size={15} aria-hidden="true" />Vigencia ya cerrada</span>}
      </div>
    </>}
  </div>
}

export default function AliasMapping({ aliases, onAdd, onViewEvidence, onRequestInactivate }: { aliases: Alias[]; onAdd: (alias: Alias) => void; onViewEvidence: (alias: Alias) => void; onRequestInactivate: (index: number) => void }) {
  const [adding, setAdding] = useState(false)
  const th = '!h-auto !bg-transparent !px-4 !py-3.5 text-left !text-[11px] font-semibold uppercase !tracking-wider !text-slate-500'
  const td = '!whitespace-normal !px-4 !py-3.5 align-middle !text-[13px] !text-slate-500'

  return <section className="client-card" aria-labelledby="alias-mapping-title">
    <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 id="alias-mapping-title">Mapeo de alias y homologación</h2>
        <p className="m-0 text-xs text-slate-500">Las vigencias se cierran, nunca se eliminan, para preservar el histórico del cliente.</p>
      </div>
      <button type="button" onClick={() => setAdding(true)} className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full bg-[#2A4B93] px-5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#223d78] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A4B93]/20"><FilePlus2 size={15} aria-hidden="true" />Agregar nuevo alias</button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse font-[Poppins,sans-serif]">
        <thead className="border-b border-slate-200/70 bg-slate-50/60">
          <tr><th className={th}>Denominación / alias</th><th className={th}>Fuente</th><th className={th}>Método</th><th className={th}>Vigencia</th><th className={th}>Estado</th><th className={th}>Evidencia</th><th className={th}><span className="sr-only">Acciones</span></th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {aliases.map((alias, index) => <tr key={alias.name} className="transition-colors hover:bg-slate-50/60">
            <td className={td}><div className="flex flex-col gap-0.5"><strong className={`!text-[13px] font-semibold ${alias.status === 'Vigente' ? '!text-slate-900' : '!text-slate-500'}`}>{alias.name}</strong><span className="text-[11px] text-slate-400">{index === 0 ? 'Denominación preferida' : alias.status === 'Vigente' ? 'Alias vigente' : 'Registro histórico'}</span></div></td>
            <td className={td}>{alias.source}</td>
            <td className={td}>{alias.method}</td>
            <td className={td}><span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Clock3 size={13} className="text-slate-400" aria-hidden="true" />{alias.validity}</span></td>
            <td className={td}><StatusBadge status={alias.status} /></td>
            <td className={td}><button type="button" onClick={() => onViewEvidence(alias)} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[13px] font-medium text-[#2A4B93] transition hover:bg-[#2A4B93]/[0.06]"><FileSearch size={14} aria-hidden="true" />{alias.evidence}</button></td>
            <td className={`${td} text-right`}><RowActions alias={alias} onViewEvidence={() => onViewEvidence(alias)} onInactivate={() => onRequestInactivate(index)} /></td>
          </tr>)}
        </tbody>
      </table>
    </div>

    {adding && <AddAliasModal existingNames={aliases.map((alias) => alias.name)} onClose={() => setAdding(false)} onSave={(alias) => { onAdd(alias); setAdding(false) }} />}
  </section>
}
