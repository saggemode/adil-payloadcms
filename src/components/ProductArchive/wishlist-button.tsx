'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddToWishlist, useIsInWishlist, useRemoveFromWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { HeartFilledIcon } from '@radix-ui/react-icons'
import { useState, useEffect } from 'react'

interface WishlistButtonProps {
  productId: string
  className?: string
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { data: isInWishlistData, isLoading: isCheckingWishlist } = useIsInWishlist(productId)
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()
  const [isInWishlist, setIsInWishlist] = useState(false)

  useEffect(() => {
    if (isInWishlistData?.success && typeof isInWishlistData.data === 'boolean') {
      setIsInWishlist(isInWishlistData.data)
    }
  }, [isInWishlistData])

  const handleWishlistClick = async () => {
    try {
      if (!isInWishlistData?.success) {
        router.push('/auth/login')
        return
      }

      if (isInWishlist) {
        removeFromWishlistMutation.mutate(productId, {
          onSuccess: (result) => {
            if (result.success) {
              toast({
                description: 'Removed from wishlist',
              })
            } else {
              toast({
                variant: 'destructive',
                description: result.message || 'Failed to remove from wishlist',
              })
            }
          },
          onError: () => {
            toast({
              variant: 'destructive',
              description: 'Failed to remove from wishlist',
            })
          }
        })
      } else {
        addToWishlistMutation.mutate(productId, {
          onSuccess: (result) => {
            if (result.success) {
              if (result.message === 'Product already in wishlist') {
                toast({
                  variant: 'default',
                  description: 'Product is already in your wishlist',
                })
              } else {
                toast({
                  description: 'Added to wishlist',
                })
              }
            } else {
              toast({
                variant: 'destructive',
                description: result.message || 'Failed to add to wishlist',
              })
            }
          },
          onError: () => {
            toast({
              variant: 'destructive',
              description: 'Failed to add to wishlist',
            })
          }
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong',
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${className || ''} transition-all duration-200`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleWishlistClick();
      }}
      disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending || isCheckingWishlist}
    >
      {isInWishlist ? (
        <HeartFilledIcon className="w-5 h-5 text-red-500" />
      ) : (
        <Heart className="w-5 h-5" />
      )}
    </Button>
  )
}