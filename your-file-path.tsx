import React from 'react'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { Product } from '@/payload-types'

// You'll need to have product data similar to what's in Card.tsx
// Here's an example of how to use AddToCart
export const YourComponentUsingAddToCart = ({ product }: { product: Product }) => {
  const {
    id,
    slug,
    categories,
    title,
    images,
    price,
    countInStock,
  } = product || {}

  // Helper function similar to Card.tsx
  const getCategoryTitle = (categories: any) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 ? categories[0].title : 'Unknown Category'
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title
    }
    return 'Unknown Category'
  }

  // This function creates an AddToCart button
  const AddButton = () => (
    <AddToCart
      minimal
      item={{
        clientId: generateId(),
        product: id ?? 0,
        slug: String(slug),
        category: getCategoryTitle(categories),
        image:
          images?.[0]?.image && typeof images[0]?.image !== 'number'
            ? images[0].image.url || ''
            : '',
        countInStock: countInStock ?? 0,
        name: title ?? '',
        price: round2(price ?? 0),
        quantity: 1,
        // If you have size and color data, add them here
        // size: selectedSize,
        // color: selectedColor,
      }}
    />
  )

  return (
    <div>
      {/* Your component UI here */}
      <AddButton />
    </div>
  )
} 