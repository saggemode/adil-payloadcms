import { Endpoint } from 'payload';
import { generateBatchBarcodes } from '../../utilities/batchBarcodeGenerator';

/**
 * Generate a batch of unique barcodes for bulk product imports
 * POST /api/generate-barcodes
 * Body: { count: number, options?: { prefix?: string, type?: 'UPC-A' | 'EAN-13' } }
 */
export const generateBarcodes: Endpoint = {
  path: '/generate-barcodes',
  method: 'post',
  handler: async (req) => {
    try {
      // Get request body data
      if (!req.json) {
        return Response.json({
          success: false,
          error: 'Invalid request format',
        }, { status: 400 });
      }
      
      const data = await req.json();
      const { count = 1, options } = data;
      
      // Validate input
      if (typeof count !== 'number' || count < 1 || count > 1000) {
        return Response.json({
          success: false,
          error: 'Invalid count. Must be a number between 1 and 1000.',
        }, { status: 400 });
      }
      
      // Generate barcodes
      const barcodes = generateBatchBarcodes(count, options);
      
      // Return barcodes
      return Response.json({
        success: true,
        count: barcodes.length,
        barcodes,
      });
    } catch (error) {
      console.error('Error generating barcodes:', error);
      return Response.json({
        success: false,
        message: 'Error generating barcodes',
      }, { status: 500 });
    }
  },
}; 