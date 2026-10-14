import type { Metadata } from 'next'
import ServiciosModule from '@/components/ServiciosModule'

export const metadata: Metadata = {
  title: 'Catálogo de Servicios · ATENAS',
}

export default function ServiciosPage() {
  return <ServiciosModule />
}
