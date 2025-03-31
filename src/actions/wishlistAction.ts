'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getMeUser } from '@/utilities/getMeUser'
import { formatError } from '@/utilities/generateId'

export async function addToWishlist(productId: string) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await getMeUser()

  if (!user) {
    return { success: false, message: 'User is not authenticated' }
  }

  try {
    // Check if user already has a wishlist
    const existingWishlist = await payload.find({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
      },
    })

    console.log('Existing wishlist:', existingWishlist)
    console.log('Product ID:', productId)
    console.log('User ID:', user.id)

    if (existingWishlist.docs.length > 0) {
      // Update existing wishlist
      const wishlist = existingWishlist.docs[0]
      if (!wishlist) return { success: false, message: 'Wishlist not found' }
      
      const items = wishlist.items || []
      
      // Check if product is already in wishlist
      const productExists = items.some((item: any) => 
        typeof item.product === 'number' 
          ? item.product === parseInt(productId)
          : item.product.id === parseInt(productId)
      )
      
      if (productExists) {
        return { success: true, message: 'Product already in wishlist' }
      }
      
      try {
        await payload.update({
          collection: 'wishlists',
          id: wishlist.id,
          data: {
            items: [
              ...items,
              {
                product: parseInt(productId),
                addedAt: new Date().toISOString(),
              },
            ],
          },
        })
      } catch (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }
    } else {
      // Create new wishlist
      try {
        await payload.create({
          collection: 'wishlists',
          data: {
            user: user.id,
            items: [
              {
                product: parseInt(productId),
                addedAt: new Date().toISOString(),
              },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        })
      } catch (createError) {
        console.error('Create error:', createError)
        throw createError
      }
    }

    return { success: true, message: 'Added to wishlist successfully' }
  } catch (error) {
    console.error('Wishlist error:', error)
    return { success: false, message: formatError(error) }
  }
}

export async function removeFromWishlist(productId: string) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await getMeUser()

  if (!user) {
    return { success: false, message: 'User is not authenticated' }
  }

  try {
    console.log('Removing product from wishlist:', { productId, userId: user.id })
    
    const wishlist = await payload.find({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
      },
    })

    if (wishlist.docs.length > 0) {
      const currentWishlist = wishlist.docs[0]
      if (!currentWishlist) return { success: false, message: 'Wishlist not found' }
      
      const items = currentWishlist.items || []
      console.log('Current items:', items)
      
      // Convert productId to number for comparison
      const productIdNum = parseInt(productId)
      
      // Filter out the item with matching product ID
      const updatedItems = items.filter((item: any) => {
        const itemProductId = typeof item.product === 'number' 
          ? item.product 
          : item.product.id
        return itemProductId !== productIdNum
      })
      
      console.log('Updated items:', updatedItems)
      
      if (updatedItems.length === items.length) {
        return { success: false, message: 'Product not found in wishlist' }
      }
      
      try {
        await payload.update({
          collection: 'wishlists',
          id: currentWishlist.id,
          data: {
            items: updatedItems,
            updatedAt: new Date().toISOString(),
          },
        })
        return { success: true, message: 'Removed from wishlist successfully' }
      } catch (updateError) {
        console.error('Error updating wishlist:', updateError)
        throw updateError
      }
    }

    return { success: false, message: 'Wishlist not found' }
  } catch (error) {
    console.error('Error in removeFromWishlist:', error)
    return { success: false, message: formatError(error) }
  }
}

export async function getWishlist() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await getMeUser()

  if (!user) {
    return { success: false, message: 'User is not authenticated' }
  }

  try {
    const wishlist = await payload.find({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
      },
      depth: 2, // This will populate the product details
    })

    return {
      success: true,
      data: wishlist.docs[0] || { items: [] },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function isInWishlist(productId: string) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await getMeUser()

  if (!user) {
    return { success: false, message: 'User is not authenticated' }
  }

  try {
    const wishlist = await payload.find({
      collection: 'wishlists',
      where: {
        user: { equals: user.id },
      },
    })

    if (wishlist.docs.length > 0) {
      const wishlistDoc = wishlist.docs[0]
      if (!wishlistDoc) return { success: true, data: false }
      
      const items = wishlistDoc.items || []
      const exists = items.some((item: any) => item.product === parseInt(productId))
      return { success: true, data: exists }
    }

    return { success: true, data: false }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
} 