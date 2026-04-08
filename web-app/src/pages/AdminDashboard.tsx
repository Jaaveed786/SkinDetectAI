import { Users, Shield, Trash2, Power, Activity, PieChart as PieChartIcon, Server, Search, ChevronDown, Settings, User, RefreshCw, ExternalLink, Home } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import AdminUserDetailModal from '../components/AdminUserDetailModal';

const DISEASE_COLORS = ['#ff4b4b', '#2dd4bf', '#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'];

export default function AdminDashboard() {
  const navigate                      = useNavigate();
  const { token, logout }             = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery,  setSearch]     = useState('');
  const [users,        setUsers]      = useState<any[]>([]);
  const [stats,        setStats]      = useState<any>(null);
  const [loading,      setLoading]    = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.adminGetUsers(token),
        api.adminGetStats(token),
      ]);
      setUsers(usersRes.users || []);
      setStats(statsRes);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (id: number, current: string) => {
    if (!token) return;
    const next = current === 'Active' ? 'Suspended' : 'Active';
    await api.adminToggleStatus(token, id, next);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: next } : u));
  };

  const deleteUser = async (id: number) => {
    if (!token || !window.confirm('Permanently delete this user?')) return;
    await api.adminDeleteUser(token, id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const openReview = (user: any) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SCAN_DATA   = stats?.monthly_scans        || [];
  const DISEASE_DATA= (stats?.disease_distribution|| []).map((d: any, i: number) => ({ ...d, color: DISEASE_COLORS[i % DISEASE_COLORS.length] }));
  const RESOURCE_DATA = [
    { name: 'CPU Usage', value: 45 }, { name: 'Memory', value: 68 },
    { name: 'GPU VRAM', value: 82 }, { name: 'Storage', value: 35 },
  ];

  return (
    <section className="p-4 md:p-8 max-w-7xl mx-auto py-12 min-h-screen bg-slate-950 font-sans">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-10 border-b border-teal-800/50 pb-6">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-4">
          <Shield className="w-10 h-10 text-teal-400" /> Executive Dashboard
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="text-teal-400 hover:text-white bg-slate-900 border border-slate-700 p-2 rounded-xl transition-colors" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative z-50">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="bg-slate-900 border border-slate-700 hover:border-teal-500 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-3 transition-colors">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">A</div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-white">Admin Master</p>
                <p className="text-[10px] text-teal-500 uppercase">Level 5 Clearance</p>
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs font-black uppercase tracking-widest z-50">
                  <button className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 text-white"><User size={14} className="text-teal-400" /> Profile</button>
                  <button className="flex items-center gap-3 px-5 py-4 hover:bg-slate-800 text-white border-b border-slate-800"><Settings size={14} className="text-teal-400" /> Config</button>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 hover:bg-red-900/40 text-red-400"><Power size={14} /> Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users',  value: stats?.total_users  ?? '—', color: 'text-teal-400' },
          { label: 'Total Scans',  value: stats?.total_scans  ?? '—', color: 'text-brand-coral' },
          { label: 'Active Users', value: stats?.active_users ?? '—', color: 'text-green-400' },
          { label: 'ML Engine',    value: 'ABCDE / EfficientNet',      color: 'text-purple-400' },
        ].map(kpi => (
          <motion.div key={kpi.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 border border-teal-500/20 rounded-2xl p-5 text-white">
            <p className="text-[10px] uppercase font-black text-slate-400 mb-2">{kpi.label}</p>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 text-white">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-slate-900/50 border border-teal-500/20 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase text-teal-400 tracking-widest flex items-center gap-2 mb-6">
            <Activity size={16} /> Monthly Scans
          </h3>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SCAN_DATA.length ? SCAN_DATA : [{ month: 'No data', scans: 0 }]}>
                <defs>
                  <linearGradient id="cScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2dd4bf" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <RTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="scans" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#cScans)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-slate-900/50 border border-teal-500/20 rounded-3xl p-6 shadow-xl flex flex-col">
          <h3 className="text-xs font-black uppercase text-teal-400 tracking-widest flex items-center gap-2 mb-4">
            <PieChartIcon size={16} /> Disease Distribution
          </h3>
          <div className="flex-grow flex justify-center items-center h-[180px]">
            {DISEASE_DATA.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <RPieChart>
                  <Pie data={DISEASE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                    {DISEASE_DATA.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <RTooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                </RPieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-500 text-xs uppercase font-bold text-center">No scan data yet</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {DISEASE_DATA.map((d: any) => (
              <div key={d.name} className="flex items-center gap-1 text-[10px] font-bold text-slate-300 truncate">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="truncate" title={d.name}>{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-slate-900/50 border border-teal-500/20 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase text-teal-400 tracking-widest flex items-center gap-2 mb-4">
            <Server size={16} /> System Resource Usage (%)
          </h3>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_DATA} layout="vertical" margin={{ right: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 10 }} width={100} />
                <RTooltip cursor={{ fill: '#1e293b', opacity: 0.5 }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {RESOURCE_DATA.map((e, i) => (
                    <Cell key={i} fill={e.value > 85 ? '#ef4444' : e.value > 70 ? '#f59e0b' : '#2dd4bf'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* User Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-900/80 rounded-[40px] overflow-hidden border border-teal-500/30 shadow-2xl">
        <div className="p-6 border-b border-teal-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-sm font-black uppercase text-teal-400 tracking-widest flex items-center gap-2">
            <Users size={16} /> Registered Users ({filtered.length})
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input type="text" value={searchQuery} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-slate-950 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-white outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-[#0b1221] text-teal-500/70 text-[10px] uppercase tracking-widest border-b border-teal-800/20">
              <tr>
                <th className="p-5 font-black">User</th>
                <th className="p-5 font-black">Email</th>
                <th className="p-5 font-black">Age / Gender</th>
                <th className="p-5 font-black">Status</th>
                <th className="p-5 text-right font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-800/20 text-slate-300">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500 text-sm">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2" /> Loading users...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-500 text-xs font-black uppercase">
                  No users found
                </td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-5 font-bold text-white uppercase text-xs flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center text-xs font-black shrink-0">
                      {u.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {u.name}
                    {u.role === 'admin' && <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">ADMIN</span>}
                  </td>
                  <td className="p-5 text-teal-400/80 text-xs font-mono">{u.email}</td>
                  <td className="p-5 text-xs text-slate-400 font-medium">{u.age || '—'} yrs · {u.gender || '—'}</td>
                  <td className={`p-5 uppercase text-[10px] font-black ${u.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    <span className={`px-3 py-1 rounded-full ${u.status === 'Active' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-5 text-right space-x-2">
                    {u.role !== 'admin' && (
                      <>
                        <button onClick={() => openReview(u)}
                          className="bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500 hover:text-slate-900 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all inline-flex items-center gap-1">
                          <ExternalLink size={12} /> Review
                        </button>
                        <button onClick={() => toggleStatus(u.id, u.status)}
                          className={`${u.status === 'Active' ? 'bg-slate-800 text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 border border-slate-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-900'} px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all`}>
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button onClick={() => deleteUser(u.id)}
                          className="bg-slate-800 text-slate-300 border border-slate-700 hover:bg-red-500/20 hover:text-red-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all inline-flex items-center gap-1">
                          <Trash2 size={12} /> Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AdminUserDetailModal 
        user={selectedUser} 
        token={token || ''} 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)} 
      />

      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/')}
        className="mt-10 w-full bg-slate-900 text-teal-500/50 hover:text-teal-400 hover:bg-slate-800 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all border border-slate-800 flex items-center justify-center gap-3 text-xs">
        <Home size={18} /> Return to Main Hub
      </motion.button>
    </section>
  );
}
