// import React from 'react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import {
//   Kanban,
//   Sparkles,
//   Zap,
//   Shield,
//   ArrowRight,
//   Play,
// } from 'lucide-react';
// import { flowForgeApi } from '../services/api';

// export default function Home({ user }) {
//   const navigate = useNavigate();

//   const handleSeedDemo = async () => {
//     try {
//       await flowForgeApi.seed.run();

//       alert(
//         'FlowForge Database seeded successfully! You can now log in with demo accounts (e.g. admin@flowforge.com / password123)'
//       );

//       navigate('/login');
//     } catch (err) {
//       alert(`Seeding failed: ${err.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex flex-col">
//       {/* Header Navigation */}
//       <header className="px-8 py-5 border-b border-slate-800 flex items-center justify-between">
//         <div
//           className="flex items-center gap-3 cursor-pointer"
//           onClick={() => navigate('/')}
//         >
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/30">
//             F
//           </div>

//           <span className="text-xl font-bold text-white">
//             FlowForge
//           </span>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleSeedDemo}
//             className="px-4 py-2.5 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
//           >
//             ⚡ Seed Demo Database
//           </button>

//           {user ? (
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
//             >
//               Go to Dashboard
//             </button>
//           ) : (
//             <>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="px-4 py-2 text-slate-300 hover:text-white text-xs font-semibold"
//               >
//                 Sign In
//               </button>

//               <button
//                 onClick={() => navigate('/register')}
//                 className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
//               >
//                 Get Started Free
//               </button>
//             </>
//           )}
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="py-24 px-6 text-center max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8"
//         >
//           <Sparkles size={14} />
//           <span>FlowForge Real-Time Project & Client Engine</span>
//         </motion.div>

//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
//         >
//           Simple Project Management{' '}
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
//             without Jira's Complexity
//           </span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10"
//         >
//           Streamline small team workflows with drag-and-drop Kanban boards,
//           WebSockets live collaboration, built-in stand-up logs, blocker
//           dashboards, client approval portals, and workload overload warnings.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="flex flex-wrap justify-center gap-4"
//         >
//           <button
//             onClick={() => navigate('/register')}
//             className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
//           >
//             <span>Launch FlowForge Workspace</span>
//             <ArrowRight size={16} />
//           </button>

//           <button
//             onClick={handleSeedDemo}
//             className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-800 flex items-center gap-2 text-sm transition-colors"
//           >
//             <Play size={16} className="text-emerald-400" />
//             <span>Load One-Click Seed Data</span>
//           </button>
//         </motion.div>
//       </section>

//       {/* Feature Grid */}
//       <section className="py-16 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         {[
//           {
//             title: 'Real-Time Kanban',
//             desc: 'Powered by dnd-kit & Socket.IO. Drag cards across statuses with instant WebSocket updates to all team members.',
//             icon: Kanban,
//           },
//           {
//             title: 'Client Approval Portal',
//             desc: 'Separate secure view for clients to inspect deliverables, leave feedback, and approve features seamlessly.',
//             icon: Shield,
//           },
//           {
//             title: 'Workload & Focus Mode',
//             desc: 'Automatically flag overloaded team members and switch to distraction-free focus mode for daily priorities.',
//             icon: Zap,
//           },
//         ].map((f, i) => {
//           const Icon = f.icon;

//           return (
//             <div
//               key={i}
//               className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md"
//             >
//               <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
//                 <Icon size={24} />
//               </div>

//               <h3 className="text-lg font-bold text-slate-100 mb-2">
//                 {f.title}
//               </h3>

//               <p className="text-xs text-slate-400 leading-relaxed">
//                 {f.desc}
//               </p>
//             </div>
//           );
//         })}
//       </section>

//       {/* Footer */}
//       <footer className="p-8 border-t border-slate-800 text-center text-xs text-slate-500">
//         FlowForge Project Management & Client Collaboration Platform © 2026.
//         Built with React, Vite, Tailwind CSS, Express, MongoDB Atlas, and
//         Socket.IO.
//       </footer>
//     </div>
//   );
// }
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Kanban,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Play,
} from 'lucide-react';
import { flowForgeApi } from '../services/api';

export default function Home({ user }) {
  const navigate = useNavigate();

  const handleSeedDemo = async () => {
    try {
      await flowForgeApi.seed.run();

      alert(
        'FlowForge Database seeded successfully! You can now log in with demo accounts (e.g. admin@flowforge.com / password123)'
      );

      navigate('/login');
    } catch (err) {
      alert(`Seeding failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header Navigation */}
      <header className="w-full px-8 py-5 flex items-center justify-between border-b border-slate-800">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-extrabold text-white">
            F
          </div>

          <span className="text-xl font-bold text-white">
            FlowForge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDemo}
            className="px-4 py-2.5 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors"
          >
            ⚡ Seed Demo Database
          </button>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8"
        >
          <Sparkles size={14} />
          <span>FlowForge Real-Time Project & Client Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6"
        >
          Simple Project Management{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            and Client Collaboration Platform
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-10"
        >
          Streamline small team workflows with drag-and-drop Kanban boards,
          WebSocket-based live collaboration, built-in stand-up logs,
          blocker dashboards, client approval portals, and workload
          overload warnings.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <span>Launch FlowForge Workspace</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleSeedDemo}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-800 flex items-center gap-2 text-sm transition-colors"
          >
            <Play size={16} className="text-emerald-400" />
            <span>Load One-Click Seed Data</span>
          </button>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Real-Time Kanban',
            desc: 'Powered by dnd-kit & Socket.IO. Drag cards across statuses with instant WebSocket updates to all team members.',
            icon: Kanban,
          },
          {
            title: 'Client Approval Portal',
            desc: 'Separate secure view for clients to inspect deliverables, leave feedback, and approve features seamlessly.',
            icon: Shield,
          },
          {
            title: 'Workload & Focus Mode',
            desc: 'Automatically flag overloaded team members and switch to distraction-free focus mode for daily priorities.',
            icon: Zap,
          },
        ].map((f, i) => {
          const Icon = f.icon;

          return (
            <div
              key={i}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-2">
                {f.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="p-8 border-t border-slate-800 text-center text-xs text-slate-500">
        FlowForge Project Management & Client Collaboration Platform © 2026.
        Built with React, Vite, Tailwind CSS, Express, MongoDB Atlas, and
        Socket.IO.
      </footer>
    </div>
  );
}