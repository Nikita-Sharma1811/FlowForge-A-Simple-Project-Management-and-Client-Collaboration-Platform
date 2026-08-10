import React, { useState, useEffect } from 'react';
import { BarChart3, ShieldAlert, Users, Clock, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { flowForgeApi } from '../services/api';
import WorkloadWarningBanner from '../components/WorkloadWarningBanner';

export default function WorkloadPage() {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkload();
  }, []);

  const fetchWorkload = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.users.getWorkload();
      setWorkloadData(res.data || []);
    } catch (err) {
      console.error('Fetch workload error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const overloadedMembers = workloadData.filter((w) => w.isOverloaded);

  const chartData = workloadData.map((w) => ({
    name: w.user?.name || 'Member',
    activeTasks: w.taskCount || 0,
    estimatedHours: w.estimatedHours || 0,
    loggedHours: w.loggedHours || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="text-blue-500" size={24} />
          Team Workload Analytics & Overload Warnings
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time team bandwidth metrics, task distribution, and automated burnout prevention</p>
      </div>

      {/* Automated Workload Warning Banner */}
      <WorkloadWarningBanner overloadedMembers={overloadedMembers} />

      {/* Recharts Workload Graph */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Users size={16} className="text-cyan-400" />
          Task & Estimated Hours Allocation
        </h2>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="activeTasks" name="Active Tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="estimatedHours" name="Estimated Hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="loggedHours" name="Logged Hours" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workloadData.map((w) => (
          <div
            key={w.user?._id || Math.random()}
            className={`p-6 border rounded-3xl backdrop-blur-md space-y-4 shadow-xl ${
              w.isOverloaded
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-sm">
                  {w.user?.name ? w.user.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{w.user?.name || 'Member'}</h3>
                  <span className="text-[10px] text-slate-400">{w.user?.role || 'Developer'}</span>
                </div>
              </div>

              {w.isOverloaded && (
                <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame size={10} />
                  Overloaded
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Tasks</span>
                <span className="text-base font-extrabold text-slate-100 font-mono">{w.taskCount || 0}</span>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Est. Hrs</span>
                <span className="text-base font-extrabold text-purple-400 font-mono">{w.estimatedHours || 0}h</span>
              </div>

              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Logged</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">{w.loggedHours || 0}h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
