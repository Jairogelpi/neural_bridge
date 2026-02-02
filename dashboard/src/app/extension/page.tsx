"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Activity,
    Database,
    Binary,
    Lock,
    UserPlus,
    Key,
    User,
    Mail,
    ChevronRight,
    ExternalLink
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

    // Mock live metrics for popup demonstration
    useEffect(() => {
        const interval = setInterval(() => {
            setFidelity(Math.floor(Math.random() * 20) + 80);
        }, 3000);
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
        <div className="w-[380px] h-[520px] bg-[#0a0b10] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
    );

    if (!user) return (
        <div className="w-[380px] h-[520px] bg-[#0a0b10] text-[#e0e6ed] font-sans overflow-hidden flex flex-col p-6 selection:bg-cyan-500/20">
            <div className="flex items-center space-x-2 mb-8">
                <div className="w-6 h-6 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center justify-center">
                    <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-xs font-bold tracking-widest text-cyan-500">NEURAL BRIDGE</span>
            </div>

            <div className="flex-1">
                <h1 className="text-xl font-black italic tracking-tighter mb-1 uppercase">
                    {authMode === 'login' ? 'Identify Yourself' : 'Create Identity'}
                </h1>
                <p className="text-[10px] text-gray-500 font-mono uppercase mb-6">
                    {authMode === 'login' ? 'Access Knowledge Vault' : 'Join the Global Cortex'}
                </p>

                <form onSubmit={handleAuth} className="space-y-3">
                    {authMode === 'register' && (
                        <>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all"
                                    placeholder="FULL NAME"
                                    value={credentials.name}
                                    onChange={e => setCredentials({ ...credentials, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Binary className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                <input
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all"
                                    placeholder="HANDLE"
                                    value={credentials.handle}
                                    onChange={e => setCredentials({ ...credentials, handle: e.target.value })}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all"
                            placeholder="EMAIL ADDRESS"
                            type="email"
                            value={credentials.email}
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs font-mono focus:border-cyan-500/50 outline-none transition-all"
                            placeholder="SECURITY KEY"
                            type="password"
                            value={credentials.password}
                            onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <div className="text-[10px] text-red-400 font-bold uppercase">{error}</div>}

                    <button
                        disabled={isSubmitting}
                        className="w-full bg-cyan-500 py-3 rounded-xl text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : (authMode === 'login' ? 'Authorize' : 'Initialize')}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(''); }}
                        className="text-[10px] text-gray-500 font-bold hover:text-cyan-400 transition-colors uppercase tracking-widest"
                    >
                        {authMode === 'login' ? 'Need an identity? Create one' : 'Already identified? Login'}
                    </button>
                </div>
            </div>

            <div className="text-[8px] text-gray-700 font-mono text-center uppercase">
                Neural Bridge Protocol // Securing Reality Since 2026
            </div>
        </div>
    );

    return (
        <div className="w-[380px] h-[520px] bg-[#0a0b10] text-[#e0e6ed] font-sans overflow-hidden flex flex-col selection:bg-cyan-500/20 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

            {/* HEADER */}
            <header className="h-14 bg-black/40 border-b border-cyan-500/20 flex items-center justify-between px-5 relative z-10 box-border">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center justify-center">
                        <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-[11px] font-black tracking-widest text-[#fff]">NEURAL BRIDGE</span>
                </div>
                <div className="text-[9px] font-mono text-cyan-400 py-0.5 px-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 animate-pulse">
                    CONNECTED
                </div>
            </header>

            {/* TABS */}
            <div className="flex p-1.5 bg-black/60 m-3 rounded-xl border border-white/5 relative z-10">
                <button
                    onClick={() => setView('live')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'live' ? 'bg-white/5 text-cyan-400 border border-white/5 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Live Link
                </button>
                <button
                    onClick={() => setView('storage')}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'storage' ? 'bg-white/5 text-cyan-400 border border-white/5 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Crystal Registry
                </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 pt-2 relative z-10 scrollbar-hide">
                <AnimatePresence mode="wait">
                    {view === 'live' ? (
                        <motion.div
                            key="live"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-5"
                        >
                            {/* REALITY SENSOR */}
                            <div className="relative h-40 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 45, y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/30 border-2 border-cyan-500 shadow-[0_0_30px_rgba(0,242,255,0.2)] rounded-sm"
                                />
                                <div className="absolute bottom-0 text-center">
                                    <div className="text-[10px] text-gray-500 font-mono uppercase">Ontology Status</div>
                                    <div className="text-xs font-black text-green-400 uppercase tracking-tighter">Valid Reality</div>
                                </div>
                            </div>

                            {/* METRICS */}
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Semantic Fidelity</span>
                                        <span className="text-xs font-black text-cyan-400">{fidelity}%</span>
                                    </div>
                                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${fidelity}%` }}
                                            className="h-full bg-cyan-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-gray-500 uppercase">Latency</span>
                                    <span className="text-white">124ms</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-gray-500 uppercase">Entropy</span>
                                    <span className="text-white">0.002 bits</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="storage"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-4"
                        >
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Inject Crystal (JSON)</div>
                            <textarea
                                className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-mono text-cyan-400 outline-none focus:border-cyan-500/30 transition-all"
                                placeholder='{ "context_id": "...", "invariants": [...] }'
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <button className="bg-white/5 border border-white/5 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex flex-col items-center gap-1">
                                    <Activity className="w-4 h-4 text-cyan-400" />
                                    Inject
                                </button>
                                <button className="bg-white/5 border border-white/5 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex flex-col items-center gap-1">
                                    <Database className="w-4 h-4 text-purple-400" />
                                    Copy Active
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* FOOTER */}
            <footer className="h-12 border-t border-white/5 bg-black/40 px-5 flex items-center justify-between relative z-10 box-border">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center overflow-hidden border border-cyan-500/20">
                        <User className="w-2.5 h-2.5 text-cyan-400" />
                    </div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">@{user.handle}</span>
                </div>
                <a
                    href="https://neural-bridge-dashboard.onrender.com/dashboard"
                    target="_blank"
                    className="flex items-center text-[10px] font-black text-cyan-400/70 hover:text-white transition-colors uppercase tracking-widest"
                >
                    DASHBOARD <ExternalLink className="w-2.5 h-2.5 ml-1.5" />
                </a>
            </footer>
        </div>
    );
}
