import { useState } from 'react'
import { Network, Plus, Star } from 'lucide-react'
import { Card, Field, inputClass } from './fields'
import { ROLES, STRUCTURES, TODAY, formatDate, type RoleRecord } from './data'

type Props = {
  roles: RoleRecord[]
  onAssign: (role: Omit<RoleRecord, 'id'>) => void
}

export default function RolesCard({ roles, onAssign }: Props) {
  const [structure, setStructure] = useState(STRUCTURES[3])
  const [role, setRole] = useState(ROLES[3])
  const [principal, setPrincipal] = useState(false)
  const [start, setStart] = useState(TODAY)
  const [end, setEnd] = useState('')
  const activeCount = roles.filter((item) => !item.end).length

  const assign = () => {
    onAssign({ structure, role, principal, start, end: end || null })
    setPrincipal(false)
    setEnd('')
  }

  return (
    <Card
      id="roles"
      icon={Network}
      title="Roles y estructuras"
      description="Pertenencia a estructuras o equipos de trabajo. Los roles cerrados se conservan como historial."
      aside={<span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{activeCount} vigentes</span>}
    >
      <fieldset className="m-0 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Nueva asignación</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="assign-structure" label="Estructura / equipo" showSource={false}>
            <select id="assign-structure" className={`${inputClass} cursor-pointer`} value={structure} onChange={(event) => setStructure(event.target.value)}>
              {STRUCTURES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field id="assign-role" label="Rol asignado" showSource={false}>
            <select id="assign-role" className={`${inputClass} cursor-pointer`} value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field id="assign-start" label="Vigencia desde" showSource={false}>
            <input id="assign-start" type="date" className={inputClass} value={start} onChange={(event) => setStart(event.target.value)} />
          </Field>
          <Field id="assign-end" label="Vigencia hasta" showSource={false}>
            <input id="assign-end" type="date" className={inputClass} value={end} min={start} onChange={(event) => setEnd(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={principal} onChange={(event) => setPrincipal(event.target.checked)} className="size-4 accent-primary" />
            Condición principal
          </label>
          <button
            type="button"
            onClick={assign}
            disabled={!start}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-[#1E366B] active:bg-[#162850] disabled:opacity-50"
          >
            <Plus size={15} aria-hidden="true" />
            Asignar rol
          </button>
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-xs font-semibold text-slate-700">Roles organizacionales históricos</h3>
        <ol className="m-0 flex list-none flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 p-0">
          {roles.map((item) => {
            const active = !item.end
            return (
              <li key={item.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="m-0 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-800">
                    {item.role}
                    {item.principal && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECB421]/20 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                        <Star size={10} aria-hidden="true" />
                        Principal
                      </span>
                    )}
                  </p>
                  <p className="m-0 mt-0.5 truncate text-xs text-slate-500">{item.structure}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-xs text-slate-500">{formatDate(item.start)} — {formatDate(item.end)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                    {active ? 'Vigente' : 'Cerrado'}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </Card>
  )
}
