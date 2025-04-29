import { getPayload } from 'payload'
import configPromise from '@payload-config'

export interface WishlistItem {
  product: string
  quantity?: number
  notes?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface CreateWishlistParams {
  name: string
  userId: string
  isPublic?: boolean
  items?: WishlistItem[]
}

export interface UpdateWishlistParams {
  id: string
  name?: string
  isPublic?: boolean
  items?: WishlistItem[]
}

export const createWishlist = async ({ name, userId, isPublic = false, items = [] }: CreateWishlistParams) => {
  const payload = await getPayload({ config: configPromise })

  return payload.create({
    collection: 'wishlists',
    data: {
      name,
      user: userId,
      isPublic,
      items: items.map(item => ({
        ...item,
        addedAt: new Date(),
      })),
    },
  })
}

export const updateWishlist = async ({ id, name, isPublic, items }: UpdateWishlistParams) => {
  const payload = await getPayload({ config: configPromise })

  return payload.update({
    collection: 'wishlists',
    id,
    data: {
      ...(name && { name }),
      ...(typeof isPublic === 'boolean' && { isPublic }),
      ...(items && {
        items: items.map(item => ({
          ...item,
          addedAt: new Date(),
        })),
      }),
    },
  })
}

export const deleteWishlist = async (id: string) => {
  const payload = await getPayload({ config: configPromise })

  return payload.delete({
    collection: 'wishlists',
    id,
  })
}

export const getWishlist = async (id: string) => {
  const payload = await getPayload({ config: configPromise })

  return payload.findByID({
    collection: 'wishlists',
    id,
  })
}

export const getUserWishlists = async (userId: string) => {
  const payload = await getPayload({ config: configPromise })

  return payload.find({
    collection: 'wishlists',
    where: {
      user: {
        equals: userId,
      },
    },
  })
}

export const addItemToWishlist = async (wishlistId: string, item: WishlistItem) => {
  const payload = await getPayload({ config: configPromise })

  const wishlist = await getWishlist(wishlistId)
  const updatedItems = [
    ...(wishlist.items || []),
    {
      ...item,
      addedAt: new Date(),
    },
  ]

  return updateWishlist({
    id: wishlistId,
    items: updatedItems,
  })
}

export const removeItemFromWishlist = async (wishlistId: string, productId: string) => {
  const payload = await getPayload({ config: configPromise })

  const wishlist = await getWishlist(wishlistId)
  const updatedItems = wishlist.items.filter((item: any) => item.product !== productId)

  return updateWishlist({
    id: wishlistId,
    items: updatedItems,
  })
}

export const updateWishlistItem = async (wishlistId: string, productId: string, updates: Partial<WishlistItem>) => {
  const payload = await getPayload({ config: configPromise })

  const wishlist = await getWishlist(wishlistId)
  const updatedItems = wishlist.items.map((item: any) => {
    if (item.product === productId) {
      return {
        ...item,
        ...updates,
      }
    }
    return item
  })

  return updateWishlist({
    id: wishlistId,
    items: updatedItems,
  })
} 