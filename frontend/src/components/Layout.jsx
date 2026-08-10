import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Kanban,
  Layers,
  CalendarCheck,
  ShieldAlert,
  AlertTriangle,
  Building,
  BookOpen,
  BarChart3,
  Flame,
  PieChart,
  UserCog,
  Bell,
  MessageSquare,
  Search,
  LogOut,
  User,
  Plus,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { flowForgeApi } from '../services/api';
import TimerWidget from './TimerWidget';
import ChatDrawer from './ChatDrawer';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTimer, setActiveTimer] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (user) {
      fetchActiveTimer();
      fetchNotificationsCount();
    }
  }, [user?._id]);

  const fetchActiveTimer = async () => {
    try {
      const res = await flowForgeApi.time.getActiveTimer();
      setActiveTimer(res.data);
    } catch (err) {
      // ignore
    }
  };

  const fetchNotificationsCount = async () => {
    try {
      const res = await flowForgeApi.notifications.list();
      setUnreadNotifications(res.unreadCount || 0);
    } catch (err) {
      // ignore
    }
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Focus Mode', path: '/dashboard/focus', icon: Flame, highlight: true },
    { label: 'Projects', path: '/dashboard/projects', icon: FolderKanban },
    { label: 'Kanban Board', path: '/dashboard/kanban', icon: Kanban },
    { label: 'Backlog & Sprints', path: '/dashboard/sprints', icon: Layers },
    { label: 'Daily Stand-up', path: '/dashboard/standup', icon: CalendarCheck },
    { label: 'Blockers', path: '/dashboard/blockers', icon: ShieldAlert },
    { label: 'Risks', path: '/dashboard/risks', icon: AlertTriangle },
    { label: 'Client Portal', path: '/dashboard/client', icon: Building },
    { label: 'Decision Log', path: '/dashboard/decisions', icon: BookOpen },
    { label: 'Workload & Warnings', path: '/dashboard/workload', icon: BarChart3 },
    { label: 'Reports', path: '/dashboard/reports', icon: PieChart },
  ];

  if (user?.role === 'Admin') {
    navLinks.push({ label: 'Admin Panel', path: '/dashboard/admin', icon: UserCog });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Sidebar */}
      <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between flex-shrink-0 backdrop-blur-xl z-20">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
              F
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                FlowForge
                <span className="text-[9px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded uppercase font-bold">
                  SaaS
                </span>
              </h1>
              <span className="text-[10px] text-slate-400 block font-medium">Agile Collaboration Engine</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                      : item.highlight
                      ? 'text-amber-400 hover:bg-amber-500/10 border border-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>
              <div className="truncate max-w-[110px]">
                <h4 className="font-semibold text-xs text-slate-200 truncate">{user?.name || 'User'}</h4>
                <span className="text-[10px] text-blue-400 font-medium block truncate">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search projects, tasks, or members..."
                className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Active Live Timer */}
            <TimerWidget activeTimer={activeTimer} onTimerStopped={fetchActiveTimer} />

            {/* Chat Drawer Toggle */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors relative"
              title="Project Chat"
            >
              <MessageSquare size={16} />
            </button>

            {/* Notifications Toggle */}
            <Link
              to="/dashboard/notifications"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell size={16} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">{children}</main>

        {/* Project Group Chat Drawer */}
        <ChatDrawer
          projectId={currentProject?._id}
          projectName={currentProject?.name}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </div>
    </div>
  );
}
