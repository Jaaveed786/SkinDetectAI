import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, User, Mail, Lock, HeartHandshake, CheckCircle, Calendar, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function RegisterPage() {
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob,             setDob]             = useState('');
  const [gender,          setGender]          = useState('Male');
  const [showPw,          setShowPw]          = useState(false);
  const [isFamilyAcc,     setIsFamilyAcc]     = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const passLength = password.length >= 8;
  const passNum    = /\d/.test(password);
  const passMatch  = password === confirmPassword && password.length > 0;

  const calculateAge = (dobStr: string) => {
    const today = new Date(), bday = new Date(dobStr);
    let age = today.getFullYear() - bday.getFullYear();
    if (today.getMonth() < bday.getMonth() || (today.getMonth() === bday.getMonth() && today.getDate() < bday.getDate())) age--;
    return isNaN(age) ? 0 : age;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!passLength || !passNum)  return setError('Password must be 8+ chars with at least one number.');
    if (!passMatch)               return setError('Passwords do not match.');
    if (!name || !email || !dob) return setError('Please fill all required fields.');

    setLoading(true);
    try {
      const age  = calculateAge(dob);
      const data = await api.register(name, email, password, gender, age);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-brand-coral/90 to-slate-900 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-80 h-80 bg-brand-coral/20 rounded-full blur-[100px] blob-bg" />
        <div className="max-w-md relative z-10">
          <UserPlus className="w-16 h-16 text-orange-300 mb-6 animate-float" />
          <h2 className="text-5xl font-black text-white mb-4 uppercase leading-tight">Create Your Account</h2>
          <p className="text-xl text-orange-200 italic font-medium">Start your diagnostic journey today.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full glass-dark p-8 md:p-10 rounded-[40px] shadow-2xl z-10">
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-6 text-center uppercase tracking-widest border-b border-brand-coral/30 pb-4">
            Registration
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 pl-12 rounded-xl text-slate-800 dark:text-white outline-none focus:border-brand-coral text-sm" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
                <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 pl-12 rounded-xl text-slate-800 dark:text-white outline-none focus:border-brand-coral text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
                <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 pl-12 rounded-xl text-slate-800 dark:text-white outline-none focus:border-brand-coral text-sm" />
              </div>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
                <select value={gender} onChange={e => setGender(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 pl-12 rounded-xl text-slate-800 dark:text-white outline-none focus:border-brand-coral text-sm appearance-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {dob && <p className="text-xs text-brand-coral font-bold text-right">Calculated Age: {calculateAge(dob)}</p>}

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
              <input type={showPw ? 'text' : 'password'} placeholder="Create Password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 pl-12 pr-12 rounded-xl text-slate-800 dark:text-white outline-none focus:border-brand-coral text-sm" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-coral">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-coral" size={18} />
              <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full bg-white dark:bg-slate-900/80 border p-3 pl-12 rounded-xl text-slate-800 dark:text-white outline-none text-sm transition-colors ${confirmPassword ? (passMatch ? 'border-green-500' : 'border-red-500') : 'border-slate-300 dark:border-slate-700'}`} />
            </div>

            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
              <span className={passLength ? 'text-green-500' : 'text-slate-400'}>8+ Chars <CheckCircle size={10} className="inline ml-1" /></span>
              <span className={passNum   ? 'text-green-500' : 'text-slate-400'}>Has Number <CheckCircle size={10} className="inline ml-1" /></span>
              <span className={passMatch ? 'text-green-500' : 'text-slate-400'}>Passwords Match <CheckCircle size={10} className="inline ml-1" /></span>
            </div>

            <div className="p-4 rounded-xl border border-brand-coral/30 bg-brand-coral/5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={isFamilyAcc} onChange={e => setIsFamilyAcc(e.target.checked)}
                  className="mt-1 rounded text-brand-coral" />
                <div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                    <HeartHandshake size={16} /> Family Account
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                    Enable health tracking for multiple family members under one account.
                  </p>
                </div>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand-coral text-white font-black py-4 rounded-xl uppercase tracking-widest btn-3d hover:bg-orange-500 transition-colors mt-2 flex justify-center items-center gap-2 disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Sign Up'} <UserPlus size={20} />
            </button>
          </form>

          <button onClick={() => navigate('/login')}
            className="mt-4 w-full text-teal-600 dark:text-teal-400 text-xs font-black uppercase hover:underline flex justify-center">
            Already have an account? Login here
          </button>
        </motion.div>
      </div>
    </section>
  );
}
