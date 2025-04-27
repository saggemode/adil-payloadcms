import type { Metadata } from 'next/types'

import React from 'react'
import PageClient from './page.client'
import { ProductArchive } from '@/components/ProductArchive'
import { Separator } from '@/components/ui/separator'
import BreadcrumbProduct from '@/heros/ProductHero/components/BreadcrumbProduct'
import { ProductPageRange } from '@/components/PageRange/ProductsPageRange'
import { ProductsPagination } from '@/components/Pagination/ProductPagination'
import AdvancedProductFilter from '@/components/AdvancedProductFilter'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

interface SearchParams {
  query?: string
  category?: string
  brand?: string
  color?: string
  size?: string
  tag?: string
  price?: string
  rating?: string
  sort?: string
  page?: string
  inStock?: string
  onSale?: string
  featured?: string
}

interface PageProps {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch categories, brands, sizes, colors, and tags for filters
    const [categoriesRes, brandsRes, sizesRes, colorsRes, tagsRes] = await Promise.all([
      payload.find({ collection: 'categories', limit: 100 }),
      payload.find({ collection: 'brands', limit: 100 }),
      payload.find({ collection: 'sizes', limit: 100 }),
      payload.find({ collection: 'colors', limit: 100 }),
      payload.find({ collection: 'tags', limit: 100 }),
    ])

    // Extract data for filters
    const categories = categoriesRes.docs.map(cat => ({
      id: String(cat.id),
      title: cat.title
    })) || []

    const brands = brandsRes.docs.map(brand => ({
      id: String(brand.id),
      title: brand.title
    })) || []

    const sizes = sizesRes.docs.map(size => size.title || '') || []
    const colors = colorsRes.docs.map(color => color.title || '') || []
    const tags = tagsRes.docs.map(tag => tag.title || '') || []

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
        equals: params.category,
      }
    }

    // Add brand filter
    if (params.brand && params.brand !== 'all') {
      where.brands = {
        equals: params.brand,
      }
    }

    // Add color filter
    if (params.color && params.color !== 'all') {
      where.colors = {
        some: {
          title: {
            equals: params.color,
          },
        },
      }
    }

    // Add size filter
    if (params.size && params.size !== 'all') {
      where.sizes = {
        some: {
          title: {
            equals: params.size,
          },
        },
      }
    }

    // Add tag filter
    if (params.tag && params.tag !== 'all') {
      where.tags = {
        equals: params.tag,
      }
    }

    // Add price range filter
    if (params.price) {
      const parts = params.price.split('-');
      const min = parts[0] ? Number(parts[0]) : 0;
      const max = parts[1] ? Number(parts[1]) : 1000000;
      
      if (!isNaN(min) && !isNaN(max)) {
        where.price = {
          greater_than_equal: min,
          less_than_equal: max,
        }
      }
    }

    // Add rating filter
    if (params.rating && params.rating !== 'all') {
      const rating = Number(params.rating)
      if (!isNaN(rating)) {
        where.avgRating = {
          greater_than_equal: rating,
        }
      }
    }

    // Add in-stock filter
    if (params.inStock === 'true') {
      where.countInStock = {
        greater_than: 0,
      }
    }

    // Add on-sale filter
    if (params.onSale === 'true') {
      where.listPrice = {
        greater_than: 0,
      }
    }

    // Add featured filter
    if (params.featured === 'true') {
      where.isFeatured = {
        equals: true,
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
        case 'newest-arrivals':
          sort = '-createdAt'
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

    // Find max price from products
    const productsForMaxPrice = await payload.find({
      collection: 'products',
      sort: '-price',
      limit: 1,
      depth: 0,
      overrideAccess: false,
      select: {
        price: true
      },
    });

    const maxPrice = productsForMaxPrice.docs?.[0]?.price || 1000000;

    if (!products) {
      return (
        <main className="pb-20">
          <PageClient />
          <div className="max-w-frame mx-auto px-4 xl:px-0">
            <Separator />
            <BreadcrumbProduct title={''} />
            <div className="flex flex-col w-full space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px] dark:text-white">Products</h1>
              </div>
              <div className="w-full text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No products found.
                </p>
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
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div>
                <h1 className="font-bold text-2xl md:text-[32px] dark:text-white">Products</h1>
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
            
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Mobile Filter Button */}
              <div className="lg:hidden">
                <AdvancedProductFilter 
                  categories={categories}
                  brands={brands}
                  sizes={sizes}
                  colors={colors}
                  tags={tags}
                  maxPrice={maxPrice}
                  isMobile={true}
                />
              </div>
              
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block lg:w-1/4 xl:w-1/5">
                <AdvancedProductFilter 
                  categories={categories}
                  brands={brands}
                  sizes={sizes}
                  colors={colors}
                  tags={tags}
                  maxPrice={maxPrice}
                />
              </div>
              
              {/* Products Grid */}
              <div className="lg:w-3/4 xl:w-4/5">
                <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5">
                  <ProductArchive products={products.docs} />
                </div>
                
                {products.totalPages > 1 && products.page && (
                  <div className="mt-8">
                    <ProductsPagination page={products.page} totalPages={products.totalPages} />
                  </div>
                )}
              </div>
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
  const { query = 'all' } = params

  const hasFilters = (query !== 'all' && query !== '')

  return {
    title: hasFilters
      ? `Search ${query !== 'all' ? query : ''}`
      : 'Payload Products',
  }
}
