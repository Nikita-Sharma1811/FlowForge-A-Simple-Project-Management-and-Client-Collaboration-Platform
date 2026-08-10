import React, { useState, useEffect } from 'react';
import { PieChart as PieIcon, BarChart3, CheckCircle2, ShieldAlert, Layers, Bug, Zap } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { flowForgeApi } from '../services/api';

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchReports(selectedProject);
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await flowForgeApi.projects.list();
      setProjects(res.data || []);
    } catch (err) {
      console.error('Fetch projects error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (projId) => {
    try {
      const res = await flowForgeApi.reports.getSummary(projId ? { project: projId } : {});
      setReportsData(res.data || null);
    } catch (err) {
      console.error('Fetch reports error:', err.message);
    }
  };

  const statusDistribution = reportsData?.statusBreakdown
    ? Object.entries(reportsData.statusBreakdown).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : [
        { name: 'Done', value: 12 },
        { name: 'In Progress', value: 8 },
        { name: 'Todo', value: 5 },
        { name: 'Review', value: 3 },
      ];

  const typeDistribution = reportsData?.typeBreakdown
    ? Object.entries(reportsData.typeBreakdown).map(([type, count]) => ({
        name: type,
        value: count,
      }))
    : [
        { name: 'Story', value: 10 },
        { name: 'Task', value: 9 },
        { name: 'Bug', value: 5 },
        { name: 'Epic', value: 2 },
      ];

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PieIcon className="text-purple-500" size={24} />
            Agile Velocity & Project Analytics Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">Completion rates, sprint velocity, bug count breakdown, and resource metrics</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl font-semibold focus:outline-none"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BarChart3 size={16} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            {reportsData?.totalTasks || 0}
          </span>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Completed Tasks</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {reportsData?.completedTasks || 0}
          </span>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Bug Count</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Bug size={16} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {reportsData?.bugCount || 0}
          </span>
        </div>

        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap size={16} />
            </div>
          </div>
          <span className="text-3xl font-extrabold text-purple-400 font-mono tracking-tight">
            {reportsData?.completionRate || 0}%
          </span>
        </div>
      </div>

      {/* Recharts Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <PieIcon size={18} className="text-blue-400" />
            Task Status Distribution
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Type Breakdown Bar Chart */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 size={18} className="text-purple-400" />
            Work Item Types (Epic, Story, Task, Bug)
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeDistribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="value" name="Count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
