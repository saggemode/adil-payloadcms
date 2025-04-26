import { Payload } from 'payload';
import { generateBatchBarcodes } from './batchBarcodeGenerator';

type ProductData = Record<string, any>;

/**
 * Import products in bulk with automatically generated barcodes
 * @param payload Payload instance
 * @param products Array of product data without barcodes
 * @returns Array of created products with barcodes
 */
export const bulkImportProducts = async (
  payload: Payload,
  products: ProductData[],
) => {
  try {
    // Generate unique barcodes for all products
    const barcodes = generateBatchBarcodes(products.length);
    
    // Assign barcodes to products that don't have one
    const productsWithBarcodes = products.map((product, index) => ({
      ...product,
      barcode: product.barcode || barcodes[index],
      // Add required fields with default values if not present
      numSales: product.numSales || 0,
      avgRating: product.avgRating || 0,
      numReviews: product.numReviews || 0,
      content: product.content || [],
      ratingDistribution: product.ratingDistribution || [],
      isPublished: product.isPublished || false,
    }));
    
    // Create products in batches to avoid rate limits or timeouts
    const batchSize = 10;
    const results = [];
    
    for (let i = 0; i < productsWithBarcodes.length; i += batchSize) {
      const batch = productsWithBarcodes.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchResults = await Promise.all(
        batch.map(productData => 
          payload.create({
            collection: 'products',
            data: productData as any, // Use type assertion to bypass strict typing
          })
        )
      );
      
      results.push(...batchResults);
    }
    
    return results;
  } catch (error) {
    console.error('Error in bulk import:', error);
    throw error;
  }
};

/**
 * Parse CSV data into product objects
 * @param csvText CSV text content
 * @returns Array of product data objects
 */
export const parseProductCSV = (csvText: string): ProductData[] => {
  // Split CSV into lines
  const lines = csvText.split('\n');
  
  if (!lines.length || !lines[0]) {
    return [];
  }
  
  // Extract headers
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Process data rows
  return lines.slice(1)
    .filter(line => line.trim()) // Skip empty lines
    .map(line => {
      const values = line.split(',').map(val => val.trim());
      
      // Create object with headers as keys
      const product = headers.reduce((obj, header, index) => {
        // Handle special cases for numeric fields
        if (['price', 'listPrice', 'countInStock'].includes(header)) {
          obj[header] = parseFloat(values[index] || '0') || 0;
        } else {
          obj[header] = values[index] || '';
        }
        return obj;
      }, {} as ProductData);
      
      return product;
    });
}; 