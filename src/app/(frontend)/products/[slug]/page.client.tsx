'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { useProductBySlug } from '@/hooks/useProducts'
import { ProductHero } from '@/heros/ProductHero'
import { RelatedProducts } from '@/blocks/RelatedProducts/Component'
import ProductDetailsSkeleton from './productSkeleton'
import { 
  FrequentlyBoughtTogether,
  CollaborativeRecommendations,
  TrendingProducts,
  SeasonalRecommendations,
  PersonalizedRecommendations,
  EmailRecommendations
} from '@/components/Recommendations'

interface PageClientProps {
  slug: string
}

const PageClient: React.FC<PageClientProps> = ({ slug }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { data: product, isLoading, error } = useProductBySlug(slug)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  if (isLoading) {
    return <ProductDetailsSkeleton />
  }

  if (error || !product) {
    return <div>Error loading product</div>
  }

  return (
    <>
      <ProductHero product={product} />
      <div className="flex flex-col items-center pt-8">
        <div className="container">
          {/* Frequently Bought Together Section */}
          <div className="my-12">
            <FrequentlyBoughtTogether productId={product.id ? String(product.id) : '0'} />
          </div>

          {/* Collaborative Recommendations - "People who viewed this also viewed..." */}
          <div className="my-12">
            <CollaborativeRecommendations 
              productId={product.id ? String(product.id) : '0'} 
              title="People also viewed" 
            />
          </div>

          {/* Personalized Recommendations based on browsing history */}
          <div className="my-12">
            <PersonalizedRecommendations title="Just for you" />
          </div>

          {/* Trending Products Section */}
          <div className="my-12">
            <TrendingProducts excludeProductIds={product.id ? [String(product.id)] : []} />
          </div>

          {/* Seasonal Recommendations */}
          <div className="my-12">
            <SeasonalRecommendations />
          </div>

          {/* Email Recommendations - Products suggested for email campaigns */}
          <div className="my-12">
            <EmailRecommendations />
          </div>

          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <RelatedProducts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={product.relatedProducts.filter((product) => typeof product === 'object')}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default PageClient
