import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-48 h-48 rounded-full bg-teal-500/10 blur-xl animate-float" />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-brand-coral/10 blur-xl animate-float" style={{ animationDelay: '-3s' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-dark p-12 md:p-16 rounded-[40px] shadow-2xl border border-teal-500/20 max-w-xl w-full"
      >
        <AlertTriangle className="w-20 h-20 text-brand-coral mx-auto mb-6 animate-bounce" />
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-300 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4 uppercase tracking-widest">
          Page Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold uppercase text-sm hover:bg-teal-500/10 transition-colors"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-500 text-white font-black uppercase text-sm hover:bg-teal-400 transition-colors btn-3d"
          >
            <Home size={18} /> Home
          </button>
        </div>
      </motion.div>
    </section>
  );
}
