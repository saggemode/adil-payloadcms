'use client'

import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductPrice from '@/components/ProductArchive/Price'

interface CouponSummaryProps {
  code: string
  discountAmount: number
  onRemove: () => void
}

export default function CouponSummary({ code, discountAmount, onRemove }: CouponSummaryProps) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Coupon applied:</span>
          <span className="text-sm font-medium uppercase">{code}</span>
          <Button variant="ghost" size="sm" className="h-6 px-2" onClick={onRemove}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          - <ProductPrice price={discountAmount} plain />
        </span>
      </div>
      <div className="text-xs text-gray-500">Discount will be applied to eligible items</div>
    </div>
  )
}
