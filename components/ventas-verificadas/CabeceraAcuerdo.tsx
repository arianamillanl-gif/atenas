'use client'

import { Layers } from 'lucide-react'
import { FRAMEWORK_CONTRACTS, SALES_REPS, CLIENTIFY_TOTAL, fmt } from './data'
import { FieldLabel, ReadOnlyField, SearchableSelect, SectionCard } from './fields'

export type HeaderState = { responsable: string; contratoMarco: string; unificado: boolean }

export default function CabeceraAcuerdo({ value, onChange }: { value: HeaderState; onChange: (value: HeaderState) => void }) {
  return (
    <SectionCard step="1" title="Cabecera del Acuerdo y Datos de la Venta" description="Datos heredados de Clientify en modo lectura y controles globales del acuerdo comercial.">
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
        <ReadOnlyField label="Cliente" value="Inversiones Delta 360, C.A." />
        <ReadOnlyField label="Unidad de Negocio" value="Consultoría y Tecnología" />
        <div>
          <FieldLabel htmlFor="responsable" required>Responsable Comercial</FieldLabel>
          <SearchableSelect id="responsable" value={value.responsable} invalid={!value.responsable} onChange={(responsable) => onChange({ ...value, responsable })} options={SALES_REPS.map((rep) => ({ value: rep, label: rep }))} placeholder="Buscar responsable…" />
        </div>
        <ReadOnlyField label="Fecha Económica" value={<span className="tabular-nums">02/11/2026</span>} />
        <ReadOnlyField label="Importe Total Clientify" value={`${fmt(CLIENTIFY_TOTAL)} USD`} highlight />
        <ReadOnlyField label="Fuente y Fecha de Carga" value={<span className="truncate">Clientify · <span className="tabular-nums">02/11/2026 09:14</span></span>} />
      </div>

      <div className="mt-6 grid grid-cols-1 items-end gap-5 border-t border-slate-100 pt-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <FieldLabel htmlFor="contrato-marco">Contrato Marco Asociado <span className="font-normal text-slate-400">(opcional)</span></FieldLabel>
          <SearchableSelect id="contrato-marco" clearable value={value.contratoMarco} onChange={(contratoMarco) => onChange({ ...value, contratoMarco })} options={FRAMEWORK_CONTRACTS.map((contract) => { const [code, name] = contract.split(' · '); return { value: contract, label: code, hint: name } })} placeholder="Sin contrato marco asociado" />
        </div>
        <label className={`flex h-10 cursor-pointer items-center gap-2.5 rounded-xl border px-4 text-[13px] font-medium transition ${value.unificado ? 'border-[#1E2B58]/30 bg-[#1E2B58]/[0.05] text-[#1E2B58]' : 'border-slate-200/80 text-slate-600 hover:bg-slate-50'}`}>
          <input type="checkbox" checked={value.unificado} onChange={(event) => onChange({ ...value, unificado: event.target.checked })} className="size-4 rounded accent-[#1E2B58]" />
          <Layers size={15} aria-hidden="true" />
          Marcar como Acuerdo Unificado
        </label>
      </div>
    </SectionCard>
  )
}
