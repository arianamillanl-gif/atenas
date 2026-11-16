import type { Metadata } from 'next'
import DetalleVentaModule from '@/components/ventas-verificadas/DetalleVentaModule'

export const metadata: Metadata = {
  title: 'Detalle de Venta Verificada · ATENAS',
}

export default async function DetalleVentaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DetalleVentaModule key={id} saleId={id} />
}
