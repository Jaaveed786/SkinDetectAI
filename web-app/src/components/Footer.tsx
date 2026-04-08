import { useLocation } from 'react-router-dom';
import { Mail, Phone, Linkedin, Github, FileCode, Server, Database, Shield, Brain, Laptop, DatabaseZap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isMinimal = location.pathname.includes('/dashboard') || location.pathname.includes('/results');

  return (
    <footer className="border-t border-emerald-800/10 dark:border-emerald-800/50 bg-white dark:bg-emerald-950/90 z-20 relative transition-colors duration-300">
      
      {/* About Us Section */}
      {!isMinimal && (
        <section id="about-us" className="p-10 lg:p-20 border-b border-emerald-900/10 dark:border-emerald-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-teal-500/10 group-hover:scale-110 transition-transform"><Brain size={120} /></div>
            <h3 className="text-xl font-black text-teal-600 dark:text-teal-400 uppercase mb-4 tracking-widest border-b border-teal-500/20 pb-2 relative z-10">What is Skin Detect?</h3>
            <p className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed font-medium relative z-10">
              A real-time, multi-label diagnostic support system utilizing advanced deep learning (EfficientNet-B7) to provide preliminary assessments for various dermatological conditions, empowering users with instant health insights and heatmaps.
            </p>
          </div>
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-brand-coral/10 group-hover:scale-110 transition-transform"><Laptop size={120} /></div>
            <h3 className="text-xl font-black text-brand-coral uppercase mb-4 tracking-widest border-b border-brand-coral/20 pb-2 relative z-10">Why Use It?</h3>
            <p className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed font-medium relative z-10">
              Early detection dramatically increases survival rates for malignant conditions like Melanoma. This platform democratizes clinical-level AI analysis, delivering fast, localized predictions using just a standard smartphone camera.
            </p>
          </div>
          <div className="glass p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:scale-110 transition-transform"><Shield size={120} /></div>
            <h3 className="text-xl font-black text-amber-500 uppercase mb-4 tracking-widest border-b border-amber-500/20 pb-2 relative z-10">Key Advantages</h3>
            <ul className="text-sm text-slate-600 dark:text-emerald-100/80 leading-relaxed font-medium list-disc list-inside space-y-2 relative z-10">
              <li>Instant Explainable AI Context via Grad-CAM</li>
              <li>Secure, Encrypted Family Health Tracker</li>
              <li>Live Indian Multi-Lingual Support</li>
              <li>Local Dermatologist Recommender Network</li>
              <li>Downloadable Encrypted Medical PDFs</li>
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* Team Section */}
      {!isMinimal && (
      <section className="p-10 lg:p-20 border-b border-emerald-900/10 dark:border-emerald-900/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="mb-16 w-full flex flex-col items-center">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-6 border-b border-emerald-800/20 dark:border-emerald-800 pb-2 inline-block shadow-sm">Project Guide</h3>
            <div className="glass p-8 rounded-3xl border border-emerald-700/10 dark:border-emerald-700 flex flex-col md:flex-row items-center gap-6 max-w-2xl transform hover:scale-[1.02] transition-all w-full justify-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-800/80 flex items-center justify-center text-4xl shadow-md border-4 border-emerald-200 dark:border-emerald-600 flex-shrink-0">
                👩‍🏫
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-3xl font-black text-emerald-800 dark:text-amber-500 drop-shadow-sm">Mrs. B. Sirisha</h4>
                <p className="text-emerald-600 dark:text-emerald-300 font-bold uppercase text-xs tracking-widest mb-1">MTech, Assistant Professor</p>
                <div className="text-slate-600 dark:text-emerald-100 text-[10px] uppercase font-black tracking-widest mt-2 border-t border-emerald-800/20 pt-2">
                  <p>Dept. of Computer Science and Engineering (Data Science)</p>
                  <p className="text-slate-800 dark:text-white mt-1 text-xs">Sri Venkateshwara Institute of Technology (SVIT)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase mb-8 border-b border-emerald-800/20 dark:border-emerald-800 pb-2 inline-block shadow-sm text-center w-full">Development Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMemberCard id="229F1A3235" name="M. Jaaveed" role="Project Lead & Architect" icon={<Shield size={24}/>} />
              <TeamMemberCard id="229F1A3211" name="B. Manoj kumar Reddy" role="Frontend / App Dev" icon={<Laptop size={24}/>} />
              <TeamMemberCard id="229F1A3239" name="N. Krishna Sai" role="AI / ML Engineer" icon={<Brain size={24}/>} />
              <TeamMemberCard id="229F1A3249" name="S. Raghu" role="Backend & API Dev" icon={<Server size={24}/>} />
              <TeamMemberCard id="229F1A3246" name="S. M. Kiran" role="Database & DevOps" icon={<DatabaseZap size={24}/>} />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Technical Resources */}
      {!isMinimal && (
      <section className="p-10 border-b border-emerald-900/10 dark:border-emerald-900/50 bg-slate-50 dark:bg-emerald-950/40">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase mb-6 text-center tracking-widest">Technical Resources</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://github.com/skindetect" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-xs font-bold text-slate-700 dark:text-emerald-300 hover:bg-teal-500/10 transition-colors uppercase tracking-widest shadow-sm"><FileCode size={16}/> API Documentation</a>
            <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-xs font-bold text-slate-700 dark:text-brand-coral hover:bg-orange-500/10 transition-colors uppercase tracking-widest shadow-sm"><Server size={16}/> System Architecture</a>
            <a href="https://www.kaggle.com/datasets" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass text-xs font-bold text-slate-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors uppercase tracking-widest shadow-sm"><Database size={16}/> Datasets & Weights</a>
          </div>
        </div>
      </section>
      )}

      {/* Contact & Socials */}
      <section id="contact-us" className="p-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-teal-600 dark:text-amber-400 font-black uppercase text-xs mb-4 tracking-widest">Get in Touch</h4>
          <div className="space-y-4 text-[11px] font-black uppercase tracking-widest flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-teal-600 dark:text-amber-500" />
              <a href="mailto:mullajaaveed786@gmail.com" className="hover:underline text-slate-600 dark:text-emerald-100">mullajaaveed786@gmail.com</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-teal-600 dark:text-amber-500" />
              <span className="text-slate-600 dark:text-emerald-100">+91 9912123119</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-teal-600 dark:text-amber-400 font-black uppercase text-xs mb-4 tracking-widest">Network</h4>
          <div className="flex gap-4 text-slate-600 dark:text-emerald-100">
            <button title="LinkedIn" className="w-10 h-10 rounded-full border border-slate-300 dark:border-emerald-700 flex items-center justify-center hover:bg-teal-600 dark:hover:bg-amber-500 hover:text-white dark:hover:text-slate-900 transition-all">
              <Linkedin className="w-4 h-4" />
            </button>
            <button title="GitHub" className="w-10 h-10 rounded-full border border-slate-300 dark:border-emerald-700 flex items-center justify-center hover:bg-teal-600 dark:hover:bg-amber-500 hover:text-white dark:hover:text-slate-900 transition-all">
              <Github className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-end items-center md:items-end text-[10px] font-black text-slate-400 dark:text-emerald-800 uppercase tracking-[0.2em] md:tracking-[0.5em] mt-8 md:mt-0 text-center md:text-right w-full">
          © {currentYear} skin detect ai your skin dermatologist
        </div>
      </section>
    </footer>
  );
}

function TeamMemberCard({ id, name, role, icon }: { id: string, name: string, role: string, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-[20px] border border-slate-200 dark:border-emerald-700 hover:-translate-y-2 transition-transform duration-300 shadow-sm dark:shadow-[0_15px_40px_rgba(0,0,0,0.4)] text-center flex flex-col items-center relative overflow-hidden group">
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-teal-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="w-14 h-14 bg-teal-50 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-teal-600 dark:text-amber-400 mb-4 border border-teal-200 dark:border-emerald-700">
        {icon}
      </div>
      <span className="bg-teal-100 dark:bg-amber-500/20 text-teal-700 dark:text-amber-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-teal-200 dark:border-amber-500/30 mb-2">{id}</span>
      <h4 className="text-xl font-black text-slate-800 dark:text-white mt-2 mb-1 leading-tight">{name}</h4>
      <p className="text-brand-coral dark:text-teal-400 text-[10px] font-bold uppercase tracking-widest">{role}</p>
      
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-emerald-800/50 w-full flex flex-col items-center px-4">
        <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-emerald-400">CSE (Data Science)</p>
        <p className="text-[9px] uppercase font-bold text-slate-400 dark:text-emerald-600 group-hover:text-slate-600 dark:group-hover:text-emerald-300 transition-colors">SVIT</p>
      </div>
    </div>
  );
}
