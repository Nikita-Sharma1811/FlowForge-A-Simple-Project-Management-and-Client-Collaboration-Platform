import React, { useState, useEffect } from 'react';
import { Play, Square, Clock } from 'lucide-react';
import { flowForgeApi } from '../services/api';

export default function TimerWidget({ activeTimer, onTimerStopped }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!activeTimer || !activeTimer.startTime) {
      setSeconds(0);
      return;
    }

    const startMs = new Date(activeTimer.startTime).getTime();
    const updateElapsed = () => {
      const elapsedSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setSeconds(elapsedSec);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  if (!activeTimer) return null;

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? `${h}:` : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStop = async () => {
    try {
      await flowForgeApi.time.stopTimer({ entryId: activeTimer._id });
      if (onTimerStopped) onTimerStopped();
    } catch (err) {
      console.error('Stop timer failed:', err.message);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-blue-950/80 border border-blue-500/40 text-blue-100 px-3 py-1.5 rounded-xl text-xs shadow-lg backdrop-blur-md animate-pulse">
      <Clock size={14} className="text-blue-400" />
      <div className="flex flex-col">
        <span className="font-mono font-bold text-blue-300 text-sm">{formatTimer(seconds)}</span>
        <span className="text-[10px] text-blue-200/70 truncate max-w-[120px]">
          {activeTimer.task?.title || 'Time Tracking'}
        </span>
      </div>
      <button
        onClick={handleStop}
        className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg transition-colors ml-1"
        title="Stop Timer"
      >
        <Square size={12} />
      </button>
    </div>
  );
}
