import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, Check, CheckCheck } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

export default function ChatDrawer({ projectId, projectName, isOpen, onClose }) {
  const { user } = useAuth();
  const { socket, joinProjectRoom, leaveProjectRoom } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !projectId) return;

    joinProjectRoom(projectId);
    fetchMessages();

    if (socket) {
      const handleChatMessage = (msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      };

      const handleTyping = ({ userId, userName, isTyping }) => {
        if (userId === user?._id) return;
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (isTyping) next.add(userName);
          else next.delete(userName);
          return next;
        });
      };

      socket.on('chat:message', handleChatMessage);
      socket.on('chat:typing', handleTyping);

      return () => {
        socket.off('chat:message', handleChatMessage);
        socket.off('chat:typing', handleTyping);
        leaveProjectRoom(projectId);
      };
    }
  }, [isOpen, projectId, socket]);

  const fetchMessages = async () => {
    try {
      const res = await flowForgeApi.chat.getMessages(projectId);
      setMessages(res.data || []);
      scrollToBottom();
      await flowForgeApi.chat.markRead(projectId);
    } catch (err) {
      console.error('Fetch chat error:', err.message);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (socket && projectId) {
      socket.emit('chat:typing', { projectId, userId: user._id, userName: user.name, isTyping: true });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:typing', { projectId, userId: user._id, userName: user.name, isTyping: false });
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText;
    setInputText('');

    if (socket && projectId) {
      socket.emit('chat:typing', { projectId, userId: user._id, userName: user.name, isTyping: false });
    }

    try {
      const res = await flowForgeApi.chat.sendMessage({ projectId, message: content });
      if (res.data && socket) {
        socket.emit('chat:message', res.data);
      }
      setMessages((prev) => [...prev, res.data]);
      scrollToBottom();
    } catch (err) {
      console.error('Send message error:', err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-blue-500" size={18} />
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{projectName || 'Project Chat'}</h3>
            <span className="text-[10px] text-emerald-400 font-mono">🟢 Live Socket Channel</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800">
          <X size={18} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-10">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
            return (
              <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-slate-400 mb-1 px-1">
                  {msg.sender?.name || 'User'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  {msg.message}
                </div>
                {/* Read receipts */}
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                  {isMe && (
                    <span>
                      {msg.readBy && msg.readBy.length > 1 ? (
                        <CheckCheck size={12} className="text-blue-400 inline" />
                      ) : (
                        <Check size={12} className="text-slate-500 inline" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        {typingUsers.size > 0 && (
          <div className="text-[11px] text-blue-400 italic animate-pulse">
            {Array.from(typingUsers).join(', ')} is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-lg shadow-blue-500/20"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
