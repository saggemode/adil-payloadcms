'use client'

import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/utilities/formatPrice'
import Image from 'next/image'
import { Product, Category } from '@/payload-types'
import WishlistButton from '../wishlist-button'

interface ProductData extends Omit<Product, 'categories'> {
  categories?: number | Category | null
}

interface ClientProductCardProps {
  product: ProductData
  isFlashSale: boolean
  discountPercent: number
}

export function ClientProductCard({
  product,
  isFlashSale,
  discountPercent,
}: ClientProductCardProps) {
  const price = product.price || 0
  const discountedPrice = price - (price * discountPercent) / 100
  const categoryTitle =
    (typeof product.categories === 'object' && product.categories?.title) || 'Uncategorized'

  return (
    <div className="group relative">
      {/* Product Image */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg relative">
        <Image
          src={
            (product.images?.[0]?.image &&
            typeof product.images[0].image === 'object' &&
            'url' in product.images[0].image
              ? product.images[0].image.url
              : '/placeholder.jpg') as string
          }
          alt={product.title || 'Product image'}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Flash Sale Badge */}
        {isFlashSale && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="destructive" className="animate-pulse">
              Flash Sale
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-2 left-2 z-10">
          <WishlistButton productId={product.id?.toString() || ''} />
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 dark:text-gray-200">
            <a href={`/products/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.title}
            </a>
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{categoryTitle}</p>
        </div>

        {/* Price Display */}
        <div className="text-right">
          {isFlashSale ? (
            <>
              <p className="text-sm text-gray-500 line-through">₦{formatPrice(price)}</p>
              <p className="text-sm font-medium text-red-600">₦{formatPrice(discountedPrice)}</p>
              <p className="text-xs text-red-600">{discountPercent}% OFF</p>
            </>
          ) : (
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              ₦{formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
