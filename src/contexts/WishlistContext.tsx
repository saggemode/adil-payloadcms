'use client'

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'
import { CardProduct } from '@/types'

interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string | null
}

interface WishlistContextType {
  wishlists: WishlistItem[]
  addToWishlist: (product: CardProduct) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  loading: boolean
  error: string | null
  deleteWishlist: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType>({
  wishlists: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  loading: false,
  error: null,
  deleteWishlist: () => {},
})

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load wishlists from localStorage on component mount
  useEffect(() => {
    try {
      setLoading(true)
      const savedWishlists = localStorage.getItem('wishlists')
      if (savedWishlists) {
        const parsedWishlists = JSON.parse(savedWishlists)
        setWishlists(Array.isArray(parsedWishlists) ? parsedWishlists : [])
      }
    } catch (err) {
      setError('Failed to load wishlists')
      console.error('Failed to parse wishlists from localStorage:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save wishlists to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('wishlists', JSON.stringify(wishlists))
    } catch (err) {
      setError('Failed to save wishlists')
      console.error('Failed to save wishlists to localStorage:', err)
    }
  }, [wishlists])

  const addToWishlist = useCallback((product: CardProduct) => {
    setWishlists((currentWishlists) => {
      const exists = currentWishlists.some((p) => p.id === product.id.toString())
      if (exists) {
        return currentWishlists
      }
      
      const imageUrl = typeof product.images?.[0]?.image === 'object' && product.images[0]?.image !== null 
        ? product.images[0].image.url || '/placeholder.png'
        : '/placeholder.png'
      
      return [...currentWishlists, {
        id: product.id.toString(),
        name: product.title || '',
        slug: product.slug || '',
        price: product.price,
        image: imageUrl,
        category: product.category?.name || null
      }]
    })
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlists((currentWishlists) => {
      const updatedWishlists = currentWishlists.filter((product) => product.id !== productId)
      return updatedWishlists
    })
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlists.some((product) => product.id === productId)
    },
    [wishlists]
  )

  const deleteWishlist = useCallback((id: string) => {
    setWishlists(prev => prev.filter(w => w.id !== id))
  }, [])

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
        error,
        deleteWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext) 