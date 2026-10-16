import { FileSearch, Info } from 'lucide-react'

import { formatDate, isActive, portfolioName, type Assignment, type CanonicalClient } from './data'

export default function AssignmentHero({
  client,
  assignment,
  onTrace,
}: {
  client?: CanonicalClient
  assignment?: Assignment
  onTrace: () => void
}) {
  if (!client) {
    return (
      <div role="status" className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs text-slate-500">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-[#2A4B93] shadow-2xs">
          <Info size={15} aria-hidden="true" />
        </span>
        <p className="m-0 leading-relaxed text-pretty">
          Seleccione o busque un cliente canónico para consultar su historial o registrar una nueva asignación de cartera.
        </p>
      </div>
    )
  }

  const active = assignment ? isActive(assignment) : false

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2A4B93] text-sm font-semibold text-white">
          {client.initials}
        </span>
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="m-0 truncate text-lg font-bold text-slate-900">{client.name}</h2>
            {assignment && active ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                Activa · {assignment.type}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-slate-400" />
                Sin asignación vigente
              </span>
            )}
          </div>
          {assignment ? (
            <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
              <span className="font-mono">{client.rif}</span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span className="font-medium text-slate-700">{portfolioName(assignment.portfolioId)}</span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span>ID Asignación: <span className="font-mono">{assignment.id}</span></span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span>Registrado: {formatDate(assignment.createdAt)} por {assignment.author}</span>
            </p>
          ) : (
            <p className="m-0 text-xs text-slate-500">
              <span className="font-mono">{client.rif}</span> · Este cliente aún no tiene asignaciones registradas.
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onTrace}
        aria-haspopup="dialog"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#2A4B93]/40 hover:text-[#2A4B93]"
      >
        <FileSearch size={14} aria-hidden="true" />
        Ver trazabilidad
      </button>
    </div>
  )
}
