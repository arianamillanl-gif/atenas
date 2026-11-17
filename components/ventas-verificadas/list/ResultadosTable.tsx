'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, FileSearch, MoreHorizontal } from 'lucide-react'
import { TablePagination } from '@/components/table-pagination'
import { fmt } from '../data'
import type { ConditionStatus, CxcStatus, ListSale } from '../list-data'
import { CONDITION_STYLE } from './status'
import SaleDrawer from './SaleDrawer'

export type TabKey = 'Todos' | ConditionStatus | 'Observada' | 'Retenidas'

const CXC_STYLE: Record<CxcStatus, string> = {
  'No iniciada': 'bg-slate-300',
  'En preparación': 'bg-amber-400',
  'Lista para generar': 'bg-sky-500',
  Generada: 'bg-emerald-500',
  Bloqueada: 'bg-rose-500',
}

const ACTION: Record<ConditionStatus, { label: string; primary: boolean }> = {
  'Sin Condiciones': { label: 'Completar', primary: true },
  'En Borrador': { label: 'Continuar', primary: true },
  'Por aprobar': { label: 'Revisar', primary: false },
  Vigente: { label: 'Ver detalle', primary: false },
  Rechazada: { label: 'Revisar', primary: false },
}

type Props = {
  rows: ListSale[]
  total: number
  tab: TabKey
  tabs: { key: TabKey; label: string; count?: number }[]
  onTabChange: (tab: TabKey) => void
}

export default function ResultadosTable({ rows, total, tab, tabs, onTabChange }: Props) {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [breakdownFor, setBreakdownFor] = useState<string | null>(null)
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 })
  const toggleMenu = (ref: string, button: HTMLElement) => {
    const rect = button.getBoundingClientRect()
    setMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    setMenuFor((v) => (v === ref ? null : ref))
  }
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, totalPages)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)
  const [inspected, setInspected] = useState<ListSale | null>(null)
  const open = (ref: string) => router.push(`/ventas-verificadas/${ref}`)
  const closeDrawer = useCallback(() => setInspected(null), [])

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <header className="flex flex-col gap-3 px-5 pt-5">
        <h2 className="text-sm font-semibold text-slate-900">Resultados <span className="font-normal text-slate-400">·</span> <span className="tabular-nums">{rows.length}</span> <span className="font-normal text-slate-500">registros</span>{rows.length !== total && <span className="ml-1 text-xs font-normal text-slate-400">de <span className="tabular-nums">{total}</span></span>}</h2>
        <div role="tablist" aria-label="Estado de condiciones" className="-mb-px flex gap-6 overflow-x-auto border-b border-slate-100">
          {tabs.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => { onTabChange(t.key); setPage(1) }} className={`shrink-0 border-b-2 pb-3 text-[13px] transition ${tab === t.key ? 'border-[#1E2B58] font-semibold text-[#1E2B58]' : 'border-transparent font-medium text-slate-500 hover:text-slate-800'}`}>
              {t.label}{t.count !== undefined && <span className="ml-1 tabular-nums">({t.count})</span>}
            </button>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] text-left text-[13px]">
          <thead className="text-[11px] uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-100">
              {['Ref. venta', 'Cliente', 'Servicio / Desglose', 'Fecha econ.', 'Importe', 'Responsable', 'Estado origen', 'Estado condiciones', 'Preparación CxC'].map((h) => <th key={h} scope="col" className={`whitespace-nowrap px-4 py-3 font-medium ${h === 'Importe' ? 'text-right' : ''}`}>{h}</th>)}
              <th scope="col" className="sticky right-0 whitespace-nowrap bg-white px-4 py-3 text-right font-medium shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.2)]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((sale) => {
              const action = ACTION[sale.condition]
              return (
                <tr key={sale.ref} onClick={() => open(sale.ref)} className="group cursor-pointer transition hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#1E2B58] tabular-nums">{sale.ref}</td>
                  <td className="max-w-[220px] truncate px-4 py-3.5 font-medium text-slate-800" title={sale.client}>{sale.client}</td>
                  <td className="px-4 py-3.5">
                    {sale.services.length === 0 ? <span className="text-slate-400 italic">Sin desglosar</span> : (
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="max-w-[190px] truncate text-slate-700" title={sale.services.join(', ')}>{sale.services[0]}</span>
                        {sale.services.length > 1 && (
                          <span
                            className="relative inline-flex"
                            onMouseEnter={() => setBreakdownFor(sale.ref)}
                            onMouseLeave={() => setBreakdownFor(null)}
                            onFocus={() => setBreakdownFor(sale.ref)}
                            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setBreakdownFor(null) }}
                          >
                            <button
                              type="button"
                              aria-label={`Ver desglose de ${sale.services.length - 1} ${sale.services.length === 2 ? 'servicio' : 'servicios'} adicionales`}
                              aria-expanded={breakdownFor === sale.ref}
                              className="rounded-full bg-[#1E2B58]/[0.07] px-2 py-0.5 text-[11px] font-semibold text-[#1E2B58] tabular-nums outline-none transition hover:bg-[#1E2B58]/[0.12] focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30"
                              onClick={(event) => event.stopPropagation()}
                            >
                              +{sale.services.length - 1} {sale.services.length === 2 ? 'servicio' : 'servicios'}
                            </button>
                            <div
                              role="tooltip"
                              className={`absolute left-1/2 top-full z-50 min-w-[340px] max-w-md origin-top -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white p-[18px] text-left shadow-xl transition-[opacity,transform,visibility] duration-150 ease-out ${breakdownFor === sale.ref ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}`}
                            >
                              <p className="mb-3 border-b border-slate-100 pb-2 text-[11px] font-bold tracking-wider text-slate-400">DESGLOSE DE SERVICIOS</p>
                              <ul className="flex flex-col">
                                {sale.breakdown.map((line, index) => (
                                  <li key={`${line.name}-${index}`} className="flex items-center justify-between gap-6 py-2">
                                    <span className="min-w-0 truncate pr-2 text-sm font-medium text-slate-800">{line.name}</span>
                                    <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-900 tabular-nums">${fmt(line.amount)}</span>
                                  </li>
                                ))}
                              </ul>
                              <a
                                href={`/ventas-verificadas/${sale.ref}`}
                                onClick={(event) => event.stopPropagation()}
                                className="mt-2 flex cursor-pointer items-center justify-between border-t border-slate-100 pt-2.5 text-xs font-medium text-[#1E2B58] transition hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30"
                              >
                                <span>Ver detalle completo</span>
                                <ArrowRight size={14} aria-hidden="true" />
                              </a>
                            </div>
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 tabular-nums">{sale.date}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-[#1E2B58] tabular-nums">${fmt(sale.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{sale.rep || <span className="text-slate-400" aria-label="Sin asignar">—</span>}</td>
                  <td className="px-4 py-3.5"><span className="inline-flex whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">Verificado</span></td>
                  <td className="px-4 py-3.5"><span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${CONDITION_STYLE[sale.condition]}`}>{sale.condition}</span></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600"><span className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${CXC_STYLE[sale.cxc]}`} aria-hidden="true" />{sale.cxc}</span></td>
                  <td className={`sticky right-0 bg-white px-4 py-3 shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.2)] transition group-hover:bg-slate-50 ${menuFor === sale.ref ? 'z-30' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="relative flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => open(sale.ref)} className={`h-8 whitespace-nowrap rounded-full px-4 text-xs font-semibold transition ${action.primary ? 'bg-[#1E2B58] text-white hover:bg-[#16203F]' : 'border border-slate-200 bg-white text-[#1E2B58] hover:bg-slate-50'}`}>{action.label}<span className="sr-only"> venta {sale.ref}</span></button>
                      <button type="button" aria-label={`Más acciones para ${sale.ref}`} aria-haspopup="menu" aria-expanded={menuFor === sale.ref} onClick={(e) => toggleMenu(sale.ref, e.currentTarget)} className="grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={16} /></button>
                      {menuFor === sale.ref && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} onWheel={() => setMenuFor(null)} aria-hidden="true" />
                          <div role="menu" aria-label={`Acciones para ${sale.ref}`} style={{ top: menuPos.top, right: menuPos.right }} className="fixed z-20 flex min-w-[160px] flex-col rounded-xl border border-slate-100 bg-white py-1.5 text-[13px] shadow-lg animate-in fade-in zoom-in-95" onKeyDown={(e) => { if (e.key === 'Escape') setMenuFor(null) }}>
                            <button type="button" role="menuitem" autoFocus onClick={() => { setMenuFor(null); setInspected(sale) }} className="flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-left font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"><FileSearch size={14} className="text-slate-400" aria-hidden="true" />Consultar venta</button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {visible.length === 0 && <tr><td colSpan={10} className="px-4 py-12 text-center text-[13px] text-slate-400">No hay ventas que coincidan con los filtros seleccionados.</td></tr>}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500">Mostrando <span className="tabular-nums">{rows.length ? (current - 1) * pageSize + 1 : 0}–{Math.min(current * pageSize, rows.length)}</span> de <span className="tabular-nums">{rows.length}</span> registros</p>
        <TablePagination page={current} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
      </footer>

      {inspected && <SaleDrawer key={inspected.ref} sale={inspected} onClose={closeDrawer} onOpenDetail={() => { const ref = inspected.ref; setInspected(null); open(ref) }} />}
    </section>
  )
}
