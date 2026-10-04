import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { 
  LayoutDashboard, 
  Terminal, 
  GitFork, 
  Cpu, 
  Database, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  CreditCard,
  User, 
  Activity, 
  Zap, 
  LogOut,
  LogIn
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Playground', path: '/playground', icon: Terminal },
  { name: 'LLM Routing', path: '/routing', icon: GitFork },
  { name: 'Models', path: '/models', icon: Cpu },
  { name: 'Cache Memory', path: '/cache', icon: Database },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Feedback', path: '/feedback', icon: MessageSquare },
  { name: 'Subscription', path: '/subscription', icon: CreditCard },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-navy-900 border-r border-navy-800 flex flex-col fixed inset-y-0 left-0 z-50 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-navy-800/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-blue/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide leading-tight">OptiRoute AI</h1>
          <p className="text-xs text-slate-400 font-medium">Intelligent LLM Routing</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-blue/15 text-brand-cyan border-l-4 border-brand-cyan shadow-sm shadow-brand-blue/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Footer Details */}
      <div className="p-4 border-t border-navy-800/80 bg-navy-950/40 space-y-3">
        {/* System Online Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-navy-900/80 border border-navy-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">System Online</span>
          </div>
          <Activity className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* User Login/Logout Card */}
        {currentUser ? (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-navy-900/60 border border-navy-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-navy-800 flex items-center justify-center border border-slate-700 text-brand-cyan text-xs font-bold shrink-0">
                {currentUser.full_name ? currentUser.full_name[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.full_name}</p>
                <p className="text-[10px] text-brand-cyan capitalize truncate">{currentUser.plan_tier || 'free'} plan</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/30 text-brand-cyan text-xs font-bold transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In / Register
          </NavLink>
        )}
      </div>
    </aside>
  );
}
