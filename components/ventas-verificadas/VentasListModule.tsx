'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, RefreshCw, ShieldCheck } from 'lucide-react'
import { Sidebar, Topbar } from '../personas/Shell'
import { LIST_SALES, type ListSale } from './list-data'
import KpiGrid from './list/KpiGrid'
import FiltrosAvanzados, { EMPTY_FILTERS, type Filters } from './list/FiltrosAvanzados'
import ResultadosTable, { type TabKey } from './list/ResultadosTable'

function matches(sale: ListSale, f: Filters) {
  return (!f.cliente || sale.client === f.cliente)
    && (!f.ref || sale.ref.includes(f.ref.trim()))
    && (!f.servicio || sale.services.includes(f.servicio))
    && (!f.responsable || sale.rep === f.responsable)
    && (!f.desde || sale.isoDate >= f.desde)
    && (!f.hasta || sale.isoDate <= f.hasta)
    && (!f.condicion || sale.condition === f.condicion)
    && (!f.integracion || sale.integration === f.integracion)
    && (!f.cxc || sale.cxc === f.cxc)
}

export default function VentasListModule() {
  const [collapsed, setCollapsed] = useState(false)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [tab, setTab] = useState<TabKey>('Todos')
  const [refreshing, setRefreshing] = useState(false)
  const [tableKey, setTableKey] = useState(0)

  const filtered = useMemo(() => LIST_SALES.filter((s) => matches(s, filters)), [filters])
  const rows = useMemo(() => (tab === 'Todos' ? filtered : filtered.filter((s) => s.condition === tab)), [filtered, tab])
  const countOf = (c: ListSale['condition']) => filtered.filter((s) => s.condition === c).length
  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Sin Condiciones', label: 'Sin condiciones', count: countOf('Sin Condiciones') },
    { key: 'En Borrador', label: 'En borrador', count: countOf('En Borrador') },
    { key: 'Por aprobar', label: 'Por aprobar', count: countOf('Por aprobar') },
    { key: 'Vigente', label: 'Vigente', count: countOf('Vigente') },
    { key: 'Observada', label: 'Observada', count: 0 },
    { key: 'Retenidas', label: 'Retenidas', count: 0 },
  ]
  const activeCount = Object.values(filters).filter(Boolean).length

  const refresh = () => {
    setRefreshing(true)
    window.setTimeout(() => setRefreshing(false), 700)
  }

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} active="ventas" />
      <section className="content flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
        <Topbar section="Ventas" />
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-4">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Ventas</span><ChevronRight size={12} aria-hidden="true" />
              <span aria-current="page" className="font-semibold text-slate-700">Ventas verificadas</span>
            </nav>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1E2B58]"><ShieldCheck size={14} aria-hidden="true" />Control operativo / Ventas</p>
                <h1 className="mt-1.5 text-2xl font-semibold text-slate-900 text-balance md:text-[28px]">Ventas verificadas pendientes de condiciones</h1>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500 text-pretty">Supervisa el estado de las condiciones y la integración de tus ventas verificadas.</p>
              </div>
              <button type="button" onClick={refresh} disabled={refreshing} className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full border border-slate-200/80 bg-white px-5 text-[13px] font-semibold text-[#1E2B58] shadow-sm transition hover:bg-slate-50 disabled:opacity-70 md:self-auto">
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} aria-hidden="true" />{refreshing ? 'Actualizando…' : 'Actualizar'}
              </button>
            </div>
          </div>

          <KpiGrid sales={LIST_SALES} />
          <FiltrosAvanzados activeCount={activeCount} onSearch={(f) => { setFilters(f); setTableKey((k) => k + 1) }} />
          <ResultadosTable key={tableKey} rows={rows} total={LIST_SALES.length} tab={tab} tabs={tabs} onTabChange={setTab} />
        </div>
      </section>
    </main>
  )
}
