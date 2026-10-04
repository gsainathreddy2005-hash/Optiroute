import React, { useState } from 'react';
import { X, Folder, Plus, Check, Briefcase, Sparkles } from 'lucide-react';

const INITIAL_PROJECTS = [
  { id: 'proj-1', name: 'OptiRoute Core AI', description: 'NLP Prompt routing and cost optimization engine', itemsCount: 14 },
  { id: 'proj-2', name: 'LLM Latency Benchmarks', description: 'Empirical testing across OpenAI, Anthropic & Ollama', itemsCount: 8 },
  { id: 'proj-3', name: 'Enterprise Cost Reductions', description: 'SaaS budget allocation and token caching heuristics', itemsCount: 22 },
  { id: 'proj-4', name: 'Final Year Capstone Review', description: 'Defense materials, slides, and architectural diagrams', itemsCount: 5 }
];

export default function ProjectModal({ isOpen, onClose, activeProject, onSelectProject }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const newProj = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description: 'Custom user project workspace',
      itemsCount: 0
    };
    setProjects([newProj, ...projects]);
    onSelectProject(newProj);
    setNewProjectName('');
    setIsCreating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#212121] border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-slate-300">
              <Folder className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Work in a project</h3>
              <p className="text-xs text-neutral-400">Start or continue a chat within a dedicated project</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create new project button or form */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/60">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800/80 hover:bg-neutral-750 text-xs font-semibold text-blue-400 rounded-xl transition border border-neutral-700/60"
            >
              <Plus className="w-3.5 h-3.5" />
              Create new project
            </button>
          ) : (
            <form onSubmit={handleCreate} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name..."
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newProjectName.trim()}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-semibold text-white rounded-xl transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white rounded-xl transition"
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {/* Projects List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1.5">
          {projects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                  isSelected 
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white' 
                    : 'hover:bg-neutral-800/80 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{proj.name}</p>
                    <p className="text-[11px] text-neutral-400 truncate">{proj.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                    {proj.itemsCount} chats
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <button
            onClick={() => {
              onSelectProject(null);
              onClose();
            }}
            className="text-xs text-neutral-400 hover:text-white transition underline"
          >
            Clear active project
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
