import type { Metadata } from 'next'
import BscDashboard from '@/components/BscDashboard'

export const metadata: Metadata = {
  title: 'BSC Comisiones · ATENAS v2.0',
  description: 'Control gerencial consultivo de comisiones y trazabilidad de cierre mensual en ATENAS.',
}

export default async function BscComisionesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams
  return <BscDashboard key={view ?? 'default'} initialView={view} />
}
