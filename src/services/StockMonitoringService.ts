interface Product {
  id: string;
  name: string;
  currentStock: number;
  lowStockThreshold: number;
}

class StockMonitoringService {
  private products: Map<string, Product> = new Map();

  constructor() {
    // Initialize with some default products or load from database
    this.initializeProducts();
  }

  private initializeProducts() {
    // This would typically load from your database
    // For now, we'll add some sample products
    const sampleProducts: Product[] = [
      { id: '1', name: 'Product 1', currentStock: 100, lowStockThreshold: 10 },
      { id: '2', name: 'Product 2', currentStock: 50, lowStockThreshold: 5 },
      { id: '3', name: 'Product 3', currentStock: 25, lowStockThreshold: 8 },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  public updateStock(productId: string, newStock: number) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const previousStock = product.currentStock;
    product.currentStock = newStock;

    // Instead of broadcasting via WebSocket, we just update local storage
    // and return the updated product
    return product;
  }

  public getProduct(productId: string): Product | undefined {
    return this.products.get(productId);
  }

  public getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  public setLowStockThreshold(productId: string, threshold: number) {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    product.lowStockThreshold = threshold;
    return product;
  }

  public checkLowStock(): Product[] {
    return Array.from(this.products.values()).filter(
      product => product.currentStock <= product.lowStockThreshold
    );
  }
}

// Create and export a singleton instance
const stockMonitoringService = new StockMonitoringService();
export default stockMonitoringService; 