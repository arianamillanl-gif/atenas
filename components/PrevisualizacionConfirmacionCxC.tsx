'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Bell,
  ChevronDown,
  ChevronRight,
  FileText,
  Info,
  LoaderCircle,
  RefreshCw,
  Search,
  Upload,
  X,
} from 'lucide-react'

const saleSummary = [
  ['Referencia', 'VTA-2026-00893 / CLF-99213'],
  ['Cliente', 'Corporativo Nexus'],
  ['Servicio', 'Consultoría ERP'],
  ['Fecha', '30/08/2026'],
  ['Importe', '$60,000.00 USD'],
]

const conditionSummary = [
  ['Modalidad', 'Servicio recurrente'],
  ['Frecuencia', 'Mensual'],
  ['Periodicidad de Pago', 'Mensual'],
  ['Condición de Pago', 'PAGO_PERIODICO'],
  ['Vigencia', '01/09/2026 — 31/08/2027'],
  ['Cuotas', '3'],
  ['Primer Vencimiento', '30/09/2026'],
]

const installments = [
  ['1', 'CxC 1/3 - CORPORATIVO NEXUS', '~30/09/2026', '~$20,000.00 USD'],
  ['2', 'CxC 2/3 - CORPORATIVO NEXUS', '~30/10/2026', '~$20,000.00 USD'],
  ['3', 'CxC 3/3 - CORPORATIVO NEXUS', '~30/11/2026', '~$20,000.00 USD'],
]

function ReadOnlyGroup({ title, fields, dotClassName, gridClassName }: { title: string; fields: string[][]; dotClassName: string; gridClassName: string }) {
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2A4B93]">
        <span className={`size-1.5 rounded-full ${dotClassName}`} aria-hidden="true" />
        {title}
      </h2>
      <div className={`grid gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 ${gridClassName}`}>
        {fields.map(([label, value]) => (
          <div key={label}>
            <span className="block text-[11px] font-medium uppercase text-slate-500">{label}</span>
            <span className="text-xs font-semibold text-slate-800">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type PrevisualizacionConfirmacionCxCProps = {
  onBack?: () => void
  onRefresh?: () => void
  onConfirmConditions?: () => void
  onGenerateCxC?: () => void
}

export default function PrevisualizacionConfirmacionCxC({
  onBack,
  onRefresh,
  onConfirmConditions,
  onGenerateCxC,
}: PrevisualizacionConfirmacionCxCProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const confirmConditions = () => {
    setIsConfirming(true)
    window.setTimeout(() => {
      setIsConfirming(false)
      setShowConfirmation(false)
    }, 900)
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      <div className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <span className="size-2 rounded-full bg-[#2A4B93]" aria-hidden="true" />
            Lo-Fi workspace <span className="font-normal text-slate-400">· Operaciones</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 md:flex">
            <Search className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Buscar</span>
            <input aria-label="Buscar" placeholder="Buscar" className="w-28 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" />
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">⌘K</kbd>
          </label>
          <button type="button" className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#2A4B93]" aria-label="Notificaciones">
            <Bell className="size-4" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#2A4B93]" aria-hidden="true" />
          </button>
          <span className="mx-2 h-5 w-px bg-slate-200" aria-hidden="true" />
          <button type="button" className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-slate-50" aria-label="Menú de usuario">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#2A4B93] text-xs font-bold text-white">MG</span>
            <span className="hidden text-xs font-semibold text-slate-700 sm:block">María González</span>
            <ChevronDown className="size-3.5 text-slate-400" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
            <span>Ventas</span>
            <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />
            <button type="button" onClick={onBack} className="inline-flex cursor-pointer items-center gap-1 text-slate-600 transition-colors hover:text-[#2A4B93] hover:underline">
              <ArrowLeft className="inline size-3.5 text-slate-500 transition-colors hover:text-[#2A4B93]" aria-hidden="true" />
              <span>Detalle VTA-2026-00893</span>
            </button>
            <ChevronRight className="size-3.5 text-slate-300" aria-hidden="true" />
            <span className="font-semibold text-slate-700">Previsualización de CxC</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">Previsualización y Confirmación de CxC</h1>
            <span className="rounded-full border border-[#2A4B93]/20 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2A4B93]">Modo Previsualización</span>
          </div>
        </div>

        <header className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-blue-900 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Info className="size-5 shrink-0 text-[#2A4B93]" aria-hidden="true" />
            <span>Esta es una previsualización; todavía no crea obligaciones.</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-blue-800">
            <span>Fecha: 30/08/2026 14:20</span>
            <span>Versión: V01</span>
            <span>Hash: #cxc-9982-preview</span>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm lg:p-6">
          <ReadOnlyGroup
            title="Resumen de Venta"
            fields={saleSummary}
            dotClassName="bg-[#2A4B93]"
            gridClassName="grid-cols-2 md:grid-cols-4"
          />
          <div className="my-5 border-t border-slate-100" aria-hidden="true" />
          <ReadOnlyGroup
            title="Resumen de Condiciones Comerciales"
            fields={conditionSummary}
            dotClassName="bg-[#59A5E2]"
            gridClassName="grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
          />
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-5 sm:px-6">
            <h2 className="text-base font-bold text-slate-800">Previsualización calculada</h2>
            <p className="text-xs text-slate-500">Obligaciones previstas para la confirmación de condiciones comerciales.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-collapse text-left">
              <thead className="bg-slate-100/70 text-xs font-bold uppercase text-slate-700">
                <tr>
                  {['#', 'Descripción CxC', 'Fecha de Vencimiento', 'Monto Ilustrativo', 'Estado Inicial', 'Versión'].map((heading) => (
                    <th key={heading} className={`px-5 py-3.5 ${heading === 'Versión' ? 'text-left' : ''}`}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {installments.map(([sequence, description, dueDate, amount]) => (
                  <tr key={sequence}>
                    <td className="px-5 py-4 font-semibold text-slate-500">{sequence}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{description}</td>
                    <td className="px-5 py-4">{dueDate}</td>
                    <td className="px-5 py-4 font-medium">{amount}</td>
                    <td className="px-5 py-4"><span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">PENDIENTE</span></td>
                    <td className="px-5 py-4"><span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">V01</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-5 py-3 text-center text-xs font-medium italic text-slate-500">Importes y fechas ilustrativos calculados por el servidor. No representan una regla ya aprobada.</p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Total de la Venta', '$60,000.00 USD', 'text-slate-800'],
            ['Total Previsto de CxC', '$60,000.00 USD', 'text-slate-800'],
            ['Diferencia / Residuo de Redondeo', '$0.00 USD', 'text-emerald-600'],
          ].map(([label, value, tone]) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <strong className={`mt-2 block text-xl font-bold ${tone}`}>{value}</strong>
            </article>
          ))}
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl justify-end">
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={onRefresh} className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#2A4B93] bg-[#2A4B93]/5 px-5 text-xs font-semibold text-[#2A4B93] hover:bg-[#2A4B93]/10"><RefreshCw className="size-3.5" aria-hidden="true" />Actualizar vista previa</button>
            <button type="button" onClick={() => { onConfirmConditions?.(); setShowConfirmation(true) }} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#2A4B93] px-6 text-xs font-semibold text-white shadow-md hover:bg-[#1f3870]"><Check className="size-3.5" aria-hidden="true" />Confirmar condiciones</button>
            <button type="button" onClick={onGenerateCxC} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-6 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"><CheckCircle2 className="size-3.5" aria-hidden="true" />Generar CxC</button>
          </div>
        </div>
      </footer>

      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" role="presentation">
          <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 id="confirmation-title" className="text-lg font-bold text-slate-800">Confirmar Condiciones Comerciales</h2>
                <p className="mt-1 text-xs text-slate-500">Revisa los datos antes de registrar la confirmación.</p>
              </div>
              <button type="button" onClick={() => setShowConfirmation(false)} disabled={isConfirming} className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50" aria-label="Cerrar confirmación"><X className="size-5" /></button>
            </div>
            <div className="flex flex-col gap-5 px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Venta', 'VTA-2026-00893'],
                  ['Cliente', 'Corporativo Nexus'],
                  ['Obligaciones previstas', '3'],
                  ['Versión a confirmar', 'V1'],
                  ['Importe Total', '$60,000.00 USD'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 sm:last:col-span-2">
                    <span className="block text-xs font-medium text-slate-500">{label}</span>
                    <strong className="mt-1 block text-sm font-semibold text-slate-800">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-center text-xs font-semibold text-rose-700"><FileText className="size-4 shrink-0" aria-hidden="true" />ESTA ACCIÓN QUEDARÁ AUDITADA Y NO SE PUEDE DESHACER</div>
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowConfirmation(false)} disabled={isConfirming} className="h-10 rounded-full border border-slate-300 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancelar</button>
              <button type="button" onClick={confirmConditions} disabled={isConfirming} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2A4B93] px-6 text-xs font-semibold text-white shadow-md hover:bg-[#1f3870] disabled:cursor-not-allowed disabled:opacity-50">{isConfirming && <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />}{isConfirming ? 'Loading...' : 'Confirmar condiciones'}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
