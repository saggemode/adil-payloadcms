import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured') === 'true';
    const limit = Number(url.searchParams.get('limit') || '20');
    const sort = url.searchParams.get('sort') || '-createdAt';
    
    const payload = await getPayload({ config: configPromise });
    
    const filters: Record<string, any> = {
      isPublished: { equals: true },
    };
    
    const products = await payload.find({
      collection: 'products',
      depth: 1,
      limit: limit,
      page: 1,
      overrideAccess: false,
      where: filters,
      sort: sort,
    });
    
    // If featured is true, sort products client-side
    if (featured && products.docs) {
      // For now, consider the top N products as "featured"
      const sortedProducts = [...products.docs].sort((a, b) => {
        // Sort by numSales (descending)
        return (b.numSales || 0) - (a.numSales || 0);
      });
      
      products.docs = sortedProducts.slice(0, limit);
      products.totalDocs = products.docs.length;
    }
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
} 