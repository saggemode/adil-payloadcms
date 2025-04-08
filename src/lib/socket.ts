import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import { NextApiResponse } from 'next';

let io: SocketIOServer | null = null;

export const initSocket = () => {
  if (!io) {
    const httpServer = createServer();
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room: ${roomId}`);
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
        console.log(`Client ${socket.id} left room: ${roomId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    httpServer.listen(3001, () => {
      console.log('Socket.IO server running on port 3001');
    });
  }
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO server not initialized');
  }
  return io;
};

export const emitNotification = (event: string, data: any) => {
  const io = getIO();
  io.emit(event, data);
}; 