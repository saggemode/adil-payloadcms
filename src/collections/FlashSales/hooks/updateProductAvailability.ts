import { CollectionAfterChangeHook } from "payload"

export const updateProductAvailability: CollectionAfterChangeHook = async ({ doc, operation }) => {
  // Update product availability when flash sale status changes
  if (operation === 'update' && doc.products && Array.isArray(doc.products)) {
    const payload = (global as any).payload

    // If flash sale is active, update product availability
    if (doc.status === 'active') {
      await Promise.all(
        doc.products.map(async (productId: string | number) => {
          await payload.update({
            collection: 'products',
            id: productId,
            data: {
              flashSaleId: doc.id,
              flashSaleEndDate: doc.endDate,
              flashSaleDiscount: doc.discountPercent,
            },
          })
        }),
      )
    } else {
      // Remove flash sale data from products
      await Promise.all(
        doc.products.map(async (productId: string | number) => {
          await payload.update({
            collection: 'products',
            id: productId,
            data: {
              flashSaleId: null,
              flashSaleEndDate: null,
              flashSaleDiscount: null,
            },
          })
        }),
      )
    }
  }
} 