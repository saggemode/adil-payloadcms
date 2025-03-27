import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUpdateReview, getReviewByProductId, getReviews } from '@/actions/reviewAction'
import { IReviewInput } from '@/types'

export function useProductReviews(productId: string, page: number = 1) {
  return useQuery({
    queryKey: ['reviews', productId, page],
    queryFn: () => getReviews({ productId, page }),
  })
}

export function useUserReview(productId: string) {
  return useQuery({
    queryKey: ['userReview', productId],
    queryFn: () => getReviewByProductId({ productId }),
    enabled: !!productId,
  })
}

export function useCreateUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ data, path }: { data: IReviewInput; path: string }) =>
      createUpdateReview({ data, path }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for the product
      queryClient.invalidateQueries({
        queryKey: ['reviews', variables.data.product],
      })
      // Invalidate and refetch user's review
      queryClient.invalidateQueries({
        queryKey: ['userReview', variables.data.product],
      })
      // Invalidate product data to update rating stats
      queryClient.invalidateQueries({
        queryKey: ['product', variables.path.split('/').pop()],
      })
    },
  })
}
