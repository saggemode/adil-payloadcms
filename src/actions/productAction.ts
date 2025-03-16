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

export async function getRelatedProductsByCategory2({
  category,
  productId,
}: {
  category: string
  productId: string
}): Promise<Product[]> {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: {
      categories: {
        equals: category,
      },
      id: {
        not_equals: productId,
      },
    },
    limit: 10,
    pagination: false,
  })

  // Return only the `docs` array
  return result.docs || []
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
  limit?: number
  page?: number
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

    // Build filter conditions
    const filters: Record<string, any> = {
      _status: {
        equals: 'published',
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
      filters.categories = {
        equals: category,
      }
    }

    // Brand filter
    if (brand && brand !== 'all') {
      filters.brands = {
        equals: brand,
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
      const [min, max] = price.split('-').map(Number)
      filters.price = {
        greater_than_equal: min,
        less_than_equal: max,
      }
    }

    // Rating filter
    if (rating && rating !== 'all') {
      filters.avgRating = {
        greater_than_equal: Number(rating),
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

    try {
      const result = await payload.find({
        collection: 'products',
        where: filters,
        sort: sortOrder,
        limit,
        page,
        depth: 1, // Adjust depth as needed for related data
      })

      return {
        success: true,
        data: {
          products: result.docs,
          totalPages: result.totalPages,
          currentPage: result.page,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return {
        success: false,
        error: 'Failed to fetch products',
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
}: any) {
  const payload = await getPayload({ config: configPromise })

  // Define filters based on the provided parameters
  const filters = {
    ...(query && query !== 'all' && { title: { contains: query } }), // Use contains for partial matching
    ...(category && category !== 'all' && { category: { equals: category } }),
    ...(tag && tag !== 'all' && { tags: { contains: tag } }),
    ...(price &&
      price !== 'all' && {
        price: {
          greater_than_equal: Number(price.split('-')[0]),
          less_than_equal: Number(price.split('-')[1]),
        },
      }),
    ...(rating && rating !== 'all' && { avgRating: { greater_than_equal: Number(rating) } }),
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

  // Query the Payload CMS collection
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: limit || 12,
    page: page || 1,
    overrideAccess: false,
    where: filters,
    sort: sortOrder,
  })

  return products
}

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({ collection: 'categories' }) // Fetch from the 'categories' collection
  return categories.docs.map((doc) => doc.title) // Adjust based on the category field structure
}

export async function getAllSizes() {
  const payload = await getPayload({ config: configPromise })
  const sizes = await payload.find({ collection: 'sizes' }) // Fetch from the 'sizes' collection
  return sizes.docs.map((doc) => doc.title) // Adjust based on the sizes field structure
}

export async function getAllColors() {
  const payload = await getPayload({ config: configPromise })
  const colors = await payload.find({ collection: 'colors' }) // Fetch from the 'colors' collection
  return colors.docs.map((doc) => doc.title) // Adjust based on the colors field structure
}

// GET ALL TAGS
export async function getAllTags() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1, // Ensure related tags are populated
  })

  const tags = new Set<string>()

  products.docs.forEach((product) => {
    if (Array.isArray(product.tags)) {
      product.tags.forEach((tag) => {
        if (typeof tag === 'object' && tag.title) {
          tags.add(tag.title) // Extract tag titles
        }
      })
    }
  })

  return Array.from(tags)
}

export async function getAllTagExtra() {
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({ collection: 'tags' }) // Fetch all tags
  return tags.docs.map((doc) => doc.title) // Adjust field name as needed
}

// Function to update product after successful purchase
export async function updateProductAfterPurchase(productId: string, quantity: number) {
  try {
    // 1. Connect to PayloadCMS
    const payload = await getPayload({ config: configPromise })

    // 2. Get current product data
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // 3. Update the product
    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        // Reduce stock
        countInStock: product.countInStock - quantity,
        // Increase sales
        numSales: (product.numSales || 0) + quantity,
      },
    })

    return true
  } catch (error) {
    console.error('Error updating product:', error)
    return false
  }
}

interface AdvancedFilterOptions extends FilterOptions {
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
  brands?: string[]
  colors?: string[]
  sizes?: string[]
  tags?: string[]
  searchTerm?: string
}

export const getAdvancedFilteredProducts = cache(
  async ({
    query,
    category,
    brand,
    color,
    size,
    minPrice,
    maxPrice,
    inStock,
    sortBy,
    tags,
    limit = 12,
    page = 1,
  }: AdvancedFilterOptions) => {
    const payload = await getPayload({ config: configPromise })

    const filters: any = {
      ...(query && { title: { contains: query } }),
      ...(category && { category: { equals: category } }),
      ...(brand && { brand: { in: brand } }),
      ...(color && { color: { in: color } }),
      ...(size && { size: { in: size } }),
      ...(tags && { tags: { in: tags } }),
      ...(inStock && { countInStock: { greater_than: 0 } }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { greater_than_equal: minPrice }),
          ...(maxPrice && { less_than_equal: maxPrice }),
        },
      }),
    }

    const sortOrder = {
      price_asc: 'price',
      price_desc: '-price',
      newest: '-createdAt',
      popular: '-numSales',
      rating: '-avgRating',
    }[sortBy || 'newest']

    try {
      const result = await payload.find({
        collection: 'products',
        where: filters,
        sort: sortOrder,
        limit,
        page,
      })

      return {
        success: true,
        data: {
          products: result.docs,
          totalPages: result.totalPages,
          currentPage: result.page,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return { success: false, error: 'Failed to fetch products' }
    }
  },
)
