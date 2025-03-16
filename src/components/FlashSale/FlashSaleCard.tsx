'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { FlashSaleTimer } from './FlashSaleTimer'
import { formatPrice } from '@/utilities/formatPrice'
import Image from 'next/image'
import Link from 'next/link'
import { FlashSale } from '@/payload-types'

interface FlashSaleCardProps {
  sale: FlashSale
  showProducts?: boolean
  className?: string
}

export function FlashSaleCard({ sale, showProducts = true, className }: FlashSaleCardProps) {
  const [saleStatus, setSaleStatus] = useState<'upcoming' | 'active' | 'ended'>('active')
  const progress = ((sale.soldQuantity || 0) / sale.totalQuantity) * 100

  return (
    <Card className={className}>
      {sale.featuredImage && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={
              (typeof sale.featuredImage === 'string'
                ? sale.featuredImage
                : typeof sale.featuredImage === 'object' && 'url' in sale.featuredImage
                  ? sale.featuredImage.url
                  : '/placeholder.jpg') as string
            }
            alt={sale.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white">{sale.name}</h3>
          </div>
        </div>
      )}

      <CardHeader className="space-y-2">
        {!sale.featuredImage && <h3 className="text-xl font-bold">{sale.name}</h3>}
        <div className="flex items-center justify-between">
          <Badge variant="destructive" className="text-sm">
            {sale.discountPercent}% OFF
          </Badge>
          <FlashSaleTimer
            startDate={sale.startDate}
            endDate={sale.endDate}
            onStatusChange={setSaleStatus}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {sale.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{sale.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Sold: {sale.soldQuantity || 0}/{sale.totalQuantity}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% claimed</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {(sale.minimumPurchase ?? 0) > 0 && (
          <p className="text-sm text-muted-foreground">
            Minimum purchase: ₦{formatPrice(sale.minimumPurchase ?? 0)}
          </p>
        )}

        {showProducts && Array.isArray(sale.products) && sale.products.length > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-2">
            {sale.products.slice(0, 4).map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative aspect-square overflow-hidden rounded-md bg-gray-100"
              >
                {product.images?.[0]?.image && (
                  <Image
                    src={
                      typeof product.images[0].image === 'string'
                        ? product.images[0].image
                        : product.images[0].image.url
                    }
                    alt={product.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                )}
              </Link>
            ))}
          </div>
        )}

        <Button
          className="w-full"
          variant={saleStatus === 'active' ? 'default' : 'secondary'}
          asChild
          disabled={saleStatus !== 'active'}
        >
          <Link href={`/flash-sales/${sale.id}`}>
            {saleStatus === 'upcoming'
              ? 'Coming Soon'
              : saleStatus === 'ended'
                ? 'Sale Ended'
                : 'Shop Now'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
