'use client'

import { Product } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from '@/components/ProductArchive/Price'
import { removeFromWishlist } from '@/actions/wishlistAction'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface WishlistItemProps {
  product: Product
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['wishlist'] })
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
    },
  })

  const handleRemove = () => {
    removeMutation.mutate(product.id.toString())
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4">
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
            className="object-cover rounded-md"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleRemove}
            disabled={removeMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <h3 className="font-semibold mb-2">{product.title}</h3>
        <ProductPrice price={product.price} listPrice={product.listPrice} />
        <Button asChild className="w-full mt-4">
          <Link href={`/products/${product.slug}`}>View Product</Link>
        </Button>
      </CardContent>
    </Card>
  )
} 