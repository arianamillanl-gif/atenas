import { useState } from 'react'
import { Plus, Star } from 'lucide-react'
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

      title="Roles y estructuras"
      description="Pertenencia a estructuras o equipos de trabajo. Los roles cerrados se conservan como historial."
      aside={<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{activeCount} vigentes</span>}
    >
      <fieldset className="m-0 flex min-w-0 flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-6">
        <legend className="float-left mb-1 w-full p-0 text-xs font-semibold uppercase tracking-wider text-slate-500">Nueva asignación</legend>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <Field id="assign-structure" label="Estructura / equipo">
            <select id="assign-structure" className={`${inputClass} cursor-pointer`} value={structure} onChange={(event) => setStructure(event.target.value)}>
              {STRUCTURES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field id="assign-role" label="Rol asignado">
            <select id="assign-role" className={`${inputClass} cursor-pointer`} value={role} onChange={(event) => setRole(event.target.value)}>
              {ROLES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </Field>
          <Field id="assign-start" label="Vigencia desde">
            <input id="assign-start" type="date" className={inputClass} value={start} onChange={(event) => setStart(event.target.value)} />
          </Field>
          <Field id="assign-end" label="Vigencia hasta">
            <input id="assign-end" type="date" className={inputClass} value={end} min={start} onChange={(event) => setEnd(event.target.value)} />
          </Field>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={principal} onChange={(event) => setPrincipal(event.target.checked)} className="size-4 cursor-pointer accent-[#2A4B93]" />
            Condición principal
          </label>
          <button
            type="button"
            onClick={assign}
            disabled={!start}
            className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2A4B93] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#223d7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} aria-hidden="true" />
            Asignar rol
          </button>
        </div>
      </fieldset>

      <div className="flex flex-col gap-4 pt-2">
        <h4 id="roles-history-title" className="m-0 text-xs font-semibold uppercase tracking-wider text-slate-500">Roles organizacionales históricos</h4>
        <div className="overflow-x-auto">
          <table aria-labelledby="roles-history-title" className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium text-slate-500">
                <th scope="col" className="py-3 pr-4 font-medium">Rol</th>
                <th scope="col" className="py-3 pr-4 font-medium">Estructura / equipo</th>
                <th scope="col" className="py-3 pr-4 font-medium">Vigencia</th>
                <th scope="col" className="py-3 text-right font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((item) => {
                const active = !item.end
                return (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-4 pr-4">
                      <span className="flex flex-wrap items-center gap-2 font-medium text-slate-800">
                        {item.role}
                        {item.principal && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECB421]/20 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            <Star size={10} aria-hidden="true" />
                            Principal
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{item.structure}</td>
                    <td className="whitespace-nowrap py-4 pr-4 font-mono text-xs text-slate-500">
                      {formatDate(item.start)} — {formatDate(item.end)}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        <span aria-hidden="true" className={`size-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {active ? 'Vigente' : 'Cerrado'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
