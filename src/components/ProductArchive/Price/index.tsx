'use client'

import { cn } from "@/utilities/ui"



const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
  currencyCode = 'NGN',
}: {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
  currencyCode?: string
}) => {
  // const discountPercent = Math.round(100 - (price / listPrice) * 100)
  const discountPercent = listPrice > 0 ? Math.abs(Math.round(100 - (price / listPrice) * 100)) : 0
  const validCurrencyCodes = ['NGN', 'EUR', 'GBP']
  const validatedCurrencyCode = validCurrencyCodes.includes(currencyCode.toUpperCase())
    ? currencyCode.toUpperCase()
    : 'NGN'

  const formattedPrice = `${new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: validatedCurrencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)}`

  return plain ? (
    formattedPrice
  ) : listPrice == 0 ? (
    <div className={cn('text-3xl', className)}>{formattedPrice}</div>
  ) : isDeal ? (
    <div className="space-y-2">
      <div className="flex justify-center items-center gap-2">
        <span className="bg-red-700 rounded-sm p-1 text-white text-sm font-semibold">
          {discountPercent}% Off
        </span>
        <span className="text-red-700 text-xs font-bold">Limited time deal</span>
      </div>
      <div className={`flex ${forListing && 'justify-center'} items-center gap-2`}>
        <div className={cn('text-1xl', className)}>{formattedPrice}</div>
        <div className="text-muted-foreground text-xs py-2">
          Was:{' '}
          <span className="line-through">{`${new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: validatedCurrencyCode,
            currencyDisplay: 'narrowSymbol',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(listPrice)}`}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="">
      <div className="flex justify-center gap-3">
        <div className="text-1xl text-orange-700">{discountPercent}%</div>
        <div className={cn('text-1xl', className)}>{formattedPrice}</div>
      </div>
      <div className="text-muted-foreground text-xs py-2">
        List price:{' '}
        <span className="line-through">{`${new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: validatedCurrencyCode,
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(listPrice)}`}</span>
      </div>
    </div>
  )
}

export default ProductPrice
