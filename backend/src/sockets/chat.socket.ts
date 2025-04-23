import { Server, Socket } from 'socket.io';
import { Chat } from '../models/chat.model';

const setupChatSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    socket.on('join room', (data) => {
      socket.join(data.room)
      console.log(`${data.username} has joined the ${data.room}`)
      io.to(data.room).emit('newMessage', {
        username: 'System',
        message: `${data.username} joined to ${data.room}`,
        room: data.room
      })
    })

    socket.on('leave room', (data) => {
      socket.leave(data.room)
      console.log(`${data.username} left ${data.room}`)
      io.to(data.room).emit('newMessage', {
        username: 'System',
        message: `${data.username} has left chat.`,
        room: data.room
      })
    })

    // Listen to 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { username, message, room } = data;

      try {
        // Save message to MongoDB
        const chat = new Chat({ username, message, room });
        await chat.save();

        // Broadcast the chat object to all connected clients via the newMessage event
        // io.emit('newMessage', chat);

        // For room-based broadcast
        io.to(data.room).emit('newMessage', chat)
      } catch (error) {
        console.error('Error saving chat:', error);
      }
    });

    // On disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default setupChatSocket;