'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cache } from 'react'
import { FlashSale } from '@/payload-types'

interface FlashSaleResponse {
  success: boolean
  message?: string
  error?: string
  data?: FlashSale
}

interface FlashSalesResponse {
  success: boolean
  message?: string
  error?: string
  data?: FlashSale[]
}

export const getActiveFlashSales = cache(async (): Promise<FlashSalesResponse> => {
  const payload = await getPayload({ config: configPromise })
  const currentDate = new Date()

  try {
    console.log('Fetching active flash sales...')
    const result = await payload.find({
      collection: 'flash-sales',
      where: {
        and: [
          {
            status: {
              in: ['active', 'scheduled'],
            },
          },
          {
            endDate: {
              greater_than_equal: currentDate.toISOString(),
            },
          },
        ],
      },
      sort: '-priority',
      depth: 2,
    })

    console.log('Found flash sales:', result.docs.length)
    return {
      success: true,
      data: result.docs as FlashSale[],
    }
  } catch (error) {
    console.error('Error fetching flash sales:', error)
    return {
      success: false,
      error: 'Failed to fetch flash sales',
    }
  }
})

export const getFlashSaleForProduct = cache(
  async (productId: string): Promise<FlashSaleResponse> => {
    const payload = await getPayload({ config: configPromise })
    const currentDate = new Date()

    try {
      const result = await payload.find({
        collection: 'flash-sales',
        where: {
          and: [
            {
              status: {
                equals: 'active',
              },
            },
            {
              startDate: {
                less_than_equal: currentDate,
              },
            },
            {
              endDate: {
                greater_than_equal: currentDate,
              },
            },
            {
              products: {
                contains: productId,
              },
            },
          ],
        },
        depth: 1,
      })

      if (!result.docs.length) {
        return {
          success: false,
          message: 'No active flash sale for this product',
        }
      }

      return {
        success: true,
        data: result.docs[0] as FlashSale,
      }
    } catch (error) {
      console.error('Error fetching flash sale for product:', error)
      return {
        success: false,
        error: 'Failed to fetch flash sale',
      }
    }
  },
)

export const calculateFlashSalePrice = async (
  originalPrice: number,
  discountPercent: number,
): Promise<number> => {
  return originalPrice - (originalPrice * discountPercent) / 100
}

export const checkFlashSaleAvailability = async (
  saleId: string,
  quantity: number,
): Promise<{
  available: boolean
  message?: string
  remainingQuantity?: number
}> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const sale = await payload.findByID({
      collection: 'flash-sales',
      id: saleId,
    })

    if (!sale) {
      return { available: false, message: 'Flash sale not found' }
    }

    const now = new Date()
    const startDate = new Date(sale.startDate)
    const endDate = new Date(sale.endDate)

    if (now < startDate) {
      return { available: false, message: 'Flash sale has not started yet' }
    }

    if (now > endDate) {
      return { available: false, message: 'Flash sale has ended' }
    }

    if (sale.status !== 'active') {
      return { available: false, message: 'Flash sale is not active' }
    }

    const remainingQuantity = sale.totalQuantity - (sale.soldQuantity ?? 0)
    if (quantity > remainingQuantity) {
      return {
        available: false,
        message: `Only ${remainingQuantity} items available in this flash sale`,
        remainingQuantity,
      }
    }

    return { available: true, remainingQuantity }
  } catch (error) {
    console.error('Error checking flash sale availability:', error)
    return { available: false, message: 'Error checking availability' }
  }
}

export const updateFlashSaleSoldQuantity = async (
  saleId: string,
  quantity: number,
): Promise<boolean> => {
  const payload = await getPayload({ config: configPromise })

  try {
    const sale = await payload.findByID({
      collection: 'flash-sales',
      id: saleId,
    })

    if (!sale) return false

    await payload.update({
      collection: 'flash-sales',
      id: saleId,
      data: {
        soldQuantity: (sale.soldQuantity || 0) + quantity,
      },
    })

    return true
  } catch (error) {
    console.error('Error updating flash sale quantity:', error)
    return false
  }
}

export const getAllFlashSales = cache(async (): Promise<FlashSalesResponse> => {
  const payload = await getPayload({ config: configPromise })

  try {
    console.log('Fetching all flash sales...')
    const result = await payload.find({
      collection: 'flash-sales',
      depth: 2,
    })

    console.log(
      'All flash sales:',
      result.docs.map((sale) => ({
        id: sale.id,
        name: sale.name,
        status: sale.status,
        startDate: sale.startDate,
        endDate: sale.endDate,
      })),
    )

    return {
      success: true,
      data: result.docs as FlashSale[],
    }
  } catch (error) {
    console.error('Error fetching all flash sales:', error)
    return {
      success: false,
      error: 'Failed to fetch flash sales',
    }
  }
})
