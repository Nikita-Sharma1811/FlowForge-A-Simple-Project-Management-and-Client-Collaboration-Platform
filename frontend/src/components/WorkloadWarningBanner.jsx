import React from 'react';
import { AlertTriangle, UserCheck } from 'lucide-react';

export default function WorkloadWarningBanner({ overloadedMembers }) {
  if (!overloadedMembers || overloadedMembers.length === 0) return null;

  return (
    <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-4 mb-6 shadow-lg backdrop-blur-md">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 mt-0.5">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-300 text-sm flex items-center gap-2">
            Workload Overload Warning Detected
            <span className="text-xs bg-amber-500/30 px-2 py-0.5 rounded-full text-amber-200 font-mono">
              {overloadedMembers.length} member(s)
            </span>
          </h4>
          <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
            The following team members have significantly more active tasks or estimated hours than the team average:
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {overloadedMembers.map((m) => (
              <div
                key={m.user._id}
                className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs text-amber-100"
              >
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {m.user.name.charAt(0)}
                </div>
                <span className="font-medium">{m.user.name}</span>
                <span className="text-amber-300 font-mono">
                  ({m.activeTasks} active tasks, {m.estimatedHours}h est)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
