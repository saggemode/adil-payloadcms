'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const getActiveFlashSales = async () => {
  const payload = await getPayload({ config: configPromise })
  const now = new Date()

  try {
    const { docs: flashSales } = await payload.find({
      collection: 'flash-sales',
      where: {
        and: [
          { isActive: { equals: true } },
          { startDate: { less_than: now.toISOString() } },
          { endDate: { greater_than: now.toISOString() } },
        ],
      },
      depth: 2,
    })

    return flashSales
  } catch (error) {
    console.error('Error fetching flash sales:', error)
    return []
  }
}

export const getFeaturedFlashSales = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  try {
    const { docs: flashSales } = await payload.find({
      collection: 'flash-sales',
      where: {
        and: [
          { featured: { equals: true } },
          { isActive: { equals: true } },
          { startDate: { less_than: now } },
          { endDate: { greater_than: now } },
        ],
      },
      depth: 2,
    })

    return flashSales
  } catch (error) {
    console.error('Error fetching featured flash sales:', error)
    return []
  }
})

export const getUpcomingFlashSales = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  const now = new Date().toISOString()

  try {
    const { docs: flashSales } = await payload.find({
      collection: 'flash-sales',
      where: {
        and: [
          { status: { equals: 'active' } },
          { isActive: { equals: true } },
          { startDate: { greater_than: now } },
        ],
      },
      depth: 2,
      limit: 5,
      sort: 'startDate',
    })

    return flashSales
  } catch (error) {
    console.error('Error fetching upcoming flash sales:', error)
    return []
  }
})

export async function checkFlashSaleAvailability(saleId: string, quantity: number) {
  const payload = await getPayload({ config: configPromise })

  try {
    const sale = await payload.findByID({
      collection: 'flash-sales',
      id: saleId,
    })

    if (!sale) return { available: false, message: 'Flash sale not found' }

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
      }
    }

    return { available: true }
  } catch (error) {
    console.error('Error checking flash sale availability:', error)
    return { available: false, message: 'Error checking availability' }
  }
}
