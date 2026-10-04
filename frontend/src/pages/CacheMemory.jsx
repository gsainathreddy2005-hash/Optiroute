import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { cacheService } from '../services/cacheService';
import { 
  Database, Trash2, Zap, RefreshCw, Clock, CheckCircle2, 
  Search, Eye, ShieldCheck, ChevronRight, X
} from 'lucide-react';

export default function CacheMemory() {
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchCacheInfo = async (isManual = false) => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const [sData, eData] = await Promise.all([
        cacheService.getStats(),
        cacheService.getEntries()
      ]);
      setStats(sData);
      setEntries(eData || []);

      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (isManual) {
        showToast("Cache memory & index refreshed successfully!");
      }
    } catch (err) {
      console.error("Cache fetch error:", err);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchCacheInfo(false);
  }, []);

  const handleClearCache = async () => {
    if (!window.confirm("Are you sure you want to flush all cache memory? All stored prompt responses will be evicted.")) return;
    try {
      await cacheService.clearCache();
      showToast("Cache memory store completely flushed!");
      fetchCacheInfo(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteKey = async (key) => {
    try {
      await cacheService.deleteKey(key);
      setEntries(prev => prev.filter(e => e.cache_key !== key));
      showToast(`Evicted key ${key.substring(0, 16)}...`);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEntries = entries.filter(e => 
    (e.prompt_snippet || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.cache_key || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.model_used || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Redis Cache Memory & Analytics">
      <div className="space-y-6 max-w-6xl mx-auto relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-cyan" />
              Cache Store & Savings Metrics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Normalized prompt hash caching serves repeat queries with ~0ms latency and $0 cost
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline-block">
                Updated {lastRefreshed}
              </span>
            )}
            
            {/* Refresh Data Button */}
            <button
              type="button"
              onClick={() => fetchCacheInfo(true)}
              disabled={loading}
              title="Refresh Cache Store Data"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-800 text-xs font-semibold text-slate-200 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-cyan ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>

            {/* Flush Cache Button */}
            <button
              onClick={handleClearCache}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              FLUSH CACHE
            </button>
          </div>
        </div>

        {/* Cache Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase">CACHE ENGINE</span>
            <h3 className="text-xl font-bold text-brand-cyan uppercase mt-1">
              {stats?.type === 'redis' ? 'Redis Cluster' : 'In-Memory Store'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Status: Active & Persistent</p>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase">TOTAL CACHED PROMPTS</span>
            <h3 className="text-xl font-bold text-white mt-1 font-mono">
              {stats?.total_keys || entries.length}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Stored previous queries</p>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase">HITS / MISSES</span>
            <h3 className="text-xl font-bold text-emerald-400 mt-1 font-mono">
              {stats?.hits || 0} / {stats?.misses || 0}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Lookups served at $0</p>
          </div>

          <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase">HIT RATE EFFICIENCY</span>
            <h3 className="text-xl font-bold text-brand-blue mt-1 font-mono">
              {stats?.hit_rate || (stats?.hits && (stats.hits + stats.misses > 0) ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) : '0.0')}%
            </h3>
            <p className="text-xs text-slate-400 mt-1">Cost savings optimization</p>
          </div>
        </div>

        {/* Cached Keys Table Section */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Cached Prompt Index ({filteredEntries.length})
            </h3>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cached prompts..."
                className="w-full bg-navy-950 border border-navy-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-3">Cache Key Hash</th>
                  <th className="py-3 px-3">Prompt Content</th>
                  <th className="py-3 px-3">Model</th>
                  <th className="py-3 px-3">Hits</th>
                  <th className="py-3 px-3">Saved Cost</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-slate-300 font-medium">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      {searchQuery ? 'No matching cached prompts found.' : 'No prompt entries cached yet. Run prompts in the Playground to see them stored here!'}
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry.id || entry.cache_key} className="hover:bg-navy-850/50 transition">
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {entry.cache_key ? `${entry.cache_key.substring(0, 20)}...` : 'optiroute:cache'}
                      </td>
                      <td className="py-3 px-3 max-w-sm truncate text-slate-200">
                        {entry.prompt_snippet}
                      </td>
                      <td className="py-3 px-3 font-mono text-brand-cyan">
                        {entry.model_used}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-400 font-mono">
                        {entry.hit_count || 1}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400">
                        ${(entry.estimated_cost_saved || 0.005).toFixed(4)}
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="p-1.5 rounded text-brand-cyan hover:bg-brand-blue/10 transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(entry.cache_key)}
                          className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10 transition"
                          title="Evict Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Entry Details Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <div className="w-full max-w-lg bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Cached Prompt Entry</h3>
                </div>
                <button 
                  onClick={() => setSelectedEntry(null)} 
                  className="text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Cache Key:</span>
                  <div className="p-2 rounded-lg bg-navy-950 font-mono text-slate-300 break-all border border-navy-800">
                    {selectedEntry.cache_key}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Prompt:</span>
                  <div className="p-2.5 rounded-lg bg-navy-950 text-slate-200 border border-navy-800 max-h-24 overflow-y-auto">
                    {selectedEntry.prompt_snippet}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Cached Response:</span>
                  <div className="p-2.5 rounded-lg bg-navy-950 text-slate-300 border border-navy-800 max-h-36 overflow-y-auto leading-relaxed">
                    {selectedEntry.response_snippet}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Model</span>
                    <span className="text-brand-cyan font-bold">{selectedEntry.model_used}</span>
                  </div>
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Total Hits</span>
                    <span className="text-emerald-400 font-bold">{selectedEntry.hit_count || 1}</span>
                  </div>
                  <div className="p-2 rounded bg-navy-950 border border-navy-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Saved Cost</span>
                    <span className="text-emerald-400 font-bold">${(selectedEntry.estimated_cost_saved || 0.005).toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-white transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
