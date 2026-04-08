import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, UploadCloud, Camera, History, RefreshCw, CheckCircle2, AlertCircle, ClipboardList, Activity, Zap, Trash2, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api, ScanHistoryItem } from '../services/api';
import DiagnosticMCQForm from '../components/DiagnosticMCQForm';
import LiveCameraScanner from '../components/LiveCameraScanner';
import SkinEducation from '../components/SkinEducation';

export default function UserDashboard() {
  const navigate          = useNavigate();
  const { user, token }   = useAuth();
  const { t }             = useLanguage();

  const [activeTab,     setActiveTab]     = useState<'scan' | 'health'>('scan');
  const [scanStep,      setScanStep]      = useState<'idle' | 'mcq' | 'upload' | 'camera' | 'analyzing'>('idle');
  const [previewUrl,    setPreviewUrl]    = useState<string | null>(null);
  const [cameraOpen,    setCameraOpen]    = useState(false);
  const [history,       setHistory]       = useState<ScanHistoryItem[]>([]);
  const [historyLoading,setHistLoading]   = useState(false);
  const [error,         setError]         = useState('');
  const [mcqSymptoms,   setMcqSymptoms]   = useState<string[]>([]);
  const [dragOver,      setDragOver]      = useState(false);
  const [showEducation, setShowEducation]   = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    setHistLoading(true);
    try {
      const h = await api.getHistory(token);
      setHistory(h);
    } finally {
      setHistLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleFile = (file: File) => {
    setError('');
    setMcqSymptoms([]); // Reset symptoms for new scan
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanStep('mcq'); // Transition to MCQ immediately after upload
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const handleScan = async () => {
    if (!previewUrl) return;
    // Enforce MCQ before analysis
    if (mcqSymptoms.length === 0) {
      setScanStep('mcq');
      return;
    }
    
    setScanStep('analyzing');
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const result = await api.uploadDermoscopicImage(blob, token, mcqSymptoms, 'scan.jpg');
      if (result.error) { setError(result.error); setScanStep('upload'); return; }
      // Pass result to ResultsPage
      sessionStorage.setItem('scan_result', JSON.stringify(result));
      navigate('/results');
    } catch (err: any) {
      setError(err.message || 'Scan failed. Please try again.');
      setScanStep('upload');
    }
  };

  const handleDeleteScan = async (scanId: number) => {
    if (!token || !window.confirm('Are you sure you want to delete this scan record?')) return;
    try {
      await api.deleteScan(scanId, token);
      fetchHistory(); // Refresh
    } catch (err: any) {
      alert('Failed to delete scan: ' + err.message);
    }
  };

  const riskColor = (level: string) => {
    if (level === 'Critical')      return 'text-red-500 border-red-500/30 bg-red-500/10';
    if (level === 'High Risk')     return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    if (level === 'Moderate Risk') return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t('welcomeBack')}, <span className="text-teal-500">{user?.name?.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 text-sm">Your personal dermatological AI dashboard.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowEducation(true)}
            className="hidden md:flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all bg-brand-coral/10 text-brand-coral border border-brand-coral/20 hover:bg-brand-coral hover:text-white group">
            <BookOpen size={14} className="group-hover:rotate-12 transition-transform" /> {t('healthGuide')}
          </button>
          {['scan', 'health'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as 'scan' | 'health')}
              className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'glass text-slate-700 dark:text-white hover:bg-teal-500/10'}`}>
              {tab === 'scan' ? <><ScanLine size={14} className="inline mr-2" />{t('scan')}</> : <><Activity size={14} className="inline mr-2" />Health</>}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'scan' && (
          <motion.div key="scan" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Camera overlay */}
            {cameraOpen && (
              <LiveCameraScanner
                onCapture={(dataUrl) => {
                  setPreviewUrl(dataUrl);
                  setScanStep('upload');
                  setCameraOpen(false);
                }}
                onCancel={() => setCameraOpen(false)}
              />
            )}

            {/* MCQ step */}
            {scanStep === 'mcq' ? (
              <DiagnosticMCQForm
                onComplete={(symptoms: string[]) => { setMcqSymptoms(symptoms); setScanStep('upload'); }}
                onCancel={() => setScanStep('idle')}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload / Preview box */}
                <motion.div className="glass-dark rounded-[32px] p-8 border border-teal-500/20 shadow-xl">
                  <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest mb-6 flex items-center gap-2">
                    <UploadCloud size={18} className="text-teal-400" /> AI Skin Analysis
                  </h3>

                  {scanStep === 'analyzing' ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-teal-500/20 border-t-teal-500 animate-spin" />
                        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500" size={28} />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-sm">Analyzing...</p>
                        <p className="text-slate-400 text-xs mt-1">ABCDE heuristic + AI engine running</p>
                      </div>
                    </div>
                  ) : previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative group w-full aspect-square rounded-2xl overflow-hidden border border-teal-500/20 bg-slate-950">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-teal-400 font-bold">Image ready for analysis</p>
                        </div>
                      </div>
                      {error && (
                        <div className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <AlertCircle size={14} /> {error}
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={handleScan}
                          className="flex-1 bg-teal-500 text-white font-black py-3 rounded-xl uppercase text-xs tracking-widest btn-3d hover:bg-teal-400 transition-colors flex items-center justify-center gap-2">
                          <ScanLine size={16} /> Analyze
                        </button>
                        <button onClick={() => { setPreviewUrl(null); setScanStep('idle'); setError(''); }}
                          className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-coral hover:text-brand-coral transition-colors font-bold text-xs uppercase">
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`w-full aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all cursor-pointer hover:bg-teal-500/5 ${dragOver ? 'border-teal-400 bg-teal-500/10' : 'border-teal-500/30'}`}
                      onClick={() => document.getElementById('fileInput')?.click()}
                    >
                      <UploadCloud className="text-teal-400 w-14 h-14" />
                      <div className="text-center">
                        <p className="font-black text-slate-800 dark:text-white text-sm uppercase">Drop image here</p>
                        <p className="text-slate-500 text-xs mt-1">or click to browse — JPEG, PNG, WebP, BMP</p>
                      </div>
                      <input id="fileInput" type="file" accept="image/*" className="hidden" title="Upload Skin Image"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                    </div>
                  )}

                  {scanStep === 'idle' && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button onClick={() => setCameraOpen(true)}
                        className="flex items-center justify-center gap-2 py-3 glass rounded-xl text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition-colors border border-teal-500/20">
                        <Camera size={14} /> Live Camera
                      </button>
                      <button onClick={() => setScanStep('mcq')}
                        className={`flex items-center justify-center gap-2 py-3 glass rounded-xl text-xs font-black uppercase tracking-wider transition-colors border ${mcqSymptoms.length ? 'text-green-500 border-green-500/30' : 'text-slate-600 dark:text-slate-400 border-slate-500/20 hover:bg-slate-500/10'}`}>
                        <ClipboardList size={14} />
                        {mcqSymptoms.length ? <><CheckCircle2 size={12} /> Symptoms Saved</> : 'Symptom Form'}
                      </button>
                    </div>
                  )}
                </motion.div>

                {/* Scan history */}
                <motion.div className="glass-dark rounded-[32px] p-8 border border-teal-500/20 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
                      <History size={18} className="text-teal-400" /> {t('history')}
                    </h3>
                    <button onClick={fetchHistory} className="text-teal-400 hover:text-teal-300 transition-colors" title="Refresh">
                      <RefreshCw size={14} className={historyLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>

                  {historyLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <RefreshCw size={24} className="animate-spin text-teal-500" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
                      <ScanLine className="text-slate-600 w-12 h-12" />
                      <p className="text-slate-500 text-xs font-black uppercase">{t('noHistory')}</p>
                      <p className="text-slate-600 text-xs">Upload an image above to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {history.map((item, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${riskColor(item.risk_level)} transition-all relative group/item`}>
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wide">{item.disease}</p>
                              <p className="text-slate-500 text-[10px] mt-1 font-mono">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-black uppercase px-2 py-1 rounded-full border whitespace-nowrap">{item.risk_level}</span>
                              <button 
                                onClick={() => item.id && handleDeleteScan(item.id)}
                                className="opacity-0 group-hover/item:opacity-100 p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                title="Delete Record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-2 text-[10px] font-bold text-slate-500">
                            <span>Confidence: <span className="text-teal-500">{item.confidence}</span></span>
                            <span>·</span>
                            <span className="font-mono truncate max-w-[120px]" title={item.filename}>{item.filename}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'health' && (
          <motion.div key="health" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass-dark rounded-[32px] p-8 border border-teal-500/20 shadow-xl">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest mb-6 flex items-center gap-2">
              <Activity size={18} className="text-teal-400" /> Health Profile
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Name',   value: user?.name  || '—' },
                { label: 'Email',  value: user?.email || '—' },
                { label: 'Gender', value: user?.gender || '—' },
                { label: 'Age',    value: user?.age ? `${user.age} yrs` : '—' },
              ].map(f => (
                <div key={f.label} className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-teal-500/10">
                  <p className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase mb-1">{f.label}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-sm text-slate-600 dark:text-slate-400">
              <p className="font-bold text-teal-500 mb-2 uppercase text-xs">AI Usage Summary</p>
              <p>{history.length === 0 ? 'No scans performed yet.' : `${history.length} scan${history.length > 1 ? 's' : ''} completed.`}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEducation && <SkinEducation onClose={() => setShowEducation(false)} />}
      </AnimatePresence>
    </section>
  );
}
