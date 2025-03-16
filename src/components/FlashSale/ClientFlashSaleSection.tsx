'use client'

import { FlashSaleCard } from './FlashSaleCard'
import { FlashSale } from '@/payload-types'

interface ClientFlashSaleSectionProps {
  activeSales: FlashSale[]
}

export function ClientFlashSaleSection({ activeSales }: ClientFlashSaleSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Flash Sales</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeSales.map((sale) => (
          <FlashSaleCard key={sale.id} sale={sale} />
        ))}
      </div>
    </section>
  )
} 