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

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <div className="detail-breadcrumb">Ventas <span>›</span> Ventas verificadas <span>›</span> <strong>Detalle VTA-2026-00893</strong></div>
      <header className="detail-hero">
        <div>
          <span className="detail-eyebrow"><ShieldCheck aria-hidden="true" /> CONTROL OPERATIVO / VENTAS</span>
          <h1 id="detail-title">Detalle de Venta Verificada y Condiciones Comerciales</h1>
          <p>ID Venta: VTA-2026-00893 <span>•</span> Ref. Clientify: CLT-2026-0409 <span>•</span> Ref. Origen: REF-ORIGEN-9982</p>
        </div>
        <div className="detail-badges"><span className="detail-badge green">ORIGEN: VERIFICADO</span><span className="detail-badge amber">CONDICIONES: BORRADOR</span><span className="detail-badge slate">INTEGRACIÓN: PENDIENTE</span><span className="detail-badge blue">Versión: V1</span></div>
      </header>

      {showAlert && <div className="detail-alert" role="alert"><span>[ ADVERTENCIA: EXISTEN CXC ASOCIADAS A UNA VERSIÓN ANTERIOR ]</span><button type="button" onClick={() => setShowAlert(false)} aria-label="Cerrar advertencia">×</button></div>}

      <div className="detail-sections">
        <section className="detail-card readonly-card">
          <div className="detail-card-heading"><div><h2>Datos de la venta</h2></div><Lock aria-hidden="true" className="heading-icon muted" /></div>
          <div className="detail-grid-three">{readOnlyFields.map(([label, value]) => <label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left" key={label}><span>{label}</span><input value={value} disabled className={label === 'Importe' ? 'amount-value' : ''} readOnly /></label>)}</div>
        </section>

        <section className="detail-card">
          <div className="detail-card-heading"><div><Paperclip aria-hidden="true" className="heading-icon brand" /><h2>Contrato y evidencia</h2></div></div>
          <div className="detail-grid-three"><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Referencia de contrato</span><input placeholder="Ej. CTR-2026-0031" /></label><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Observación contractual</span><textarea rows={2} placeholder="Añade una observación relevante para la operación" /></label></div>
          <button type="button" className="evidence-dropzone"><Upload aria-hidden="true" /><span><strong>Adjuntar evidencia contractual</strong><small>PDF, JPG o PNG · Máximo 10 MB</small></span></button>
        </section>

        <section className="detail-card editable-card">
          <div className="detail-card-heading"><div><Sliders aria-hidden="true" className="heading-icon brand" /><h2>Condiciones comerciales editables</h2></div><span className="required-note">* Campos obligatorios</span></div>
          <div className="detail-grid-three">
            {['Modalidad del Servicio*', 'Frecuencia del Servicio*', 'Periodicidad de Facturación*', 'Periodicidad de Pago*', 'Condición de Pago*'].map((label) => <label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left" key={label}><span>{label}</span><select defaultValue=""><option value="" disabled>Seleccionar opción</option><option>Mensual</option><option>Trimestral</option><option>Anual</option></select></label>)}
            <label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Fecha Inicio del Servicio*</span><input type="date" defaultValue="2026-09-24" /></label><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Fecha Fin del Servicio</span><input type="date" /></label><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Cantidad de Cuotas</span><input type="number" min="1" defaultValue="12" /></label><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Primer Vencimiento</span><input type="date" defaultValue="2026-10-24" /></label>
          </div>
        </section>

        <section className="detail-card">
          <div className="detail-card-heading"><div><History aria-hidden="true" className="heading-icon brand" /><h2>Versionado y trazabilidad</h2></div></div>
          <div className="version-grid"><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Versión vigente</span><input value="V1 · 24/09/2026" disabled readOnly /></label><label className="text-xs font-semibold text-slate-700 mb-1.5 block align-left"><span>Motivo del cambio*</span><input placeholder="Describe el motivo de esta versión" /></label><button type="button" className="history-button"><History aria-hidden="true" /> Ver versiones anteriores</button></div>
        </section>
      </div>

      <footer className="detail-actions"><div className="detail-action-group detail-action-left"><button type="button" className="detail-button outline" onClick={onBack}><ArrowLeft aria-hidden="true" /> Volver a la Bandeja</button><button type="button" className="detail-button ghost">Descartar Cambios</button></div><div className="detail-action-group detail-action-center"><button type="button" className="detail-button outline"><FileText aria-hidden="true" /> Previsualizar CxC</button><button type="button" className="detail-button outline"><History aria-hidden="true" /> Consultar Historial</button></div><div className="detail-action-group detail-action-right"><button type="button" className="detail-button outline"><Save aria-hidden="true" /> Guardar Borrador</button><button type="button" className="detail-button primary"><CheckCircle2 aria-hidden="true" /> Confirmar condiciones</button></div></footer>
    </section>
  )
}
