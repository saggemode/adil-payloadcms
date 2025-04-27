import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    const listType = request.nextUrl.searchParams.get('type') || 'history'
    const productIdsParam = request.nextUrl.searchParams.get('ids')
    const categoriesParam = request.nextUrl.searchParams.get('categories')

    if (!productIdsParam || !categoriesParam) {
      return NextResponse.json([])
    }

    const productIds = productIdsParam.split(',').filter(Boolean)
    const categories = categoriesParam.split(',').filter(Boolean)

    // Initialize Payload client
    const payload = await getPayload({ config: configPromise })

    let products = []

    if (listType === 'history') {
      // Fetch products by IDs
      const { docs } = await payload.find({
        collection: 'products',
        where: {
          id: { in: productIds.map(id => String(id)) },
        },
      })

      // Sort products based on the order of IDs in the request
      products = productIds
        .map(id => docs.find(product => String(product.id) === String(id)))
        .filter(Boolean)
    } else {
      // Fetch products by categories and exclude products with IDs in the list
      const { docs } = await payload.find({
        collection: 'products',
        where: {
          categories: { in: categories },
          ...(productIds.length > 0 && {
            id: { not_in: productIds.map(id => String(id)) },
          }),
        },
        limit: 4,
      })

      products = docs
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error in browsing history API:', error)
    return NextResponse.json([], { status: 500 })
  }
}
