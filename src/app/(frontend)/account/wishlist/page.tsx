'use client'

import Link from 'next/link'
import { getWishlist } from '@/actions/wishlistAction'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import ProductPrice from '@/components/ProductArchive/Price'
import WishlistItem from './WishlistItem'
import { useQuery } from '@tanstack/react-query'

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="flex gap-2">
        <Link href="/account" className="hover:text-primary transition-colors duration-200">Your Account</Link>
        <span>›</span>
        <span>Your Wishlist</span>
      </div>
      <h1 className="h1-bold py-4">Your Wishlist</h1>

      {!wishlist?.success || !wishlist?.data?.items?.length ? (
        <Card>
          <CardHeader className="text-3xl">Your Wishlist is empty</CardHeader>
          <CardContent>
            Continue shopping on{' '}
            <Link 
              href="/products" 
              prefetch={true}
              className="text-primary hover:text-primary/80 hover:underline transition-all duration-200 font-medium"
            >
              Products
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.data.items.map((item, index) => {
            const product = item.product
            if (!product || typeof product === 'number') return null

            return <WishlistItem key={`${index}-${product.id}`} product={product} />
          })}
        </div>
      )}
    </div>
  )
} 