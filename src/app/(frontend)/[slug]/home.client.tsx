'use client'

import React from 'react'
import { FlashSaleSection } from '@/components/FlashSale'
import FeaturedProducts from '@/components/FeaturedProducts'
import Newsletter from '@/components/Newsletter'
import ProductCarouselBanner from '@/components/ProductCarouselBanner'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import dynamic from 'next/dynamic'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderHero } from '@/heros/RenderHero'
import { Product } from '@/payload-types'

// Use dynamic imports with ssr: false (only allowed in client components)
const PersonalizedRecommendations = dynamic(
  () => import('@/components/Recommendations/PersonalizedRecommendations'),
  { ssr: false }
)
const TrendingProducts = dynamic(
  () => import('@/components/Recommendations/TrendingProducts'),
  { ssr: false }
)

interface HomeClientProps {
  url: string
  draft: boolean
  hero: any
  featuredProducts: Product[]
}

export default function HomeClient({ url, draft, hero, featuredProducts }: HomeClientProps) {
  return (
    <section>
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />

      <div className="container mx-auto px-4 flex flex-col gap-16 mt-16">
        {/* Product Carousel Banner */}
        <section className="w-full">
          <ProductCarouselBanner />
        </section>

        {/* Personalized Recommendations (based on browsing history) */}
        <section className="w-full">
          <PersonalizedRecommendations />
        </section>

        {/* Featured Categories Section */}
        <section className="w-full">
          <FeaturedCategories />
        </section>

        {/* Flash Sale Section */}
        <section className="w-full">
          <FlashSaleSection />
        </section>

        {/* Trending Products Section */}
        <section className="w-full">
          <TrendingProducts />
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

        {/* Newsletter Section */}
        <Newsletter />
      </div>
    </section>
  )
} 