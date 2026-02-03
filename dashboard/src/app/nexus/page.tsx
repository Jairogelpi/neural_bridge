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
            // supabase.removeChannel(channel);
            clearInterval(pingInterval);
        };
    }, []);

    const healthPercentage = stats ? Math.round(stats.avgFidelity * 100) : 0;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 bg-purple-50 rounded-full mb-4 border border-purple-100">
                        <Network size={12} className="text-purple-600 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">Bridge Protocol Active</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                        SYSTEM <span className="text-purple-600">NEXUS.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Monitor external interfaces and neural bridges.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* OpenWebUI Bridge Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all border-l-4 border-l-purple-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Globe size={100} />
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center shadow-inner text-purple-600">
                                <Globe size={24} />
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${latency > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${latency > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                                {latency > 0 ? 'Online' : 'Connecting...'}
                            </div>
                        </div>
                        <h3 className="text-xl font-black italic tracking-tight text-gray-900 mb-2 relative z-10">OPEN WEBUI BRIDGE</h3>
                        <p className="text-xs font-medium text-gray-400 mb-6 leading-relaxed relative z-10">
                            Active connection to external LLM interfaces. Crystals are being injected into chat contexts via <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600 font-mono">port:3000</code>.
                        </p>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Latency</span>
                                <span className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    {latency}ms
                                    {isPinging && <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" />}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Total Injections</span>
                                <motion.span
                                    className="text-lg font-black text-purple-600 block"
                                    key={stats?.total_crystals}
                                    initial={{ scale: 1.2, color: '#9333ea' }}
                                    animate={{ scale: 1, color: '#9333ea' }}
                                >
                                    {stats?.totalCrystals || 0}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    {/* Chrome Extension Card */}
                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all border-l-4 border-l-blue-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Radio size={100} />
                        </div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner text-blue-600">
                                <Radio size={24} />
                            </div>
                            <div className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                Standby
                            </div>
                        </div>
                        <h3 className="text-xl font-black italic tracking-tight text-gray-900 mb-2 relative z-10">NEURAL SURFACE EXTENSION</h3>
                        <p className="text-xs font-medium text-gray-400 mb-6 leading-relaxed relative z-10">
                            Browser-level grounding. Analyzes visited pages for truth compliance and automatically captures semantic anchors.
                        </p>
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-50 pb-2">
                                <span className="flex items-center gap-2"><Shield size={14} className="text-blue-400" /> Truth Filter</span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-50 pb-2">
                                <span className="flex items-center gap-2"><Fingerprint size={14} className="text-gray-400" /> Auto-Capture</span>
                                <span className="text-gray-400">Disabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Local Inference Status */}
                    <div className="bg-gray-900 rounded-[2rem] p-8 border border-gray-800 col-span-1 md:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Activity size={200} className="text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h3 className="text-2xl font-black italic tracking-tight text-white mb-2">LOCAL SOVEREIGN INFERENCE</h3>
                                <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-lg">
                                    Your system communicates with the Neural Bridge Oracle but maintains a local cryptographic signature on all operations.
                                    <span className="text-white font-bold ml-1">Zero-Knowledge Proofs enabled.</span>
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 min-w-[240px]">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="block text-[10px] font-bold uppercase text-white/40">System Potency</span>
                                    <span className="block text-3xl font-black text-white">{healthPercentage}<span className="text-sm text-gray-500">%</span></span>
                                </div>
                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${healthPercentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
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
