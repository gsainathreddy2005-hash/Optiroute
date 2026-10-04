import React, { useState } from 'react';
import { X, Search, FileText, FileSpreadsheet, FileCode, Check, Plus, Folder } from 'lucide-react';

const SAMPLE_LIBRARY_FILES = [
  { id: 1, name: 'OptiRoute_System_Architecture.pdf', size: '2.4 MB', type: 'doc', updated: 'Today' },
  { id: 2, name: 'LLM_Benchmark_Cost_Analysis_2026.csv', size: '840 KB', type: 'spreadsheet', updated: 'Yesterday' },
  { id: 3, name: 'ML_Prompt_Complexity_Classifier.ipynb', size: '1.2 MB', type: 'code', updated: '3 days ago' },
  { id: 4, name: 'FastAPI_Service_Contracts.json', size: '320 KB', type: 'code', updated: 'Last week' },
  { id: 5, name: 'Enterprise_Security_Compliance.docx', size: '1.8 MB', type: 'doc', updated: '2 weeks ago' }
];

export default function LibraryModal({ isOpen, onClose, onAttachFile }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [libraryFiles, setLibraryFiles] = useState(SAMPLE_LIBRARY_FILES);
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  if (!isOpen) return null;

  const filteredFiles = libraryFiles.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (file) => {
    if (selectedFileIds.includes(file.id)) {
      setSelectedFileIds(selectedFileIds.filter(id => id !== file.id));
    } else {
      setSelectedFileIds([...selectedFileIds, file.id]);
    }
  };

  const handleAttach = () => {
    const filesToAttach = libraryFiles.filter(f => selectedFileIds.includes(f.id));
    filesToAttach.forEach(f => {
      onAttachFile({
        name: f.name,
        size: f.size,
        type: 'doc'
      });
    });
    setSelectedFileIds([]);
    onClose();
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'code':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#212121] border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-slate-300">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Add library files</h3>
              <p className="text-xs text-neutral-400">Browse and search files from your workspace</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search library files..."
              className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Files List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredFiles.map((file) => {
            const isSelected = selectedFileIds.includes(file.id);
            return (
              <div
                key={file.id}
                onClick={() => toggleSelect(file)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                  isSelected 
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white' 
                    : 'hover:bg-neutral-800/80 text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-neutral-800/90 flex items-center justify-center shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{file.name}</p>
                    <p className="text-[11px] text-neutral-400">{file.size} • Updated {file.updated}</p>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  isSelected 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'border-neutral-700 bg-neutral-900'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}

          {filteredFiles.length === 0 && (
            <div className="p-8 text-center text-xs text-neutral-400">
              No matching files found in your library.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {selectedFileIds.length} {selectedFileIds.length === 1 ? 'file' : 'files'} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAttach}
              disabled={selectedFileIds.length === 0}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-md"
            >
              Attach Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
