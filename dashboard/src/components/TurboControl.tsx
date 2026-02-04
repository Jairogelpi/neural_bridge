"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Database,
    Cloud,
    Wifi,
    WifiOff,
    RefreshCw,
    Trash2,
    Check,
    Clock,
    TrendingUp
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface CacheStats {
    totalEntries: number;
    totalBytes: number;
    hitCount: number;
    missCount: number;
    hitRate: number;
}

interface TurboStatus {
    enabled: boolean;
    cacheStats: CacheStats;
    lastCompiled: string | null;
    offlineReady: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function TurboControl() {
    const [status, setStatus] = useState<TurboStatus>({
        enabled: true,
        cacheStats: {
            totalEntries: 0,
            totalBytes: 0,
            hitCount: 0,
            missCount: 0,
            hitRate: 0,
        },
        lastCompiled: null,
        offlineReady: false,
    });
    const [isCompiling, setIsCompiling] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        // Simulate loading cache stats
        setTimeout(() => {
            setStatus(prev => ({
                ...prev,
                cacheStats: {
                    totalEntries: 42,
                    totalBytes: 2.3 * 1024 * 1024,
                    hitCount: 156,
                    missCount: 12,
                    hitRate: 0.93,
                },
                lastCompiled: new Date(Date.now() - 3600000).toISOString(),
                offlineReady: true,
            }));
        }, 500);
    }, []);

    const handleCompileAll = async () => {
        setIsCompiling(true);
        // Simulate compilation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus(prev => ({
            ...prev,
            lastCompiled: new Date().toISOString(),
            cacheStats: {
                ...prev.cacheStats,
                totalEntries: prev.cacheStats.totalEntries + 5,
            },
        }));
        setIsCompiling(false);
    };

    const handleClearCache = async () => {
        setIsClearing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus(prev => ({
            ...prev,
            cacheStats: {
                totalEntries: 0,
                totalBytes: 0,
                hitCount: 0,
                missCount: 0,
                hitRate: 0,
            },
            offlineReady: false,
        }));
        setIsClearing(false);
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatTime = (isoString: string | null) => {
        if (!isoString) return 'Never';
        const date = new Date(isoString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="bg-gradient-to-br from-cyan-50 via-white to-indigo-50 rounded-[2rem] border border-slate-100 shadow-xl p-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Turbo Mode</h2>
                        <p className="text-sm text-slate-500">Crystal Cache Supremacy</p>
                    </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${status.offlineReady
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                    {status.offlineReady ? (
                        <>
                            <Wifi className="w-4 h-4" />
                            Offline Ready
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4" />
                            Online Only
                        </>
                    )}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={Database}
                    label="Cached Crystals"
                    value={status.cacheStats.totalEntries.toString()}
                    color="cyan"
                />
                <StatCard
                    icon={Cloud}
                    label="Cache Size"
                    value={formatBytes(status.cacheStats.totalBytes)}
                    color="indigo"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Hit Rate"
                    value={`${(status.cacheStats.hitRate * 100).toFixed(0)}%`}
                    color="emerald"
                />
                <StatCard
                    icon={Clock}
                    label="Last Compiled"
                    value={formatTime(status.lastCompiled)}
                    color="violet"
                />
            </div>

            {/* Hit/Miss Visualization */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-600">Cache Performance</span>
                    <span className="text-xs text-slate-400">
                        {status.cacheStats.hitCount} hits / {status.cacheStats.missCount} misses
                    </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${status.cacheStats.hitRate * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-emerald-400 to-cyan-500 h-full"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={handleCompileAll}
                    disabled={isCompiling}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCompiling ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            Compiling...
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5" />
                            Compile All Crystals
                        </>
                    )}
                </button>

                <button
                    onClick={handleClearCache}
                    disabled={isClearing || status.cacheStats.totalEntries === 0}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isClearing ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                        <Trash2 className="w-5 h-5" />
                    )}
                    Clear Cache
                </button>
            </div>

            {/* Speed Comparison */}
            <div className="mt-8 p-6 bg-white/50 rounded-2xl border border-slate-100">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-4">
                    Speed Comparison vs CAG
                </h3>
                <div className="space-y-3">
                    <SpeedBar label="CAG (First Query)" value={2500} max={3000} color="slate" />
                    <SpeedBar label="Neural Bridge (First Query)" value={800} max={3000} color="indigo" />
                    <SpeedBar label="CAG (Cached)" value={150} max={3000} color="slate" />
                    <SpeedBar label="Neural Bridge (Turbo)" value={5} max={3000} color="cyan" highlight />
                </div>
                <p className="mt-4 text-xs text-slate-400 text-center">
                    Latency in milliseconds (lower is better)
                </p>
            </div>
        </div>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ icon: Icon, label, value, color }: {
    icon: any;
    label: string;
    value: string;
    color: 'cyan' | 'indigo' | 'emerald' | 'violet';
}) {
    const colorClasses = {
        cyan: 'from-cyan-400 to-cyan-600 text-cyan-600 bg-cyan-50',
        indigo: 'from-indigo-400 to-indigo-600 text-indigo-600 bg-indigo-50',
        emerald: 'from-emerald-400 to-emerald-600 text-emerald-600 bg-emerald-50',
        violet: 'from-violet-400 to-violet-600 text-violet-600 bg-violet-50',
    };

    return (
        <div className={`p-4 rounded-xl ${colorClasses[color].split(' ').pop()} border border-slate-100`}>
            <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[2]} mb-2`} />
            <p className="text-2xl font-black text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
        </div>
    );
}

function SpeedBar({ label, value, max, color, highlight }: {
    label: string;
    value: number;
    max: number;
    color: 'slate' | 'indigo' | 'cyan';
    highlight?: boolean;
}) {
    const percent = (value / max) * 100;
    const colorClasses = {
        slate: 'bg-slate-300',
        indigo: 'bg-indigo-500',
        cyan: 'bg-gradient-to-r from-cyan-400 to-emerald-400',
    };

    return (
        <div className="flex items-center gap-4">
            <span className={`text-xs font-medium w-40 ${highlight ? 'text-cyan-700 font-bold' : 'text-slate-500'}`}>
                {label}
            </span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${colorClasses[color]} ${highlight ? 'shadow-md' : ''}`}
                />
            </div>
            <span className={`text-xs font-mono w-16 text-right ${highlight ? 'text-cyan-700 font-bold' : 'text-slate-400'}`}>
                {value}ms
            </span>
        </div>
    );
}
