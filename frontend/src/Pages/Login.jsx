import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { flowForgeApi } from '../services/api';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await flowForgeApi.auth.login({ email, password });
      if (res.status && res.data) {
        login(res.data, res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/20">
            F
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome back to FlowForge</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your real-time agile workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Accounts Helper */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center uppercase tracking-wider">
            Quick Fill Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              onClick={() => fillQuickDemo('admin@flowforge.com')}
              className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 font-medium truncate"
            >
              👑 Admin
            </button>
            <button
              onClick={() => fillQuickDemo('pm@flowforge.com')}
              className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 font-medium truncate"
            >
              📊 PM
            </button>
            <button
              onClick={() => fillQuickDemo('dev@flowforge.com')}
              className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 font-medium truncate"
            >
              💻 Dev Member
            </button>
            <button
              onClick={() => fillQuickDemo('client@acme.com')}
              className="p-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-slate-300 font-medium truncate"
            >
              🏢 Client
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
