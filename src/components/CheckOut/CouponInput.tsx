'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { validateCoupon } from '@/actions/couponAction'
import { toast } from '@/hooks/use-toast'

interface CouponInputProps {
  onApplyCoupon: (discountPercent: number, code: string) => void
  disabled?: boolean
}

export default function CouponInput({ onApplyCoupon, disabled = false }: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('')
  const [isValidating, setIsValidating] = useState(false)


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a coupon code',
        variant: 'destructive',
      })
      return
    }

    setIsValidating(true)
    try {
      const result = await validateCoupon(couponCode)

      if (result.success && result.data) {
        onApplyCoupon(result.data.discountPercent, result.data.code)
        toast({
          title: 'Success',
          description: result.message,
        })
        setCouponCode('')
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate coupon',
        variant: 'destructive',
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">Have a coupon code?</label>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="uppercase"
          disabled={disabled || isValidating}
        />
        <Button
          onClick={handleApplyCoupon}
          disabled={disabled || isValidating || !couponCode.trim()}
        >
          {isValidating ? 'Validating...' : 'Apply'}
        </Button>
      </div>
    </div>
  )
}
