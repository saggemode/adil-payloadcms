import type { Metadata } from 'next/types'
import { FiSliders } from 'react-icons/fi'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { ProductArchive } from '@/components/ProductArchive'
import {   getAllProducts, getAllCategories } from '@/actions/productAction'
import ProductSortSelector from '@/components/ProductArchive/product-sort-selector'

import MobileFilters from '@/components/MobileFilters'
import BreadcrumbProduct from '@/heros/ProductHero/components/BreadcrumbProduct'
import { Separator } from '@/components/ui/separator'
import Filters from './Filters'
import { ProductPageRange } from '@/components/PageRange/ProductsPageRange'
import { ProductsPagination } from '@/components/Pagination/ProductPagination'


export const dynamic = 'force-static'
export const revalidate = 600

const sortOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to high' },
  { value: 'price-high-to-low', name: 'Price: High to low' },
  { value: 'newest-arrivals', name: 'Newest arrivals' },
  { value: 'avg-customer-review', name: 'Avg. customer review' },
  { value: 'best-selling', name: 'Best selling' },
]



export default async function Page(props: {
  searchParams: Promise<{
    q: string
    category: string
    tag: string
    price: string
    rating: string
    sort: string
    page: string
  }>
}) {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      id: true,
      title: true,
      slug: true,
      categories: true,
      meta: true,
      images: true,
      price: true,
      listPrice: true,
      countInStock: true,
    },
  })

  //  const categories = await payload.find({
    
  //    collection: 'categories',
  //    depth: 1,
  //    limit: 100,
  //    overrideAccess: false,
     
  //  })

 

  const searchParams = await props.searchParams

  const {
    q = 'all',
    category = 'all',
    tag = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
  } = searchParams

  const params = { query: q, category, tag, price, rating, sort, page }

  //const tags = await getAllTags()
   const categories = await getAllCategories()


  const productme = await getAllProducts({
    query: q,
    category,
    tag,
    price,
    rating,
    sort,
    limit: 12,
    page: Number(page),
  })

  //console.log(productme)

  return (
    <main className="pb-20">
      <PageClient />
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        {/* <hr className="h-[1px] bg-gray-200 dark:bg-gray-700 mb-5 sm:mb-6" /> */}
        <Separator />
        <BreadcrumbProduct title={''} />
        <div className="flex md:space-x-5 items-start">
          <div className="hidden md:block min-w-[295px] max-w-[295px] border rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6 dark:border-gray-700 ">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xl dark:text-white">Filters</span>
              <FiSliders />
            </div>
            <Filters categories={categories} />
          </div>
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px] dark:text-white">Products</h1>
                <MobileFilters />
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
                <div className="flex items-center dark:text-gray-300">
                  <ProductSortSelector sortOrders={sortOrders} sort={sort} params={params} />
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              <ProductArchive products={productme.docs} />
              {/* <ProductArchive products={products.docs} /> */}
              <div className="container">
                {products.totalPages > 1 && products.page && (
                  <ProductsPagination page={products.page} totalPages={products.totalPages} />
                )}
              </div>
            </div>
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