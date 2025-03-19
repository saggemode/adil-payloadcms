import { Product } from '../payload-types'

export const calculateFlashSalePrice = (product: Product): number => {
  if (!product.flashSaleId || !product.flashSaleEndDate) {
    return product.price
  }

  const now = new Date()
  const endDate = new Date(product.flashSaleEndDate)

  // If flash sale has ended, return original price
  if (now > endDate) {
    return product.listPrice
  }

  // Calculate discounted price
  if (product.flashSaleDiscount) {
    return product.listPrice * (1 - product.flashSaleDiscount / 100)
  }

  return product.listPrice
}

export const isProductOnSale = (product: Product): boolean => {
  if (!product.flashSaleId || !product.flashSaleEndDate) {
    return false
  }

  const now = new Date()
  const endDate = new Date(product.flashSaleEndDate)

  return now <= endDate
}

export const getSaleEndTime = (product: Product): Date | null => {
  if (!product.flashSaleEndDate) {
    return null
  }
  return new Date(product.flashSaleEndDate)
}
