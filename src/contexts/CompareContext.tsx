'use client'

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react'
import { CardProduct } from '@/components/ProductArchive/ProductCard'

interface CompareContextType {
  comparedProducts: CardProduct[]
  addProductToCompare: (product: CardProduct) => void
  removeProductFromCompare: (productId: string) => void
  clearComparedProducts: () => void
  isInCompare: (productId: string) => boolean
}

const CompareContext = createContext<CompareContextType>({
  comparedProducts: [],
  addProductToCompare: () => {},
  removeProductFromCompare: () => {},
  clearComparedProducts: () => {},
  isInCompare: () => false,
})

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedProducts, setComparedProducts] = useState<CardProduct[]>([])

  // Load compared products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('comparedProducts')
    if (savedProducts) {
      try {
        setComparedProducts(JSON.parse(savedProducts))
      } catch (error) {
        console.error('Failed to parse compared products from localStorage:', error)
      }
    }
  }, [])

  // Save compared products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts))
  }, [comparedProducts])

  const addProductToCompare = useCallback((product: CardProduct) => {
    setComparedProducts((currentProducts) => {
      // Only allow maximum 4 products for comparison
      if (currentProducts.length >= 4) {
        return currentProducts
      }
      
      // Check if product is already in the compare list
      const exists = currentProducts.some((p) => p.id === product.id)
      if (exists) {
        return currentProducts
      }
      
      return [...currentProducts, product]
    })
  }, [])

  const removeProductFromCompare = useCallback((productId: string) => {
    setComparedProducts((currentProducts) => 
      currentProducts.filter((product) => product.id?.toString() !== productId)
    )
  }, [])

  const clearComparedProducts = useCallback(() => {
    setComparedProducts([])
  }, [])

  const isInCompare = useCallback(
    (productId: string) => {
      return comparedProducts.some((product) => product.id?.toString() === productId)
    },
    [comparedProducts]
  )

  return (
    <CompareContext.Provider
      value={{
        comparedProducts,
        addProductToCompare,
        removeProductFromCompare,
        clearComparedProducts,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export const useCompare = () => useContext(CompareContext) 