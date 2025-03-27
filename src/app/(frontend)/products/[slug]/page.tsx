import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { Suspense } from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RelatedProducts } from '@/blocks/RelatedProducts/Component'
import { ProductHero } from '@/heros/ProductHero'
import { getRelatedProductsByCategory } from '@/actions/productAction'
import ProductDetailsSkeleton from './productSkeleton'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,

    select: {
      slug: true,
    },
  })

  // Ensure the slug is a string and filter out invalid entries
  const params = products.docs
    .map((doc) => {
      if (typeof doc.slug === 'string') {
        return { slug: doc.slug }
      } else {
        console.error(`Invalid slug:`, doc.slug)
        return null
      }
    })
    .filter(Boolean) // Remove null values

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Product({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise

  const url = '/products/' + slug

  if (!slug) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <PageClient slug={slug} />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
      </Suspense>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const product = result.docs?.[0] || null

  return generateMeta({ doc: product })
}
