import { useEffect, useRef, useState } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveCameraScannerProps {
  onCapture: (imageDataUrl: string) => void;
  onCancel: () => void;
}

export default function LiveCameraScanner({ onCapture, onCancel }: LiveCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setHasPermission(false);
      }
    }
    startCamera();

    return () => {
      // Cleanup stream tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Stop stream before popping component
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        onCapture(imageDataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 drop-shadow-md">
          <Camera className="text-brand-coral" /> Live AI Analysis
        </h2>
        <button 
          title="Close Camera"
          onClick={() => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            onCancel();
          }} 
          className="w-10 h-10 rounded-full bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {hasPermission === false ? (
        <div className="text-center text-red-400 bg-red-950/50 p-8 rounded-3xl border border-red-500/30">
          <p className="font-bold mb-2">Camera Access Denied</p>
          <p className="text-xs text-red-400/80 uppercase">Please enable permissions in your browser.</p>
        </div>
      ) : hasPermission === null ? (
        <div className="text-teal-500 flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin" size={32} />
          <span className="text-xs font-black uppercase tracking-widest">Initializing Optics...</span>
        </div>
      ) : (
        <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-video bg-black rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(20,184,166,0.15)] border border-teal-500/20">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* AI HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-8 rounded-3xl relative overflow-hidden">
            <motion.div 
              animate={{ y: ['0%', '100%', '0%'] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50 shadow-[0_0_10px_#2dd4bf]"
            />
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-teal-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-teal-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-teal-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-500 rounded-br-lg" />
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <button 
              title="Capture Scan Focus"
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-[4px] border-teal-500 bg-teal-500/20 flex items-center justify-center hover:bg-teal-500/50 hover:scale-105 transition-all shadow-xl backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-inner" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
