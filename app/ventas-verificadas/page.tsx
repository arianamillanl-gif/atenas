import type { Metadata } from 'next'
import VentasListModule from '@/components/ventas-verificadas/VentasListModule'

export const metadata: Metadata = {
  title: 'Ventas verificadas · ATENAS',
}

export default function VentasVerificadasPage() {
  return <VentasListModule />
}
