'use client'
import { Button } from '@/components/ui/button'
import { Product, Color, Size } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Separator } from '../ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
  const currentColor = searchParams?.get('color') || color || 
    (product.colors?.[0] && typeof product.colors[0] === 'object' && 'title' in product.colors[0] 
      ? product.colors[0].title 
      : String(product.colors?.[0] ?? ''))

  const currentSize = searchParams?.get('size') || size || 
    (product.sizes?.[0] && typeof product.sizes[0] === 'object' && 'title' in product.sizes[0] 
      ? product.sizes[0].title 
      : String(product.sizes?.[0] ?? ''))

  // Helper function to build URL parameters
  const buildUrl = (newColor: string, newSize: string) => {
    return `?${new URLSearchParams({
      color: newColor,
      size: newSize,
    })}`
  }

  // Helper to safely get color code from color object
  const getColorCode = (colorObj: any): string => {
    if (typeof colorObj === 'object' && colorObj !== null) {
      // If it's a full Color object with code property
      if ('code' in colorObj) return colorObj.code
      // If we just have the hex value
      if (typeof colorObj === 'string') return colorObj
    }
    return '#CCCCCC' // Fallback color
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      {product.colors?.length ? (
        <div className="space-y-3">
          <div className="font-medium">Color: <span className="font-normal text-muted-foreground">{currentColor}</span></div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((colorObj, index) => {
              const colorTitle = typeof colorObj === 'object' && 'title' in colorObj 
                ? colorObj.title 
                : String(colorObj)
              const colorId = typeof colorObj === 'object' && 'id' in colorObj 
                ? String(colorObj.id) 
                : String(index)
              const colorCode = getColorCode(colorObj)
              const isSelected = currentColor === colorTitle
              
              return (
                <TooltipProvider key={colorId} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="outline"
                        className={cn(
                          'rounded-full h-10 w-10 p-0 flex items-center justify-center',
                          isSelected ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-border'
                        )}
                      >
                        <Link
                          replace
                          scroll={false}
                          href={buildUrl(colorTitle, currentSize)}
                          aria-label={`Select color: ${colorTitle}`}
                          className="flex items-center justify-center"
                        >
                          <div
                            style={{ backgroundColor: colorCode }}
                            className="h-7 w-7 rounded-full"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {colorTitle}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No color options available</p>
      )}

      <Separator className="my-4" />

      {/* Size Selection */}
      {product.sizes?.length ? (
        <div className="space-y-3">
          <div className="font-medium">Size: <span className="font-normal text-muted-foreground">{currentSize}</span></div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((sizeObj, index) => {
              const sizeTitle = typeof sizeObj === 'object' && 'title' in sizeObj 
                ? sizeObj.title 
                : String(sizeObj)
              const sizeId = typeof sizeObj === 'object' && 'id' in sizeObj 
                ? String(sizeObj.id) 
                : String(index)
              const isSelected = currentSize === sizeTitle
              
              return (
                <Button
                  key={sizeId}
                  asChild
                  variant="outline"
                  className={cn(
                    'min-w-12 h-10',
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary font-medium' 
                      : 'bg-background hover:bg-muted/50'
                  )}
                >
                  <Link
                    replace
                    scroll={false}
                    href={buildUrl(currentColor, sizeTitle)}
                    aria-label={`Select size: ${sizeTitle}`}
                  >
                    {sizeTitle}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No size options available</p>
      )}
    </div>
  )
}
