import React from 'react'
import { useWebSocket } from '../WebSocketProvider'
import { Bell } from 'lucide-react'

export const RealTimeNotifications: React.FC = () => {
  const { notifications, isConnected } = useWebSocket()

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-800'
      case 'stock':
        return 'bg-red-100 text-red-800'
      case 'sale':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 mb-2">
        <Bell className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
        <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      <div className="space-y-2">
        {notifications.slice(0, 5).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg shadow-lg ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{notification.message}</p>
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
