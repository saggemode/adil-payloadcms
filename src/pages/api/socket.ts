import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";

export default function SocketHandler(req: NextApiRequest, res: any) {
  // Check if Socket.IO server is already initialised
  if (res.socket.server.io) {
    console.log("Socket.IO already running");
  } else {
    console.log("Initializing Socket.IO");
    const io = new Server(res.socket.server);
    
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      socket.on("join-room", (roomId: string) => {
        socket.join(roomId);
        console.log(`Client ${socket.id} joined room: ${roomId}`);
      });
      
      socket.on("leave-room", (roomId: string) => {
        socket.leave(roomId);
        console.log(`Client ${socket.id} left room: ${roomId}`);
      });
      
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
    
    // Store the Socket.IO server instance
    res.socket.server.io = io;
  }
  
  // Send a response to acknowledge the request
  res.status(200).json({ ok: true });
} 