import { getPayload } from 'payload';
import configPromise from '@payload-config';

export const getTrendingProducts = async ({ limit = 4 }: { limit?: number } = {}) => {
  const payload = await getPayload({ config: configPromise });

  // Trending products are now determined based on actual sales data (numSales)
  // which is a more accurate representation of product popularity and demand

  try {
    const result = await payload.find({
      collection: 'products',
      depth: 1,
      limit,
      where: {
        _status: {
          equals: 'published',
        },
        // Only consider products with sales
        numSales: {
          greater_than: 0,
        },
      },
      sort: '-numSales', // Sort by number of sales (highest to lowest)
    });

    // Add trending metadata to each product
    // Using actual sales data to determine trending rank
    const productsWithTrendingData = result.docs.map((product, index) => {
      return {
        ...product,
        trending: true,
        trendingRank: index + 1, // Rank 1-4, with 1 being most trending (highest sales)
        // Adding a trend indicator based on sales volume
        trendIndicator: product.numSales > 100 ? 'hot' : 
                       product.numSales > 50 ? 'rising' : 
                       'steady',
      };
    });

    return {
      ...result,
      docs: productsWithTrendingData,
    };
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null };
  }
}; 