import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Info, ZoomIn, Download } from 'lucide-react';

interface GradCamViewerProps {
  isOpen: boolean;
  onClose: () => void;
  originalImage: string | null;
  heatmapImage: string | null;
  bbox?: { x: number; y: number; w: number; h: number } | null;
}

import { useState } from 'react';

export default function GradCamViewer({ isOpen, onClose, originalImage, heatmapImage, bbox }: GradCamViewerProps) {
  const [showBBox, setShowBBox] = useState(true);
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-slate-900 border border-teal-500/20 rounded-[40px] shadow-2xl max-w-5xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-teal-500/10 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <Layers className="text-teal-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">AI Grad-CAM Analysis</h3>
                <p className="text-xs font-bold text-teal-500/60 uppercase tracking-widest">Medical Explainability Heatmap</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image Comparison */}
            <div className="space-y-6">
              <div className="relative group rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 aspect-square">
                <img 
                  src={heatmapImage || ''} 
                  alt="Grad-CAM Heatmap" 
                  className="w-full h-full object-cover"
                />
                
                {/* Bounding Box Overlay */}
                {bbox && showBBox && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute border-2 border-dashed border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)] z-10 pointer-events-none"
                    style={{
                      left: `${bbox.x}%`,
                      top: `${bbox.y}%`,
                      width: `${bbox.w}%`,
                      height: `${bbox.h}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-0 bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                      AI Detection
                    </div>
                  </motion.div>
                )}

                <div className="absolute top-4 left-4 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-teal-500/30 flex items-center gap-3">
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">AI Heatmap Layer</span>
                  {bbox && (
                    <button 
                      onClick={() => setShowBBox(!showBBox)}
                      className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border transition-colors ${showBBox ? 'bg-teal-500 text-slate-950 border-teal-500' : 'bg-transparent text-slate-400 border-slate-700 hover:border-teal-500'}`}
                    >
                      {showBBox ? 'Discovery ON' : 'Discovery OFF'}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-teal-500/5 border border-teal-500/10 flex gap-4">
                <Info className="text-teal-400 shrink-0" size={20} />
                <p className="text-xs text-slate-400 leading-relaxed">
                  The <span className="text-teal-400 font-bold">Red Zones</span> indicate the specific areas of the lesion that the AI model prioritized during its diagnostic inference. This provides visual validation of the model's focus.
                </p>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Inference Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] font-bold text-teal-500 uppercase mb-1">Method</p>
                      <p className="text-sm font-black text-white">Grad-CAM++</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                      <p className="text-[10px] font-bold text-teal-500 uppercase mb-1">Architecture</p>
                      <p className="text-sm font-black text-white">EfficientNet-B7</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Detection Logic</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Feature Activation', val: '89.4%', color: 'bg-teal-500' },
                      { label: 'Gradient Integrity', val: '97.2%', color: 'bg-emerald-500' },
                      { label: 'Map Confidence', val: '94.0%', color: 'bg-blue-500' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-[10px] font-bold mb-2">
                          <span className="text-slate-400 uppercase">{item.label}</span>
                          <span className="text-white">{item.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: item.val }} 
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button className="flex-grow flex items-center justify-center gap-2 bg-teal-500 text-slate-950 font-black text-xs uppercase py-4 rounded-2xl hover:bg-teal-400 transition-all btn-3d">
                  <Download size={16} /> Save Analysis
                </button>
                <button className="px-6 flex items-center justify-center gap-2 bg-slate-800 text-white font-black text-xs uppercase rounded-2xl hover:bg-slate-700 transition-all">
                  <ZoomIn size={16} /> full view
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
