'use server'
import { draftMode } from 'next/headers'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

import { formatError } from '@/utilities/generateId'

import { Category, Product } from '@/payload-types'
import { cache } from 'react'

// GET ONE PRODUCT BY ID
export async function getProductById(productId: any) {
  const payload = await getPayload({ config: configPromise })

  const product = await payload.findByID({
    collection: 'products',
    id: productId,
  })
  return product
}

// DELETE
export async function deleteProduct(id: any) {
  const payload = await getPayload({ config: configPromise })
  try {
    await payload.delete({ collection: 'products', id })
    revalidatePath('/admin/products')
    return { success: true, message: 'Product deleted successfully' }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function getProductsByTag({ tag, limit = 10 }: any) {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    where: { tags: { contains: tag }, isPublished: { equals: true } },
    sort: '-createdAt',
    limit,
  })
  return products.docs
}

// GET ONE PRODUCT BY SLUG
export async function getProductBySlug(slug: any) {
  const payload = await getPayload({ config: configPromise })

  const product = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, isPublished: { equals: true } },
  })
  return product.docs[0] || null
}

// GET RELATED PRODUCTS BY CATEGORY
export async function getRelatedProductsByCategory({ category, productId }: any) {
  const payload = await getPayload({ config: configPromise })

  const getCategoryTitle = (categories: number | Category | null | undefined) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 ? categories[0].title : 'Unknown Category'
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title
    }
    return 'Unknown Category'
  }

  const products = await payload.find({
    collection: 'products',
    limit: 10,
    pagination: false,
    where: {
      category: getCategoryTitle(category),
      id: { not_equals: productId },
      isPublished: { equals: true },
    },
    sort: '-numSales',
  })

  return products
}

export const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

interface FilterOptions {
  query?: string
  category?: string
  brand?: string
  color?: string
  size?: string
  price?: string
  rating?: string
  sort?: string
  limit: number
  page: number
}

export const getFilteredProducts = cache(
  async ({
    query,
    category,
    brand,
    color,
    size,
    price,
    rating,
    sort = 'createdAt',
    limit = 12,
    page = 1,
  }: FilterOptions) => {
    const payload = await getPayload({ config: configPromise })

    // Ensure page and limit are valid numbers
    const validPage = Math.max(1, Number.isFinite(Number(page)) ? Number(page) : 1)
    const validLimit = Math.max(1, Number.isFinite(Number(limit)) ? Number(limit) : 12)

    // Build filter conditions
    const filters: Record<string, any> = {
      isPublished: {
        equals: true,
      },
    }

    // Text search
    if (query && query !== 'all') {
      filters.title = {
        contains: query,
      }
    }

    // Category filter
    if (category && category !== 'all') {
      console.log('Category filter:', category)
      filters.categories = {
        equals: category,
      }
    }

    // Brand filter
    if (brand && brand !== 'all') {
      filters.brands = {
        contains: brand,
      }
    }

    // Color filter
    if (color && color !== 'all') {
      filters.colors = {
        contains: color,
      }
    }

    // Size filter
    if (size && size !== 'all') {
      filters.sizes = {
        contains: size,
      }
    }

    // Price range filter
    if (price && price !== 'all') {
      const [minStr = '0', maxStr = '1000000'] = price.split('-')
      const min = Number(minStr)
      const max = Number(maxStr)
      console.log('Price range:', { min, max, minStr, maxStr })
      if (Number.isFinite(min) && Number.isFinite(max)) {
        filters.price = {
          greater_than_equal: min,
          less_than_equal: max,
        }
      }
    }

    // Rating filter
    if (rating && rating !== 'all') {
      const ratingNum = Number(rating)
      console.log('Rating filter:', { rating, ratingNum })
      if (Number.isFinite(ratingNum)) {
        filters.avgRating = {
          greater_than_equal: ratingNum,
        }
      }
    }

    // Define sort order
    const sortOrder =
      {
        'best-selling': '-numSales',
        'price-low-to-high': 'price',
        'price-high-to-low': '-price',
        'avg-customer-review': '-avgRating',
        'newest-arrivals': '-createdAt',
        'oldest-first': 'createdAt',
      }[sort] || '-createdAt'

    console.log('Final filters:', JSON.stringify(filters, null, 2))

    try {
      const result = await payload.find({
        collection: 'products',
        where: filters,
        sort: sortOrder,
        limit: validLimit,
        page: validPage,
        depth: 1, // Adjust depth as needed for related data
      })

      if (!result || !result.docs) {
        console.error('No results found or invalid response structure')
        return {
          success: false,
          error: 'No products found',
          data: {
            products: [],
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        }
      }

      return {
        success: true,
        data: {
          products: result.docs || [],
          totalPages: result.totalPages || 1,
          currentPage: result.page || 1,
          hasNextPage: result.hasNextPage || false,
          hasPrevPage: result.hasPrevPage || false,
        },
      }
    } catch (error) {
      console.error('Error in getFilteredProducts:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        data: {
          products: [],
          totalPages: 1,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    }
  },
)

export async function getAllProducts({
  query,
  category,
  tag,
  price,
  rating,
  sort,
  limit,
  page,
  featured,
  productIds,
}: any) {
  const payload = await getPayload({ config: configPromise })

  // Define filters based on the provided parameters
  const filters: Record<string, any> = {
    isPublished: { equals: true }, // Default filter for published products
  }

  // Add filters conditionally
  if (query && query !== 'all') {
    filters.title = { contains: query }
  }
  
  if (category && category !== 'all') {
    filters.category = { equals: category }
  }
  
  if (tag && tag !== 'all') {
    filters.tags = { contains: tag }
  }
  
  // Handle price filter
  if (price && price !== 'all') {
    const parts = price.split('-')
    if (parts.length === 2) {
      filters.price = {
        greater_than_equal: Number(parts[0]),
        less_than_equal: Number(parts[1])
      }
    }
  }
  
  // Handle rating filter
  if (rating && rating !== 'all') {
    filters.avgRating = { greater_than_equal: Number(rating) }
  }

  // Handle productIds filter for flash sale products
  if (productIds && Array.isArray(productIds) && productIds.length > 0) {
    console.log('Filtering products by IDs:', productIds);
    
    // For Payload CMS, we need to create a proper filter for IDs
    // Override the entire filter to focus just on getting these products
    filters.or = productIds.map(id => ({
      id: { equals: id }
    }));
    
    // Remove the isPublished filter when explicitly fetching by IDs
    // since we want the products regardless of published status
    delete filters.isPublished;
  }

  // Define sort order based on the provided sort parameter
  const sortOrder =
    sort === 'best-selling'
      ? '-numSales'
      : sort === 'price-low-to-high'
        ? 'price'
        : sort === 'price-high-to-low'
          ? '-price'
          : sort === 'avg-customer-review'
            ? '-avgRating'
            : '-createdAt'

  console.log('Final filters for products query:', JSON.stringify(filters, null, 2));

  // Query the Payload CMS collection
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: limit || 12,
    page: page || 1,
    overrideAccess: true, // Ensure we can access the products regardless of access control
    where: filters,
    sort: sortOrder,
  })

  console.log(`Found ${products.docs?.length || 0} products out of ${products.totalDocs || 0} total`);
  
  if (products.docs?.length > 0) {
    console.log('Sample product:', JSON.stringify(products.docs[0], null, 2));
  } else {
    console.log('No products found with the given filters');
  }

  // If featured is true and we have products, filter them client-side
  // since the 'featured' field doesn't exist in the schema
  if (featured && products.docs) {
    // For now, we'll consider the top N products as "featured"
    // In a real scenario, you should add a 'featured' field to your schema
    const sortedProducts = [...products.docs].sort((a, b) => {
      // Sort by numSales (descending)
      return (b.numSales || 0) - (a.numSales || 0)
    })
    
    products.docs = sortedProducts.slice(0, limit || 8)
    products.totalDocs = products.docs.length
  }

  return products
}

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({ collection: 'categories' })
  return categories.docs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
  }))
}


