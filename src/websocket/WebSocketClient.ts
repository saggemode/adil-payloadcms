// Define the notification type
type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface StockUpdate {
  productId: string;
  currentStock: number;
  previousStock: number;
  timestamp: number;
}

interface NotificationCallback {
  (notification: { type: NotificationType; message: string }): void;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private stockThreshold = 10; // Default low stock threshold
  private notificationCallback: NotificationCallback | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081';
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.subscribeToStockUpdates();
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'stock_update') {
          this.handleStockUpdate(message.data);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  private subscribeToStockUpdates() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe_stock'
      }));
    }
  }

  private handleStockUpdate(update: StockUpdate) {
    const { currentStock, previousStock, productId } = update;
    const stockChange = currentStock - previousStock;
    
    // Determine notification type based on stock change
    let notificationType: NotificationType = 'info';
    let message = '';

    if (currentStock <= this.stockThreshold) {
      notificationType = 'warning';
      message = `Low stock alert: Product ${productId} has ${currentStock} units remaining`;
    } else if (stockChange < 0) {
      notificationType = 'info';
      message = `Stock updated: Product ${productId} stock decreased by ${Math.abs(stockChange)} units`;
    } else if (stockChange > 0) {
      notificationType = 'info';
      message = `Stock updated: Product ${productId} stock increased by ${stockChange} units`;
    }

    // Add notification if there's a message and callback is set
    if (message && this.notificationCallback) {
      this.notificationCallback({
        type: notificationType,
        message
      });
    }
  }

  public setStockThreshold(threshold: number) {
    this.stockThreshold = threshold;
  }

  public setNotificationCallback(callback: NotificationCallback | null) {
    this.notificationCallback = callback;
  }
}

// Create and export a singleton instance
const wsClient = new WebSocketClient();
export default wsClient; 