import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import wsClient from '@/websocket/WebSocketClient';

export const useStockNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Set up the notification callback
    wsClient.setNotificationCallback((notification) => {
      addNotification(notification);
    });

    // Clean up when component unmounts
    return () => {
      wsClient.setNotificationCallback(null);
    };
  }, [addNotification]);

  return {
    setStockThreshold: wsClient.setStockThreshold.bind(wsClient)
  };
}; 