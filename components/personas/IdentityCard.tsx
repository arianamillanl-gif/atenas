import { Fingerprint } from 'lucide-react'
import { Card, Field, ReadOnlyInput, inputClass } from './fields'
import type { FormErrors, PersonaForm } from './data'

type Props = {
  form: PersonaForm
  errors: FormErrors
  onChange: <K extends keyof PersonaForm>(key: K, value: PersonaForm[K]) => void
}

export default function IdentityCard({ form, errors, onChange }: Props) {
  const errorProps = (key: keyof PersonaForm) =>
    errors[key] ? { 'aria-invalid': true, 'aria-describedby': `persona-${key}-error` } : {}

  return (
    <Card
      id="identidad"
      icon={Fingerprint}
      title="Identificación estable y contacto"
      description="El documento proviene del registro de origen y no se sobrescribe. Nombres y contacto son editables según permisos."
    >
      <Field id="persona-document" label="Documento de identidad">
        <ReadOnlyInput id="persona-document" value="V-12345678" origin="SAIME" />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="persona-firstNames" label="Nombres" required error={errors.firstNames}>
          <input
            id="persona-firstNames"
            className={inputClass}
            value={form.firstNames}
            onChange={(event) => onChange('firstNames', event.target.value)}
            autoComplete="given-name"
            required
            {...errorProps('firstNames')}
          />
        </Field>
        <Field id="persona-lastNames" label="Apellidos" required error={errors.lastNames}>
          <input
            id="persona-lastNames"
            className={inputClass}
            value={form.lastNames}
            onChange={(event) => onChange('lastNames', event.target.value)}
            autoComplete="family-name"
            required
            {...errorProps('lastNames')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="persona-email" label="Correo electrónico" required error={errors.email} hint="Formato: nombre@dominio.com">
          <input
            id="persona-email"
            type="email"
            inputMode="email"
            className={inputClass}
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            autoComplete="email"
            required
            {...errorProps('email')}
          />
        </Field>
        <Field id="persona-phone" label="Teléfono principal" error={errors.phone} hint="Formato: +58 412-555-0198">
          <input
            id="persona-phone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={form.phone}
            onChange={(event) => onChange('phone', event.target.value)}
            autoComplete="tel"
            {...errorProps('phone')}
          />
        </Field>
      </div>
    </Card>
  )
}
