import { X, Calendar, Activity, Shield, Thermometer, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props {
  user: any;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUserDetailModal({ user, token, isOpen, onClose }: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user && token) {
      setLoading(true);
      api.adminGetUserHistory(user.id, token)
        .then((res: any) => setHistory(res.history || []))
        .finally(() => setLoading(false));
    }
  }, [isOpen, user, token]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-teal-500/30 rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-3xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-teal-500/10 flex justify-between items-center bg-gradient-to-r from-teal-500/5 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl font-black">
                {user.name?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h2>
                <p className="text-teal-500/70 text-xs font-bold uppercase tracking-widest">{user.email}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Gender</p>
                <p className="text-white font-bold">{user.gender || 'Not specified'}</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Age</p>
                <p className="text-white font-bold">{user.age || '—'} Years</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Status</p>
                <p className={`font-black uppercase text-xs ${user.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {user.status}
                </p>
              </div>
            </div>

            <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Calendar size={14} /> Diagnostic Timeline
            </h3>

            {loading ? (
              <div className="p-20 text-center text-slate-500 text-sm font-bold animate-pulse">
                Fetching clinical history...
              </div>
            ) : history.length === 0 ? (
              <div className="p-20 text-center bg-slate-950/30 rounded-3xl border border-dashed border-slate-800">
                <Activity size={32} className="mx-auto mb-4 text-slate-700" />
                <p className="text-slate-500 text-xs font-black uppercase">No scan data recorded for this patient</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((scan) => (
                  <div key={scan.id} className="bg-slate-950/50 border border-slate-800/50 rounded-3xl p-6 hover:border-teal-500/30 transition-all group">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border
                            ${scan.risk_level === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              scan.risk_level === 'High Risk' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                              scan.risk_level === 'Moderate Risk' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {scan.risk_level}
                          </span>
                          <span className="text-slate-500 text-[10px] font-bold flex items-center gap-1">
                            <Clock size={10} /> {new Date(scan.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-white uppercase mb-2">{scan.disease}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                          <div className="flex items-center gap-1"><Shield size={12} className="text-teal-500" /> AI Conf: {scan.confidence}</div>
                          <div className="flex items-center gap-1"><Thermometer size={12} className="text-teal-500" /> Symptoms: {scan.symptoms?.length || 0}</div>
                        </div>
                        {scan.symptoms?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {scan.symptoms.map((s: string, idx: number) => (
                              <span key={idx} className="bg-slate-800 text-slate-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-slate-700">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="lg:w-32 lg:h-32 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-slate-600 font-bold uppercase">
                        IMAGE HASH: {scan.filename?.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-950 border-t border-teal-500/10 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Authorized Clinical Review Portal &copy; 2026 SkinDetect.AI
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
