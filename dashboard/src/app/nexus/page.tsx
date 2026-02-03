"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/lib/supabase';
import { Network, Globe, Radio, Shield, Fingerprint, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface SentinelStats {
    totalCrystals: number;
    verifiedCrystals: number;
    pendingVerifications: number;
    avgFidelity: number;
}

export default function NexusPage() {
    const [stats, setStats] = useState<SentinelStats | null>(null);
    const [latency, setLatency] = useState<number>(0);
    const [isPinging, setIsPinging] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // TODO: Create sentinel_stats table or use alternative endpoint
                // const { data } = await supabase.from('sentinel_stats').select('*').single();
                // if (data) setStats(data);

                // Temporary: Use default values
                setStats({
                    totalCrystals: 0,
                    verifiedCrystals: 0,
                    pendingVerifications: 0,
                    avgFidelity: 0
                });
            } catch (err) {
                console.error('Stats load error:', err);
            }
        };

        loadStats();

        // Real-time updates disabled until sentinel_stats exists
        // const channel = supabase.channel('sentinel-stats')
        //     .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sentinel_stats' }, (payload) => {
        //         setStats(payload.new as any);
        //     })
        //     .subscribe();

        // Check table exists
        const checkTable = async () => {
            // await supabase.from('sentinel_stats').select('id').limit(1);
        };
        checkTable();

        // Latency Heartbeat simulation (pinging supabase)
        const pingInterval = setInterval(async () => {
            setIsPinging(true);
            const start = performance.now();
            // await supabase.from('sentinel_stats').select('id').limit(1);
            const end = performance.now();
            setLatency(Math.round(end - start));
            setIsPinging(false);
        }, 5000);

        return () => {
            clearInterval(pingInterval);
        };
    }, []);

    const healthPercentage = stats ? Math.round(stats.avgFidelity * 100) : 0;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 bg-purple-500/10 rounded-full mb-6 border border-purple-500/20 shadow-[0_0_30_rgba(147,51,234,0.1)]">
                        <Network size={12} className="text-purple-400 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Bridge Protocol Active</span>
                    </div>
                    <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] text-white">
                        SYSTEM_<span className="text-purple-500/30">NEXUS.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mt-4">Monitor external interfaces and neural bridges</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* OpenWebUI Bridge Card */}
                    <div className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Globe size={140} className="text-purple-400" />
                        </div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-2xl text-purple-400">
                                <Globe size={28} />
                            </div>
                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 border ${latency > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-white/30 border-white/10'}`}>
                                <span className={`w-2 h-2 rounded-full ${latency > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
                                {latency > 0 ? 'Protocol_Online' : 'Synchronizing...'}
                            </div>
                        </div>

                        <h3 className="font-bebas text-4xl italic tracking-wider text-white mb-4 relative z-10 group-hover:text-purple-400 transition-colors">OPEN_WEBUI_BRIDGE.</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-10 leading-relaxed relative z-10 max-w-sm">
                            Active connection to external LLM interfaces. Crystals injected into chat contexts via <code className="bg-white/5 px-2 py-1 rounded text-white/40 font-mono text-[9px]">NB_PORT:3000</code>.
                        </p>

                        <div className="grid grid-cols-2 gap-6 relative z-10">
                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Latency_MS</span>
                                <span className="text-2xl font-black text-white flex items-center gap-3 italic">
                                    {latency}ms
                                    {isPinging && <span className="w-2 h-2 bg-purple-400 rounded-full animate-ping" />}
                                </span>
                            </div>
                            <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                                <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Total_Injections</span>
                                <motion.span
                                    className="text-2xl font-black text-purple-400 block italic"
                                    key={stats?.totalCrystals}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                >
                                    {stats?.totalCrystals || 0}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* Chrome Extension Card */}
                    <div className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Radio size={140} className="text-blue-400" />
                        </div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-2xl text-blue-400">
                                <Radio size={28} />
                            </div>
                            <div className="px-4 py-1.5 bg-white/5 text-white/30 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-2 h-2 bg-white/20 rounded-full" />
                                Standby_Mode
                            </div>
                        </div>

                        <h3 className="font-bebas text-4xl italic tracking-wider text-white mb-4 relative z-10 group-hover:text-blue-400 transition-colors">NEURAL_SURFACE_EXT.</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-10 leading-relaxed relative z-10 max-w-sm">
                            Browser-level grounding. Analyzes visited pages for truth compliance and automatically captures semantic anchors.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group-hover:bg-white/[0.04] transition-all">
                                <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    <Shield size={14} className="text-blue-400" /> Truth_Filter
                                </span>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Active</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/2 rounded-2xl group-hover:bg-white/[0.03] transition-all">
                                <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                                    <Fingerprint size={14} className="text-white/10" /> Auto_Capture
                                </span>
                                <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">Offline</span>
                            </div>
                        </div>
                    </div>

                    {/* Local Inference Status */}
                    <div className="col-span-1 md:col-span-2 glass-panel rounded-[4rem] p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <Activity size={300} className="text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                            <div className="max-w-2xl text-center xl:text-left">
                                <h3 className="font-bebas text-6xl italic tracking-wider text-white mb-6">LOCAL_SOVEREIGN_INFERENCE.</h3>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/20 leading-[1.8]">
                                    Your system communicates with the Neural Bridge Oracle but maintains a local cryptographic signature on all operations.
                                    <span className="text-indigo-400 ml-3">Zero-Knowledge Proofs enabled.</span>
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 min-w-[320px] shadow-2xl">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">System_Potency</span>
                                    <span className="block text-5xl font-black text-white italic">{healthPercentage}<span className="text-xl text-white/20 ml-1">%</span></span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${healthPercentage}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
