"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ShieldCheck, Zap, AlertTriangle, Activity, Database, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Vaccine {
    vaccine_id: string;
    fallacy_type: string;
    meta_invariant: any;
    potency: number;
    severity: number;
    created_at: string;
}

export default function VaccineVaultPage() {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const response = await api.get('/v1/vaccines');
                if (response.data.success) {
                    setVaccines(response.data.vaccines);
                }
            } catch (error) {
                console.error('Failed to fetch vaccines:', error);
                // Mock data for initial view if backend hasn't deployed yet
                setVaccines([
                    {
                        vaccine_id: 'v1',
                        fallacy_type: 'AD_HOMINEM_REJECTION',
                        meta_invariant: { pattern: 'HDC_0x123' },
                        potency: 12,
                        severity: 5,
                        created_at: new Date().toISOString()
                    },
                    {
                        vaccine_id: 'v2',
                        fallacy_type: 'HALUCINATION_SHIELD',
                        meta_invariant: { pattern: 'HDC_0x456' },
                        potency: 45,
                        severity: 8,
                        created_at: new Date().toISOString()
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVaccines();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-16">
                    <div className="inline-flex items-center px-4 py-1.5 bg-teal-500/10 rounded-full mb-6 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.1)]">
                        <ShieldCheck size={12} className="text-teal-400 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">Semantic Immunity Active</span>
                    </div>
                    <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] text-white">
                        VACCINE_<span className="text-teal-400/30">VAULT.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mt-4">Anti-fallacy hypervectors protecting the lattice from corruption</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gradient-to-br from-teal-600 to-indigo-600 text-white rounded-[3rem] p-10 shadow-2xl shadow-teal-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <ShieldCheck size={180} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 relative z-10 opacity-60">IMMUNITY_POTENCY</h3>
                            <p className="text-6xl font-black italic tracking-tighter mb-8 relative z-10">
                                {vaccines.reduce((acc, v) => acc + v.potency, 0)}
                                <span className="text-[10px] font-black ml-4 uppercase tracking-[0.4em] opacity-40">SMT_UNIT.</span>
                            </p>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] bg-black/20 p-4 rounded-2xl w-fit backdrop-blur-3xl border border-white/10">
                                <Activity size={12} className="text-teal-400" />
                                <span>Lattice_Shield: 99.9%</span>
                            </div>
                        </div>

                        <div className="glass-panel rounded-[3rem] p-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-3">
                                <ShieldAlert size={14} className="text-orange-500" />
                                DETECTED_THREATS.
                            </h3>
                            <div className="space-y-6">
                                {['Strawman Fallacy', 'Circular Logic', 'Source Bias'].map((fallacy, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-white/60">{fallacy}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${80 - i * 20}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-white/30">{(80 - i * 20)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vaccine List */}
                    <div className="lg:col-span-2 space-y-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-4">ACTIVE_NEUTRALIZERS.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {vaccines.map((vaccine) => (
                                <motion.div
                                    key={vaccine.vaccine_id}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="glass-panel rounded-[2.5rem] p-8 group transition-all"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <span className="px-3 py-1 bg-white/5 text-white/20 text-[8px] font-black rounded-lg uppercase tracking-widest border border-white/5">
                                            HEX: {vaccine.vaccine_id}
                                        </span>
                                    </div>

                                    <h4 className="text-sm font-black text-white mb-2 uppercase tracking-widest group-hover:text-teal-400 transition-colors">{vaccine.fallacy_type}</h4>
                                    <p className="text-[10px] font-bold text-white/20 mb-8 uppercase tracking-widest leading-relaxed">Generated from Jury Consensus 0.92 • High Fidelity</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                                            <span className="block text-[8px] font-black uppercase text-white/20 mb-2">Potency</span>
                                            <span className="text-sm font-black text-teal-400">+{vaccine.potency}</span>
                                        </div>
                                        <div className="bg-white/2 p-4 rounded-2xl border border-white/5">
                                            <span className="block text-[8px] font-black uppercase text-white/20 mb-2">Severity</span>
                                            <span className="text-sm font-black text-orange-400">{vaccine.severity}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {vaccines.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center py-32 rounded-[4rem] bg-white/[0.01] border border-white/5 border-dashed">
                                <Database size={40} className="text-white/10 mb-6" />
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">No vaccines deployed yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
