"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    Shield,
    Zap,
    Database,
    Terminal,
    LayoutDashboard,
    LogOut,
    ChevronRight,
    RefreshCcw,
    Binary,
    Gavel
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
    total_vaccines: number;
    total_crystals: number;
    total_jury_cases: number;
    system_health: number;
    omega_status: string;
}

interface SentinelLog {
    log_id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
}

export default function DashboardPage() {
    const { user, logout, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats | null>(null);
    const [logs, setLogs] = useState<SentinelLog[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                api.get<{ stats: Stats }>('/v1/sentinel/stats'),
                api.get<{ logs: SentinelLog[] }>('/v1/sentinel/logs')
            ]);
            setStats(statsRes.data.stats);
            setLogs(logsRes.data.logs);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (authLoading) return null;
    if (!user) return null;

    const purity = (stats?.system_health || 1.0) * 100;

    return (
        <div className="min-h-screen bg-[#020202] text-white font-mono selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* TOP NAV */}
            <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tighter text-white">SENTINEL ENGINE <span className="text-cyan-500">v4.0</span></span>
                        <span className="text-[10px] text-gray-500 font-medium">OMEGA CORE ACTIVE</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <nav className="flex items-center space-x-1 mr-4">
                        <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 flex items-center">
                            <LayoutDashboard className="w-3 h-3 mr-2" /> Dashboard
                        </Link>
                        <div className="w-1 h-1 bg-white/10 rounded-full mx-1" />
                        <Link href="/jury" className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center">
                            <Gavel className="w-3 h-3 mr-2" /> Jury Cases
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">System Purity</span>
                            <span className="text-xs font-bold text-cyan-400">{purity.toFixed(2)}%</span>
                        </div>
                        <div className="w-10 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${purity}%` }}
                                className="h-full bg-cyan-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold">{user.name}</span>
                            <span className="text-[10px] text-cyan-500/70">@{user.handle}</span>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* LEFT BAR: METRICS */}
                <aside className="w-80 border-r border-white/5 bg-black/20 p-6 overflow-y-auto hidden lg:block">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                            <Activity className="w-3 h-3 mr-2" /> Telemetry
                        </h2>
                        <RefreshCcw className={`w-3 h-3 text-cyan-500/50 ${stats ? 'animate-spin-slow' : ''}`} />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <MetricCard label="Vaccines" value={stats?.total_vaccines || 0} icon={Zap} />
                        <MetricCard label="Crystals" value={stats?.total_crystals || 0} icon={Database} />
                        <MetricCard label="Cases" value={stats?.total_jury_cases || 0} icon={Binary} />
                        <MetricCard label="Latency" value="412ms" icon={Activity} sub="AVG Response" />

                        <div className="mt-8 p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-12 h-12 text-cyan-500" />
                            </div>
                            <h3 className="text-[10px] uppercase font-bold text-cyan-500 tracking-tighter mb-4">Security Protocol</h3>
                            <div className="space-y-3">
                                <GuardItem label="PCK Verification" active />
                                <GuardItem label="ZKV Isolation" active />
                                <GuardItem label="SMT Anchoring" active />
                                <GuardItem label="Truth Vault sync" active />
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CENTER: THE LATTICE */}
                <section className="flex-1 relative flex flex-col">
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                        <div className="w-full h-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px]" />
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                        <div className="relative w-96 h-96 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-cyan-500/10 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-8 border border-cyan-500/5 rounded-full border-dashed"
                            />

                            <div className="relative text-8xl font-black text-cyan-500/20 drop-shadow-[0_0_30px_rgba(0,242,255,0.1)]">Ω</div>

                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] text-cyan-500/50 uppercase tracking-[0.2em] font-bold text-center">
                                Knowledge Lattice<br />
                                <span className="text-white/40">Sovereign Entanglement</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-32 border-t border-white/5 bg-black/40 backdrop-blur-md p-6 flex items-center justify-center space-x-12 relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Entangled Neurons</span>
                            <span className="text-xl font-bold tracking-tighter">4,096 <span className="text-xs text-cyan-500">FIXED</span></span>
                        </div>
                        <div className="w-px h-8 bg-white/5" />
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Purity Level</span>
                            <span className="text-xl font-bold tracking-tighter text-cyan-400">CLASS IV</span>
                        </div>
                        <div className="w-px h-8 bg-white/5" />
                        <div className="flex flex-col items-center text-center">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Resonance</span>
                            <span className="text-xl font-bold tracking-tighter">1.0 <span className="text-xs text-gray-600">STABLE</span></span>
                        </div>
                    </div>
                </section>

                {/* RIGHT BAR: LOGS */}
                <aside className="w-96 border-l border-white/5 bg-black/20 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                            <Terminal className="w-3 h-3 mr-2" /> Pulse Stream
                        </h2>
                        <span className="text-[8px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full animate-pulse border border-green-500/20">LIVE</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide">
                        <AnimatePresence mode="popLayout">
                            {logs.map((log) => (
                                <motion.div
                                    key={log.log_id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/5 border border-white/5 p-3 rounded-lg flex flex-col space-y-1 hover:bg-white/[0.07] transition-colors"
                                >
                                    <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-gray-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                        <span className={`uppercase font-bold ${log.severity === 'critical' ? 'text-red-400' : 'text-cyan-400/70'}`}>{log.severity}</span>
                                    </div>
                                    <div className="text-xs text-gray-300 leading-relaxed">
                                        <span className="text-cyan-500 font-bold mr-1">{log.type} //</span> {log.message}
                                    </div>
                                </motion.div>
                            ))}
                            {logs.length === 0 && (
                                <div className="h-full flex items-center justify-center text-[10px] text-gray-600 uppercase tracking-widest">
                                    Scanning lattice pulse...
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </aside>
            </main>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, sub }: any) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
                <Icon className="w-3 h-3 text-cyan-500" />
            </div>
            <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold tracking-tighter">{value}</span>
                {sub && <span className="text-[10px] text-gray-600 font-bold uppercase">{sub}</span>}
            </div>
        </div>
    );
}

function GuardItem({ label, active }: any) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 font-medium">{label}</span>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-cyan-500 shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'bg-gray-800'}`} />
        </div>
    );
}
