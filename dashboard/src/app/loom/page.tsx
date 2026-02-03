"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Zap, Dna, Layers, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Crystal {
    context_id: string;
    domain: string;
    intent: { primary: string };
    author: { name: string };
}

export default function LoomPage() {
    const [crystals, setCrystals] = useState<Crystal[]>([]);
    const [selectedCrystals, setSelectedCrystals] = useState<string[]>([]);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const fetchCrystals = async () => {
            const { data } = await supabase.from('crystals').select('*').limit(50);
            if (data) setCrystals(data);
        };
        fetchCrystals();
    }, []);

    const toggleCrystal = (id: string) => {
        setSelectedCrystals(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleSynthesize = async () => {
        if (selectedCrystals.length < 2) return;
        setIsSynthesizing(true);
        try {
            // Simulated synthesis logic (calls backend later)
            await new Promise(r => setTimeout(r, 2000));
            setResult({
                title: "Synthesized Neural Lattice",
                domain: "Composite Intelligence",
                fidelity: 0.992
            });
        } finally {
            setIsSynthesizing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-16">
                    <h1 className="font-bebas text-8xl mb-4 italic leading-[0.8]">THE_LOOM.</h1>
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Synthesize multiple knowledge crystals into sovereign intelligence.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Crystal Selection List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Available Knowledge ({crystals.length})</h3>
                            <span className="text-[10px] font-bold text-white/20">Select 2+ crystals to weave</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {crystals.map((c) => (
                                <motion.div
                                    key={c.context_id}
                                    onClick={() => toggleCrystal(c.context_id)}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-3xl border cursor-pointer transition-all ${selectedCrystals.includes(c.context_id)
                                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                        : 'border-white/5 bg-white/2 backdrop-blur-md'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="px-2 py-0.5 rounded-lg bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/40">
                                            {c.domain}
                                        </div>
                                        {selectedCrystals.includes(c.context_id) && (
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold mb-2">{c.intent.primary}</h4>
                                    <p className="text-[10px] text-white/20 font-mono">{c.context_id.substring(0, 12)}...</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Synthesis Panel */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-12 p-8 rounded-[3rem] bg-indigo-500/5 border border-white/5 backdrop-blur-2xl">
                            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
                                <Layers size={14} className="text-indigo-400" /> Synthesis Matrix
                            </h3>

                            <div className="space-y-6 mb-12">
                                {selectedCrystals.map(id => (
                                    <div key={id} className="flex items-center gap-4 group">
                                        <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-[10px] font-mono text-indigo-400">{id.substring(0, 16)}</p>
                                            <p className="text-xs font-bold text-white/40">Manifesting Node...</p>
                                        </div>
                                    </div>
                                ))}

                                {selectedCrystals.length === 0 && (
                                    <p className="text-center py-12 text-[10px] font-bold uppercase text-white/20 italic">
                                        Waiting for input signals...
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleSynthesize}
                                disabled={selectedCrystals.length < 2 || isSynthesizing}
                                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${selectedCrystals.length < 2
                                    ? 'bg-white/5 text-white/20'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/20'
                                    }`}
                            >
                                {isSynthesizing ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Synthesizing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} />
                                        <span>Begin Synthesis</span>
                                    </>
                                )}
                            </button>

                            <AnimatePresence>
                                {result && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 p-6 rounded-2xl bg-white/5 border border-indigo-500/30 text-center"
                                    >
                                        <Dna className="mx-auto text-indigo-400 mb-4" size={32} />
                                        <h4 className="text-sm font-black italic">{result.title}</h4>
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase mt-1 tracking-widest">Fidelity: {result.fidelity * 100}%</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
