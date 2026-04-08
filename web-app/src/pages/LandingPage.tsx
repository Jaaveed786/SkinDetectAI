import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, User, UserPlus, ShieldAlert, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center p-6 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-teal-500/20 blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-orange-500/20 blur-xl animate-float" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute inset-0 blob-bg pointer-events-none -z-10 mix-blend-multiply opacity-50 dark:opacity-30"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl glass-dark p-12 md:p-16 rounded-[40px] shadow-2xl relative z-10 border-t border-l border-teal-500/30"
      >
        <Stethoscope className="w-16 h-16 text-teal-600 dark:text-teal-400 mb-6 animate-float inline-block" />
        <h1 className="text-5xl md:text-7xl mb-6 leading-tight uppercase font-black tracking-tighter text-slate-800 dark:text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">{t('appName')}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
          Real-Time Multi-Label Skin Disease and Cancer Detection System. Empowering preliminary diagnostics with EfficientNet-B7 and Explainable AI.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <button onClick={() => navigate('/login')} className="bg-teal-500 text-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-wider btn-3d hover:bg-teal-400 flex items-center gap-3">
            <User size={20}/> Login
          </button>
          <button onClick={() => navigate('/register')} className="bg-brand-coral text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider btn-3d hover:bg-orange-400 flex items-center gap-3 shadow-[0_10px_20px_rgba(255,127,80,0.3)]">
            <UserPlus size={20}/> Register
          </button>
          <button onClick={() => navigate('/admin')} className="glass text-slate-700 dark:text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/10 flex items-center gap-3 transition-colors">
            <ShieldAlert className="text-teal-600 dark:text-teal-400" size={20}/> Admin Access
          </button>
        </div>
        
        <button 
          onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })} 
          className="mt-16 block w-full text-teal-600 dark:text-teal-400 font-extrabold uppercase text-xs tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors flex flex-col items-center gap-2"
        >
          Meet The Team & Discover Project <ChevronDown className="animate-bounce" />
        </button>
      </motion.div>
    </section>
  );
}
