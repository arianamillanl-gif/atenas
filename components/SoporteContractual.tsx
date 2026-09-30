'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FileText, Paperclip, X } from 'lucide-react'

export type SupportType = 'propuesta' | 'contrato' | 'orden'

export type ContractSupport = {
  reference: string
  supportType: SupportType
  fileName: string
  documentDate: string
  startDate: string
  endDate: string
  notes: string
}

export const supportTypeLabels: Record<SupportType, string> = {
  propuesta: 'Propuesta aceptada',
  contrato: 'Contrato firmado',
  orden: 'Orden de compra',
}

export const getMissingSupportFields = (support: ContractSupport) => {
  const missing: string[] = []
  if (!support.reference.trim()) missing.push('Referencia del contrato')
  if (!support.fileName) missing.push('Archivo de evidencia')
  if (!support.documentDate) missing.push('Fecha del documento')
  if (!support.startDate) missing.push('Fecha inicio vigencia')
  if (support.startDate && support.endDate && support.endDate < support.startDate) missing.push('Fecha fin vigencia posterior al inicio')
  return missing
}

type SoporteContractualProps = {
  onChange?: (support: ContractSupport) => void
}

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block'
const inputClassName = 'w-full h-10 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal'

export default function SoporteContractual({ onChange }: SoporteContractualProps) {
  const id = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [support, setSupport] = useState<ContractSupport>({
    reference: '',
    supportType: 'contrato',
    fileName: '',
    documentDate: '',
    startDate: '2026-09-24',
    endDate: '',
    notes: '',
  })

  useEffect(() => {
    onChange?.(support)
  }, [support, onChange])

  const update = <K extends keyof ContractSupport>(key: K, value: ContractSupport[K]) =>
    setSupport((current) => ({ ...current, [key]: value }))

  return (
    <section className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs" aria-labelledby={`${id}-title`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={`${id}-title`} className="text-lg font-bold text-slate-900">Soporte contractual y evidencia</h2>
          <p className="text-xs text-slate-500 mt-0.5">Documento legal o propuesta comercial aprobada que respalda las condiciones</p>
        </div>
        <span className="text-[11px] font-medium text-slate-400 shrink-0">* Campos obligatorios</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <label className="min-w-0">
          <span className={labelClassName}>Referencia o código de contrato *</span>
          <input
            className={`${inputClassName} font-mono`}
            value={support.reference}
            onChange={(event) => update('reference', event.target.value)}
            placeholder="Ej. CTR-2026-859"
            required
            aria-required="true"
          />
        </label>

        <label className="min-w-0">
          <span className={labelClassName}>Tipo de soporte y evidencia *</span>
          <select
            value={support.supportType}
            onChange={(event) => update('supportType', event.target.value as SupportType)}
            className={`${inputClassName} truncate`}
          >
            {Object.entries(supportTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <div className="min-w-0">
          <span id={`${id}-file`} className={labelClassName}>Adjuntar Evidencia (PDF/PNG) *</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/png"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => update('fileName', event.target.files?.[0]?.name ?? '')}
          />
          <button
            type="button"
            aria-labelledby={`${id}-file`}
            onClick={() => fileInputRef.current?.click()}
            className="h-10 w-full border border-dashed border-slate-300 hover:border-[#2A4B93] bg-slate-50 hover:bg-blue-50/50 rounded-xl px-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 cursor-pointer transition-all"
          >
            <Paperclip aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{support.fileName ? 'Reemplazar archivo' : 'Seleccionar archivo'}</span>
          </button>
          {support.fileName ? (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#2A4B93] font-medium min-w-0">
              <FileText aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{support.fileName}</span>
              <button
                type="button"
                onClick={() => {
                  update('fileName', '')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                aria-label="Quitar archivo adjunto"
                className="rounded p-0.5 text-slate-400 hover:text-slate-700"
              >
                <X aria-hidden="true" className="w-3 h-3" />
              </button>
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] text-slate-400">Ningún archivo adjunto</p>
          )}
        </div>

        <label className="min-w-0">
          <span className={labelClassName}>Fecha del documento *</span>
          <input type="date" className={inputClassName} value={support.documentDate} onChange={(event) => update('documentDate', event.target.value)} required aria-required="true" />
        </label>

        <label className="min-w-0">
          <span className={labelClassName}>Fecha inicio vigencia *</span>
          <input type="date" className={inputClassName} value={support.startDate} onChange={(event) => update('startDate', event.target.value)} required aria-required="true" />
        </label>

        <label className="min-w-0">
          <span className={labelClassName}>Fecha fin vigencia</span>
          <input
            type="date"
            className={inputClassName}
            value={support.endDate}
            min={support.startDate || undefined}
            onChange={(event) => update('endDate', event.target.value)}
            aria-describedby={`${id}-end-note`}
          />
          <span id={`${id}-end-note`} className="mt-0.5 block text-[10px] text-slate-400">Opcional para contratos abiertos</span>
        </label>

        <label className="block col-span-1 md:col-span-3 mt-1">
          <span className={labelClassName}>Observación contractual relevante</span>
          <textarea
            rows={2}
            className="w-full h-16 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal resize-none"
            value={support.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Añade notas o cláusulas relevantes que no sustituyen datos estructurados..."
          />
        </label>
      </div>
    </section>
  )
}
