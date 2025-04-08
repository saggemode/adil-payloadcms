'use server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'


interface OrderItem {
  product: string // product ID
  quantity: number
}

export async function updateInventoryAfterPurchase(orderItems: OrderItem[]) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Process each item in the order
    for (const item of orderItems) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.product,
      })

      if (!product) continue

      // Calculate new values
      const newCountInStock = Math.max(0, (product.countInStock || 0) - item.quantity)
      const newNumSales = (product.numSales || 0) + item.quantity

      // Update product with revalidation disabled
      await payload.update({
        collection: 'products',
        id: item.product,
        data: {
          countInStock: newCountInStock,
          numSales: newNumSales,
        },
        context: {
          disableRevalidate: true // Disable revalidation during update
        }
      })
    }

    return true
  } catch (error) {
    console.error('Error updating inventory:', error)
    return false
  }
}
