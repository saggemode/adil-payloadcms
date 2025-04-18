'use client'
//import ProductPrice from '@/components/shared/product/product-price'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import useCartStore from '@/hooks/use-cart-store'
import { FREE_SHIPPING_MIN_PRICE } from '@/constants'
import BrowsingHistoryList from '@/heros/ProductHero/components/browsing-history-list'
import ProductPrice from '@/components/ProductArchive/Price'
import { cn } from '@/utilities/ui'
//import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { useState, useEffect } from 'react'

export default function CartAddItem({ itemId }: { itemId: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const {
    cart: { items, itemsPrice },
  } = useCartStore()
  const item = items.find((x) => x.clientId === itemId)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!item) return notFound()

  if (isLoading) {
    return (
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
          <Card className='w-full rounded-none'>
            <CardContent className='flex h-full items-center justify-center gap-3 py-4'>
              <Skeleton className='h-20 w-20' />
              <div className='space-y-2'>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-24' />
              </div>
            </CardContent>
          </Card>
          <Card className='w-full rounded-none'>
            <CardContent className='p-4 h-full'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div className='flex justify-center items-center'>
                  <Skeleton className='h-12 w-full' />
                </div>
                <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3'>
                  <Skeleton className='h-8 w-32' />
                  <Skeleton className='h-10 w-full' />
                  <Skeleton className='h-10 w-full' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <Skeleton className='h-40 w-full' />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
        <Card className='w-full rounded-none'>
          <CardContent className='flex h-full items-center justify-center  gap-3 py-4'>
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </Link>
            <div>
              <h3 className='text-xl font-bold flex gap-2 my-2'>
                <CheckCircle2Icon className='h-6 w-6 text-green-700' />
                Added to cart
              </h3>
              <p className='text-sm'>
                <span className='font-bold'> Color: </span> {item.color ?? '-'}
              </p>
              <p className='text-sm'>
                <span className='font-bold'> Size: </span> {item.size ?? '-'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 h-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div className='flex justify-center items-center'>
                {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                  <div className='text-center '>
                    Add
                    <span className='text-green-700'>
                      <ProductPrice
                        price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                        plain
                      />
                    </span>{' '}
                    of eligible items to your order to qualify for FREE Shipping
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <div>
                      <span className='text-green-700'>
                        Your order qualifies for FREE Shipping.
                      </span>{' '}
                      Choose this option at checkout.
                    </div>
                  </div>
                )}
              </div>
              <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3'>
                <div className='flex gap-3'>
                  <span className='text-lg font-bold'>Cart Subtotal:</span>
                  <ProductPrice className='text-2xl' price={itemsPrice} />
                </div>
                <Link
                  href='/checkout'
                  className={cn(
                    buttonVariants({ className: 'rounded-full w-full' }),
                    'relative',
                    isLoading && 'cursor-not-allowed opacity-50'
                  )}
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading...
                    </div>
                  ) : (
                    <>
                      Proceed to checkout (
                      {items.reduce((a, c) => a + c.quantity, 0)} items)
                    </>
                  )}
                </Link>
                <Link
                  href='/cart'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  Go to Cart
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BrowsingHistoryList />
    </div>
  )
}
