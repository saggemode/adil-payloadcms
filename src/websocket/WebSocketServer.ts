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

class WebSocketServer {
  private wss: WS;
  private clients: Set<WSClient> = new Set();

  constructor(server: Server) {
    this.wss = new WS({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WSClient, req) => {
     // const { query } = parse(req.url!, true);
      
      // Add client to the set
      this.clients.add(ws);

      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(ws);
      });

      // Handle incoming messages
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          // Handle different message types here
          if (data.type === 'subscribe_stock') {
            // Handle stock subscription
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });
    });
  }

  // Broadcast stock updates to all connected clients
  public broadcastStockUpdate(update: StockUpdate) {
    const message = JSON.stringify({
      type: 'stock_update',
      data: update
    });

    this.clients.forEach(client => {
      if (client.readyState === WSClient.OPEN) {
        client.send(message);
      }
    });
  }
}

// Only run server-side code on the server
let wss: WebSocketServer | null = null;

if (typeof window === 'undefined') {
  try {
    // Create HTTP server
    const server = createServer();
    wss = new WebSocketServer(server);

    // Start the server
    const PORT = process.env.WS_PORT || 8081;
    server.listen(PORT, () => {
      console.log(`WebSocket server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting WebSocket server:', error);
  }
}

// Export a dummy object for client-side
const dummyWss = {
  broadcastStockUpdate: () => {}
};

export default typeof window === 'undefined' ? (wss || dummyWss) : dummyWss; 