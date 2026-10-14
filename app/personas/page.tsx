import type { Metadata } from 'next'
import PersonasModule from '@/components/personas/PersonasModule'

export const metadata: Metadata = {
  title: 'Personas · ATENAS',
}

export default function PersonasPage() {
  return <PersonasModule />
}
