'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  History,
  Lock,
  Save,
  ShieldCheck,
  Trash2,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react'

type DetailProps = {
  onBack: () => void
}

const labelClassName = 'text-xs font-medium text-slate-600 mb-1.5 block'
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
  const [showHistory, setShowHistory] = useState(false)
  const [serviceConditions, setServiceConditions] = useState<string[]>(() => Array(5).fill(''))

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6" aria-label="Migas de pan">
        <span className="text-slate-400">Ventas</span>
        <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-slate-300" />
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-slate-600 hover:text-[#2A4B93] font-medium transition-colors">
          <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" />
          <span>Ventas verificadas</span>
        </button>
        <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-800 font-semibold">Detalle VTA-2026-00893</span>
      </nav>
      <header className="detail-hero">
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-[#2A4B93] text-xs font-bold tracking-wide uppercase">
              <ShieldCheck aria-hidden="true" className="w-4 h-4" />
              <span>CONTROL OPERATIVO / VENTAS</span>
            </div>
            <h1 id="detail-title" className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">Detalle de Venta Verificada y Condiciones Comerciales</h1>
            <p className="text-xs text-slate-500 pt-0.5">ID Venta: <span className="font-medium text-slate-700">VTA-2026-00893</span> • Ref. Clientify: <span className="font-medium text-slate-700">CLT-2026-0409</span> • Ref. Origen: <span className="font-medium text-slate-700">REF-ORIGEN-9982</span></p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-6">
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5"><CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" /> Verificado</span>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5"><SlidersHorizontal aria-hidden="true" className="w-3.5 h-3.5" /> En borrador</span>
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-1.5"><Clock aria-hidden="true" className="w-3.5 h-3.5" /> Integración pendiente</span>
          </div>
        </div>
      </header>

      {showAlert && <div className="detail-alert text-xs font-medium text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between mb-6 shadow-sm" role="alert"><span className="flex items-center"><AlertTriangle aria-hidden="true" className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />Existen CxC asociadas a una versión anterior</span><button type="button" onClick={() => setShowAlert(false)} aria-label="Cerrar advertencia" className="text-amber-500 hover:text-amber-700 cursor-pointer">×</button></div>}

      <div className="detail-sections">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="detail-card-heading"><div><h2 className="text-base font-bold text-slate-800 mb-4 flex items-center justify-between">Datos de la venta</h2></div><Lock aria-hidden="true" className="w-4 h-4 text-slate-400" /></div>
          <div className="detail-grid-three">{readOnlyFields.map(([label, value]) => <label className={labelClassName} key={label}><span>{label}</span><input value={value} disabled className={`w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-slate-800 text-sm font-medium disabled:opacity-100 ${label === 'Importe' ? 'amount-value' : ''}`} readOnly /></label>)}</div>
        </section>

        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm mb-6">
          <div className="detail-card-heading"><h2 className="text-base font-bold text-slate-800">Contrato y evidencia</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <label><span className="text-xs font-medium text-slate-600 mb-1.5 block h-4">Referencia de contrato</span><input className="w-full h-11 px-3.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 flex items-center" placeholder="Ej. CTR-2026-0031" /></label>
            <div><span className="text-xs font-medium text-slate-600 mb-1.5 block h-4">Evidencia contractual</span><button type="button" className="w-full h-11 px-3.5 bg-slate-50 hover:bg-slate-100/80 border border-dashed border-slate-300 rounded-xl cursor-pointer flex items-center justify-start gap-2 transition-colors"><Upload aria-hidden="true" className="w-4 h-4 text-slate-500 flex-shrink-0" /><span className="text-xs text-slate-600 font-medium truncate">Adjuntar archivo (PDF, JPG, PNG - Máx 10MB)</span></button></div>
            <label className="col-span-full text-xs font-medium text-slate-600"><span className="mb-1.5 block">Observación contractual</span><textarea className="w-full text-xs font-normal text-slate-700 bg-white border border-slate-200/90 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400 resize-none" rows={2} placeholder="Añade una observación relevante para la operación" /></label>
          </div>
        </section>

        <section className="detail-card editable-card">
          <div className="detail-card-heading"><h2 className="text-base font-bold text-slate-800">Condiciones comerciales editables</h2><span className="required-note">* Campos obligatorios</span></div>
          <div className="detail-grid-three">
            {['Modalidad del Servicio*', 'Frecuencia del Servicio*', 'Periodicidad de Facturación*', 'Periodicidad de Pago*', 'Condición de Pago*'].map((label, index) => {
              const value = serviceConditions[index]

              return <label className={labelClassName} key={label}><span>{label}</span><select value={value} onChange={(event) => setServiceConditions((current) => current.map((condition, conditionIndex) => conditionIndex === index ? event.target.value : condition))} className={`${controlClassName} ${value === '' ? 'text-slate-400 font-normal' : filledControlClassName}`}><option value="" disabled className="text-slate-400">Seleccionar opción</option><option value="Mensual" className="text-slate-700">Mensual</option><option value="Trimestral" className="text-slate-700">Trimestral</option><option value="Anual" className="text-slate-700">Anual</option></select></label>
            })}
            <label className={labelClassName}><span>Fecha Inicio del Servicio*</span><input className={`${controlClassName} ${filledControlClassName}`} type="date" defaultValue="2026-09-24" /></label><label className={labelClassName}><span>Fecha Fin del Servicio</span><input className={controlClassName} type="date" /></label><label className={labelClassName}><span>Cantidad de Cuotas</span><input className={`${controlClassName} ${filledControlClassName}`} type="number" min="1" defaultValue="12" /></label><label className={labelClassName}><span>Primer Vencimiento</span><input className={`${controlClassName} ${filledControlClassName}`} type="date" defaultValue="2026-10-24" /></label>
          </div>
        </section>

        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm mb-6">
          <div className="detail-card-heading"><h2 className="text-base font-bold text-slate-800">Versionado y trazabilidad</h2><History aria-hidden="true" className="heading-icon brand" /></div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <label className="md:col-span-3"><span className="text-xs font-medium text-slate-600 mb-1.5 block h-4">Versión vigente</span><input className="w-full h-11 px-3.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed" value="V1 · 24/09/2026" disabled readOnly /></label>
            <label className="md:col-span-4"><span className="text-xs font-medium text-slate-600 mb-1.5 block h-4">Motivo del cambio*</span><input className="w-full h-11 px-3.5 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4B93]/20 focus:border-[#2A4B93] placeholder:text-slate-400" placeholder="Describe el motivo de esta versión" /></label>
            <div className="md:col-span-3"><span className="text-xs font-medium text-slate-600 mb-1.5 block h-4">Evidencia de versión</span><button type="button" className="h-11 px-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl cursor-pointer flex items-center justify-start gap-2 transition-colors w-full"><Upload aria-hidden="true" className="w-4 h-4 text-slate-500 flex-shrink-0" /><span className="text-xs text-slate-600 truncate">Adjuntar (PDF/PNG)</span></button></div>
            <div className="md:col-span-2"><span className="text-xs mb-1.5 block h-4 select-none opacity-0" aria-hidden="true">Alineador</span><button type="button" onClick={() => setShowHistory(true)} className="h-11 w-full px-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors shadow-sm"><History aria-hidden="true" className="w-4 h-4 text-[#2A4B93]" /><span>Ver versiones</span></button></div>
          </div>
        </section>
      </div>

      {showHistory && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100"><div className="flex items-center gap-2.5"><History aria-hidden="true" className="w-5 h-5 text-[#2A4B93]" /><h2 id="history-title" className="text-base font-bold text-slate-800">Historial de versiones y trazabilidad</h2></div><button type="button" onClick={() => setShowHistory(false)} aria-label="Cerrar historial" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"><X aria-hidden="true" className="w-5 h-5" /></button></div>
          <div className="px-6 py-5 flex flex-col gap-5">
            <article className="relative pl-5 border-l-2 border-emerald-200"><div className="flex items-center gap-2 mb-2"><span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">V2 (Vigente)</span><span className="text-xs text-slate-500">27/09/2026 - 10:30 AM por María González</span></div><p className="text-sm text-slate-700">Actualización de condiciones de pago y ajuste de cuotas a 12 meses.</p><button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2A4B93] bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-100"><FileText aria-hidden="true" className="w-3.5 h-3.5" />Evidencia_v2.pdf<Download aria-hidden="true" className="w-3.5 h-3.5" /></button></article>
            <article className="relative pl-5 border-l-2 border-slate-200"><div className="flex items-center gap-2 mb-2"><span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 text-slate-600 border border-slate-200">V1</span><span className="text-xs text-slate-500">24/09/2026 - 02:15 PM por Carlos Pérez</span></div><p className="text-sm text-slate-700">Creación inicial de las condiciones comerciales y contrato base.</p><button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2A4B93] bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1.5 hover:bg-blue-100"><FileText aria-hidden="true" className="w-3.5 h-3.5" />Contrato_Inicial_V1.pdf<Download aria-hidden="true" className="w-3.5 h-3.5" /></button></article>
          </div>
          <div className="flex justify-end px-6 py-4 bg-slate-50 border-t border-slate-100"><button type="button" onClick={() => setShowHistory(false)} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100">Cerrar trazabilidad</button></div>
        </div>
      </div>}

      <footer className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-3 flex items-center justify-between shadow-lg ${showHistory ? 'hidden' : ''}`}>
        <div>
          <button type="button" className="h-10 px-4 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-full flex items-center gap-2 transition-all">
            <Trash2 aria-hidden="true" className="w-3.5 h-3.5 text-rose-600" />
            <span>Descartar cambios</span>
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={() => setShowHistory(true)} className="h-10 px-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm">
            <History aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
            <span>Consultar Historial</span>
          </button>
          <button type="button" className="h-10 px-4 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm">
            <FileText aria-hidden="true" className="w-3.5 h-3.5 text-slate-500" />
            <span>Previsualizar CxC</span>
          </button>
          <button type="button" className="h-10 px-4 border border-[#2A4B93]/30 text-[#2A4B93] bg-[#2A4B93]/5 hover:bg-[#2A4B93]/10 rounded-full text-xs font-semibold flex items-center gap-2 transition-all">
            <Save aria-hidden="true" className="w-3.5 h-3.5 text-[#2A4B93]" />
            <span>Guardar borrador</span>
          </button>
          <button type="button" className="h-10 px-5 bg-[#2A4B93] hover:bg-[#1f3870] text-white rounded-full text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#2A4B93]/20 transition-all">
            <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Confirmar condiciones</span>
          </button>
        </div>
      </footer>
    </section>
  )
}
