import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const threshold = url.searchParams.get('threshold') || '20'
    const category = url.searchParams.get('category')
    
    const payload = await getPayload({ config: configPromise })
    
    // Build query for products with stock below threshold
    const query: any = {
      stockQuantity: {
        less_than: parseInt(threshold),
      },
    }
    
    // Add category filter if provided
    if (category) {
      query.categories = {
        contains: category,
      }
    }
    
    const products = await payload.find({
      collection: 'products',
      where: query,
      limit: 50,
      sort: 'stockQuantity',
      depth: 1,
    })
    
    return NextResponse.json({
      success: true,
      data: products.docs,
      totalItems: products.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching low stock items:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch low stock items',
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { productId, stockChange, reason } = await req.json()
    
    if (!productId || stockChange === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and stock change are required',
      }, { status: 400 })
    }
    
    // Get current product data
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
    })
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
      }, { status: 404 })
    }
    
    // Calculate new stock quantity
    const currentStock = (product as any).stockQuantity || 0
    const newStock = Math.max(0, currentStock + stockChange)
    
    // Update product stock
    const updatedProduct = await payload.update({
      collection: 'products',
      id: productId,
      data: {
        stockQuantity: newStock,
      } as any,
    })
    
    // Log stock change
    await payload.create({
      collection: 'inventory-logs' as any,
      data: {
        product: productId,
        previousQuantity: currentStock,
        newQuantity: newStock,
        change: stockChange,
        reason: reason || 'Manual adjustment',
        timestamp: new Date().toISOString(),
      } as any,
    })
    
    return NextResponse.json({
      success: true,
      data: {
        product: updatedProduct,
        previousStock: currentStock,
        newStock,
      },
    })
  } catch (error) {
    console.error('Error updating inventory:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update inventory',
    }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { threshold, productId } = await req.json()
    
    if (!productId || threshold === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Product ID and threshold are required',
      }, { status: 400 })
    }
    
    // Update product threshold settings
    const updatedProduct = await payload.update({
      collection: 'products',
      id: productId,
      data: {
        lowStockThreshold: threshold,
      } as any,
    })
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
    })
  } catch (error) {
    console.error('Error updating threshold:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update threshold settings',
    }, { status: 500 })
  }
} 