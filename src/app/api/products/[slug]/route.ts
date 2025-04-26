import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

/**
 * GET request handler for product by slug
 */
export async function GET(
  request: Request,
  context: { params: { slug: string } }
) {
  const slug = context.params.slug;
  
  if (!slug) {
    return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
  }
  
  try {
    const payload = await getPayload({ config: configPromise });
    
    const result = await payload.find({
      collection: 'products',
      depth: 2,
      limit: 1,
      pagination: false,
      overrideAccess: false,
      where: {
        slug: {
          equals: slug,
        },
        isPublished: {
          equals: true,
        },
      },
    });
    
    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.docs[0]);
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
} 