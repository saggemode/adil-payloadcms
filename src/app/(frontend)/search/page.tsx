import { Metadata } from 'next'

import ProductSearch from '@/components/ProductSearch'
import ProductGrid from '@/components/ProductArchive/ProductGrid'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Product } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search for products in our store',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    barcode?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { q, barcode } = params
  const payload = await getPayload({ config: configPromise })

  let products: Product[] = []

  if (barcode) {
    // Search by barcode
    const result = await payload.find({
      collection: 'products',
      where: {
        barcode: {
          equals: barcode,
        },
      },
    })
    products = result.docs as Product[]
  } else if (q) {
    // Search by text
    const result = await payload.find({
      collection: 'products',
      where: {
        title: {
          like: q,
        },
      },
    })
    products = result.docs as Product[]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSearch />
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {barcode
              ? 'No products found with this barcode'
              : q
                ? 'No products found matching your search'
                : 'Search for products'}
          </h2>
          <p className="text-gray-600">
            {barcode
              ? 'Try scanning a different barcode or use text search'
              : q
                ? 'Try different keywords or use barcode scanning'
                : 'Use the search bar above to find products'}
          </p>
        </div>
      )}
    </div>
  )
}
