import { motion } from 'framer-motion';
import { X, HeartPulse, Droplets, Utensils, Shirt, Bath, Sparkles, BookOpen } from 'lucide-react';

interface SkinEducationProps {
  onClose: () => void;
}

export default function SkinEducation({ onClose }: SkinEducationProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border border-teal-500/30 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-teal-600 to-teal-500 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-white/20 p-3 rounded-2xl">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Dermatological Health Guide</h2>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Expert advice for healthy skin</p>
            </div>
          </div>
          <button title="Close" onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. About Skin Diseases */}
            <section className="space-y-4">
              <h3 className="text-lg font-black text-teal-600 dark:text-teal-400 uppercase flex items-center gap-2 border-b border-teal-500/10 pb-2">
                <HeartPulse size={20} /> About Skin Diseases
              </h3>
              <div className="space-y-4">
                <div className="glass p-5 rounded-2xl border border-teal-500/10">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase mb-2">What is it?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    Skin diseases are conditions that affect your skin's surface. They can be caused by allergies, irritants, your genetic makeup, or immune system problems.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-teal-500/10">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase mb-2">How it occurs?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    Many skin diseases involve abnormal cell growth or inflammation. Environmental factors like UV radiation, pollutants, and bacterial infections play a significant role.
                  </p>
                </div>
                <div className="glass p-5 rounded-2xl border border-teal-500/10">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase mb-2">How to treat?</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Treatments vary from topical creams and ointments to oral medications and laser therapies. <span className="text-teal-500 font-bold underline">Always consult a doctor before starting treatment.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Lifestyle & Daily Care */}
            <div className="space-y-8">
              
              {/* Bathing & Water */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                  <Droplets className="text-blue-500 mb-3" size={24} />
                  <h4 className="text-xs font-black text-blue-500 uppercase mb-2">Hydration</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Drink 8-10 glasses of water. Hydrated skin is resilient skin.</p>
                </div>
                <div className="p-5 bg-teal-500/5 border border-teal-500/20 rounded-3xl">
                  <Bath className="text-teal-500 mb-3" size={24} />
                  <h4 className="text-xs font-black text-teal-500 uppercase mb-2">Bathing</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Use lukewarm water. Pat skin dry gently; never rub harshly.</p>
                </div>
              </div>

              {/* Diet & Dressing */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
                  <Utensils className="text-orange-500 mb-3" size={24} />
                  <h4 className="text-xs font-black text-orange-500 uppercase mb-2">Diet Advice</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Eat Omega-3 rich foods, walnuts, and green tea for elasticity.</p>
                </div>
                <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-3xl">
                  <Shirt className="text-purple-500 mb-3" size={24} />
                  <h4 className="text-xs font-black text-purple-500 uppercase mb-2">Dressing</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">Wear loose, cotton fabrics. Avoid synthetic fibers that trap heat.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Product & Grooming Guidance */}
          <section className="mt-12 space-y-6">
            <h3 className="text-lg font-black text-brand-coral uppercase flex items-center gap-2 border-b border-brand-coral/10 pb-2">
              <Sparkles size={20} /> Maintenance & Grooming
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Recommended Products</h4>
                <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"/> SPF 30+ Sunscreen</li>
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"/> Ceramide Moisturizers</li>
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"/> pH-Balanced Cleansers</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Skin Products to Avoid</h4>
                <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/> Heavy Fragrances</li>
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/> Denatured Alcohol</li>
                  <li className="flex items-center gap-2 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/> Parabens & Sulfates</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Grooming Tips</h4>
                <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 italic">
                  <li>- Sanitize grooming tools weekly.</li>
                  <li>- Use fresh towels daily for affected areas.</li>
                  <li>- Keep nails short to prevent accidental scratching.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Footer Warning */}
          <div className="mt-12 p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">
              Disclaimer: This guide is powered by general dermatological data. It is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
