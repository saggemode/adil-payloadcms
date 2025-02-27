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

// GET ALL PRODUCTS FOR ADMIN
// export async function getAllProductsForAdmin({ query, page = 1, sort = 'latest', limit }: any) {
//   const payload = await getPayload({ config: configPromise })

//   const filters = query ? { name: { like: query } } : {}
//   const sortOrder =
//     sort === 'best-selling'
//       ? 'numSales'
//       : sort === 'price-low-to-high'
//         ? 'price'
//         : sort === 'price-high-to-low'
//           ? '-price'
//           : '-createdAt'

//   const products = await payload.find({
//     collection: 'products',
//     where: filters,
//     sort: sortOrder,
//     limit,
//     page,
//   })

//   return products
// }

// GET PRODUCTS FOR CARD
// export async function getProductsForCard({ tag, limit = 4 }) {
//   const products = await payload.find({
//     collection: 'products',
//     where: { tags: { contains: tag }, isPublished: { equals: true } },
//     sort: '-createdAt',
//     limit,
//   })
//   return products.docs.map(({ name, slug, images }) => ({
//     name,
//     href: `/product/${slug}`,
//     image: images?[0],
//   }))
// }

// GET PRODUCTS BY TAG
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

// GET ALL PRODUCTS
// export async function getAllProducts({ query, category, tag, price, rating, sort, limit, page }:any) {
//     const payload = await getPayload({ config: configPromise })

//   const filters = {
//     ...(query && query !== 'all' && { title: { equals: query } }),
//     ...(category && category !== 'all' && { category: { equals: category } }),
//     ...(tag && tag !== 'all' && { tags: { contains: tag } }),
//     ...(price &&
//       price !== 'all' && {
//         price: { gte: Number(price.split('-')[0]), lte: Number(price.split('-')[1]) },
//       }),
//     ...(rating && rating !== 'all' && { avgRating: { gte: Number(rating) } }),
//   }

//   const sortOrder =
//     sort === 'best-selling'
//       ? '-numSales'
//       : sort === 'price-low-to-high'
//         ? 'price'
//         : sort === 'price-high-to-low'
//           ? '-price'
//           : '-createdAt'

//   const products = await payload.find({
//     collection: 'products',
//     overrideAccess: true,
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       categories: true,
//       meta: true,
//       images: true,
//       price: true,
//       listPrice: true,
//       countInStock: true,
//     },
//     where: filters,
//     sort: sortOrder,
//     limit,
//     page,
//   })
//   return products
// }

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

// export async function getAllProducts({
//   query,
//   category,
//   tag,
//   price,
//   rating,
//   sort,
//   limit,
//   page,
// }: {
//   query: string
//   category: string
//   tag: string
//   price: string
//   rating: string
//   sort: string
//   limit?: number
//   page: number
// }) {
//   const payload = await getPayload({ config: configPromise })

//   // Build filters
//   const filters = {
//     ...(query && query !== 'all' && { name: { like: query } }), // Use 'like' for partial matches
//     ...(category && category !== 'all' && { category: { equals: category } }),
//     ...(tag && tag !== 'all' && { tags: { in: [tag] } }), // Use 'in' for array fields
//     ...(price &&
//       price !== 'all' && {
//         price: {
//           greater_than_equal: Number(price.split('-')[0]),
//           less_than_equal: Number(price.split('-')[1]),
//         },
//       }),
//     ...(rating && rating !== 'all' && { avgRating: { greater_than_equal: Number(rating) } }),
//     isPublished: { equals: true }, // Only fetch published products
//   }

//   // Build sort order
//   const sortOrder =
//     sort === 'best-selling'
//       ? '-numSales'
//       : sort === 'price-low-to-high'
//         ? 'price'
//         : sort === 'price-high-to-low'
//           ? '-price'
//           : sort === 'avg-customer-review'
//             ? '-avgRating'
//             : '-createdAt'

//   // Fetch products
//   const products = await payload.find({
//     collection: 'products',
//     where: filters,
//     sort: sortOrder,
//     limit: limit || 12,
//     page: page ,
//     depth: 1, // Include related data
//     select: {
//       id: true,
//       title: true,
//       slug: true,
//       categories: true,
//       meta: true,
//       images: true,
//       price: true,
//       listPrice: true,
//       countInStock: true,
//     },
//   })

//   return products
// }

// export async function getAllProducts({
//   query,
//   limit = PAGE_SIZE,
//   page = 1,
//   category,
//   tag,
//   price,
//   rating,
//   sort,
// }: {
//   query: string
//   category: string
//   tag: string
//   limit?: number
//   page: number
//   price?: string
//   rating?: string
//   sort?: string
// }) {
//   const filters: Record<string, any> = {
//     isPublished: { equals: true }, // Only fetch published products
//     ...(query && query !== 'all' && { name: { like: query } }),
//     ...(category && category !== 'all' && { category: { equals: category } }),
//     ...(tag && tag !== 'all' && { tags: { contains: tag } }),
//     ...(price &&
//       price !== 'all' && {
//         price: {
//           greater_than_equal: Number(price.split('-')[0]),
//           less_than_equal: Number(price.split('-')[1]),
//         },
//       }),
//     ...(rating &&
//       rating !== 'all' && {
//         avgRating: { greater_than_equal: Number(rating) },
//       }),
//   }

//   const sortOptions =
//     sort === 'best-selling'
//       ? '-numSales'
//       : sort === 'price-low-to-high'
//         ? 'price'
//         : sort === 'price-high-to-low'
//           ? '-price'
//           : sort === 'avg-customer-review'
//             ? '-avgRating'
//             : '-_id' // Default sorting

//     const payload = await getPayload({ config: configPromise })

//   const { docs: products, totalDocs: totalProducts } = await payload.find({
//     collection: 'products',
//     where: filters,
//     sort: sortOptions,
//     limit,
//     page,
//         overrideAccess: true,
//         select: {
//           id: true,
//           title: true,
//           slug: true,
//           categories: true,
//           meta: true,
//           images: true,
//           price: true,
//           listPrice: true,
//           countInStock: true,
//         },
//   })

//   return {
//     products,
//     totalPages: Math.ceil(totalProducts / limit),
//     totalProducts,
//     from: limit * (page - 1) + 1,
//     to: limit * (page - 1) + products.length,
//   }
// }

// GET ALL CATEGORIES

// export async function getAllCategories(): Promise<Category[]> {
//   const payload = await getPayload({ config: configPromise })

//   const categories = await payload.find({ collection: 'categories' }) // Fetch from 'categories' collection
//   return categories.docs as Category[] // ✅ Return full Category objects
// }

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({ collection: 'categories' }) // Fetch from the 'categories' collection
  return categories.docs.map((doc) => doc.title) // Adjust based on the category field structure

  //   return categories.docs.map((doc) => ({
  //    id: doc.id, // Ensure 'id' exists
  //    title: doc.title, // Keep all necessary properties
  //  }))

  //return categories.docs as Category[] // Ensures the correct type is returned
  //return (categories.docs || []) as Category[]
  //return Array.isArray(categories.docs) ? (categories.docs as Category[]) : []
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
