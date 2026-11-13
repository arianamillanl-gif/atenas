import { ChevronLeft, ChevronRight } from 'lucide-react'

const pageSizeOptions = [5, 10, 25, 50]

const navButtonClass =
  'flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition-all duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'

type TablePaginationProps = {
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function getPageNumbers(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((value) => value >= 1 && value <= totalPages))
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? ['gap' as const, value] : [value]))
}

export function TablePagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: TablePaginationProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-xs text-slate-500">
        <span className="sr-only">Filas por página</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm outline-none transition-all duration-150 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/30"
        >
          {pageSizeOptions.map((size) => <option key={size} value={size}>{size} por página</option>)}
        </select>
      </label>

      <nav aria-label="Paginación de registros" className="flex items-center gap-1.5">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={navButtonClass}>
          <ChevronLeft aria-hidden="true" className="size-3.5" />
          Anterior
        </button>
        <ol className="hidden items-center gap-1 sm:flex">
          {getPageNumbers(page, totalPages).map((value, index) => value === 'gap'
            ? <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-xs text-slate-400">…</li>
            : (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => onPageChange(value)}
                  aria-label={`Página ${value}`}
                  aria-current={value === page ? 'page' : undefined}
                  className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-medium tabular-nums shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${value === page ? 'border-[#1E2B58] bg-[#1E2B58] text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  {value}
                </button>
              </li>
            ))}
        </ol>
        <span className="px-1 text-xs font-medium tabular-nums text-slate-600 sm:hidden">Página {page} de {totalPages}</span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={navButtonClass}>
          Siguiente
          <ChevronRight aria-hidden="true" className="size-3.5" />
        </button>
      </nav>
    </div>
  )
}
