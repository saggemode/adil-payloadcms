'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import WishlistItem from './WishlistItem'
import { useWishlist } from '@/hooks/use-wishlist'
import { Skeleton } from '@/components/ui/skeleton'

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist()

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div>
        <div className="flex gap-2">
          <Link href="/account" className="hover:text-primary transition-colors duration-200">Your Account</Link>
          <span>›</span>
          <span>Your Wishlist</span>
        </div>
        <h1 className="h1-bold py-4">Your Wishlist</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="aspect-square mb-4" />
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Content with wishlist items
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
            const productItem = item.product;
            
            // Debug log to see what product data we have
            if (process.env.NODE_ENV === 'development') {
              console.log(`Wishlist item ${index}:`, productItem);
            }
            
            // Skip if product is missing or just a reference (not populated)
            if (!productItem || typeof productItem === 'number') {
              console.log('Skipping product that is not fully populated:', productItem);
              return null;
            }
            
            // Make sure the product has an id
            if (!productItem.id) {
              console.log('Product missing ID:', productItem);
              return null;
            }

            return <WishlistItem key={`${index}-${productItem.id}`} product={productItem} />
          })}
        </div>
      )}
    </div>
  )
} 