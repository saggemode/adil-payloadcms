import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getLoyaltyPoints, redeemPoints } from '@/actions/loyaltyAction'

export interface LoyaltyPoint {
  id: number
  customerId: string
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  pointsHistory?: {
    points: number
    type: 'earned' | 'redeemed' | 'expired' | 'adjusted'
    description: string
    createdAt?: string
    id?: string | null
  }[] | null
  rewards?: {
    rewardId: string
    name: string
    pointsCost: number
    status: 'available' | 'redeemed' | 'expired'
    redeemedAt?: string | null
    id?: string | null
  }[] | null
}

export const useLoyaltyPoints = (customerId: string | number | undefined) => {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['loyaltyPoints', customerId],
    queryFn: async () => {
      if (!customerId) return null
      const points = await getLoyaltyPoints(customerId.toString())
      return points && !Array.isArray(points) ? points : null
    },
    enabled: !!customerId,
  })
  
  const redeemMutation = useMutation({
    mutationFn: async ({ rewardId, pointsCost }: { rewardId: string, pointsCost: number }) => {
      if (!customerId) throw new Error('No customer ID provided')
      return redeemPoints(customerId.toString(), rewardId, pointsCost)
    },
    onSuccess: () => {
      // Invalidate the loyalty points query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['loyaltyPoints', customerId] })
    },
  })
  
  return {
    ...query,
    redeemPoints: redeemMutation.mutate,
    isRedeeming: redeemMutation.isPending,
    redeemError: redeemMutation.error,
  }
} 