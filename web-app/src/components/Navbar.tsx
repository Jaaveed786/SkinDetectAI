import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Globe, Sun, Moon, Monitor, LogOut, FileText, Settings, HeartPulse, ShieldCheck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from './SettingsModal';

const Navbar = () => {
  const nav = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, logout, user } = useAuth();
  
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const themeIcon = theme === 'system' ? <Monitor size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />;

  const toggleTheme = () => {
    if (theme === 'system') setTheme('dark');
    else if (theme === 'dark') setTheme('light');
    else setTheme('system');
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    nav('/');
  };

  return (
    <nav className="flex justify-between items-center p-4 md:p-6 border-b border-teal-800/10 dark:border-teal-800/50 glass-dark sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <Link to="/" className="text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
        <Activity className="text-brand-coral shrink-0 float-anim" size={28} />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-200">{t('appName')}</span>
      </Link>
      
      <div className="flex items-center gap-4 text-xs font-black uppercase relative">
        
        {/* Admin Link (Desktop Only) */}
        {isAuthenticated && user?.role === 'admin' && (
          <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all group">
            <ShieldCheck size={16} className="group-hover:rotate-12 transition-transform" /> Admin Panel
          </Link>
        )}
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          title="Toggle Theme"
          className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          {themeIcon}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
          >
            <Globe size={16} /> {language.toUpperCase()}
          </button>
          
          <AnimatePresence>
            {langOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col font-sans"
              >
                {['en', 'hi', 'te', 'ta', 'kn', 'ml', 'bn'].map((l) => (
                  <button 
                    key={l}
                    onClick={() => { setLanguage(l as any); setLangOpen(false); }}
                    className={`px-4 py-3 text-left hover:bg-teal-50 dark:hover:bg-slate-800 transition-colors ${language === l ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी (Hindi)' : l === 'te' ? 'తెలుగు (Telugu)' : l === 'ta' ? 'தமிழ் (Tamil)' : l === 'kn' ? 'ಕನ್ನಡ (Kannada)' : l === 'ml' ? 'മലയാളം (Malayalam)' : 'বাংলা (Bengali)'}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth / Profile Area */}
        {!isAuthenticated ? (
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => nav('/login')} className="px-5 py-2.5 rounded-xl border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-all btn-3d bg-white dark:bg-slate-900">
              Login
            </button>
            <button onClick={() => nav('/register')} className="px-5 py-2.5 rounded-xl bg-brand-coral text-white hover:bg-orange-500 transition-all btn-3d border border-transparent">
              Register
            </button>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 transition-colors"
            >
              <User size={16} /> <span className="hidden sm:inline">{user?.name}</span>
            </button>
            
            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col font-sans normal-case font-medium"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  
                  <div className="p-2 flex flex-col gap-1 text-slate-600 dark:text-slate-300">
                    <button onClick={() => { setProfileOpen(false); nav(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left text-sm">
                      <User size={16} /> {user?.role === 'admin' ? 'Admin Portal' : 'My Profile'}
                    </button>
                    <button onClick={() => { setProfileOpen(false); nav('/dashboard'); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left text-sm">
                      <HeartPulse size={16} /> Health Tracker
                    </button>
                    <button onClick={() => { setProfileOpen(false); setSettingsOpen(true); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left text-sm">
                      <Settings size={16} /> Edit Details
                    </button>
                    <button onClick={() => { setProfileOpen(false); setSettingsOpen(true); }} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left text-sm mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                      <FileText size={16} /> Change Password
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left text-sm font-bold">
                      <LogOut size={16} /> {t('logout')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsModal onClose={() => setSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
