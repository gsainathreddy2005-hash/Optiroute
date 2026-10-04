import React from 'react';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { formatDualCurrency } from '../../utils/currency';

export default function RecentRequests({ requests = [] }) {
  const getComplexityBadge = (level) => {
    switch (level) {
      case 'SIMPLE':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SIMPLE</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-brand-blue/10 text-brand-cyan border border-brand-blue/20">MODERATE</span>;
      case 'COMPLEX':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-brand-purple/10 text-brand-purple border border-brand-purple/20">COMPLEX</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-800 text-slate-400">UNKNOWN</span>;
    }
  };

  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">Recent Prompt Execution Requests</h3>
          <p className="text-xs text-slate-400">Live request audit trail displaying dual currency costs ($ USD / ₹ INR) & quality scores</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-navy-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Prompt</th>
              <th className="py-3 px-3">Complexity</th>
              <th className="py-3 px-3">Cache</th>
              <th className="py-3 px-3">Model</th>
              <th className="py-3 px-3">Tokens</th>
              <th className="py-3 px-3">Cost ($ / ₹)</th>
              <th className="py-3 px-3">Latency</th>
              <th className="py-3 px-3">Quality</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 text-slate-300 font-medium">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-500">
                  No request records available yet. Submit a prompt in the Playground!
                </td>
              </tr>
            ) : (
              requests.map((req, idx) => (
                <tr key={req.id || idx} className="hover:bg-navy-850/50 transition">
                  <td className="py-3 px-3 max-w-xs truncate font-mono text-slate-200">
                    {req.prompt}
                  </td>
                  <td className="py-3 px-3">{getComplexityBadge(req.complexity)}</td>
                  <td className="py-3 px-3">
                    {req.cache_hit ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Zap className="w-3.5 h-3.5" /> HIT
                      </span>
                    ) : (
                      <span className="text-slate-500">MISS</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-brand-cyan">{req.selected_model}</td>
                  <td className="py-3 px-3 font-mono">{req.total_tokens || req.input_tokens + req.output_tokens || 0}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">
                    {formatDualCurrency(req.cost || 0)}
                  </td>
                  <td className="py-3 px-3 font-mono">{Math.round(req.latency_ms || 0)}ms</td>
                  <td className="py-3 px-3 font-semibold">
                    <span className={req.quality_score >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                      {req.quality_score || 85}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {req.quality_status === 'PASS' || !req.quality_status ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> {req.quality_status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
