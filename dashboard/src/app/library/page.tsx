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

    const fetchCrystals = async (query: string = '') => {
        setLoading(true);
        try {
            if (query) {
                // PREDICATE-AWARE SEARCH
                const token = localStorage.getItem('nb_token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ query, top_k: 20 })
                });
                const data = await res.json();
                if (data.success) {
                    setCrystals(data.results.map((c: any) => ({
                        ...c,
                        author: Array.isArray(c.authors) ? c.authors[0] || { reputation: 0.0 } : c.authors
                    })));
                    setLoading(false);
                    return;
                }
            }

            // FALLBACK: List all
            const { data } = await supabase
                .from('crystals')
                .select('context_id, domain, intent, author:authors(reputation), raw_toon')
                .order('created_at', { ascending: false });

            if (data) {
                const mapped = data.map((c: any) => ({
                    ...c,
                    author: Array.isArray(c.author) ? c.author[0] || { reputation: 0.0 } : c.author
                }));
                setCrystals(mapped);
            }
        } catch (e) {
            console.error("Search failed:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrystals();
    }, []);

    // Debounced search trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) fetchCrystals(searchQuery);
            else if (searchQuery === '') fetchCrystals();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                            CRYSTAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">LIBRARY.</span>
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your sovereign knowledge manifold, indexed and verified.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH KNOWLEDGE (e.g. '@subject')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-64 rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 text-xs font-bold uppercase text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all placeholder-gray-400"
                            />
                        </div>
                        <button className="flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-900 hover:scale-105 transition-all shadow-xl shadow-black/10">
                            <Plus size={16} />
                            <span>Add Crystal</span>
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-64 rounded-[2rem] bg-gray-50 animate-pulse border border-gray-100" />
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
                                onClick={() => {
                                    setSelectedCrystal(crystal);
                                    setIsAuditorOpen(true);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-100 mb-6">
                            <Database className="text-gray-300" size={32} />
                        </div>
                        <h2 className="text-xl font-black italic tracking-tighter text-gray-900 mb-2">NO CRYSTALS FOUND</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 max-w-sm text-center">
                            Start a conversation or bridge knowledge from the web to populate your manifold.
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
