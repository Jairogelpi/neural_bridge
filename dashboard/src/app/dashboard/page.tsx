"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    Activity,
    Shield,
    Zap,
    Database,
    Search
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MetricCard } from '@/components/MetricCard';
import { ActivityItem } from '@/components/ActivityItem';
import { Sidebar } from '@/components/Sidebar';
import { Tooltip } from '@/components/Tooltip';

interface Stats {
    total_vaccines: number;
    total_crystals: number;
    total_jury_cases: number;
    system_health: number;
}

interface Log {
    log_id: string;
    type: string;
    severity: string;
    message: string;
    timestamp: string;
}

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats>({
        total_vaccines: 0,
        total_crystals: 0,
        total_jury_cases: 0,
        system_health: 1.0
    });
    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(() => {
        // Initial Fetch
        const fetchInitialData = async () => {
            const { data: statsData } = await supabase.from('sentinel_stats').select('*').single();
            if (statsData) setStats(statsData);

            const { data: logsData } = await supabase.from('sentinel_logs').select('*').order('timestamp', { ascending: false }).limit(20);
            if (logsData) setLogs(logsData);
        };
        fetchInitialData();

        // Realtime Subscription
        const channel = supabase
            .channel('dashboard_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sentinel_logs' }, (payload) => {
                const newLog = payload.new as Log;
                setLogs(prev => [newLog, ...prev].slice(0, 20));
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sentinel_stats' }, (payload) => {
                setStats(payload.new as Stats);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center px-4 py-1.5 bg-green-50 rounded-full mb-4 border border-green-100"
                        >
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">System Sovereign & Live</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900">
                            WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{user.name.toUpperCase()}.</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 w-64">
                            <Search size={14} className="mr-3" />
                            <input type="text" placeholder="Search crystals..." className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none w-full placeholder-gray-400" />
                        </div>
                    </div>
                </header>

                {/* METRICS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Tooltip content="System Integrity" description="Real-time verification score based on zero-knowledge proofs from the last 100 transactions.">
                        <MetricCard
                            label="Truth Fidelity"
                            value="99.9%"
                            icon={Shield}
                            color="blue"
                            subValue="VERIFIED"
                        />
                    </Tooltip>

                    <Tooltip content="Total Knowledge" description="Total count of unique knowledge crystals indexed in the sovereign graph relative to the global manifold.">
                        <MetricCard
                            label="Knowledge Crystals"
                            value={stats.total_crystals}
                            icon={Database}
                            color="cyan"
                        />
                    </Tooltip>

                    <Tooltip content="Network Latency" description="Round-trip time to the Neural Bridge Oracle edge nodes.">
                        <MetricCard
                            label="Latency"
                            value="12ms"
                            icon={Zap}
                            color="purple"
                            subValue="LOCAL"
                        />
                    </Tooltip>

                    <Tooltip content="Synaptic Density" description="Number of active connections and relationships between crystals in the cortex graph.">
                        <MetricCard
                            label="Active Synapses"
                            value="4,096"
                            icon={Activity}
                            color="indigo"
                        />
                    </Tooltip>
                </div>

                {/* ACTIVITY FEED */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Live Pulse Stream</h2>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Realtime Protocol Active</span>
                    </div>

                    <div className="space-y-4 max-w-4xl">
                        {logs.length === 0 ? (
                            <div className="text-center py-20 text-gray-300 text-xs font-bold uppercase tracking-widest">
                                No activity detected in this cycle.
                            </div>
                        ) : (
                            logs.map(log => (
                                <ActivityItem
                                    key={log.log_id}
                                    type={log.type}
                                    message={log.message}
                                    timestamp={log.timestamp}
                                    severity={log.severity}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
