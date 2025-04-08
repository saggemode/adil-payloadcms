
import stockMonitoringService from '@/services/StockMonitoringService';
import { CollectionBeforeChangeHook } from 'payload';

export const monitorStock: CollectionBeforeChangeHook = async ({ 
  operation, 
  data, 
  originalDoc 
}) => {
  if (operation === 'update' && data.countInStock !== undefined) {
    const productId = originalDoc.id;
    const previousStock = originalDoc.countInStock;
    const newStock = data.countInStock;

    // Update stock in monitoring service
    stockMonitoringService.updateStock(productId, newStock);
  }

  return data;
}; 