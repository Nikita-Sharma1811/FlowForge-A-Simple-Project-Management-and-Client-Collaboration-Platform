import React, { useState, useEffect } from 'react';
import { UserCog, Users, Building, ShieldCheck, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { flowForgeApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedingStatus, setSeedingStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.users.list();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Fetch users error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await flowForgeApi.users.updateRole({ userId, role });
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role } : u)));
    } catch (err) {
      alert(`Update role error: ${err.message}`);
    }
  };

  const handleTriggerSeed = async () => {
    try {
      setSeedingStatus('Seeding database...');
      const res = await flowForgeApi.seed.run();
      setSeedingStatus(res.message || 'Database re-seeded successfully!');
      fetchUsers();
      setTimeout(() => setSeedingStatus(''), 4000);
    } catch (err) {
      alert(`Seed failed: ${err.message}`);
      setSeedingStatus('');
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl text-slate-400 text-sm">
        Access Denied. Only system Admins can view the Organization Admin Panel.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <UserCog className="text-rose-500" size={24} />
            Organization & User Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage team members, roles, organization settings, and demo seed data</p>
        </div>

        <button
          onClick={handleTriggerSeed}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/30"
        >
          <RefreshCw size={14} />
          <span>Reset & Seed Demo Data</span>
        </button>
      </div>

      {seedingStatus && (
        <div className="p-4 bg-purple-500/20 border border-purple-500/40 rounded-2xl text-purple-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{seedingStatus}</span>
        </div>
      )}

      {/* User Management Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Users size={16} className="text-blue-400" />
          Organization Members ({users.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-100 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                      {u.name ? u.name.charAt(0) : 'U'}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        u.role === 'Admin'
                          ? 'bg-rose-500/20 text-rose-400'
                          : u.role === 'Project Manager'
                          ? 'bg-purple-500/20 text-purple-400'
                          : u.role === 'Client'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded font-mono ${
                        u.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {u.status || 'offline'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Team Member">Team Member</option>
                      <option value="Client">Client</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
