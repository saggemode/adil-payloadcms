import { Endpoint } from 'payload';
import { getBarcodeInfo } from '../../utilities/barcodeUtils';

/**
 * Endpoint to lookup product by barcode
 * GET /api/barcode-lookup?barcode=123456789012
 */
export const barcodeLookup: Endpoint = {
  path: '/barcode-lookup',
  method: 'get',
  handler: (req) => {
    const { barcode } = req.query;
    
    if (!barcode || typeof barcode !== 'string') {
      return Response.json({
        success: false,
        error: 'Missing or invalid barcode parameter',
      }, { status: 400 });
    }
    
    try {
      // Get barcode information
      const barcodeInfo = getBarcodeInfo(barcode);
      
      // Find product with this barcode
      const { payload } = req;
      return payload.find({
        collection: 'products',
        where: {
          barcode: {
            equals: barcode,
          },
        },
        limit: 1,
      }).then((product) => {
        if (product.docs.length > 0) {
          // Product found
          return Response.json({
            success: true,
            product: product.docs[0],
            barcodeInfo,
          });
        } else {
          // No product found, but barcode might be valid
          return Response.json({
            success: false,
            message: 'No product found with this barcode',
            barcodeInfo,
          }, { status: 404 });
        }
      }).catch((error) => {
        console.error('Error looking up barcode:', error);
        return Response.json({
          success: false,
          message: 'Internal server error',
        }, { status: 500 });
      });
    } catch (error) {
      console.error('Error looking up barcode:', error);
      return Response.json({
        success: false,
        message: 'Internal server error',
      }, { status: 500 });
    }
  },
}; 