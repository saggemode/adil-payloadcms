'use client'

import { useSearchParams } from 'next/navigation'
import useClickableCard from '@/utilities/useClickableCard'

import React from 'react'
import AddToCart from '@/components/ProductArchive/add-to-cart'
import { generateId, round2 } from '@/utilities/generateId'
import { Product, Category, Tag } from '@/payload-types'

import ProductImage from './ProductImage'
import Rating from '../rating'
import ProductPrice from '../Price'
import { formatNumber } from '@/utilities/formatNumberWithDecimal'
import Link from 'next/link'

export type ProductCard = Pick<
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
>

export const Card: React.FC<{
  className?: string
  doc?: ProductCard
  showCategories?: boolean
  relationTo?: 'products'
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}> = (props) => {
  const { link } = useClickableCard({})
  // const { doc, relationTo, hideAddToCart } = props
  const {
    doc,
    relationTo,
    hideAddToCart,
  } = props

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
  } = doc || {}

  const href = `/${relationTo}/${slug}`

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
    searchParams.get('color') ||
    (typeof doc?.colors?.[0] === 'object' && 'title' in doc.colors[0] ? doc.colors[0].title : '')
  const selectedSize =
    searchParams.get('size') ||
    (typeof doc?.sizes?.[0] === 'object' && 'title' in doc.sizes[0] ? doc.sizes[0].title : '')

  const AddButton = () => (
    <div className="w-full text-center">
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
    </div>
  )

  return (
    <div className="flex flex-col items-start aspect-auto">
      <Link href={href} ref={link.ref} className="w-full">
        <div className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
          <ProductImage
            images={
              images?.map((item) => {
                if (!item.image) {
                  return '' // Handles null or undefined cases
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
        </div>
        <strong className="xl:text-xl">{title}</strong>
        <div className="flex items-end mb-1 xl:mb-2">
          <Rating rating={avgRating ?? 0} />
          <span className="text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
            <span>({formatNumber(numReviews ?? 0)})</span>
          </span>
        </div>
        <ProductPrice
          price={price ?? 0}
          listPrice={listPrice}
          isDeal={getTagTitle(tags)}
          forListing={false}
        />
      </Link>
      {!hideAddToCart && <AddButton />}
    </div>
  )
}
