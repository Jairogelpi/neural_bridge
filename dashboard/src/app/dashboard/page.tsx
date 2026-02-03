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
    Zap,
    TrendingUp,
    Clock,
    Users,
    Sparkles,
    ArrowRight,
    Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MobileNav } from '@/components/MobileNav';

interface DashboardStats {
    totalCrystals: number;
    todayCrystals: number;
    cacheHitRate: number;
    activeJobs: number;
}

export default function PremiumDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalCrystals: 0,
        todayCrystals: 0,
        cacheHitRate: 0,
        activeJobs: 0
    });

    const [recentCrystals, setRecentCrystals] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Load stats from real backend
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/analytics/stats`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.stats) {
                    setStats({
                        totalCrystals: data.stats.totalCrystals || 0,
                        todayCrystals: data.stats.dailyCrystals || 0,
                        cacheHitRate: data.stats.cacheHitRate || 0,
                        activeJobs: data.stats.activeJobs || 0
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
            label: 'Total Crystals',
            value: stats.totalCrystals.toLocaleString(),
            icon: Sparkles,
            color: 'purple',
            gradient: 'from-purple-500 to-indigo-600'
        },
        {
            label: 'Today',
            value: stats.todayCrystals.toString(),
            icon: Clock,
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            label: 'Cache Hit',
            value: stats.cacheHitRate + '%',
            icon: Zap,
            color: 'green',
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            label: 'Active Jobs',
            value: stats.activeJobs.toString(),
            icon: TrendingUp,
            color: 'amber',
            gradient: 'from-amber-500 to-orange-600'
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    {statCards.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card glass hover>
                                    <CardContent className="p-3 sm:p-4 md:p-6">
                                        {/* Mobile: Vertical Layout */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 sm:gap-0">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                                                    {stat.label}
                                                </p>
                                                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                                                    {stat.value}
                                                </p>
                                            </div>
                                            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.gradient} self-end sm:self-auto`}>
                                                <Icon className="text-white" size={16} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
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
