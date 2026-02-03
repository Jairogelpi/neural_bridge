"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Activity,
    Database,
    Binary,
    Lock,
    User,
    Mail,
    ExternalLink,
    Zap
} from 'lucide-react';
import api from '@/lib/api';

export default function ExtensionPopup() {
    const { user, login, register, isLoading: authLoading } = useAuth();
    const [view, setView] = useState<'live' | 'storage'>('live');
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [fidelity, setFidelity] = useState(0);
    const [credentials, setCredentials] = useState({ name: '', handle: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load real fidelity metrics from backend
    useEffect(() => {
        const fetchFidelity = async () => {
            try {
                const response = await api.get('/v1/analytics/fidelity');
                if (response.data.success) {
                    setFidelity(response.data.fidelity || 0);
                }
            } catch (err) {
                console.error('Failed to fetch fidelity:', err);
            }
        };

        fetchFidelity();
        const interval = setInterval(fetchFidelity, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (authMode === 'login') {
                await login(credentials.email, credentials.password);
            } else {
                await register(credentials.email, credentials.password, credentials.name, credentials.handle);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return (
        <div className="w-[380px] h-[520px] bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>
    );

    if (!user) return (
        <div className="w-[380px] h-[520px] bg-white text-[#020202] font-sans overflow-hidden flex flex-col p-8 selection:bg-blue-100">
            <div className="flex items-center space-x-3 mb-12">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-gradient-to-tr from-blue-600 to-cyan-400 rotate-45" />
                    </div>
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase">Memory Bridge</span>
            </div>

            <div className="flex-1">
                <h1 className="text-2xl font-black tracking-tight mb-1 uppercase">
                    {authMode === 'login' ? 'Welcome Back' : 'Start Today'}
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-8">
                    {authMode === 'login' ? 'Log in to access your saved ideas.' : 'Create your private brain to start saving.'}
                </p>

                <form onSubmit={handleAuth} className="space-y-4">
                    {authMode === 'register' && (
                        <>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="NAME"
                                    value={credentials.name}
                                    onChange={e => setCredentials({ ...credentials, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Binary className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all placeholder:text-gray-300"
                                    placeholder="HANDLE"
                                    value={credentials.handle}
                                    onChange={e => setCredentials({ ...credentials, handle: e.target.value })}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all placeholder:text-gray-300"
                            placeholder="EMAIL"
                            type="email"
                            value={credentials.email}
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold uppercase tracking-wider focus:border-blue-600 outline-none transition-all placeholder:text-gray-300"
                            placeholder="KEY"
                            type="password"
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <div className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-[#020202] py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-black/5"
                    >
                        {isSubmitting ? 'WORKING...' : (authMode === 'login' ? 'LOG IN' : 'GET STARTED')}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <button
                        onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-[10px] text-gray-400 font-black hover:text-blue-600 transition-colors uppercase tracking-widest"
                    >
                        {authMode === 'login' ? 'CREATE PRIVATE BRAIN' : 'ALREADY HAVE AN ACCOUNT?'}
                    </button>
                </div>
            </div>

            <div className="text-[9px] text-gray-300 font-mono text-center uppercase tracking-widest mt-10">
                Lattice v4.0.0 // Omega
            </div>
        </div>
    );

    return (
        <div className="w-[380px] h-[520px] bg-white text-[#020202] font-sans overflow-hidden flex flex-col selection:bg-blue-50 relative">
            {/* HEADER */}
            <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] text-[#020202]">MEMORY BRIDGE</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">ACTIVE</span>
                </div>
            </header>

            {/* TABS */}
            <div className="flex p-1 bg-gray-50 m-4 rounded-2xl border border-gray-100 relative z-10 shadow-sm">
                <button
                    onClick={() => setView('live')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'live' ? 'bg-white text-blue-600 shadow-md shadow-black/5' : 'text-gray-400 hover:text-black'}`}
                >
                    Status
                </button>
                <button
                    onClick={() => setView('storage')}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'storage' ? 'bg-white text-blue-600 shadow-md shadow-black/5' : 'text-gray-400 hover:text-black'}`}
                >
                    Add Idea
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 relative z-10 scrollbar-hide">
                <AnimatePresence mode="wait">
                    {view === 'live' ? (
                        <motion.div
                            key="live"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-6"
                        >
                            {/* CRYSTAL SENSOR */}
                            <div className="relative h-44 flex items-center justify-center bg-gray-50 rounded-3xl border border-gray-50 border-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-cyan-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.div
                                    animate={{
                                        rotate: [45, 225, 45],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-400 border-2 border-white shadow-2xl shadow-blue-500/20 rounded-xl flex items-center justify-center p-4"
                                >
                                    <Zap className="w-10 h-10 text-white" />
                                </motion.div>
                                <div className="absolute bottom-4 text-center">
                                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] mb-1">Brain Status</div>
                                    <div className="text-xs font-black text-blue-600 uppercase tracking-tight">Syncing Perfectly</div>
                                </div>
                            </div>

                            {/* METRICS */}
                            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl shadow-black/5 space-y-5">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-blue-600">Knowledge Quality</span>
                                        <span className="text-sm font-black tracking-tight">{fidelity}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${fidelity}%` }}
                                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-300">Sync Speed</span>
                                    <span className="text-black">124ms</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="storage"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-5"
                        >
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-1 font-bold">Manual Save (Advanced)</div>
                            <textarea
                                className="w-full h-36 bg-gray-50 border border-gray-100 rounded-3xl p-5 text-[11px] font-mono text-black outline-none focus:border-blue-600 transition-all resize-none shadow-inner"
                                placeholder='Paste data here if needed...'
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-[#020202] text-white rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex flex-col items-center gap-1.5 shadow-xl shadow-black/5">
                                    <Activity className="w-5 h-5 text-cyan-400" />
                                    Save Idea
                                </button>
                                <button className="bg-white border border-gray-200 rounded-2xl py-4 text-[10px] font-black uppercase tracking-widest hover:border-black transition-all flex flex-col items-center gap-1.5 shadow-sm">
                                    <Database className="w-5 h-5 text-blue-600" />
                                    Sync Brain
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FOOTER */}
            <footer className="h-16 border-t border-gray-50 bg-white/80 backdrop-blur-xl px-6 flex items-center justify-between sticky bottom-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black italic tracking-widest">@{user.handle}</span>
                </div>
                <a
                    href="https://neural-bridge-dashboard.onrender.com/dashboard"
                    target="_blank"
                    className="flex items-center text-[10px] font-black text-blue-600 hover:scale-105 transition-all uppercase tracking-widest italic"
                >
                    DASHBOARD <ExternalLink className="w-3 h-3 ml-2" />
                </a>
            </footer>
        </div>
    );
}
