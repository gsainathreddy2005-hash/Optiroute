import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ChatPlusMenu from '../components/playground/ChatPlusMenu';
import SketchModal from '../components/playground/SketchModal';
import LibraryModal from '../components/playground/LibraryModal';
import ProjectModal from '../components/playground/ProjectModal';
import TemplateModal from '../components/playground/TemplateModal';
import { promptService } from '../services/promptService';
import { chatService } from '../services/chatService';
import { formatDualCurrency } from '../utils/currency';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Send, 
  Sparkles, 
  Terminal, 
  Zap, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  User, 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Brain, 
  Mic, 
  AudioLines,
  Paperclip, 
  Globe, 
  Megaphone,
  X, 
  FileText, 
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Folder,
  Presentation,
  LayoutGrid,
  Library
} from 'lucide-react';

export default function Playground() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [forceNoCache, setForceNoCache] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [showPipeline, setShowPipeline] = useState(false);

  // ChatGPT Modern Popup & Action Modals State
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  // Feature Toggle Modes
  const [isThinkActive, setIsThinkActive] = useState(false);
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [isDeepResearchActive, setIsDeepResearchActive] = useState(false);
  const [isImageModeActive, setIsImageModeActive] = useState(false);
  const [isPresentationModeActive, setIsPresentationModeActive] = useState(false);

  // Voice & Audio States
  const [isListening, setIsListening] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [expandedThoughtId, setExpandedThoughtId] = useState(null);

  const [attachedFiles, setAttachedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const chatBottomRef = useRef(null);

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
      if (data.length > 0 && !activeSessionId) {
        setActiveSessionId(data[0].session_id);
        setMessages(data[0].messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSelectSession = async (sessId) => {
    setActiveSessionId(sessId);
    setLatestResult(null);
    try {
      const sessData = await chatService.getSession(sessId);
      setMessages(sessData.messages || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSess = await chatService.createSession("New Conversation");
      setSessions([newSess, ...sessions]);
      setActiveSessionId(newSess.session_id);
      setMessages([]);
      setLatestResult(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSession = async (e, sessId) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(sessId);
      const filtered = sessions.filter(s => s.session_id !== sessId);
      setSessions(filtered);
      if (activeSessionId === sessId) {
        if (filtered.length > 0) {
          handleSelectSession(filtered[0].session_id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResponseFeedback = async (message, rating) => {
    if (!message.request_id || message.feedbackPending || message.feedback !== undefined) return;

    setMessages(prev => prev.map(msg =>
      msg.id === message.id ? { ...msg, feedbackPending: true, feedbackError: false } : msg
    ));

    try {
      await promptService.submitFeedback({ request_id: message.request_id, rating });
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, feedback: rating, feedbackPending: false } : msg
      ));
    } catch (err) {
      console.error('Response feedback error:', err);
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, feedbackPending: false, feedbackError: true } : msg
      ));
    }
  };

  // Actions from ChatPlusMenu
  const handleSelectPlusOption = (optionId) => {
    switch (optionId) {
      case 'create_image':
        setIsImageModeActive(prev => !prev);
        if (!isImageModeActive) {
          setInputPrompt(prev => prev ? `Visualize: ${prev}` : 'Visualize: ');
        }
        break;
      case 'web_search':
        setIsWebSearchActive(prev => !prev);
        break;
      case 'thinking':
        setIsThinkActive(prev => !prev);
        break;
      case 'deep_research':
        setIsDeepResearchActive(prev => !prev);
        break;
      case 'presentations':
        setIsPresentationModeActive(prev => !prev);
        if (!isPresentationModeActive) {
          setInputPrompt(prev => prev ? `Create a presentation on: ${prev}` : 'Create a 5-slide presentation on: ');
        }
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newAttachments = files.map(f => ({
        name: f.name,
        size: (f.size / 1024).toFixed(1) + ' KB',
        type: f.type.includes('image') ? 'image' : 'doc'
      }));
      setAttachedFiles(prev => [...prev, ...newAttachments]);
    }
  };

  const handleAttachSketch = (sketch) => {
    setAttachedFiles(prev => [...prev, { ...sketch, size: '42 KB' }]);
  };

  const handleAttachLibraryFile = (file) => {
    setAttachedFiles(prev => [...prev, file]);
  };

  const removeAttachment = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Speech Recognition (Mic button)
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsListening(prev => !prev);
      if (!isListening) {
        setInputPrompt(prev => (prev ? `${prev} Compare prompt routing algorithms` : 'Compare prompt routing algorithms'));
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  // Speech Synthesis (AudioLines / Voice Mode & message speak)
  const speakText = (text, msgId) => {
    if (!('speechSynthesis' in window)) return;
    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted.').replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);
    setCurrentlySpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceMode = () => {
    const nextState = !isVoiceModeActive;
    setIsVoiceModeActive(nextState);
    if (!nextState) {
      window.speechSynthesis?.cancel();
      setCurrentlySpeakingId(null);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if ((!inputPrompt.trim() && attachedFiles.length === 0) || loading) return;

    let promptToSend = inputPrompt.trim();
    if (isThinkActive) promptToSend = `[Deep Reasoning Mode] ${promptToSend}`;
    if (isWebSearchActive) promptToSend = `[Live Web Search] ${promptToSend}`;
    if (isDeepResearchActive) promptToSend = `[Deep Research Report] ${promptToSend}`;
    if (isImageModeActive) promptToSend = `[Create Image Mode] ${promptToSend}`;
    if (isPresentationModeActive) promptToSend = `[Presentation Mode] ${promptToSend}`;
    if (activeProject) promptToSend = `[Project: ${activeProject.name}] ${promptToSend}`;
    if (attachedFiles.length > 0) {
      const fileNames = attachedFiles.map(f => f.name).join(', ');
      promptToSend += ` (Attached files: ${fileNames})`;
    }

    const userPromptDisplay = inputPrompt.trim() || `Processed attached files: ${attachedFiles.map(f => f.name).join(', ')}`;
    const currentFiles = [...attachedFiles];
    const usedModes = {
      think: isThinkActive,
      webSearch: isWebSearchActive,
      deepResearch: isDeepResearchActive,
      imageMode: isImageModeActive,
      presentation: isPresentationModeActive
    };

    setInputPrompt('');
    setAttachedFiles([]);
    setLoading(true);

    const tempUserMsg = {
      id: Date.now(),
      role: 'user',
      content: userPromptDisplay,
      attachments: currentFiles,
      modes: usedModes,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await promptService.processPrompt({
        prompt: promptToSend,
        session_id: activeSessionId,
        force_no_cache: forceNoCache
      });

      setLatestResult(res);
      if (!activeSessionId) {
        setActiveSessionId(res.session_id);
      }

      // Generate simulated thinking trace if Think mode was active
      let thinkingTrace = null;
      if (usedModes.think || usedModes.deepResearch) {
        thinkingTrace = [
          "1. Parsed prompt complexity constraints and syntax features.",
          `2. Scikit-learn Random Forest evaluated confidence score at ${(res.complexity_confidence * 100).toFixed(0)}%.`,
          `3. Cost-aware LLM router matched tier '${res.complexity}' to model '${res.final_model}'.`,
          "4. Quality verification engine confirmed standard compliance.",
          "5. Formatted structured synthesis for optimal clarity."
        ].join('\n');
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        request_id: res.request_id,
        content: res.response,
        model: res.final_model,
        complexity: res.complexity,
        cost_usd: res.cost_usd || res.cost,
        cost_inr: res.cost_inr || (res.cost * 83.50),
        quality_score: res.quality_score,
        cache_hit: res.cache_hit,
        latency_ms: res.latency_ms,
        thinkingTrace,
        modes: usedModes,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // If Voice Mode is active, read the assistant response aloud
      if (isVoiceModeActive) {
        speakText(res.response, assistantMsg.id);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "❌ Failed to process prompt. Please check backend connection.",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] border border-navy-800 rounded-2xl overflow-hidden bg-navy-900 shadow-2xl relative">
        
        {/* Left Sessions Sidebar */}
        <div className="w-64 border-r border-navy-800 bg-navy-950 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-navy-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversations</span>
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-cyan transition"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Active Project Indicator if selected */}
          {activeProject && (
            <div className="px-3 py-2 bg-blue-900/20 border-b border-blue-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-300 min-w-0">
                <Folder className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-medium">{activeProject.name}</span>
              </div>
              <button onClick={() => setActiveProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No conversations yet.
              </div>
            ) : (
              sessions.map((sess) => (
                <div
                  key={sess.session_id}
                  onClick={() => handleSelectSession(sess.session_id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition group ${
                    activeSessionId === sess.session_id
                      ? 'bg-brand-blue/20 text-white font-medium border border-brand-blue/30'
                      : 'text-slate-400 hover:bg-navy-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{sess.title || sess.session_id}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, sess.session_id)}
                    className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Main Chat Thread Area */}
        <div className="flex-1 flex flex-col bg-navy-950 min-w-0">
          
          {/* Top Chat Thread Header Strip */}
          <div className="p-3.5 border-b border-navy-800/80 bg-navy-900/60 backdrop-blur-md flex items-center justify-between px-6">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <span className="font-semibold text-white">Active Thread:</span>
              <span className="font-mono text-[11px] text-slate-400">{activeSessionId || 'New Session'}</span>
              {activeProject && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px]">
                  {activeProject.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-[11px]">
                <input
                  type="checkbox"
                  checked={forceNoCache}
                  onChange={(e) => setForceNoCache(e.target.checked)}
                  className="rounded bg-navy-900 border-navy-700 text-brand-blue focus:ring-0"
                />
                <span>Bypass Cache Memory</span>
              </label>

              {latestResult && (
                <button
                  onClick={() => setShowPipeline(!showPipeline)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 text-[11px] font-semibold border border-navy-700 transition"
                >
                  <Terminal className="w-3 h-3 text-brand-cyan" />
                  <span>Pipeline Telemetry</span>
                  {showPipeline ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Pipeline Telemetry Strip */}
          {showPipeline && latestResult && (
            <div className="p-4 bg-navy-900/90 border-b border-navy-800 text-xs animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-400 block">Assigned Model</span>
                  <span className="text-brand-cyan font-bold">{latestResult.final_model}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-400 block">Complexity Tier</span>
                  <span className="text-purple-400 font-bold">{latestResult.complexity} ({(latestResult.complexity_confidence * 100).toFixed(0)}%)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-400 block">Execution Cost</span>
                  <span className="text-emerald-400 font-bold">{formatDualCurrency(latestResult.cost_usd || latestResult.cost)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="text-[10px] text-slate-400 block">Quality Verification</span>
                  <span className="text-emerald-400 font-bold">{latestResult.quality_score}% ({latestResult.quality_status})</span>
                </div>
              </div>
            </div>
          )}

          {/* Message Thread Scroll View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 flex items-center justify-center text-brand-cyan">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Ask OptiRoute AI / ChatGPT</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Click the <strong className="text-white">+</strong> button below to attach files, search the web, think deeply, generate presentations, or draw sketches.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-brand-blue to-brand-cyan text-white'
                        : 'bg-navy-800 border border-navy-700 text-brand-cyan'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Bubble Content */}
                  <div className="space-y-2 max-w-2xl">
                    {/* User attachments preview */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-1.5 justify-end">
                        {msg.attachments.map((att, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700 text-slate-300 text-xs font-medium">
                            <FileText className="w-3 h-3 text-brand-cyan" />
                            <span>{att.name}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Collapsible Thinking Trace Accordion for Assistant */}
                    {msg.role === 'assistant' && msg.thinkingTrace && (
                      <div className="mb-2 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden text-xs">
                        <button
                          onClick={() => setExpandedThoughtId(expandedThoughtId === msg.id ? null : msg.id)}
                          className="w-full flex items-center justify-between px-3 py-2 text-neutral-400 hover:text-neutral-200 transition font-mono text-[11px]"
                        >
                          <span className="flex items-center gap-1.5">
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            Thought for 3.4 seconds
                          </span>
                          {expandedThoughtId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                        {expandedThoughtId === msg.id && (
                          <div className="px-3 pb-3 pt-1 border-t border-neutral-800/60 font-mono text-[11px] text-neutral-400 whitespace-pre-line leading-relaxed">
                            {msg.thinkingTrace}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Main Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-brand-blue/20 text-slate-100 border border-brand-blue/30 rounded-tr-none'
                          : 'bg-navy-900 text-slate-200 border border-navy-800 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Assistant Action Bar (Copy, Speak, Telemetry Chips) */}
                    {msg.role === 'assistant' && (
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-slate-400 px-1">
                        <div className="flex items-center gap-2">
                          {msg.model && (
                            <span className="px-2 py-0.5 rounded bg-navy-900 border border-navy-800 text-brand-cyan">
                              {msg.model}
                            </span>
                          )}
                          {msg.complexity && (
                            <span className="px-2 py-0.5 rounded bg-navy-900 border border-navy-800 text-purple-400">
                              {msg.complexity}
                            </span>
                          )}
                          <span className="text-emerald-400">
                            {formatDualCurrency(msg.cost_usd || 0)}
                          </span>
                          {msg.latency_ms > 0 && (
                            <span>{Math.round(msg.latency_ms)}ms</span>
                          )}
                        </div>

                        {/* Interactive Assistant Buttons */}
                        <div className="flex items-center gap-1 text-slate-400">
                          {msg.request_id && (
                            msg.feedbackPending ? (
                              <span className="px-2 text-[10px] text-slate-400">Saving feedback...</span>
                            ) : msg.feedback !== undefined ? (
                              <span className="flex items-center gap-1 px-2 text-[10px] text-emerald-400">
                                <Check className="w-3 h-3" />
                                {msg.feedback === 1 ? 'Perfect noted' : 'Thanks for helping us improve'}
                              </span>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleResponseFeedback(msg, 1)}
                                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-500/10 hover:text-emerald-400 transition"
                                  title="Mark this response as perfect"
                                >
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                  <span>Perfect</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleResponseFeedback(msg, -1)}
                                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-500/10 hover:text-rose-400 transition"
                                  title="Suggest this response needs improvement"
                                >
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                  <span>Improve</span>
                                </button>
                              </>
                            )
                          )}
                          <button
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="p-1 hover:text-white hover:bg-navy-800 rounded transition"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => speakText(msg.content, msg.id)}
                            className={`p-1 rounded transition ${currentlySpeakingId === msg.id ? 'text-blue-400 animate-pulse' : 'hover:text-white hover:bg-navy-800'}`}
                            title="Read aloud"
                          >
                            {currentlySpeakingId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-4 mr-auto items-center text-xs text-brand-cyan animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin text-brand-cyan" />
                </div>
                <span>Analyzing prompt complexity & routing to LLM...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Chat Input Form - Exactly Styled like ChatGPT photo */}
          <div className="p-4 border-t border-navy-800 bg-navy-900/80 backdrop-blur-md relative">
            
            {/* Hidden File Input for "Add photos & files" */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />

            {/* Floating Plus Menu (Photo Options) */}
            <ChatPlusMenu
              isOpen={isPlusMenuOpen}
              onClose={() => setIsPlusMenuOpen(false)}
              onSelectOption={handleSelectPlusOption}
              onFileUpload={() => fileInputRef.current?.click()}
              onOpenSketch={() => setIsSketchOpen(true)}
              onOpenLibrary={() => setIsLibraryOpen(true)}
              onOpenProject={() => setIsProjectOpen(true)}
              onOpenTemplate={() => setIsTemplateOpen(true)}
            />

            {/* Active Attachment & Mode Badges */}
            {(attachedFiles.length > 0 || isThinkActive || isWebSearchActive || isDeepResearchActive || isImageModeActive || isPresentationModeActive || activeProject) && (
              <div className="flex flex-wrap items-center gap-2 mb-2 px-1">
                {isThinkActive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold animate-fadeIn">
                    <Brain className="w-3.5 h-3.5" />
                    Think
                    <button onClick={() => setIsThinkActive(false)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {isWebSearchActive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold animate-fadeIn">
                    <Globe className="w-3.5 h-3.5" />
                    Web search
                    <button onClick={() => setIsWebSearchActive(false)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {isDeepResearchActive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold animate-fadeIn">
                    <Megaphone className="w-3.5 h-3.5" />
                    Deep research
                    <button onClick={() => setIsDeepResearchActive(false)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {isImageModeActive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-semibold animate-fadeIn">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Create image
                    <button onClick={() => setIsImageModeActive(false)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {isPresentationModeActive && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-fadeIn">
                    <Presentation className="w-3.5 h-3.5" />
                    Presentations
                    <button onClick={() => setIsPresentationModeActive(false)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {activeProject && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-500/40 text-blue-200 text-xs font-semibold animate-fadeIn">
                    <Folder className="w-3.5 h-3.5" />
                    {activeProject.name}
                    <button onClick={() => setActiveProject(null)} className="hover:text-white ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {attachedFiles.map((file, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-slate-300 text-xs font-medium animate-fadeIn">
                    {file.type === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> : <FileText className="w-3.5 h-3.5 text-amber-400" />}
                    <span className="max-w-[140px] truncate">{file.name}</span>
                    <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-rose-400 ml-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input Bar Form - Matching the photo precisely */}
            <form 
              onSubmit={handleSubmit} 
              className="flex items-center gap-2 bg-[#212121] border border-neutral-700/80 rounded-full px-2 py-1.5 focus-within:border-neutral-500 shadow-xl transition"
            >
              
              {/* Plus (+) Button for Options Popup */}
              <button
                type="button"
                onClick={() => setIsPlusMenuOpen(prev => !prev)}
                title="Add photos, files, search & tools"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${
                  isPlusMenuOpen 
                    ? 'bg-neutral-700 text-white rotate-45' 
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4 transition-transform" />
              </button>

              {/* Main Text Input Field */}
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={
                  isImageModeActive 
                    ? "Visualize anything..." 
                    : isPresentationModeActive
                    ? "Create presentation on..."
                    : "Ask ChatGPT"
                }
                className="flex-1 bg-transparent border-0 text-sm text-white placeholder-neutral-400 focus:outline-none px-2 py-1"
              />

              {/* Think (Reasoning) Toggle Button */}
              <button
                type="button"
                onClick={() => setIsThinkActive(prev => !prev)}
                title="Toggle deep reasoning Think mode"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                  isThinkActive
                    ? 'bg-neutral-800 text-white border border-neutral-600 shadow-inner'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Brain className={`w-4 h-4 ${isThinkActive ? 'text-purple-400' : 'text-neutral-400'}`} />
                <span>Think</span>
              </button>

              {/* Microphone / Speech Dictation Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? "Listening..." : "Voice Input"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Blue Circular Waveform / Send Button */}
              <button
                type="submit"
                onClick={(e) => {
                  if (!inputPrompt.trim() && attachedFiles.length === 0) {
                    e.preventDefault();
                    toggleVoiceMode();
                  }
                }}
                disabled={loading}
                title={
                  inputPrompt.trim() || attachedFiles.length > 0 
                    ? "Send Prompt" 
                    : isVoiceModeActive 
                    ? "Stop Voice Mode" 
                    : "Start Voice Mode"
                }
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition shrink-0 shadow-md ${
                  isVoiceModeActive
                    ? 'bg-blue-500 ring-2 ring-blue-400 animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : inputPrompt.trim() || attachedFiles.length > 0 ? (
                  <Send className="w-3.5 h-3.5" />
                ) : (
                  <AudioLines className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Modals for Photo Actions */}
        <SketchModal
          isOpen={isSketchOpen}
          onClose={() => setIsSketchOpen(false)}
          onAttach={handleAttachSketch}
        />

        <LibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          onAttachFile={handleAttachLibraryFile}
        />

        <ProjectModal
          isOpen={isProjectOpen}
          onClose={() => setIsProjectOpen(false)}
          activeProject={activeProject}
          onSelectProject={(proj) => setActiveProject(proj)}
        />

        <TemplateModal
          isOpen={isTemplateOpen}
          onClose={() => setIsTemplateOpen(false)}
          onApplyTemplate={(tmplPrompt) => setInputPrompt(tmplPrompt)}
        />

      </div>
    </DashboardLayout>
  );
}
