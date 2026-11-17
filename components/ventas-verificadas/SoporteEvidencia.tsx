'use client'

import { useRef, useState } from 'react'
import { Eye, FileCheck2, FileUp, Trash2 } from 'lucide-react'
import { FieldLabel, NativeSelect, SectionCard, controlClass } from './fields'

export type SupportState = {
  referencia: string
  tipo: string
  documento: string
  fechaDoc: string
  inicio: string
  fin: string
  observacion: string
  files: Record<SlotKey, File | null>
}

export type SlotKey = 'contrato' | 'orden' | 'rif'

const SLOTS: { key: SlotKey; title: string; required: boolean }[] = [
  { key: 'contrato', title: 'Contrato / Acuerdo Firmado', required: true },
  { key: 'orden', title: 'Orden de Compra', required: false },
  { key: 'rif', title: 'Comprobante RIF', required: false },
]

const SUPPORT_TYPES = ['Contrato firmado', 'Propuesta aceptada', 'Orden de compra', 'Correo de aceptación', 'Addendum']

export const missingSupport = (s: SupportState) => [
  !s.referencia.trim() && 'Referencia del contrato',
  !s.tipo && 'Tipo de soporte',
  !s.documento.trim() && 'Referencia del documento',
  !s.fechaDoc && 'Fecha del documento',
  !s.inicio && 'Inicio de vigencia',
  !s.files.contrato && 'Contrato firmado (.pdf)',
].filter(Boolean) as string[]

function Dropzone({ slot, file, onFile }: { slot: (typeof SLOTS)[number]; file: File | null; onFile: (file: File | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const accept = (candidate?: File) => {
    if (!candidate) return
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) { setError('Solo se admiten archivos .pdf'); return }
    setError('')
    onFile(candidate)
  }
  const fileSize = file ? file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB` : ''

  return (
    <div>
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }}
        onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files[0]) }}
        className={`flex flex-col gap-3 rounded-xl border border-dashed px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${file ? 'border-solid border-emerald-200 bg-emerald-50/30' : dragging ? 'border-[#1E2B58] bg-slate-50/60' : 'border-slate-300 hover:border-[#1E2B58] hover:bg-slate-50/60'}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${file ? 'bg-white text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
            {file ? <FileCheck2 size={16} /> : <FileUp size={16} />}
          </span>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className={`truncate text-[13px] font-semibold ${file ? 'text-slate-800' : 'text-slate-700'}`}>{file ? file.name : slot.title}</span>
            {file ? <span className="shrink-0 text-xs text-slate-500 tabular-nums">{fileSize}</span> : <span className="shrink-0 text-xs text-slate-400">(.pdf)</span>}
            {!file && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${slot.required ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{slot.required ? 'Obligatorio' : 'Opcional'}</span>}
          </div>
        </div>
        {file ? (
          <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
            <button type="button" title="Ver PDF" aria-label={`Ver PDF ${file.name}`} onClick={() => window.open(URL.createObjectURL(file), '_blank', 'noopener,noreferrer')} className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-[#1E2B58]"><Eye size={16} /></button>
            <button type="button" title="Quitar archivo" aria-label={`Quitar archivo ${file.name}`} onClick={() => onFile(null)} className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-rose-600"><Trash2 size={16} /></button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400">Arrastra o</span>
            <button type="button" onClick={() => input.current?.click()} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">Seleccionar PDF</button>
          </div>
        )}
      </div>
      <input ref={input} type="file" accept="application/pdf,.pdf" className="sr-only" tabIndex={-1} aria-label={`Cargar ${slot.title}`} onChange={(event) => { accept(event.target.files?.[0]); event.target.value = '' }} />
      {error && <p role="alert" className="mt-1.5 text-[11px] font-medium text-rose-600">{error}</p>}
    </div>
  )
}

export default function SoporteEvidencia({ value, onChange }: { value: SupportState; onChange: (value: SupportState) => void }) {
  const set = <K extends keyof SupportState>(key: K, next: SupportState[K]) => onChange({ ...value, [key]: next })
  const text = (key: 'referencia' | 'documento' | 'fechaDoc' | 'inicio' | 'fin', label: string, required: boolean, type = 'text', placeholder?: string) => (
    <div>
      <FieldLabel htmlFor={`sop-${key}`} required={required}>{label}</FieldLabel>
      <input id={`sop-${key}`} type={type} value={value[key]} placeholder={placeholder} onChange={(event) => set(key, event.target.value)} className={`${controlClass} tabular-nums`} />
    </div>
  )

  return (
    <SectionCard title="Soporte Contractual y Evidencia" description="Referencias del documento que respalda la venta y expediente digital en formato PDF.">
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        {text('referencia', 'Referencia o Código del Contrato', true, 'text', 'Ej. CT-2026-0412')}
        <div>
          <FieldLabel htmlFor="sop-tipo" required>Tipo de Soporte</FieldLabel>
          <NativeSelect id="sop-tipo" value={value.tipo} onChange={(tipo) => set('tipo', tipo)} options={SUPPORT_TYPES} placeholder="Seleccionar tipo" />
        </div>
        {text('documento', 'Referencia del Documento', true, 'text', 'Ej. PRO-ATN-118')}
        {text('fechaDoc', 'Fecha del Documento', true, 'date')}
        {text('inicio', 'Inicio de Vigencia', true, 'date')}
        {text('fin', 'Fin de Vigencia', false, 'date')}
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-medium text-slate-600">Expediente digital</p>
        <div className="flex flex-col gap-2.5">
          {SLOTS.map((slot) => <Dropzone key={slot.key} slot={slot} file={value.files[slot.key]} onFile={(file) => set('files', { ...value.files, [slot.key]: file })} />)}
        </div>
      </div>

      <div className="mt-6">
        <FieldLabel htmlFor="sop-observacion">Observación Contractual</FieldLabel>
        <textarea id="sop-observacion" value={value.observacion} onChange={(event) => set('observacion', event.target.value)} rows={2} placeholder="Notas sobre cláusulas especiales, excepciones o acuerdos verbales documentados…" className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`} />
      </div>
    </SectionCard>
  )
}
