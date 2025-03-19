'use client'

import { Product } from '@/payload-types'
import { Card } from './ProductCard/Card'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} doc={product} />
      ))}
    </div>
  )
}
