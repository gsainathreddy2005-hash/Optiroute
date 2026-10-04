import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Zap, 
  Cpu, 
  GitFork, 
  BrainCircuit, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export default function ProcessingSteps({ result }) {
  if (!result) return null;

  const steps = [
    {
      title: "CACHE MEMORY CHECK",
      icon: Zap,
      status: result.cache_hit ? "CACHE HIT" : "CACHE MISS",
      detail: result.cache_hit 
        ? `Served directly from Redis memory (Cost: $0.00, Latency: ${result.latency_ms}ms)`
        : "No key match found. Passing prompt to NLP Feature Analyzer.",
      badgeColor: result.cache_hit ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"
    },
    {
      title: "NLP PROMPT ANALYSIS",
      icon: BrainCircuit,
      status: "COMPLETED",
      detail: `Extracted ${result.nlp_features?.word_count || 0} words, ~${result.nlp_features?.estimated_tokens || 0} tokens. Code: ${result.nlp_features?.has_code_request ? 'Yes' : 'No'}, Reasoning: ${result.nlp_features?.requires_reasoning ? 'Yes' : 'No'}.`,
      badgeColor: "bg-brand-blue/10 text-brand-cyan border-brand-blue/20"
    },
    {
      title: "COMPLEXITY CLASSIFICATION",
      icon: Cpu,
      status: result.complexity,
      detail: `Classified as ${result.complexity} complexity with ${(result.complexity_confidence * 100).toFixed(0)}% confidence using Scikit-learn Random Forest model.`,
      badgeColor: result.complexity === 'COMPLEX' 
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
        : result.complexity === 'MODERATE' 
        ? "bg-brand-blue/10 text-brand-cyan border-brand-blue/20"
        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      title: "INTELLIGENT LLM ROUTING",
      icon: GitFork,
      status: result.selected_model,
      detail: result.routing_reason,
      badgeColor: "bg-brand-blue/10 text-brand-cyan border-brand-blue/20"
    },
    {
      title: "QUALITY VERIFICATION",
      icon: ShieldCheck,
      status: `${result.quality_score}% (${result.quality_status})`,
      detail: result.quality_reason,
      badgeColor: result.quality_status === "PASS" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
    }
  ];

  if (result.is_escalated) {
    steps.push({
      title: "AUTO-ESCALATION TRIGGERED",
      icon: ArrowUpRight,
      status: `ESCALATED TO ${result.final_model}`,
      detail: `Quality score fell below threshold. Auto-escalated from initial model to '${result.final_model}'.`,
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    });
  }

  return (
    <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-6 space-y-4">
      <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4 text-brand-cyan" />
        Real-Time Processing Pipeline Breakdown
      </h3>

      <div className="relative border-l-2 border-navy-800 ml-3 space-y-6 pl-6 py-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={idx} className="relative group">
              {/* Dot icon */}
              <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-navy-950 border border-navy-700 flex items-center justify-center text-brand-cyan">
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{step.title}</h4>
                <span className={`self-start sm:self-auto px-2.5 py-0.5 text-xs font-semibold rounded border ${step.badgeColor}`}>
                  {step.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
