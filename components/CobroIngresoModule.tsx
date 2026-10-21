"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronDown,
  FileUp,
  History,
  Lock,
  Search,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 shadow-2xs focus:border-[#2A4B93] focus:ring-2 focus:ring-[#2A4B93]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";
const statusStyles: Record<string, string> = {
  Registrado: "border-sky-200 bg-sky-50 text-sky-700",
  Disponible: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Aplicado: "border-violet-200 bg-violet-50 text-violet-700",
  Reversado: "border-rose-200 bg-rose-50 text-rose-700",
};

const records = [
  {
    id: "ING-2026-0048",
    reference: "TRF-8820194",
    date: "18/10/2026",
    client: "Corporación Andina, C.A.",
    amount: "USD 2,450.00",
    status: "Disponible",
    application: "Pendiente",
  },
  {
    id: "ING-2026-0047",
    reference: "ZEL-339021",
    date: "17/10/2026",
    client: "Servicios Delta, S.A.",
    amount: "USD 980.00",
    status: "Aplicado",
    application: "Aplicado",
  },
  {
    id: "ING-2026-0046",
    reference: "DEP-110284",
    date: "16/10/2026",
    client: "Pendiente de identificación",
    amount: "VES 18,500.00",
    status: "Registrado",
    application: "Pendiente",
  },
  {
    id: "ING-2026-0045",
    reference: "TRF-8813201",
    date: "14/10/2026",
    client: "Inversiones Meridiano",
    amount: "EUR 1,200.00",
    status: "Reversado",
    application: "No aplica",
  },
];

function SelectField({
  label,
  children,
  defaultValue,
}: {
  label: string;
  children: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <select
          defaultValue={defaultValue}
          className={`${inputClass} cursor-pointer appearance-none pr-9`}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={15}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}
    >
      <span aria-hidden="true" className="mr-1">
        •
      </span>
      {status}
    </span>
  );
}

export default function CobroIngresoModule() {
  const [status, setStatus] = useState("Registrado");
  const [pendingId, setPendingId] = useState(false);
  const [clientOpen, setClientOpen] = useState(false);
  const [client, setClient] = useState("Corporación Andina, C.A.");
  const [amount, setAmount] = useState("2450");
  const [rate, setRate] = useState("36.50");
  const [notes, setNotes] = useState("");
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [reverseOpen, setReverseOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [reverseReason, setReverseReason] = useState("");
  const [tab, setTab] = useState("Todos");
  const [saved, setSaved] = useState(false);
  const referenceAmount = useMemo(
    () =>
      (Number(amount || 0) * Number(rate || 0)).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [amount, rate],
  );
  const filteredRecords =
    tab === "Todos"
      ? records
      : records.filter((record) => record.status === tab);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }
  function cancel() {
    dirty ? setDiscardOpen(true) : undefined;
  }
  function save() {
    setSaved(true);
    setDirty(false);
    setStatus("Registrado");
    window.setTimeout(() => setSaved(false), 2200);
  }
  function confirmReverse() {
    if (reverseReason.trim().length < 20) return;
    setStatus("Reversado");
    setReverseOpen(false);
    setReverseReason("");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar hidden lg:flex">
        <div className="sidebar-content">
          <div className="brand">
            <img src="/logo-atenas.png" alt="ATENAS" />
          </div>
          <div className="workspace-switch">
            <div className="workspace-avatar">LF</div>
            <div>
              <strong>Lo-Fi workspace</strong>
              <span>Tesorería</span>
            </div>
            <ChevronDown size={15} />
          </div>
          <nav className="nav" aria-label="Navegación principal">
            <span className="nav-label">MENÚ PRINCIPAL</span>
            <a href="#resumen">Resumen</a>
            <span className="nav-label second">GESTIÓN</span>
            <a href="/personas">Personas</a>
            <a href="/servicios">Servicios</a>
            <a href="/maestro-cartera">Maestro de cartera</a>
            <a href="/asignaciones">Asignaciones de cartera</a>
            <a href="/unidades">Unidades</a>
            <a href="/estructuras">Estructuras</a>
            <a className="active" href="/cobro-ingreso" aria-current="page">
              Cobro / Ingreso
            </a>
            <span className="nav-label second">CONFIGURACIÓN</span>
            <a href="#gobernanza">Gobernanza</a>
            <a href="#ajustes">Ajustes</a>
          </nav>
        </div>
        <div className="sidebar-footer">
          <div className="support-card">¿Necesitas ayuda?</div>
          <div className="user-card">
            <div className="user-avatar">MG</div>
            <div>
              <strong>María González</strong>
              <span>Administradora</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Tesorería</span>
            <span>›</span>
            <strong>Cobro / Ingreso</strong>
          </div>
          <div className="top-user">
            <span className="user-avatar">MG</span>
            <span className="hidden md:inline">María González</span>
          </div>
        </header>
        <main className="detail-page">
          <div className="page-wrap">
            <div className="detail-breadcrumb">
              Catálogos maestros <span>›</span> Tesorería <span>›</span>
              <strong>Cobro o ingreso</strong>
            </div>
            <section className="mb-6">
              <h1 className="mb-1 text-2xl font-bold text-slate-900">
                Cobro / Ingreso
              </h1>
              <p className="mb-6 text-xs text-slate-500">
                Registrar o revisar el dinero recibido independientemente de su
                posterior aplicación a CxC.
              </p>
              <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xs">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2A4B93] text-xs font-bold text-white shadow-2xs">
                        CI
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ficha F05</span>
                      <span className="text-slate-300">•</span>
                      <h2 className="text-lg font-bold tracking-tight text-slate-900">ING-2026-0048</h2>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Ingreso: Registrado
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Aplicación: Pendiente
                      </span>
                    </div>
<button
  onClick={() => setIsHistoryDrawerOpen(true)}
  className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-[#2A4B93] rounded-full text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0"
>
  <History className="w-3.5 h-3.5 text-slate-500" />
  <span>Ver trazabilidad</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-slate-500">
                      Registro de dinero recibido independientemente de su posterior aplicación a CxC.
                    </p>
                    <div className="flex shrink-0 items-center gap-3 self-end sm:self-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fecha Registro:</span>
                        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 text-xs font-semibold text-slate-600">
                          <Lock size={12} className="text-slate-400" />
                          <span>18/10/2026</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fecha Valor:</span>
                        <div className="relative h-8">
                          <input
                            type="date"
                            aria-label="Fecha valor banco"
                            defaultValue="2026-10-18"
                            className="h-8 w-32 cursor-pointer rounded-lg border border-slate-200 bg-white pl-2.5 pr-7 text-xs font-semibold text-slate-800 focus:border-[#2A4B93] focus:ring-1 focus:ring-[#2A4B93] [&::-webkit-calendar-picker-indicator]:opacity-0"
                          />
                          <Calendar size={14} className="pointer-events-none absolute right-2 top-2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <form
              onChange={markDirty}
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              <section className="mb-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs">
                <div className="mb-5">
                  <h2 className="mb-1 text-sm font-bold text-slate-900">
                    Trazabilidad, Origen y Asociación de Cliente
                  </h2>
                  <p className="text-xs text-slate-500">
                    Identifica el origen bancario del ingreso y su relación con
                    el cliente.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <SelectField label="Unidad de Negocio *">
                    <option>Unidad Corporativa</option>
                    <option>Unidad Comercial Norte</option>
                    <option>Unidad Servicios Profesionales</option>
                  </SelectField>
                  <SelectField label="Banco Receptor / Cuenta *">
                    <option>Banco Nacional · **** 4821</option>
                    <option>Banco Mercantil · **** 1930</option>
                  </SelectField>
                  <div>
                    <label htmlFor="reference" className={labelClass}>
                      Nro. Referencia Bancaria *
                    </label>
                    <input
                      id="reference"
                      className={inputClass}
                      defaultValue="TRF-8820194"
                      placeholder="Número de referencia"
                    />
                  </div>
                  <SelectField label="Medio de Ingreso *">
                    <option>Transferencia</option>
                    <option>Pago Móvil</option>
                    <option>Zelle</option>
                    <option>Depósito</option>
                    <option>Efectivo</option>
                  </SelectField>
                  <div className="relative">
                    <label htmlFor="client" className={labelClass}>
                      Cliente Asociado
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        id="client"
                        disabled={pendingId}
                        value={client}
                        onFocus={() => setClientOpen(true)}
                        onChange={(event) => {
                          setClient(event.target.value);
                          setClientOpen(true);
                        }}
                        className={`${inputClass} pl-9 ${pendingId ? "bg-slate-100 text-slate-400" : ""}`}
                        placeholder="Buscar cliente..."
                      />
                    </div>
                    {clientOpen && !pendingId && (
                      <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setClient("Corporación Andina, C.A.");
                            setClientOpen(false);
                          }}
                          className="block w-full px-4 py-3 text-left text-xs hover:bg-slate-50"
                        >
                          Corporación Andina, C.A.
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setClient("Inversiones Meridiano");
                            setClientOpen(false);
                          }}
                          className="block w-full px-4 py-3 text-left text-xs hover:bg-slate-50"
                        >
                          Inversiones Meridiano
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 self-end rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
                    <input
                      id="pending-identification"
                      type="checkbox"
                      checked={pendingId}
                      onChange={(event) => {
                        setPendingId(event.target.checked);
                        markDirty();
                      }}
                      className="size-4 shrink-0 accent-[#2A4B93]"
                    />
                    <label htmlFor="pending-identification" className="cursor-pointer text-xs font-medium text-slate-700">
                      <span className="block">Pendiente de identificación</span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">
                        Activar cuando el pago no pueda asociarse a un cliente en firme.
                      </span>
                    </label>
                  </div>
                </div>
              </section>
              <section className="mb-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xs">
                <div className="mb-5">
                  <h2 className="mb-1 text-sm font-bold text-slate-900">
                    Valores Financieros y Monedas Multivariable
                  </h2>
                  <p className="text-xs text-slate-500">
                    Registra el importe recibido y conserva la trazabilidad de su conversión.
                  </p>
                </div>
                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="original-currency" className={labelClass}>
                      Moneda Original *
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700">
                        USD
                      </span>
                      <select
                        id="original-currency"
                        defaultValue="USD"
                        className={`${inputClass} cursor-pointer appearance-none pl-12 pr-9 font-semibold`}
                      >
                        <option>USD</option>
                        <option>VES</option>
                        <option>EUR</option>
                        <option>BRL</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="amount" className={labelClass}>
                      Importe Original *
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                        $
                      </span>
                      <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className={`${inputClass} h-10 pl-8 text-right font-semibold text-slate-900`}
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 md:p-5">
                  <span className="mb-3 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    CÁLCULO Y REFERENCIA DINÁMICA DE CONVERSIÓN
                  </span>
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="reference-currency" className={labelClass}>
                        Moneda de Referencia
                      </label>
                      <select
                        id="reference-currency"
                        defaultValue="VES"
                        className={`${inputClass} h-11 cursor-pointer appearance-none font-semibold`}
                      >
                        <option>VES</option>
                        <option>USD</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rate" className={labelClass}>
                        Tasa de Cambio
                      </label>
                      <input
                        id="rate"
                        type="number"
                        step="0.01"
                        value={rate}
                        onChange={(event) => setRate(event.target.value)}
                        className={`${inputClass} h-11`}
                      />
                      <p className="mt-1 text-[10px] text-slate-400">
                        Tasa oficial aplicable según fecha valor
                      </p>
                    </div>
                    <div>
                      <span className={labelClass}>Importe de Referencia - Calculado</span>
                      <div className="flex h-11 items-center justify-between rounded-xl border border-slate-300/80 bg-slate-100 px-3.5 font-mono text-sm font-bold text-slate-900 shadow-2xs">
                        <span className="flex items-center gap-2">
                          <Lock size={13} className="text-slate-500" aria-hidden="true" />
                          {referenceAmount} VES
                        </span>
                        <span className="rounded bg-slate-200 px-2 py-0.5 font-sans text-[10px] font-semibold text-slate-600">
                          Calculado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900">
                    Comprobante y Observaciones
                  </h2>
                </div>
                <label
                  htmlFor="receipt"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center transition-colors hover:bg-slate-50"
                >
                  <FileUp className="mb-2 text-[#2A4B93]" size={22} />
                  <span className="text-xs font-semibold text-slate-700">
                    Adjuntar Comprobante Digital
                  </span>
                  <span className="mt-1 text-[11px] text-slate-400">
                    Arrastra un archivo o haz clic para seleccionar · PDF, JPG o
                    PNG
                  </span>
                  <input id="receipt" type="file" className="sr-only" />
                </label>
                <div className="mt-5">
                  <label htmlFor="notes" className={labelClass}>
                    Observaciones de Ingreso
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Añade información relevante sobre este ingreso..."
                  />
                  <div className="mt-1 text-right text-[11px] text-slate-400">
                    {notes.length}/500
                  </div>
                </div>
              </section>
              <footer className="rounded-b-3xl border-t border-slate-200/80 bg-white p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={cancel}
                  className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReverseOpen(true)}
                    className="rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    Reversar ingreso
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#2A4B93] px-8 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1E366B]"
                  >
                    {saved ? "Ingreso registrado" : "Registrar Ingreso"}
                  </button>
                </div>
              </footer>
            </form>
            <section className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Histórico de Cobros / Ingresos
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Consulta y gestiona los ingresos registrados en tesorería.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {filteredRecords.length} registros
                </span>
              </div>
              <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-100 pb-2">
                {[
                  "Todos",
                  "Registrados",
                  "Disponibles",
                  "Aplicados",
                  "Reversados",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setTab(item)}
                    className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${tab === item ? "bg-[#edf4ff] text-[#2A4B93]" : "text-slate-400 hover:bg-slate-50"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-[1200px] w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/70 text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="px-3 py-3">ID / Fecha</th>
                      <th className="px-3 py-3">Referencia</th>
                      <th className="px-3 py-3">Cliente</th>
                      <th className="px-3 py-3">Importe</th>
                      <th className="px-3 py-3">Estado</th>
                      <th className="px-3 py-3">Aplicación</th>
                      <th className="sticky right-0 z-20 bg-white px-3 py-3 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)]">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-t border-slate-100 hover:bg-slate-50/40"
                      >
                        <td className="px-3 py-3 font-semibold text-slate-800">
                          {record.id}
                          <small className="mt-1 block font-normal text-slate-400">
                            {record.date}
                          </small>
                        </td>
                        <td className="px-3 py-3 font-mono text-slate-600">
                          {record.reference}
                        </td>
                        <td className="px-3 py-3 text-slate-700">
                          {record.client}
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-900">
                          {record.amount}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-3 py-3 text-slate-500">
                          {record.application}
                        </td>
                        <td className="sticky right-0 bg-white px-3 py-3 text-right shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.08)]">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              className="rounded-full bg-[#2A4B93] px-3 py-1.5 text-[11px] font-semibold text-white"
                            >
                              {record.status === "Disponible"
                                ? "Consultar / Aplicar"
                                : "Consultar"}
                            </button>
                            {record.status !== "Reversado" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setStatus("Reversado");
                                  setReverseOpen(true);
                                }}
                                className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                              >
                                Reversar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
      {discardOpen && (
        <div
          className="confirmation-backdrop"
          onClick={() => setDiscardOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="discard-title"
            onClick={(event) => event.stopPropagation()}
            className="confirmation-modal"
          >
            <button
              type="button"
              onClick={() => setDiscardOpen(false)}
              className="float-right text-slate-400"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={22} />
            </div>
            <h2 id="discard-title">¿Descartar cambios?</h2>
            <p>
              La información editada no se guardará en el registro de ingreso.
            </p>
            <div className="confirmation-actions">
              <button
                type="button"
                onClick={() => setDiscardOpen(false)}
                className="modal-cancel"
              >
                Continuar editando
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscardOpen(false);
                  setDirty(false);
                }}
                className="rounded-full bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white"
              >
                Sí, descartar
              </button>
            </div>
          </div>
        </div>
      )}
      {reverseOpen && (
        <div
          className="confirmation-backdrop"
          onClick={() => setReverseOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reverse-title"
            onClick={(event) => event.stopPropagation()}
            className="confirmation-modal"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle size={22} />
            </div>
            <h2 id="reverse-title">Reversar ingreso</h2>
            <p>
              Confirma el reverso de{" "}
              <strong>ING-2026-0049 · USD {amount}</strong>. Esta acción quedará
              registrada en auditoría.
            </p>
            <label htmlFor="reverse-reason" className={labelClass}>
              Motivo de Reverso *
            </label>
            <textarea
              id="reverse-reason"
              autoFocus
              rows={4}
              minLength={20}
              value={reverseReason}
              onChange={(event) => setReverseReason(event.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Describe el motivo del reverso (mínimo 20 caracteres)..."
            />
            <p className="!mt-1 !mb-0 text-[11px] text-slate-400">
              {reverseReason.trim().length}/20 caracteres mínimos
            </p>
            <div className="confirmation-actions mt-5">
              <button
                type="button"
                onClick={() => setReverseOpen(false)}
                className="modal-cancel"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={reverseReason.trim().length < 20}
                onClick={confirmReverse}
                className="rounded-full bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Confirmar Reverso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
