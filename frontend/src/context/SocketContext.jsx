import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('[SocketContext] Connected to Socket.IO server:', newSocket.id);
      newSocket.emit('user:online', user._id);
    });

    newSocket.on('user:presence', ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (status === 'online') updated.add(userId);
        else updated.delete(userId);
        return updated;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  const joinProjectRoom = (projectId) => {
    if (socket && projectId) {
      socket.emit('join:project', projectId);
    }
  };

  const leaveProjectRoom = (projectId) => {
    if (socket && projectId) {
      socket.emit('leave:project', projectId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        notifications,
        joinProjectRoom,
        leaveProjectRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
