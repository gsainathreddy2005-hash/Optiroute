import React, { useState } from 'react';
import { X, LayoutGrid, Sparkles, Check, Plus, Code, DollarSign, FileText, Zap } from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    id: 'skill-code-audit',
    name: 'Code Refactoring & Complexity Audit',
    desc: 'Deeply analyzes code architecture, identifies bottlenecks, and refactors for O(1)/O(n) complexity',
    prompt: 'Please perform a comprehensive complexity audit and refactoring on the following code snippet. Optimize for runtime speed, memory footprint, and clean architecture:\n\n```python\n\n```'
  },
  {
    id: 'skill-cost-opt',
    name: 'Multi-LLM Cost Optimization Rule',
    desc: 'Analyzes user token budget and generates prompt routing rules to cut OpenAI/Anthropic expenses by 70%',
    prompt: 'Analyze our current token usage and propose intelligent multi-LLM routing heuristics. Specify which prompt complexity classes should go to GPT-3.5-Turbo, GPT-4o-Mini, and Claude 3.5 Sonnet to minimize cost while preserving 95%+ quality.'
  },
  {
    id: 'skill-exec-summary',
    name: 'Executive Summary Briefing',
    desc: 'Condenses extensive technical documentation into a crisp 1-page executive brief with action items',
    prompt: 'Transform the following technical material into a high-impact executive summary. Include: 1) Strategic objective, 2) Key technical trade-offs, 3) Cost & latency impact, 4) Recommended immediate actions:\n\n'
  },
  {
    id: 'skill-prompt-engineer',
    name: 'Zero-Shot Prompt Improver',
    desc: 'Enhances vague prompts into structured, chained prompts with guardrails and few-shot examples',
    prompt: 'Act as a principal prompt engineer. Rewrite and optimize the following prompt to achieve maximum reliability, eliminate hallucinations, and enforce strict JSON output formatting:\n\n'
  }
];

export default function TemplateModal({ isOpen, onClose, onApplyTemplate }) {
  const [templates, setTemplates] = useState(PRESET_TEMPLATES);
  const [isCreating, setIsCreating] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPrompt.trim()) return;
    const newTmpl = {
      id: `custom-${Date.now()}`,
      name: customTitle.trim(),
      desc: customDesc.trim() || 'Custom user skill template',
      prompt: customPrompt.trim()
    };
    setTemplates([newTmpl, ...templates]);
    onApplyTemplate(newTmpl.prompt);
    setIsCreating(false);
    setCustomTitle('');
    setCustomDesc('');
    setCustomPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#212121] border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-slate-300">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Template Creator</h3>
              <p className="text-xs text-neutral-400">Create reusable templates saved as personal skills</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create new template button / form */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/60">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800/80 hover:bg-neutral-750 text-xs font-semibold text-purple-400 rounded-xl transition border border-neutral-700/60"
            >
              <Plus className="w-3.5 h-3.5" />
              Create new skill template
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Template name (e.g. Security Vulnerability Scan)"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Brief description..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={3}
                placeholder="Prompt template instructions..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customTitle.trim() || !customPrompt.trim()}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition"
                >
                  Save & Apply
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Templates List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onApplyTemplate(tmpl.prompt);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-neutral-800/80 cursor-pointer transition border border-transparent hover:border-neutral-700/60 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition">
                  {tmpl.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-purple-400 font-medium">
                  Apply Skill
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {tmpl.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
