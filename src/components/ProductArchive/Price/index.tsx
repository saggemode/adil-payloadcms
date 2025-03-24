'use client'

import { cn } from '@/utilities/ui'

interface ProductPriceProps {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
  currencyCode?: 'NGN' | 'EUR' | 'GBP'
  flashSaleDiscount?: number
}

const CURRENCY_CODES = ['NGN', 'EUR', 'GBP'] as const
const DEFAULT_CURRENCY = 'NGN'

const formatCurrency = (amount: number, currencyCode: string) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const calculateDiscount = (price: number, listPrice: number): number => {
  return listPrice > 0 ? Math.abs(Math.round(100 - (price / listPrice) * 100)) : 0
}

const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
  currencyCode = DEFAULT_CURRENCY,
  flashSaleDiscount,
}) => {
  const validatedCurrency = CURRENCY_CODES.includes(
    currencyCode.toUpperCase() as (typeof CURRENCY_CODES)[number],
  )
    ? currencyCode.toUpperCase()
    : DEFAULT_CURRENCY

  const formattedPrice = formatCurrency(price, validatedCurrency)
  const formattedListPrice = formatCurrency(listPrice, validatedCurrency)
  const discountPercent = calculateDiscount(price, listPrice)

  if (plain) return formattedPrice

  if (listPrice === 0) {
    return <div className={cn('text-3xl', className)}>{formattedPrice}</div>
  }

  if (isDeal) {
    return (
      <div className="space-y-2">
        <DealBadge discount={discountPercent} flashSaleDiscount={flashSaleDiscount} />
        <PriceComparison
          currentPrice={formattedPrice}
          originalPrice={formattedListPrice}
          forListing={forListing}
          className={className}
        />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <RegularPriceDisplay
        currentPrice={formattedPrice}
        originalPrice={formattedListPrice}
        discount={discountPercent}
        className={className}
      />
    </div>
  )
}

const DealBadge: React.FC<{ discount: number; flashSaleDiscount?: number }> = ({
  discount,
  flashSaleDiscount,
}) => (
  <div className="flex justify-center items-center gap-2">
    <span className="bg-red-700 rounded-sm p-1 text-white text-sm font-semibold">
      {discount}% Off
    </span>
    {flashSaleDiscount && (
      <span className="bg-orange-500 rounded-sm p-1 text-white text-sm font-semibold">
        Flash Sale {flashSaleDiscount}%
      </span>
    )}
    <span className="text-red-700 text-xs font-bold">Limited time deal</span>
  </div>
)

interface PriceComparisonProps {
  currentPrice: string
  originalPrice: string
  forListing: boolean
  className?: string
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  currentPrice,
  originalPrice,
  forListing,
  className,
}) => (
  <div className={`flex ${forListing ? 'justify-center' : ''} items-center gap-2`}>
    <div className={cn('text-1xl', className)}>{currentPrice}</div>
    <div className="text-muted-foreground text-xs py-2">
      Was: <span className="line-through">{originalPrice}</span>
    </div>
  </div>
)

interface RegularPriceDisplayProps {
  currentPrice: string
  originalPrice: string
  discount: number
  className?: string
}

const RegularPriceDisplay: React.FC<RegularPriceDisplayProps> = ({
  currentPrice,
  originalPrice,
  discount,
  className,
}) => (
  <>
    <div className="flex justify-center gap-3">
      <div className="text-1xl text-orange-700">{discount}%</div>
      <div className={cn('text-1xl', className)}>{currentPrice}</div>
    </div>
    <div className="text-muted-foreground text-xs py-2">
      List price: <span className="line-through">{originalPrice}</span>
    </div>
  </>
)

export default ProductPrice
