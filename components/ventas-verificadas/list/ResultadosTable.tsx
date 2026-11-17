'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Eye, History, MoreHorizontal } from 'lucide-react'
import { TablePagination } from '@/components/table-pagination'
import { fmt } from '../data'
import type { ConditionStatus, CxcStatus, ListSale } from '../list-data'

export type TabKey = 'Todos' | ConditionStatus | 'Observada' | 'Retenidas'

const CONDITION_STYLE: Record<ConditionStatus, string> = {
  'Sin Condiciones': 'border-slate-200 bg-slate-50 text-slate-600',
  'En Borrador': 'border-amber-200 bg-amber-50 text-amber-700',
  'Por aprobar': 'border-sky-200 bg-sky-50 text-sky-700',
  Vigente: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Rechazada: 'border-rose-200 bg-rose-50 text-rose-700',
}

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
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, totalPages)
  const visible = rows.slice((current - 1) * pageSize, current * pageSize)
  const open = (ref: string) => router.push(`/ventas-verificadas/${ref}`)

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
                        {sale.services.length > 1 && <span className="rounded-full bg-[#1E2B58]/[0.07] px-2 py-0.5 text-[11px] font-semibold text-[#1E2B58] tabular-nums">+{sale.services.length - 1} {sale.services.length === 2 ? 'servicio' : 'servicios'}</span>}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 tabular-nums">{sale.date}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-[#1E2B58] tabular-nums">${fmt(sale.amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{sale.rep}</td>
                  <td className="px-4 py-3.5"><span className="inline-flex whitespace-nowrap rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">Verificado</span></td>
                  <td className="px-4 py-3.5"><span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${CONDITION_STYLE[sale.condition]}`}>{sale.condition}</span></td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-600"><span className="flex items-center gap-2"><span className={`size-1.5 rounded-full ${CXC_STYLE[sale.cxc]}`} aria-hidden="true" />{sale.cxc}</span></td>
                  <td className="sticky right-0 bg-white px-4 py-3 shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.2)] transition group-hover:bg-slate-50" onClick={(e) => e.stopPropagation()}>
                    <div className="relative flex items-center justify-end gap-1.5">
                      <button type="button" onClick={() => open(sale.ref)} className={`h-8 whitespace-nowrap rounded-full px-4 text-xs font-semibold transition ${action.primary ? 'bg-[#1E2B58] text-white hover:bg-[#16203F]' : 'border border-slate-200 bg-white text-[#1E2B58] hover:bg-slate-50'}`}>{action.label}<span className="sr-only"> venta {sale.ref}</span></button>
                      <button type="button" aria-label={`Más acciones para ${sale.ref}`} aria-haspopup="menu" aria-expanded={menuFor === sale.ref} onClick={() => setMenuFor((v) => (v === sale.ref ? null : sale.ref))} className="grid size-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><MoreHorizontal size={16} /></button>
                      {menuFor === sale.ref && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} aria-hidden="true" />
                          <div role="menu" className="absolute right-0 top-9 z-20 flex w-48 flex-col rounded-xl border border-slate-200 bg-white p-1 text-[13px] shadow-lg" onKeyDown={(e) => { if (e.key === 'Escape') setMenuFor(null) }}>
                            <button type="button" role="menuitem" autoFocus onClick={() => open(sale.ref)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50"><Eye size={14} />Ver detalle</button>
                            <button type="button" role="menuitem" onClick={() => open(sale.ref)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50"><History size={14} />Consultar historial</button>
                            <button type="button" role="menuitem" onClick={() => { navigator.clipboard?.writeText(sale.ref); setMenuFor(null) }} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-50"><Copy size={14} />Copiar referencia</button>
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
    </section>
  )
}
