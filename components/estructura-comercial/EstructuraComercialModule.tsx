'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronRight, Network, Search, X } from 'lucide-react'
import { Sidebar, Topbar } from '../personas/Shell'
import DiscardChangesModal from '../asignaciones/DiscardChangesModal'

type Node = { id: string; name: string; type: string; parent?: string; children?: Node[]; unit: string }

type Member = { person: string; role: string; node: string; condition: string; from: string; to: string; reason: string }

const nodes: Node[] = [
  { id: 'dir', name: 'Dirección General', type: 'Dirección', unit: 'Corporativo', children: [
    { id: 'com', name: 'Gerencia Comercial', type: 'Gerencia', parent: 'dir', unit: 'Comercial', children: [
      { id: 'norte', name: 'Equipo Regional Norte', type: 'Equipo', parent: 'com', unit: 'Regional Norte' },
      { id: 'sur', name: 'Equipo Regional Sur', type: 'Equipo', parent: 'com', unit: 'Regional Sur' },
    ] },
  ] },
]

const initialMembers: Member[] = [
  { person: 'María Fernanda López', role: 'Gerente comercial', node: 'Gerencia Comercial', condition: 'Principal', from: '01/01/2025', to: 'Vigente', reason: 'Designación organizacional anual' },
  { person: 'Carlos Andrés Rojas', role: 'Líder regional', node: 'Equipo Regional Norte', condition: 'Principal', from: '15/02/2025', to: 'Vigente', reason: 'Apertura de operación regional' },
  { person: 'Natalia Pérez', role: 'Ejecutiva comercial', node: 'Equipo Regional Sur', condition: 'Suplente', from: '03/03/2025', to: '31/12/2025', reason: 'Cobertura temporal de operación' },
]

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="flex min-w-0 flex-col gap-2 text-xs font-semibold text-slate-700"><span>{label}{required && <span className="text-rose-600"> *</span>}</span>{children}</label>
}

function TreeNode({ node, editingId, search, level = 0, onPick }: { node: Node; editingId: string; search: string; level?: number; onPick: (id: string) => void }) {
  const visible = node.name.toLowerCase().includes(search.toLowerCase()) || node.children?.some((child) => child.name.toLowerCase().includes(search.toLowerCase()))
  if (!visible) return null
  return <div className="relative" style={{ paddingLeft: level * 24 }}>
    {level > 0 && <span className="absolute left-2 top-0 h-7 border-l border-slate-200" aria-hidden="true" />}
    <button type="button" onClick={() => onPick(node.id)} className="group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-50">
      {node.children ? <ChevronDown className="text-slate-400" aria-hidden="true" /> : <span className="ml-1.5 size-1.5 rounded-full bg-slate-300" />}
      <span className="font-semibold text-slate-700">{node.name}</span>
      {node.id === editingId && <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-semibold text-white">Nodo en edición</span>}
      {node.id === 'com' && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Posible ciclo</span>}
    </button>
    {node.children?.map((child) => <TreeNode key={child.id} node={child} editingId={editingId} search={search} level={level + 1} onPick={onPick} />)}
  </div>
}

export default function EstructuraComercialModule() {
  const [collapsed, setCollapsed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [parent, setParent] = useState('com')
  const [members, setMembers] = useState(initialMembers)
  const [dirty, setDirty] = useState(false)
  const [notice, setNotice] = useState('')
  const [person, setPerson] = useState('')
  const [role, setRole] = useState('')
  const [condition, setCondition] = useState('Principal')
  const [from, setFrom] = useState('2026-01-01')
  const [to, setTo] = useState('')

  const invalidParent = parent === 'com'
  const parentName = useMemo(() => parent === 'com' ? 'Gerencia Comercial' : parent === 'dir' ? 'Dirección General' : 'Seleccionar nodo padre', [parent])
  const update = () => setDirty(true)
  const assign = () => {
    if (!person.trim() || !role.trim()) { setNotice('Completa Persona y Rol para asignar el miembro.'); return }
    setMembers((current) => [{ person, role, node: 'Gerencia Comercial', condition, from: new Date(from + 'T00:00:00').toLocaleDateString('es-CO'), to: to ? new Date(to + 'T00:00:00').toLocaleDateString('es-CO') : 'Vigente', reason: 'Adscripción manual a estructura comercial' }, ...current])
    setPerson(''); setRole(''); setTo(''); setDirty(true); setNotice('Miembro asignado a la estructura comercial.')
  }
  const save = () => { setDirty(false); setNotice('Estructura comercial guardada correctamente.') }
  const discard = () => { setDiscardOpen(false); setDirty(false); setNotice('Cambios descartados.') }

  return <main className="app-shell">
    <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} active="estructuras" />
    <section className="content flex min-h-screen flex-col">
      <Topbar section="Estructura comercial" />
      <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <header className="flex flex-col gap-2">
          <nav aria-label="Ruta de navegación" className="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>Catálogos maestros</span><span aria-hidden="true">›</span><span>Estructura comercial</span><span aria-hidden="true">›</span><span aria-current="page" className="font-semibold text-slate-700">Estructura comercial</span></nav>
          <h1 className="m-0 text-xl font-bold text-slate-900">Estructura comercial</h1>
          <p className="m-0 text-sm text-slate-500">Mantener la jerarquía comercial y la adscripción de personas con roles y vigencias.</p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-200/80 px-6 py-5 md:px-8"><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-xl bg-[#edf4ff] text-xs font-bold text-[#2A4B93]">01</span><div><h2 className="m-0 text-base font-bold text-slate-900">Definición del nodo de estructura</h2><p className="m-0 mt-1 text-xs text-slate-500">Configura la identidad, el nivel jerárquico y la unidad responsable.</p></div></div></div>
          <div className="grid gap-5 p-6 md:grid-cols-2 md:p-8 lg:grid-cols-3">
            <Field label="Código del nodo" required><input className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none transition focus:border-[#59a5e2] focus:ring-4 focus:ring-[#59a5e2]/15" defaultValue="EST-COM-001" onChange={update} /></Field>
            <Field label="Tipo de nodo" required><select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#59a5e2]" defaultValue="Gerencia" onChange={update}><option>Dirección</option><option>Gerencia</option><option>Equipo</option><option>Célula</option></select></Field>
            <Field label="Nodo padre (Jerarquía)" required><div className="flex gap-2"><select value={parent} onChange={(event) => { setParent(event.target.value); update() }} className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#59a5e2]"><option value="com">Gerencia Comercial</option><option value="dir">Dirección General</option><option value="norte">Equipo Regional Norte</option></select><button type="button" onClick={() => setModalOpen(true)} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 px-3 text-[11px] font-semibold text-[#2A4B93] hover:bg-[#edf4ff]">Inspeccionar</button></div><button type="button" onClick={() => setModalOpen(true)} className="mt-1 w-fit text-left text-[11px] font-semibold text-[#2A4B93] hover:underline">Ver inspección de jerarquía</button></Field>
            <Field label="Nombre del nodo" required><input className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#59a5e2]" defaultValue="Gerencia Comercial" onChange={update} /></Field>
            <Field label="Unidad organizacional" required><select className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#59a5e2]" defaultValue="Comercial" onChange={update}><option>Comercial</option><option>Corporativo</option><option>Regional Norte</option><option>Regional Sur</option></select></Field>
          </div>
          {invalidParent && <div className="mx-6 mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 shadow-2xs md:mx-8"><AlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" /><p className="m-0"><strong>ASIGNACIÓN NO PERMITIDA:</strong> No puedes seleccionar este equipo como jefe/padre porque actualmente depende del nodo actual. Por favor, elige un nivel superior en la organización.</p></div>}
          <div className="border-t border-slate-200/80 px-6 py-4 md:px-8"><span className="text-[11px] font-semibold text-slate-500">Nodo padre seleccionado: </span><span className="text-[11px] font-semibold text-slate-800">{parentName}</span></div>

          <div className="border-t border-slate-200/80 px-6 py-5 md:px-8"><div className="flex flex-col gap-1"><h2 className="m-0 text-base font-bold text-slate-900">Asignación rápida de miembros</h2><p className="m-0 text-xs text-slate-500">Registra personas, roles y vigencias manteniendo el historial de adscripción.</p></div><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-5"><Field label="Persona"><input value={person} onChange={(event) => { setPerson(event.target.value); update() }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#59a5e2]" placeholder="Buscar persona..." /></Field><Field label="Rol"><input value={role} onChange={(event) => { setRole(event.target.value); update() }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-[#59a5e2]" placeholder="Ej. Líder regional" /></Field><Field label="Condición principal"><select value={condition} onChange={(event) => { setCondition(event.target.value); update() }} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs"><option>Principal</option><option>Suplente</option></select></Field><Field label="Vigencia desde"><input type="date" value={from} onChange={(event) => { setFrom(event.target.value); update() }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs" /></Field><Field label="Vigencia hasta"><input type="date" value={to} onChange={(event) => { setTo(event.target.value); update() }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs" /></Field></div><button type="button" onClick={assign} className="mt-4 inline-flex items-center rounded-full bg-[#2A4B93] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E366B]">Asignar miembro a estructura</button></div>

          <div className="border-t border-slate-200/80 px-6 py-5 md:px-8"><div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="m-0 text-base font-bold text-slate-900">Tabla histórica de miembros adscritos</h2><p className="m-0 mt-1 text-xs text-slate-500">{members.length} registros · historial de vigencias y movimientos.</p></div><Network className="text-slate-300" aria-hidden="true" /></div><div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs [scrollbar-color:#e2e8f0_transparent]"><table className="w-full min-w-[1200px] border-collapse text-left text-xs text-slate-700"><thead><tr className="bg-slate-50/70 text-[10px] font-bold tracking-[.08em] text-slate-400"><th className="min-w-[220px] px-4 py-3">PERSONA</th><th className="min-w-[160px] px-4 py-3">ROL</th><th className="min-w-[180px] px-4 py-3">UNIDAD / NODO</th><th className="min-w-[130px] px-4 py-3">CONDICIÓN</th><th className="min-w-[180px] px-4 py-3">VIGENCIA DESDE/HASTA</th><th className="min-w-[240px] px-4 py-3">MOTIVO</th><th className="sticky right-0 z-10 min-w-[150px] bg-white px-4 py-3 text-right shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)]">ACCIÓN</th></tr></thead><tbody>{members.map((member, index) => <tr key={`${member.person}-${index}`} className="border-t border-slate-100 hover:bg-slate-50/70"><td className="px-4 py-4 font-semibold text-slate-800">{member.person}</td><td className="px-4 py-4">{member.role}</td><td className="px-4 py-4">{member.node}</td><td className="px-4 py-4"><span className="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[10px] font-semibold text-[#2A4B93]">{member.condition}</span></td><td className="px-4 py-4 whitespace-nowrap">{member.from} <span className="text-slate-300">→</span> {member.to}</td><td className="px-4 py-4 text-slate-500">{member.reason}</td><td className="sticky right-0 z-10 bg-white px-4 py-4 text-right shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.06)]"><div className="flex justify-end gap-2"><button type="button" onClick={() => setNotice('Selecciona un nuevo nodo para reasignar este miembro.')} className="rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-[#2A4B93] hover:bg-[#edf4ff]">Reasignar nodo</button><button type="button" onClick={() => setNotice('Cierre de vigencia preparado para confirmación.')} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-700 hover:bg-amber-100">Cerrar vigencia</button></div></td></tr>)}</tbody></table></div></div>

          <div className="mt-8 flex w-full items-center justify-between gap-4 rounded-b-3xl border-t border-slate-200/80 bg-white px-6 py-4 shadow-sm md:px-8"><button type="button" onClick={() => dirty ? setDiscardOpen(true) : setNotice('No hay cambios pendientes.')} className="rounded-full px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">Cancelar</button><button type="button" onClick={save} disabled={invalidParent} className="rounded-full bg-[#2A4B93] px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1E366B] disabled:cursor-not-allowed disabled:opacity-50">Guardar estructura comercial</button></div>
        </section>
      </div>
      {notice && <div role="status" className="fixed bottom-6 right-6 z-40 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl">{notice}</div>}
    </section>

    {modalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="tree-title"><div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="m-0 text-[10px] font-bold uppercase tracking-[.12em] text-[#2A4B93]">Inspección de jerarquía</p><h2 id="tree-title" className="mt-2 text-lg font-bold text-slate-900">Árbol de estructura comercial</h2></div><button type="button" onClick={() => setModalOpen(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Cerrar modal"><X aria-hidden="true" /></button></div><div className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-3"><Search className="text-slate-400" aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nodo..." className="h-10 w-full border-0 text-xs outline-none" /></div><div className="mt-5 max-h-72 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-3">{nodes.map((node) => <TreeNode key={node.id} node={node} editingId="com" search={search} onPick={(id) => { setParent(id); update(); setModalOpen(false) }} />)}</div><div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-[10px] text-slate-500"><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-slate-900" />Nodo en edición</span><span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-rose-400" />Posible ciclo</span><span className="flex items-center gap-1.5"><ChevronDown className="size-3" />Colapsar/Expandir</span><button type="button" onClick={() => setModalOpen(false)} className="ml-auto rounded-full border border-slate-200 px-4 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">[ CERRAR MODAL ]</button></div></div></div>}
    {discardOpen && <DiscardChangesModal onCancel={() => setDiscardOpen(false)} onConfirm={discard} />}
  </main>
}
