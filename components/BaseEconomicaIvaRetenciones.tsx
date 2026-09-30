'use client'

import { useId, useState } from 'react'
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

const islrTypes = ['Servicios profesionales (PJ)', 'Honorarios profesionales (PN)', 'Arrendamiento', 'Publicidad y propaganda', 'Otro concepto']

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block'
const inputClassName = 'w-full h-11 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal'
const cellInputClassName = 'w-full h-9 px-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93]'

const toNumber = (value: string) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatAmount = (value: number) => new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

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
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs mb-6" aria-labelledby={`${id}-title`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 id={`${id}-title`} className="text-base font-bold text-slate-800">Base económica, IVA y retenciones</h2>
          <p className="text-xs text-slate-500 mt-1">Define la base imponible, impuestos y retenciones que determinan el monto exigible de la CxC.</p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 rounded-full px-3 py-1 inline-flex items-center gap-1.5">
          <Calculator aria-hidden="true" className="w-3.5 h-3.5" />
          Cálculo en tiempo real
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <fieldset className="flex flex-col gap-4">
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Desglose base y moneda</legend>

            <div role="radiogroup" aria-labelledby={`${id}-interpretation`}>
              <span id={`${id}-interpretation`} className={labelClassName}>Interpretación del Importe de Venta</span>
              <div className="inline-flex p-1 bg-slate-100 border border-slate-200/80 rounded-full">
                {([['total', 'Total Contractual'], ['periodo', 'Importe por Período']] as const).map(([value, label]) => {
                  const active = interpretation === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => changeInterpretation(value)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A4B93]/30 ${active ? 'bg-[#2A4B93] text-white shadow-xs' : 'text-slate-600 hover:text-[#2A4B93]'}`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {interpretation === 'periodo' && <p className="text-[11px] text-slate-500 mt-2">{`Base sugerida: importe contractual ÷ ${INSTALLMENTS} cuotas.`}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${id}-contract`} className={labelClassName}>Importe Contractual a Reconciliar</label>
                <div className="relative">
                  <input
                    id={`${id}-contract`}
                    value={`${symbol} ${formatAmount(CONTRACT_AMOUNT)} ${CONTRACT_CURRENCY}`}
                    readOnly
                    aria-readonly="true"
                    className="w-full h-11 pl-3.5 pr-11 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200/80 rounded-xl cursor-not-allowed focus:outline-none"
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
                <label htmlFor={`${id}-net`} className={labelClassName}>Importe Neto Base*</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400" aria-hidden="true">{symbol}</span>
                  <input
                    id={`${id}-net`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={netBase}
                    onChange={(event) => setNetBase(event.target.value)}
                    className={`${inputClassName} pl-8`}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4 pt-5 border-t border-slate-100">
            <legend className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Cálculo de impuestos y retenciones</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={labelClassName}>IVA (16%)</span>
                <div className="h-11 px-3.5 flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl" aria-live="polite">
                  <span className="text-sm font-bold text-slate-800 tabular-nums">{`${symbol} ${formatAmount(iva)}`}</span>
                  <span className="text-[11px] font-semibold text-[#2A4B93] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">Automático</span>
                </div>
              </div>

              <div>
                <label htmlFor={`${id}-iva-withholding`} className={labelClassName}>Retención de IVA</label>
                <div className="flex items-center gap-2">
                  <select
                    id={`${id}-iva-withholding`}
                    value={ivaWithholding}
                    onChange={(event) => setIvaWithholding(event.target.value)}
                    className={`${inputClassName} flex-1`}
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-600">Otras Retenciones (ISLR)</span>
                <button type="button" onClick={addRow} className="text-xs font-semibold text-[#2A4B93] hover:bg-[#2A4B93]/5 border border-[#2A4B93]/30 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 transition-colors">
                  <Plus aria-hidden="true" className="w-3.5 h-3.5" />
                  Agregar retención
                </button>
              </div>
              <div className="w-full overflow-x-auto border border-slate-200/80 rounded-xl">
                <table className="w-full min-w-[620px] text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th scope="col" className="text-left font-semibold px-3 py-2.5 min-w-[220px]">Tipo de Retención</th>
                      <th scope="col" className="text-left font-semibold px-3 py-2.5 w-24">Tasa %</th>
                      <th scope="col" className="text-left font-semibold px-3 py-2.5 w-36">Base imponible</th>
                      <th scope="col" className="text-right font-semibold px-3 py-2.5 w-32">Importe</th>
                      <th scope="col" className="w-12"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {islrRows.length === 0 && (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">Sin retenciones de ISLR registradas.</td></tr>
                    )}
                    {islrRows.map((row, index) => {
                      const amount = toNumber(row.base) * (toNumber(row.rate) / 100)
                      return (
                        <tr key={row.id} className="border-t border-slate-100">
                          <td className="px-3 py-2">
                            <select aria-label={`Tipo de retención, fila ${index + 1}`} value={row.type} onChange={(event) => updateRow(row.id, 'type', event.target.value)} className={cellInputClassName}>
                              {islrTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input aria-label={`Tasa porcentual, fila ${index + 1}`} type="number" inputMode="decimal" min="0" max="100" step="0.01" value={row.rate} onChange={(event) => updateRow(row.id, 'rate', event.target.value)} placeholder="0" className={cellInputClassName} />
                          </td>
                          <td className="px-3 py-2">
                            <input aria-label={`Base imponible, fila ${index + 1}`} type="number" inputMode="decimal" min="0" step="0.01" value={row.base} onChange={(event) => updateRow(row.id, 'base', event.target.value)} className={cellInputClassName} />
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-slate-800 tabular-nums">{`${symbol} ${formatAmount(amount)}`}</td>
                          <td className="px-2 py-2 text-center">
                            <button type="button" onClick={() => removeRow(row.id)} aria-label={`Eliminar retención, fila ${index + 1}`} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                              <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {islrRows.length > 0 && (
                    <tfoot>
                      <tr className="border-t border-slate-200 bg-slate-50/60">
                        <td colSpan={3} className="px-3 py-2.5 font-semibold text-slate-600">Total otras retenciones</td>
                        <td className="px-3 py-2.5 text-right font-bold text-rose-600 tabular-nums">{`- ${symbol} ${formatAmount(islrTotal)}`}</td>
                        <td />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="xl:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 h-fit xl:sticky xl:top-20" aria-labelledby={`${id}-summary`}>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#2A4B93]/10 text-[#2A4B93] inline-flex items-center justify-center"><Receipt aria-hidden="true" className="w-4 h-4" /></span>
            <h3 id={`${id}-summary`} className="text-sm font-bold text-slate-800">Resumen CxC neto</h3>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-500">Importe Neto de CxC Exigible</span>
            <p className={`text-lg font-bold tabular-nums mt-1 ${receivable < 0 ? 'text-rose-600' : 'text-slate-900'}`} aria-live="polite">{`${symbol} ${formatAmount(receivable)} ${CONTRACT_CURRENCY}`}</p>
            <dl className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><dt className="text-slate-500">Neto base</dt><dd className="font-medium text-slate-700 tabular-nums">{formatAmount(net)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">+ IVA 16%</dt><dd className="font-medium text-emerald-600 tabular-nums">{formatAmount(iva)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">- Retención IVA</dt><dd className="font-medium text-rose-600 tabular-nums">{formatAmount(ivaWithheld)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">- Otras retenciones</dt><dd className="font-medium text-rose-600 tabular-nums">{formatAmount(islrTotal)}</dd></div>
            </dl>
          </div>

          <label className="block">
            <span className={labelClassName}>Moneda Contractual y Forma de Pago</span>
            <select value={currency} onChange={(event) => changeCurrency(event.target.value as Currency)} className={inputClassName}>
              <option value="USD">USD ($)</option>
              <option value="BS">Bs (Bs.)</option>
            </select>
          </label>

          {currency === 'BS' && (
            <label className="block">
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
