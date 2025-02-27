import type { Metadata } from 'next/types'

import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { ProductArchive } from '@/components/ProductArchive'
import { ProductPageRange } from '@/components/PageRange/ProductsPageRange'
import { ProductsPagination } from '@/components/Pagination/ProductPagination'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <div className="pt-24 pb-24">
      <Suspense fallback={<div>Loading...</div>}>
        <PageClient />
        <div className="container mb-16">
          <div className="prose dark:prose-invert max-w-none">
            <h1>Products</h1>
          </div>
        </div>

        <div className="container mb-8">
          <ProductPageRange
            collection="products"
            currentPage={products.page}
            limit={12}
            totalDocs={products.totalDocs}
          />
        </div>

        <ProductArchive products={products.docs} />

        <div className="container">
          {products?.page && products?.totalPages > 1 && (
            <ProductsPagination page={products.page} totalPages={products.totalPages} />
          )}
        </div>
      </Suspense>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Payload Ecommerce Template Ecommerce Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'products',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
