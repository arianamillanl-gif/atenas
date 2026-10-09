import { useCallback, useState } from 'react'
import { Plus, Star } from 'lucide-react'
import { Field, inputClass } from './fields'
import FormDialog from './FormDialog'
import {
  ORG_ROLES,
  ROLES,
  ROLE_CONDITIONS,
  STRUCTURES,
  TODAY,
  formatDate,
  rangesOverlap,
  type OrgRoleRecord,
  type RoleCondition,
  type RoleRecord,
} from './data'

type Props = {
  orgRoles: OrgRoleRecord[]
  memberships: RoleRecord[]
  onAssignOrgRole: (role: Omit<OrgRoleRecord, 'id'>) => void
  onAssignMembership: (membership: Omit<RoleRecord, 'id'>) => void
  onInactivateOrgRole: (id: string) => void
  onInactivateMembership: (id: string) => void
  onHistory: () => void
}

const headCell = 'px-4 py-3 font-semibold'
const bodyCell = 'px-4 py-3.5'

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

const rowActionBase =
  'inline-flex h-8 min-w-24 items-center justify-center rounded-full border px-4 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/40 focus-visible:ring-offset-1'

function RowAction({ active, label, onInactivate, onHistory }: { active: boolean; label: string; onInactivate: () => void; onHistory: () => void }) {
  return active ? (
    <button
      type="button"
      onClick={onInactivate}
      aria-label={`Inactivar ${label}`}
      className={`${rowActionBase} border-slate-300 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700`}
    >
      Inactivar
    </button>
  ) : (
    <button
      type="button"
      onClick={onHistory}
      aria-label={`Ver historial de ${label}`}
      className={`${rowActionBase} border-slate-200 bg-slate-100 text-slate-600 hover:border-[#2A4B93]/30 hover:bg-[#2A4B93]/10 hover:text-[#2A4B93]`}
    >
      Historial
    </button>
  )
}

function SectionHeader({ id, title, description, actionLabel, onAction }: { id: string; title: string; description: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <h3 id={id} className="m-0 font-sans text-lg font-bold text-slate-900">{title}</h3>
        <p className="m-0 text-pretty text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        aria-haspopup="dialog"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#2A4B93] bg-white px-5 text-sm font-semibold text-[#2A4B93] transition hover:bg-[#2A4B93] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/40 focus-visible:ring-offset-2"
      >
        <Plus size={16} aria-hidden="true" />
        {actionLabel}
      </button>
    </div>
  )
}

function TableNote({ children }: { children: string }) {
  return <p className="m-0 text-xs italic text-slate-500">{children}</p>
}

export default function RolesCard({ orgRoles, memberships, onAssignOrgRole, onAssignMembership, onInactivateOrgRole, onInactivateMembership, onHistory }: Props) {
  const [dialog, setDialog] = useState<'orgRole' | 'membership' | null>(null)
  const closeDialog = useCallback(() => setDialog(null), [])

  const [orgRole, setOrgRole] = useState(ORG_ROLES[0])
  const [condition, setCondition] = useState<RoleCondition>('Titular')
  const [orgStart, setOrgStart] = useState(TODAY)
  const [orgEnd, setOrgEnd] = useState('')

  const [structure, setStructure] = useState(STRUCTURES[3])
  const [teamRole, setTeamRole] = useState(ROLES[3])
  const [principal, setPrincipal] = useState(false)
  const [teamStart, setTeamStart] = useState(TODAY)
  const [teamEnd, setTeamEnd] = useState('')

  const draftOrgRole = { start: orgStart, end: orgEnd || null }
  const overlapping = orgRoles.find((item) => item.role === orgRole && rangesOverlap(item, draftOrgRole))
  const invalidOrgRange = Boolean(orgEnd && orgEnd < orgStart)
  const invalidTeamRange = Boolean(teamEnd && teamEnd < teamStart)

  const openOrgRole = () => {
    setOrgStart(TODAY)
    setOrgEnd('')
    setDialog('orgRole')
  }

  const openMembership = () => {
    setTeamStart(TODAY)
    setTeamEnd('')
    setPrincipal(false)
    setDialog('membership')
  }

  return (
    <div id="roles" className="flex flex-col">
      <section aria-labelledby="org-roles-title" className="flex flex-col gap-5">
        <SectionHeader
          id="org-roles-title"
          title="Roles organizacionales históricos"
          description="Cargos formales que la persona ha ocupado en la organización, con su condición y vigencia."
          actionLabel="Asignar nuevo rol"
          onAction={openOrgRole}
        />

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table aria-labelledby="org-roles-title" className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className={headCell}>Rol organizacional</th>
                <th scope="col" className={headCell}>Condición</th>
                <th scope="col" className={headCell}>Fecha inicio</th>
                <th scope="col" className={headCell}>Fecha fin</th>
                <th scope="col" className={headCell}>Estado</th>
                <th scope="col" className="w-32 px-5 py-3 font-semibold" style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {orgRoles.map((item) => {
                const active = !item.end || item.end >= TODAY
                return (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                    <td className={`${bodyCell} font-medium ${active ? 'text-slate-800' : 'text-slate-500'}`}>{item.role}</td>
                    <td className={`${bodyCell} text-slate-600`}>{item.condition}</td>
                    <td className={`${bodyCell} whitespace-nowrap font-mono text-xs text-slate-500`}>{formatDate(item.start)}</td>
                    <td className={`${bodyCell} whitespace-nowrap font-mono text-xs text-slate-500`}>{item.end ? formatDate(item.end) : 'Vigente'}</td>
                    <td className={bodyCell}><StatusBadge active={active} /></td>
                    <td className="px-5 py-3.5" style={{ textAlign: 'right' }}>
                      <RowAction active={active} label={`rol ${item.role}`} onInactivate={() => onInactivateOrgRole(item.id)} onHistory={onHistory} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <TableNote>Los roles simultáneos no deben solapar fechas · Historial inmutable</TableNote>
      </section>

      <section aria-labelledby="memberships-title" className="mt-12 flex flex-col gap-5 border-t border-slate-100 pt-8">
        <SectionHeader
          id="memberships-title"
          title="Pertenencia a estructura o equipo de trabajo"
          description="Equipos, comités y proyectos en los que participa la persona y el rol que desempeña en cada uno."
          actionLabel="Asignar a estructura / Equipo"
          onAction={openMembership}
        />

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table aria-labelledby="memberships-title" className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th scope="col" className={headCell}>Estructura / equipo</th>
                <th scope="col" className={headCell}>Rol en equipo</th>
                <th scope="col" className={headCell}>Cond. principal</th>
                <th scope="col" className={headCell}>Vigencia (inicio — fin)</th>
                <th scope="col" className={headCell}>Estado</th>
                <th scope="col" className="w-32 px-5 py-3 font-semibold" style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((item) => {
                const active = !item.end || item.end >= TODAY
                return (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                    <td className={`${bodyCell} font-medium ${active ? 'text-slate-800' : 'text-slate-500'}`}>{item.structure}</td>
                    <td className={`${bodyCell} text-slate-600`}>{item.role}</td>
                    <td className={bodyCell}>
                      {item.principal ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECB421]/20 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                          <Star size={10} aria-hidden="true" />
                          Sí
                        </span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className={`${bodyCell} whitespace-nowrap font-mono text-xs text-slate-500`}>
                      {formatDate(item.start)} — {item.end ? formatDate(item.end) : 'Vigente'}
                    </td>
                    <td className={bodyCell}><StatusBadge active={active} /></td>
                    <td className="px-5 py-3.5" style={{ textAlign: 'right' }}>
                      <RowAction active={active} label={`pertenencia a ${item.structure}`} onInactivate={() => onInactivateMembership(item.id)} onHistory={onHistory} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <TableNote>Sin opción de eliminación — historial de pertenencia a equipos es inmutable</TableNote>
      </section>

      {dialog === 'orgRole' && (
        <FormDialog
          title="Asignar nuevo rol organizacional"
          description="El registro quedará en el historial y no podrá eliminarse, solo inactivarse."
          submitLabel="Asignar rol"
          submitDisabled={!orgStart || invalidOrgRange || Boolean(overlapping)}
          onCancel={closeDialog}
          onSubmit={() => {
            onAssignOrgRole({ role: orgRole, condition, start: orgStart, end: orgEnd || null })
            closeDialog()
          }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="org-role" label="Rol organizacional" required>
              <select id="org-role" className={`${inputClass} cursor-pointer`} value={orgRole} onChange={(event) => setOrgRole(event.target.value)}>
                {ORG_ROLES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field id="org-condition" label="Condición" required>
              <select id="org-condition" className={`${inputClass} cursor-pointer`} value={condition} onChange={(event) => setCondition(event.target.value as RoleCondition)}>
                {ROLE_CONDITIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field id="org-start" label="Fecha inicio" required>
              <input id="org-start" type="date" className={inputClass} value={orgStart} onChange={(event) => setOrgStart(event.target.value)} />
            </Field>
            <Field id="org-end" label="Fecha fin" error={invalidOrgRange ? 'Debe ser posterior al inicio.' : undefined}>
              <input id="org-end" type="date" className={inputClass} value={orgEnd} min={orgStart} onChange={(event) => setOrgEnd(event.target.value)} />
            </Field>
          </div>
          {overlapping && (
            <p role="alert" className="m-0 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {`Se solapa con "${overlapping.role}" (${formatDate(overlapping.start)} — ${overlapping.end ? formatDate(overlapping.end) : 'Vigente'}). Ajusta las fechas.`}
            </p>
          )}
        </FormDialog>
      )}

      {dialog === 'membership' && (
        <FormDialog
          title="Asignar a estructura / equipo"
          description="La pertenencia quedará registrada en el historial inmutable del equipo."
          submitLabel="Asignar a equipo"
          submitDisabled={!teamStart || invalidTeamRange}
          onCancel={closeDialog}
          onSubmit={() => {
            onAssignMembership({ structure, role: teamRole, principal, start: teamStart, end: teamEnd || null })
            closeDialog()
          }}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="team-structure" label="Estructura / equipo" required>
              <select id="team-structure" className={`${inputClass} cursor-pointer`} value={structure} onChange={(event) => setStructure(event.target.value)}>
                {STRUCTURES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field id="team-role" label="Rol en equipo" required>
              <select id="team-role" className={`${inputClass} cursor-pointer`} value={teamRole} onChange={(event) => setTeamRole(event.target.value)}>
                {ROLES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field id="team-start" label="Vigencia desde" required>
              <input id="team-start" type="date" className={inputClass} value={teamStart} onChange={(event) => setTeamStart(event.target.value)} />
            </Field>
            <Field id="team-end" label="Vigencia hasta" error={invalidTeamRange ? 'Debe ser posterior al inicio.' : undefined}>
              <input id="team-end" type="date" className={inputClass} value={teamEnd} min={teamStart} onChange={(event) => setTeamEnd(event.target.value)} />
            </Field>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={principal} onChange={(event) => setPrincipal(event.target.checked)} className="size-4 cursor-pointer accent-[#2A4B93]" />
            Condición principal
          </label>
        </FormDialog>
      )}
    </div>
  )
}
