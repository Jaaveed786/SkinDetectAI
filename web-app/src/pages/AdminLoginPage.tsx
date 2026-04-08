import { ShieldAlert, Eye, EyeOff, Lock, Home, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      if (data.user.role !== 'admin') {
        throw new Error('Access denied: You do not have administrator privileges.');
      }
      login(data.token, data.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-slate-900 relative overflow-hidden">
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full glass-dark p-12 rounded-[40px] border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center z-10 relative"
      >
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-widest">
          <span className="text-red-500">Admin</span> Portal
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-400 text-xs font-bold text-left">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <input 
            type="text" 
            title="Admin Username"
            placeholder="Admin Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700 p-4 rounded-xl mb-4 text-white outline-none focus:border-red-500 transition-colors shadow-inner text-center font-medium"
            required
          />
          <div className="relative mb-8">
            <input 
              type={showPassword ? 'text' : 'password'} 
              title="Admin Password"
              placeholder="Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 p-4 rounded-xl outline-none text-white focus:border-red-500 transition-colors shadow-inner text-center font-medium"
              required
            />
            <button
              title="Toggle Password Visibility"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 text-white font-black py-4 rounded-xl uppercase tracking-widest btn-3d hover:bg-red-500 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authorize Access'} <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </form>
      </motion.div>
      
      <button 
        title="Return Home"
        onClick={() => navigate('/')} 
        className="mt-10 text-slate-500 hover:text-white uppercase text-xs font-black tracking-widest transition-colors z-10 flex items-center gap-2"
      >
        <Home size={14} /> Return Home
      </button>
    </section>
  );
}
