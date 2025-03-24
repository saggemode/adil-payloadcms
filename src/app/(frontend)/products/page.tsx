import type { Metadata } from 'next/types'

import React from 'react'
import PageClient from './page.client'
import { ProductArchive } from '@/components/ProductArchive'
import {
  getAllCategories,
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
import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
  const categories = await getAllCategories()
  const sizes = await getAllSizes()
  const colors = await getAllColors()
  const tags = await getAllTagExtra()

  try {
    const payload = await getPayload({ config: configPromise })

    // Build where clause based on search parameters
    const where: any = {
      isPublished: {
        equals: true,
      },
    }

    // Add search query filter
    if (params.query) {
      where.title = {
        like: params.query,
      }
    }

    // Add category filter
    if (params.category && params.category !== 'all') {
      where.categories = {
        contains: params.category,
      }
    }

    // Add tag filter
    if (params.tag && params.tag !== 'all') {
      where.tags = {
        contains: params.tag,
      }
    }

    // Add color filter
    if (params.color && params.color !== 'all') {
      where.colors = {
        contains: params.color.toLowerCase(),
      }
    }

    // Add size filter
    if (params.size && params.size !== 'all') {
      where.sizes = {
        contains: params.size.toLowerCase(),
      }
    }

    // Add price range filter
    if (params.price && params.price !== '0-1000000') {
      const [minPrice, maxPrice] = params.price.split('-').map(Number)
      where.price = {
        greater_than_equal: minPrice,
        less_than_equal: maxPrice,
      }
    }

    // Add rating filter
    if (params.rating && params.rating !== 'all') {
      where.avgRating = {
        greater_than_equal: Number(params.rating),
      }
    }

    // Add sorting
    let sort = '-createdAt' // Default sort
    if (params.sort) {
      switch (params.sort) {
        case 'price-low-to-high':
          sort = 'price'
          break
        case 'price-high-to-low':
          sort = '-price'
          break
        case 'best-selling':
          sort = '-numSales'
          break
        case 'avg-customer-review':
          sort = '-avgRating'
          break
        default:
          sort = '-createdAt'
      }
    }

    const products = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 12,
      page: Number(params.page) || 1,
      where,
      sort,
      overrideAccess: false,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
        price: true,
        listPrice: true,
        countInStock: true,
        numSales: true,
        avgRating: true,
        numReviews: true,
        images: true,
        content: true,
        tags: true,
        brands: true,
        colors: true,
        sizes: true,
        isPublished: true,
        isFeatured: true,
        createdAt: true,
        updatedAt: true,
        _status: true,
      },
    })

    if (!products) {
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
                </div>
                <div className="w-full text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
                    No products found for the selected filters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )
    }

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
                      currentPage={products.page}
                      limit={12}
                      totalDocs={products.totalDocs}
                    />
                  </span>
                </div>
              </div>
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                <ProductArchive products={products.docs} />
              </div>

              {products.totalPages > 1 && products.page && (
                <ProductsPagination page={products.page} totalPages={products.totalPages} />
              )}
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
