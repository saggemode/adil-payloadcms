import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } from '@/actions/wishlistAction'

export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  })
}

export function useIsInWishlist(productId: string) {
  return useQuery({
    queryKey: ['wishlist', productId],
    queryFn: () => isInWishlist(productId),
    enabled: !!productId,
  })
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })
} 