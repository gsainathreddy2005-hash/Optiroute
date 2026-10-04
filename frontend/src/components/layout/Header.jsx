import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Sparkles, Check, Trash2, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function Header({ title }) {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Multi-LLM Router Online',
      desc: '13-stage NLP complexity classification engine is active.',
      time: '5m ago',
      read: false,
      icon: Layers,
      color: 'text-brand-cyan bg-brand-blue/10'
    },
    {
      id: 2,
      title: 'Redis Memory Active',
      desc: 'Normalized prompt hash caching ready with ~0ms latency.',
      time: '20m ago',
      read: false,
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 3,
      title: 'Auto-Escalation Failsafe',
      desc: 'Response quality verification set to 75% threshold.',
      time: '1h ago',
      read: true,
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-500/10'
    }
  ]);

  const dropdownRef = useRef(null);

  // Apply theme to html root tag
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle click outside notifications dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-navy-800 bg-navy-900/60 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
      </div>

      {/* Right Header Elements */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prompts, models..."
            className="w-full bg-navy-950/80 border border-navy-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-blue"
          />
        </div>

        {/* Live Router Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-cyan text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Multi-LLM Router</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            title="Notifications"
            className="w-8 h-8 rounded-lg bg-navy-800/80 border border-navy-700/60 flex items-center justify-center text-slate-300 hover:text-white transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-navy-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3.5 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-cyan" />
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-cyan text-[10px] font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-slate-400 hover:text-brand-cyan transition flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-navy-800/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map(n => {
                    const IconComp = n.icon;
                    return (
                      <div
                        key={n.id}
                        className={`p-3 text-xs flex gap-3 transition ${
                          n.read ? 'bg-navy-900/40 opacity-75' : 'bg-navy-800/30 font-medium'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${n.color}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-2 border-t border-navy-800 bg-navy-950/60 text-center">
                  <button
                    onClick={clearNotifications}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition flex items-center justify-center gap-1 w-full py-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mode / Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="w-8 h-8 rounded-lg bg-navy-800/80 border border-navy-700/60 flex items-center justify-center text-slate-300 hover:text-white transition"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-brand-cyan" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
}
