
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Filter, Plus } from 'lucide-react';
import { CrystalCard } from '@/components/CrystalCard';
import { supabase } from '@/lib/supabase';

interface CrystalData {
    context_id: string;
    domain: string;
    intent: { primary: string };
    author: { reputation: number };
}

export default function LibraryPage() {
    const [crystals, setCrystals] = useState<CrystalData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCrystals() {
            const { data, error } = await supabase
                .from('crystals')
                .select('context_id, domain, intent, author')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching crystals:", error.message);
            } else {
                setCrystals(data || []);
            }
            setLoading(false);
        }

        fetchCrystals();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] p-8 pb-24">
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Library of Truths</h1>
                    <p className="text-white/40 text-sm mt-1">Your sovereign knowledge manifold, indexed and verified.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="Search concepts..."
                            className="h-10 w-64 rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-xs text-white outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-400 transition-colors">
                        <Plus size={18} />
                        Add Crystal
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : crystals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {crystals.map((crystal) => (
                        <CrystalCard
                            key={crystal.context_id}
                            id={crystal.context_id}
                            domain={crystal.domain}
                            intent={crystal.intent.primary}
                            reputation={crystal.author.reputation}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                    <Database className="text-white/10 mb-4" size={48} />
                    <h2 className="text-lg font-bold text-white/60">No Crystals Synthesized Yet</h2>
                    <p className="text-sm text-white/30 max-w-sm text-center mt-2">
                        Start a conversation or bridge knowledge from the web to populate your manifold.
                    </p>
                </div>
            )}
        </div>
    );
}
