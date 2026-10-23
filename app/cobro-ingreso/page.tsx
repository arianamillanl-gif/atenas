import type { Metadata } from 'next'
import CobroIngresoModule from '@/components/CobroIngresoModule'

export const metadata: Metadata = {
  title: 'Aplicación de Ingresos a CxC · ATENAS',
  description: 'Aplica ingresos bancarios disponibles a cuentas por cobrar en ATENAS.'
}

export default function CobroIngresoPage() {
  return <CobroIngresoModule />
}
