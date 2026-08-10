import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { flowForgeApi } from '../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.notifications.list();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Fetch notifications error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await flowForgeApi.notifications.markRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      alert(`Mark read error: ${err.message}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await flowForgeApi.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      alert(`Mark all read error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="text-blue-500" size={24} />
            Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">Activity logs, task assignments, and real-time project alerts</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
        >
          <CheckCheck size={14} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 text-xs">
          No notifications in your history yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                n.isRead
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-70'
                  : 'bg-slate-900 border-blue-500/30 shadow-lg'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    n.isRead ? 'bg-slate-800 text-slate-500' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  <Bell size={16} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs text-slate-100">{n.title}</h4>
                  <p className="text-xs text-slate-400">{n.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-lg text-xs font-semibold transition-all flex-shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
