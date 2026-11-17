'use client'

import { useRef, useState } from 'react'
import { Eye, FileText, Trash2 } from 'lucide-react'
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
    if (candidate.type !== 'application/pdf' && !candidate.name.toLowerCase().endsWith('.pdf')) { setError('Solo se admiten archivos PDF.'); return }
    if (candidate.size > 10 * 1024 * 1024) { setError('El archivo debe pesar 10 MB o menos.'); return }
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
        className={`flex flex-col gap-2 px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${dragging ? 'bg-slate-50/70' : 'hover:bg-slate-50/70'}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <FileText size={17} aria-hidden="true" className="shrink-0 text-slate-400" />
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="truncate text-[13px] font-medium text-slate-700">{slot.title}</span>
            {slot.required ? <span aria-label="obligatorio" className="text-sm font-semibold leading-none text-rose-500">*</span> : <span className="text-xs text-slate-400">(Opcional)</span>}
          </div>
        </div>
        {file ? (
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:justify-end">
            <span title={file.name} className="max-w-52 truncate text-[13px] font-medium text-[#1E2B58]">{file.name}</span>
            <span className="text-xs tabular-nums text-slate-500">{fileSize}</span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-slate-500"><span className="size-1.5 rounded-full bg-emerald-500" />Cargado</span>
            <button type="button" title="Ver documento" aria-label={`Ver documento ${file.name}`} onClick={() => window.open(URL.createObjectURL(file), '_blank', 'noopener,noreferrer')} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-[#1E2B58]"><Eye size={16} /></button>
            <button type="button" title="Eliminar" aria-label={`Eliminar ${file.name}`} onClick={() => onFile(null)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white hover:text-rose-600"><Trash2 size={16} /></button>
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400">Sin adjuntar</span>
            <button type="button" onClick={() => input.current?.click()} className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#1E2B58] shadow-2xs transition hover:bg-slate-50">Subir PDF</button>
          </div>
        )}
      </div>
      <input ref={input} type="file" accept="application/pdf,.pdf" className="sr-only" tabIndex={-1} aria-label={`Subir PDF: ${slot.title}`} onChange={(event) => { accept(event.target.files?.[0]); event.target.value = '' }} />
      {error && <p role="alert" className="px-4 pb-2 text-[11px] font-medium text-rose-600">{error}</p>}
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

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[13px] font-semibold text-slate-800">Expediente digital</p>
          <p className="text-xs text-slate-400">Formato PDF · Máx. 10 MB</p>
        </div>
        <div className="divide-y divide-slate-100">
          {SLOTS.map((slot) => <Dropzone key={slot.key} slot={slot} file={value.files[slot.key]} onFile={(file) => set('files', { ...value.files, [slot.key]: file })} />)}
        </div>
      </div>

      <div className="mt-5">
        <FieldLabel htmlFor="sop-observacion">Observación Contractual</FieldLabel>
        <textarea id="sop-observacion" value={value.observacion} onChange={(event) => set('observacion', event.target.value)} rows={2} placeholder="Notas sobre cláusulas especiales, excepciones o acuerdos verbales documentados…" className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`} />
      </div>
    </SectionCard>
  )
}
