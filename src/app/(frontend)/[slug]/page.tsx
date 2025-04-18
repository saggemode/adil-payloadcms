import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import { FlashSaleSection } from '@/components/FlashSale'
import FeaturedProducts from '@/components/FeaturedProducts'
import { getAllProducts } from '@/actions/productAction'
import { getTrendingProducts } from '@/actions/trendingProductsAction'
import Newsletter from '@/components/Newsletter'
import ProductCarouselBanner from '@/components/ProductCarouselBanner'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import TrustBadges from '@/components/TrustBadges'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  const { docs: featuredProducts } = await getAllProducts({ limit: 8, featured: true })
  const { docs: trendingProducts } = await getTrendingProducts({ limit: 4 })

  return (
    <article className="pt-16 pb-24">
      {slug === 'home' ? (
        <section>
          <PageClient />

          <PayloadRedirects disableNotFound url={url} />

          {draft && <LivePreviewListener />}
          <RenderHero {...hero} />

          <div className="container mx-auto px-4 flex flex-col gap-16 mt-16">
            {/* Product Carousel Banner */}
            <section className="w-full">
              <ProductCarouselBanner />
            </section>

            {/* Featured Categories Section */}
            <section className="w-full">
              <FeaturedCategories />
            </section>

            {/* Flash Sale Section */}
            <section className="w-full">
              <FlashSaleSection />
            </section>

            {/* Featured Products Section */}
            <section className="w-full">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-3">Featured Products</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Discover our handpicked selection of premium products
                </p>
              </div>
              <FeaturedProducts products={featuredProducts} />
            </section>

            {/* Trending Products Section */}
            <section className="w-full">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-3">Trending Now</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our most popular products that everyone&apos;s loving right now
                </p>
              </div>
              <FeaturedProducts products={trendingProducts} />
            </section>

            {/* Newsletter Section */}
            <Newsletter />
            
            {/* Trust Badges Section */}
            <section className="w-full -mt-8">
              <TrustBadges  />
            </section>
          </div>
        </section>
      ) : (
        <>
          <PageClient />

          <PayloadRedirects disableNotFound url={url} />

          {draft && <LivePreviewListener />}

          <RenderHero {...hero} />
          <RenderBlocks blocks={layout} />
        </>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
