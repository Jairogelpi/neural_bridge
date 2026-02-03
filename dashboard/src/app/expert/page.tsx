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
    const { user } = useAuth();
    const [profile, setProfile] = useState<ExpertProfile | null>(null);
    const [ledger, setLedger] = useState<ReputationEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        { label: 'My Score', value: profile?.reputation?.toFixed(3) || '0.500', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'User Level', value: profile?.tier || 'Community', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Accuracy', value: '98.4%', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 bg-yellow-50 rounded-full mb-4 border border-yellow-100">
                        <Award size={12} className="text-yellow-600 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-700">Sovereign Expert Verified</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                        MY <span className="text-yellow-600">REPUTATION.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your cryptographic reputation and neural contribution matrix.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left: Profile & Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                    <Fingerprint size={32} />
                                </div>
                                <h2 className="text-2xl font-black italic tracking-tight mb-1">{profile?.name}</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">@{profile?.handle}</p>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Public Key</span>
                                    <code className="text-[10px] font-mono break-all opacity-60">
                                        {profile?.public_key}
                                    </code>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {stats.map((s, i) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                            <s.icon size={20} />
                                        </div>
                                        <div>
                                            <span className="block text-[8px] font-black uppercase tracking-widest text-gray-400">{s.label}</span>
                                            <span className="text-lg font-black text-gray-900 tracking-tight">{s.value}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Reputation Ledger */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                    <History size={14} /> Activity History
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                    <TrendingUp size={12} />
                                    Growth: +12%
                                </div>
                            </div>

                            <div className="space-y-4">
                                {ledger.length > 0 ? ledger.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:border-gray-100 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${event.delta > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <Activity size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{event.reason}</p>
                                                <span className="text-[10px] font-medium text-gray-400">
                                                    {new Date(event.created_at).toLocaleDateString()} · {new Date(event.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-sm font-black ${event.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {event.delta > 0 ? '+' : ''}{event.delta.toFixed(4)}
                                            </span>
                                            <span className="block text-[8px] font-black uppercase text-gray-400 tracking-tighter">New Score: {event.new_reputation.toFixed(3)}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-20 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
                                        <Award className="mx-auto text-gray-200 mb-4" size={48} />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No activity yet. Start using Neural Bridge!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Badges/Credentials Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Early Adopter', 'Lattice Defender', 'HDC Pioneer'].map((badge, i) => (
                                <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:scale-105 transition-all">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 group-hover:rotate-12 transition-transform">
                                        <Star className="text-yellow-400" size={24} fill="currentColor" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{badge}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Verified 2026</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
