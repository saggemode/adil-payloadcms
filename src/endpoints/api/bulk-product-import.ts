import { Endpoint } from 'payload';
import { bulkImportProducts, parseProductCSV } from '../../utilities/bulkProductImport';

/**
 * Bulk import products with automatic barcode generation
 * POST /api/bulk-product-import
 * Body: FormData with 'file' field containing CSV file
 */
export const bulkProductImport: Endpoint = {
  path: '/bulk-product-import',
  method: 'post',
  handler: async (req) => {
    try {
      // We need to check if the user is logged in
      const { user } = req;
      if (!user) {
        return Response.json({
          success: false,
          error: 'Unauthorized - you must be logged in',
        }, { status: 401 });
      }

      // Check if formData method is available
      if (!req.formData) {
        return Response.json({
          success: false,
          error: 'FormData not supported in this environment',
        }, { status: 400 });
      }

      // Parse formData to get the file
      const formData = await req.formData();
      const file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        return Response.json({
          success: false,
          error: 'No file uploaded or invalid file',
        }, { status: 400 });
      }
      
      // Read the file content
      const csvText = await file.text();
      
      // Parse CSV to get product data
      const products = parseProductCSV(csvText);
      
      if (!products.length) {
        return Response.json({
          success: false,
          error: 'No valid products found in the CSV',
        }, { status: 400 });
      }
      
      // Import products with barcodes
      const results = await bulkImportProducts(req.payload, products);
      
      return Response.json({
        success: true,
        message: `Successfully imported ${results.length} products`,
        count: results.length,
        products: results.map(product => ({
          id: product.id,
          title: product.title,
          barcode: product.barcode,
        })),
      });
    } catch (error) {
      console.error('Error in bulk product import:', error);
      return Response.json({
        success: false,
        message: 'Error importing products',
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  },
}; 