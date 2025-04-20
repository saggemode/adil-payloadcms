import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import wsClient from '@/websocket/WebSocketClient';

export const useStockNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Only run if we're in the browser environment
    if (typeof window === 'undefined') return;

    try {
      // Set up the notification callback
      wsClient.setNotificationCallback((notification) => {
        addNotification(notification);
      });

      // Clean up when component unmounts
      return () => {
        try {
          wsClient.setNotificationCallback(null);
        } catch (error) {
          // Silent error handling
        }
      };
    } catch (error) {
      // Silent error handling for WebSocket issues
      console.log('WebSocket notifications unavailable');
    }
  }, [addNotification]);

  return {
    setStockThreshold: (threshold: number) => {
      try {
        wsClient.setStockThreshold(threshold);
      } catch (error) {
        // Silent error handling
      }
    },
    enableWebSocket: () => {
      try {
        wsClient.enable();
      } catch (error) {
        // Silent error handling
      }
    }
  };
}; 