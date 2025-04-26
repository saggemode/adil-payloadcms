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
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        <img
          src={product.images?.[0]?.url || '/placeholder.png'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-sm text-gray-700 line-clamp-2 min-h-[40px]">{product.name}</h3>
        
        <div className="mt-2 flex flex-col">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-red-600">
              ₦{((product.price * (100 - discountPercentage)) / 100).toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₦{product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          {(product.soldCount ?? 0) > 0 && (
            <div className="mt-1 flex items-center text-xs text-gray-500">
              <span>{product.soldCount ?? 0}+ sold</span>
              {(product.rating ?? 0) > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="flex items-center">
                    {(product.rating ?? 0).toFixed(1)}
                    <svg className="h-3 w-3 text-yellow-400 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </>
              )}
            </div>
          )}
          
          <button className="mt-3 w-full bg-[#33A1E6] text-white py-2 rounded-full hover:bg-[#2890d5] transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
