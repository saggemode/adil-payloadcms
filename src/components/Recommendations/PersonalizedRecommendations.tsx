'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import ProductSlider from '@/components/ProductArchive/product-slider'
import { Skeleton } from '@/components/ui/skeleton'
import { getTrendingProducts } from '@/actions/recommendationAction'

export default function PersonalizedRecommendations({
  title = 'Recommended for you',
  limit = 8,
  fallbackTitle = 'Discover Popular Products',
}: {
  title?: string
  limit?: number
  fallbackTitle?: string
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingProducts', limit],
    queryFn: () => getTrendingProducts({ limit }),
  })

  if (isLoading) {
    return (
      <div className="w-full">
        <h2 className="h2-bold mb-5">{fallbackTitle}</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="min-w-[200px]">
              <Skeleton className="h-48 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !data?.success || !data?.data?.products || data.data.products.length === 0) {
    return null
  }

  return <ProductSlider title={fallbackTitle} products={data.data.products} />
} 