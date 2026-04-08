import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowLeft, Download, MapPin, Activity, Shield, FileText, Thermometer, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import GradCamViewer from '../components/GradCamViewer';

const RISK_STYLES: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  'Critical':      { bg: 'from-red-950 to-slate-950',    border: 'border-red-500/40',    badge: 'bg-red-500/20 text-red-400 border-red-500/30',    text: 'text-red-400' },
  'High Risk':     { bg: 'from-orange-950 to-slate-950', border: 'border-orange-500/40', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', text: 'text-orange-400' },
  'Moderate Risk': { bg: 'from-yellow-950 to-slate-950', border: 'border-yellow-500/40', badge: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',  text: 'text-yellow-400' },
  'Low Risk':      { bg: 'from-emerald-950 to-slate-950',border: 'border-emerald-500/40', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', text: 'text-emerald-400' },
};

const MOCK_DOCTORS = [
  { name: 'Dr. Priya Sharma', specialty: 'Dermatologist & Skin Oncologist', distance: '1.2 km', rating: '⭐ 4.9', phone: '+91 98765 43210' },
  { name: 'Dr. Rajesh Kumar',  specialty: 'Dermato-Pathologist',            distance: '2.7 km', rating: '⭐ 4.8', phone: '+91 87654 32109' },
  { name: 'Dr. Ananya Rao',    specialty: 'Clinical Dermatologist',         distance: '3.4 km', rating: '⭐ 4.7', phone: '+91 76543 21098' },
];

export default function ResultsPage() {
  const navigate          = useNavigate();
  const { token }         = useAuth();
  const { t }             = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [showGradCam, setShowGradCam] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('scan_result');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  if (!result) return null;

  const risk    = result.risk_level  || 'Low Risk';
  const style   = RISK_STYLES[risk] || RISK_STYLES['Low Risk'];
  const recs    = Array.isArray(result.recommendations) ? result.recommendations : [];
  const metrics = result.metrics || {};

  const handleDownloadPDF = async () => {
    if (!token) { alert('Please log in to download the PDF report.'); return; }
    setDownloading(true);
    try {
      await api.generatePDF(token);
    } catch (err: any) {
      alert('PDF generation failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className={`min-h-screen bg-gradient-to-br ${style.bg} py-12 px-4 md:px-8`}>
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase mb-8">
          <ArrowLeft size={16} /> Back to Dashboard
        </motion.button>

        {/* Result Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`glass-dark rounded-[40px] p-10 border ${style.border} shadow-2xl mb-8`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 rounded-3xl ${style.badge.split(' ').slice(0,1).join('')} flex items-center justify-center border ${style.badge.split(' ').slice(2).join(' ')}`}>
                {risk === 'Low Risk' ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <AlertTriangle className={`w-10 h-10 ${style.text}`} />}
              </div>
              <div>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">AI Analysis Complete</p>
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">{result.disease}</h1>
                <span className={`inline-block mt-2 text-xs font-black uppercase px-4 py-1 rounded-full border ${style.badge}`}>
                  {t(risk === 'Low Risk' ? 'low' : risk === 'Moderate Risk' ? 'moderate' : risk === 'High Risk' ? 'high' : 'critical')} — {risk}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase font-black">{t('confidence')}</p>
                <p className={`text-5xl font-black ${style.text}`}>{result.confidence}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDownloadPDF} disabled={downloading}
                  className="flex items-center gap-2 bg-teal-500 text-white font-black text-xs uppercase px-5 py-3 rounded-xl btn-3d hover:bg-teal-400 transition-colors disabled:opacity-50">
                  {downloading ? 'Generating...' : <><Download size={14} /> {t('downloadReport')}</>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Metrics Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4">
            <div className={`glass-dark rounded-3xl p-6 border ${style.border} shadow-xl`}>
              <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={14} /> ABCDE Metrics
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Asymmetry MSE',   val: metrics.asymmetry_mse,  max: 5000,  unit: '' },
                  { label: 'Border Variance', val: metrics.border_variance, max: 2000,  unit: '' },
                  { label: 'Color Std Dev',   val: metrics.color_stddev,   max: 80,    unit: '' },
                  { label: 'Diameter Score',  val: metrics.diameter_score, max: 1,     unit: '' },
                  { label: 'Evolution Score', val: metrics.evolution_score, max: 1,    unit: '' },
                  { label: 'Risk Score',      val: metrics.risk_score,     max: 1,     unit: '' },
                ].map(m => {
                  const pct = Math.min(((m.val || 0) / m.max) * 100, 100);
                  return (
                    <div key={m.label}>
                      <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span className="text-slate-400 uppercase">{m.label}</span>
                        <span className="text-teal-400">{typeof m.val === 'number' ? m.val.toFixed(m.max <= 1 ? 4 : 0) : '—'}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct > 70 ? 'bg-red-500' : pct > 50 ? 'bg-orange-500' : pct > 30 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grad-CAM Heatmap */}
            {result.gradcam_url && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className={`glass-dark rounded-3xl p-6 border ${style.border} shadow-xl`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} /> Grad-CAM Heatmap
                  </h3>
                  <button 
                    onClick={() => setShowGradCam(true)}
                    className="text-[10px] font-black uppercase text-teal-500 hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
                <div 
                  onClick={() => setShowGradCam(true)}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl"
                >
                  <img src={result.gradcam_url} alt="Grad-CAM Heatmap"
                    className="w-full rounded-2xl border border-teal-500/20 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/10 transition-colors flex items-center justify-center">
                    <Layers className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 text-center">Red zones indicate high-risk lesion areas detected by AI</p>
              </motion.div>
            )}
          </motion.div>

          {/* Recommendations + Doctors */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendations */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className={`glass-dark rounded-3xl p-8 border ${style.border} shadow-xl`}>
              <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2 mb-5">
                <Shield size={14} /> {t('recommendations')}
              </h3>
              {recs.length ? (
                <ul className="space-y-3">
                  {recs.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/50">
                      <div className={`w-6 h-6 rounded-full ${style.badge.split(' ').slice(0,2).join(' ')} flex items-center justify-center text-xs font-black shrink-0 mt-0.5`}>{i + 1}</div>
                      <p className="text-sm text-slate-300 font-medium">{rec}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm">No recommendations available.</p>
              )}
              <div className="mt-5 p-4 rounded-xl bg-slate-900/50 border border-teal-500/10 flex items-start gap-3">
                <FileText className="text-teal-400 shrink-0 mt-1" size={16} />
                <p className="text-xs text-slate-400 font-medium">
                  <span className="text-teal-400 font-black">Disclaimer: </span>
                  This AI analysis is for preliminary screening only. It is <em>not</em> a medical diagnosis. Always consult a qualified dermatologist.
                </p>
              </div>
            </motion.div>

            {/* Nearby Dermatologists */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={`glass-dark rounded-3xl p-8 border ${style.border} shadow-xl`}>
              <h3 className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2 mb-5">
                <MapPin size={14} /> Nearby Dermatologists
              </h3>
              <div className="space-y-3">
                {MOCK_DOCTORS.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-teal-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-sm font-black">
                        {doc.name.split(' ')[1][0]}
                      </div>
                      <div>
                        <p className="text-white font-black text-sm">{doc.name}</p>
                        <p className="text-slate-400 text-xs">{doc.specialty}</p>
                        <p className="text-teal-400 text-xs font-bold mt-0.5">{doc.rating} · {doc.distance}</p>
                      </div>
                    </div>
                    <a href={`tel:${doc.phone}`}
                      className="text-[10px] font-black uppercase px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-900 transition-colors">
                      Call
                    </a>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-3 text-center">
                For accurate nearby results, enable Google Maps API integration.
              </p>
            </motion.div>

            {/* Risk Icon */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className={`rounded-3xl p-6 flex items-center gap-5 ${style.badge.split(' ').slice(0,1).join('')} border ${style.border}`}>
              <Thermometer className={`w-10 h-10 ${style.text}`} />
              <div>
                <p className="text-slate-400 text-xs uppercase font-black">AI Risk Classification</p>
                <p className={`text-2xl font-black ${style.text} uppercase`}>{risk}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <GradCamViewer 
        isOpen={showGradCam} 
        onClose={() => setShowGradCam(false)} 
        originalImage={null} 
        heatmapImage={result.gradcam_url} 
        bbox={result.bbox}
      />
    </section>
  );
}
