import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function getAllCategories() {
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
  })

  return result
} 