'use server'

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Category, Product } from '@/payload-types'

// Helper function to get category title consistently
const getCategoryTitle = (categories: number | Category | null | undefined) => {
  if (Array.isArray(categories)) {
    return categories.length > 0 ? categories[0].title : 'Unknown Category'
  }
  if (typeof categories === 'object' && categories?.title) {
    return categories.title
  }
  return 'Unknown Category'
}

// Helper to validate arrays and ensure they contain valid, finite values
const getSafeStringArray = (arr: any[]): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(item => 
    item !== null && 
    item !== undefined && 
    typeof item !== 'object' && 
    !Number.isNaN(item) && 
    Number.isFinite(Number(item) || 0)
  ).map(item => String(item));
}

// Get personalized recommendations based on user's viewing and purchase history
export const getPersonalizedRecommendations = cache(
  async ({
    userId,
    viewedProductIds,
    purchasedProductIds,
    categoriesViewed,
    limit = 8,
  }: {
    userId?: number | string
    viewedProductIds: string[]
    purchasedProductIds: string[]
    categoriesViewed: string[]
    limit?: number
  }) => {
    const payload = await getPayload({ config: configPromise })

    // Ensure we have valid arrays with safe values
    const safeViewedProductIds = getSafeStringArray(viewedProductIds)
    const safePurchasedProductIds = getSafeStringArray(purchasedProductIds)
    const safeCategoriesViewed = Array.isArray(categoriesViewed) 
      ? categoriesViewed.filter(cat => cat && typeof cat === 'string')
      : []

    // Combine viewed and purchased product IDs to exclude from recommendations
    const excludeProductIds = Array.from(new Set([...safeViewedProductIds, ...safePurchasedProductIds]))

    // Build query to find products based on categories user has shown interest in
    // but exclude products they've already viewed or purchased
    const filters: Record<string, any> = {
      isPublished: {
        equals: true,
      },
    }

    if (safeCategoriesViewed.length > 0) {
      filters.categories = {
        in: safeCategoriesViewed,
      }
    }

    if (excludeProductIds.length > 0) {
      filters.id = {
        not_in: excludeProductIds,
      }
    }

    try {
      // Fetch products that match the criteria
      const results = await payload.find({
        collection: 'products',
        where: filters,
        sort: '-numSales', // Sort by popularity as a fallback
        limit: limit,
        depth: 1,
      })

      return {
        success: true,
        data: {
          products: results.docs || [],
        },
      }
    } catch (error) {
      console.error('Error in getPersonalizedRecommendations:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
        data: {
          products: [],
        },
      }
    }
  }
)

// Get collaborative filtering recommendations (people who viewed this also viewed...)
export const getCollaborativeRecommendations = cache(
  async ({
    productId,
    limit = 6,
  }: {
    productId: string
    limit?: number
  }) => {
    const payload = await getPayload({ config: configPromise })

    try {
      // Get the target product to find its properties
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
          data: { products: [] },
        }
      }

      // Get the category of the current product
      const category = getCategoryTitle(product.categories)
      
      // Find similar products in the same category with similar attributes
      // In a real implementation, you would use a more sophisticated algorithm
      // that considers user behavior patterns and purchase correlations
      const filters: Record<string, any> = {
        isPublished: { equals: true },
        categories: { equals: category },
        id: { not_equals: productId },
      }

      // If the product has tags, find products with similar tags
      if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
        filters.tags = { contains: product.tags[0] }
      }

      const results = await payload.find({
        collection: 'products',
        where: filters,
        sort: '-numSales', // Sort by bestselling
        limit: limit,
        depth: 1,
      })

      return {
        success: true,
        data: {
          products: results.docs || [],
        },
      }
    } catch (error) {
      console.error('Error in getCollaborativeRecommendations:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
        data: {
          products: [],
        },
      }
    }
  }
)

// Get trending products based on various metrics (sales, views, ratings)
export const getTrendingProducts = cache(
  async ({
    limit = 8,
    excludeProductIds = [],
  }: {
    limit?: number
    excludeProductIds?: string[]
  }) => {
    const payload = await getPayload({ config: configPromise })

    const filters: Record<string, any> = {
      isPublished: {
        equals: true,
      },
      // Only include products with stock
      countInStock: {
        greater_than: 0,
      },
      // Only include products with decent ratings
      avgRating: {
        greater_than: 3.5,
      },
    }

    if (excludeProductIds.length > 0) {
      filters.id = {
        not_in: excludeProductIds.map(id => String(id)),
      }
    }

    try {
      const results = await payload.find({
        collection: 'products',
        where: filters,
        sort: '-numSales', // Sort by most sales
        limit: limit,
        depth: 1,
      })

      return {
        success: true,
        data: {
          products: results.docs || [],
        },
      }
    } catch (error) {
      console.error('Error in getTrendingProducts:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch trending products',
        data: {
          products: [],
        },
      }
    }
  }
)

// Get frequently bought together products
export const getFrequentlyBoughtTogether = cache(
  async ({
    productId,
    limit = 4,
  }: {
    productId: string
    limit?: number
  }) => {
    const payload = await getPayload({ config: configPromise })

    try {
      // In a real implementation, this would involve analyzing order history
      // to find products frequently purchased together
      // For now, we'll simulate with a simplified approach using categories
      
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
          data: { products: [] },
        }
      }

      // Get products in the same category that are complementary
      // (In reality, this should be based on actual purchase data)
      const results = await payload.find({
        collection: 'products',
        where: {
          isPublished: { equals: true },
          categories: { equals: getCategoryTitle(product.categories) },
          id: { not_equals: productId },
          // Price range: products in a similar price range (+/- 30%)
          price: {
            greater_than: product.price * 0.7,
            less_than: product.price * 1.3,
          },
        },
        limit: limit,
        depth: 1,
      })

      return {
        success: true,
        data: {
          products: results.docs || [],
        },
      }
    } catch (error) {
      console.error('Error in getFrequentlyBoughtTogether:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
        data: {
          products: [],
        },
      }
    }
  }
)

// Get seasonal recommendations based on current season or upcoming holidays
export const getSeasonalRecommendations = cache(
  async ({
    season,
    limit = 8,
  }: {
    season: string
    limit?: number
  }) => {
    const payload = await getPayload({ config: configPromise })

    try {
      // Define seasonal tags or categories based on the current season
      let seasonalTags: string[] = []
      let seasonalCategories: string[] = []

      switch (season.toLowerCase()) {
        case 'spring':
          seasonalTags = ['spring', 'easter', 'garden', 'outdoor', 'floral', 'refresh']
          seasonalCategories = ['Outdoor', 'Garden', 'Spring Fashion']
          break
        case 'summer':
          seasonalTags = ['summer', 'beach', 'vacation', 'outdoor', 'bbq', 'swimming']
          seasonalCategories = ['Beach', 'Outdoor', 'Summer Fashion', 'Cooling']
          break
        case 'fall':
          seasonalTags = ['fall', 'autumn', 'halloween', 'thanksgiving', 'harvest', 'cozy']
          seasonalCategories = ['Fall Fashion', 'Home Decor', 'Halloween']
          break
        case 'winter':
          seasonalTags = ['winter', 'christmas', 'holiday', 'snow', 'gift', 'cozy', 'new year']
          seasonalCategories = ['Winter Fashion', 'Holiday', 'Gifts', 'Heating']
          break
        default:
          seasonalTags = ['bestseller', 'popular']
          break
      }

      // Build query for seasonal products
      const filters: Record<string, any> = {
        isPublished: {
          equals: true,
        },
        countInStock: {
          greater_than: 0,
        },
        or: [
          {
            tags: {
              in: seasonalTags,
            },
          },
          {
            categories: {
              in: seasonalCategories,
            },
          },
        ],
      }

      const results = await payload.find({
        collection: 'products',
        where: filters,
        sort: '-numSales', // Sort by most sales
        limit: limit,
        depth: 1,
      })

      return {
        success: true,
        data: {
          products: results.docs || [],
        },
      }
    } catch (error) {
      console.error('Error in getSeasonalRecommendations:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch seasonal recommendations',
        data: {
          products: [],
        },
      }
    }
  }
) 