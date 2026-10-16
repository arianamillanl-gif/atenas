'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronRight, GitBranch, Search, X } from 'lucide-react'
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
  const [form, setForm] = useState({ code: 'EQU-003', type: 'Equipo', parent: 'COM-001', name: 'Equipo Estratégico', unit: 'Desarrollo de negocio' })
  const [member, setMember] = useState({ person: '', role: '', condition: 'Principal', from: '', to: '' })
  const [members, setMembers] = useState(initialMembers)
  const [treeOpen, setTreeOpen] = useState(false)
  const [treeSearch, setTreeSearch] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'DIR-001': true, 'COM-001': true })

  const allNodes = useMemo(() => flatten(nodes), [])
  const invalidParent = form.parent === form.code || form.parent === 'EQU-002'
  const isDirty = Object.values(form).some(Boolean) || member.person !== ''
  const visibleNodes = allNodes.filter((node) => `${node.id} ${node.name}`.toLowerCase().includes(treeSearch.toLowerCase()))

  const update = (key: keyof typeof form, value: string) => { setForm((current) => ({ ...current, [key]: value })); setSaved(false) }
  const assignMember = () => {
    if (!member.person || !member.role || !member.from) return
    setMembers((current) => [{ id: `ADS-${String(current.length + 43).padStart(4, '0')}`, person: member.person, role: member.role, node: form.name, condition: member.condition, from: member.from, to: member.to || '—', reason: 'Adscripción rápida registrada por el usuario actual.' }, ...current])
    setMember({ person: '', role: '', condition: 'Principal', from: '', to: '' })
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
              {invalidParent && <div className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-2xs"><span className="text-base" aria-hidden="true">⚠️</span><div><p className="font-bold">ASIGNACIÓN NO PERMITIDA:</p><p className="mt-0.5 text-rose-700">No puedes seleccionar este equipo como jefe/padre porque actualmente depende del nodo en edición. Por favor, elige un nivel superior en la organización.</p></div></div>}
            </section>

            <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xs">
              <div className="mb-6 flex flex-col gap-1"><h2 className="m-0 text-base font-bold text-slate-900">Asignación de miembros adscritos</h2><p className="m-0 text-xs text-slate-500">Registra responsables, roles y vigencias históricas.</p></div>
              <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2 lg:grid-cols-5">
                {([['person', 'Persona', 'text'], ['role', 'Rol', 'text'], ['from', 'Vigencia desde', 'date'], ['to', 'Vigencia hasta', 'date']] as const).map(([key, label, type]) => <label key={key} className="flex flex-col gap-2 text-xs font-semibold text-slate-700">{label}<input type={type} value={member[key]} onChange={(event) => setMember((current) => ({ ...current, [key]: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-[#59A5E2]" /></label>)}
                <label className="flex flex-col gap-2 text-xs font-semibold text-slate-700">Condición principal<select value={member.condition} onChange={(event) => setMember((current) => ({ ...current, condition: event.target.value }))} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-normal"><option>Principal</option><option>Secundaria</option><option>Temporal</option></select></label>
                <button type="button" onClick={assignMember} className="rounded-full bg-[#2A4B93] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1E366B] lg:col-span-2 lg:w-fit">Asignar miembro a estructura</button>
              </div>
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs mt-4">
                <table className="w-full min-w-[1150px] border-collapse text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="px-5 py-3.5 whitespace-nowrap">Persona</th>
                      <th className="px-4 py-3.5 whitespace-nowrap">Rol</th>
                      <th className="px-4 py-3.5 whitespace-nowrap">Unidad / Nodo</th>
                      <th className="px-4 py-3.5 whitespace-nowrap">Condición</th>
                      <th className="min-w-[180px] px-4 py-3.5 whitespace-nowrap">Vigencia</th>
                      <th className="px-4 py-3.5 whitespace-nowrap">Motivo</th>
                      <th className="sticky right-0 z-20 bg-slate-50 px-5 py-3.5 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap"><span className="font-semibold text-slate-800 block">{item.person}</span><span className="text-[11px] font-mono text-slate-400 block">{item.id}</span></td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-700">{item.role}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-700">{item.node}</td>
                        <td className="px-4 py-4 whitespace-nowrap"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">{item.condition}</span></td>
                        <td className="min-w-[180px] px-4 py-4 whitespace-nowrap font-mono text-slate-600">{item.from} — {item.to}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-slate-600">{item.reason}</td>
                        <td className="sticky right-0 z-10 bg-white px-5 py-4 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)] whitespace-nowrap"><div className="flex items-center justify-end gap-2"><button type="button" className="px-3.5 py-1.5 text-[11px] font-semibold text-[#2A4B93] bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs cursor-pointer">Reasignar nodo</button><button type="button" className="px-3.5 py-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-full shadow-2xs cursor-pointer">Cerrar vigencia</button></div></td>
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

      {treeOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="tree-title"><div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 id="tree-title" className="m-0 text-lg font-semibold text-slate-900">Inspección de jerarquía</h2><p className="mt-1 text-xs text-slate-500">Selecciona un nodo padre válido para la estructura.</p></div><button type="button" onClick={() => setTreeOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar modal"><X size={17} /></button></div><label className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search size={15} className="text-slate-400" /><input value={treeSearch} onChange={(event) => setTreeSearch(event.target.value)} placeholder="Buscar nodo..." className="h-10 w-full text-xs outline-none" /></label><div className="mt-5 flex flex-col gap-2">{visibleNodes.map((node) => <div key={node.id} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs hover:bg-slate-50"><button type="button" onClick={() => setExpanded((current) => ({ ...current, [node.id]: !current[node.id] }))} className="text-slate-400">{node.children ? (expanded[node.id] ? <ChevronDown size={15} /> : <ChevronRight size={15} />) : <span className="inline-block size-[15px]" />}</button><GitBranch size={14} className="text-[#2A4B93]" /><span className="font-semibold text-slate-800">{node.name}</span><span className="text-slate-400">{node.id} · {node.type}</span>{node.id === form.code && <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold text-white">Nodo en edición</span>}</div>)}</div><div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-[10px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-full bg-slate-900" />Nodo en edición</span><span><i className="mr-1 inline-block size-2 rounded-full bg-rose-400" />Posible ciclo</span><span><ChevronDown size={12} className="mr-1 inline" />Colapsar/Expandir</span></div><button type="button" onClick={() => setTreeOpen(false)} className="mt-5 rounded-full border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">[ CERRAR MODAL ]</button></div></div>}
      {discardOpen && <DiscardChangesModal onConfirm={() => { setDiscardOpen(false); setSaved(false) }} onCancel={() => setDiscardOpen(false)} />}
    </main>
  )
}

