'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  History,
  Lock,
  Paperclip,
  Save,
  ShieldCheck,
  Sliders,
  Upload,
} from 'lucide-react'

type DetailProps = {
  onBack: () => void
}

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block tracking-normal'
const controlClassName = 'w-full text-xs font-normal text-slate-500 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 placeholder:font-normal text-ellipsis'
const filledControlClassName = 'text-slate-700 font-medium'

const readOnlyFields = [
  ['Cliente', 'Empresa Alfa C.A.'],
  ['Unidad de negocio', 'Consultoría y Tecnología'],
  ['Responsable comercial', 'María González'],
  ['Servicio', 'Consultoría ERP'],
  ['Tipo de operación', 'Venta de servicio'],
  ['Fecha económica', '02/08/2026'],
  ['Importe', '$60,000.00 USD'],
  ['Fuente y fecha de carga', 'Clientify · 02/08/2026 09:14'],
]

export default function DetalleVentaConditions({ onBack }: DetailProps) {
  const [showAlert, setShowAlert] = useState(true)
  const [serviceConditions, setServiceConditions] = useState<string[]>(() => Array(5).fill(''))

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <div className="detail-breadcrumb">Ventas <span>›</span> Ventas verificadas <span>›</span> <strong>Detalle VTA-2026-00893</strong></div>
      <header className="detail-hero">
        <div>
          <span className="detail-eyebrow"><ShieldCheck aria-hidden="true" /> CONTROL OPERATIVO / VENTAS</span>
          <h1 id="detail-title">Detalle de Venta Verificada y Condiciones Comerciales</h1>
          <p>ID Venta: VTA-2026-00893 <span>•</span> Ref. Clientify: CLT-2026-0409 <span>•</span> Ref. Origen: REF-ORIGEN-9982</p>
        </div>
        <div className="detail-badges"><span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 normal-case tracking-normal">Origen: Verificado</span><span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 normal-case tracking-normal">Condiciones: Borrador</span><span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 normal-case tracking-normal">Integración: Pendiente</span><span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-[#2A4B93] border border-blue-200 normal-case tracking-normal">Versión: V1</span></div>
      </header>

      {showAlert && <div className="detail-alert text-xs font-semibold text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between normal-case tracking-normal" role="alert"><span>[ Advertencia: existen CxC asociadas a una versión anterior ]</span><button type="button" onClick={() => setShowAlert(false)} aria-label="Cerrar advertencia">×</button></div>}

      <div className="detail-sections">
        <section className="detail-card readonly-card">
          <div className="detail-card-heading"><div><h2 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">Datos de la venta</h2></div><Lock aria-hidden="true" className="heading-icon muted" /></div>
          <div className="detail-grid-three">{readOnlyFields.map(([label, value]) => <label className={labelClassName} key={label}><span>{label}</span><input value={value} disabled className={`${controlClassName} ${label === 'Importe' ? 'amount-value' : ''}`} readOnly /></label>)}</div>
        </section>

        <section className="detail-card">
          <div className="detail-card-heading"><div><Paperclip aria-hidden="true" className="heading-icon brand" /><h2 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">Contrato y evidencia</h2></div></div>
          <div className="detail-grid-three"><label className={labelClassName}><span>Referencia de contrato</span><input className={controlClassName} placeholder="Ej. CTR-2026-0031" /></label><label className={labelClassName}><span>Observación contractual</span><textarea className={controlClassName} rows={2} placeholder="Añade una observación relevante para la operación" /></label></div>
          <button type="button" className="evidence-dropzone"><Upload aria-hidden="true" /><span><strong>Adjuntar evidencia contractual</strong><small>PDF, JPG o PNG · Máximo 10 MB</small></span></button>
        </section>

        <section className="detail-card editable-card">
          <div className="detail-card-heading"><div><Sliders aria-hidden="true" className="heading-icon brand" /><h2 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">Condiciones comerciales editables</h2></div><span className="required-note">* Campos obligatorios</span></div>
          <div className="detail-grid-three">
            {['Modalidad del Servicio*', 'Frecuencia del Servicio*', 'Periodicidad de Facturación*', 'Periodicidad de Pago*', 'Condición de Pago*'].map((label, index) => {
              const value = serviceConditions[index]

              return <label className={labelClassName} key={label}><span>{label}</span><select value={value} onChange={(event) => setServiceConditions((current) => current.map((condition, conditionIndex) => conditionIndex === index ? event.target.value : condition))} className={`${controlClassName} ${value === '' ? 'text-slate-400 font-normal' : filledControlClassName}`}><option value="" disabled className="text-slate-400">Seleccionar opción</option><option value="Mensual" className="text-slate-700">Mensual</option><option value="Trimestral" className="text-slate-700">Trimestral</option><option value="Anual" className="text-slate-700">Anual</option></select></label>
            })}
            <label className={labelClassName}><span>Fecha Inicio del Servicio*</span><input className={`${controlClassName} ${filledControlClassName}`} type="date" defaultValue="2026-09-24" /></label><label className={labelClassName}><span>Fecha Fin del Servicio</span><input className={controlClassName} type="date" /></label><label className={labelClassName}><span>Cantidad de Cuotas</span><input className={`${controlClassName} ${filledControlClassName}`} type="number" min="1" defaultValue="12" /></label><label className={labelClassName}><span>Primer Vencimiento</span><input className={`${controlClassName} ${filledControlClassName}`} type="date" defaultValue="2026-10-24" /></label>
          </div>
        </section>

        <section className="detail-card">
          <div className="detail-card-heading"><div><History aria-hidden="true" className="heading-icon brand" /><h2 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">Versionado y trazabilidad</h2></div></div>
          <div className="version-grid"><label className={labelClassName}><span>Versión vigente</span><input className={controlClassName} value="V1 · 24/09/2026" disabled readOnly /></label><label className={labelClassName}><span>Motivo del cambio*</span><input className={controlClassName} placeholder="Describe el motivo de esta versión" /></label><button type="button" className="history-button"><History aria-hidden="true" /> Ver versiones anteriores</button></div>
        </section>
      </div>

      <footer className="detail-actions"><div className="detail-action-group detail-action-left"><button type="button" className="detail-button outline" onClick={onBack}><ArrowLeft aria-hidden="true" /> Volver a la Bandeja</button><button type="button" className="detail-button ghost">Descartar Cambios</button></div><div className="detail-action-group detail-action-center"><button type="button" className="detail-button outline"><FileText aria-hidden="true" /> Previsualizar CxC</button><button type="button" className="detail-button outline"><History aria-hidden="true" /> Consultar Historial</button></div><div className="detail-action-group detail-action-right"><button type="button" className="detail-button outline"><Save aria-hidden="true" /> Guardar Borrador</button><button type="button" className="detail-button primary"><CheckCircle2 aria-hidden="true" /> Confirmar condiciones</button></div></footer>
    </section>
  )
}
