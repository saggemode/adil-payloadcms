export interface FlashSaleProduct {
  name: string
  flashSale?: {
    isFlashSale: boolean
    flashSalePrice: number
    startTime: string
    endTime: string
    flashSaleStock: number
  }
  price: number
  images?: { url: string }[]
  soldCount?: number
  rating?: number
}

export const isInFlashSale = (product: FlashSaleProduct): boolean => {
  if (!product.flashSale?.isFlashSale) return false

  const now = new Date()
  const startTime = new Date(product.flashSale.startTime)
  const endTime = new Date(product.flashSale.endTime)

  return now >= startTime && now <= endTime
}

export const getCurrentPrice = (product: FlashSaleProduct): number => {
  if (isInFlashSale(product)) {
    return product.flashSale!.flashSalePrice
  }
  return product.price
}

export const getDiscountPercentage = (product: FlashSaleProduct): number => {
  if (!isInFlashSale(product)) return 0

  const discount = product.price - product.flashSale!.flashSalePrice
  return Math.round((discount / product.price) * 100)
}
