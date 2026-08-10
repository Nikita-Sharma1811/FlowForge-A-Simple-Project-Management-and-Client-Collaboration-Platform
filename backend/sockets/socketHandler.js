import User from '../models/User.js';

const onlineUsers = new Map(); // userId -> socketId

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // User authentication / online presence
    socket.on('user:online', async (userId) => {
      if (!userId) return;
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);
      try {
        await User.findByIdAndUpdate(userId, { status: 'online', lastActive: new Date() });
        io.emit('user:presence', { userId, status: 'online' });
      } catch (err) {
        console.error('[Socket] Error updating online status:', err.message);
      }
    });

    // Room management
    socket.on('join:project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`[Socket] Socket ${socket.id} joined room project:${projectId}`);
    });

    socket.on('leave:project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`[Socket] Socket ${socket.id} left room project:${projectId}`);
    });

    // Task updates
    socket.on('task:create', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('task:created', data);
      }
    });

    socket.on('task:update', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('task:updated', data);
      }
    });

    socket.on('task:move', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('task:moved', data);
      }
    });

    // Chat events
    socket.on('chat:message', (data) => {
      if (data.project) {
        io.to(`project:${data.project}`).emit('chat:message', data);
      }
    });

    socket.on('chat:typing', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('chat:typing', data);
      }
    });

    socket.on('chat:read', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('chat:read', data);
      }
    });

    // Live timer update
    socket.on('timer:update', (data) => {
      if (data.project) {
        socket.to(`project:${data.project}`).emit('timer:update', data);
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        try {
          await User.findByIdAndUpdate(socket.userId, { status: 'offline', lastActive: new Date() });
          io.emit('user:presence', { userId: socket.userId, status: 'offline' });
        } catch (err) {
          console.error('[Socket] Error updating offline status:', err.message);
        }
      }
    });
  });
};
