import { useQuery } from '@tanstack/react-query'
import { 
  getCollaborativeRecommendations, 
  getFrequentlyBoughtTogether, 
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

// Hook for frequently bought together recommendations
export function useFrequentlyBoughtTogether(productId: string, limit: number = 4) {
  return useQuery({
    queryKey: ['frequentlyBoughtTogether', productId, limit],
    queryFn: () => getFrequentlyBoughtTogether({ productId, limit }),
    enabled: !!productId,
  })
}

// Hook for trending products
export function useTrendingProducts(limit: number = 8) {
  return useQuery({
    queryKey: ['trendingProducts', limit],
    queryFn: () => getTrendingProducts({ limit }),
  })
} 