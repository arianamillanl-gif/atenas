import { ShieldAlert } from 'lucide-react'

import ClientCombobox from './ClientCombobox'
import {
  ASSIGNMENT_TYPES,
  MIN_REASON,
  formatDate,
  portfolios,
  shiftDays,
  type Assignment,
  type AssignmentDraft,
  type CanonicalClient,
  type DraftErrors,
} from './data'
import { Field, ReadOnlyValue, SectionHeading, SelectControl, controlClass, sectionClass } from './fields'

type UpdateDraft = <K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]) => void

export function SystemMetadata({ assignment }: { assignment?: Assignment }) {
  return (
    <div aria-label="Metadatos de sistema" role="group" className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 sm:grid-cols-3">
      <Field id="meta-id" label="ID Asignación" locked>
        <ReadOnlyValue id="meta-id" muted={!assignment} value={assignment?.id ?? 'Se generará al registrar'} />
      </Field>
      <Field id="meta-author" label="Creado por" locked>
        <ReadOnlyValue id="meta-author" value={assignment?.author ?? '—'} />
      </Field>
      <Field id="meta-date" label="Fecha de registro" locked>
        <ReadOnlyValue id="meta-date" value={assignment ? formatDate(assignment.createdAt) : '—'} />
      </Field>
    </div>
  )
}

export function GovernedAssignment({
  draft,
  errors,
  clients,
  clientLocked,
  onChange,
  onClientChange,
}: {
  draft: AssignmentDraft
  errors: DraftErrors
  clients: CanonicalClient[]
  clientLocked: boolean
  onChange: UpdateDraft
  onClientChange: (clientId: string) => void
}) {
  const clientMissing = !draft.clientId
  return (
    <section aria-labelledby="block-assignment" className={sectionClass}>
      <SectionHeading
        id="block-assignment"
        title="Asignación gobernada cliente — cartera"
        description="Defina la vinculación comercial del cliente con la cartera de destino y su tipo de adscripción."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field id="draft-clientId" label="Cliente canónico" required={!clientLocked} locked={clientLocked} error={errors.clientId}>
          <ClientCombobox
            id="draft-clientId"
            clients={clients}
            value={draft.clientId}
            locked={clientLocked}
            error={errors.clientId}
            onChange={onClientChange}
          />
        </Field>
        <Field
          id="draft-portfolioId"
          label="Cartera de destino"
          required
          error={errors.portfolioId}
          hint={clientMissing ? 'Disponible al seleccionar un cliente' : undefined}
        >
          <SelectControl
            id="draft-portfolioId"
            value={draft.portfolioId}
            disabled={clientMissing}
            describedBy={clientMissing ? 'draft-portfolioId-hint' : undefined}
            onChange={(value) => onChange('portfolioId', value)}
            error={errors.portfolioId}
            placeholder={clientMissing ? 'Requiere cliente canónico' : 'Seleccione una cartera'}
            options={portfolios.map((item) => ({ value: item.id, label: `${item.name} · ${item.owner}` }))}
          />
        </Field>
        <Field
          id="draft-type"
          label="Tipo de asignación"
          required
          error={errors.type}
          hint={clientMissing ? 'Disponible al seleccionar un cliente' : undefined}
        >
          <SelectControl
            id="draft-type"
            disabled={clientMissing}
            describedBy={clientMissing ? 'draft-type-hint' : undefined}
            value={draft.type}
            onChange={(value) => onChange('type', value as AssignmentDraft['type'])}
            options={ASSIGNMENT_TYPES.map((type) => ({ value: type, label: type }))}
          />
        </Field>
      </div>
    </section>
  )
}

export function ValidityControl({
  draft,
  errors,
  reasonRequired,
  onChange,
}: {
  draft: AssignmentDraft
  errors: DraftErrors
  reasonRequired: boolean
  onChange: UpdateDraft
}) {
  const reasonLength = draft.reason.trim().length
  const reasonValid = reasonLength >= MIN_REASON
  const toError = errors.to ?? (draft.to && draft.from && draft.to <= draft.from ? 'Debe ser posterior a “Vigente desde”.' : undefined)
  return (
    <section aria-labelledby="block-validity-title" className={sectionClass}>
      <div className="flex flex-col gap-1">
        <h2 id="block-validity-title" className="m-0 text-base font-semibold text-slate-900">
          Control de vigencia histórica y motivo de reasignación
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="draft-from" label="Vigente desde" required error={errors.from} hint="Por defecto: fecha actual">
          <input
            id="draft-from"
            type="date"
            value={draft.from}
            onChange={(event) => onChange('from', event.target.value)}
            aria-invalid={Boolean(errors.from)}
            aria-describedby={errors.from ? 'draft-from-error' : 'draft-from-hint'}
            className={controlClass}
          />
        </Field>
        <Field
          id="draft-to"
          label="Vigente hasta"
          error={toError}
          hint="Opcional · Dejar vacío para mantener la vigencia abierta/activa."
        >
          <input
            id="draft-to"
            type="date"
            value={draft.to}
            min={draft.from ? shiftDays(draft.from, 1) : undefined}
            onChange={(event) => onChange('to', event.target.value)}
            aria-invalid={Boolean(toError)}
            aria-describedby={toError ? 'draft-to-error' : 'draft-to-hint'}
            className={controlClass}
          />
        </Field>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <label
          htmlFor="draft-reason"
          className={`inline-flex items-center gap-1 text-xs font-semibold ${reasonRequired ? 'text-slate-700' : 'text-slate-500'}`}
        >
          {reasonRequired ? (
            <>
              Motivo de reasignación / cambio
              <span className="font-bold text-rose-500" aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </>
          ) : (
            'Motivo de reasignación / cambio (Opcional)'
          )}
        </label>
        <textarea
          id="draft-reason"
          rows={3}
          value={draft.reason}
          required={reasonRequired}
          onChange={(event) => onChange('reason', event.target.value)}
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? 'draft-reason-error draft-reason-hint' : 'draft-reason-hint'}
          placeholder="Explique la justificación comercial o administrativa del cambio de cartera..."
          className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`}
        />
        {errors.reason && (
          <p id="draft-reason-error" role="alert" className="m-0 text-[11px] font-medium text-red-600">{errors.reason}</p>
        )}
        <p
          id="draft-reason-hint"
          aria-live="polite"
          className={`m-0 text-[11px] ${
            !reasonRequired ? 'text-slate-400' : reasonValid ? 'font-semibold text-emerald-600' : 'font-medium text-amber-600'
          }`}
        >
          {!reasonRequired
            ? 'Opcional para primer registro de asignación.'
            : reasonValid
              ? `✓ Justificación válida · ${reasonLength}/${MIN_REASON} caracteres`
              : `Requerido para auditoría · ${reasonLength}/${MIN_REASON} caracteres mínimos`}
        </p>
      </div>
      <div role="note" className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-amber-900 shadow-2xs">
        <ShieldAlert aria-hidden="true" className="size-5 shrink-0 text-amber-600" />
        <div className="flex flex-col gap-1">
          <p className="m-0 text-xs font-bold tracking-wide text-amber-950">REGLA DE GOBERNANZA (APPEND-ONLY):</p>
          <p className="m-0 text-xs leading-relaxed text-amber-900/90">
            Al reasignar, el sistema cierra automáticamente la vigencia previa (Vigente Hasta = Nueva Fecha - 1 día) y conserva el registro
            en el historial inmutable sin sobrescribir datos.
          </p>
        </div>
      </div>
    </section>
  )
}
