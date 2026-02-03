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
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredCrystals = crystals.filter(c =>
        c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.intent.primary.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex font-sans">
            <Sidebar />

            <main className="flex-1 md:ml-72 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 mb-6">
                            <Database size={12} className="text-indigo-600 mr-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Safe Storage</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tight text-slate-900">
                            My <span className="text-indigo-600">Memory.</span>
                        </h1>
                        <p className="text-sm font-medium text-slate-400 mt-4 max-w-lg">All the ideas and facts you&apos;ve saved from AI conversations, organized and ready for you.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={16} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search your memories..."
                                className="h-14 w-full sm:w-80 rounded-2xl border border-slate-100 bg-white pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/2 transition-all placeholder-slate-200 shadow-xl shadow-slate-200/40"
                            />
                        </div>
                        <button className="h-14 flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 text-xs font-black uppercase tracking-widest text-white hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all shadow-xl shadow-indigo-600/20">
                            <Plus size={18} />
                            <span>Capture Idea</span>
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-80 rounded-[3rem] bg-white animate-pulse border border-slate-100 shadow-xl shadow-slate-200/40" />
                        ))}
                    </div>
                ) : filteredCrystals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCrystals.map((crystal) => (
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
                    <div className="flex flex-col items-center justify-center py-40 rounded-[4rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-8 border border-slate-100">
                            <Database className="text-slate-200" size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Your Memory is Empty.</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 max-w-sm text-center">
                            Capture your first idea from AI to see it appear here.
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
