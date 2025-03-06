'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Coupon } from '@/payload-types'

interface ValidateCouponResponse {
  success: boolean
  message: string
  data?: {
    discountPercent: number
    code: string
  }
}

export async function validateCoupon(code: string): Promise<ValidateCouponResponse> {
  try {
    const payload = await getPayload({ config: configPromise })

    const currentDate = new Date()

    // Find the coupon
    const result = await payload.find({
      collection: 'coupons',
      where: {
        code: { equals: code },
      },
    })

    if (!result.docs.length) {
      return {
        success: false,
        message: 'Invalid coupon code',
      }
    }

    const coupon = result.docs[0] as unknown as Coupon

    // Check if coupon has reached usage limit
    if ((coupon?.usageCount || 0) >= (coupon?.usageLimit || 0)) {
      return {
        success: false,
        message: 'Coupon has reached its usage limit',
      }
    }

    return {
      success: true,
      message: 'Coupon applied successfully',
      data: {
        discountPercent: coupon?.discountPercent || 0,
        code: coupon?.code || '',
      },
    }
  } catch (error) {
    console.error('Error validating coupon:', error)
    return {
      success: false,
      message: 'Error validating coupon',
    }
  }
}

export async function applyCoupon(code: string, orderId: string): Promise<boolean> {
  try {
    const payload = await getPayload({ config: configPromise })

    // First, find the coupon
    const couponResult = await payload.find({
      collection: 'coupons',
      where: {
        code: { equals: code },
      },
    })

    if (!couponResult.docs.length) {
      console.error('Coupon not found')
      return false
    }

    const coupon = couponResult.docs[0] as any // or as Coupon

    // Update the coupon document
    try {
      await payload.update({
        collection: 'coupons',
        id: coupon.id,
        data: {
          usageCount: (coupon.usageCount || 0) + 1,
          orders: [
            ...(coupon.orders || []),
            {
              id: parseInt(orderId),
            },
          ],
        },
      })
      return true
    } catch (updateError) {
      console.error('Error updating coupon:', updateError)
      return false
    }
  } catch (error) {
    console.error('Error in applyCoupon:', error)
    return false
  }
}
