import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } from '@/actions/wishlistAction'
import { Product, Wishlist } from '@/payload-types'

// Type for the wishlist response
interface WishlistResponse {
  success: boolean;
  message?: string;
  data?: Partial<Wishlist> | null;
}

// Function to get a product by ID from wishlist data
const getProductById = (wishlistData: WishlistResponse | undefined, productId: string): Product | null => {
  if (!wishlistData?.success || !wishlistData.data?.items) return null;
  
  const item = wishlistData.data.items.find(item => {
    if (typeof item.product === 'object') {
      return item.product.id === parseInt(productId);
    }
    return item.product === parseInt(productId);
  });
  
  return item && typeof item.product === 'object' ? item.product : null;
};

// Main wishlist hook with stale-while-revalidate approach
export function useWishlist() {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}

// Check if a product is in the wishlist
export function useIsInWishlist(productId: string) {
  const queryClient = useQueryClient();
  const cachedWishlist = queryClient.getQueryData<WishlistResponse>(['wishlist']);
  
  // If we have cached wishlist data, we can check locally first
  const isInCachedWishlist = (): boolean => {
    if (!cachedWishlist?.success || !cachedWishlist.data?.items) return false;
    
    return cachedWishlist.data.items.some(item => {
      if (typeof item.product === 'object') {
        return item.product.id === parseInt(productId);
      }
      return item.product === parseInt(productId);
    });
  };
  
  return useQuery({
    queryKey: ['wishlist', 'isIn', productId],
    queryFn: () => isInWishlist(productId),
    enabled: !!productId,
    // Use cached result if available
    initialData: cachedWishlist ? { success: true, data: isInCachedWishlist() } : undefined,
  })
}

// Add to wishlist with optimistic updates
export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addToWishlist,
    onMutate: async (productId: string) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      
      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData<WishlistResponse>(['wishlist'])
      
      // Fetch product data from cache if available
      // Default minimal product data
      let productToAdd: Partial<Product> = { 
        id: parseInt(productId), 
        title: "Loading...",
        images: [{ 
          image: { 
            url: '/placeholder.jpg',
            id: 0,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          } 
        }],
        price: 0
      };
      
      // Try to find product in other queries like 'products' or product detail
      const cachedProduct = queryClient.getQueryData<any>(['product', productId]) || 
                           queryClient.getQueryData<any>(['products'])?.data?.find((p: Product) => p.id === parseInt(productId));
      
      if (cachedProduct) {
        productToAdd = cachedProduct;
      }
      
      // Optimistically update the wishlist
      queryClient.setQueryData<WishlistResponse>(['wishlist'], (old) => {
        if (!old) return { success: true, data: { items: [] } as Partial<Wishlist> };
        
        // Check if product already exists in wishlist
        if (old.data?.items?.some(item => {
          const itemProductId = typeof item.product === 'object' ? item.product.id : item.product;
          return itemProductId === parseInt(productId);
        })) {
          return old; // Product already in wishlist, no need to update
        }
        
        return {
          ...old,
          data: {
            ...old.data,
            items: [
              ...(old.data?.items || []),
              {
                product: productToAdd as Product,
                addedAt: new Date().toISOString(),
                id: `temp-${Date.now()}`
              }
            ]
          } as Partial<Wishlist>
        };
      })
      
      // Also update the isInWishlist query
      queryClient.setQueryData(['wishlist', 'isIn', productId], {
        success: true,
        data: true
      })
      
      return { previousWishlist }
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist)
        // Reset the isInWishlist query
        const isInWishlist = getProductById(context.previousWishlist, productId) !== null;
        queryClient.setQueryData(['wishlist', 'isIn', productId], {
          success: true,
          data: isInWishlist
        })
      }
    },
    onSettled: (data, error, productId) => {
      // Always refetch after error or success to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'isIn', productId] })
    },
  })
}

// Remove from wishlist with optimistic updates
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async (productId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['wishlist'] })
      
      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData<WishlistResponse>(['wishlist'])
      
      // Optimistically update the wishlist
      queryClient.setQueryData<WishlistResponse>(['wishlist'], (old) => {
        if (!old || !old.data || !old.data.items) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.filter(item => {
              const itemProductId = typeof item.product === 'object' ? item.product.id : item.product;
              return itemProductId !== parseInt(productId);
            })
          } as Partial<Wishlist>
        };
      })
      
      // Also update the isInWishlist query
      queryClient.setQueryData(['wishlist', 'isIn', productId], {
        success: true,
        data: false
      })
      
      return { previousWishlist }
    },
    onError: (err, productId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist)
        
        // Reset the isInWishlist query
        const isInWishlist = getProductById(context.previousWishlist, productId) !== null;
        queryClient.setQueryData(['wishlist', 'isIn', productId], {
          success: true,
          data: isInWishlist
        })
      }
    },
    onSettled: (data, error, productId) => {
      // Always refetch after error or success for fresh data
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'isIn', productId] })
    },
  })
} 