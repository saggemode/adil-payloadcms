'use client'

import { useSearchParams } from 'next/navigation'
import useClickableCard from '@/utilities/useClickableCard'
import React, { useState } from 'react'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { Product, Category, Tag } from '@/payload-types'
import ProductImage from './ProductImage'
import Rating from '../rating'
import ProductPrice from '../Price'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { QrCode } from 'lucide-react'
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
  } = doc || {}

  const href = `/${relationTo}/${slug}`
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${href}` : href

  const getCategoryTitle = (categories: number | Category | null | undefined) => {
    if (Array.isArray(categories)) {
      return categories.length > 0 ? categories[0].title : 'Unknown Category'
    }
    if (typeof categories === 'object' && categories?.title) {
      return categories.title
    }
    return 'Unknown Category'
  }

  const getTagTitle = (tags: number | Tag | null | undefined) => {
    if (Array.isArray(tags)) {
      return tags.length > 0 ? tags[0].title : 'Unknown Tag'
    }
    if (typeof tags === 'object' && tags?.title) {
      return tags.title
    }
    return 'Unknown Category'
  }

  const searchParams = useSearchParams()
  const selectedColor =
    searchParams?.get('color') ||
    (typeof doc?.colors?.[0] === 'object' && 'title' in doc.colors[0] ? doc.colors[0].title : '')
  const selectedSize =
    searchParams?.get('size') ||
    (typeof doc?.sizes?.[0] === 'object' && 'title' in doc.sizes[0] ? doc.sizes[0].title : '')

  const AddButton = () => (
    <AddToCart
      minimal
      item={{
        clientId: generateId(),
        product: id ?? 0,
        slug: String(slug),
        category: getCategoryTitle(categories),
        image:
          images?.[0]?.image && typeof images[0]?.image !== 'number'
            ? images[0].image.url || ''
            : '',
        countInStock: countInStock ?? 0,
        name: title ?? '',
        price: round2(price ?? 0),
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      }}
    />
  )

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
        <Link href={href} ref={link.ref} className="block">
          <div className="aspect-square relative overflow-hidden rounded-t-2xl">
            <ProductImage 
              images={
                images?.map((item) => {
                  if (!item.image) {
                    return ''
                  }
                  if (typeof item.image === 'string') {
                    return item.image
                  }
                  if (typeof item.image === 'object' && 'url' in item.image && item.image.url) {
                    return item.image.url
                  }
                  return ''
                }) || []
              }
            />
            
            <div className="absolute top-3 right-3 z-10" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              <WishlistButton productId={id?.toString() ?? ''} />
            </div>
            
            {countInStock === 0 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-t-2xl">
                <span className="font-semibold px-3 py-1 bg-red-600/80 rounded-full ">Out of Stock</span>
              </div>
            )}
            
            {listPrice && price && price < listPrice && (
              <div className="absolute top-3 left-3 bg-red-600 text-xs font-bold px-3 py-1 rounded-full ">
                {Math.round(((listPrice - price) / listPrice) * 100)}% OFF
              </div>
            )}
            
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="font-medium px-4 py-2 rounded-full text-gray-900 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Quick View
              </span>
            </div>
          </div>
        </Link>
        
        <div className="p-5 rounded-b-2xl">
          <Link href={href}>
            <h3 className="text-base font-medium mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-end mb-3">
            <Rating rating={avgRating ?? 0} />
            <span className="text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
              <span>({numReviews ?? 0})</span>
            </span>
          </div>
          
          <div className="rounded-xl overflow-hidden mb-4">
            <ProductPrice 
              price={price ?? 0} 
              listPrice={listPrice}
              forListing={true}
              className="text-lg font-bold"
              isDeal={listPrice ? (price ?? 0) < listPrice : false}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full">
            {!hideAddToCart && <AddButton />}
            <CompareButton product={doc as CardProduct} />
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
                    Scan this QR code to view {title} on your mobile device
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
