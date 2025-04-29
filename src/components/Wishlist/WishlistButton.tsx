'use client'

import React from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CardProduct } from '@/types'

interface WishlistButtonProps {
  product: CardProduct
  className?: string
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ product, className = '' }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const isInWishlistList = product.id ? isInWishlist(product.id.toString()) : false

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (isInWishlistList) {
                removeFromWishlist(product.id?.toString() || '')
              } else {
                addToWishlist(product)
              }
            }}
            aria-label={isInWishlistList ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`${className} ${isInWishlistList ? 'border-primary text-primary' : ''}`}
          >
            {isInWishlistList ? (
              <HeartIconSolid className="h-4 w-4" />
            ) : (
              <HeartIcon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInWishlistList ? 'Remove from wishlist' : 'Add to wishlist'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 