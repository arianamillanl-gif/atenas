'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowDownUp, Pencil, Trash2 } from 'lucide-react'
import { CashflowToolbar } from '@/components/cashflow-toolbar'
import { TablePagination } from '@/components/table-pagination'

const rows = [
	{ id: 'ING-2026-0048', subtitle: 'Comprobante de ingreso', date: '13/11/2026', bankReference: '007482901348', rate: '1,00', cxcDocument: 'FCL25-29-12-1', cxcDocuments: ['FCL25-29-12-1', 'FCL25-31-10-2', 'MC25-30-1'], description: 'Cobro de ventas · Unidad Centro', concept: 'Cobro por ventas', controlAccount: 'Cobro por ventas', detailAccount: 'Servicios', unit: 'Atenas', payment: 'Transferencia', income: '12.500,00', payout: '0,00', usd: '120,00', cashUsd: '0,00', bs: '0,00', cashBs: '0,00', bankNational: '', bankNationalReference: '', bankInternational: 'Banco Internacional', bankInternationalReference: '007482901348', observation: 'Abono recibido por transferencia bancaria.' },
	{ id: 'ING-2026-0047', subtitle: 'Comprobante de ingreso', date: '12/11/2026', bankReference: '007482901327', rate: '1,00', cxcDocument: 'FCL25-29-12-2', cxcDocuments: ['FCL25-29-12-2'], description: 'Servicios profesionales · Octubre', concept: 'Servicios profesionales', controlAccount: 'Ingresos operativos', detailAccount: 'Servicios', unit: 'Administración', payment: 'Pago móvil', income: '8.250,00', payout: '0,00', usd: '0,00', cashUsd: '0,00', bs: '8.250,00', cashBs: '0,00', bankNational: 'Banco Nacional', bankNationalReference: '007482901327', bankInternational: '', bankInternationalReference: '', observation: 'Pago recibido por servicios prestados en octubre.' },
	{ id: 'MOV-2026-0012', subtitle: 'Comprobante de egreso', date: '12/11/2026', bankReference: '007482901294', rate: '1,00', cxcDocument: '—', cxcDocuments: [], description: 'Compra de insumos administrativos', concept: 'Compra de insumos', controlAccount: 'Gastos administrativos', detailAccount: 'Otros ingresos', unit: 'Administración', payment: 'Transferencia', income: '0,00', payout: '2.400,00', usd: '0,00', cashUsd: '0,00', bs: '2.400,00', cashBs: '0,00', bankNational: 'Banco Nacional', bankNationalReference: '007482901294', bankInternational: '', bankInternationalReference: '', observation: 'Compra de papelería y útiles de oficina.' },
	{ id: 'ING-2026-0046', subtitle: 'Comprobante de caja', date: '11/11/2026', bankReference: 'CAJ-2026-0046', rate: '1,00', cxcDocument: '—', cxcDocuments: [], description: 'Reintegro de gastos · Unidad Norte', concept: 'Reintegro de gastos', controlAccount: 'Ingresos operativos', detailAccount: 'Otros ingresos', unit: 'Atenas', payment: 'Efectivo', income: '1.850,00', payout: '0,00', usd: '0,00', cashUsd: '0,00', bs: '0,00', cashBs: '1.850,00', bankNational: '', bankNationalReference: '', bankInternational: '', bankInternationalReference: '', observation: 'Reintegro de gastos con comprobantes aprobados.' },
]

const filterColumns = [
  { id: 'income', label: 'Ingreso', column: 'Ingreso' },
  { id: 'usd', label: 'USD', column: 'USD' },
] as const
const allFilterColumns = Object.fromEntries(filterColumns.map(({ id }) => [id, true])) as Record<(typeof filterColumns)[number]['id'], boolean>
const dataColumns = ['Fecha', 'Descripción', 'Ingreso', 'Modo de Pago', 'USD', 'USD Efectivo', 'Bs.', 'Bs. Efectivo', 'Banco Nacional', 'No. Referencia Banco Nacional', 'Banco Internacional', 'No. Referencia Banco Internacional', 'Tasa', 'Documento CxC', 'Documento Venta', 'Concepto de Ingreso', 'Proveedor', 'Unidad', 'Observación', 'ETL']
const tableColumns = [...dataColumns, 'Acciones']
const columnWidths = [120, 260, 130, 150, 100, 130, 110, 140, 160, 280, 170, 280, 110, 170, 170, 210, 200, 170, 360, 100, 112]
const fieldClass = 'mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
const labelClass = 'text-xs font-semibold text-slate-600'
const currencyFieldClass = 'h-10 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-right text-sm tabular-nums text-slate-800 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20'
const currencyFields = [
  { key: 'bs', label: 'Bs.' },
  { key: 'cashBs', label: 'Bs. Efectivo' },
  { key: 'usd', label: 'USD' },
  { key: 'cashUsd', label: 'USD efectivo' },
] as const
type CurrencyKey = (typeof currencyFields)[number]['key']
const bankOptions = ['Banco Nacional', 'Banco Internacional']
const emptyCurrencyMetadata = (): Record<CurrencyKey, string> => ({ bs: '', cashBs: '', usd: '', cashUsd: '' })

const parseAmount = (value: string) => Number(value.replace(/\./g, '').replace(',', '.')) || 0

function getPaymentMethodLabels(amounts: { usd: string; cashUsd: string; bs: string; cashBs: string }) {
  return [
    { label: 'USD', amount: amounts.usd },
    { label: 'USD Efectivo', amount: amounts.cashUsd },
    { label: 'Bs.', amount: amounts.bs },
    { label: 'Bs. Efectivo', amount: amounts.cashBs },
  ].filter(({ amount }) => parseAmount(amount) > 0).map(({ label }) => label)
}

function PaymentMethodBadges({ row }: { row: (typeof rows)[number] }) {
  const paymentMethods = getPaymentMethodLabels(row)

  return (
    <div className="flex flex-wrap gap-1">
      {paymentMethods.length > 0 ? paymentMethods.map((label) => (
        <span key={label} className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{label}</span>
      )) : '—'}
    </div>
  )
}

const rowActionTones = {
  indigo: 'hover:bg-indigo-50 hover:text-indigo-600 focus-visible:bg-indigo-50 focus-visible:text-indigo-600',
  rose: 'hover:bg-rose-50 hover:text-rose-600 focus-visible:bg-rose-50 focus-visible:text-rose-600',
}

function RowAction({ label, rowId, tone, onClick, children }: { label: string; rowId: string; tone: keyof typeof rowActionTones; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={`${label} ${rowId}`} onClick={onClick} className={`group/action relative rounded-lg p-2 text-slate-400 transition-all duration-150 group-hover:bg-white group-hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 ${rowActionTones[tone]}`}>
      {children}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-full right-0 z-20 mb-1.5 translate-y-1 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-50 opacity-0 shadow-md transition-all group-hover/action:translate-y-0 group-hover/action:opacity-100 group-focus-visible/action:translate-y-0 group-focus-visible/action:opacity-100">{label}</span>
    </button>
  )
}

function Field({ label, ...props }: { label: string; placeholder?: string; defaultValue?: string; value?: string; onChange?: React.ChangeEventHandler<HTMLInputElement>; type?: string; readOnly?: boolean }) {
  return <label className="min-w-0"><span className={labelClass}>{label}</span><input className={fieldClass} placeholder={props.placeholder} defaultValue={props.defaultValue} value={props.value} onChange={props.onChange} type={props.type ?? 'text'} readOnly={props.readOnly} /></label>
}

export default function RegistrarIngresos() {
  const [incomeRows, setIncomeRows] = useState(rows)
  const [date, setDate] = useState('13/11/2026')
  const [unit, setUnit] = useState('')
  const [observation, setObservation] = useState('')
  const [rate, setRate] = useState('1,00')
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [controlAccount, setControlAccount] = useState('')
  const [detailAccount, setDetailAccount] = useState('')
  const [selectedCxc, setSelectedCxc] = useState<string[]>([])
  const [cxcAmounts, setCxcAmounts] = useState<Record<string, string>>({})
  const [cxcDropdownOpen, setCxcDropdownOpen] = useState(false)
  const [cxcSearch, setCxcSearch] = useState('')
  const [amounts, setAmounts] = useState({ bs: '', cashBs: '', usd: '', cashUsd: '' })
  const [bankSelections, setBankSelections] = useState<Record<CurrencyKey, string>>(emptyCurrencyMetadata)
  const [bankReferences, setBankReferences] = useState<Record<CurrencyKey, string>>(emptyCurrencyMetadata)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [saved, setSaved] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [formDirty, setFormDirty] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)
  const [draftFilters, setDraftFilters] = useState(allFilterColumns)
  const [activeFilters, setActiveFilters] = useState(allFilterColumns)
  const [openCxcRow, setOpenCxcRow] = useState<string | null>(null)
  const cxcPopoverRef = useRef<HTMLDivElement>(null)
  const total = useMemo(() => Object.values(amounts).reduce((sum, value) => sum + parseAmount(value), 0), [amounts])
  const allocatedTotal = useMemo(() => selectedCxc.reduce((sum, code) => sum + parseAmount(cxcAmounts[code] ?? ''), 0), [selectedCxc, cxcAmounts])
  const remainingAmount = Math.max(0, total - allocatedTotal)
  const cxcDocuments = ['MC26-15-1', 'MC26-11-2', 'FCL25-29-12-1', 'FCL25-29-12-2']
  const formatMoney = (value: number) => value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const resultRows = useMemo(() => description.trim() ? [{ id: 'current-entry', concept: description.trim(), control: controlAccount || 'Por asignar', detail: detailAccount || 'Por asignar' }] : [], [description, controlAccount, detailAccount])
  const searchTerm = search.trim().toLowerCase()
  const visibleRows = incomeRows.filter((row) => [row.id, row.subtitle, row.date, row.bankReference, row.rate, row.cxcDocument, row.description, row.concept, row.unit, row.payment, row.observation].some((value) => value.toLowerCase().includes(searchTerm)))
  const updateAmount = (key: keyof typeof amounts, value: string) => {
    setAmounts((current) => ({ ...current, [key]: value }))
    const parsedValue = parseAmount(value)
    if (parsedValue > 0) setValidationErrors((current) => { const next = { ...current }; currencyFields.forEach(({ key: amountKey }) => { delete next[`amount:${amountKey}`] }); return next })
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      clearValidationError(`bank:${key}`)
      setBankSelections((current) => ({ ...current, [key]: '' }))
      setBankReferences((current) => ({ ...current, [key]: '' }))
    }
  }
  const resetIncomeForm = () => {
    formRef.current?.reset()
    setDate('13/11/2026')
    setUnit('')
    setObservation('')
    setRate('1,00')
    setEditingRecordId(null)
    setDescription('')
    setControlAccount('')
    setDetailAccount('')
    setSelectedCxc([])
    setCxcAmounts({})
    setCxcSearch('')
    setCxcDropdownOpen(false)
    setAmounts({ bs: '', cashBs: '', usd: '', cashUsd: '' })
    setBankSelections(emptyCurrencyMetadata())
    setBankReferences(emptyCurrencyMetadata())
    setSaved(false)
    setFormDirty(false)
    setValidationErrors({})
  }
  const clearValidationError = (key: string) => setValidationErrors((current) => {
    if (!current[key]) return current
    const next = { ...current }
    delete next[key]
    return next
  })
  const validateIncomeForm = () => {
    const errors: Record<string, boolean> = {}
    if (!date.trim()) errors.date = true
    if (!unit) errors.unit = true
    if (!description.trim()) errors.description = true
    if (!controlAccount) errors.controlAccount = true
    if (controlAccount === 'Cobro por ventas' && selectedCxc.length === 0) errors.cxcDocuments = true
    selectedCxc.forEach((code) => { if (parseAmount(cxcAmounts[code] ?? '') <= 0) errors[`cxcAmount:${code}`] = true })
    if (total <= 0) currencyFields.forEach(({ key }) => { errors[`amount:${key}`] = true })
    if (parseAmount(amounts.bs) > 0 && !bankSelections.bs) errors['bank:bs'] = true
    if (parseAmount(amounts.usd) > 0 && !bankSelections.usd) errors['bank:usd'] = true
    setValidationErrors(errors)
    if (Object.keys(errors).length) {
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[data-validation-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
      return false
    }
    return true
  }
  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedRows = visibleRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const periodIncome = visibleRows.reduce((sum, row) => sum + parseAmount(row.income), 0)
  const periodUsd = visibleRows.reduce((sum, row) => sum + parseAmount(row.usd), 0)
  const hiddenColumnCount = Object.values(activeFilters).filter((visible) => !visible).length
  useEffect(() => {
    if (!openCxcRow) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!cxcPopoverRef.current?.contains(event.target as Node)) setOpenCxcRow(null)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenCxcRow(null)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openCxcRow])
  const downloadCsv = () => {
    const csvRows = [['Documento', 'Fecha', 'No. Referencia Banco Internacional', 'Tasa', 'Documento CxC', 'Concepto de Ingreso', 'Unidad', 'Medio de Pago', 'Ingreso', 'Desembolso', 'USD', 'USD Efectivo', 'Bs.', 'Bs. Efectivo', 'Observación'], ...visibleRows.map((row) => [row.id, row.date, row.bankInternationalReference, row.rate, row.cxcDocument, row.concept, row.unit, row.payment, row.income, row.payout, row.usd, row.cashUsd, row.bs, row.cashBs, row.observation])]; const csv = csvRows.map((cells) => cells.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' })); link.download = 'flujo-de-efectivo.csv'; link.click(); URL.revokeObjectURL(link.href)
  }
  const calculate = () => setAmounts((current) => ({ ...current, bs: parseAmount(current.bs).toFixed(2).replace('.', ',') }))
  const editIncomeRecord = (row: (typeof rows)[number]) => {
    setDate(row.date)
    setUnit(row.unit)
    setObservation(row.observation)
    setRate(row.rate)
    setDescription(row.description)
    setControlAccount(row.controlAccount)
    setDetailAccount(row.detailAccount)
    setSelectedCxc(row.cxcDocuments)
    setCxcAmounts({})
    setCxcSearch('')
    setCxcDropdownOpen(false)
    setAmounts({ bs: row.bs, cashBs: row.cashBs, usd: row.usd, cashUsd: row.cashUsd })
    setBankSelections({ bs: row.bankNational, cashBs: '', usd: row.bankInternational, cashUsd: '' })
    setBankReferences({ bs: row.bankNationalReference, cashBs: '', usd: row.bankInternationalReference, cashUsd: '' })
    setEditingRecordId(row.id)
    setSaved(false)
    setFormDirty(false)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.requestAnimationFrame(() => descriptionInputRef.current?.focus({ preventScroll: true }))
  }
  const saveIncomeForm = () => {
    if (!validateIncomeForm() || allocatedTotal > total) return
    if (editingRecordId) {
      setIncomeRows((current) => current.map((row) => row.id === editingRecordId ? {
        ...row,
        date,
        unit,
        observation,
        rate,
        description,
        controlAccount,
        detailAccount,
        cxcDocuments: selectedCxc,
        cxcDocument: selectedCxc[0] ?? '—',
        bs: amounts.bs,
        cashBs: amounts.cashBs,
        usd: amounts.usd,
        cashUsd: amounts.cashUsd,
        payment: getPaymentMethodLabels(amounts).join(', ') || '—',
        bankNational: bankSelections.bs,
        bankNationalReference: bankReferences.bs,
        bankInternational: bankSelections.usd,
        bankInternationalReference: bankReferences.usd,
        bankReference: bankReferences.bs || bankReferences.usd || '',
      } : row))
      resetIncomeForm()
      setSaved(true)
      return
    }
    const nextRecordNumber = Math.max(0, ...incomeRows.map((row) => Number(row.id.match(/\d+$/)?.[0] ?? 0))) + 1
    const id = `ING-${new Date().getFullYear()}-${String(nextRecordNumber).padStart(4, '0')}`
    const nextRecord = {
      id,
      subtitle: 'Comprobante de ingreso',
      date,
      bankReference: bankReferences.bs || bankReferences.usd || '',
      rate,
      cxcDocument: selectedCxc[0] ?? '—',
      cxcDocuments: selectedCxc,
      description,
      concept: controlAccount || description.trim() || 'Por asignar',
      controlAccount,
      detailAccount,
      unit,
      payment: getPaymentMethodLabels(amounts).join(', ') || '—',
      income: formatMoney(total),
      payout: '0,00',
      usd: amounts.usd,
      cashUsd: amounts.cashUsd,
      bs: amounts.bs,
      cashBs: amounts.cashBs,
      bankNational: bankSelections.bs,
      bankNationalReference: bankReferences.bs,
      bankInternational: bankSelections.usd,
      bankInternationalReference: bankReferences.usd,
      observation,
    }
    setIncomeRows((current) => [nextRecord, ...current])
    resetIncomeForm()
    setSaved(true)
  }

  return <div className="mx-auto flex max-w-[1600px] flex-col gap-0 p-4 md:p-7 [&>section]:mb-6">
    <header className="mb-4"><p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600">TESORERÍA · FLUJO DE EFECTIVO</p><div className="border-l-4 border-indigo-600 pl-3"><h1 className="text-xl font-bold text-slate-900">Registro de Ingresos y Movimientos</h1></div><p className="mt-0.5 text-sm text-slate-500">Control de asientos contables, tasas de cambio y conciliación de caja</p></header>

    <form ref={formRef} onChange={() => setFormDirty(true)}>
    <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" aria-labelledby="general-parameters-heading">
      <div className="mb-4"><h2 id="general-parameters-heading" className="text-base font-bold text-slate-900">Parámetros Generales</h2><p className="mt-0.5 text-xs text-slate-500">Configuración de tasas, fecha, unidad y notas del movimiento</p></div>
      <div className="grid gap-4 md:grid-cols-2"><Field label="Tasa no oficial" value={rate} onChange={(event) => setRate(event.target.value)} /><div><span className={labelClass}>Tasa oficial</span><div className="mt-1.5 flex min-h-[42px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1.5"><strong className="text-sm font-semibold tabular-nums text-slate-900">1,00 VE</strong><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">+100</span></div></div></div>
      <div aria-hidden="true" className="my-4 border-t border-slate-100" />
      <div className="grid items-start gap-4 md:grid-cols-12"><div className="md:col-span-3"><label className="block"><span className={labelClass}>Fecha</span><input data-validation-error={validationErrors.date || undefined} aria-invalid={Boolean(validationErrors.date)} className={`${fieldClass} h-11 ${validationErrors.date ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={date} onChange={(event) => { setDate(event.target.value); clearValidationError('date') }} /><span className="mt-1 block min-h-[20px] text-xs text-rose-600">{validationErrors.date ? 'Campo requerido' : ''}</span></label></div><label className="min-w-0 md:col-span-4"><span className={labelClass}>Unidad</span><select data-validation-error={validationErrors.unit || undefined} aria-invalid={Boolean(validationErrors.unit)} className={`${fieldClass} h-11 ${validationErrors.unit ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={unit} onChange={(event) => { setUnit(event.target.value); clearValidationError('unit') }}><option value="">Seleccione una unidad</option><option>Administración</option><option>Centro</option><option>Norte</option><option>Atenas</option></select><span className="mt-1 block min-h-[20px] text-xs text-rose-600">{validationErrors.unit ? 'Campo requerido' : ''}</span></label><div className="md:col-span-5"><label className="block min-w-0"><span className={labelClass}>Observación</span><input className={`${fieldClass} h-11`} placeholder="Agrega una nota para este movimiento" value={observation} onChange={(event) => setObservation(event.target.value)} /><span className="mt-1 block min-h-[20px] text-xs" aria-hidden="true" /></label></div></div>
    </section>


    <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" aria-labelledby="entry-heading"><div className="mb-5"><div className="flex flex-wrap items-center gap-2"><h2 id="entry-heading" className="text-base font-bold text-slate-900">Registrar Asiento</h2>{editingRecordId && <span className="rounded-full bg-[#1E2B58]/[0.07] px-2.5 py-1 text-xs font-semibold text-[#1E2B58]">Editando {editingRecordId}</span>}</div><p className="mt-1 text-xs text-slate-500">Completa la información contable y revisa el asiento antes de guardarlo.</p></div><div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12"><div className="min-w-0 lg:col-span-5"><div className="flex flex-col gap-4"><label><span className={labelClass}>Descripción</span><input ref={descriptionInputRef} data-validation-error={validationErrors.description || undefined} aria-invalid={Boolean(validationErrors.description)} className={`${fieldClass} ${validationErrors.description ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={description} onChange={(event) => { setDescription(event.target.value); clearValidationError('description') }} placeholder="Describe el ingreso o movimiento" />{validationErrors.description && <span className="mt-1 block text-xs text-rose-600">Campo requerido</span>}</label><div className="grid gap-4"><div className="flex flex-col gap-4"><label className="min-w-0"><span className={labelClass}>Cuenta Control</span><select data-validation-error={validationErrors.controlAccount || undefined} aria-invalid={Boolean(validationErrors.controlAccount)} className={`${fieldClass} ${validationErrors.controlAccount ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={controlAccount} onChange={(event) => { setControlAccount(event.target.value); clearValidationError('controlAccount'); if (event.target.value !== 'Cobro por ventas') { clearValidationError('cxcDocuments'); setSelectedCxc([]); setCxcAmounts({}) } }}><option value="">Selecciona cuenta control</option><option>Cobro por ventas</option><option>Ingresos operativos</option><option>Gastos administrativos</option><option>Personal</option></select></label>{controlAccount === 'Cobro por ventas' && <div className="flex flex-col gap-3"><div><span className={labelClass}>Cód. Documento (CxC)</span><div className="relative mt-1.5"><div role="group" aria-label="Seleccionar documentos CxC" tabIndex={0} onClick={() => setCxcDropdownOpen((open) => !open)} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === 'Escape') setCxcDropdownOpen(false); if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setCxcDropdownOpen((open) => !open) } }} data-validation-error={validationErrors.cxcDocuments || undefined} aria-invalid={Boolean(validationErrors.cxcDocuments)} className={`flex min-h-11 flex-wrap items-center gap-2 rounded-xl border p-2 transition-all ${validationErrors.cxcDocuments ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20' : 'border-slate-200 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/20'} bg-white`}>{selectedCxc.map((code) => <span key={code} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium">{code}<button type="button" onClick={(event) => { event.stopPropagation(); setFormDirty(true); setSelectedCxc((current) => current.filter((item) => item !== code)); clearValidationError(`cxcAmount:${code}`); setCxcAmounts((current) => { const next = { ...current }; delete next[code]; return next }) }} aria-label={`Quitar ${code}`} className="rounded-full px-1 text-indigo-700 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">×</button></span>)}{selectedCxc.length === 0 && <span className="px-2 text-sm text-slate-400">Seleccionar documentos...</span>}</div>{validationErrors.cxcDocuments && <span className="mt-1 block text-xs text-rose-600">Campo requerido</span>}{cxcDropdownOpen && <div role="listbox" aria-label="Documentos CxC" aria-multiselectable="true" className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg"><div className="sticky top-0 z-10 bg-white pb-2"><label className="sr-only" htmlFor="cxc-document-search">Buscar CxC</label><input id="cxc-document-search" type="search" value={cxcSearch} onChange={(event) => setCxcSearch(event.target.value)} placeholder="Buscar CxC..." className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" /></div><div className="flex flex-col gap-0.5">{cxcDocuments.filter((code) => code.toLowerCase().includes(cxcSearch.trim().toLowerCase())).map((code) => <label key={code} role="option" aria-selected={selectedCxc.includes(code)} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"><input type="checkbox" checked={selectedCxc.includes(code)} onChange={(event) => { if (event.target.checked) { setSelectedCxc((current) => current.includes(code) ? current : [...current, code]); clearValidationError('cxcDocuments'); setCxcAmounts((current) => ({ ...current, [code]: current[code] ?? '' })) } else { setSelectedCxc((current) => current.filter((item) => item !== code)); clearValidationError(`cxcAmount:${code}`); setCxcAmounts((current) => { const next = { ...current }; delete next[code]; return next }) } }} className="size-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500" /><span className="font-mono text-[13px] font-medium">{code}</span></label>)}{cxcDocuments.filter((code) => code.toLowerCase().includes(cxcSearch.trim().toLowerCase())).length === 0 && <p className="px-3 py-3 text-sm text-slate-500">No hay documentos que coincidan.</p>}</div></div>}</div></div>{selectedCxc.length > 0 && <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4"><p className="text-xs font-medium text-slate-500">Ingrese el monto del ingreso primero abajo, en el formulario, y detalle en cada CxC el monto correspondiente.</p>{selectedCxc.map((code) => { const otherAllocations = allocatedTotal - (Number(cxcAmounts[code]?.replace(',', '.') ?? '') || 0); const available = Math.max(0, total - otherAllocations); return <div key={code} className="flex flex-wrap items-center justify-between gap-2"><label htmlFor={`cxc-amount-${code}`} className="text-xs font-semibold text-indigo-900">{code}</label><div className="flex flex-wrap items-center gap-2"><input id={`cxc-amount-${code}`} type="number" min="0" max={available} step="0.01" inputMode="decimal" value={cxcAmounts[code] ?? ''} onChange={(event) => { const nextValue = event.target.value; const parsed = Number(nextValue); const boundedValue = nextValue === '' ? '' : String(Math.min(Math.max(parsed || 0, 0), available)); setCxcAmounts((current) => ({ ...current, [code]: boundedValue })); if (Number(boundedValue) > 0) clearValidationError(`cxcAmount:${code}`) }} data-validation-error={validationErrors[`cxcAmount:${code}`] || undefined} aria-invalid={Boolean(validationErrors[`cxcAmount:${code}`])} className={`w-36 rounded-lg border bg-white px-3 py-1.5 text-right text-sm tabular-nums outline-none focus:ring-2 ${validationErrors[`cxcAmount:${code}`] ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-500/20'}`} aria-label={`Monto asignado a ${code}`} />{validationErrors[`cxcAmount:${code}`] && <span className="basis-full text-right text-xs text-rose-600">Campo requerido</span>}<button type="button" onClick={() => { setSelectedCxc((current) => current.filter((item) => item !== code)); clearValidationError(`cxcAmount:${code}`); setCxcAmounts((current) => { const next = { ...current }; delete next[code]; return next }) }} aria-label={`Eliminar ${code}`} className="rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">×</button></div></div> })}<div className="flex items-center justify-between border-t border-slate-200 pt-3 text-xs"><span className="font-medium text-slate-600">Monto restante</span><strong aria-live="polite" className="font-bold tabular-nums text-slate-900">USD {formatMoney(remainingAmount)}</strong></div>{allocatedTotal > total && <p role="alert" className="text-xs font-medium text-rose-600">La distribución no puede superar el monto recibido.</p>}</div>}</div>}<label className="min-w-0"><span className={labelClass}>Cuenta Detalle</span><select className={fieldClass} value={detailAccount} onChange={(event) => setDetailAccount(event.target.value)}><option value="">Selecciona cuenta detalle</option><option>Servicios</option><option>Mano de obra</option><option>Otros ingresos</option></select></label></div></div></div><p className="mt-3 text-[11px] text-slate-400">*MO: Mano de Obra | *PV: Personal de Venta | *PA: Personal de Administración</p></div><div role="table" aria-label="Resultados contables" aria-rowcount={resultRows.length + 1} className="flex min-h-[260px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white lg:col-span-7"><div role="row" className="hidden grid-cols-3 gap-2 border-b border-slate-200/80 bg-slate-50/90 px-4 py-3 text-xs font-semibold text-slate-700 sm:grid"><span role="columnheader" className="min-w-0 break-words">Concepto Atenas</span><span role="columnheader" className="min-w-0 break-words">Cuenta Control</span><span role="columnheader" className="min-w-0 break-words">Cuenta Detalle</span></div><div role="rowgroup" aria-live="polite" className="flex flex-1 flex-col">{resultRows.length === 0 ? <div className="flex flex-1 flex-col items-center justify-center p-6 text-center"><p role="status" className="text-xs font-medium text-slate-500">Resultado: 0</p></div> : <div className="flex-1 p-4"><p role="status" className="mb-3 text-xs font-medium text-slate-500">Resultado: {resultRows.length}</p><div className="flex flex-col gap-2">{resultRows.map((row) => <div key={row.id} role="row" className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-3 text-xs text-slate-700 sm:grid-cols-3 sm:gap-2"><span role="cell" className="min-w-0 break-words"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Concepto Atenas</span>{row.concept}</span><span role="cell" className="min-w-0 break-words"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Cuenta Control</span>{row.control}</span><span role="cell" className="min-w-0 break-words"><span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Cuenta Detalle</span>{row.detail}</span></div>)}</div></div>}</div></div></div>
      <div aria-hidden="true" className="my-6 border-t border-slate-100" /><div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-14">{currencyFields.map(({ key, label }) => { const hasAmount = parseAmount(amounts[key]) > 0; const bankLabel = key === 'bs' ? 'Banco Nacional' : 'Banco Internacional'; const hasBankCascade = key === 'bs' || key === 'usd'; return <div key={key} className={`flex min-w-0 flex-col gap-2 ${hasBankCascade ? 'lg:col-span-3' : 'lg:col-span-2'}`}><label className="min-w-0"><span className="mb-1.5 block truncate text-xs font-semibold text-slate-700">{label}</span><input data-validation-error={validationErrors[`amount:${key}`] || undefined} aria-invalid={Boolean(validationErrors[`amount:${key}`])} className={`${currencyFieldClass} h-11 ${validationErrors[`amount:${key}`] ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={amounts[key]} onChange={(event) => updateAmount(key, event.target.value)} inputMode="decimal" placeholder="0,00" /><span className="mt-1 block min-h-[20px] text-xs text-rose-600">{validationErrors[`amount:${key}`] ? 'Campo requerido' : ''}</span></label>{hasBankCascade && <div data-active={hasAmount} aria-hidden={!hasAmount} className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none data-[active=true]:grid-rows-[1fr] data-[active=true]:opacity-100"><div className="flex min-h-0 flex-col gap-2 overflow-hidden"><label className="min-w-0"><span className="sr-only">{bankLabel} para {label}</span><select data-validation-error={validationErrors[`bank:${key}`] || undefined} aria-invalid={Boolean(validationErrors[`bank:${key}`])} aria-label={`${bankLabel} para ${label}`} className={`${fieldClass} min-w-0 px-2 text-xs ${validationErrors[`bank:${key}`] ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : ''}`} value={bankSelections[key]} disabled={!hasAmount} onChange={(event) => { setBankSelections((current) => ({ ...current, [key]: event.target.value })); setBankReferences((current) => ({ ...current, [key]: '' })); if (event.target.value) clearValidationError(`bank:${key}`) }}><option value="">Seleccione {bankLabel}</option>{bankOptions.map((bank) => <option key={bank} value={bank}>{bank}</option>)}</select>{validationErrors[`bank:${key}`] && <span className="block text-xs text-rose-600">Campo requerido</span>}</label>{bankSelections[key] && <label className="min-w-0"><span className="sr-only">No. de Referencia para {label}</span><input aria-label={`No. de Referencia para ${label}`} className={`${fieldClass} px-2 text-[10px]`} type="text" value={bankReferences[key]} onChange={(event) => setBankReferences((current) => ({ ...current, [key]: event.target.value }))} placeholder="No. de Referencia" /></label>}</div></div>}</div> })}<div className="min-w-0 lg:col-span-2"><span className="mb-1.5 block truncate whitespace-nowrap text-xs font-semibold text-slate-700" title="Monto recibido">Monto recibido</span><div aria-label="Monto recibido calculado" aria-live="polite" className="flex h-10 items-center justify-end rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold tabular-nums text-slate-900">{total.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</div></div><button type="button" onClick={calculate} className="mt-[22px] inline-flex h-10 w-full self-start items-center justify-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-4 text-xs font-semibold text-slate-800 transition-all hover:bg-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 lg:col-span-2"><ArrowDownUp className="size-4" />Auto calcular</button></div>
      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><span role="status" className="text-xs font-medium text-emerald-700">{saved ? 'Asiento guardado correctamente.' : ''}</span><div className="flex justify-end gap-2"><button type="button" onClick={() => formDirty ? setDiscardDialogOpen(true) : resetIncomeForm()} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Cancelar</button><button type="button" onClick={saveIncomeForm} disabled={allocatedTotal > total} className="rounded-full bg-[#1E2B58] disabled:cursor-not-allowed disabled:opacity-50 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#151F42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58] focus-visible:ring-offset-2">{editingRecordId ? 'Guardar cambios' : 'Guardar asiento'}</button></div></div>
    </section>
    </form>
    <Dialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
      <DialogContent showCloseButton={false} overlayClassName="bg-slate-900/40" className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold text-[#1E2B58]">¿Descartar cambios?</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-600">Sus cambios no han sido guardados.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
          <button type="button" onClick={() => setDiscardDialogOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58] focus-visible:ring-offset-2">Seguir editando</button>
          <button type="button" onClick={() => { resetIncomeForm(); setDiscardDialogOpen(false) }} className="rounded-xl bg-[#1E2B58] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#151F42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58] focus-visible:ring-offset-2">Descartar</button>
        </div>
      </DialogContent>
    </Dialog>

    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm" aria-labelledby="cashflow-heading"><CashflowToolbar recordCount={visibleRows.length} search={search} onSearchChange={setSearch} activeFilterCount={hiddenColumnCount} onOpenFilters={() => { setDraftFilters(activeFilters); setIsOpen(true) }} onDownload={downloadCsv} onRefresh={() => setSearch('')} /><div role="region" aria-labelledby="cashflow-heading" tabIndex={0} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 160 : -160, behavior: 'smooth' }) } }} className="relative overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scroll-smooth overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"><p className="border-b border-slate-100 px-4 py-2 text-[10px] text-slate-400 lg:hidden">Desliza horizontalmente para ver el resto de columnas.</p><style>{filterColumns.filter(({ id }) => !activeFilters[id]).map(({ column }) => { const index = tableColumns.indexOf(column) + 1; return `.cashflow-filterable-table th:nth-child(${index}), .cashflow-filterable-table td:nth-child(${index}) { display: none !important; }` }).join('\n')}</style><table className="cashflow-filterable-table w-full min-w-[3000px] table-fixed text-left text-sm text-slate-700"><caption className="sr-only">Movimientos con información bancaria, contable y financiera</caption><colgroup>{columnWidths.map((width, index) => { const option = filterColumns.find(({ column }) => column === tableColumns[index]); return <col key={tableColumns[index]} hidden={Boolean(option && !activeFilters[option.id])} style={{ width }} /> })}</colgroup><thead className="border-b border-slate-200/80 bg-slate-50/80"><tr>{tableColumns.map((heading) => { const option = filterColumns.find(({ column }) => column === heading); return <th key={heading} hidden={Boolean(option && !activeFilters[option.id])} scope="col" className={`whitespace-nowrap border-b border-slate-200/80 px-4 py-3 text-xs font-semibold uppercase text-slate-500 ${['Ingreso', 'Desembolso', 'USD', 'USD Efectivo', 'Bs.', 'Bs. Efectivo', 'Tasa'].includes(heading) ? 'text-right' : 'text-left'} ${heading === 'Acciones' ? 'sticky right-0 z-10 bg-white shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]' : ''}`}>{heading}</th> })}</tr></thead><tbody>{pagedRows.length ? pagedRows.map((row) => <tr key={row.id} className="group border-b border-slate-100 whitespace-nowrap text-sm text-slate-700 transition-colors last:border-0 hover:bg-slate-50/80"><td className="px-4 py-3 text-xs tabular-nums text-slate-600">{row.date}</td><td className="px-4 py-3"><span className="block font-medium">{row.description}</span><span className="mt-0.5 block text-[10px] text-slate-500">{row.id} · {row.subtitle}</span></td><td className={`px-4 py-3 text-right text-xs tabular-nums ${parseAmount(row.income) !== 0 ? 'font-semibold text-slate-900' : 'font-normal text-slate-300'}`}>{row.income}</td><td className="px-4 py-3 text-xs"><PaymentMethodBadges row={row} /></td><td className={`px-4 py-3 text-right text-xs tabular-nums ${parseAmount(row.usd) !== 0 ? 'font-semibold text-slate-900' : 'font-normal text-slate-300'}`}>{row.usd}</td><td className={`px-4 py-3 text-right text-xs tabular-nums ${parseAmount(row.cashUsd) !== 0 ? 'font-semibold text-slate-900' : 'font-normal text-slate-300'}`}>{row.cashUsd}</td><td className={`px-4 py-3 text-right text-xs tabular-nums ${parseAmount(row.bs) !== 0 ? 'font-semibold text-slate-900' : 'font-normal text-slate-300'}`}>{row.bs}</td><td className={`px-4 py-3 text-right text-xs tabular-nums ${parseAmount(row.cashBs) !== 0 ? 'font-semibold text-slate-900' : 'font-normal text-slate-300'}`}>{row.cashBs}</td><td className="px-4 py-3 text-xs text-slate-600">{row.bankNational || '—'}</td><td className="px-4 py-3 text-xs tabular-nums text-slate-600">{row.bankNationalReference || '—'}</td><td className="px-4 py-3 text-xs text-slate-600">{row.bankInternational || '—'}</td><td className="px-4 py-3 text-xs tabular-nums text-slate-600">{row.bankInternationalReference || '—'}</td><td className="px-4 py-3 text-right text-xs tabular-nums text-slate-600">{row.rate}</td><td className="px-4 py-3 text-xs tabular-nums text-slate-600"><div className="relative inline-flex items-center gap-2"><span>{row.cxcDocument}</span>{row.cxcDocuments.length > 1 && <><button type="button" aria-label={`Ver todos los documentos CxC de ${row.id}`} aria-expanded={openCxcRow === row.id} aria-haspopup="dialog" onClick={() => setOpenCxcRow((current) => current === row.id ? null : row.id)} className="cursor-pointer text-[#1E2B58] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30">•••</button>{openCxcRow === row.id && <div ref={cxcPopoverRef} role="dialog" aria-label={`Documentos CxC asociados a ${row.id}`} className="absolute left-0 top-full z-50 mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-700 shadow-xl"><ul className="space-y-1.5">{row.cxcDocuments.map((documentCode) => <li key={documentCode} className="whitespace-nowrap text-xs tabular-nums">{documentCode}</li>)}</ul></div>}</>}</div></td><td className="px-4 py-3 text-xs text-slate-600">—</td><td className="px-4 py-3 text-xs"><span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#D4D8FF] px-3.5 py-1 text-xs font-medium text-[#1E2B58]">{row.concept}</span></td><td className="px-4 py-3 text-xs text-slate-600">—</td><td className="px-4 py-3 text-xs"><span className="inline-flex items-center whitespace-nowrap rounded-full bg-[#F7DAC1] px-3.5 py-1 text-xs font-medium text-[#3B2618]">{row.unit}</span></td><td className="max-w-[260px] truncate px-4 py-3 text-xs text-slate-600" title={row.observation}>{row.observation}</td><td className="px-4 py-3 text-xs text-slate-600">—</td><td className="sticky right-0 z-10 bg-white px-4 py-3 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)] transition-colors group-hover:bg-slate-50"><div className="flex items-center gap-1"><RowAction label="Editar registro" rowId={row.id} tone="indigo" onClick={() => editIncomeRecord(row)}><Pencil className="size-3.5" /></RowAction><RowAction label="Eliminar registro" rowId={row.id} tone="rose"><Trash2 className="size-3.5" /></RowAction></div></td></tr>) : <tr><td colSpan={tableColumns.length} role="status" className="px-5 py-10 text-center text-xs text-slate-500">No se encontraron movimientos.</td></tr>}</tbody></table></div><footer className="border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500"><div className="flex flex-col gap-3 px-5 py-3 xl:flex-row xl:items-center xl:justify-between"><dl className="flex flex-wrap items-center gap-x-5 gap-y-1.5"><div className="flex items-center gap-1.5"><dt>Total Ingresos:</dt><dd className="font-semibold tabular-nums text-slate-900">Bs. {formatMoney(periodIncome)}</dd></div><div className="flex items-center gap-1.5"><dt>Total USD:</dt><dd className="font-semibold tabular-nums text-slate-900">$ {formatMoney(periodUsd)}</dd></div></dl><TablePagination page={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} /></div><div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-2 text-[11px]"><span role="status" className="tabular-nums">Mostrando {pagedRows.length} de {visibleRows.length} registros</span><span>ATENAS ERP · Tesorería</span></div></footer></section>
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!isOpen}>
      <button type="button" tabIndex={isOpen ? 0 : -1} aria-label="Cerrar filtros" onClick={() => setIsOpen(false)} className={`absolute inset-0 size-full bg-slate-950/30 opacity-0 transition-opacity ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none'}`} />
      <aside role="dialog" aria-modal={isOpen} aria-labelledby="cashflow-filter-title" aria-hidden={!isOpen} inert={!isOpen} onKeyDown={(event) => { if (event.key === 'Escape') setIsOpen(false) }} className={`fixed inset-y-0 right-0 z-[51] flex w-80 max-w-[calc(100vw-2rem)] flex-col justify-between border-l border-slate-200 bg-white p-6 shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="mb-5 flex items-center justify-between gap-3">
            <h2 id="cashflow-filter-title" className="text-base font-bold text-slate-900">Filtro</h2>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setDraftFilters(Object.fromEntries(filterColumns.map(({ id }) => [id, false])) as typeof allFilterColumns)} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30">Limpiar</button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar filtro" className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"><span aria-hidden="true" className="text-xl leading-none">×</span></button>
            </div>
          </header>
          <fieldset className="min-h-0 flex-1 overflow-y-auto border-0 p-0">
            <legend className="sr-only">Columnas visibles en Registro de Ingresos</legend>
            <div className="flex flex-col gap-1">
              {filterColumns.map(({ id, label }) => <label key={id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"><input type="checkbox" checked={draftFilters[id]} onChange={(event) => setDraftFilters((current) => ({ ...current, [id]: event.target.checked }))} className="size-4 rounded border-slate-300 accent-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40" /><span>{label}</span></label>)}
            </div>
          </fieldset>
        </div>
        <div className="mt-5 border-t border-slate-100 pt-4">
          <button type="button" onClick={() => { setActiveFilters(draftFilters); setIsOpen(false) }} className="w-full rounded-full bg-[#1E2B58] py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#151F42] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58] focus-visible:ring-offset-2">Aplicar</button>
        </div>
      </aside>
    </div>
  </div>
}
