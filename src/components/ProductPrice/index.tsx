import React from 'react'
import { Product } from '../../payload-types'
import { calculateFlashSalePrice, isProductOnSale } from '../../utilities/flashSale'

type Props = {
  product: Product
  className?: string
}

export const ProductPrice: React.FC<Props> = ({ product, className = '' }) => {
  const isOnSale = isProductOnSale(product)
  const salePrice = calculateFlashSalePrice(product)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isOnSale ? (
        <>
          <span className="text-gray-500 line-through">${product.listPrice.toFixed(2)}</span>
          <span className="text-red-500 font-semibold">${salePrice.toFixed(2)}</span>
          <span className="text-sm text-red-500">({product.flashSaleDiscount}% OFF)</span>
        </>
      ) : (
        <span className="font-semibold">${product.price.toFixed(2)}</span>
      )}
    </div>
  )
}
