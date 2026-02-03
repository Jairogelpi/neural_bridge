/**
 * PREMIUM DASHBOARD 🏠
 * 
 * Glassmorphism dashboard with stats and recent crystals
 * Mobile-first responsive design
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Clock,
    Sparkles,
    ArrowRight,
    ShieldAlert,
    Wallet,
    Target,
    Activity,
    Brain,
    Layers
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';

interface DashboardStats {
    total_crystals: number;
    today_crystals: number;
    cache_hit_rate: number;
    estimated_savings_usd: number;
    truth_fidelity: number;
    threats_neutralized: number;
    neural_density: number;
    time_saved_hours: number;
}

export default function PremiumDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        total_crystals: 0,
        today_crystals: 0,
        cache_hit_rate: 92,
        estimated_savings_usd: 0,
        truth_fidelity: 0.992,
        threats_neutralized: 0,
        neural_density: 0.2,
        time_saved_hours: 0
    });

    const [recentCrystals, setRecentCrystals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('nb_auth_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Load personalized stats
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/analytics/my-stats`, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.stats) {
                    setStats(data.stats);
                }
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));

        // Load recent crystals
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/crystals?limit=5&sort=recent`, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.crystals) {
                    setRecentCrystals(data.crystals);
                }
            })
            .catch(console.error);
    }, []);

    const statCards = [
        {
            label: 'Money Saved',
            value: `$${stats.estimated_savings_usd.toFixed(2)}`,
            subValue: 'Personal wealth preserved',
            icon: Wallet,
            gradient: 'bg-emerald-50 text-emerald-600',
            description: 'The amount of money you saved by avoiding repeated AI costs for the same information.'
        },
        {
            label: 'Time Earned',
            value: `${stats.time_saved_hours.toFixed(1)}h`,
            subValue: 'Manual work avoided',
            icon: Clock,
            gradient: 'bg-blue-50 text-blue-600',
            description: 'Total hours you won back by letting the system find and organize information for you.'
        },
        {
            label: 'Knowledge Quality',
            value: `${(stats.truth_fidelity * 100).toFixed(1)}%`,
            subValue: 'Truth Accuracy Index',
            icon: Target,
            gradient: 'bg-purple-50 text-purple-600',
            description: 'The proven accuracy of the information stored in your private knowledge base.'
        },
        {
            label: 'Ideas Captured',
            value: `+${stats.total_crystals}`,
            subValue: 'Memories in your mind',
            icon: Activity,
            gradient: 'bg-indigo-50 text-indigo-600',
            description: 'The total number of unique ideas and facts safely stored in your personal digital brain.'
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
            <Sidebar />

            <div className="flex-1 md:ml-72 relative">
                {/* Header - Minimalist Premium */}
                <div className="bg-white border-b border-slate-100 sticky top-0 z-40 px-8 sm:px-12 py-10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 mb-6">
                                <ShieldAlert size={12} className="text-emerald-600 mr-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">Safe Sync Active</span>
                            </div>
                            <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900">
                                Personal <span className="text-indigo-600">Intelligence.</span>
                            </h1>
                            <p className="text-sm font-medium text-slate-400 mt-4 max-w-lg">
                                Everything you teach your AI is captured here in your own private memory, saving you time and money.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="btn-indigo">
                                <Plus size={16} /> New Capture
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-8 sm:px-12 py-12">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {statCards.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
                                >
                                    <div className="flex flex-col gap-8">
                                        <div className="flex items-center justify-between">
                                            <div className={`p-4 rounded-2xl ${stat.gradient} transition-transform group-hover:scale-110`}>
                                                <Icon size={20} />
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">v2.4_Stable</span>
                                        </div>

                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                                                {stat.label}
                                            </p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tight">
                                                {stat.value}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">
                                                {stat.subValue}
                                            </p>
                                        </div>

                                        <p className="text-[11px] font-medium text-slate-400 leading-relaxed pt-6 border-t border-slate-50">
                                            {stat.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-12 shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Captured Ideas.</h3>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Latest pieces of knowledge saved to your brain</p>
                                </div>
                                <button
                                    onClick={() => router.push('/library')}
                                    className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 underline underline-offset-8"
                                >
                                    View Full Library
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoading ? (
                                    [...Array(3)].map((_, i) => (
                                        <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
                                    ))
                                ) : recentCrystals.length > 0 ? recentCrystals.map((crystal, idx) => (
                                    <motion.div
                                        key={crystal.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.05 }}
                                        className="flex items-center justify-between p-6 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer group"
                                        onClick={() => router.push(`/library`)}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                <Sparkles className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900">{crystal.title}</h3>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{crystal.domain}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-2">
                                                        <Clock size={12} /> {new Date(crystal.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No artifacts discovered yet</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            {[
                                { title: 'Idea Map', icon: Brain, path: '/cortex', desc: 'See how your thoughts connect', color: 'bg-indigo-50 text-indigo-600', hover: 'hover:bg-indigo-100' },
                                { title: 'Knowledge Hub', icon: Layers, path: '/loom', desc: 'Combine your ideas', color: 'bg-purple-50 text-purple-600', hover: 'hover:bg-purple-100' },
                                { title: 'Connections', icon: Activity, path: '/nexus', desc: 'Manage AI tool links', color: 'bg-emerald-50 text-emerald-600', hover: 'hover:bg-emerald-100' }
                            ].map((action, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    onClick={() => router.push(action.path)}
                                    className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 cursor-pointer transition-all hover:-translate-y-1 group`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                        <action.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">{action.title}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {action.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
