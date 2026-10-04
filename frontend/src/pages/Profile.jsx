import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { authService } from '../services/authService';
import { User, Mail, Key, Shield, Zap, CreditCard, Copy, Check } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(setUser).catch(console.error);
  }, []);

  const copyApiKey = () => {
    if (user?.api_key) {
      navigator.clipboard.writeText(user.api_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPlanBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'pro':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-blue/20 text-brand-cyan border border-brand-blue/40 uppercase">PRO PLAN</span>;
      case 'enterprise':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 uppercase">ENTERPRISE PLAN</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-400 border border-slate-700 uppercase">FREE DEVELOPER</span>;
    }
  };

  return (
    <DashboardLayout title="User Account Profile">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Account Profile & Quota</h1>
            <p className="text-xs text-slate-400 mt-1">Manage user account credentials, active subscription tier, and API access keys</p>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-5 border-b border-navy-800 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-blue/20">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'A'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">{user?.full_name || 'Admin User'}</h2>
                {getPlanBadge(user?.plan_tier)}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {user?.email || 'admin@optiroute.ai'}
              </p>
            </div>
          </div>

          {/* Quota Usage Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider">Monthly Request Allowance</span>
              <span className="text-brand-cyan font-mono font-semibold">142 / 50,000 Used (0.3%)</span>
            </div>
            <div className="w-full bg-navy-950 h-2.5 rounded-full overflow-hidden border border-navy-800">
              <div className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full rounded-full w-[0.3%]" />
            </div>
          </div>

          {/* API Key Management */}
          <div className="space-y-2 border-t border-navy-800 pt-5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-brand-cyan" />
              OptiRoute Secret API Key
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={user?.api_key || 'op_key_f839210a48b9c231ef57201'}
                className="flex-1 bg-navy-950 border border-navy-800 rounded-lg px-4 py-2 font-mono text-xs text-slate-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={copyApiKey}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-750 border border-navy-700 text-xs font-semibold text-slate-200 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Key'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
