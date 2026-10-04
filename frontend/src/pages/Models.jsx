import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { modelService } from '../services/modelService';
import { Cpu, CheckCircle2, XCircle, DollarSign, Clock, Zap } from 'lucide-react';

export default function Models() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    try {
      const data = await modelService.getModels();
      setModels(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      await modelService.toggleModel(id, !currentStatus);
      setModels(models.map(m => m.id === id ? { ...m, is_active: !currentStatus } : m));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardLayout title="LLM Provider Registry & Models">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Active Model Catalog</h1>
            <p className="text-xs text-slate-400 mt-1">Configure capability benchmarks, token pricing tiers, and active status for provider APIs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-navy-900/80 border border-navy-800 rounded-xl p-5 space-y-4 hover:border-navy-700 transition">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{model.display_name}</h3>
                  <span className="text-xs font-mono text-slate-400 capitalize">{model.provider} provider • {model.tier}</span>
                </div>
                <button
                  onClick={() => handleToggle(model.id, model.is_active)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                    model.is_active 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  {model.is_active ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-navy-950/80 rounded-lg p-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">INPUT / 1K</span>
                  <span className="text-slate-200">${model.cost_per_1k_input.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">OUTPUT / 1K</span>
                  <span className="text-slate-200">${model.cost_per_1k_output.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">AVG LATENCY</span>
                  <span className="text-brand-cyan">{Math.round(model.avg_latency_ms)}ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CAPABILITY</span>
                  <span className="text-emerald-400">{model.capability_score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
