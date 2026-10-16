import { AlertTriangle } from 'lucide-react'

import ClientCombobox from './ClientCombobox'
import {
  ASSIGNMENT_TYPES,
  formatDate,
  portfolios,
  type Assignment,
  type AssignmentDraft,
  type CanonicalClient,
  type DraftErrors,
} from './data'
import { Field, ReadOnlyValue, SectionHeading, SelectControl, controlClass, sectionClass } from './fields'

type UpdateDraft = <K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]) => void

export function SystemMetadata({ assignment }: { assignment?: Assignment }) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 sm:grid-cols-3">
      <Field id="meta-id" label="ID Asignación" locked>
        <ReadOnlyValue id="meta-id" mono value={assignment?.id ?? 'Se generará al registrar'} />
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
        <Field id="draft-portfolioId" label="Cartera de destino" required error={errors.portfolioId}>
          <SelectControl
            id="draft-portfolioId"
            value={draft.portfolioId}
            onChange={(value) => onChange('portfolioId', value)}
            error={errors.portfolioId}
            placeholder="Seleccione una cartera"
            options={portfolios.map((item) => ({ value: item.id, label: `${item.name} · ${item.owner}` }))}
          />
        </Field>
        <Field id="draft-type" label="Tipo de asignación" required error={errors.type}>
          <SelectControl
            id="draft-type"
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
  return (
    <section aria-labelledby="block-validity-title" className={sectionClass}>
      <div className="flex flex-col gap-1">
        <h2 id="block-validity-title" className="m-0 text-base font-semibold text-slate-900">
          Control de vigencia histórica y motivo de reasignación
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="draft-from" label="Vigente desde" required error={errors.from}>
          <input
            id="draft-from"
            type="date"
            value={draft.from}
            onChange={(event) => onChange('from', event.target.value)}
            aria-invalid={Boolean(errors.from)}
            aria-describedby={errors.from ? 'draft-from-error' : undefined}
            className={controlClass}
          />
        </Field>
        <Field id="draft-to" label="Vigente hasta" error={errors.to} hint="Opcional · vacío equivale a vigencia abierta">
          <input
            id="draft-to"
            type="date"
            value={draft.to}
            min={draft.from || undefined}
            onChange={(event) => onChange('to', event.target.value)}
            aria-invalid={Boolean(errors.to)}
            aria-describedby={errors.to ? 'draft-to-error' : 'draft-to-hint'}
            className={controlClass}
          />
        </Field>
      </div>
      <Field
        id="draft-reason"
        label="Motivo de reasignación / cambio"
        required={reasonRequired}
        error={errors.reason}
        hint={reasonRequired ? `Obligatorio al reasignar · ${draft.reason.trim().length}/20 caracteres mínimos` : 'Opcional en la primera asignación del cliente'}
      >
        <textarea
          id="draft-reason"
          rows={3}
          value={draft.reason}
          onChange={(event) => onChange('reason', event.target.value)}
          aria-invalid={Boolean(errors.reason)}
          aria-describedby={errors.reason ? 'draft-reason-error' : 'draft-reason-hint'}
          placeholder="Explique la justificación comercial o administrativa del cambio de cartera..."
          className={`${controlClass} h-auto resize-y py-2.5 leading-relaxed`}
        />
      </Field>
      <div role="note" className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900">
        <AlertTriangle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-600" />
        <p className="m-0 text-xs leading-relaxed">
          <strong className="font-semibold">MECANISMO DE REASIGNACIÓN (APPEND-ONLY):</strong> Al registrar una nueva asignación, el sistema
          cierra automáticamente la vigencia anterior (Vigente Hasta = Fecha Nueva - 1 día) y preserva el historial de reasignaciones sin
          sobrescribirlo ni eliminarlo.
        </p>
      </div>
    </section>
  )
}
