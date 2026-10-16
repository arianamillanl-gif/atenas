import type { Metadata } from 'next'
import AsignacionesModule from '@/components/asignaciones/AsignacionesModule'

export const metadata: Metadata = {
  title: 'Asignaciones de cartera · ATENAS',
  description: 'Ficha F04B: asignar clientes a carteras preservando la vigencia temporal y el historial inmutable de reasignaciones.',
}

export default async function AsignacionesPage({ searchParams }: { searchParams: Promise<{ clienteId?: string | string[] }> }) {
  const { clienteId } = await searchParams
  const contextClientId = typeof clienteId === 'string' ? clienteId : undefined
  return <AsignacionesModule key={contextClientId ?? 'global'} contextClientId={contextClientId} />
}
