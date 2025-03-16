import type { Metadata } from 'next/types'

import React from 'react'
import PageClient from './page.client'
import { ProductArchive } from '@/components/ProductArchive'
import {
  getAllCategories,
  getFilteredProducts,
  getAllSizes,
  getAllColors,
  getAllTagExtra,
} from '@/actions/productAction'

import MobileFilters from '@/components/MobileFilters'
import BreadcrumbProduct from '@/heros/ProductHero/components/BreadcrumbProduct'
import { Separator } from '@/components/ui/separator'

import { ProductPageRange } from '@/components/PageRange/ProductsPageRange'
import { ProductsPagination } from '@/components/Pagination/ProductPagination'
import ProductFilter from '@/components/ProductFilter'

export const dynamic = 'force-dynamic'

interface SearchParams {
  query?: string
  category?: string
  brand?: string
  color?: string
  size?: string
  price?: string
  rating?: string
  sort?: string
  page?: string
  q?: string
  tag?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const {
    query = 'all',
    category = 'all',
    brand = 'all',
    color = 'all',
    size = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = params

  // Validate and sanitize numeric values
  const pageNumber = Math.max(1, Number.isFinite(Number(page)) ? Number(page) : 1)

  let priceRange = { min: 0, max: 1000000 }
  if (price !== 'all') {
    const [minStr = '0', maxStr = '1000000'] = price.split('-')
    const minPrice = Number(minStr)
    const maxPrice = Number(maxStr)

    if (Number.isFinite(minPrice) && Number.isFinite(maxPrice)) {
      priceRange = {
        min: Math.max(0, minPrice),
        max: Math.min(1000000, maxPrice),
      }
    }
  }

  const categories = await getAllCategories()
  const sizes = await getAllSizes()
  const colors = await getAllColors()
  const tags = await getAllTagExtra()

  try {
    const filteredProducts = await getFilteredProducts({
      query,
      category,
      brand,
      color,
      size,
      price: `${priceRange.min}-${priceRange.max}`,
      rating,
      sort,
      limit: 12,
      page: pageNumber,
    })

    if (!filteredProducts?.success) {
      throw new Error('Failed to fetch products')
    }

    const { products = [], totalPages = 1, currentPage = 1 } = filteredProducts.data || {}

    return (
      <main className="pb-20">
        <PageClient />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <Separator />
          <BreadcrumbProduct title={''} />
          <div className="flex md:space-x-5 items-start">
            <div className="hidden md:block min-w-[295px] max-w-[295px]">
              <ProductFilter categories={categories} sizes={sizes} colors={colors} tags={tags} />
            </div>
            <div className="flex flex-col w-full space-y-5">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="flex items-center justify-between">
                  <h1 className="font-bold text-2xl md:text-[32px] dark:text-white">Products</h1>
                  <MobileFilters
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                    tags={tags}
                  />
                </div>
                <div className="flex flex-col sm:items-center sm:flex-row">
                  <span className="text-sm md:text-base mr-3 dark:text-gray-300">
                    <ProductPageRange
                      collection="products"
                      currentPage={currentPage}
                      limit={12}
                      totalDocs={products.length}
                    />
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <ProductArchive products={products} />
              </div>

              {totalPages > 1 && <ProductsPagination page={currentPage} totalPages={totalPages} />}
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('Failed to fetch products')
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const params = await searchParams
  const { query = 'all', category = 'all', tag = 'all', price = 'all', rating = 'all' } = params

  const hasFilters =
    (query !== 'all' && query !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'

  return {
    title: hasFilters
      ? `Search ${query !== 'all' ? query : ''} 
         ${category !== 'all' ? `: Category ${category}` : ''} 
         ${tag !== 'all' ? `: Tag ${tag}` : ''} 
         ${price !== 'all' ? `: Price ${price}` : ''} 
         ${rating !== 'all' ? `: Rating ${rating}` : ''}`
      : 'Payload Products',
  }
}
