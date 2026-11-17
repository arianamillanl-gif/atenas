import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DetalleVentaModule from '@/components/ventas-verificadas/DetalleVentaModule'
import { findSale } from '@/components/ventas-verificadas/list-data'

export const metadata: Metadata = {
  title: 'Detalle de Venta Verificada · ATENAS',
}

export default async function DetalleVentaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sale = findSale(id)
  if (!sale) notFound()
  return <DetalleVentaModule key={sale.ref} sale={sale} />
}
