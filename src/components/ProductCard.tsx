'use client'

import {
  isInFlashSale,
  getCurrentPrice,
  getDiscountPercentage,
  FlashSaleProduct,
} from '../../lib/utils/flashSale'

interface ProductCardProps {
  product: FlashSaleProduct
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const inFlashSale = isInFlashSale(product)
  const currentPrice = getCurrentPrice(product)
  const discountPercentage = getDiscountPercentage(product)

  return (
    <div>
      {inFlashSale && (
        <div className="bg-red-600 text-white px-2 py-1 rounded-md">
          <div className="flex items-center gap-2">
            <span>Flash Sale!</span>
            <span>{discountPercentage}% OFF</span>
          </div>
          {/* Add countdown timer component here */}
        </div>
      )}
      <h3>{product.name}</h3>
      <div className="flex items-center gap-2">
        <span className={inFlashSale ? 'line-through text-gray-400' : ''}>${product.price}</span>
        {inFlashSale && <span className="text-red-600 font-bold">${currentPrice}</span>}
      </div>
    </div>
  )
}
