interface StockUpdate {
  productId: string;
  currentStock: number;
  previousStock: number;
  timestamp: number;
}

// Minimal implementation without notifications
class WebSocketClient {
  private stockThreshold = 10;
  
  constructor() {
    console.log('[Stub] WebSocketClient initialized');
  }

  public setStockThreshold(threshold: number) {
    this.stockThreshold = threshold;
  }

  public enable() {
    console.log('[Stub] WebSocketClient enabled');
  }
}

// Create and export a singleton instance
const wsClient = new WebSocketClient();
export default wsClient; 