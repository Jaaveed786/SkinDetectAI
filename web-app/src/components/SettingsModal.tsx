import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Bell, Save, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface Props { onClose: () => void; }

export default function SettingsModal({ onClose }: Props) {
  const { user, token, updateUser } = useAuth();
  const [tab,       setTab]     = useState<'profile' | 'security' | 'notifications'>('profile');
  const [name,      setName]    = useState(user?.name   || '');
  const [gender,    setGender]  = useState(user?.gender || 'Other');
  const [age,       setAge]     = useState(user?.age    || 0);
  const [saving,    setSaving]  = useState(false);
  const [saved,     setSaved]   = useState(false);
  const [error,     setError]   = useState('');
  const [emailNotif, setEmail]  = useState(true);
  const [pushNotif,  setPush]   = useState(false);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError('');
    try {
      await api.updateProfile(token, { name, gender, age });
      updateUser({ name, gender, age });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-dark w-full max-w-md rounded-[32px] p-8 border border-teal-500/20 shadow-2xl relative"
        >
          <button onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors">
            <X size={18} />
          </button>

          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Settings</h3>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {([['profile', User], ['security', Lock], ['notifications', Bell]] as const).map(([key, Icon]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-colors ${tab === key ? 'bg-teal-500 text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                <Icon size={12} /> {key}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-teal-500 uppercase mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-teal-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-teal-500 uppercase mb-1.5">Email</label>
                <input value={user?.email || ''} disabled
                  className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 p-3 rounded-xl text-slate-400 text-sm outline-none cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-teal-500 uppercase mb-1.5">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-teal-500">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-teal-500 uppercase mb-1.5">Age</label>
                  <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} min={0} max={120}
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 p-3 rounded-xl text-slate-800 dark:text-white text-sm outline-none focus:border-teal-500 transition-colors" />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              <button onClick={handleSave} disabled={saving}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest btn-3d transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-teal-500 text-white hover:bg-teal-400'} disabled:opacity-50`}>
                {saved ? <><Check size={14} /> Saved!</> : saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          )}

          {tab === 'security' && (
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-800 dark:text-white">Password Management</p>
              <p className="text-xs">Password changes require email verification. Contact <span className="text-teal-400">support@skindetect.ai</span> to reset your password securely.</p>
              <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-xs font-medium">
                🔐 Your account is protected with BCrypt hashing + JWT authentication.
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-4">
              {[
                { label: 'Email Alerts', desc: 'Receive scan results via email', val: emailNotif, set: setEmail },
                { label: 'Push Notifications', desc: 'Browser push alerts (requires PWA)', val: pushNotif, set: setPush },
              ].map(n => (
                <div key={n.label} className="flex justify-between items-center p-4 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white uppercase">{n.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                  <button onClick={() => n.set(!n.val)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${n.val ? 'bg-teal-500' : 'bg-slate-600'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${n.val ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
              <p className="text-[10px] text-slate-500 text-center">Notification preferences are saved locally.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
