import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache, Suspense } from 'react'
import RichText from '@/components/RichText'

import type { Category, Product } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
 import { RelatedProducts } from '@/blocks/RelatedProducts/Component'
import { ProductHero } from '@/heros/ProductHero'
// import { getRelatedProductsByCategory } from '@/actions/productAction'
 import ProductSlider from '@/components/ProductArchive/product-slider'

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
  const product = await queryProductBySlug({ slug })

   const getCategoryTitle = (categories: number | Category | null | undefined) => {
      if (Array.isArray(categories)) {
        return categories.length > 0 ? categories[0].title : 'Unknown Category'
      }
      if (typeof categories === 'object' && categories?.title) {
        return categories.title
      }
      return 'Unknown Category'
    }


const category =
  typeof product?.categories === 'string'
    ? product.categories
    : Array.isArray(product?.categories)
      ? product.categories[0]?.toString() || '' // Use the first category if it's an array
      : ''

// const relatedProducts =
//   (await getRelatedProductsByCategory({
//     category,
//     productId: product?.id ? String(product.id) : '',
//   })) || []


  //console.log('relatedP: ', relatedProducts)

  if (!product) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      {/* <PageClient /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <PageClient />
    
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ProductHero product={product} />

      <div className="flex flex-col items-center pt-8">
        <div className="container">
          {/* <RichText className="max-w-[48rem] mx-auto" data={product.content} enableGutter={false} /> */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <RelatedProducts
            
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={product.relatedProducts.filter((product) => typeof product === 'object')}
            />
          )}

          {/* <ProductSlider
            products={relatedProducts?.docs || []} // Extract the actual array
            title={`Best Sellers in ${category}`}
          /> */}
        </div>
      </div>
       </Suspense>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug })

  return generateMeta({ doc: product })
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
     
  })

  return result.docs?.[0] || null
})
