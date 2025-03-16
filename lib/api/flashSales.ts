'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const getActiveFlashSales = async () => {
  const payload = await getPayload({ config: configPromise })

  const now = new Date().toISOString()

  return await payload.find({
    collection: 'products',
    where: {
      'flashSale.isFlashSale': { equals: true },
      'flashSale.startTime': { less_than: now },
      'flashSale.endTime': { greater_than: now },
    },
  })
}
