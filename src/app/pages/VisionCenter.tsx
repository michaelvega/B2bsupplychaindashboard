import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Upload, X, Eye, Bot, Send, FileText, ChevronDown, ChevronUp, 
  Image as ImageIcon, Sparkles, Trash2, ZoomIn, ArrowRight, ScanEye
} from 'lucide-react';
import { cn } from '../components/ui/utils';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

const EXAMPLE_OUTPUT = `## Analysis Results

**3 of 5 labels matched** in the current database.

### ✅ Matched Items
| Label | SKU | Database Status |
|-------|-----|----------------|
| Kraft Corrugated Box 12x12x8 | SKU-4421 | Active |
| White Mailer Box 6x4x3 | SKU-1087 | Active |
| Poly Bubble Mailer 10x13 | SKU-3390 | Active |

### ❌ Not Found
- **Brown Tape Roll 2" x 110yd** — No match. Closest: *SKU-8812 (Brown Tape 3" x 110yd)*
- **Custom Printed Label 4x6** — No match. Suggest adding to procurement queue.

### 💡 Recommendation
Consider onboarding the 2 unmatched items through the **Vendor Onboarding** pipeline to avoid future supply gaps.`;

export function VisionCenter() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const newImages: UploadedImage[] = Array.from(files)
      .filter(f => f.type.startsWith('image/') || f.type === 'application/pdf')
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter(i => i.id !== id);
    });
  };

  const handleRun = () => {
    if (images.length === 0 && !prompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasOutput(true);
      setOutputExpanded(true);
    }, 2200);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-stone-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/60 via-indigo-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-stone-100/50 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none bg-[radial-gradient(#94a3b8_0.5px,transparent_0.5px)] [background-size:24px_24px]" />

      {/* Header */}
      <div className="relative z-10 px-8 py-4 border-b border-slate-200/60 bg-white/60 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-2.5 rounded-xl shadow-lg shadow-slate-300/40">
              <ScanEye className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Vision and Document Center</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Image & document analysis pipeline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/80 border border-slate-200 px-3.5 py-2 rounded-full shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Ready
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-stretch p-6 gap-0 overflow-hidden">
        
        {/* LEFT COLUMN — Image Upload */}
        <div className="w-[280px] shrink-0 flex flex-col justify-center pr-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-3 h-3 text-slate-500" />
            </div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Images and Documents</h2>
            {images.length > 0 && (
              <span className="ml-auto text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {images.length}
              </span>
            )}
          </div>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col relative overflow-hidden group max-h-[500px]",
              isDragging 
                ? "border-blue-400 bg-gradient-to-b from-blue-50/90 to-indigo-50/60 shadow-[0_0_40px_rgba(59,130,246,0.12)]" 
                : "border-slate-200/80 bg-white/60 backdrop-blur-sm hover:border-slate-300 hover:bg-white/80 hover:shadow-md",
              images.length === 0 ? "items-center justify-center py-12" : ""
            )}
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            {images.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-6 text-center">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative",
                  isDragging 
                    ? "bg-blue-100 scale-110 shadow-lg shadow-blue-200/50" 
                    : "bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 group-hover:shadow-md group-hover:scale-105"
                )}>
                  <Upload className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isDragging ? "text-blue-500 -translate-y-0.5" : "text-slate-400 group-hover:text-slate-500"
                  )} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600">Drop images and documents here</p>
                  <p className="text-[11px] text-slate-400 mt-1.5">or click to browse files</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {['PNG', 'JPG', 'WEBP', 'PDF'].map(fmt => (
                    <span key={fmt} className="text-[9px] font-bold text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar flex-1">
                <AnimatePresence>
                  {images.map(img => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -10 }}
                      className="relative group/img rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {img.file.type === 'application/pdf' ? (
                        <div className="w-full h-24 bg-slate-50 flex flex-col items-center justify-center gap-1.5 border-b border-slate-100 p-2">
                          <FileText className="w-8 h-8 text-rose-500 animate-pulse" />
                          <span className="text-[10px] text-slate-500 font-semibold px-2 truncate max-w-full">{img.name}</span>
                        </div>
                      ) : (
                        <img 
                          src={img.preview} 
                          alt={img.name} 
                          className="w-full h-24 object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-200 flex items-end justify-between p-2">
                        <p className="text-[10px] text-white font-medium truncate max-w-[60%]">{img.name}</p>
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(img.preview, '_blank'); }}
                            className="bg-white/90 text-slate-600 p-1 rounded-md shadow hover:bg-white transition-colors"
                          >
                            <ZoomIn className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                            className="bg-white/90 text-red-500 p-1 rounded-md shadow hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className="border border-dashed border-slate-200 rounded-xl py-3 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 mt-1">
                  <Upload className="w-3 h-3 mr-1.5" />
                  <span className="text-[11px] font-semibold">Add more</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FLOW CONNECTOR LEFT */}
        <div className="flex flex-col items-center justify-center w-10 shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-slate-300" />
            <motion.div
              animate={isProcessing ? { scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500",
                isProcessing ? "bg-indigo-100 border border-indigo-200" : "bg-slate-50 border border-slate-200"
              )}
            >
              <ArrowRight className={cn("w-3 h-3", isProcessing ? "text-indigo-500" : "text-slate-300")} />
            </motion.div>
            <div className="w-px h-16 bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />
          </div>
        </div>

        {/* CENTER COLUMN — Robot + Prompt */}
        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
          
          {/* Robot Orb */}
          <div className="flex flex-col items-center mb-10">
            <motion.div className="relative">
              {/* Outer glow rings */}
              {isProcessing && (
                <>
                  <motion.div
                    className="absolute -inset-4 rounded-full border border-indigo-200/60"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -inset-8 rounded-full border border-indigo-100/40"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}
              
              {/* Main orb */}
              <motion.div
                animate={isProcessing ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-700 relative",
                  isProcessing 
                    ? "bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 shadow-[0_0_60px_rgba(99,102,241,0.35)]" 
                    : hasOutput
                      ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                      : "bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200/80 shadow-lg shadow-slate-200/50"
                )}
              >
                {/* Inner glow */}
                <div className={cn(
                  "absolute inset-1 rounded-full opacity-50",
                  isProcessing 
                    ? "bg-gradient-to-t from-transparent to-white/20" 
                    : hasOutput
                      ? "bg-gradient-to-t from-transparent to-white/20"
                      : "bg-gradient-to-t from-transparent to-white/60"
                )} />
                
                <Bot className={cn(
                  "w-10 h-10 relative z-10 transition-colors duration-500",
                  isProcessing || hasOutput ? "text-white" : "text-slate-400"
                )} />
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div 
                  key="processing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 flex flex-col items-center"
                >
                  <p className="text-sm font-semibold text-indigo-600">Analyzing images & documents...</p>
                  <div className="flex gap-1 mt-2.5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : hasOutput ? (
                <motion.p 
                  key="done"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 text-sm font-semibold text-emerald-600 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Analysis complete
                </motion.p>
              ) : (
                <motion.p 
                  key="idle"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 text-[13px] font-medium text-slate-400"
                >
                  Upload images and documents & describe your task
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Prompt Input */}
          <div className="w-full max-w-lg">
            <div className={cn(
              "bg-white/80 backdrop-blur-md rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm",
              isProcessing 
                ? "border-indigo-200 shadow-indigo-100/50" 
                : "border-slate-200 hover:border-slate-300 hover:shadow-md focus-within:border-blue-300 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
            )}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Look at these box labels and tell me which ones are in our database"
                rows={3}
                className="w-full px-5 py-4 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none resize-none bg-transparent font-medium leading-relaxed"
              />
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/30">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  {images.length > 0 && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-100 text-[10px] font-bold">
                      <ImageIcon className="w-3 h-3" />
                      {images.length} file{images.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleRun}
                  disabled={isProcessing || (images.length === 0 && !prompt.trim())}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-wider",
                    isProcessing
                      ? "bg-indigo-50 text-indigo-400 cursor-not-allowed border border-indigo-100"
                      : images.length > 0 || prompt.trim()
                        ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 shadow-md hover:shadow-lg active:scale-[0.97]"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-150"
                  )}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                      Running
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Run
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FLOW CONNECTOR RIGHT */}
        <div className="flex flex-col items-center justify-center w-10 shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-slate-300" />
            <motion.div
              animate={hasOutput && !isProcessing ? { scale: [1, 1.2, 1] } : isProcessing ? { scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.5, repeat: hasOutput && !isProcessing ? 0 : Infinity }}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-500",
                hasOutput && !isProcessing ? "bg-emerald-100 border border-emerald-200" : isProcessing ? "bg-indigo-100 border border-indigo-200" : "bg-slate-50 border border-slate-200"
              )}
            >
              <ArrowRight className={cn("w-3 h-3", hasOutput && !isProcessing ? "text-emerald-500" : isProcessing ? "text-indigo-500" : "text-slate-300")} />
            </motion.div>
            <div className="w-px h-16 bg-gradient-to-b from-slate-300 via-slate-200 to-transparent" />
          </div>
        </div>

        {/* RIGHT COLUMN — Output */}
        <div className="w-[320px] shrink-0 flex flex-col justify-center pl-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
              <FileText className="w-3 h-3 text-slate-500" />
            </div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output</h2>
          </div>
          
          <div className={cn(
            "bg-white/70 backdrop-blur-sm rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all duration-500 max-h-[500px]",
            hasOutput ? "border-emerald-200/60 shadow-emerald-100/30" : "border-slate-200/80"
          )}>
            {/* Output header toggle */}
            <button
              onClick={() => setOutputExpanded(!outputExpanded)}
              className={cn(
                "flex items-center justify-between px-5 py-3.5 transition-all duration-300 shrink-0",
                outputExpanded ? "border-b border-slate-100 bg-white/50" : "bg-transparent hover:bg-white/50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  {hasOutput ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </>
                  ) : (
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300" />
                  )}
                </span>
                <span className={cn(
                  "text-[11px] font-bold uppercase tracking-widest transition-colors",
                  hasOutput ? "text-slate-700" : "text-slate-400"
                )}>
                  {hasOutput ? "Results" : "Output"}
                </span>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center transition-colors",
                outputExpanded ? "bg-slate-100" : "bg-transparent hover:bg-slate-50"
              )}>
                {outputExpanded 
                  ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> 
                  : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                }
              </div>
            </button>

            {/* Output content */}
            <AnimatePresence>
              {outputExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden flex-1"
                >
                  <div className="p-5 overflow-y-auto custom-scrollbar max-h-[420px]">
                    {hasOutput ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="space-y-0"
                      >
                        {EXAMPLE_OUTPUT.split('\n').map((line, i) => {
                          if (line.startsWith('## ')) return (
                            <h3 key={i} className="text-[14px] font-bold text-slate-900 mt-4 mb-2 first:mt-0">{line.replace('## ', '')}</h3>
                          );
                          if (line.startsWith('### ')) return (
                            <h4 key={i} className="text-[12px] font-bold text-slate-700 mt-4 mb-1.5">{line.replace('### ', '')}</h4>
                          );

                          if (line.startsWith('|') && line.includes('---')) return null;
                          if (line.startsWith('|')) {
                            const cells = line.split('|').filter(Boolean).map(c => c.trim());
                            const headerLineIdx = EXAMPLE_OUTPUT.split('\n').findIndex(l => l.includes('---'));
                            const isHeader = i < headerLineIdx;
                            return (
                              <div key={i} className={cn(
                                "grid grid-cols-3 gap-1 px-3 py-2 text-[11px]",
                                isHeader 
                                  ? "font-bold text-slate-500 bg-slate-50 rounded-t-lg border-b border-slate-200" 
                                  : "border-b border-slate-50 text-slate-600"
                              )}>
                                {cells.map((cell, j) => <span key={j} className="truncate">{cell}</span>)}
                              </div>
                            );
                          }

                          if (line.startsWith('- **')) {
                            const match = line.match(/- \*\*(.*?)\*\*(.*)/);
                            if (match) return (
                              <div key={i} className="flex gap-2 text-[11px] py-1.5 pl-1 leading-relaxed">
                                <span className="text-slate-300 mt-0.5 shrink-0">•</span>
                                <span><strong className="text-slate-700">{match[1]}</strong><span className="text-slate-500">{match[2].replace(/\*/g, '')}</span></span>
                              </div>
                            );
                          }

                          if (line.startsWith('**')) {
                            const match = line.match(/\*\*(.*?)\*\*(.*)/);
                            if (match) return <p key={i} className="text-[12px] text-slate-700 leading-relaxed"><strong className="text-slate-800">{match[1]}</strong>{match[2]}</p>;
                          }

                          if (line.trim()) {
                            const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            return <p key={i} className="text-[11px] text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
                          }
                          return <div key={i} className="h-1.5" />;
                        })}
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full min-h-[240px] text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-150 flex items-center justify-center mb-4 shadow-sm">
                          <FileText className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-400">No output yet</p>
                        <p className="text-[11px] text-slate-300 mt-1.5 max-w-[180px] leading-relaxed">Run the analysis pipeline to see results here</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
