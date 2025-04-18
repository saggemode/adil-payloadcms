'use client'

import { Product } from '@/payload-types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from '@/components/ProductArchive/Price'
import { useRemoveFromWishlist } from '@/hooks/use-wishlist'
import { useToast } from '@/hooks/use-toast'

interface WishlistItemProps {
  product: Product
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const { toast } = useToast()
  const removeMutation = useRemoveFromWishlist()

  const handleRemove = () => {
    removeMutation.mutate(product.id.toString(), {
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
  }

  const getImageUrl = (): string => {
    if (!product?.images?.[0]?.image) return '/placeholder.jpg';
    
    const image = product.images[0].image;
    
    // If image is a Media object
    if (typeof image === 'object' && image !== null) {
      // Check for url property
      if ('url' in image && image.url) {
        return image.url;
      }
      // Check for sizes property for responsive images
      if ('sizes' in image && image.sizes) {
        // Try to get medium size first, then fall back to other sizes
        const sizes = image.sizes as any;
        return sizes.medium?.url || sizes.small?.url || sizes.thumbnail?.url || '/placeholder.jpg';
      }
    }
    
    // If image is a string (direct URL)
    if (typeof image === 'string') {
      return image;
    }
    
    // Debug info - log what we're seeing
    if (process.env.NODE_ENV === 'development') {
      console.log('Product image data:', image);
    }
    
    return '/placeholder.jpg';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4">
          <Image
             src={getImageUrl()}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <ProductPrice 
          price={product.price} 
          listPrice={product.listPrice ?? 0}
          isDeal={product.listPrice > product.price}
          flashSaleDiscount={product.flashSaleDiscount ?? undefined}
          currencyCode="NGN"
        />
        <Button asChild className="w-full mt-4">
          <Link href={`/products/${product.slug}`}>View Product</Link>
        </Button>
      </CardContent>
    </Card>
  )
}