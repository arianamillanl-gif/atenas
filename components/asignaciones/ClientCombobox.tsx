'use client'

import { useId, useMemo, useState } from 'react'
import { Lock, Search } from 'lucide-react'

import type { CanonicalClient } from './data'
import { controlClass } from './fields'

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default function ClientCombobox({
  id,
  clients,
  value,
  locked,
  error,
  onChange,
}: {
  id: string
  clients: CanonicalClient[]
  value: string
  locked?: boolean
  error?: string
  onChange: (clientId: string) => void
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const selected = clients.find((client) => client.id === value)

  const matches = useMemo(() => {
    const term = normalize(query.trim())
    if (!term) return clients
    return clients.filter((client) => normalize(`${client.name} ${client.rif} ${client.id}`).includes(term))
  }, [clients, query])

  if (locked && selected) {
    return (
      <div
        id={id}
        role="textbox"
        aria-readonly="true"
        aria-label={`Cliente canónico: ${selected.name}`}
        className="flex h-10 cursor-not-allowed items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700"
      >
        <span className="truncate" title={selected.name}>{selected.name}</span>
        <Lock size={13} aria-hidden="true" className="shrink-0 text-slate-400" />
      </div>
    )
  }

  const choose = (client: CanonicalClient) => {
    onChange(client.id)
    setOpen(false)
    setQuery('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlight((current) => Math.min(current + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter') {
      if (event.nativeEvent.isComposing || event.keyCode === 229) return
      event.preventDefault()
      if (open && matches[highlight]) choose(matches[highlight])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[highlight] ? `${listId}-${matches[highlight].id}` : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete="off"
        value={open ? query : (selected?.name ?? '')}
        placeholder={selected?.name ?? 'Buscar por nombre, RIF o ID…'}
        onFocus={() => {
          setOpen(true)
          setHighlight(0)
        }}
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setQuery(event.target.value)
          setHighlight(0)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        className={`${controlClass} truncate pl-9 ${selected && !open ? 'font-semibold' : ''}`}
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Clientes canónicos"
          className="absolute inset-x-0 top-full z-20 m-0 mt-1.5 flex max-h-64 list-none flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2.5 text-xs text-slate-400">Sin coincidencias en el catálogo gobernado.</li>
          ) : (
            matches.map((client, index) => (
              <li
                key={client.id}
                id={`${listId}-${client.id}`}
                role="option"
                aria-selected={client.id === value}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => choose(client)}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2 ${index === highlight ? 'bg-[#2A4B93]/[0.06]' : ''}`}
              >
                <span className={`truncate text-xs font-semibold ${client.id === value ? 'text-[#2A4B93]' : 'text-slate-800'}`}>{client.name}</span>
                <span className="font-mono text-[10px] text-slate-400">{client.rif} · {client.id}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
