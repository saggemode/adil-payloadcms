import React from 'react'
import { Product } from '../../payload-types'
import { isProductOnSale, getSaleEndTime } from '../../utilities/flashSale'

type Props = {
  product: Product
}

export const FlashSaleBadge: React.FC<Props> = ({ product }) => {
  const isOnSale = isProductOnSale(product)
  const saleEndTime = getSaleEndTime(product)

  if (!isOnSale) return null

  return (
    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
      <div>Sale</div>
      <div className="text-xs">
        Ends: {saleEndTime?.toLocaleDateString()} {saleEndTime?.toLocaleTimeString()}
      </div>
    </div>
  )
}
