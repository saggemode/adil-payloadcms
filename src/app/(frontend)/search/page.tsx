import { Metadata } from 'next'

import ProductSearch from '@/components/ProductSearch'
import ProductGrid from '@/components/ProductArchive/ProductGrid'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Product } from '@/payload-types'
import { getFilteredProducts } from '@/actions/productAction'
import { ProductsPagination } from '@/components/Pagination/ProductPagination'

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search for products in our store',
}

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    barcode?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { q, barcode, page = '1' } = params
  const pageNumber = Math.max(1, Number.isFinite(Number(page)) ? Number(page) : 1)

  // Use the existing getFilteredProducts function for server-side filtering
  const result = await getFilteredProducts({
    query: q || '',
    limit: 12,
    page: pageNumber,
  })

  if (!result.success) {
    throw new Error('Failed to fetch products')
  }

  const { products = [], totalPages = 1, currentPage = 1 } = result.data || {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <ProductSearch />
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <ProductsPagination page={currentPage} totalPages={totalPages} />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {barcode
              ? 'No products found with this barcode'
              : q
                ? 'No products found matching your search'
                : 'All Products'}
          </h2>
          <p className="text-gray-600">
            {barcode
              ? 'Try scanning a different barcode or use text search'
              : q
                ? 'Try different keywords or use barcode scanning'
                : 'Browse through our complete product catalog'}
          </p>
        </div>
      )}
    </div>
  )
}
