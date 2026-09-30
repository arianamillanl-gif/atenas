'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, CalendarClock, CheckCircle2, Clock, Plus, Trash2 } from 'lucide-react'

type CaptureMode = 'parametrico' | 'explicito'
type Periodicity = 'unica' | 'semanal' | 'mensual' | 'trimestral' | 'semestral'
type Milestone = 'Inicial' | 'Previo a Entrega' | 'Mes Indicado' | 'Hito Documentado'

type Installment = {
  id: number
  issueDate: string
  dueDate: string
  net: string
  milestone: Milestone
  description: string
}

type CalendarioObligacionesProps = {
  contractTotal: number
  withholdingRate: number
  onBalanceChange?: (balanced: boolean) => void
  onInstallmentsCountChange?: (count: number) => void
}

const IVA_RATE = 0.16
const DEFAULT_ISSUE_DATE = '2026-09-24'
const DEFAULT_CREDIT_DAYS = 7
const DEFAULT_COUNT = 12
const DEFAULT_NET = 5000

const periodicityOptions: { value: Periodicity; label: string }[] = [
  { value: 'unica', label: 'Única' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensual', label: 'Mensual' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'semestral', label: 'Semestral' },
]

const milestoneOptions: Milestone[] = ['Inicial', 'Previo a Entrega', 'Mes Indicado', 'Hito Documentado']

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block'
const inputClassName = 'w-full h-11 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal'
const readOnlyClassName = 'w-full h-11 px-3.5 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200/90 rounded-xl flex items-center gap-2 tabular-nums'
const cellInputClassName = 'w-full min-w-0 h-9 px-2 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93]'
const gridColumns = 'grid grid-cols-[2rem_minmax(0,1.35fr)_minmax(0,1.35fr)_minmax(0,0.95fr)_minmax(0,0.75fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,0.85fr)_2rem] items-center gap-2'

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const roundCents = (value: number) => Math.round(value * 100) / 100

const formatAmount = (value: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

const parseIsoDate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

const addDays = (iso: string, days: number) => {
  const date = parseIsoDate(iso)
  date.setUTCDate(date.getUTCDate() + days)
  return toIsoDate(date)
}

const addMonths = (iso: string, months: number) => {
  const date = parseIsoDate(iso)
  date.setUTCMonth(date.getUTCMonth() + months)
  return toIsoDate(date)
}

const formatDisplayDate = (iso: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '—'
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

const buildDefaultSchedule = (): Installment[] =>
  Array.from({ length: DEFAULT_COUNT }, (_, index) => {
    const issueDate = addMonths(DEFAULT_ISSUE_DATE, index)
    return {
      id: index + 1,
      issueDate,
      dueDate: addDays(issueDate, DEFAULT_CREDIT_DAYS),
      net: String(DEFAULT_NET),
      milestone: index === 0 ? 'Inicial' : 'Mes Indicado',
      description: '',
    }
  })

export default function CalendarioObligaciones({ contractTotal, withholdingRate, onBalanceChange, onInstallmentsCountChange }: CalendarioObligacionesProps) {
  const id = useId()
  const nextId = useRef(DEFAULT_COUNT + 1)
  const [mode, setMode] = useState<CaptureMode>('parametrico')
  const [issueDate, setIssueDate] = useState(DEFAULT_ISSUE_DATE)
  const [creditDays, setCreditDays] = useState(String(DEFAULT_CREDIT_DAYS))
  const [count, setCount] = useState(String(DEFAULT_COUNT))
  const [periodicity, setPeriodicity] = useState<Periodicity>('mensual')
  const [installments, setInstallments] = useState<Installment[]>(buildDefaultSchedule)

  const effectiveCount = periodicity === 'unica' ? 1 : Math.max(0, Math.floor(toNumber(count)))
  const firstDueDate = issueDate ? addDays(issueDate, Math.max(0, Math.floor(toNumber(creditDays)))) : ''
  const amountPerObligation = effectiveCount > 0 ? roundCents(contractTotal / effectiveCount) : 0

  const computeRow = (row: Installment) => {
    const net = toNumber(row.net)
    const iva = roundCents(net * IVA_RATE)
    const withholding = roundCents(net * withholdingRate)
    return { iva, withholding, receivable: roundCents(net + iva - withholding) }
  }

  const scheduleTotal = mode === 'parametrico'
    ? roundCents(amountPerObligation * effectiveCount)
    : roundCents(installments.reduce((sum, row) => sum + computeRow(row).receivable, 0))
  const difference = roundCents(contractTotal - scheduleTotal)
  const balanced = Math.abs(difference) < 0.005

  useEffect(() => {
    onBalanceChange?.(balanced)
  }, [balanced, onBalanceChange])

  const installmentsCount = mode === 'parametrico' ? effectiveCount : installments.length

  useEffect(() => {
    onInstallmentsCountChange?.(installmentsCount)
  }, [installmentsCount, onInstallmentsCountChange])

  const updateRow = (rowId: number, patch: Partial<Installment>) =>
    setInstallments((rows) => rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))

  const addRow = () =>
    setInstallments((rows) => {
      const last = rows.at(-1)
      const nextIssue = last?.issueDate ? addMonths(last.issueDate, 1) : DEFAULT_ISSUE_DATE
      const row: Installment = {
        id: nextId.current,
        issueDate: nextIssue,
        dueDate: addDays(nextIssue, DEFAULT_CREDIT_DAYS),
        net: '',
        milestone: 'Mes Indicado',
        description: '',
      }
      nextId.current += 1
      return [...rows, row]
    })

  return (
    <section className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs" aria-labelledby={`${id}-title`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#2A4B93]/10 text-[#2A4B93]">
            <CalendarClock aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 id={`${id}-title`} className="text-lg font-bold text-slate-900">Calendario de obligaciones</h2>
            <p className="text-xs text-slate-500">Define la estructura temporal y cuotas de cobro para la generación de la CxC</p>
          </div>
        </div>
        <div role="tablist" aria-label="Modo de captura" className="inline-flex shrink-0 self-start bg-slate-100 p-1 rounded-full">
          {([['parametrico', 'Modo Paramétrico'], ['explicito', 'Cronograma Explícito']] as const).map(([value, label]) => {
            const active = mode === value
            return (
              <button
                key={value}
                type="button"
                role="tab"
                id={`${id}-tab-${value}`}
                aria-selected={active}
                aria-controls={`${id}-panel`}
                onClick={() => setMode(value)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${active ? 'bg-[#2A4B93] text-white shadow-sm' : 'text-slate-600 hover:text-[#2A4B93]'}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${mode}`}>
        {mode === 'parametrico' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80">
            <label className={labelClassName}>
              <span>Fecha de primera emisión*</span>
              <input type="date" required value={issueDate} onChange={(event) => setIssueDate(event.target.value)} className={`${inputClassName} mt-1.5`} />
            </label>
            <label className={labelClassName}>
              <span>Días de crédito / Regla</span>
              <div className="relative mt-1.5">
                <input type="number" min="0" inputMode="numeric" value={creditDays} onChange={(event) => setCreditDays(event.target.value)} className={`${inputClassName} pr-24 tabular-nums`} />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[11px] text-slate-400">días desde emisión</span>
              </div>
            </label>
            <div className={labelClassName}>
              <span id={`${id}-first-due`}>Primer vencimiento</span>
              <div className={`${readOnlyClassName} mt-1.5`} aria-labelledby={`${id}-first-due`} aria-readonly="true">
                <Clock aria-hidden="true" className="size-3.5 shrink-0 text-slate-400" />
                <span>{formatDisplayDate(firstDueDate)}</span>
              </div>
            </div>
            <label className={labelClassName}>
              <span>Cantidad de obligaciones</span>
              <input
                type="number"
                min="1"
                inputMode="numeric"
                value={periodicity === 'unica' ? '1' : count}
                disabled={periodicity === 'unica'}
                onChange={(event) => setCount(event.target.value)}
                className={`${inputClassName} mt-1.5 tabular-nums disabled:bg-slate-100 disabled:text-slate-500`}
              />
            </label>
            <label className={labelClassName}>
              <span>Periodicidad</span>
              <select value={periodicity} onChange={(event) => setPeriodicity(event.target.value as Periodicity)} className={`${inputClassName} mt-1.5`}>
                {periodicityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <div className={labelClassName}>
              <span id={`${id}-per-obligation`}>Importe por obligación</span>
              <output aria-labelledby={`${id}-per-obligation`} className={`${readOnlyClassName} mt-1.5 justify-between font-mono font-bold text-slate-800`}>
                <span>{`$ ${formatAmount(amountPerObligation)}`}</span>
                <span className="font-sans text-[11px] font-semibold text-slate-400">USD</span>
              </output>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-800">Detalle de cuotas irregulares</h3>
              <button type="button" onClick={addRow} className="inline-flex items-center gap-1 rounded-full border border-blue-200 text-[#2A4B93] hover:bg-blue-50 text-xs px-3 py-1.5 font-semibold transition-all">
                <Plus aria-hidden="true" className="size-3.5" />
                Agregar cuota
              </button>
            </div>
            <div className="w-full overflow-x-auto lg:overflow-x-hidden border border-slate-200/80 rounded-2xl bg-white">
              <div className="min-w-[1040px] lg:min-w-0" role="table" aria-label="Cronograma explícito de cuotas">
                <div role="row" className={`${gridColumns} px-3 py-2.5 bg-slate-50 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500`}>
                  <span role="columnheader">#</span>
                  <span role="columnheader">Fecha emisión</span>
                  <span role="columnheader">Fecha venc.</span>
                  <span role="columnheader">Importe neto</span>
                  <span role="columnheader" className="text-right">IVA (16%)</span>
                  <span role="columnheader" className="text-right">Retenciones</span>
                  <span role="columnheader" className="text-right">Neto CxC</span>
                  <span role="columnheader">Hito exigible</span>
                  <span role="columnheader">Descripción</span>
                  <span role="columnheader"><span className="sr-only">Acción</span></span>
                </div>
                {installments.length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-slate-500">No hay cuotas. Agrega la primera cuota del cronograma.</p>
                )}
                <ul className="divide-y divide-slate-100">
                  {installments.map((row, index) => {
                    const { iva, withholding, receivable } = computeRow(row)
                    const sequence = index + 1
                    return (
                      <li key={row.id} role="row" className={`${gridColumns} px-3 py-2`}>
                        <span role="cell" className="text-xs font-semibold text-slate-500 tabular-nums">{String(sequence).padStart(2, '0')}</span>
                        <span role="cell"><input type="date" aria-label={`Fecha de emisión cuota ${sequence}`} value={row.issueDate} onChange={(event) => updateRow(row.id, { issueDate: event.target.value })} className={cellInputClassName} /></span>
                        <span role="cell"><input type="date" aria-label={`Fecha de vencimiento cuota ${sequence}`} value={row.dueDate} min={row.issueDate || undefined} onChange={(event) => updateRow(row.id, { dueDate: event.target.value })} className={cellInputClassName} /></span>
                        <span role="cell" className="relative">
                          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-slate-400">$</span>
                          <input type="number" min="0" step="0.01" inputMode="decimal" aria-label={`Importe neto cuota ${sequence}`} value={row.net} placeholder="0,00" onChange={(event) => updateRow(row.id, { net: event.target.value })} className={`${cellInputClassName} pl-5 tabular-nums`} />
                        </span>
                        <span role="cell" className="text-right font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">{`$ ${formatAmount(iva)}`}</span>
                        <span role="cell" className="text-right font-mono text-xs text-rose-600 tabular-nums whitespace-nowrap">{`- $ ${formatAmount(withholding)}`}</span>
                        <span role="cell" className="text-right font-mono text-xs font-bold text-slate-900 tabular-nums whitespace-nowrap">{`$ ${formatAmount(receivable)}`}</span>
                        <span role="cell">
                          <select aria-label={`Hito exigible cuota ${sequence}`} value={row.milestone} onChange={(event) => updateRow(row.id, { milestone: event.target.value as Milestone })} className={`${cellInputClassName} truncate`}>
                            {milestoneOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                          </select>
                        </span>
                        <span role="cell"><input type="text" aria-label={`Descripción cuota ${sequence}`} value={row.description} placeholder="Opcional" onChange={(event) => updateRow(row.id, { description: event.target.value })} className={`${cellInputClassName} placeholder:text-slate-400 placeholder:font-normal`} /></span>
                        <span role="cell" className="flex justify-center">
                          <button type="button" onClick={() => setInstallments((rows) => rows.filter((item) => item.id !== row.id))} aria-label={`Eliminar cuota ${sequence}`} className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 aria-hidden="true" className="size-3.5" />
                          </button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-6 shadow-sm" aria-live="polite">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:flex md:gap-8">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total contractual exigible</dt>
            <dd className="font-mono text-sm font-bold tabular-nums">{`$ ${formatAmount(contractTotal)} USD`}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Suma del cronograma</dt>
            <dd className="font-mono text-sm font-bold tabular-nums">{`$ ${formatAmount(scheduleTotal)} USD`}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diferencia</dt>
            <dd className={`font-mono text-sm font-bold tabular-nums ${balanced ? 'text-white' : 'text-rose-300'}`}>{`$ ${formatAmount(difference)} USD`}</dd>
          </div>
        </dl>
        {balanced ? (
          <span className="inline-flex items-center gap-1.5 self-start md:self-auto bg-emerald-500/20 text-emerald-300 rounded-full px-3 py-1 text-xs font-bold">
            <CheckCircle2 aria-hidden="true" className="size-3.5" />
            Cuadro perfecto
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 self-start md:self-auto bg-rose-500/20 text-rose-300 rounded-full px-3 py-1 text-xs font-bold">
            <AlertTriangle aria-hidden="true" className="size-3.5" />
            {`Desbalanceado ($ ${formatAmount(difference)})`}
          </span>
        )}
      </div>
    </section>
  )
}
