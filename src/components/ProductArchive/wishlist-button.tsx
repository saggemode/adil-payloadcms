'use client'

import { Heart  } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAddToWishlist, useIsInWishlist, useRemoveFromWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { HeartFilledIcon } from '@radix-ui/react-icons'


interface WishlistButtonProps {
  productId: string
  className?: string
}

export default function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { data: isInWishlistData } = useIsInWishlist(productId)
  const addToWishlistMutation = useAddToWishlist()
  const removeFromWishlistMutation = useRemoveFromWishlist()

  const handleWishlistClick = async () => {
    try {
      if (!isInWishlistData?.success) {
        router.push('/auth/login')
        return
      }

      if (isInWishlistData.data) {
        const result = await removeFromWishlistMutation.mutateAsync(productId)
        if (result.success) {
          toast({
            description: 'Removed from wishlist',
          })
        }
      } else {
        const result = await addToWishlistMutation.mutateAsync(productId)
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
        }
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
      className={className}
      onClick={handleWishlistClick}
      aria-label={isInWishlistData?.data ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlistData?.data ? (
        <HeartFilledIcon className="h-5 w-5 text-red-500 fill-current" />
      ) : (
        <Heart className="h-5 w-5" />
      )}
    </Button>
  )
} 