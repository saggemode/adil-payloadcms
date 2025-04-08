import { useQuery } from '@tanstack/react-query'
import { getAvailableRewards } from '@/actions/loyaltyAction'
import type { Reward } from '@/payload-types'

export const useRewards = (customerId: string | undefined) => {
  return useQuery({
    queryKey: ['rewards', customerId],
    queryFn: async () => {
      if (!customerId) return null
      const response = await getAvailableRewards(customerId)
      if (response.success) {
        return response.data as Reward[]
      }
      throw new Error(response.message || 'Failed to fetch rewards')
    },
    enabled: !!customerId,
  })
} 