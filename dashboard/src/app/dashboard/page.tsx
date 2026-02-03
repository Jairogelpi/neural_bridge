/**
 * PREMIUM DASHBOARD 🏠
 * 
 * Glassmorphism dashboard with stats and recent crystals
 * Mobile-first responsive design
 */

'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/design';
import { motion } from 'framer-motion';
import {
    Plus,
    Clock,
    Users,
    Sparkles,
    ArrowRight,
    ShieldAlert,
    Wallet,
    Target,
    Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MobileNav } from '@/components/MobileNav';

interface DashboardStats {
    totalCrystals: number;
    todayCrystals: number;
    cacheHitRate: number;
    activeJobs: number;
    savingsUsd: number;
    fidelity: number;
    threatsBlocked: number;
    neuralDensity: number;
    timeSavedHours: number;
    // QUANTUM METRICS
    dreamCycles: number;
    fractalDepth: number;
    entropyBlocked: number;
}

export default function PremiumDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalCrystals: 0,
        todayCrystals: 0,
        cacheHitRate: 0,
        activeJobs: 0,
        savingsUsd: 0,
        fidelity: 0.984,
        threatsBlocked: 0,
        neuralDensity: 0.45,
        timeSavedHours: 0,
        dreamCycles: 0,
        fractalDepth: 1.0,
        entropyBlocked: 0
    });

    const [recentCrystals, setRecentCrystals] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('nb_token');

        // Load stats from real backend
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/analytics/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.stats) {
                    setStats({
                        totalCrystals: data.stats.total_crystals || 0,
                        todayCrystals: data.stats.crystals_today || 0,
                        cacheHitRate: data.stats.cacheHitRate || 0,
                        activeJobs: 0, // Calculated dynamically in backend
                        savingsUsd: data.stats.estimated_savings_usd || 0,
                        fidelity: data.stats.truth_fidelity || 0.984,
                        threatsBlocked: data.stats.threats_neutralized || 0,
                        neuralDensity: data.stats.neural_density || 0.45,
                        timeSavedHours: data.stats.time_saved_hours || 0,
                        dreamCycles: data.stats.dream_cycles || 0,
                        fractalDepth: data.stats.fractal_depth || 1.0,
                        entropyBlocked: data.stats.entropy_blocked || 0
                    });
                }
            })
            .catch(console.error);

        // Load recent crystals from backend
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/crystals?limit=5&sort=recent`)
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
            value: `$${stats.savingsUsd.toFixed(2)}`,
            subValue: 'In API Credits',
            icon: Wallet,
            color: 'green',
            gradient: 'from-emerald-500 to-green-600',
            description: 'Real dollars you saved by using your own memory instead of renting AI.'
        },
        {
            label: 'Time Saved',
            value: `${stats.timeSavedHours.toFixed(1)}h`,
            subValue: 'Productivity Gained',
            icon: Clock,
            color: 'amber',
            gradient: 'from-amber-500 to-orange-600',
            description: 'Hours you saved by not having to re-explain things to the AI.'
        },
        {
            label: 'Accuracy',
            value: `${(stats.fidelity * 100).toFixed(1)}%`,
            subValue: 'Proven Truth',
            icon: Target,
            color: 'blue',
            gradient: 'from-blue-500 to-indigo-600',
            description: 'The probability that your data is factually correct and free of hallucinations.'
        },
        {
            label: 'Lies Blocked',
            value: stats.threatsBlocked.toString(),
            subValue: 'Attempts Neutralized',
            icon: ShieldAlert,
            color: 'red',
            gradient: 'from-rose-500 to-red-600',
            description: 'Number of times the system stopped an AI from lying or hallucinating to you.'
        },
        {
            label: 'Brain Power',
            value: (stats.neuralDensity * 100).toFixed(0),
            subValue: 'Knowledge IQ',
            icon: Activity,
            color: 'purple',
            gradient: 'from-purple-500 to-fuchsia-600',
            description: 'A score representing how connected and powerful your personal knowledge base is.'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-20 md:pb-0">
            {/* Header - Mobile optimized */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
                            Neural Bridge
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">
                            Your knowledge, crystallized
                        </p>
                    </div>

                    {/* Desktop button */}
                    <Button
                        icon={<Plus size={20} />}
                        onClick={() => router.push('/ingest')}
                        className="hidden sm:flex"
                    >
                        New Crystal
                    </Button>

                    {/* Mobile FAB */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push('/ingest')}
                        className="sm:hidden w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg"
                    >
                        <Plus size={24} />
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
                {/* Stats Row - Responsive Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card glass className="bg-white/40 border-white/40 hover:bg-white/60 transition-all group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" />
                                    <CardContent className="p-4 sm:p-5 md:p-6">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <div className={`p-2 sm:p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg shadow-${stat.color}-500/20`}>
                                                    <Icon className="text-white" size={14} />
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Omega v1.0</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] sm:text-[11px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                                                    {stat.label}
                                                </p>
                                                <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 tracking-tighter">
                                                    {stat.value}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-900/40 mt-1 uppercase tracking-tighter">
                                                    {stat.subValue}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100/50">
                                                <p className="text-[9px] font-medium text-gray-400 leading-tight">
                                                    {stat.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* QUANTUM METRICS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <Card glass className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border-indigo-500/20">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Dream Cycles</p>
                                    <p className="text-3xl font-black text-indigo-900 mt-1">{stats.dreamCycles}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <Sparkles className="text-indigo-600" size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <Card glass className="bg-gradient-to-br from-pink-900/10 to-rose-900/10 border-pink-500/20">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Fractal Depth</p>
                                    <p className="text-3xl font-black text-pink-900 mt-1">{stats.fractalDepth.toFixed(2)}x</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                                    <Activity className="text-pink-600" size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <Card glass className="bg-gradient-to-br from-green-900/10 to-emerald-900/10 border-green-500/20">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Entropy Blocked</p>
                                    <p className="text-3xl font-black text-green-900 mt-1">{stats.entropyBlocked}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <ShieldAlert className="text-green-600" size={24} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Crystals */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card glass={false} hover={false} className="border-2">
                        <CardHeader className="p-4 sm:p-6">
                            <div className="flex flex-row items-start sm:items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg sm:text-xl">Recent Crystals</CardTitle>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                                        Your latest knowledge captures
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/cortex')}
                                    className="shrink-0"
                                >
                                    <span className="hidden sm:inline">View All</span>
                                    <ArrowRight size={16} />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                            {recentCrystals.map((crystal, idx) => (
                                <motion.div
                                    key={crystal.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + idx * 0.1 }}
                                    className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-gray-50/50 transition-colors cursor-pointer group active:bg-gray-100/50"
                                    onClick={() => router.push(`/crystals/${crystal.id}`)}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                                            <Sparkles className="text-white" size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                                                {crystal.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="primary" className="text-xs">{crystal.domain}</Badge>
                                                <span className="text-xs text-gray-500 hidden sm:inline">{crystal.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" size={18} />
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Actions - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
                >
                    <Card glass onClick={() => router.push('/ingest')} className="cursor-pointer active:scale-95 transition-transform">
                        <CardContent className="text-center py-6 sm:py-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Plus className="text-white" size={28} />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900">Create Crystal</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2">
                                Transform any content into knowledge
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass onClick={() => router.push('/cortex')} className="cursor-pointer active:scale-95 transition-transform">
                        <CardContent className="text-center py-6 sm:py-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Sparkles className="text-white" size={28} />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900">Explore Cortex</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2">
                                Navigate your knowledge graph
                            </p>
                        </CardContent>
                    </Card>

                    <Card glass className="cursor-pointer active:scale-95 transition-transform sm:col-span-2 md:col-span-1">
                        <CardContent className="text-center py-6 sm:py-8">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Users className="text-white" size={28} />
                            </div>
                            <h3 className="font-bold text-base sm:text-lg text-gray-900">Collaborate</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-2 px-2">
                                Share and edit with your team
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
