'use client'

import { Gutter } from '@payloadcms/ui'
import { FlashSaleSection } from '@/components/FlashSale'
import FeaturedProducts from '@/components/FeaturedProducts'
import Newsletter from '@/components/Newsletter'
import ProductCarouselBanner from '@/components/ProductCarouselBanner'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import { Suspense } from 'react'
import {
  ProductCardSkeleton,
  CategoryCardSkeleton,
  FlashSaleSkeleton,
  Shimmer,
} from '@/components/Skeletons'
import { useFeaturedProducts, useFlashSaleProducts } from '@/hooks/useProducts'

export default function HomeContent() {
  const { data: featuredProducts } = useFeaturedProducts()
  const { data: flashSaleProducts } = useFlashSaleProducts()

  return (
    <Gutter className="flex flex-col gap-16 mt-16">
      {/* Product Carousel Banner */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </div>
        }
      >
        <section className="w-full">
          <ProductCarouselBanner />
        </section>
      </Suspense>

      {/* Featured Categories Section */}
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
          </div>
        }
      >
        <section className="w-full">
          <FeaturedCategories />
        </section>
      </Suspense>

      {/* Flash Sale Section */}
      <Suspense fallback={<FlashSaleSkeleton />}>
        <section className="w-full">
          <FlashSaleSection />
        </section>
      </Suspense>

      {/* Featured Products Section */}
      <Suspense
        fallback={
          <div>
            <div className="text-center mb-12">
              <div className="h-8 w-48 bg-gray-100 rounded mx-auto">
                <Shimmer />
              </div>
              <div className="h-4 w-96 bg-gray-100 rounded mx-auto mt-3">
                <Shimmer />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
            </div>
          </div>
        }
      >
        <section className="w-full">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-3">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products
            </p>
          </div>
          <FeaturedProducts products={featuredProducts?.docs || []} />
        </section>
      </Suspense>

      {/* Newsletter Section */}
      <Newsletter />
    </Gutter>
  )
}
