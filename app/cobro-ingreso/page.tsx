import type { Metadata } from 'next'
import CobroIngresoModule from '@/components/CobroIngresoModule'

export const metadata: Metadata = {
  title: 'Cobro / Ingreso · ATENAS',
  description: 'Ficha F05 para registrar y revisar ingresos recibidos en ATENAS.',
}

export default function CobroIngresoPage() {
  return <CobroIngresoModule />
}
