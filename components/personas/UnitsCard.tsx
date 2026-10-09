import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Card, Field, inputClass } from './fields'
import { UNIT_TREE } from './data'

type Props = {
  mainUnit: string
  secondaryUnits: string[]
  onMainUnitChange: (unit: string) => void
  onAddSecondary: (unit: string) => void
  onRemoveSecondary: (unit: string) => void
}

export default function UnitsCard({ mainUnit, secondaryUnits, onMainUnitChange, onAddSecondary, onRemoveSecondary }: Props) {
  const [pending, setPending] = useState('')
  const available = UNIT_TREE.map((group) => ({
    ...group,
    units: group.units.filter((unit) => unit !== mainUnit && !secondaryUnits.includes(unit)),
  })).filter((group) => group.units.length > 0)

  const add = () => {
    if (!pending) return
    onAddSecondary(pending)
    setPending('')
  }

  return (
    <Card
      id="adscripcion"

      title="Adscripción organizacional"
      description="Unidad principal vigente y otras unidades donde la persona mantiene una adscripción válida."
    >
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
      <div className="min-w-0">
        <Field id="persona-mainUnit" label="Unidad principal vigente" required hint="Selector de jerarquía organizativa. Define la unidad de dependencia formal de la persona.">
          <select id="persona-mainUnit" className={`${inputClass} h-11 cursor-pointer py-0`} value={mainUnit} onChange={(event) => onMainUnitChange(event.target.value)}>
            {UNIT_TREE.map((group) => (
              <optgroup key={group.area} label={group.area}>
                {group.units.map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <span id="secondary-units-label" className="text-sm font-medium text-slate-700">Otras adscripciones válidas</span>
          <span className="text-xs text-slate-500">{secondaryUnits.length} {secondaryUnits.length === 1 ? 'unidad' : 'unidades'}</span>
        </div>

        {secondaryUnits.length > 0 ? (
          <ul aria-labelledby="secondary-units-label" className="m-0 flex min-h-11 list-none flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
            {secondaryUnits.map((unit) => (
              <li key={unit} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-1 text-xs font-medium text-slate-700">
                {unit}
                <button
                  type="button"
                  onClick={() => onRemoveSecondary(unit)}
                  aria-label={`Quitar adscripción a ${unit}`}
                  className="flex size-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 flex min-h-11 items-center rounded-xl border border-dashed border-slate-200 px-4 text-xs text-slate-500">Sin adscripciones secundarias registradas.</p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label htmlFor="persona-secondaryUnit" className="sr-only">Unidad secundaria a adscribir</label>
          <select
            id="persona-secondaryUnit"
            className={`${inputClass} h-11 cursor-pointer py-0 sm:flex-1`}
            value={pending}
            onChange={(event) => setPending(event.target.value)}
            disabled={available.length === 0}
          >
            <option value="">Seleccionar unidad…</option>
            {available.map((group) => (
              <optgroup key={group.area} label={group.area}>
                {group.units.map((unit) => (
                  <option key={unit}>{unit}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            type="button"
            onClick={add}
            disabled={!pending}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={15} aria-hidden="true" />
            Adscribir
          </button>
        </div>
      </div>
      </div>
    </Card>
  )
}
