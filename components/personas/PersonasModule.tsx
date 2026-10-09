'use client'

import { useCallback, useRef, useState } from 'react'
import { AlertTriangle, BadgeCheck, Check, FileSearch, Lock, PencilLine, RefreshCw, UserMinus, UserPlus } from 'lucide-react'

import TraceabilityDrawer, { type AuditEvent } from '../TraceabilityDrawer'
import ConfirmDialog from './ConfirmDialog'
import EmploymentStatusCard from './EmploymentStatusCard'
import IdentityCard from './IdentityCard'
import RolesCard from './RolesCard'
import { Sidebar, Topbar } from './Shell'
import UnitsCard from './UnitsCard'
import {
  DRASTIC_STATUSES,
  PERSONA_ID,
  TODAY,
  initialForm,
  initialRoles,
  type FormErrors,
  type PersonaForm,
  type RoleRecord,
} from './data'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s()-]{10,18}$/

const initialEvents: AuditEvent[] = [
  { date: '15 ene 2026', time: '09:12', user: 'María González', role: 'Administradora', action: 'Asignación de rol', detail: 'Rol "Auditor(a) líder" asignado en Equipo Cierre Fiscal 2026 como condición principal.', reference: 'AUD-2026-0115-0031', icon: BadgeCheck, tone: 'primary' },
  { date: '01 jun 2025', time: '14:40', user: 'Luis Herrera', role: 'Analista de talento', action: 'Adscripción secundaria', detail: 'Adscripción válida a Auditoría Externa registrada con vigencia abierta.', reference: 'AUD-2025-0601-0087', icon: RefreshCw, tone: 'accent' },
  { date: '01 feb 2023', time: '08:05', user: 'Sistema ATENAS', role: 'Proceso automático', action: 'Alta de persona', detail: 'Identidad V-12345678 importada desde el registro de origen con estado Activo.', reference: 'AUD-2023-0201-0004', icon: UserPlus, tone: 'neutral' },
]

function timestamp() {
  const now = new Date()
  return {
    date: now.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
    time: now.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }),
    reference: `AUD-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getTime()).slice(-4)}`,
  }
}

export default function PersonasModule() {
  const [collapsed, setCollapsed] = useState(false)
  const [form, setForm] = useState<PersonaForm>(initialForm)
  const [savedStatus, setSavedStatus] = useState(initialForm.status)
  const [errors, setErrors] = useState<FormErrors>({})
  const [secondaryUnits, setSecondaryUnits] = useState(['Auditoría Externa', 'Talento Humano'])
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles)
  const [events, setEvents] = useState(initialEvents)
  const [bajaIntent, setBajaIntent] = useState(false)
  const [dialog, setDialog] = useState<'cancel' | 'status' | null>(null)
  const [traceOpen, setTraceOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef<number | undefined>(undefined)
  const principalRole = roles.find((role) => role.principal && !role.end)

  const closeTrace = useCallback(() => setTraceOpen(false), [])
  const closeDialog = useCallback(() => setDialog(null), [])

  const statusChanged = form.status !== savedStatus
  const hasActiveAssignments = roles.some((role) => !role.end)
  const showWarning = hasActiveAssignments && (bajaIntent || DRASTIC_STATUSES.includes(form.status))

  const flash = (message: string) => {
    window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
  }

  const logEvent = (event: Omit<AuditEvent, 'date' | 'time' | 'reference'>) =>
    setEvents((current) => [{ ...timestamp(), ...event }, ...current])

  const update = <K extends keyof PersonaForm>(key: K, value: PersonaForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const focusField = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element?.focus({ preventScroll: true })
  }

  const validate = () => {
    const next: FormErrors = {}
    if (!form.firstNames.trim()) next.firstNames = 'Ingresa al menos un nombre.'
    if (!form.lastNames.trim()) next.lastNames = 'Ingresa al menos un apellido.'
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = 'Correo con formato inválido.'
    if (form.phone.trim() && !PHONE_PATTERN.test(form.phone.trim())) next.phone = 'Teléfono con formato inválido.'
    if (form.validTo && form.validTo < form.validFrom) next.validTo = 'La fecha de fin no puede ser anterior al inicio.'
    if (statusChanged && form.reason.trim().length < 10) next.reason = 'Justifica el cambio de estado (mínimo 10 caracteres).'
    setErrors(next)
    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) focusField(`persona-${firstInvalid}`)
    return !firstInvalid
  }

  const save = () => {
    if (!validate()) {
      flash('Revisa los campos marcados antes de guardar')
      return
    }
    logEvent({ user: 'María González', role: 'Administradora', action: 'Actualización de ficha', detail: `Datos de identidad, contacto y adscripción guardados. Unidad principal: ${form.mainUnit}.`, icon: PencilLine, tone: 'primary' })
    setSavedStatus(form.status)
    flash('Persona guardada correctamente')
  }

  const requestStatusChange = () => {
    if (!DRASTIC_STATUSES.includes(form.status)) {
      update('status', 'Baja definitiva')
      setBajaIntent(true)
      focusField('persona-status')
      return
    }
    if (!validate()) return
    setDialog('status')
  }

  const confirmStatusChange = () => {
    const isBaja = form.status === 'Baja definitiva'
    if (isBaja) {
      setRoles((current) => current.map((role) => (role.end ? role : { ...role, end: TODAY })))
      setForm((current) => ({ ...current, validTo: current.validTo || TODAY }))
    }
    logEvent({ user: 'María González', role: 'Administradora', action: isBaja ? 'Registro de baja' : 'Cambio de estado laboral', detail: `Estado cambiado de "${savedStatus}" a "${form.status}". Motivo: ${form.reason.trim()}`, icon: UserMinus, tone: 'accent' })
    setSavedStatus(form.status)
    setBajaIntent(false)
    setDialog(null)
    flash(isBaja ? 'Baja registrada · roles vigentes cerrados' : `Estado actualizado a ${form.status}`)
  }

  const discard = () => {
    setForm({ ...initialForm, status: savedStatus })
    setErrors({})
    setBajaIntent(false)
    setDialog(null)
    flash('Cambios descartados')
  }

  const assignRole = (role: Omit<RoleRecord, 'id'>) => {
    setRoles((current) => [
      { ...role, id: `r-${Date.now()}` },
      ...current.map((item) => (role.principal ? { ...item, principal: false } : item)),
    ])
    logEvent({ user: 'María González', role: 'Administradora', action: 'Asignación de rol', detail: `Rol "${role.role}" asignado en ${role.structure}${role.principal ? ' como condición principal' : ''}.`, icon: BadgeCheck, tone: 'primary' })
    flash(`Rol "${role.role}" asignado en ${role.structure}`)
  }

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <section className="content flex min-h-screen flex-col">
        <Topbar />

        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-2">
            <nav aria-label="Ruta de navegación" className="flex items-center gap-2 text-sm text-slate-500">
              <a href="#talento" className="transition-colors hover:text-primary">Gestión de talento</a>
              <span className="text-slate-400" aria-hidden="true">›</span>
              <span className="font-medium text-slate-700" aria-current="page">Personas</span>
            </nav>
            <h1 className="m-0 font-sans text-3xl font-bold text-[#2A4B93]">Personas</h1>
            <p className="m-0 text-sm leading-relaxed text-slate-500 text-pretty">
              Mantener identidad, contacto, estado laboral y relaciones organizacionales históricas.
            </p>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between md:px-8">
            <div className="flex min-w-0 items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground"
              >
                {(form.firstNames.trim()[0] ?? '').toUpperCase()}
                {(form.lastNames.trim()[0] ?? '').toUpperCase()}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="m-0 truncate text-xl font-semibold text-slate-900">
                    {form.firstNames} {form.lastNames}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${DRASTIC_STATUSES.includes(savedStatus) ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${DRASTIC_STATUSES.includes(savedStatus) ? 'bg-slate-400' : 'bg-emerald-500'}`}
                    />
                    {savedStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
                  <span>{principalRole ? `${principalRole.role} · ${form.mainUnit}` : form.mainUnit}</span>
                  <span aria-hidden="true" className="text-slate-300">|</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                    <Lock size={12} aria-hidden="true" />
                    ID {PERSONA_ID}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={traceOpen}
                onClick={() => setTraceOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary/40 hover:text-primary"
              >
                <FileSearch size={15} aria-hidden="true" />
                Ver trazabilidad
              </button>
            </div>
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <IdentityCard form={form} errors={errors} onChange={update} />
          </div>

          <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <EmploymentStatusCard
              form={form}
              errors={errors}
              statusChanged={statusChanged}
              showWarning={showWarning}
              onChange={update}
              onViewHistory={() => setTraceOpen(true)}
            />
          </div>

          <div className="flex flex-col gap-10 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            <UnitsCard
              mainUnit={form.mainUnit}
              secondaryUnits={secondaryUnits}
              onMainUnitChange={(unit) => {
                update('mainUnit', unit)
                setSecondaryUnits((current) => current.filter((item) => item !== unit))
              }}
              onAddSecondary={(unit) => {
                setSecondaryUnits((current) => [...current, unit])
                flash(`Adscripción a ${unit} añadida`)
              }}
              onRemoveSecondary={(unit) => setSecondaryUnits((current) => current.filter((item) => item !== unit))}
            />
            <RolesCard roles={roles} onAssign={assignRole} />
          </div>

          <footer className="flex flex-col justify-between gap-1 text-[11px] text-slate-400 sm:flex-row">
            <span>ATENAS · Gestión de talento · Lo-Fi · v0.1</span>
            <span className="font-mono">master_persona</span>
          </footer>
        </div>

        <div className="sticky bottom-0 z-30 flex flex-col gap-3 border-t border-slate-100 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:px-8">
          <button
            type="button"
            onClick={() => setDialog('cancel')}
            className="order-last rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:order-none"
          >
            Cancelar
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={requestStatusChange}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900 bg-white px-6 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              <UserMinus size={15} aria-hidden="true" />
              Registrar baja / Cambio estado
            </button>
            <button
              type="button"
              onClick={save}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-[#1E366B] active:bg-[#162850]"
            >
              <Check size={15} aria-hidden="true" />
              Guardar Persona
            </button>
          </div>
        </div>
      </section>

      {traceOpen && <TraceabilityDrawer recordId={`ID: ${PERSONA_ID}`} events={events} onClose={closeTrace} />}

      {dialog === 'cancel' && (
        <ConfirmDialog
          icon={AlertTriangle}
          title="¿Descartar cambios no guardados?"
          description="Los cambios en identidad, contacto y estado laboral se perderán. El historial de roles y adscripciones permanece intacto."
          confirmLabel="Descartar cambios"
          cancelLabel="Seguir editando"
          onConfirm={discard}
          onCancel={closeDialog}
        />
      )}

      {dialog === 'status' && (
        <ConfirmDialog
          icon={UserMinus}
          title={form.status === 'Baja definitiva' ? '¿Registrar baja definitiva?' : `¿Cambiar estado a ${form.status}?`}
          description={
            <p className="m-0">
              El estado pasará de <strong className="text-slate-700">{savedStatus}</strong> a <strong className="text-slate-700">{form.status}</strong>.
              {form.status === 'Baja definitiva' && ` Se cerrarán ${roles.filter((role) => !role.end).length} roles vigentes con fecha de hoy.`} La operación quedará registrada en la trazabilidad.
            </p>
          }
          confirmLabel="Confirmar operación"
          onConfirm={confirmStatusChange}
          onCancel={closeDialog}
        />
      )}

      {notice && (
        <div role="status" className="client-toast">
          <Check size={16} aria-hidden="true" />
          {notice}
        </div>
      )}
    </main>
  )
}
