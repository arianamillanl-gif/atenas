import { clientName, formatDate, isActive, portfolioName, type Assignment } from './data'
import { SectionHeading, sectionClass } from './fields'

export type HistoryFilter = 'todos' | 'vigentes' | 'cerrados'

const typeTone: Record<Assignment['type'], string> = {
  Principal: 'bg-slate-100 text-slate-700 border border-slate-200',
  Secundaria: 'bg-[#2A4B93]/[0.06] text-[#2A4B93] border border-[#2A4B93]/20',
  Especial: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const thBase = 'py-4 text-left align-middle text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500 whitespace-nowrap'
const tdBase = 'py-4 align-middle'
const stickyAction = 'sticky right-0 z-10 bg-white shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)]'

const col = {
  client: 'min-w-[240px] px-5',
  portfolio: 'min-w-[200px] px-4',
  type: 'min-w-[130px] px-4',
  date: 'min-w-[110px] px-3',
  author: 'min-w-[160px] px-4',
  reason: 'min-w-[260px] px-4',
  action: `min-w-[140px] px-5 ${stickyAction}`,
}

const actionButtonBase =
  'inline-flex items-center justify-center px-3.5 py-1.5 text-[11px] font-semibold border rounded-full transition-all whitespace-nowrap shadow-2xs'

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

      <div className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs [scrollbar-color:#e2e8f0_transparent] [scrollbar-width:thin]">
        <table className="w-full min-w-[1200px] table-auto border-collapse text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/80">
              <th scope="col" className={`${thBase} ${col.client}`}>Cliente</th>
              <th scope="col" className={`${thBase} ${col.portfolio}`}>Cartera</th>
              <th scope="col" className={`${thBase} ${col.type}`}>Tipo</th>
              <th scope="col" className={`${thBase} ${col.date}`}>Desde</th>
              <th scope="col" className={`${thBase} ${col.date}`}>Hasta</th>
              <th scope="col" className={`${thBase} ${col.author}`}>Autor/Usuario</th>
              <th scope="col" className={`${thBase} ${col.reason}`}>Motivo de reasignación</th>
              <th scope="col" className={`${thBase} ${col.action} text-right`}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-xs text-slate-400">
                  No hay registros para este filtro.
                </td>
              </tr>
            ) : (
              visible.map((record) => {
                const active = isActive(record)
                return (
                  <tr key={record.id} className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60">
                    <td className={`${tdBase} ${col.client}`}>
                      <span className="block whitespace-nowrap text-xs font-semibold text-slate-800">{clientName(record.clientId)}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-slate-400">{record.id}</span>
                    </td>
                    <td className={`${tdBase} ${col.portfolio}`}>
                      <span className="whitespace-nowrap font-medium text-slate-700">{portfolioName(record.portfolioId)}</span>
                    </td>
                    <td className={`${tdBase} ${col.type}`}>
                      <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeTone[record.type]}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className={`${tdBase} ${col.date}`}>
                      <span className="whitespace-nowrap font-mono text-slate-600">{formatDate(record.from)}</span>
                    </td>
                    <td className={`${tdBase} ${col.date}`}>
                      {record.to ? (
                        <span className="whitespace-nowrap font-mono text-slate-600">{formatDate(record.to)}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
                          Abierta
                        </span>
                      )}
                    </td>
                    <td className={`${tdBase} ${col.author}`}>
                      <span className="block whitespace-nowrap font-medium text-slate-800">{record.author}</span>
                      <span className="mt-0.5 block whitespace-nowrap text-[11px] text-slate-400">{formatDate(record.createdAt)}</span>
                    </td>
                    <td className={`${tdBase} ${col.reason}`}>
                      <span className="font-normal leading-relaxed text-slate-600">{record.reason}</span>
                    </td>
                    <td className={`${tdBase} ${col.action} text-right`}>
                      {active ? (
                        <button
                          type="button"
                          onClick={() => onClose(record.id)}
                          className={`${actionButtonBase} border-amber-300/80 bg-amber-50/80 text-amber-800 hover:bg-amber-100`}
                        >
                          Cerrar vigencia
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onDetails(record.id)}
                          aria-haspopup="dialog"
                          className={`${actionButtonBase} border-slate-200 bg-white text-[#2A4B93] hover:bg-slate-50`}
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
