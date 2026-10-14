import type { Metadata } from 'next'
import MaestroCarteraModule from '@/components/MaestroCarteraModule'

export const metadata: Metadata = {
  title: 'Maestro de Cartera · ATENAS',
}

export default function MaestroCarteraPage() {
  return <MaestroCarteraModule />
}
