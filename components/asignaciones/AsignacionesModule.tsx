'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CalendarX2, Check } from 'lucide-react'

import TraceabilityDrawer from '../TraceabilityDrawer'
import { Sidebar, Topbar } from '../personas/Shell'
import { CloseValidityDialog, ReassignDialog } from './AssignmentDialogs'
import { GovernedAssignment, SystemMetadata, ValidityControl } from './AssignmentFormBlocks'
import AssignmentHero from './AssignmentHero'
import HistoryTable, { type HistoryFilter } from './HistoryTable'
import {
  CURRENT_USER,
  MIN_REASON,
  TODAY,
  buildEvent,
  clients,
  formatDate,
  initialAssignments,
  initialEvents,
  isActive,
  portfolioName,
  shiftDays,
  type Assignment,
  type AssignmentDraft,
  type AssignmentEvent,
  type DraftErrors,
} from './data'

const emptyDraft = (clientId = ''): AssignmentDraft => ({ clientId, portfolioId: '', type: 'Principal', from: TODAY, to: '', reason: '' })

const nowTime = () => new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })

export default function AsignacionesModule({ contextClientId }: { contextClientId?: string }) {
  const router = useRouter()
  const contextClient = clients.find((client) => client.id === contextClientId)
  const isContextual = Boolean(contextClient)

  const [collapsed, setCollapsed] = useState(false)
  const [records, setRecords] = useState<Assignment[]>(initialAssignments)
  const [events, setEvents] = useState<AssignmentEvent[]>(initialEvents)
  const [draft, setDraft] = useState<AssignmentDraft>(() => emptyDraft(contextClient?.id))
  const [errors, setErrors] = useState<DraftErrors>({})
  const [filter, setFilter] = useState<HistoryFilter>('todos')
  const [closeTargetId, setCloseTargetId] = useState<string | null>(null)
  const [reassignOpen, setReassignOpen] = useState(false)
  const [trace, setTrace] = useState<{ assignmentId?: string } | null>(null)
  const [notice, setNotice] = useState('')
  const noticeTimer = useRef<number | undefined>(undefined)
  const sequence = useRef(90)

  const selectedClient = clients.find((client) => client.id === draft.clientId)
  const clientRecords = useMemo(
    () => (selectedClient ? records.filter((record) => record.clientId === selectedClient.id) : records).toSorted((a, b) => b.from.localeCompare(a.from)),
    [records, selectedClient],
  )
  const activeRecord = selectedClient ? clientRecords.find(isActive) : undefined
  const heroRecord = activeRecord ?? (selectedClient ? clientRecords[0] : undefined)
  const closeTarget = records.find((record) => record.id === closeTargetId)
  const reasonBlocking = Boolean(activeRecord) && draft.reason.trim().length < MIN_REASON

  const flash = (message: string) => {
    window.clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
  }

  const update = <K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const changeClient = (clientId: string) => {
    setDraft(emptyDraft(clientId))
    setErrors({})
    setFilter('todos')
  }

  const validate = () => {
    const next: DraftErrors = {}
    if (!draft.clientId) next.clientId = 'Seleccione un cliente del catálogo gobernado.'
    if (!draft.portfolioId) next.portfolioId = 'Seleccione la cartera de destino.'
    else if (activeRecord && activeRecord.portfolioId === draft.portfolioId && activeRecord.type === draft.type)
      next.portfolioId = 'El cliente ya está vigente en esta cartera con el mismo tipo.'
    if (!draft.from) next.from = 'Indique la fecha de inicio de vigencia.'
    else if (activeRecord && draft.from <= activeRecord.from)
      next.from = `Debe ser posterior al inicio vigente (${formatDate(activeRecord.from)}).`
    if (draft.to && draft.from && draft.to <= draft.from) next.to = 'Debe ser posterior a “Vigente desde”.'
    if (activeRecord && draft.reason.trim().length < MIN_REASON) next.reason = `Justifique la reasignación (mínimo ${MIN_REASON} caracteres).`
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      const element = document.getElementById(`draft-${first}`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus({ preventScroll: true })
    }
    return !first
  }

  const register = () => {
    if (!validate()) {
      flash('Revise los campos marcados antes de registrar')
      return
    }
    if (activeRecord) setReassignOpen(true)
    else commitAssignment()
  }

  const commitAssignment = () => {
    sequence.current += 1
    const created: Assignment = {
      id: `ASG-2026-${String(sequence.current).padStart(4, '0')}`,
      clientId: draft.clientId,
      portfolioId: draft.portfolioId,
      type: draft.type,
      from: draft.from,
      to: draft.to || null,
      author: CURRENT_USER.name,
      createdAt: TODAY,
      reason: draft.reason.trim() || 'Asignación inicial del cliente a cartera.',
    }
    const closingDate = shiftDays(draft.from, -1)
    const stamp = { date: formatDate(TODAY), time: nowTime() }
    const newEvents: AssignmentEvent[] = [buildEvent(created, 'create', { ...stamp, reference: `AUD-${created.id}-A-${Date.now()}` })]

    if (activeRecord) {
      const closed: Assignment = { ...activeRecord, to: closingDate, closeReason: `Cierre automático por reasignación a ${portfolioName(created.portfolioId)} (${created.id}).` }
      newEvents.push(buildEvent(closed, 'close', { ...stamp, user: CURRENT_USER.name, reference: `AUD-${closed.id}-C-${Date.now()}` }))
    }

    setRecords((current) => [created, ...current.map((record) => (activeRecord && record.id === activeRecord.id ? { ...record, to: closingDate } : record))])
    setEvents((current) => [...newEvents, ...current])
    setDraft(emptyDraft(draft.clientId))
    setErrors({})
    setFilter('todos')
    setReassignOpen(false)
    flash(activeRecord ? `Reasignación aplicada · ${created.id}` : `Asignación ${created.id} registrada`)
  }

  const confirmClose = (reason: string) => {
    if (!closeTarget) return
    const endDate = closeTarget.from > TODAY ? closeTarget.from : TODAY
    const closed: Assignment = { ...closeTarget, to: endDate, closeReason: reason }
    setRecords((current) => current.map((record) => (record.id === closed.id ? closed : record)))
    setEvents((current) => [
      buildEvent(closed, 'close', { date: formatDate(TODAY), time: nowTime(), user: CURRENT_USER.name, reference: `AUD-${closed.id}-C-${Date.now()}` }),
      ...current,
    ])
    setCloseTargetId(null)
    flash(`Vigencia de ${closed.id} cerrada al ${formatDate(endDate)}`)
  }

  const cancel = () => {
    setDraft(emptyDraft(isContextual ? draft.clientId : selectedClient?.id))
    setErrors({})
    flash('Cambios descartados')
  }

  const goBack = () => {
    if (window.history.length > 1) router.back()
    else router.push('/maestro-cartera')
  }

  const closeTrace = useCallback(() => setTrace(null), [])
  const cancelClose = useCallback(() => setCloseTargetId(null), [])
  const cancelReassign = useCallback(() => setReassignOpen(false), [])

  const traceEvents = trace
    ? events.filter((event) => (trace.assignmentId ? event.assignmentId === trace.assignmentId : event.clientId === selectedClient?.id))
    : []

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} active="asignaciones" />
      <section className="content flex min-h-screen flex-col">
        <Topbar section="Estructura comercial" />

        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
          <header className="flex flex-col gap-2">
            {isContextual && (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-[#2A4B93] hover:underline"
              >
                <ArrowLeft size={13} aria-hidden="true" />
                Volver a la Ficha del Cliente
              </button>
            )}
            <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {isContextual ? (
                <>
                  <span>Clientes</span>
                  <span aria-hidden="true" className="text-slate-300">›</span>
                  <span>{contextClient?.name}</span>
                </>
              ) : (
                <>
                  <span>Catálogos maestros</span>
                  <span aria-hidden="true" className="text-slate-300">›</span>
                  <Link href="/maestro-cartera" className="transition-colors hover:text-[#2A4B93]">Estructura comercial</Link>
                </>
              )}
              <span aria-hidden="true" className="text-slate-300">›</span>
              <span aria-current="page" className="font-semibold text-slate-700">Asignaciones de cartera</span>
            </nav>
            <h1 className="m-0 text-2xl font-bold text-slate-900 md:text-3xl text-balance">Asignaciones de cartera comercial</h1>
            <p className="m-0 max-w-3xl text-sm leading-relaxed text-slate-500 text-pretty">
              Asignar clientes a carteras preservando la vigencia temporal y el historial inmutable de reasignaciones.
            </p>
          </header>

          <AssignmentHero client={selectedClient} assignment={heroRecord} onTrace={() => setTrace({})} />

          <GovernedAssignment
            draft={draft}
            errors={errors}
            clients={clients}
            clientLocked={isContextual}
            onChange={update}
            onClientChange={changeClient}
          />

          <SystemMetadata assignment={heroRecord} />

          <ValidityControl draft={draft} errors={errors} reasonRequired={Boolean(activeRecord)} onChange={update} />

          <HistoryTable
            records={clientRecords}
            filter={filter}
            showingAllClients={!selectedClient}
            onFilterChange={setFilter}
            onClose={setCloseTargetId}
            onDetails={(assignmentId) => setTrace({ assignmentId })}
          />

          <div className="sticky bottom-0 z-30 -mx-1 flex flex-col gap-3 rounded-b-3xl border-t border-slate-200 bg-white/90 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={cancel}
              className="order-last rounded-full border border-slate-200 px-5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 sm:order-none"
            >
              Cancelar
            </button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => activeRecord && setCloseTargetId(activeRecord.id)}
                disabled={!activeRecord}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber-50"
              >
                <CalendarX2 size={14} aria-hidden="true" />
                Cerrar vigencia actual
              </button>
              <button
                type="button"
                onClick={register}
                disabled={reasonBlocking}
                aria-describedby={reasonBlocking ? 'draft-reason-hint' : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2A4B93] px-6 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E366B] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#2A4B93]"
              >
                <Check size={14} aria-hidden="true" />
                Registrar asignación / Reasignar
              </button>
            </div>
          </div>
        </div>
      </section>

      {trace && (
        <TraceabilityDrawer
          recordId={trace.assignmentId ? `ID: ${trace.assignmentId}` : `Cliente: ${selectedClient?.id ?? 'Todos'}`}
          events={traceEvents}
          onClose={closeTrace}
        />
      )}

      {closeTarget && (
        <CloseValidityDialog
          key={closeTarget.id}
          subject={`${closeTarget.id} · ${portfolioName(closeTarget.portfolioId)}`}
          onConfirm={confirmClose}
          onCancel={cancelClose}
        />
      )}

      {reassignOpen && activeRecord && (
        <ReassignDialog
          fromPortfolio={portfolioName(activeRecord.portfolioId)}
          toPortfolio={portfolioName(draft.portfolioId)}
          closingDate={formatDate(shiftDays(draft.from, -1))}
          onConfirm={commitAssignment}
          onCancel={cancelReassign}
        />
      )}

      {notice && (
        <div role="status" className="client-toast">
          <Check size={16} aria-hidden="true" />
          {notice}
        </div>
      )}
    </main>
  )
}
