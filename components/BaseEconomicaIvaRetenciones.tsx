'use client'

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { Calculator, Info, Lock, Plus, Receipt, Trash2 } from 'lucide-react'

type Interpretation = 'total' | 'periodo'
type Currency = 'USD' | 'BS'
type RateSource = '' | 'emision' | 'cobro'

type IslrRow = {
  id: number
  type: string
  rate: string
  base: string
}

const CONTRACT_AMOUNT = 60000
const CONTRACT_CURRENCY = 'USD'
const INSTALLMENTS = 12
const IVA_RATE = 0.16

const ivaWithholdingOptions = [
  { value: '0', label: 'No aplica (0%)' },
  { value: '75', label: '75% del IVA' },
  { value: '100', label: '100% del IVA' },
]

const islrTypes = [
  'Servicios profesionales e independientes',
  'Honorarios profesionales (persona natural)',
  'Arrendamiento de bienes muebles e inmuebles',
  'Publicidad y propaganda',
  'Contratistas y subcontratistas',
  'Otro concepto',
]

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block'
const inputClassName = 'w-full h-11 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal'
const cellInputClassName = 'w-full min-w-0 h-9 px-2 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93]'

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatAmount = (value: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

const groupThousands = (digits: string) => digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const parseCurrencyText = (text: string) => {
  const cleaned = text.replace(/[^\d,]/g, '')
  const commaIndex = cleaned.indexOf(',')
  const integerPart = (commaIndex === -1 ? cleaned : cleaned.slice(0, commaIndex)).replace(/^0+(?=\d)/, '')
  if (commaIndex === -1) return integerPart
  const decimalPart = cleaned.slice(commaIndex + 1).replace(/,/g, '').slice(0, 2)
  return `${integerPart || '0'}.${decimalPart}`
}

const formatCurrencyText = (raw: string, symbol: string, editing: boolean) => {
  if (raw === '') return ''
  if (!editing) return `${symbol} ${formatAmount(toNumber(raw))}`
  const [integerPart, decimalPart] = raw.split('.')
  return `${symbol} ${groupThousands(integerPart || '0')}${decimalPart !== undefined ? `,${decimalPart}` : ''}`
}

const countSignificant = (text: string) => text.replace(/[^\d,]/g, '').length

type CurrencyInputProps = {
  id?: string
  value: string
  symbol: string
  onValueChange: (raw: string) => void
  className: string
  'aria-label'?: string
}

function CurrencyInput({ id, value, symbol, onValueChange, className, 'aria-label': ariaLabel }: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const [editing, setEditing] = useState(false)
  const display = formatCurrencyText(value, symbol, editing)

  useLayoutEffect(() => {
    const input = inputRef.current
    const significantBefore = pendingCaret.current
    if (!input || significantBefore === null) return
    pendingCaret.current = null
    let position = display.length
    let seen = 0
    for (let index = 0; index < display.length; index += 1) {
      if (seen === significantBefore) {
        position = index
        break
      }
      if (/[\d,]/.test(display[index])) seen += 1
    }
    input.setSelectionRange(position, position)
  }, [display])

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={ariaLabel}
      value={display}
      placeholder={`${symbol} 0,00`}
      onFocus={() => setEditing(true)}
      onBlur={() => setEditing(false)}
      onChange={(event) => {
        const caret = event.target.selectionStart ?? event.target.value.length
        pendingCaret.current = countSignificant(event.target.value.slice(0, caret))
        onValueChange(parseCurrencyText(event.target.value))
      }}
      className={`${className} tabular-nums`}
    />
  )
}

export default function BaseEconomicaIvaRetenciones() {
  const id = useId()
  const [interpretation, setInterpretation] = useState<Interpretation>('total')
  const [showSource, setShowSource] = useState(false)
  const [netBase, setNetBase] = useState(String(CONTRACT_AMOUNT))
  const [ivaWithholding, setIvaWithholding] = useState('0')
  const [islrRows, setIslrRows] = useState<IslrRow[]>([{ id: 1, type: islrTypes[0], rate: '2', base: String(CONTRACT_AMOUNT) }])
  const [currency, setCurrency] = useState<Currency>('USD')
  const [rateSource, setRateSource] = useState<RateSource>('')

  const net = toNumber(netBase)
  const iva = net * IVA_RATE
  const ivaWithheld = iva * (toNumber(ivaWithholding) / 100)
  const islrTotal = islrRows.reduce((sum, row) => sum + toNumber(row.base) * (toNumber(row.rate) / 100), 0)
  const receivable = net + iva - ivaWithheld - islrTotal
  const symbol = CONTRACT_CURRENCY === 'USD' ? '$' : 'Bs.'

  const changeInterpretation = (next: Interpretation) => {
    setInterpretation(next)
    const suggested = next === 'total' ? CONTRACT_AMOUNT : CONTRACT_AMOUNT / INSTALLMENTS
    setNetBase(String(suggested))
    setIslrRows((rows) => rows.map((row) => ({ ...row, base: String(suggested) })))
  }

  const updateRow = (rowId: number, field: keyof Omit<IslrRow, 'id'>, value: string) => {
    setIslrRows((rows) => rows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
  }

  const addRow = () => {
    setIslrRows((rows) => [...rows, { id: Math.max(0, ...rows.map((row) => row.id)) + 1, type: islrTypes[0], rate: '', base: netBase }])
  }

  const removeRow = (rowId: number) => setIslrRows((rows) => rows.filter((row) => row.id !== rowId))

  const changeCurrency = (next: Currency) => {
    setCurrency(next)
    if (next === 'USD') setRateSource('')
  }

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl px-4 py-6 shadow-xs mb-6" aria-labelledby={`${id}-title`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id={`${id}-title`} className="text-lg font-bold text-slate-900">Base económica, IVA y retenciones</h2>
              <p className="text-xs text-slate-500 mt-1">Define la base imponible, impuestos y retenciones que determinan el monto exigible de la CxC</p>
            </div>
            <span className="bg-blue-50 text-[#2A4B93] text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Calculator aria-hidden="true" className="w-3.5 h-3.5" />
              Cómputo automático activo
            </span>
          </div>

          <fieldset className="flex flex-col gap-4 min-w-0">
            <legend className="sr-only">Desglose base y moneda</legend>

            <div role="radiogroup" aria-labelledby={`${id}-interpretation`}>
              <span id={`${id}-interpretation`} className={labelClassName}>Interpretación del Importe de Venta</span>
              <div className="inline-flex p-1 bg-slate-100 rounded-full font-medium text-xs">
                {([['total', 'Total Contractual'], ['periodo', 'Importe por Período']] as const).map(([value, label]) => {
                  const active = interpretation === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => changeInterpretation(value)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/30 ${active ? 'bg-[#2A4B93] text-white shadow-xs' : 'text-slate-600 hover:text-[#2A4B93]'}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {interpretation === 'periodo' && (
                <div>
                  <p role="status" className="bg-blue-50/70 border border-blue-100 text-[#2A4B93] text-xs px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-2 mt-2">
                    <Info aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
                    {`Base sugerida: importe contractual ÷ ${INSTALLMENTS} cuotas`}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor={`${id}-contract`} className={labelClassName}>Importe Contractual a Reconciliar</label>
                <div className="relative">
                  <input
                    id={`${id}-contract`}
                    value={`${symbol} ${formatAmount(CONTRACT_AMOUNT)} ${CONTRACT_CURRENCY}`}
                    readOnly
                    aria-readonly="true"
                    className="w-full h-11 pl-3.5 pr-11 text-sm font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200/80 rounded-xl cursor-not-allowed tabular-nums focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSource((open) => !open)}
                    aria-expanded={showSource}
                    aria-controls={`${id}-source`}
                    aria-label="Ver origen del importe contractual"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-[#2A4B93] hover:bg-white transition-colors"
                  >
                    <Lock aria-hidden="true" className="w-3.5 h-3.5" />
                  </button>
                </div>
                {showSource && <p id={`${id}-source`} className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1"><Info aria-hidden="true" className="w-3 h-3" />Precargado desde <code className="font-mono text-slate-600">insight_hub.fct_venta</code> · solo lectura</p>}
              </div>

              <div>
                <label htmlFor={`${id}-net`} className={labelClassName}>Importe Neto Base *</label>
                <CurrencyInput id={`${id}-net`} value={netBase} symbol={symbol} onValueChange={setNetBase} className={inputClassName} />
              </div>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4 min-w-0">
            <legend className="sr-only">Impuestos aplicables</legend>
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Impuestos aplicables</span>
              <span className="h-px flex-1 bg-slate-200/80" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={labelClassName}>IVA (16%)</span>
                <div className="h-11 bg-slate-50/80 border border-slate-200 rounded-2xl px-3 flex justify-between items-center" aria-live="polite">
                  <span className="text-sm font-mono font-bold text-slate-800 tabular-nums">{`${symbol} ${formatAmount(iva)}`}</span>
                  <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Automático</span>
                </div>
              </div>

              <div className="min-w-0">
                <label htmlFor={`${id}-iva-withholding`} className={labelClassName}>Retención de IVA</label>
                <div className="flex items-center gap-2">
                  <select
                    id={`${id}-iva-withholding`}
                    value={ivaWithholding}
                    onChange={(event) => setIvaWithholding(event.target.value)}
                    className={`${inputClassName} flex-1 min-w-0`}
                  >
                    {ivaWithholdingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <span className={`shrink-0 h-11 px-3 inline-flex items-center rounded-xl text-xs font-bold tabular-nums border ${ivaWithheld > 0 ? 'text-rose-600 bg-rose-50 border-rose-200/70' : 'text-slate-500 bg-slate-50 border-slate-200/80'}`} aria-live="polite">
                    {`- ${symbol} ${formatAmount(ivaWithheld)}`}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">Otras Retenciones (ISLR)</h3>
                <button type="button" onClick={addRow} className="text-xs font-bold text-[#2A4B93] hover:bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 inline-flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/30">
                  <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                  Agregar retención
                </button>
              </div>
              <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-200/80 px-4 py-3 text-xs">
                <div aria-hidden="true" className="flex items-center gap-3 w-full pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex-[2.5] min-w-0 truncate">Tipo de Retención</span>
                  <span className="w-16 flex-none truncate">Tasa %</span>
                  <span className="flex-1 min-w-[120px] truncate">Base imponible</span>
                  <span className="flex-1 min-w-[100px] text-right truncate">Importe</span>
                  <span className="w-8 flex-none" />
                </div>

                {islrRows.length === 0 && (
                  <p className="border-t border-slate-100 py-6 text-center text-slate-400">Sin retenciones de ISLR registradas.</p>
                )}

                <ul className="flex flex-col">
                  {islrRows.map((row, index) => {
                    const amount = toNumber(row.base) * (toNumber(row.rate) / 100)
                    return (
                      <li key={row.id} className="flex items-center gap-3 w-full py-2 border-t border-slate-100">
                        <div className="flex-[2.5] min-w-0">
                          <select aria-label={`Tipo de retención, fila ${index + 1}`} title={row.type} value={row.type} onChange={(event) => updateRow(row.id, 'type', event.target.value)} className={`${cellInputClassName} w-full truncate text-xs pl-2 pr-6`}>
                            {islrTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                        <div className="w-16 flex-none">
                          <input aria-label={`Tasa porcentual, fila ${index + 1}`} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={row.rate} onChange={(event) => updateRow(row.id, 'rate', event.target.value)} placeholder="0" className={cellInputClassName} />
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <CurrencyInput aria-label={`Base imponible, fila ${index + 1}`} value={row.base} symbol={symbol} onValueChange={(raw) => updateRow(row.id, 'base', raw)} className={cellInputClassName} />
                        </div>
                        <div className="flex-1 min-w-[100px] text-right font-mono font-bold text-slate-800 tabular-nums truncate" aria-label={`Importe, fila ${index + 1}`}>
                          {`${symbol} ${formatAmount(amount)}`}
                        </div>
                        <div className="w-8 flex-none text-center">
                          <button type="button" onClick={() => removeRow(row.id)} aria-label={`Eliminar retención, fila ${index + 1}`} className="mx-auto flex items-center justify-center w-8 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300">
                            <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                {islrRows.length > 0 && (
                  <div className="flex items-center justify-end gap-3 w-full pt-3 mt-1 border-t border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total otras retenciones:</span>
                    <span className="font-mono text-xs font-bold text-rose-600 tabular-nums whitespace-nowrap">{`- ${symbol} ${formatAmount(islrTotal)}`}</span>
                  </div>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-20 bg-slate-50/80 border border-slate-200/90 rounded-3xl p-5 shadow-xs" aria-labelledby={`${id}-summary`}>
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 shrink-0 rounded-full bg-[#2A4B93]/10 text-[#2A4B93] inline-flex items-center justify-center"><Receipt aria-hidden="true" className="w-4 h-4" /></span>
              <h3 id={`${id}-summary`} className="text-sm font-bold text-slate-800">Resumen CxC Neto</h3>
              <span className="ml-auto shrink-0 whitespace-nowrap text-[10px] font-semibold text-[#2A4B93] bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">Fórmula de cálculo</span>
            </div>

            <dl className="flex flex-col gap-2 text-xs">
              {([
                ['Neto base', '', net, 'text-slate-700'],
                ['+ IVA (16%)', '+', iva, 'text-emerald-600'],
                ['− Retención IVA', '−', ivaWithheld, ivaWithheld > 0 ? 'text-rose-600' : 'text-slate-500'],
                ['− Otras retenciones', '−', islrTotal, islrTotal > 0 ? 'text-rose-600' : 'text-slate-500'],
              ] as const).map(([label, sign, value, color]) => (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className={`font-mono text-xs text-right tabular-nums font-medium ${color}`}>{`${sign}${sign ? ' ' : ''}${symbol} ${formatAmount(value)}`}</dd>
                </div>
              ))}
            </dl>
            <div className="border-b border-dashed border-slate-200 my-2" role="presentation" />
            <div>
              <span className="text-xs text-slate-500 font-medium">Importe Neto de CxC Exigible</span>
              <p className={`font-mono text-xl font-extrabold tracking-tight mt-0.5 tabular-nums ${receivable < 0 ? 'text-rose-600' : 'text-slate-900'}`} aria-live="polite">{`${symbol} ${formatAmount(receivable)} ${CONTRACT_CURRENCY}`}</p>
            </div>
          </div>

          <label className="block mt-4">
            <span className="text-xs font-bold text-slate-700 mb-1.5 block">Moneda Contractual y Forma de Pago</span>
            <select value={currency} onChange={(event) => changeCurrency(event.target.value as Currency)} className={inputClassName}>
              <option value="USD">USD ($)</option>
              <option value="BS">Bs (Bs.)</option>
            </select>
          </label>

          {currency === 'BS' && (
            <label className="block mt-4">
              <span className={labelClassName}>Fuente y Momento de Tasa*</span>
              <select value={rateSource} onChange={(event) => setRateSource(event.target.value as RateSource)} className={`${inputClassName} ${rateSource === '' ? 'text-slate-400 font-normal' : ''}`}>
                <option value="" disabled>Seleccionar tasa</option>
                <option value="emision">Tasa BCV Fecha Emisión</option>
                <option value="cobro">Tasa BCV Fecha Cobro</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1.5 block">El monto en Bs. se calculará con la tasa oficial seleccionada.</span>
            </label>
          )}
        </aside>
      </div>
    </section>
  )
}
