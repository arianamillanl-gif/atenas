import { clientName, formatDate, isActive, portfolioName, type Assignment } from './data'
import { SectionHeading, sectionClass } from './fields'

export type HistoryFilter = 'todos' | 'vigentes' | 'cerrados'

const typeTone: Record<Assignment['type'], string> = {
  Principal: 'bg-slate-100 text-slate-700',
  Secundaria: 'bg-[#2A4B93]/[0.08] text-[#2A4B93]',
  Especial: 'bg-amber-50 text-amber-700',
}

const thClass = 'px-4 py-3 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500'
const tdClass = 'px-4 py-3.5 align-middle text-xs text-slate-700'
const stickyActionClass = 'sticky right-0 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]'
const actionButtonBase =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border bg-white px-3.5 py-1 text-[11px] font-semibold shadow-2xs transition-all'

export default function HistoryTable({
  records,
  filter,
  showingAllClients,
  onFilterChange,
  onClose,
  onDetails,
}: {
  records: Assignment[]
  filter: HistoryFilter
  showingAllClients: boolean
  onFilterChange: (filter: HistoryFilter) => void
  onClose: (id: string) => void
  onDetails: (id: string) => void
}) {
  const activeCount = records.filter(isActive).length
  const counts: Record<HistoryFilter, number> = { todos: records.length, vigentes: activeCount, cerrados: records.length - activeCount }
  const visible = records.filter((record) => (filter === 'todos' ? true : filter === 'vigentes' ? isActive(record) : !isActive(record)))
  const pills: { id: HistoryFilter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'vigentes', label: 'Vigentes' },
    { id: 'cerrados', label: 'Cerrados' },
  ]

  return (
    <section aria-labelledby="history-title" className={sectionClass}>
      <SectionHeading
        id="history-title"
        title="Historial registrado de reasignaciones"
        description={showingAllClients ? 'Mostrando el historial de todos los clientes del catálogo.' : undefined}
      >
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {records.length} {records.length === 1 ? 'registro' : 'registros'}
        </span>
      </SectionHeading>

      <div role="group" aria-label="Filtrar por estado de vigencia" className="flex flex-wrap gap-2">
        {pills.map((pill) => {
          const selected = filter === pill.id
          return (
            <button
              key={pill.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onFilterChange(pill.id)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${selected ? 'bg-[#2A4B93] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {pill.label}
              <span className={`rounded-full px-1.5 text-[10px] ${selected ? 'bg-white/20' : 'bg-white text-slate-500'}`}>{counts[pill.id]}</span>
            </button>
          )
        })}
      </div>

      <div className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent overflow-x-auto rounded-2xl border border-slate-200/80 pb-2 [scrollbar-color:#e2e8f0_transparent] [scrollbar-width:thin]">
        <table className="w-full min-w-[950px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[15%]" />
            <col className="w-[15%]" />
            <col className="w-36" />
          </colgroup>
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/80">
              <th scope="col" className={thClass}>Cliente</th>
              <th scope="col" className={thClass}>Cartera</th>
              <th scope="col" className={thClass}>Tipo</th>
              <th scope="col" className={thClass}>Desde</th>
              <th scope="col" className={thClass}>Hasta</th>
              <th scope="col" className={thClass}>Autor/Usuario</th>
              <th scope="col" className={thClass}>Motivo de reasignación</th>
              <th scope="col" className={`${thClass} ${stickyActionClass} bg-white text-right`}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-10 text-center text-xs text-slate-400">
                  No hay registros para este filtro.
                </td>
              </tr>
            ) : (
              visible.map((record) => {
                const active = isActive(record)
                return (
                  <tr key={record.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                    <td className={tdClass}>
                      <span className="block truncate font-semibold text-slate-800" title={clientName(record.clientId)}>{clientName(record.clientId)}</span>
                      <span className="block truncate font-mono text-[10px] text-slate-400">{record.id}</span>
                    </td>
                    <td className={tdClass}>
                      <span className="block truncate" title={portfolioName(record.portfolioId)}>{portfolioName(record.portfolioId)}</span>
                    </td>
                    <td className={tdClass}>
                      <span className={`inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeTone[record.type]}`}>{record.type}</span>
                    </td>
                    <td className={`${tdClass} tabular-nums`}>{formatDate(record.from)}</td>
                    <td className={`${tdClass} tabular-nums`}>
                      {record.to ? (
                        formatDate(record.to)
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                          Abierta
                        </span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <span className="block truncate text-slate-700">{record.author}</span>
                      <span className="block text-[10px] text-slate-400">{formatDate(record.createdAt)}</span>
                    </td>
                    <td className={tdClass}>
                      <span className="line-clamp-2 leading-relaxed" title={record.reason}>{record.reason}</span>
                    </td>
                    <td className={`${tdClass} ${stickyActionClass} bg-white text-right`}>
                      {active ? (
                        <button
                          type="button"
                          onClick={() => onClose(record.id)}
                          className={`${actionButtonBase} border-amber-300 text-amber-800 hover:bg-amber-50`}
                        >
                          Cerrar vigencia
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDetails(record.id)}
                          aria-haspopup="dialog"
                          className={`${actionButtonBase} border-slate-200 text-[#2A4B93] hover:bg-slate-50`}
                        >
                          Detalles
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
