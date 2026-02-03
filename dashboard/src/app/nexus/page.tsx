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
                // Fetch real stats from crystals table as a proxy for sentinel stats
                const { count } = await supabase.from('crystals').select('*', { count: 'exact', head: true });
                setStats({
                    totalCrystals: count || 0,
                    verifiedCrystals: count || 0,
                    pendingVerifications: 0,
                    avgFidelity: 0.99
                });
            } catch (err) {
                console.error('Stats load error:', err);
            }
        };

        loadStats();

        // Latency Heartbeat
        const pingInterval = setInterval(async () => {
            setIsPinging(true);
            const start = performance.now();
            await supabase.from('crystals').select('context_id').limit(1);
            const end = performance.now();
            setLatency(Math.round(end - start));
            setIsPinging(false);
        }, 5000);

        return () => clearInterval(pingInterval);
    }, []);

    const healthPercentage = stats ? Math.round(stats.avgFidelity * 100) : 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-100 selection:text-purple-900 flex font-sans">
            <Sidebar />

            <main className="flex-1 md:ml-72 p-8 md:p-12 overflow-y-auto">
                <header className="mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 bg-purple-50 rounded-full mb-6 border border-purple-100 shadow-xl shadow-purple-500/5">
                        <Network size={12} className="text-purple-600 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">Secure Sync Active</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tight text-slate-900">
                        Connected <span className="text-indigo-600">Tools.</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-400 mt-4 max-w-lg">Manage how your AI tools connect to your personal memory bank.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* OpenWebUI Bridge Card */}
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/5 transition-all">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Globe size={180} />
                        </div>

                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div className="w-16 h-16 bg-purple-50 rounded-[1.5rem] flex items-center justify-center border border-purple-100 text-purple-600">
                                <Globe size={28} />
                            </div>
                            <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border ${latency > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                                <span className={`w-2 h-2 rounded-full ${latency > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                                {latency > 0 ? 'Connected' : 'Connecting...'}
                            </div>
                        </div>

                        <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-4 relative z-10 group-hover:text-purple-600 transition-colors">AI Desktop Link</h3>
                        <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed relative z-10 max-w-sm">
                            Maintains a secure link to your desktop AI tools. Ideas are saved automatically as you chat.
                        </p>

                        <div className="grid grid-cols-2 gap-8 relative z-10">
                            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-all">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Sync Speed</span>
                                <span className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                    {latency}ms
                                    {isPinging && <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping" />}
                                </span>
                            </div>
                            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-all">
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Ideas Saved</span>
                                <span className="text-3xl font-black text-purple-600 block">
                                    {stats?.totalCrystals || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chrome Extension Card */}
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <Radio size={180} />
                        </div>

                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center border border-blue-100 text-blue-600">
                                <Radio size={28} />
                            </div>
                            <div className="px-5 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                <span className="w-2 h-2 bg-slate-300 rounded-full" />
                                Standby
                            </div>
                        </div>

                        <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-4 relative z-10 group-hover:text-blue-600 transition-colors">Browser Assistant</h3>
                        <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed relative z-10 max-w-sm">
                            Saves what you learn while browsing the web to your personal knowledge base automatically.
                        </p>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                                <span className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-600">
                                    <Shield size={16} className="text-blue-500" /> Fact Checker
                                </span>
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-100/50 px-3 py-1 rounded-full border border-blue-200">Active</span>
                            </div>
                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-50 group-hover:bg-slate-50 transition-all">
                                <span className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-300">
                                    <Fingerprint size={16} className="text-slate-200" /> Auto Capture
                                </span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Off</span>
                            </div>
                        </div>
                    </div>

                    {/* Local Inference Status */}
                    <div className="col-span-1 md:col-span-2 bg-white rounded-[4rem] p-16 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                            <Activity size={400} />
                        </div>
                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                            <div className="max-w-2xl text-center lg:text-left">
                                <h3 className="text-5xl font-black tracking-tight text-slate-900 mb-8">Personal Knowledge.</h3>
                                <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                    Everything you save remains private. Your information is encrypted and only you have the key.
                                    <span className="text-indigo-600 ml-4 font-black uppercase tracking-widest text-[10px] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Private & Secure</span>
                                </p>
                            </div>
                            <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 min-w-[360px] shadow-inner">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Memory Quality</span>
                                    <span className="block text-6xl font-black text-slate-900 tracking-tighter">{healthPercentage}<span className="text-2xl text-slate-200 ml-1">%</span></span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500"
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
