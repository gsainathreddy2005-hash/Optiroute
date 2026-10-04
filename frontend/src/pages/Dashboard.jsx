import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import CostChart from '../components/dashboard/CostChart';
import UsageChart from '../components/dashboard/UsageChart';
import QualityChart from '../components/dashboard/QualityChart';
import RecentRequests from '../components/dashboard/RecentRequests';
import { analyticsService } from '../services/analyticsService';
import { Activity, DollarSign, Zap, Clock, ShieldCheck, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState('');
  const [showRefreshToast, setShowRefreshToast] = useState(false);

  const fetchDashboardData = async (isManualRefresh = false) => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const [overviewData, recentData] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getRecentRequests(10)
      ]);
      setData(overviewData);
      setRequests(recentData);

      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (isManualRefresh) {
        setShowRefreshToast(true);
        setTimeout(() => setShowRefreshToast(false), 3000);
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      // Ensure smooth spinner animation visible for at least 500ms
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  useEffect(() => {
    fetchDashboardData(false);
  }, []);

  const overview = data?.overview || {
    total_requests: 0,
    total_cost: 0.0,
    cost_saved: 0.0,
    cache_hit_rate: 0.0,
    avg_latency_ms: 0,
    avg_quality_score: 0.0
  };

  return (
    <DashboardLayout title="Platform Analytics Dashboard">
      <div className="space-y-6 relative">
        {/* Refresh Success Toast Popup */}
        {showRefreshToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Dashboard telemetry successfully refreshed!</span>
          </div>
        )}

        {/* Header Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OptiRoute Intelligence Hub</h1>
            <p className="text-xs text-slate-400 mt-1">Real-time prompt complexity metrics, cost reduction analytics & multi-LLM telemetry</p>
          </div>
          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                Updated {lastRefreshed}
              </span>
            )}
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={loading}
              title="Click to refresh telemetry data"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 border border-navy-800 text-xs font-semibold text-slate-200 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-cyan ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* 6 Key Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Requests"
            value={overview.total_requests.toLocaleString()}
            subtext="Processed queries"
            icon={Layers}
            color="blue"
          />
          <StatCard
            title="Total API Cost"
            value={`$${overview.total_cost.toFixed(4)}`}
            subtext="Actual expenditure"
            icon={DollarSign}
            color="amber"
          />
          <StatCard
            title="Cost Saved"
            value={`$${overview.cost_saved.toFixed(4)}`}
            subtext="Saved via routing & cache"
            icon={DollarSign}
            color="emerald"
            trend="Savings"
          />
          <StatCard
            title="Cache Hit Rate"
            value={`${overview.cache_hit_rate}%`}
            subtext="Redis memory efficiency"
            icon={Zap}
            color="cyan"
          />
          <StatCard
            title="Avg Latency"
            value={`${Math.round(overview.avg_latency_ms)}ms`}
            subtext="End-to-end response time"
            icon={Clock}
            color="purple"
          />
          <StatCard
            title="Avg Quality"
            value={`${overview.avg_quality_score}%`}
            subtext="Automated verification score"
            icon={ShieldCheck}
            color="emerald"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CostChart data={data?.cost_timeline || []} />
          </div>
          <div>
            <UsageChart data={data?.model_usage || []} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <QualityChart data={data?.complexity_breakdown || []} />
          </div>
          <div className="lg:col-span-2">
            <RecentRequests requests={requests} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
