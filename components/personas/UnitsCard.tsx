import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Field, inputClass } from './fields'
import { ADSCRIPTION_TYPES, UNIT_TREE, formatDate, type AdscriptionRecord, type AdscriptionType } from './data'

type Props = {
  mainUnit: string
  adscriptions: AdscriptionRecord[]
  onMainUnitChange: (unit: string) => void
  onAdd: (unit: string, type: AdscriptionType) => void
  onInactivate: (id: string) => void
  onView: (record: AdscriptionRecord) => void
}

export default function UnitsCard({ mainUnit, adscriptions, onMainUnitChange, onAdd, onInactivate, onView }: Props) {
  const [pendingUnit, setPendingUnit] = useState('')
  const [pendingType, setPendingType] = useState<AdscriptionType>('Secundaria')
  const activeUnits = adscriptions.filter((item) => item.active).map((item) => item.unit)
  const available = UNIT_TREE.map((group) => ({
    ...group,
    units: group.units.filter((unit) => unit !== mainUnit && !activeUnits.includes(unit)),
  })).filter((group) => group.units.length > 0)

  const add = () => {
    if (!pendingUnit) return
    onAdd(pendingUnit, pendingType)
    setPendingUnit('')
  }

  return (
    <Card
      id="adscripcion"
      title="Adscripción organizacional y unidades"
      description="Unidad principal vigente y otras unidades donde la persona mantiene una adscripción válida."
    >
      <div className="flex flex-col gap-8">
        <div className="max-w-xl">
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

        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 id="adscriptions-title" className="m-0 text-sm font-semibold text-slate-800">Otras adscripciones válidas</h3>
            <span className="text-xs text-slate-500">
              {activeUnits.length} {activeUnits.length === 1 ? 'activa' : 'activas'} · {adscriptions.length} en total
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table aria-labelledby="adscriptions-title" className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-4 py-3 font-semibold">Unidad adscrita</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Tipo relación</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Vigencia</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Estado</th>
                  <th scope="col" className="w-32 px-4 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {adscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-xs text-slate-500">Sin adscripciones secundarias registradas.</td>
                  </tr>
                ) : (
                  adscriptions.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                      <td className={`px-4 py-3.5 font-medium ${item.active ? 'text-slate-800' : 'text-slate-500'}`}>{item.unit}</td>
                      <td className="px-4 py-3.5 text-slate-600">{item.type}</td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-500">
                        {formatDate(item.start)} — {item.end ? formatDate(item.end) : 'Vigente'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${item.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                        >
                          <span aria-hidden="true" className={`size-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {item.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {item.active ? (
                          <button
                            type="button"
                            onClick={() => onInactivate(item.id)}
                            aria-label={`Inactivar adscripción a ${item.unit}`}
                            className="inline-flex h-8 items-center rounded-full border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-700 transition hover:border-primary/40 hover:text-primary"
                          >
                            Inactivar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onView(item)}
                            aria-label={`Ver historial de adscripción a ${item.unit}`}
                            className="inline-flex h-8 items-center rounded-full border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-500 transition hover:border-primary/40 hover:text-primary"
                          >
                            Ver
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="m-0 text-xs italic text-slate-500">Sin botón eliminar — acción máxima permitida: Inactivar.</p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <label htmlFor="persona-secondaryUnit" className="sr-only">Unidad a adscribir</label>
            <select
              id="persona-secondaryUnit"
              className={`${inputClass} h-11 cursor-pointer py-0 sm:flex-1`}
              value={pendingUnit}
              onChange={(event) => setPendingUnit(event.target.value)}
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
            <label htmlFor="persona-adscriptionType" className="sr-only">Tipo de relación</label>
            <select
              id="persona-adscriptionType"
              className={`${inputClass} h-11 cursor-pointer py-0 sm:w-44`}
              value={pendingType}
              onChange={(event) => setPendingType(event.target.value as AdscriptionType)}
            >
              {ADSCRIPTION_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={add}
              disabled={!pendingUnit}
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
