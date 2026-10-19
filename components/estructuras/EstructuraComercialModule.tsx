'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, Calendar, ChevronDown, ChevronRight, FileText, GitBranch, History, Lock, Search, X } from 'lucide-react'
import { Sidebar, Topbar } from '../personas/Shell'
import DiscardChangesModal from '../asignaciones/DiscardChangesModal'

type Node = { id: string; name: string; type: string; parentId?: string; unit: string; children?: Node[] }

type Member = { id: string; person: string; role: string; node: string; condition: string; from: string; to: string; reason: string }

const nodes: Node[] = [
  { id: 'DIR-001', name: 'Dirección General', type: 'Dirección', unit: 'Corporativo', children: [
    { id: 'COM-001', name: 'Gerencia Comercial', type: 'Gerencia', parentId: 'DIR-001', unit: 'Comercial', children: [
      { id: 'EQU-001', name: 'Equipo Consultoría', type: 'Equipo', parentId: 'COM-001', unit: 'Servicios de consultoría' },
      { id: 'EQU-002', name: 'Equipo Desarrollo', type: 'Equipo', parentId: 'COM-001', unit: 'Desarrollo de negocio' },
    ] },
    { id: 'OPE-001', name: 'Gerencia de Operaciones', type: 'Gerencia', parentId: 'DIR-001', unit: 'Operaciones' },
  ] },
]

const initialMembers: Member[] = [
  { id: 'ADS-0042', person: 'María González', role: 'Líder comercial', node: 'Gerencia Comercial', condition: 'Principal', from: '01/01/2026', to: '—', reason: 'Adscripción inicial por estructura vigente.' },
  { id: 'ADS-0038', person: 'Carlos Ramírez', role: 'Consultor senior', node: 'Equipo Consultoría', condition: 'Secundaria', from: '15/08/2025', to: '31/12/2025', reason: 'Reasignación por cambio de unidad organizacional.' },
]

function flatten(items: Node[]): Node[] { return items.flatMap((item) => [item, ...(item.children ? flatten(item.children) : [])]) }

export default function EstructuraComercialModule() {
  const [collapsed, setCollapsed] = useState(false)
  const [form, setForm] = useState({ code: 'EQU-003', type: 'Equipo', parent: 'COM-001', name: 'Equipo Estratégico', unit: 'Desarrollo de negocio', status: 'Activo', validFrom: '2026-01-01', validTo: '' })
  const [member, setMember] = useState({ person: '', role: '', condition: 'Principal', from: '', to: '', reason: '' })
  const [members, setMembers] = useState(initialMembers)
  const [treeOpen, setTreeOpen] = useState(false)
  const [treeSearch, setTreeSearch] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'DIR-001': true, 'COM-001': true })
  const [selectedMemberForAction, setSelectedMemberForAction] = useState<Member | null>(null)
  const [isReasignarOpen, setIsReasignarOpen] = useState(false)
  const [isCerrarVigenciaOpen, setIsCerrarVigenciaOpen] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [actionNode, setActionNode] = useState('Equipo Consultoría')
  const [actionDate, setActionDate] = useState('2026-10-19')
  const [actionReason, setActionReason] = useState('')

  const allNodes = useMemo(() => flatten(nodes), [])
  const invalidParent = form.parent === form.code || form.parent === 'EQU-002'
  const isDirty = Object.values(form).some(Boolean) || member.person !== ''
  const visibleNodes = allNodes.filter((node) => `${node.id} ${node.name}`.toLowerCase().includes(treeSearch.toLowerCase()))

  const update = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setSaved(false) }
  const assignMember = () => {
    if (!member.person || !member.role || !member.from || !member.reason) return
    setMembers((current) => [{ id: `ADS-${String(current.length + 43).padStart(4, '0')}`, person: member.person, role: member.role, node: form.name, condition: member.condition, from: member.from, to: member.to || '—', reason: member.reason }, ...current])
    setMember({ person: '', role: '', condition: 'Principal', from: '', to: '', reason: '' })
  }
  const closeActionModals = () => { setIsReasignarOpen(false); setIsCerrarVigenciaOpen(false); setSelectedMemberForAction(null) }
  const confirmReassignment = () => {
    if (!selectedMemberForAction || !actionNode || !actionDate || !actionReason.trim()) return
    setMembers((current) => current.map((item) => item.id === selectedMemberForAction.id ? { ...item, node: actionNode, from: actionDate.split('-').reverse().join('/'), reason: actionReason.trim() } : item))
    closeActionModals()
  }
  const confirmClosure = () => {
    if (!selectedMemberForAction || !actionDate || !actionReason.trim()) return
    setMembers((current) => current.map((item) => item.id === selectedMemberForAction.id ? { ...item, to: actionDate.split('-').reverse().join('/'), reason: actionReason.trim() } : item))
    closeActionModals()
  }

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} active="estructuras" />
      <section className="content flex min-h-screen flex-col">
        <Topbar section="Estructura comercial" />
        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-6 px-4 pb-28 pt-6 md:px-8 md:pt-8">
          <header className="flex flex-col gap-2">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500" aria-label="Ruta de navegación"><span>Catálogos maestros</span><span>›</span><span>Estructura comercial</span><span>›</span><span className="font-semibold text-slate-700">Estructura comercial</span></nav>
            <h1 className="m-0 text-xl font-bold text-slate-900">Estructura comercial</h1>
            <p className="m-0 text-sm text-slate-500">Mantener la jerarquía comercial y la adscripción de personas con roles y vigencias.</p>
          </header>

          <div className="flex flex-col gap-6">
            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm mb-6 flex flex-col justify-between">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2A4B93] text-sm font-bold text-white" aria-label="Iniciales del nodo Equipo Estratégico">EE</div>
                    <div><p className="m-0 text-[11px] font-bold tracking-[0.18em] text-slate-500">ESTRUCTURA COMERCIAL</p><h2 className="mt-2 text-xl font-bold text-slate-900">Equipo Estratégico</h2></div>
                  </div>
                  <span className="inline-flex w-fit items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-emerald-700">• Activa</span>
                </div>
                <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>Equipo</span><span aria-hidden="true">|</span><span>Reg: <code className="font-mono">01/01/2026</code></span><span aria-hidden="true">|</span><span className="inline-flex items-center"><Lock aria-hidden="true" className="mr-1 inline-block size-3.5 text-slate-400" />ID: <code className="font-mono">EST-2026-0008</code></span><span aria-hidden="true">|</span><span>Modificado: <code className="font-mono">16/10/2026</code></span>
                  </div>
                  <button type="button" onClick={() => setIsHistoryDrawerOpen(true)} className="flex w-fit cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"><History aria-hidden="true" data-icon="inline-start" />Ver modificaciones de jerarquía</button>
                </div>
              </div>
            </section>

            <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xs">
              <div className="mb-6 flex flex-col gap-1"><h2 className="m-0 text-base font-bold text-slate-900">Definición del nodo de estructura</h2><p className="m-0 text-xs text-slate-500">Configura la identidad y ubicación jerárquica del nodo.</p></div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-slate-100/80 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs mb-5">
                <span className="font-semibold text-[#2A4B93]">Ubicación jerárquica:</span>
                <span className="text-slate-500">Dirección Comercial Central › Gerencia de Ventas Corporativas ›</span>
                <span className="font-semibold text-slate-900">[Equipo Estratégico - Nodo Actual]</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {([['code', 'Código del nodo *', 'text'], ['name', 'Nombre del nodo *', 'text']] as const).map(([key, label, type]) => <label key={key} className="flex flex-col gap-2 text-xs font-semibold text-slate-700">{label}<input type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-[#59A5E2] focus:ring-4 focus:ring-blue-50" /></label>)}
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Tipo de nodo *<select value={form.type} onChange={(event) => update('type', event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]"><option>Equipo</option><option>Gerencia</option><option>Dirección</option><option>Unidad</option></select></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700 lg:col-span-2">Nodo padre (Jerarquía) *<div className="flex gap-2"><select value={form.parent} onChange={(event) => update('parent', event.target.value)} className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]"><option value="COM-001">Gerencia Comercial · COM-001</option><option value="EQU-002">Equipo Desarrollo · EQU-002</option><option value="DIR-001">Dirección General · DIR-001</option></select><button type="button" onClick={() => setTreeOpen(true)} className="whitespace-nowrap rounded-full border border-slate-200 px-3 text-[11px] font-semibold text-[#2A4B93] hover:bg-blue-50">Ver inspección de jerarquía</button></div></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Unidad organizacional *<select value={form.unit} onChange={(event) => update('unit', event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]"><option>Desarrollo de negocio</option><option>Comercial</option><option>Operaciones</option><option>Corporativo</option></select></label>
              </div>
              {invalidParent && <div className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-2xs"><AlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" /><div><p className="font-bold">ASIGNACIÓN NO PERMITIDA:</p><p className="mt-0.5 text-rose-700">No puedes seleccionar este equipo como jefe/padre porque actualmente depende del nodo en edición. Por favor, elige un nivel superior en la organización.</p></div></div>}
              <div className="mt-6 border-t border-slate-100 pt-6"><h3 className="mb-4 text-sm font-bold text-slate-900">Estado y vigencia del nodo *</h3><div className="grid gap-4 md:grid-cols-3"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Estado *<select value={form.status} onChange={(event) => update('status', event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]"><option>Activo</option><option>Inactivo</option><option>Programado</option></select></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Desde *<input type="date" value={form.validFrom} onChange={(event) => update('validFrom', event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Hasta<input type="date" value={form.validTo} onChange={(event) => update('validTo', event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label></div></div>
            </section>

            <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xs">
              <div className="mb-6 flex flex-col gap-1"><h2 className="m-0 text-base font-bold text-slate-900">Asignación de miembros adscritos</h2><p className="m-0 text-xs text-slate-500">Registra responsables, roles y vigencias históricas.</p></div>
              <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Persona<input type="text" value={member.person} onChange={(event) => setMember((current) => ({ ...current, person: event.target.value }))} placeholder="Buscar persona" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Rol<select value={member.role} onChange={(event) => setMember((current) => ({ ...current, role: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal"><option value="">Seleccionar rol</option><option>Líder comercial</option><option>Consultor senior</option><option>Analista comercial</option></select></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Condición principal<select value={member.condition} onChange={(event) => setMember((current) => ({ ...current, condition: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal"><option>Principal</option><option>Secundaria</option></select></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Vigencia desde<input type="date" value={member.from} onChange={(event) => setMember((current) => ({ ...current, from: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Vigencia hasta<input type="date" value={member.to} onChange={(event) => setMember((current) => ({ ...current, to: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label>
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Motivo de reasignación / ingreso *<input type="text" required value={member.reason} onChange={(event) => setMember((current) => ({ ...current, reason: event.target.value }))} placeholder="Indica el motivo" className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label>
                <div className="flex justify-end lg:col-span-3"><button type="button" onClick={assignMember} className="cursor-pointer rounded-full bg-[#2A4B93] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#1E366B]">Asignar miembro a estructura</button></div>
              </div>
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs mt-4">
                <table className="w-full min-w-[1200px] border-collapse text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="min-w-[200px] px-5 py-3.5 whitespace-nowrap">Persona</th>
                      <th className="min-w-[160px] px-4 py-3.5 whitespace-nowrap">Rol organizacional</th>
                      <th className="min-w-[180px] px-4 py-3.5 whitespace-nowrap">Unidad / Nodo</th>
                      <th className="min-w-[120px] px-4 py-3.5 whitespace-nowrap">Condición</th>
                      <th className="min-w-[190px] px-4 py-3.5 whitespace-nowrap">Vigencia</th>
                      <th className="min-w-[200px] px-4 py-3.5 whitespace-nowrap">Motivo</th>
                      <th className="sticky right-0 z-20 min-w-[230px] bg-slate-50 px-5 py-3.5 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="min-w-[200px] px-5 py-3.5 whitespace-nowrap"><span className="block font-semibold text-slate-800">{item.person}</span><span className="block font-mono text-[11px] text-slate-400">{item.id}</span></td>
                        <td className="min-w-[160px] px-4 py-3.5 whitespace-nowrap text-slate-700">{item.role}</td>
                        <td className="min-w-[180px] px-4 py-3.5 whitespace-nowrap text-slate-700">{item.node}</td>
                        <td className="min-w-[120px] px-4 py-3.5 whitespace-nowrap"><span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">{item.condition}</span></td>
                        <td className="min-w-[190px] px-4 py-3.5 whitespace-nowrap font-mono text-slate-600">{item.from} — {item.to === '—' ? 'Vigente' : item.to}</td>
                        <td className="min-w-[200px] px-4 py-3.5 text-slate-600">{item.reason}</td>
                        <td className="sticky right-0 z-10 min-w-[230px] bg-white px-5 py-3.5 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap"><div className="flex items-center justify-end gap-2"><button type="button" onClick={() => { setSelectedMemberForAction(item); setActionNode(item.node); setActionDate('2026-10-19'); setActionReason(''); setIsReasignarOpen(true) }} className="cursor-pointer whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#2A4B93] hover:bg-slate-50">Reasignar</button><button type="button" onClick={() => { setSelectedMemberForAction(item); setActionDate('2026-10-19'); setActionReason(''); setIsCerrarVigenciaOpen(true) }} className="cursor-pointer whitespace-nowrap rounded-full border border-amber-300/80 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-800 hover:bg-amber-100">Cerrar vigencia</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="fixed inset-x-0 bottom-0 z-30 flex w-full items-center justify-between gap-4 border-t border-slate-200/80 bg-white px-8 py-4"><button type="button" onClick={() => isDirty ? setDiscardOpen(true) : undefined} className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button><button type="button" disabled={invalidParent} onClick={() => setSaved(true)} className="rounded-full bg-[#2A4B93] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E366B] disabled:cursor-not-allowed disabled:opacity-50">{saved ? 'Estructura guardada' : 'Guardar estructura comercial'}</button></div>
          </div>
        </div>
      </section>

      {isReasignarOpen && selectedMemberForAction && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="reasignar-title"><div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.12em] text-[#2A4B93]">Acción sobre adscripción</p><h2 id="reasignar-title" className="mt-2 text-lg font-bold text-slate-900">Reasignar miembro de estructura</h2></div><button type="button" onClick={closeActionModals} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar modal"><X aria-hidden="true" /></button></div><div className="mt-5 rounded-2xl border border-[#cfe0f7] bg-[#f3f7fd] p-4 text-xs"><p className="m-0 font-bold text-slate-900">{selectedMemberForAction.person}</p><p className="mt-1 font-mono text-slate-500">ID: {selectedMemberForAction.id}</p><p className="mt-2 text-slate-600">Nodo actual: <span className="font-semibold text-slate-800">{selectedMemberForAction.node}</span></p></div><div className="mt-5 grid gap-4"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Nuevo Nodo / Unidad Destino *<select value={actionNode} onChange={(event) => setActionNode(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]"><option>Dirección General</option><option>Gerencia Comercial</option><option>Equipo Consultoría</option><option>Equipo Desarrollo</option><option>Gerencia de Operaciones</option></select></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Nueva Fecha de Vigencia / Cambio *<input type="date" value={actionDate} onChange={(event) => setActionDate(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Motivo de Reasignación *<textarea required value={actionReason} onChange={(event) => setActionReason(event.target.value)} placeholder="Indica la justificación o número de caso/solicitud..." className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label></div><div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={closeActionModals} className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button type="button" onClick={confirmReassignment} disabled={!actionNode || !actionDate || !actionReason.trim()} className="rounded-full bg-[#2A4B93] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1E366B] disabled:cursor-not-allowed disabled:opacity-50">Confirmar Reasignación</button></div></div></div>}
      {isCerrarVigenciaOpen && selectedMemberForAction && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="cerrar-title"><div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.12em] text-amber-700">Acción sobre adscripción</p><h2 id="cerrar-title" className="mt-2 text-lg font-bold text-slate-900">Cerrar vigencia de adscripción</h2></div><button type="button" onClick={closeActionModals} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar modal"><X aria-hidden="true" /></button></div><div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">Esta acci��n finalizará la adscripción activa de <strong>{selectedMemberForAction.person}</strong> en el nodo actual.</div><div className="mt-5 grid gap-4"><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Fecha de Término / Cierre *<input type="date" value={actionDate} onChange={(event) => setActionDate(event.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label><label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Motivo de Cierre de Vigencia *<textarea required value={actionReason} onChange={(event) => setActionReason(event.target.value)} placeholder="Indica el motivo del cierre..." className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label></div><div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={closeActionModals} className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancelar</button><button type="button" onClick={confirmClosure} disabled={!actionDate || !actionReason.trim()} className="rounded-full bg-amber-700 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">Finalizar Vigencia</button></div></div></div>}
      {treeOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="tree-title"><div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="tree-title" className="m-0 text-lg font-semibold text-slate-900">Inspección de jerarquía</h2><p className="mt-1 text-xs text-slate-500">Selecciona un nodo padre válido para la estructura.</p></div><button type="button" onClick={() => setTreeOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar modal"><X size={17} /></button></div><label className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={15} className="text-slate-400" /><input value={treeSearch} onChange={(event) => setTreeSearch(event.target.value)} placeholder="Buscar nodo..." className="h-10 w-full text-xs outline-none" /></label><div className="mt-5 flex flex-col gap-2">{visibleNodes.map((node) => <div key={node.id} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-slate-50"><button type="button" onClick={() => setExpanded((current) => ({ ...current, [node.id]: !current[node.id] }))} className="text-slate-400">{node.children ? (expanded[node.id] ? <ChevronDown size={15} /> : <ChevronRight size={15} />) : <span className="inline-block size-[15px]" />}</button><GitBranch size={14} className="text-[#2A4B93]" /><span className="font-semibold text-slate-800">{node.name}</span><span className="text-slate-400">{node.id} · {node.type}</span>{node.id === form.code && <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold text-white">Nodo en edición</span>}</div>)}</div><div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-[10px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-full bg-slate-900" />Nodo en edición</span><span><i className="mr-1 inline-block size-2 rounded-full bg-rose-400" />Posible ciclo</span><span><ChevronDown size={12} className="mr-1 inline" />Colapsar/Expandir</span></div><button type="button" onClick={() => setTreeOpen(false)} className="mt-5 rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">[ CERRAR MODAL ]</button></div></div>}
      {discardOpen && <DiscardChangesModal onConfirm={() => { setDiscardOpen(false); setSaved(false) }} onCancel={() => setDiscardOpen(false)} />}

      {isHistoryDrawerOpen && <div className="fixed inset-0 z-50" role="presentation"><button type="button" aria-label="Cerrar historial" onClick={() => setIsHistoryDrawerOpen(false)} className="absolute inset-0 h-full w-full cursor-default bg-slate-900/40 backdrop-blur-xs" /><aside role="dialog" aria-modal="true" aria-labelledby="history-drawer-title" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300"><header className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"><History aria-hidden="true" /></div><div><p className="m-0 text-[10px] font-bold tracking-wider text-slate-400">HISTORIAL DE AUDITORÍA</p><h2 id="history-drawer-title" className="mt-1 text-base font-bold text-slate-800">Trazabilidad del registro</h2><p className="mt-1 font-mono text-xs text-slate-400">ID: EST-2026-0008</p></div></div><button type="button" onClick={() => setIsHistoryDrawerOpen(false)} className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Cerrar historial"><X aria-hidden="true" /></button></header><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><span className="text-xs font-medium text-slate-500">2 eventos registrados</span><span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded-full flex items-center gap-1.5">• Cadena íntegra</span></div><div className="flex-1 overflow-y-auto px-6 py-6"><ol className="relative flex flex-col gap-4 pl-12 [&>li:nth-of-type(n+3)]:hidden"><div className="absolute left-[35px] top-6 bottom-6 w-0.5 bg-slate-200 -z-10" /><li className="relative flex gap-4"><div className="w-9 h-9 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 z-10"><Calendar className="w-4 h-4" /></div><article className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs w-full"><div className="flex items-start justify-between gap-3"><h3 className="text-xs font-bold text-slate-800">Modificación de vigencia</h3><time className="text-[11px] font-medium text-slate-400">16/10/2026 · 14:32</time></div><p className="text-[11px] text-slate-500">María González · Administradora</p><p className="mt-1.5 text-xs leading-relaxed text-slate-600">Reestructuración del departamento comercial Q4</p><span className="mt-2 inline-block rounded-md border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-500">AUD-EST-2026-0008-A</span></article></li><li className="relative flex gap-4"><div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 flex items-center justify-center shrink-0 z-10"><FileText className="w-4 h-4" /></div><article className="p-4 sm:p-5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs w-full"><div className="flex items-start justify-between gap-3"><h3 className="text-xs font-bold text-slate-800">Creación y asignación</h3><time className="text-[11px] font-medium text-slate-400">01/01/2026 · 09:15</time></div><p className="text-[11px] text-slate-500">María González · Administradora</p><p className="mt-1.5 text-xs leading-relaxed text-slate-600">Alta inicial del nodo en la estructura comercial.</p><span className="mt-2 inline-block rounded-md border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-500">AUD-EST-2026-0008-B</span></article></li><li className="relative rounded-2xl border border-slate-200/80 bg-white p-4 text-xs shadow-2xs"><div className="absolute left-4 top-0 bottom-0 -z-10 w-0.5 bg-slate-200" /><span className="absolute -left-4 top-4 flex size-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700"><History aria-hidden="true" /></span><p className="m-0 flex items-center justify-between gap-3 text-xs font-bold text-slate-800"><span>Cambio de nodo padre</span><time className="shrink-0 text-[11px] font-normal text-slate-400">31/05/2026 · 18:00</time></p><h3 className="sr-only">Cambio de nodo padre</h3><p className="mt-2 text-xs text-slate-600"><p className="mt-2 text-xs text-slate-500">María González · Administradora</p></p><p className="mt-2 text-xs leading-5 text-slate-500">Motivo: “Reestructuración del departamento comercial Q4”.</p></li><li className="relative pl-6"><span className="absolute -left-[6px] top-1.5 size-2.5 rounded-full border-2 border-white bg-slate-300 ring-1 ring-slate-300/50" /><p className="m-0 text-[11px] font-bold uppercase tracking-wide text-slate-500">01/01/2026</p><h3 className="mt-2 text-sm font-semibold text-slate-800">Creación del Nodo de Estructura</h3><p className="mt-2 text-xs text-slate-600">Usuario: <span className="font-semibold text-slate-800">Sistema ATENAS</span></p></li></ol></div><footer className="flex justify-end border-t border-slate-200 px-6 py-4"><button type="button" onClick={() => setIsHistoryDrawerOpen(false)} className="px-6 py-2.5 bg-[#2A4B93] hover:bg-[#1E366B] text-white text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer">Cerrar panel</button></footer></aside></div>}
    </main>
  )
}

