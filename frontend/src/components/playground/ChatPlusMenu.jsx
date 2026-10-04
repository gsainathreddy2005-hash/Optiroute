import React, { useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Library, 
  Image as ImageIcon, 
  Folder, 
  Globe, 
  PenLine, 
  Brain, 
  Megaphone, 
  LayoutGrid, 
  Presentation 
} from 'lucide-react';

export default function ChatPlusMenu({ 
  isOpen, 
  onClose, 
  onSelectOption, 
  onFileUpload, 
  onOpenSketch,
  onOpenLibrary,
  onOpenProject,
  onOpenTemplate
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      id: 'photos_files',
      title: 'Add photos & files',
      desc: 'Upload from computer',
      icon: Paperclip,
      iconColor: 'text-neutral-300',
      action: () => onFileUpload()
    },
    {
      id: 'library',
      title: 'Add library files',
      desc: 'Browse and search your files',
      icon: Library,
      iconColor: 'text-neutral-300',
      action: () => onOpenLibrary()
    },
    {
      id: 'create_image',
      title: 'Create image',
      desc: 'Visualize anything',
      icon: ImageIcon,
      iconColor: 'text-cyan-400',
      action: () => onSelectOption('create_image')
    },
    {
      id: 'project',
      title: 'Work in a project',
      desc: 'Start a chat in a project',
      icon: Folder,
      iconColor: 'text-neutral-300',
      action: () => onOpenProject()
    },
    {
      id: 'web_search',
      title: 'Web search',
      desc: 'Find real-time news and info',
      icon: Globe,
      iconColor: 'text-cyan-400',
      action: () => onSelectOption('web_search')
    },
    {
      id: 'sketch',
      title: 'Sketch',
      desc: 'Draw and attach an image',
      icon: PenLine,
      iconColor: 'text-neutral-300',
      action: () => onOpenSketch()
    },
    {
      id: 'thinking',
      title: 'Thinking',
      desc: 'For detailed answers',
      icon: Brain,
      iconColor: 'text-neutral-300',
      action: () => onSelectOption('thinking')
    },
    {
      id: 'deep_research',
      title: 'Deep research',
      desc: 'Get a detailed report',
      icon: Megaphone,
      iconColor: 'text-blue-400',
      action: () => onSelectOption('deep_research')
    },
    {
      id: 'template_creator',
      title: 'Template Creator',
      desc: 'Create reusable templates saved as personal skills',
      icon: LayoutGrid,
      iconColor: 'text-neutral-300',
      action: () => onOpenTemplate()
    },
    {
      id: 'presentations',
      title: 'Presentations',
      desc: 'Create and edit presentations',
      icon: Presentation,
      iconColor: 'text-amber-500',
      action: () => onSelectOption('presentations')
    }
  ];

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-full mb-3 left-0 w-80 sm:w-[420px] bg-[#212121] border border-neutral-700/80 rounded-3xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-fadeIn p-2"
    >
      <div className="space-y-0.5">
        {menuItems.map((item) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.action();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-[#2f2f2f] transition text-left group"
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <IconComp className={`w-4 h-4 ${item.iconColor}`} />
              </div>

              <div className="flex items-baseline gap-2 min-w-0 flex-1 truncate">
                <span className="text-xs font-semibold text-white tracking-tight shrink-0">
                  {item.title}
                </span>
                <span className="text-[11px] text-neutral-400 truncate">
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
