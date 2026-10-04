import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CostChart({ data = [] }) {
  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">API Cost vs. Cost Saved Over Time</h3>
          <p className="text-xs text-slate-400">Comparing routed execution cost against unoptimized flagship API baseline</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              formatter={(value) => [`$${value}`, '']}
            />
            <Area type="monotone" dataKey="actual_cost" name="Actual Cost" stroke="#3b82f6" fillOpacity={1} fill="url(#costGrad)" />
            <Area type="monotone" dataKey="saved_cost" name="Cost Saved" stroke="#10b981" fillOpacity={1} fill="url(#savedGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
