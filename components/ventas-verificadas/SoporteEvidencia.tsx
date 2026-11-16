'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, FileText, UploadCloud, X } from 'lucide-react'
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

  if (file) {
    return (
      <div className="flex h-full min-h-36 flex-col justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-100"><FileText size={17} /></span>
          <button type="button" onClick={() => onFile(null)} aria-label={`Quitar ${file.name}`} className="grid size-7 place-items-center rounded-lg text-slate-400 transition hover:bg-white hover:text-rose-600"><X size={15} /></button>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{slot.title}</p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-slate-800">{file.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500 tabular-nums"><CheckCircle2 size={12} className="text-emerald-600" />{(file.size / 1024).toFixed(0)} KB · Cargado</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); accept(event.dataTransfer.files[0]) }}
        className={`flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition ${dragging ? 'border-[#1E2B58] bg-[#1E2B58]/[0.04]' : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50'}`}
      >
        <span className="grid size-9 place-items-center rounded-xl bg-white text-[#1E2B58] shadow-sm ring-1 ring-slate-200/80"><UploadCloud size={17} /></span>
        <span className="text-[13px] font-semibold text-slate-700">{slot.title} <span className="font-normal text-slate-400">(.pdf)</span></span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${slot.required ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{slot.required ? 'Obligatorio' : 'Opcional'}</span>
        <span className="text-[11px] text-slate-400">Arrastra el archivo o haz clic para buscar</span>
      </button>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SLOTS.map((slot) => <Dropzone key={slot.key} slot={slot} file={value.files[slot.key]} onFile={(file) => set('files', { ...value.files, [slot.key]: file })} />)}
        </div>
      </div>

      <div className="mt-6">
        <FieldLabel htmlFor="sop-observacion">Observación Contractual</FieldLabel>
        <textarea id="sop-observacion" value={value.observacion} onChange={(event) => set('observacion', event.target.value)} rows={3} placeholder="Notas sobre cláusulas especiales, excepciones o acuerdos verbales documentados…" className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`} />
      </div>
    </SectionCard>
  )
}
