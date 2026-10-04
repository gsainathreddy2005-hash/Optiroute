import React, { useRef, useState, useEffect } from 'react';
import { X, Check, Trash2, PenTool, RotateCcw } from 'lucide-react';

export default function SketchModal({ isOpen, onClose, onAttach }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#38bdf8');
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onAttach({
      name: `sketch_${Date.now().toString().slice(-4)}.png`,
      type: 'image/png',
      url: dataUrl
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-bold text-white">Draw & Attach Sketch</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="p-4 flex flex-col items-center gap-3">
          <canvas
            ref={canvasRef}
            width={440}
            height={260}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border border-navy-700 rounded-xl cursor-crosshair shadow-inner bg-navy-950"
          />

          {/* Controls */}
          <div className="w-full flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2">
              {['#38bdf8', '#34d399', '#f43f5e', '#fbbf24', '#ffffff'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBrushColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full border ${
                    brushColor === c ? 'scale-125 border-white shadow' : 'border-transparent opacity-80'
                  }`}
                />
              ))}
              <div className="h-4 w-px bg-navy-800 mx-1" />
              <input
                type="range"
                min="1"
                max="10"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-16 accent-brand-blue cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={clearCanvas}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-navy-800 bg-navy-950/60 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-xs font-bold text-white shadow flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Attach Sketch
          </button>
        </div>
      </div>
    </div>
  );
}
