import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

declare module 'next' {
  interface NextApiResponse {
    socket: {
      server: NetServer & {
        io?: SocketIOServer;
      };
    };
  }
} 