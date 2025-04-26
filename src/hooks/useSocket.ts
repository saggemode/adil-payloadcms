import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8081';

  useEffect(() => {
    // Socket.IO with serverless functions on Vercel requires external WebSocket server
    const initSocket = async () => {
      try {
        // Connect to external WebSocket server instead of Next.js API route
        socketRef.current = io(wsUrl, {
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current.on('connect', () => {
          console.log('Connected to WebSocket server');
          setIsConnected(true);
        });

        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection error:', err.message);
        });

        socketRef.current.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Failed to connect to WebSocket server:', error);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [wsUrl]);

  const joinRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', roomId);
    }
  };

  const subscribeToEvent = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const unsubscribeFromEvent = (event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    subscribeToEvent,
    unsubscribeFromEvent,
  };
};