'use client'

import { CardProduct } from '@/types'
import { WishlistButton } from '@/components/Wishlist/WishlistButton'
import { Button } from '@/components/ui/button'
import { ShoppingCart, QrCode, Timer } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/payload-types'
import Rating from '@/components/ProductArchive/rating'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { QRCodeSVG } from 'qrcode.react'
import CompareButton from '@/components/ProductArchive/compare-button'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'

interface ProductCardProps {
  product: CardProduct
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productUrl = `/products/${product.slug}`
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${productUrl}` : productUrl

  // Calculate discount percentage
  let discountPercentage = 0
  if (product.listPrice && product.price < product.listPrice) {
    discountPercentage = Math.max(0, Math.round(((product.listPrice - product.price) / product.listPrice) * 100))
  }

  // Calculate sold percentage for progress bar
  const totalQuantity = (product.countInStock || 0) + 100 // Using a fixed number for demo
  const soldPercentage = totalQuantity > 0 
    ? Math.min(100, (50 / totalQuantity) * 100) // Using a fixed number for demo
    : 0

  return (
    <div className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 ">
      <Link href={productUrl}>
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </div>
          )}

          {/* Featured Badge */}
          {product.isFeatured && (
            <div className="absolute top-2 right-2 z-10 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </div>
          )}
          
          <Image
            src={typeof product.images?.[0]?.image === 'object' && product.images[0]?.image !== null ? (product.images[0].image.url || '/placeholder.png') : '/placeholder.png'}
            alt={product.title}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Out of Stock Overlay */}
          {product.countInStock === 0 && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full text-white">Out of Stock</span>
            </div>
          )}

          {/* Flash Sale Timer */}
          {product.flashSaleDiscount && (
            <div className="absolute bottom-2 left-2 right-2 z-10 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center justify-center">
              <Timer className="h-3 w-3 mr-1" />
              <span>Flash Sale: {product.flashSaleDiscount}% Off</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">
          <Link href={productUrl}>{product.title}</Link>
        </h3>
        
        {/* Category */}
        <p className="text-xs text-gray-500 mb-1">{product.category?.name}</p>
        
        {/* Star Rating */}
        <div className="flex items-center mb-1">
          <Rating rating={product.avgRating || 0} size={4} />
          <span className="ml-1 text-xs text-gray-500">({product.numReviews || 0})</span>
        </div>
        
        {/* Price Display */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center flex-wrap">
              <span className="text-lg text-blue-600 font-bold">${product.price?.toFixed(2)}</span>
              {product.listPrice && (
                <span className="ml-1 text-xs text-gray-400 line-through">${product.listPrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Sales Progress Bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>50 sold</span>
            <span>{product.countInStock !== undefined ? `${product.countInStock} in stock` : 'Limited stock'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <CompareButton product={product} />
          <WishlistButton product={product} />
          <div onClick={(e) => e.preventDefault()}>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <QrCode className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan to view product</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-4">
                  <QRCodeSVG value={fullUrl} size={200} />
                  <p className="text-sm text-gray-500 text-center">
                    Scan this QR code to view {product.title} on your mobile device
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex-1" onClick={(e) => e.preventDefault()}>
            <AddToCart
              minimal
              item={{
                clientId: generateId(),
                product: Number(product.id) || 0,
                slug: String(product.slug),
                category: product.category?.name || '',
                image: typeof product.images?.[0]?.image === 'object' && product.images[0]?.image !== null ? product.images[0].image.url || '' : '',
                countInStock: product.countInStock || 0,
                name: product.title || '',
                price: round2(product.price || 0),
                quantity: 1
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Card = ProductCard 