import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllProducts, queryProductBySlug } from '@/actions/productAction'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getAllProducts({ limit: 8, featured: true }),
  })
}

export function useFlashSaleProducts() {
  return useQuery({
    queryKey: ['flashSaleProducts'],
    queryFn: () => getAllProducts({ limit: 4, flashSale: true }),
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => queryProductBySlug({ slug }),
    enabled: !!slug, // Only run the query if we have a slug
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      // Add your update product API call here
      // const response = await updateProduct(data)
      // return response
    },
    onSuccess: (_, variables) => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] })
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.slug] })
    },
  })
}
