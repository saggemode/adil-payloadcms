import { useState } from 'react'

interface CouponState {
  code: string | null
  discountPercent: number
}

export function useCoupon() {
  const [coupon, setCoupon] = useState<CouponState>({
    code: null,
    discountPercent: 0,
  })

  const applyCoupon = (discountPercent: number, code: string) => {
    setCoupon({
      code,
      discountPercent,
    })
  }

  const removeCoupon = () => {
    setCoupon({
      code: null,
      discountPercent: 0,
    })
  }

  const calculateDiscount = (subtotal: number) => {
    if (!coupon.code) return 0
    return (subtotal * coupon.discountPercent) / 100
  }

  return {
    coupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
  }
}
