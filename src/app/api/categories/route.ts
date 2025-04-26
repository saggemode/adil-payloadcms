import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const depth = Number(url.searchParams.get('depth') || '0');
    const limit = Number(url.searchParams.get('limit') || '20');
    
    const payload = await getPayload({ config: configPromise });
    
    const categories = await payload.find({
      collection: 'categories',
      depth: depth,
      limit: limit,
      pagination: false,
      overrideAccess: false,
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
} 