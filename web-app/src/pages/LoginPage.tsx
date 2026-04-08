import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fingerprint, Eye, EyeOff, Mail, ArrowRight, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function LoginPage() {
  const [showPw,    setShowPw]    = useState(false);
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(email, password);
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen relative overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-900 to-slate-900 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1920')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl blob-bg" />
        <div className="max-w-md relative z-10">
          <Fingerprint className="w-16 h-16 text-teal-400 mb-6 animate-float" />
          <h2 className="text-5xl font-black text-white mb-4 uppercase leading-tight">Secure Access Portal</h2>
          <p className="text-xl text-teal-200 italic font-medium">Early Detection, Better Protection.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-slate-50 dark:bg-slate-900 transition-colors">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-dark p-10 rounded-[40px] shadow-2xl z-10">
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-8 text-center uppercase tracking-widest border-b border-teal-500/20 pb-4">
            User Login
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="user@example.com"
                className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-teal-800 p-4 rounded-xl outline-none text-slate-800 dark:text-white focus:border-teal-500 transition-colors shadow-inner" />
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-600 dark:text-teal-400 uppercase mb-2">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-teal-800 p-4 pr-12 rounded-xl outline-none text-slate-800 dark:text-white focus:border-teal-500 transition-colors shadow-inner" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500">
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-teal-500 text-white dark:text-slate-900 font-black py-4 rounded-xl uppercase tracking-widest btn-3d hover:bg-teal-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex gap-4">
              <button onClick={() => window.open('https://github.com', '_blank')}
                className="flex-1 glass py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm font-bold text-slate-700 dark:text-white">
                <Mail size={18} /> Google SSO
              </button>
            </div>
            <button onClick={() => navigate('/register')}
              className="w-full mt-4 text-teal-600 dark:text-teal-400 text-xs font-black uppercase hover:underline flex justify-center items-center gap-2">
              <UserPlus size={14} /> Create New Account
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
