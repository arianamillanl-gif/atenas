'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BadgeCheck, ChevronRight, Search } from 'lucide-react'
import { Sidebar, Topbar } from '../personas/Shell'
import { VERIFIED_SALES, fmt, type VerifiedSale } from './data'

const STATUS_STYLE: Record<VerifiedSale['status'], string> = {
  'Pendiente Condiciones': 'border-amber-200 bg-amber-50 text-amber-700',
  'En aprobación': 'border-sky-200 bg-sky-50 text-sky-700',
  Aprobado: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const FILTERS = ['Todas', 'Pendiente Condiciones', 'En aprobación', 'Aprobado'] as const

export default function VentasListModule() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('Todas')
  const [query, setQuery] = useState('')
  const rows = useMemo(() => VERIFIED_SALES.filter((s) => (filter === 'Todas' || s.status === filter) && `${s.client} ${s.id} ${s.rep}`.toLowerCase().includes(query.toLowerCase())), [filter, query])

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} active="ventas" />
      <section className="content flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900">
        <Topbar section="Ventas" />
        <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1.5 text-xs text-slate-400"><span>Ventas</span><ChevronRight size={12} aria-hidden="true" /><span aria-current="page" className="font-semibold text-slate-700">Ventas verificadas</span></nav>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1E2B58]"><BadgeCheck size={14} />Operación comercial</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 md:text-[28px]">Ventas verificadas</h1>
            <p className="mt-1 text-[13px] text-slate-500">Ventas importadas de Clientify y validadas por Tesorería, pendientes de condiciones o en flujo de aprobación.</p>
          </div>

          <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {FILTERS.map((f) => (
                  <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs transition ${filter === f ? 'bg-[#1E2B58]/[0.07] font-semibold text-[#1E2B58]' : 'font-medium text-slate-500 hover:bg-slate-50'}`}>
                    {f} <span className="ml-1 tabular-nums text-slate-400">{f === 'Todas' ? VERIFIED_SALES.length : VERIFIED_SALES.filter((s) => s.status === f).length}</span>
                  </button>
                ))}
              </div>
              <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200/80 px-3 md:w-72">
                <Search size={14} className="text-slate-400" aria-hidden="true" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar ventas" placeholder="Buscar cliente, ID o responsable" className="w-full bg-transparent text-[13px] outline-none placeholder:text-slate-400" />
              </label>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-[13px]">
                <thead className="bg-slate-50/70 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>{['ID venta', 'Cliente', 'Unidad de negocio', 'Responsable', 'Fecha económica', 'Importe', 'Estado', ''].map((h, i) => <th key={h || i} scope="col" className={`px-4 py-3 font-medium ${h === 'Importe' ? 'text-right' : ''}`}>{h || <span className="sr-only">Acción</span>}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((sale) => (
                    <tr key={sale.id} onClick={() => router.push(`/ventas-verificadas/${sale.id}`)} className="cursor-pointer transition hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{sale.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">{sale.client}</td>
                      <td className="px-4 py-3.5 text-slate-600">{sale.unit}</td>
                      <td className="px-4 py-3.5 text-slate-600">{sale.rep}</td>
                      <td className="px-4 py-3.5 tabular-nums text-slate-600">{sale.date}</td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-slate-900">{fmt(sale.amount)} <span className="text-[11px] font-medium text-slate-400">USD</span></td>
                      <td className="px-4 py-3.5"><span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[sale.status]}`}>{sale.status}</span></td>
                      <td className="px-4 py-3.5 text-right"><Link href={`/ventas-verificadas/${sale.id}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E2B58] hover:underline">Ver detalle<ChevronRight size={13} /></Link></td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400">No se encontraron ventas con estos filtros.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
