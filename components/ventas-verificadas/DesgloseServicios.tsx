'use client'

import { AlertTriangle, CalendarClock, CheckCircle2, ChevronDown, Lock, Plus, Trash2 } from 'lucide-react'
import { CLIENTIFY_TOTAL, PROVIDERS, SERVICE_CATALOG, emptyLine, fmtUsd, parseAmount, type PaymentTerms, type ServiceLine } from './data'
import { Collapse, FieldLabel, NativeSelect, SearchableSelect, SectionCard, Segmented, Toggle, controlClass } from './fields'

export function ReconciliationBar({ assigned }: { assigned: number }) {
  const diff = Math.round((CLIENTIFY_TOTAL - assigned) * 100) / 100
  const state = diff === 0 ? 'ok' : diff > 0 ? 'under' : 'over'
  const tone = { ok: 'border-emerald-200 bg-emerald-50 text-emerald-700', under: 'border-amber-200 bg-amber-50 text-amber-700', over: 'border-rose-200 bg-rose-50 text-rose-700' }[state]
  const message = { ok: 'Desglose conciliado con Clientify', under: 'Falta asignar monto a servicios', over: 'El desglose excede el total de Clientify' }[state]
  const pct = Math.min(100, (assigned / CLIENTIFY_TOTAL) * 100)

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/60" aria-live="polite">
      <div className="grid grid-cols-1 divide-y divide-slate-200/80 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Monto Total Clientify</p>
          <p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{fmtUsd(CLIENTIFY_TOTAL)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Total Asignado</p>
          <p className="mt-1 text-xl font-semibold text-[#1E2B58] tabular-nums">{fmtUsd(assigned)}</p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Diferencia Pendiente</p>
          <p className={`mt-1 inline-flex items-center gap-2 rounded-lg border px-2.5 py-0.5 text-xl font-semibold tabular-nums ${tone}`}>{diff < 0 ? '−' : ''}{fmtUsd(Math.abs(diff))}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-slate-200/80 bg-white px-5 py-2.5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Porcentaje asignado">
          <div className={`h-full rounded-full transition-all duration-500 ${state === 'ok' ? 'bg-emerald-500' : state === 'under' ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`flex shrink-0 items-center gap-1.5 text-[11px] font-semibold ${tone.split(' ').at(-1)}`}>
          {state === 'ok' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}{message}
        </span>
      </div>
    </div>
  )
}

function PaymentTermsPanel({ terms, disabled, onChange }: { terms: PaymentTerms; disabled: boolean; onChange: (terms: PaymentTerms) => void }) {
  const set = <K extends keyof PaymentTerms>(key: K, value: PaymentTerms[K]) => onChange({ ...terms, [key]: value })
  return (
    <fieldset disabled={disabled} className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
      <legend className="sr-only">Condiciones de pago</legend>
      <div><FieldLabel>Modalidad</FieldLabel><NativeSelect disabled={disabled} value={terms.modalidad} onChange={(v) => onChange({ ...terms, modalidad: v as PaymentTerms['modalidad'], ...(v === 'Contado' ? { cuotas: 1, periodicidad: 'Única' as const } : terms.periodicidad === 'Única' ? { periodicidad: 'Mensual' as const, cuotas: Math.max(terms.cuotas, 2) } : {}) })} options={['Contado', 'Cuotas', 'Recurrente']} /></div>
      <div><FieldLabel>Periodicidad</FieldLabel><NativeSelect disabled={disabled || terms.modalidad === 'Contado'} value={terms.periodicidad} onChange={(v) => set('periodicidad', v as PaymentTerms['periodicidad'])} options={terms.modalidad === 'Contado' ? ['Única'] : ['Mensual', 'Trimestral', 'Semestral', 'Anual']} /></div>
      <div><FieldLabel>Cuotas</FieldLabel><input type="number" min={1} max={36} disabled={disabled || terms.modalidad === 'Contado'} value={terms.cuotas} onChange={(e) => set('cuotas', Math.min(36, Math.max(1, Number(e.target.value) || 1)))} className={`${controlClass} tabular-nums`} /></div>
      <div><FieldLabel>Inicio de cobro</FieldLabel><input type="date" disabled={disabled} value={terms.inicio} onChange={(e) => set('inicio', e.target.value)} className={`${controlClass} tabular-nums`} /></div>
      <div><FieldLabel>Moneda</FieldLabel><NativeSelect disabled={disabled} value={terms.moneda} onChange={(v) => set('moneda', v as PaymentTerms['moneda'])} options={['USD', 'VES', 'EUR']} /></div>
      <div><FieldLabel>IVA</FieldLabel><NativeSelect disabled={disabled} value={terms.iva} onChange={(v) => set('iva', v as PaymentTerms['iva'])} options={['Gravado 16%', 'Exento', 'Exonerado']} /></div>
      <div><FieldLabel>Retenciones</FieldLabel><NativeSelect disabled={disabled} value={terms.retencion} onChange={(v) => set('retencion', v as PaymentTerms['retencion'])} options={['Sin retención', 'IVA 75%', 'IVA 100%', 'ISLR 2%']} /></div>
      <div><FieldLabel>Política Cambiaria</FieldLabel><NativeSelect disabled={disabled} value={terms.politica} onChange={(v) => set('politica', v as PaymentTerms['politica'])} options={['Tasa BCV del día de pago', 'Tasa BCV de emisión', 'Tasa fija contractual']} /></div>
    </fieldset>
  )
}

function ServiceRow({ index, line, onChange, onRemove, canRemove }: { index: number; line: ServiceLine; onChange: (line: ServiceLine) => void; onRemove: () => void; canRemove: boolean }) {
  const service = SERVICE_CATALOG.find((s) => s.id === line.serviceId)
  const isAbonado = line.valor === 'Abonado'
  const set = <K extends keyof ServiceLine>(key: K, value: ServiceLine[K]) => onChange({ ...line, [key]: value })
  const id = (name: string) => `${line.id}-${name}`
  const summary = [line.pago.modalidad, line.pago.modalidad !== 'Contado' && `${line.pago.cuotas} × ${line.pago.periodicidad.toLowerCase()}`, line.pago.moneda, line.pago.iva].filter(Boolean).join(' · ')

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-slate-300/80">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
        <span className="grid size-6 place-items-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 tabular-nums">{index + 1}</span>
        <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{service?.name ?? 'Nuevo servicio'}</h3>
        {isAbonado && <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700"><Lock size={10} />Abonado $0</span>}
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{fmtUsd(parseAmount(line.monto))}</span>
        <button type="button" onClick={onRemove} disabled={!canRemove} aria-label={`Eliminar servicio ${index + 1}`} className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"><Trash2 size={15} /></button>
      </header>

      <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-5 md:grid-cols-2 xl:grid-cols-12">
        <div className="md:col-span-2 xl:col-span-5">
          <FieldLabel htmlFor={id('srv')} required>Servicio / Entregable</FieldLabel>
          <SearchableSelect id={id('srv')} value={line.serviceId} invalid={!line.serviceId} onChange={(serviceId) => set('serviceId', serviceId)} options={SERVICE_CATALOG.map((s) => ({ value: s.id, label: s.name, hint: s.id }))} placeholder="Seleccionar del catálogo…" />
        </div>
        <div className="xl:col-span-4">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">Vértice / Línea · Familia</span>
          <div className="flex h-10 flex-wrap items-center gap-1.5">
            {service ? (
              <>
                <span className="inline-flex items-center rounded-full bg-[#1E2B58]/[0.07] px-2.5 py-1 text-[11px] font-semibold text-[#1E2B58] animate-in fade-in zoom-in-95">{service.vertice}</span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 animate-in fade-in zoom-in-95">{service.familia}</span>
              </>
            ) : <span className="text-xs italic text-slate-400">Se completa al elegir el servicio</span>}
          </div>
        </div>
        <div className="xl:col-span-3">
          <FieldLabel htmlFor={id('op')} required>Tipo de Operación</FieldLabel>
          <NativeSelect id={id('op')} value={line.operacion} onChange={(v) => set('operacion', v as ServiceLine['operacion'])} options={['Venta Nueva', 'Renovación']} placeholder="Seleccionar" />
        </div>

        <div className="xl:col-span-3">
          <FieldLabel required>Tipo de Valor</FieldLabel>
          <Segmented label="Tipo de valor" value={line.valor} onChange={(valor) => onChange({ ...line, valor, ...(valor === 'Abonado' ? { monto: '0', comision: false } : { monto: line.monto === '0' ? '' : line.monto }) })} options={[{ value: 'Vendido', label: 'Vendido' }, { value: 'Abonado', label: 'Abonado ($0)' }]} />
        </div>
        <div className="xl:col-span-3">
          <FieldLabel htmlFor={id('monto')} required>Monto Asignado ($ USD)</FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-2.5 text-[13px] text-slate-400">$</span>
            <input id={id('monto')} inputMode="decimal" disabled={isAbonado} value={isAbonado ? '0.00' : line.monto} onChange={(e) => set('monto', e.target.value.replace(/[^\d.]/g, ''))} onBlur={() => line.monto && set('monto', parseAmount(line.monto).toFixed(2))} placeholder="0.00" className={`${controlClass} pl-7 text-right font-semibold tabular-nums ${isAbonado ? 'pr-9' : ''}`} />
            {isAbonado && <Lock size={13} className="absolute right-3 top-3 text-slate-400" aria-label="Bloqueado" />}
          </div>
        </div>
        <div className="xl:col-span-3">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">¿Aplica Comisión?</span>
          <div className="flex h-10 items-center"><Toggle label="Aplica comisión" checked={line.comision} disabled={isAbonado} onChange={(v) => set('comision', v)} /></div>
        </div>
        <div className="xl:col-span-3">
          <span className="mb-1.5 block text-xs font-medium text-slate-600">¿Subcontratado?</span>
          <div className="flex h-10 items-center"><Toggle label="Servicio subcontratado" checked={line.subcontratado} onChange={(v) => set('subcontratado', v)} /></div>
        </div>

        <div className="md:col-span-2 xl:col-span-12">
          <Collapse open={line.subcontratado}>
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <FieldLabel htmlFor={id('prov')} required>Proveedor Subcontratado</FieldLabel>
                <SearchableSelect id={id('prov')} value={line.proveedor} invalid={line.subcontratado && !line.proveedor} onChange={(v) => set('proveedor', v)} options={PROVIDERS.map((p) => ({ value: p, label: p }))} placeholder="Buscar proveedor…" />
              </div>
              <div>
                <FieldLabel htmlFor={id('sub')} required>Monto / % Subcontratación</FieldLabel>
                <div className="flex gap-2">
                  <div className="w-32 shrink-0"><Segmented label="Unidad de subcontratación" value={line.subModo} onChange={(v) => set('subModo', v)} options={[{ value: 'pct', label: '%' }, { value: 'monto', label: '$' }]} /></div>
                  <input id={id('sub')} inputMode="decimal" value={line.subValor} onChange={(e) => set('subValor', e.target.value.replace(/[^\d.]/g, ''))} placeholder={line.subModo === 'pct' ? '0 %' : '0.00'} className={`${controlClass} text-right tabular-nums`} />
                </div>
                {line.subValor && <p className="mt-1 text-right text-[11px] text-slate-500 tabular-nums">{line.subModo === 'pct' ? `≈ ${fmtUsd(parseAmount(line.monto) * parseAmount(line.subValor) / 100)} al proveedor` : `≈ ${parseAmount(line.monto) ? ((parseAmount(line.subValor) / parseAmount(line.monto)) * 100).toFixed(1) : '0.0'} % del servicio`}</p>}
              </div>
            </div>
          </Collapse>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <button type="button" aria-expanded={line.expanded} onClick={() => set('expanded', !line.expanded)} className="flex w-full items-center gap-2.5 px-5 py-3 text-left transition hover:bg-slate-50/70">
          <CalendarClock size={15} className="text-[#1E2B58]" />
          <span className="text-[13px] font-semibold text-slate-700">Condiciones de Pago y Cronograma</span>
          <span className="hidden truncate text-[11px] text-slate-400 sm:inline">{isAbonado ? 'No aplica para servicios abonados' : summary}</span>
          <ChevronDown size={15} className={`ml-auto text-slate-400 transition ${line.expanded ? 'rotate-180' : ''}`} />
        </button>
        <Collapse open={line.expanded}>
          <div className="px-5 pb-5">
            {isAbonado && <p className="mb-3 flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-[11px] font-medium text-sky-700"><Lock size={12} />Servicio abonado: no genera cuentas por cobrar ni cronograma de pagos.</p>}
            <PaymentTermsPanel terms={line.pago} disabled={isAbonado} onChange={(pago) => set('pago', pago)} />
          </div>
        </Collapse>
      </div>
    </article>
  )
}

export default function DesgloseServicios({ lines, onChange }: { lines: ServiceLine[]; onChange: (lines: ServiceLine[]) => void }) {
  const assigned = lines.reduce((sum, line) => sum + (line.valor === 'Abonado' ? 0 : parseAmount(line.monto)), 0)
  return (
    <SectionCard
      step="3"
      title="Desglose de Servicios y Atribución por Vértice"
      description="Distribuye el importe de Clientify entre los servicios contratados. La diferencia debe quedar en $0.00 para enviar a aprobación."
      action={<button type="button" onClick={() => onChange([...lines.map((l) => ({ ...l, expanded: false })), emptyLine()])} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-4 text-xs font-semibold text-[#1E2B58] shadow-sm transition hover:bg-slate-50"><Plus size={15} />Agregar Servicio</button>}
    >
      <div className="flex flex-col gap-4">
        <ReconciliationBar assigned={assigned} />
        {lines.map((line, index) => (
          <ServiceRow key={line.id} index={index} line={line} canRemove={lines.length > 1} onChange={(next) => onChange(lines.map((l) => l.id === line.id ? next : l))} onRemove={() => onChange(lines.filter((l) => l.id !== line.id))} />
        ))}
      </div>
    </SectionCard>
  )
}
