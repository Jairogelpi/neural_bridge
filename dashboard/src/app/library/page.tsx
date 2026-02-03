"use client";

import { useState, useEffect } from 'react';
import { Database, Search, Plus } from 'lucide-react';
import { CrystalCard } from '@/components/CrystalCard';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { CrystalAuditor } from '@/components/CrystalAuditor';

interface CrystalData {
    context_id: string;
    domain: string;
    intent: { primary: string };
    author: { reputation: number };
}

export default function LibraryPage() {
    const [crystals, setCrystals] = useState<CrystalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrystal, setSelectedCrystal] = useState<any>(null);
    const [isAuditorOpen, setIsAuditorOpen] = useState(false);

    useEffect(() => {
        const fetchCrystals = async () => {
            const { data } = await supabase
                .from('crystals')
                .select('context_id, domain, intent, author')
                .order('created_at', { ascending: false });

            if (data) setCrystals(data);
            setLoading(false);
        };
        fetchCrystals();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] mb-6">
                            LIBRARY_<span className="text-white/20">TRUTHS.</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-1">Your sovereign knowledge manifold, indexed and verified.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="SEARCH_LATTICE..."
                                className="h-12 w-full sm:w-80 rounded-2xl border border-white/5 bg-white/[0.02] pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500 focus:bg-white/5 transition-all placeholder-white/10"
                            />
                        </div>
                        <button className="h-12 flex items-center gap-3 rounded-2xl bg-indigo-500 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-500/20">
                            <Plus size={16} />
                            <span>Add_Crystal</span>
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-80 rounded-[3rem] bg-white/[0.02] animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : crystals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {crystals.map((crystal) => (
                            <CrystalCard
                                key={crystal.context_id}
                                id={crystal.context_id}
                                domain={crystal.domain}
                                intent={crystal.intent.primary}
                                reputation={crystal.author.reputation}
                                onClick={() => {
                                    setSelectedCrystal(crystal);
                                    setIsAuditorOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 rounded-[4rem] bg-white/[0.01] border border-white/5 border-dashed">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5">
                            <Database className="text-white/10" size={40} />
                        </div>
                        <h2 className="font-bebas text-4xl italic tracking-wider text-white mb-2">NO_CRYSTALS_FOUND.</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 max-w-sm text-center">
                            Connect to the neural bridge to begin synthesis.
                        </p>
                    </div>
                )}

                <CrystalAuditor
                    isOpen={isAuditorOpen}
                    onClose={() => setIsAuditorOpen(false)}
                    crystal={selectedCrystal}
                />
            </main>
        </div>
    );
}
