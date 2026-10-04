import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, trend, color = 'blue' }) {
  const colorMap = {
    blue: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
    cyan: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-brand-purple bg-brand-purple/10 border-brand-purple/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 hover:border-navy-700 transition duration-200 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-slate-400">{subtext}</p>
          {trend && (
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
