import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TIER_COLORS = {
  SIMPLE: '#10b981',    // Emerald
  MODERATE: '#38bdf8',  // Sky Blue
  COMPLEX: '#a855f7'    // Purple
};

export default function QualityChart({ data = [] }) {
  // Ensure all 3 tiers always exist in data
  const tierNames = ['SIMPLE', 'MODERATE', 'COMPLEX'];
  const fullData = tierNames.map(tier => {
    const existing = data.find(d => d.name?.toUpperCase() === tier);
    return existing || { name: tier, value: 0, percentage: 0 };
  });

  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-white">Complexity Breakdown</h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          NLP 3-Tier Classification
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-4">Prompt complexity levels classified by Scikit-learn NLP engine</p>
      
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={fullData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
              formatter={(value, name, item) => [`${value} requests (${item.payload.percentage || 0}%)`, 'Volume']}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {fullData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={TIER_COLORS[entry.name?.toUpperCase()] || '#38bdf8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown Badges for SIMPLE, MODERATE, COMPLEX */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-navy-800 text-center">
        {fullData.map((tier) => (
          <div key={tier.name} className="p-2 rounded-lg bg-navy-950/80 border border-navy-800/80">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: TIER_COLORS[tier.name?.toUpperCase()] || '#38bdf8' }}
              />
              <span className="text-[11px] font-semibold text-slate-300">{tier.name}</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">{tier.value}</div>
            <div className="text-[10px] text-slate-400">{tier.percentage || 0}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
