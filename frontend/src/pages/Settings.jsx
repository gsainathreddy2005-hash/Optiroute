import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { settingsService } from '../services/settingsService';
import { Settings as SettingsIcon, Save, Shield, Database, Sliders, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [config, setConfig] = useState({
    quality_threshold: 75.0,
    cache_enabled: true,
    cache_ttl_seconds: 3600,
    max_escalations: 1,
    routing_strategy: 'cost_optimized',
    openai_key_configured: false,
    anthropic_key_configured: false,
    ollama_available: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    settingsService.getSettings().then(setConfig).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updated = await settingsService.updateSettings({
        quality_threshold: parseFloat(config.quality_threshold),
        cache_enabled: config.cache_enabled,
        cache_ttl_seconds: parseInt(config.cache_ttl_seconds),
        max_escalations: parseInt(config.max_escalations),
        routing_strategy: config.routing_strategy
      });
      setConfig(updated);
      setMessage("Settings saved successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Platform Configuration & Control Settings">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">System Controls</h1>
            <p className="text-xs text-slate-400 mt-1">Configure threshold rules, caching TTL, routing policy, and auto-escalation caps</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {message}
          </div>
        )}

        {/* Form Controls Card */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 space-y-6">
          {/* Quality Threshold Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-200">Quality Pass Threshold ({config.quality_threshold}%)</label>
              <span className="text-xs text-slate-400">Default: 75%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={config.quality_threshold}
              onChange={(e) => setConfig({ ...config, quality_threshold: e.target.value })}
              className="w-full accent-brand-cyan bg-navy-950 rounded-lg cursor-pointer"
            />
            <p className="text-xs text-slate-400">Responses scoring below this quality verification threshold will trigger auto-escalation.</p>
          </div>

          <div className="border-t border-navy-800 pt-5 space-y-4">
            {/* Cache Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200">Enable Redis Cache Memory</h4>
                <p className="text-xs text-slate-400">Serve identical/normalized queries from cache</p>
              </div>
              <input
                type="checkbox"
                checked={config.cache_enabled}
                onChange={(e) => setConfig({ ...config, cache_enabled: e.target.checked })}
                className="w-5 h-5 rounded border-navy-700 bg-navy-950 text-brand-blue"
              />
            </div>

            {/* Cache TTL */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Cache TTL Duration (Seconds)</label>
              <input
                type="number"
                value={config.cache_ttl_seconds}
                onChange={(e) => setConfig({ ...config, cache_ttl_seconds: e.target.value })}
                className="w-full bg-navy-950 border border-navy-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="border-t border-navy-800 pt-5 space-y-4">
            {/* Max Escalations */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Maximum Allowed Auto-Escalations (Count)</label>
              <select
                value={config.max_escalations}
                onChange={(e) => setConfig({ ...config, max_escalations: e.target.value })}
                className="w-full bg-navy-950 border border-navy-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue"
              >
                <option value="0">0 (Disabled)</option>
                <option value="1">1 (Recommended)</option>
                <option value="2">2 (Aggressive)</option>
              </select>
            </div>

            {/* Routing Strategy */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">Routing Policy Strategy</label>
              <select
                value={config.routing_strategy}
                onChange={(e) => setConfig({ ...config, routing_strategy: e.target.value })}
                className="w-full bg-navy-950 border border-navy-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue"
              >
                <option value="cost_optimized">Cost Optimized (Prioritize minimal API bill)</option>
                <option value="balanced">Balanced (Optimal ratio of speed & capability)</option>
                <option value="performance_first">Performance First (Prioritize flagship models)</option>
              </select>
            </div>
          </div>

          {/* Provider API Status */}
          <div className="border-t border-navy-800 pt-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Provider API Keys Status</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-navy-950 p-3 rounded-lg border border-navy-800 flex items-center justify-between">
                <span>OpenAI API</span>
                <span className={config.openai_key_configured ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {config.openai_key_configured ? 'CONFIGURED' : 'MOCK FALLBACK'}
                </span>
              </div>
              <div className="bg-navy-950 p-3 rounded-lg border border-navy-800 flex items-center justify-between">
                <span>Anthropic API</span>
                <span className={config.anthropic_key_configured ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {config.anthropic_key_configured ? 'CONFIGURED' : 'MOCK FALLBACK'}
                </span>
              </div>
              <div className="bg-navy-950 p-3 rounded-lg border border-navy-800 flex items-center justify-between">
                <span>Ollama Local</span>
                <span className="text-brand-cyan font-bold">READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
