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
  private isEnabled = true;
  private isClient = false;

  constructor() {
    // Check if we're in client-side environment
    if (typeof window !== 'undefined') {
      this.isClient = true;
      // Delay connection to ensure it happens after hydration
      setTimeout(() => this.connect(), 1000);
    }
  }

  private connect() {
    if (!this.isClient || !this.isEnabled) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.subscribeToStockUpdates();
      };

      this.ws.onclose = () => {
        if (this.isEnabled) {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        }
      };

      this.ws.onerror = () => {
        // Silent error handling - just disable further connection attempts
        // after max reconnect attempts to prevent console flooding
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.isEnabled = false;
        }
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
    } catch (error) {
      // Silent error handling for initialization errors
      this.isEnabled = false;
    }
  }

  private handleReconnect() {
    if (!this.isEnabled) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.isEnabled) {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          this.connect();
        }
      }, this.reconnectTimeout * this.reconnectAttempts);
    } else {
      // Disable WebSocket after max reconnection attempts
      this.isEnabled = false;
      console.log('Max reconnection attempts reached. WebSocket disabled.');
    }
  }

  private subscribeToStockUpdates() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          type: 'subscribe_stock'
        }));
      } catch (error) {
        // Silent error handling
      }
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

  // Enable WebSocket connection (for reconnecting after it was disabled)
  public enable() {
    if (!this.isEnabled) {
      this.isEnabled = true;
      this.reconnectAttempts = 0;
      this.connect();
    }
  }
}

// Create and export a singleton instance
const wsClient = new WebSocketClient();
export default wsClient; 