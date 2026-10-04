import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Zap, Clock, DollarSign, Cpu, Check } from 'lucide-react';
import { promptService } from '../../services/promptService';

export default function ResponseCard({ result }) {
  const [feedbackSent, setFeedbackSent] = useState(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  if (!result) return null;

  const handleRating = async (rating) => {
    try {
      await promptService.submitFeedback({
        request_id: result.request_id,
        rating,
        comment: comment || null
      });
      setFeedbackSent(rating);
      setShowCommentBox(false);
    } catch (e) {
      console.error("Feedback error:", e);
    }
  };

  return (
    <div className="bg-navy-900/90 border border-navy-800 rounded-xl p-6 space-y-4 shadow-lg">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-800/80 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase">FINAL GENERATED RESPONSE</span>
          <span className="px-3 py-1 rounded-md text-xs font-semibold bg-brand-blue/15 text-brand-cyan border border-brand-blue/30 flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            {result.final_model}
          </span>
          {result.cache_hit && (
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> CACHED
            </span>
          )}
        </div>

        {/* Metrics Pill Grid */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1" title="Latency">
            <Clock className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{Math.round(result.latency_ms)}ms</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400" title="Cost Saved">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Saved ${result.cost_saved.toFixed(5)}</span>
          </div>
          <div className="text-slate-400">
            Tokens: <span className="text-white">{result.total_tokens}</span>
          </div>
        </div>
      </div>

      {/* Main Response Output Box */}
      <div className="bg-navy-950/80 border border-navy-800/80 rounded-lg p-5 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {result.response}
      </div>

      {/* Feedback Widget */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400">
          Was this response accurate and cost-effective?
        </div>

        <div className="flex items-center gap-2">
          {feedbackSent !== null ? (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Feedback recorded!
            </span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleRating(1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-navy-700 hover:border-emerald-500/40 text-xs font-semibold transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Good Response
              </button>
              <button
                type="button"
                onClick={() => handleRating(-1)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-navy-700 hover:border-rose-500/40 text-xs font-semibold transition"
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Poor Response
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
