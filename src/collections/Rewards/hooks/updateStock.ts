import { CollectionBeforeChangeHook } from "payload"

export const updateStock: CollectionBeforeChangeHook = async ({ data, req }) => {
  console.log('UpdateStock Hook - Initial data:', data)
  
  if (data.linkedProduct) {
    console.log('UpdateStock Hook - Found linkedProduct:', data.linkedProduct)
    
    const product = await req.payload.findByID({
      collection: 'products',
      id: data.linkedProduct,
    })
    
    console.log('UpdateStock Hook - Fetched product:', product)
    
    if (product) {
      console.log('UpdateStock Hook - Product countInStock:', product.countInStock)
      data.stock = product.countInStock
      console.log('UpdateStock Hook - Updated data.stock:', data.stock)
    }
  } else {
    console.log('UpdateStock Hook - No linkedProduct found in data')
  }
  
  console.log('UpdateStock Hook - Final data:', data)
  return data
} 