import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoriesParam = request.nextUrl.searchParams.get('categories')

  if (!productIdsParam || !categoriesParam) {
    return NextResponse.json([])
  }

  const productIds = productIdsParam.split(',')
  const categories = categoriesParam.split(',')

  // Initialize Payload client
  const payload = await getPayload({ config: configPromise })

  let products

  if (listType === 'history') {
    // Fetch products by IDs
    const { docs } = await payload.find({
      collection: 'products', // Replace with your collection name
      where: {
        id: { in: productIds }, // Filter by product IDs
      },
    })

    // Sort products based on the order of IDs in the request
    //products = productIds.map((id) => docs.find((product) => product.id === id)).filter(Boolean) // Remove undefined values
    products = productIds
      .map((id) => docs.find((product) => product.id === Number(id)))
      .filter(Boolean)
  } else {
    // Fetch products by categories and exclude products with IDs in the list
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        categories: { in: categories }, // Changed from category to categories
        ...(productIds.length > 0 && {
          id: { not_in: productIds },
        }),
      },
      limit: 4,
    })

    products = docs
  }

  return NextResponse.json(products)
}
