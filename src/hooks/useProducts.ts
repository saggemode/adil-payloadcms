import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Function to fetch products through the API endpoint
async function fetchProducts(params: Record<string, any> = {}) {
  const queryParams = new URLSearchParams();
  
  // Add all parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const response = await fetch(`/api/products?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => fetchProducts({ limit: 8, featured: true }),
  })
}

export function useFlashSaleProducts() {
  return useQuery({
    queryKey: ['flashSaleProducts'],
    queryFn: () => fetchProducts({ 
      limit: 10, 
      featured: true,
      sort: 'price-low-to-high'
    }),
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!slug, // Only run the query if we have a slug
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      // Add your update product API call here
      // const response = await fetch('/api/products/${data.id}', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: ['featuredProducts'] })
      queryClient.invalidateQueries({ queryKey: ['flashSaleProducts'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.slug] })
    },
  })
}

export function useFeaturedProductsCarousel() {
  return useQuery({
    queryKey: ['featuredProductsCarousel'],
    queryFn: () => fetchProducts({ limit: 5, featured: true }),
  })
}
