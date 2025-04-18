import { useQuery } from '@tanstack/react-query'
import useBrowsingHistory from './use-browsing-history'
import { 
  getCollaborativeRecommendations, 
  getFrequentlyBoughtTogether, 
  getPersonalizedRecommendations,
  getSeasonalRecommendations,
  getTrendingProducts
} from '@/actions/recommendationAction'

// Hook for collaborative recommendations ("People who viewed this also viewed...")
export function useCollaborativeRecommendations(productId: string, limit: number = 6) {
  return useQuery({
    queryKey: ['collaborativeRecommendations', productId, limit],
    queryFn: () => getCollaborativeRecommendations({ productId, limit }),
    enabled: !!productId,
  })
}

// Hook for "Frequently Bought Together" recommendations
export function useFrequentlyBoughtTogether(productId: string, limit: number = 4) {
  return useQuery({
    queryKey: ['frequentlyBoughtTogether', productId, limit],
    queryFn: () => getFrequentlyBoughtTogether({ productId, limit }),
    enabled: !!productId,
  })
}

// Hook for personalized recommendations based on browsing history
export function usePersonalizedRecommendations(limit: number = 8) {
  const { products } = useBrowsingHistory()
  
  // Ensure products is an array
  const safeProducts = Array.isArray(products) ? products : []
  
  // Extract product IDs and categories from browsing history
  const viewedProductIds = safeProducts
    .filter(product => product && product.id)
    .map(product => product.id)
  
  const categoriesViewed = Array.from(
    new Set(
      safeProducts
        .filter(product => product && product.category)
        .map(product => product.category)
    )
  )
  
  // Check for a reasonable minimum of browsing history
  const hasEnoughHistory = viewedProductIds.length > 0 && categoriesViewed.length > 0
  
  return useQuery({
    queryKey: ['personalizedRecommendations', viewedProductIds, categoriesViewed, limit],
    queryFn: () => getPersonalizedRecommendations({
      viewedProductIds,
      purchasedProductIds: [], // Ideally, this would come from order history
      categoriesViewed,
      limit,
    }),
    // Only enable if there is browsing history
    enabled: hasEnoughHistory,
  })
}

// Hook for trending products
export function useTrendingProducts(limit: number = 8, excludeProductIds: string[] = []) {
  return useQuery({
    queryKey: ['trendingProducts', limit, excludeProductIds],
    queryFn: () => getTrendingProducts({ limit, excludeProductIds }),
  })
}

// Hook for seasonal recommendations based on current season or upcoming holidays
export function useSeasonalRecommendations(limit: number = 8) {
  // Get current date to determine season
  const today = new Date()
  const month = today.getMonth() // 0-indexed (0 = January, 11 = December)
  
  // Determine current season
  let season = ''
  if (month >= 2 && month <= 4) {
    season = 'spring'
  } else if (month >= 5 && month <= 7) {
    season = 'summer'
  } else if (month >= 8 && month <= 10) {
    season = 'fall'
  } else {
    season = 'winter'
  }
  
  return useQuery({
    queryKey: ['seasonalRecommendations', season, limit],
    queryFn: () => getSeasonalRecommendations({ season, limit }),
  })
} 