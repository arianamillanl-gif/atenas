import { AlertTriangle, Calendar, CalendarClock } from 'lucide-react'
import { Card, Field, inputClass } from './fields'
import { DRASTIC_STATUSES, EMPLOYMENT_STATUSES, type EmploymentStatus, type FormErrors, type PersonaForm } from './data'

type Props = {
  form: PersonaForm
  errors: FormErrors
  statusChanged: boolean
  showWarning: boolean
  onChange: <K extends keyof PersonaForm>(key: K, value: PersonaForm[K]) => void
  onViewHistory: () => void
}

const statusTone: Record<EmploymentStatus, string> = {
  Activo: 'bg-primary/10 text-primary',
  'En revisión': 'bg-amber-100 text-amber-800',
  Licencia: 'bg-slate-100 text-slate-700',
  Suspendido: 'bg-amber-100 text-amber-800',
  'Baja definitiva': 'bg-slate-800 text-white',
}

function DateInput({ id, label, value, min, onChange }: { id: string; label: string; value: string; min?: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <span className="sr-only">{label}</span>
      <Calendar size={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
      <input
        id={id}
        type="date"
        aria-label={label}
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} pl-10`}
      />
    </div>
  )
}

export default function EmploymentStatusCard({ form, errors, statusChanged, showWarning, onChange, onViewHistory }: Props) {
  const reasonRequired = statusChanged || DRASTIC_STATUSES.includes(form.status)

  return (
    <Card
      id="estado"
      icon={CalendarClock}
      title="Estado laboral y vigencia"
      description="Controla el ciclo de vida de la persona. Todo cambio de estado queda registrado con su motivo."
      aside={
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusTone[form.status]}`}>
          {form.status}
        </span>
      }
    >
      {showWarning && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ECB421]/25 text-amber-700">
            <AlertTriangle size={16} aria-hidden="true" />
          </span>
          <p className="m-0 text-sm leading-relaxed">
            Esta persona posee comisiones pendientes o asignaciones activas. Se recomienda verificar antes de ejecutar la operación.{' '}
            <button type="button" onClick={onViewHistory} className="font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950">
              Ver historial de tareas
            </button>
          </p>
        </div>
      )}

      <Field id="persona-status" label="Estado laboral vigente" required hint="Catálogo gobernado por Talento Humano">
        <select
          id="persona-status"
          className={`${inputClass} cursor-pointer`}
          value={form.status}
          onChange={(event) => onChange('status', event.target.value as EmploymentStatus)}
        >
          {EMPLOYMENT_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </Field>

      <Field id="persona-validFrom" label="Fecha de vigencia (Inicio – Fin)" error={errors.validTo} hint="Deja el fin vacío si la vigencia es abierta">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DateInput id="persona-validFrom" label="Inicio de vigencia" value={form.validFrom} onChange={(value) => onChange('validFrom', value)} />
          <DateInput id="persona-validTo" label="Fin de vigencia" value={form.validTo} min={form.validFrom} onChange={(value) => onChange('validTo', value)} />
        </div>
      </Field>

      <Field
        id="persona-reason"
        label="Motivo de cambio de estado"
        required={reasonRequired}
        error={errors.reason}
        hint={`${form.reason.length} / 500 caracteres · requerido para auditoría al cambiar el estado`}
      >
        <textarea
          id="persona-reason"
          rows={4}
          maxLength={500}
          value={form.reason}
          onChange={(event) => onChange('reason', event.target.value)}
          placeholder="Describe la justificación del cambio de estado"
          aria-invalid={errors.reason ? true : undefined}
          aria-describedby={errors.reason ? 'persona-reason-error' : undefined}
          className={`${inputClass} h-auto min-h-28 resize-y py-3 leading-relaxed`}
        />
      </Field>
    </Card>
  )
}
