import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getActiveFlashSales } from '@/actions/flashSaleAction'
import { getAllProducts, getProductBySlug as fetchProductBySlug } from '@/actions/productAction'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getAllProducts({ 
      limit: 8, 
      featured: true,
      sort: 'best-selling'
    }),
  })
}

export function useFlashSaleProducts() {
  return useQuery({
    queryKey: ['flashSaleProducts'],
    queryFn: async () => {
      // Get active flash sales using the server action
      console.log('Fetching active flash sales...');
      const flashSalesResponse = await getActiveFlashSales();
      console.log('Flash sales response:', flashSalesResponse);
      
      if (!flashSalesResponse.success || !flashSalesResponse.data || flashSalesResponse.data.length === 0) {
        console.log('No active flash sales found');
        return { docs: [] }; // No active flash sale
      }
      
      // Get all active flash sales instead of just the first one
      const activeFlashSales = flashSalesResponse.data;
      console.log('Active flash sales:', activeFlashSales);
      
      // Collect all product IDs from all flash sales
      const allProductIds: string[] = [];
      
      // Loop through all active flash sales to get their products
      activeFlashSales.forEach(flashSale => {
        console.log('Processing flash sale:', flashSale.name, 'Products:', flashSale.products);
        if (flashSale && flashSale.products && flashSale.products.length > 0) {
          const productIds = Array.isArray(flashSale.products) 
            ? flashSale.products.map(p => typeof p === 'object' ? String(p.id) : String(p))
            : [String(flashSale.products)];
          
          console.log('Extracted product IDs:', productIds);
          allProductIds.push(...productIds);
        }
      });
      
      console.log('All product IDs collected:', allProductIds);
      
      // If we have no products across all flash sales, return empty array
      if (allProductIds.length === 0) {
        console.log('No products found in any flash sales');
        return { docs: [] };
      }
      
      // Fetch all products from all flash sales
      console.log('Fetching products with IDs:', allProductIds);
      const products = await getAllProducts({
        limit: 50, // Increased limit to accommodate more products
        productIds: allProductIds
      });
      
      console.log('Products fetched:', products.docs?.length || 0);
      
      // Create a mapping of product IDs to their respective flash sales
      const productFlashSaleMap = new Map();
      
      activeFlashSales.forEach(flashSale => {
        if (flashSale && flashSale.products && flashSale.products.length > 0) {
          const productIds = Array.isArray(flashSale.products) 
            ? flashSale.products.map(p => typeof p === 'object' ? String(p.id) : String(p))
            : [String(flashSale.products)];
          
          productIds.forEach(id => {
            productFlashSaleMap.set(id, {
              discountType: flashSale.discountType,
              discountAmount: flashSale.discountAmount,
              endDate: flashSale.endDate,
              totalQuantity: flashSale.totalQuantity,
              soldQuantity: flashSale.soldQuantity || 0,
              flashSaleName: flashSale.name || 'Flash Sale'
            });
          });
        }
      });
      
      console.log('Product to Flash Sale mapping:', [...productFlashSaleMap.entries()]);
      
      // Enrich products with flash sale information
      const enrichedProducts = products.docs.map((product: any) => {
        console.log('Processing product:', JSON.stringify({
          id: product.id,
          title: product.title,
          price: product.price
        }));
        
        // Convert product ID to string for comparing with the map keys
        const productIdStr = String(product.id);
        console.log('Looking for flash sale info with product ID:', productIdStr);
        
        const flashSaleInfo = productFlashSaleMap.get(productIdStr);
        
        if (!flashSaleInfo) {
          console.log('No flash sale info found for product ID:', productIdStr);
          console.log('Available keys in map:', [...productFlashSaleMap.keys()]);
          return product; // Skip if product isn't in a flash sale
        }
        
    
        const enrichedProduct = {
          ...product,
          flashSale: flashSaleInfo
        };
        
        console.log('Enriched product structure:', JSON.stringify({
          id: enrichedProduct.id,
          title: enrichedProduct.title,
          hasFlashSale: !!enrichedProduct.flashSale,
          flashSaleName: enrichedProduct.flashSale?.flashSaleName
        }));
        
        return enrichedProduct;
      });
      
  
      return {
        ...products,
        docs: enrichedProducts
      };
    },
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      return fetchProductBySlug(slug);
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
    queryFn: () => getAllProducts({ 
      limit: 5, 
      featured: true,
      sort: 'best-selling'
    }),
  })
}
