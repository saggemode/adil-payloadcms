import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/providers/Auth'

interface WebSocketContextType {
  socket: Socket | null
  isConnected: boolean
  notifications: Notification[]
}

interface Notification {
  id: string
  type: 'order' | 'stock' | 'sale'
  message: string
  timestamp: Date
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  notifications: [],
})

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
      transports: ['websocket'],
      auth: {
        token: user.token,
      },
    })

    socketInstance.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('authenticated', (response) => {
      if (response.success) {
        console.log('WebSocket authenticated')
      }
    })

    // Listen for notifications
    socketInstance.on('new_order', (data) => {
      setNotifications((prev) => [
        {
          id: data.orderId,
          type: 'order',
          message: `New order received: ${data.orderNumber}`,
          timestamp: new Date(),
        },
        ...prev,
      ])
    })

    socketInstance.on('low_stock', (data) => {
      setNotifications((prev) => [
        {
          id: data.productId,
          type: 'stock',
          message: `Low stock alert: ${data.productName} (${data.quantity} remaining)`,
          timestamp: new Date(),
        },
        ...prev,
      ])
    })

    socketInstance.on('new_sale', (data) => {
      setNotifications((prev) => [
        {
          id: data.saleId,
          type: 'sale',
          message: `New sale: ${data.amount} for ${data.productName}`,
          timestamp: new Date(),
        },
        ...prev,
      ])
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [user])

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, notifications }}>
      {children}
    </WebSocketContext.Provider>
  )
}
