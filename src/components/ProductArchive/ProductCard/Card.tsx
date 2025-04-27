'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image' 
import { QRCodeSVG } from 'qrcode.react'
import { QrCode } from 'lucide-react'

import useClickableCard from '@/utilities/useClickableCard'
import { generateId, round2 } from '@/utilities/generateId'
import { Product, Category, Tag } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { Card as UICard, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import AddToCart from '@/components/ProductArchive/add-to-cart'
import Rating from '../rating'
import WishlistButton from '../wishlist-button'
import CompareButton from '../compare-button'

export type CardProduct = Pick<
  Product,
  | 'slug'
  | 'categories'
  | 'meta'
  | 'title'
  | 'images'
  | 'listPrice'
  | 'price'
  | 'countInStock'
  | 'id'
  | 'sizes'
  | 'colors'
  | 'tags'
  | 'avgRating'
  | 'numReviews'
  | 'flashSaleDiscount'
  | 'numSales'
>

export const Card: React.FC<{
  className?: string
  doc?: CardProduct
  showCategories?: boolean
  relationTo?: 'products'
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}> = (props) => {
  const { link } = useClickableCard({})
  const { doc, relationTo = 'products', hideAddToCart } = props

  const {
    id,
    slug,
    categories,
    title,
    images,
    listPrice,
    price,
    countInStock,
    tags,
    avgRating,
    numReviews,
    flashSaleDiscount,
    numSales,
  } = doc || {}

  const href = `/${relationTo}/${slug}`
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${href}` : href

  const getCategoryTitle = (categories: number | Category | null | undefined) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 && categories[0].title ? categories[0].title : 'Unknown Category'
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title
    }
    return 'Unknown Category'
  }

  const getFirstColor = () => {
    if (!doc?.colors || !Array.isArray(doc.colors) || doc.colors.length === 0) {
      return '';
    }
    
    const firstColor = doc.colors[0];
    if (typeof firstColor === 'object' && 'title' in firstColor) {
      return firstColor.title;
    }
    return '';
  }
  
  const getFirstSize = () => {
    if (!doc?.sizes || !Array.isArray(doc.sizes) || doc.sizes.length === 0) {
      return '';
    }
    
    const firstSize = doc.sizes[0];
    if (typeof firstSize === 'object' && 'title' in firstSize) {
      return firstSize.title;
    }
    return '';
  }

  const selectedColor = getFirstColor();
  const selectedSize = getFirstSize();

  // Calculate discount percentage for display
  let discountPercentage = 0;
  if (listPrice && price && price < listPrice) {
    discountPercentage = Math.max(0, Math.round(((listPrice - price) / listPrice) * 100));
  }
  
  // Use actual sales data if available, otherwise generate a virtual sold count
  const actualSoldCount = numSales ?? 0;
  const displaySoldCount = numSales !== undefined ? actualSoldCount : (id 
    ? (parseInt(String(id)) % 80) + 20 // Generate a "random-like" but consistent number based on product ID
    : 50);
  
  // Calculate total quantity (items sold + items in stock)
  const totalQuantity = countInStock !== undefined 
    ? displaySoldCount + countInStock 
    : 100;
  
  // Calculate percentage for progress bar
  const soldPercentage = totalQuantity > 0 
    ? Math.min(100, (displaySoldCount / totalQuantity) * 100) 
    : 50;

  return (
    <Link
      href={href}
      ref={link.ref}
      className="group block h-full"
    >
      <UICard className="border border-gray-200 overflow-hidden h-full hover:shadow-md transition-shadow">
        <CardContent className="p-2 sm:p-3 relative">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <div 
            className="absolute top-2 right-2 z-10" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Log product ID for debugging
              if (process.env.NODE_ENV === 'development') {
                console.log('Product ID in Card component:', id);
              }
            }}
            data-product-id={id}
          >
            <WishlistButton productId={id?.toString() ?? ''} />
          </div>
          
          {/* Product Image */}
          <div className="relative w-full aspect-square overflow-hidden rounded-md mb-1">
            {images?.[0]?.image && (
              <div className="relative w-full h-full">
                <Image
                  src={
                    typeof images[0].image === 'string'
                      ? images[0].image
                      : typeof images[0].image === 'object' &&
                        'url' in images[0].image
                        ? images[0].image.url || ''
                        : ''
                  }
                  alt={title || 'Product image'}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            )}
            
            {countInStock === 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-md">
                <span className="font-semibold text-xs px-2 py-0.5 bg-red-600/80 rounded-full">Out of Stock</span>
              </div>
            )}
          </div>
          
          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1 mb-0.5">
            {title}
          </h3>
          
          {/* Star Rating */}
          <div className="flex items-center">
            <Rating rating={avgRating ?? 0} size={3} />
            <span className="ml-1 text-xs text-gray-500">({numReviews ?? 0})</span>
          </div>
          
          {/* Price Display */}
          <div className="flex items-start justify-between mt-0.5">
            <div className="flex flex-col">
              <div className="flex items-center flex-wrap">
                <span className="text-sm sm:text-base text-blue-600 font-bold">${price?.toFixed(2)}</span>
                {listPrice && (
                  <span className="ml-1 text-xs text-gray-400 line-through">${listPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Sold count and progress bar */}
          <div className="mt-1">
            <div className="flex justify-between text-xs text-gray-500 mb-0.5">
              <span>{displaySoldCount} sold</span>
              <span>{countInStock !== undefined ? `${countInStock} in stock` : 'Limited stock'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full" 
                style={{ width: `${soldPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1 w-full mt-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {!hideAddToCart && (
              <AddToCart
                minimal
                item={{
                  clientId: generateId(),
                  product: id ?? 0,
                  slug: String(slug),
                  category: getCategoryTitle(categories),
                  image:
                    images?.[0]?.image && typeof images[0]?.image !== 'number'
                      ? typeof images[0].image === 'string'
                        ? images[0].image
                        : images[0].image.url || ''
                      : '',
                  countInStock: countInStock ?? 0,
                  name: title ?? '',
                  price: round2(price ?? 0),
                  quantity: 1,
                  size: selectedSize,
                  color: selectedColor,
                }}
              />
            )}
            <CompareButton product={doc as CardProduct} />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <QrCode className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan to view product</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-4">
                  <QRCodeSVG value={fullUrl} size={200} />
                  <p className="text-sm text-gray-500 text-center">
                    Scan this QR code to view {title} on your mobile device
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </UICard>
    </Link>
  )
}
