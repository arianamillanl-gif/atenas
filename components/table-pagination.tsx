import { ChevronLeft, ChevronRight } from 'lucide-react'

const pageSizeOptions = [5, 10, 25, 50]

const squareClass = 'flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30 focus-visible:ring-offset-1'
const arrowClass = `${squareClass} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white`
const activePageClass = 'border-transparent bg-[#1E2B58] text-white shadow-sm'
const inactivePageClass = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

type TablePaginationProps = {
  page: number
  totalPages: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function getPageNumbers(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((value) => value >= 1 && value <= totalPages))
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((value, index) => (index > 0 && value - sorted[index - 1] > 1 ? ['gap' as const, value] : [value]))
}

export function TablePagination({ page, totalPages, pageSize, onPageChange, onPageSizeChange }: TablePaginationProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label>
        <span className="sr-only">Filas por página</span>
        <select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30"
        >
          {pageSizeOptions.map((size) => <option key={size} value={size}>{size} por página</option>)}
        </select>
      </label>

      <nav aria-label="Paginación de registros">
        <ul className="flex items-center gap-2">
          <li>
            <button type="button" aria-label="Página anterior" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={arrowClass}>
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
          </li>
          {getPageNumbers(page, totalPages).map((value, index) => value === 'gap'
            ? <li key={`gap-${index}`} aria-hidden="true" className="flex h-10 w-6 items-center justify-center text-sm text-slate-400">…</li>
            : (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => onPageChange(value)}
                  aria-label={`Página ${value}`}
                  aria-current={value === page ? 'page' : undefined}
                  className={`${squareClass} tabular-nums ${value === page ? activePageClass : inactivePageClass}`}
                >
                  {value}
                </button>
              </li>
            ))}
          <li>
            <button type="button" aria-label="Página siguiente" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={arrowClass}>
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
