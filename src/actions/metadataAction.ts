'use server'

import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const getProductMetadata = cache(async () => {
  const payload = await getPayload({ config: configPromise })

  try {
    const products = await payload.find({
      collection: 'products',
      limit: 1000, // Adjust based on your needs
      depth: 0,
    })

    // Extract unique values and metadata
    const metadata = products.docs.reduce(
      (acc, product) => {
        // Update price range
        acc.minPrice = Math.min(acc.minPrice, product.price)
        acc.maxPrice = Math.max(acc.maxPrice, product.price)

        // Collect unique values
        if (product.brands && typeof product.brands === 'object' && 'title' in product.brands) {
          acc.brands.add(product.brands.title)
        }
        if (product.colors && Array.isArray(product.colors)) {
          product.colors.forEach((color) => {
            if (typeof color === 'object' && 'title' in color) {
              acc.colors.add(color.title)
            }
          })
        }
        if (product.sizes && Array.isArray(product.sizes)) {
          product.sizes.forEach((size) => {
            if (typeof size === 'object' && 'title' in size) {
              acc.sizes.add(size.title)
            }
          })
        }
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag) => {
            if (typeof tag === 'object' && 'title' in tag) {
              acc.tags.add(tag.title)
            }
          })
        }

        return acc
      },
      {
        brands: new Set<string>(),
        colors: new Set<string>(),
        sizes: new Set<string>(),
        tags: new Set<string>(),
        minPrice: Infinity,
        maxPrice: -Infinity,
      },
    )

    return {
      brands: Array.from(metadata.brands).sort(),
      colors: Array.from(metadata.colors).sort(),
      sizes: Array.from(metadata.sizes).sort(),
      tags: Array.from(metadata.tags).sort(),
      minPrice: Math.floor(metadata.minPrice),
      maxPrice: Math.ceil(metadata.maxPrice),
    }
  } catch (error) {
    console.error('Error fetching product metadata:', error)
    return {
      brands: [],
      colors: [],
      sizes: [],
      tags: [],
      minPrice: 0,
      maxPrice: 10000,
    }
  }
})
