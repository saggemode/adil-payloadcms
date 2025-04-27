import { useState } from 'react';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Dummy functions that maintain API compatibility
  const joinRoom = (roomId: string) => {
    console.log(`[Socket Stub] Would join room: ${roomId}`);
  };

  const leaveRoom = (roomId: string) => {
    console.log(`[Socket Stub] Would leave room: ${roomId}`);
  };

  const subscribeToEvent = (event: string, callback: (data: any) => void) => {
    console.log(`[Socket Stub] Would subscribe to: ${event}`);
    // No-op
  };

  const unsubscribeFromEvent = (event: string, callback: (data: any) => void) => {
    console.log(`[Socket Stub] Would unsubscribe from: ${event}`);
    // No-op
  };

  return {
    socket: null,
    isConnected,
    joinRoom,
    leaveRoom,
    subscribeToEvent,
    unsubscribeFromEvent,
  };
};