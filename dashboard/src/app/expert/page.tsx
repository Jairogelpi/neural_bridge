"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Award, Shield, Fingerprint, Activity, TrendingUp, History, Star, Zap } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface ReputationEvent {
    id: string;
    delta: number;
    new_reputation: number;
    reason: string;
    created_at: string;
}

interface ExpertProfile {
    author_id: string;
    name: string;
    handle: string;
    tier: string;
    reputation: number;
    public_key: string;
    verified_credentials: any[];
}

export default function ExpertHubPage() {
    useAuth();
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [ledger, setLedger] = useState<ReputationEvent[]>([]);
    const [, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, ledgerRes] = await Promise.all([
                    api.get('/v1/experts/me'),
                    api.get('/v1/experts/reputation')
                ]);

                if (profileRes.data.success) setProfile(profileRes.data.expert);
                if (ledgerRes.data.success) setLedger(ledgerRes.data.ledger);

            } catch (error) {
                console.error('Failed to fetch expert data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { label: 'Neural Reputation', value: profile?.reputation?.toFixed(3) || '0.500', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Contribution Tier', value: profile?.tier || 'Community', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Truth Fidelity', value: '98.4%', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                        <Award size={12} className="text-yellow-400 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">Sovereign Expert Verified</span>
                    </div>
                    <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] text-white">
                        EXPERT_<span className="text-yellow-500/30">IDENTITY.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mt-4">Your cryptographic reputation and neural contribution matrix</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left: Profile & Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-yellow-500/5 blur-3xl group-hover:bg-yellow-500/10 transition-colors duration-700" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 backdrop-blur-3xl shadow-2xl">
                                    <Fingerprint size={32} className="text-yellow-400" />
                                </div>
                                <h2 className="text-3xl font-black italic tracking-tight mb-2 text-white">{profile?.name}</h2>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">@{profile?.handle}</p>

                                <div className="mt-10 pt-10 border-t border-white/5">
                                    <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">PUBLIC_KEY_HEX</span>
                                    <code className="text-[9px] font-mono break-all text-white/40 leading-relaxed">
                                        {profile?.public_key}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 bg-white/5 ${s.color} rounded-xl flex items-center justify-center border border-white/5`}>
                                            <s.icon size={22} />
                                        </div>
                                        <div>
                                            <span className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">{s.label}</span>
                                            <span className="text-xl font-black text-white tracking-tight italic">{s.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Reputation Ledger */}
                    <div className="lg:col-span-3 space-y-12">
                        <div className="glass-panel rounded-[3.5rem] p-12">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-3">
                                    <History size={16} /> REPUTATION_LEDGER.
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-full uppercase tracking-[0.2em] border border-emerald-500/20">
                                    <TrendingUp size={14} />
                                    Growth: +12.4%
                                </div>
                            </div>

                            <div className="space-y-6">
                                {ledger.length > 0 ? ledger.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-6 bg-white/[0.01] rounded-[1.5rem] border border-white/2 hover:border-white/10 hover:bg-white/[0.03] transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${event.delta > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white group-hover:text-yellow-400 transition-colors uppercase tracking-widest italic">{event.reason}</p>
                                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em] mt-1 block">
                                                    {new Date(event.created_at).toLocaleDateString()} • {new Date(event.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-lg font-black italic ${event.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {event.delta > 0 ? '+' : ''}{event.delta.toFixed(4)}
                                            </span>
                                            <span className="block text-[8px] font-black uppercase text-white/20 tracking-[0.2em] mt-1">NEW_SCORE: {event.new_reputation.toFixed(3)}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] bg-white/[0.01] border border-white/5 border-dashed">
                                        <Award className="text-white/5 mb-6" size={60} />
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Your contribution history is empty.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Badges/Credentials Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['Early Adopter', 'Lattice Defender', 'HDC Pioneer'].map((badge, i) => (
                                <div key={i} className="glass-panel border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:scale-105 transition-all relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl relative z-10 group-hover:rotate-12 transition-transform duration-500">
                                        <Star className="text-yellow-500" size={32} fill="currentColor" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2 relative z-10">{badge}</span>
                                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] relative z-10">Verified 2026 • Tier S</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
