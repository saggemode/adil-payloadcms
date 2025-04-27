import { WebSocketServer as WS, WebSocket as WSClient } from 'ws';
import { Server } from 'http';
import { createServer } from 'http';
import { parse } from 'url';

interface StockUpdate {
  productId: string;
  currentStock: number;
  previousStock: number;
  timestamp: number;
}

// Dummy implementation
const dummyWss = {
  broadcastStockUpdate: (update: StockUpdate) => {
    console.log('[Stub] Would broadcast stock update:', update);
  }
};

export default dummyWss; 