import { io, Socket } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null
  private static instance: WebSocketService
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 3000

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  connect() {
    if (this.socket?.connected) return

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectTimeout,
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      this.handleReconnect()
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect()
      }, this.reconnectTimeout)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  subscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.error('WebSocket not connected')
      return
    }

    this.socket.on(event, callback)
  }

  unsubscribe(event: string, callback: (data: any) => void) {
    if (!this.socket) return
    this.socket.off(event, callback)
  }

  emit(event: string, data: any) {
    if (!this.socket) {
      console.error('WebSocket not connected')
      return
    }

    this.socket.emit(event, data)
  }
}

export const websocketService = WebSocketService.getInstance()
