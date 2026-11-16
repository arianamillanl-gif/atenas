'use client'

import { useState } from 'react'
import { Calculator, Info, RefreshCw } from 'lucide-react'
import { SERVICE_CATALOG, fmt, parseAmount, type ServiceLine } from './data'
import { SectionCard } from './fields'

type Installment = { date: string; items: { service: string; cuota: string }[]; base: number; iva: number; retencion: number; total: number }

const STEP_MONTHS = { Única: 0, Mensual: 1, Trimestral: 3, Semestral: 6, Anual: 12 } as const

function addMonths(iso: string, months: number) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + months, d))
  return date.toISOString().slice(0, 10)
}

const toDisplay = (iso: string) => iso.split('-').reverse().join('/')

export function buildSchedule(lines: ServiceLine[]): Installment[] {
  const byDate = new Map<string, Installment>()
  for (const line of lines) {
    const amount = parseAmount(line.monto)
    if (line.valor === 'Abonado' || !line.serviceId || amount <= 0) continue
    const name = SERVICE_CATALOG.find((s) => s.id === line.serviceId)?.name ?? line.serviceId
    const n = line.pago.modalidad === 'Contado' ? 1 : line.pago.cuotas
    const step = STEP_MONTHS[line.pago.periodicidad] || 1
    const share = Math.floor((amount / n) * 100) / 100
    for (let i = 0; i < n; i++) {
      const base = i === n - 1 ? Math.round((amount - share * (n - 1)) * 100) / 100 : share
      const iva = line.pago.iva === 'Gravado 16%' ? base * 0.16 : 0
      const retencion = { 'Sin retención': 0, 'IVA 75%': iva * 0.75, 'IVA 100%': iva, 'ISLR 2%': base * 0.02 }[line.pago.retencion]
      const date = addMonths(line.pago.inicio || '2026-11-15', i * step)
      const row = byDate.get(date) ?? { date, items: [], base: 0, iva: 0, retencion: 0, total: 0 }
      row.items.push({ service: name, cuota: `${i + 1}/${n}` })
      row.base += base
      row.iva += iva
      row.retencion += retencion
      row.total += base + iva - retencion
      byDate.set(date, row)
    }
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

export default function VistaPreviaCxC({ lines }: { lines: ServiceLine[] }) {
  const signature = JSON.stringify(lines.map(({ expanded, ...rest }) => rest))
  const [snapshot, setSnapshot] = useState<{ signature: string; rows: Installment[] } | null>(null)
  const stale = snapshot && snapshot.signature !== signature
  const excluded = lines.filter((l) => l.valor === 'Abonado').length
  const totals = snapshot?.rows.reduce((acc, r) => ({ base: acc.base + r.base, iva: acc.iva + r.iva, retencion: acc.retencion + r.retencion, total: acc.total + r.total }), { base: 0, iva: 0, retencion: 0, total: 0 })

  return (
    <SectionCard
      title="Vista previa de CxC"
      description="Cronograma consolidado de cuentas por cobrar generado a partir de los servicios con valor Vendido."
      action={<button type="button" onClick={() => setSnapshot({ signature, rows: buildSchedule(lines) })} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#1E2B58] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#16203F]">{snapshot ? <RefreshCw size={14} /> : <Calculator size={14} />}{snapshot ? 'Recalcular' : 'Calcular vista previa'}</button>}
    >
      {!snapshot ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center">
          <Calculator size={22} className="text-slate-300" />
          <p className="text-[13px] font-medium text-slate-600">Aún no se ha calculado la vista previa</p>
          <p className="max-w-md text-xs leading-relaxed text-slate-400">Pulsa “Calcular vista previa” para consolidar las cuotas de todos los servicios vendidos. Las líneas Abonado ($0) se excluyen automáticamente.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {stale && <p role="status" className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-700"><Info size={14} />El desglose cambió desde el último cálculo. Recalcula para actualizar el cronograma.</p>}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Vencimiento</th>
                  <th scope="col" className="px-4 py-3 font-medium">Servicios incluidos</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Base</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">IVA</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Retención</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Neto a cobrar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.rows.map((row) => (
                  <tr key={row.date} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800 tabular-nums">{toDisplay(row.date)}</td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1.5">{row.items.map((item) => <span key={item.service + item.cuota} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{item.service}<span className="font-semibold text-slate-500 tabular-nums">{item.cuota}</span></span>)}</div></td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{fmt(row.base)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">{fmt(row.iva)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-600">{row.retencion ? `−${fmt(row.retencion)}` : '—'}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">{fmt(row.total)}</td>
                  </tr>
                ))}
                {snapshot.rows.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400">No hay servicios vendidos con monto para generar CxC.</td></tr>}
              </tbody>
              {totals && snapshot.rows.length > 0 && (
                <tfoot className="border-t border-slate-200 bg-[#1E2B58]/[0.03] text-[13px] font-semibold text-slate-900">
                  <tr>
                    <td className="px-4 py-3" colSpan={2}>Total consolidado · <span className="tabular-nums">{snapshot.rows.length}</span> vencimientos</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.base)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(totals.iva)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-rose-600">−{fmt(totals.retencion)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-[#1E2B58]">{fmt(totals.total)} USD</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {excluded > 0 && <p className="text-[11px] text-slate-400"><span className="tabular-nums">{excluded}</span> línea(s) Abonado ($0) excluidas del cronograma.</p>}
        </div>
      )}
    </SectionCard>
  )
}
