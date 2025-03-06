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

export const dynamic = 'force-static'
export const revalidate = 600

interface ProductsPageProps {
  searchParams: Promise<{
    query?: string
    category?: string
    brand?: string
    color?: string
    size?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}

export default async function Page({ searchParams }: ProductsPageProps) {
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
  } = await searchParams

  const categories = await getAllCategories()
  const sizes = await getAllSizes()
  const colors = await getAllColors()
  const tags = await getAllTagExtra()
  
  const filteredProducts = await getFilteredProducts({
    query,
    category,
    brand,
    color,
    size,
    price,
    rating,
    sort,
    limit: 12,
    page: Number(page),
  })

  if (!filteredProducts?.success) {
    throw new Error('Failed to fetch products')
  }

  const {
    products = [],
    totalPages = 1,
    currentPage = 1,
    // hasNextPage = false,
    // hasPrevPage = false,
  } = filteredProducts.data || {}

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
                <MobileFilters categories={categories} sizes={sizes} colors={colors} tags={tags} />
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
}

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}): Promise<Metadata> {
  const searchParams = await props.searchParams
  const { q = 'all', category = 'all', tag = 'all', price = 'all', rating = 'all' } = searchParams

  const hasFilters =
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'

  return {
    title: hasFilters
      ? `Search ${q !== 'all' ? q : ''} 
         ${category !== 'all' ? `: Category ${category}` : ''} 
         ${tag !== 'all' ? `: Tag ${tag}` : ''} 
         ${price !== 'all' ? `: Price ${price}` : ''} 
         ${rating !== 'all' ? `: Rating ${rating}` : ''}`
      : 'Payload products Template',
  }
}
