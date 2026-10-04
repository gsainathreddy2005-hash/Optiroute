import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { promptService } from '../services/promptService';
import { GitFork, Cpu, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function Routing() {
  const [testPrompt, setTestPrompt] = useState('Write a Python function to sort a list of numbers.');
  const [routingResult, setRoutingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestRouting = async () => {
    if (!testPrompt.trim()) return;
    setLoading(true);
    try {
      const res = await promptService.testRouting(testPrompt.trim());
      setRoutingResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Intelligent Router Configuration & Testing">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Routing Matrix Card */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <GitFork className="w-5 h-5 text-brand-cyan" />
            Complexity Routing Assignment Matrix
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            OptiRoute AI evaluates prompt length, syntax, instruction keywords, code presence, and reasoning requirements to assign optimal target LLMs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SIMPLE Tier */}
            <div className="bg-navy-950/80 border border-emerald-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SIMPLE TIER
                </span>
                <span className="text-xs font-mono text-emerald-400">~$0.0015 / 1k</span>
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Fast / Ultra-Low-Cost Models</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targeted for short definitions, factual Q&A, basic language translation, and greeting prompts.
              </p>
              <div className="pt-2 border-t border-navy-800 text-xs font-mono text-slate-300">
                Primary: <span className="text-brand-cyan">gpt-3.5-turbo / mock-fast</span>
              </div>
            </div>

            {/* MODERATE Tier */}
            <div className="bg-navy-950/80 border border-brand-blue/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-brand-blue/10 text-brand-cyan border border-brand-blue/20">
                  MODERATE TIER
                </span>
                <span className="text-xs font-mono text-brand-cyan">~$0.0006 / 1k</span>
              </div>
              <h3 className="font-bold text-slate-200 text-sm">Balanced Quality & Speed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targeted for document summarization, standard code generation, formatting, and intermediate analysis.
              </p>
              <div className="pt-2 border-t border-navy-800 text-xs font-mono text-slate-300">
                Primary: <span className="text-brand-cyan">gpt-4o-mini / mock-balanced</span>
              </div>
            </div>

            {/* COMPLEX Tier */}
            <div className="bg-navy-950/80 border border-purple-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-bold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  COMPLEX TIER
                </span>
                <span className="text-xs font-mono text-purple-400">~$0.0100 / 1k</span>
              </div>
              <h3 className="font-bold text-slate-200 text-sm">High-Capability Flagship</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Targeted for multi-step logical reasoning, math proofs, system architecture design, and complex debugging.
              </p>
              <div className="pt-2 border-t border-navy-800 text-xs font-mono text-slate-300">
                Primary: <span className="text-brand-cyan">gpt-4o / mock-advanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Router Simulation Tool */}
        <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            Router Decision Simulation Tool
          </h3>
          <p className="text-xs text-slate-400">Test how the routing engine classifies prompt difficulty without triggering actual generation</p>

          <div className="flex gap-3">
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Enter test prompt..."
              className="flex-1 bg-navy-950 border border-navy-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-blue"
            />
            <button
              onClick={handleTestRouting}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-brand-blue hover:bg-blue-600 text-white font-semibold text-xs transition"
            >
              {loading ? 'Evaluating...' : 'Simulate Route'}
            </button>
          </div>

          {routingResult && (
            <div className="bg-navy-950 border border-navy-800 rounded-lg p-5 mt-4 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase">CLASSIFIED COMPLEXITY</span>
                <span className="px-3 py-1 text-xs font-bold rounded bg-brand-blue/15 text-brand-cyan border border-brand-blue/30">
                  {routingResult.complexity} ({(routingResult.confidence * 100).toFixed(0)}% Confidence)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Selected Target Model: <strong className="text-brand-cyan">{routingResult.selected_model}</strong></span>
                <span>Est. Latency: <strong>{routingResult.expected_latency_ms}ms</strong></span>
              </div>

              <p className="text-xs text-slate-400 border-t border-navy-800 pt-3 leading-relaxed">
                <strong>Explanation:</strong> {routingResult.reasoning}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
