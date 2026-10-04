import React from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';

const PRESET_PROMPTS = [
  "What is machine learning?",
  "Write a Python function to check if a string is a palindrome.",
  "Design a microservices architecture for a high-frequency trading platform handling 1M TPS.",
  "What is the capital of France?"
];

export default function PromptInput({ prompt, setPrompt, onSubmit, loading, forceNoCache, setForceNoCache }) {
  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          Enter Prompt for Intelligent Routing
        </label>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={forceNoCache}
              onChange={(e) => setForceNoCache(e.target.checked)}
              className="rounded border-navy-700 bg-navy-950 text-brand-blue focus:ring-0"
            />
            Bypass Cache Memory
          </label>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. What is machine learning? or Write a Python script..."
          className="w-full bg-navy-950/90 border border-navy-800 rounded-lg p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-blue resize-none font-sans"
        />
      </div>

      {/* Preset Suggestions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">Sample Prompts:</span>
        {PRESET_PROMPTS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(p)}
            className="text-xs bg-navy-800/60 hover:bg-navy-800 border border-navy-700/60 text-slate-300 px-2.5 py-1 rounded-md transition"
          >
            {p.length > 35 ? p.substring(0, 35) + '...' : p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !prompt.strip?.() && !prompt.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-blue-600 hover:to-cyan-500 text-white font-semibold text-sm shadow-md shadow-brand-blue/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Routing & Processing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              RUN PROMPT
            </>
          )}
        </button>
      </div>
    </div>
  );
}
