'use client'

import { useEffect, useRef } from 'react'
import { CalendarDays, Download, Filter, RefreshCw, Search } from 'lucide-react'

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const years = ['2026', '2025', '2024']

const secondaryButtonClass =
  'flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30'
const periodSelectClass =
  'cursor-pointer appearance-none rounded-md bg-transparent px-1 text-xs font-medium text-slate-700 outline-none transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500/30'

type CashflowToolbarProps = {
  recordCount: number
  search: string
  onSearchChange: (value: string) => void
  activeFilterCount: number
  onOpenFilters: () => void
  onDownload: () => void
  onRefresh: () => void
}

export function CashflowToolbar({ recordCount, search, onSearchChange, activeFilterCount, onOpenFilters, onDownload, onRefresh }: CashflowToolbarProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const hasActiveFilters = activeFilterCount > 0

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
        searchRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div className="border-b border-slate-100 p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <h2 id="cashflow-heading" className="whitespace-nowrap text-lg font-bold text-slate-900">Flujo de Efectivo</h2>
          <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium tabular-nums text-slate-600">{recordCount} registros</span>
        </div>
        <fieldset className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
          <legend className="sr-only">Período</legend>
          <CalendarDays aria-hidden="true" className="size-3.5 text-slate-400" />
          <label>
            <span className="sr-only">Mes</span>
            <select className={periodSelectClass} defaultValue="Noviembre">
              {months.map((month) => <option key={month}>{month}</option>)}
            </select>
          </label>
          <span aria-hidden="true" className="h-3.5 w-px bg-slate-300" />
          <label>
            <span className="sr-only">Año</span>
            <select className={`${periodSelectClass} tabular-nums`} defaultValue="2026">
              {years.map((year) => <option key={year}>{year}</option>)}
            </select>
          </label>
        </fieldset>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex max-w-lg flex-1 cursor-text items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <span className="sr-only">Buscar por descripción o documento CxC</span>
          <Search aria-hidden="true" className="size-4 shrink-0 text-slate-400" />
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Escape' && search) onSearchChange('') }}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
            placeholder="Buscar por descripción o documento CxC..."
          />
          <kbd aria-hidden="true" className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500">⌘K</kbd>
        </label>

        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <button
            type="button"
            onClick={onOpenFilters}
            aria-label={hasActiveFilters ? `Filtrar, ${activeFilterCount} columnas ocultas` : 'Filtrar'}
            className={hasActiveFilters
              ? 'flex shrink-0 items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30'
              : secondaryButtonClass}
          >
            <Filter aria-hidden="true" className={`size-4 ${hasActiveFilters ? 'text-indigo-600' : 'text-slate-500'}`} />
            Filtrar
            {hasActiveFilters && (
              <span aria-hidden="true" className="inline-flex min-w-5 items-center justify-center gap-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums leading-none text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button type="button" onClick={onDownload} className={secondaryButtonClass}>
            <Download aria-hidden="true" className="size-4 text-slate-500" />
            Descargar
          </button>
          <button type="button" onClick={onRefresh} className={secondaryButtonClass}>
            <RefreshCw aria-hidden="true" className="size-4 text-slate-500" />
            Refrescar
          </button>
        </div>
      </div>
    </div>
  )
}
