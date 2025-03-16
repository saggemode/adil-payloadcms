'use client'
import { Button } from '@/components/ui/button'
import { Product } from '@/payload-types'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Separator } from '../ui/separator'

export default function SelectVariant({
  product,
  size,
  color,
}: {
  product: Product
  color: string
  size: string
}) {
  const searchParams = useSearchParams()
  const currentColor = searchParams?.get('color') || color || String(product.colors?.[0] ?? '')
  const currentSize = searchParams?.get('size') || size || String(product.sizes?.[0] ?? '')

  return (
    <>
      {/* Color Selection */}
      {product.colors?.length ? (
        <div className="space-x-2 space-y-2">
          <div>Color:</div>
          {product.colors.map((colorObj) => (
            <Button
              asChild
              variant="outline"
              className={
                currentColor === String((colorObj as any)?.title)
                  ? 'border-2 border-primary'
                  : 'border-2'
              }
              key={String((colorObj as any)?.id)}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: String((colorObj as any)?.title),
                  size: currentSize, // Preserve current size
                })}`}
              >
                <div
                  style={{ backgroundColor: String(colorObj) }}
                  className="h-4 w-4 rounded-full border border-muted-foreground"
                />
                {String((colorObj as any)?.title)}
              </Link>
            </Button>
          ))}
        </div>
      ) : (
        <p>No colors available</p>
      )}

      <Separator className="my-2" />

      {/* Size Selection */}
      {product.sizes?.length ? (
        <div className="mt-2 space-x-2 space-y-2">
          <div>Size:</div>
          {product.sizes.map((sizeObj) => (
            <Button
              asChild
              variant="outline"
              className={
                currentSize === String((sizeObj as any)?.title)
                  ? 'border-2 border-primary'
                  : 'border-2'
              }
              key={String((sizeObj as any)?.id)}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: currentColor, // Preserve current color
                  size: String((sizeObj as any)?.title),
                })}`}
              >
                {String((sizeObj as any)?.title)}
              </Link>
            </Button>
          ))}
        </div>
      ) : (
        <p>No sizes available</p>
      )}
    </>
  )
}
