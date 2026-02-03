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
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 bg-green-50 rounded-full mb-4 border border-green-100">
                        <ShieldCheck size={12} className="text-green-600 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-700">Semantic Immunity Active</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                        VACCINE <span className="text-green-600">VAULT.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Anti-fallacy hypervectors protecting the lattice from corruption.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-[2rem] p-8 shadow-2xl shadow-green-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck size={120} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter mb-2 relative z-10">IMMUNITY POTENCY</h3>
                            <p className="text-4xl font-black mb-4 relative z-10">
                                {vaccines.reduce((acc, v) => acc + v.potency, 0)}
                                <span className="text-sm font-medium ml-2 opacity-50 uppercase tracking-widest">Total SMT-Units</span>
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/20 p-3 rounded-lg w-fit backdrop-blur-sm">
                                <Activity size={12} />
                                <span>Lattice Shield: 99.9%</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <ShieldAlert size={14} className="text-orange-500" />
                                Detected Threats
                            </h3>
                            <div className="space-y-4">
                                {['Strawman Fallacy', 'Circular Logic', 'Source Bias'].map((fallacy, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-gray-700">{fallacy}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500" style={{ width: `${80 - i * 20}%` }} />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400">{(80 - i * 20)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Vaccine List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Active Neutralizers</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vaccines.map((vaccine) => (
                                <motion.div
                                    key={vaccine.vaccine_id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[8px] font-black rounded uppercase tracking-tighter">
                                            ID: {vaccine.vaccine_id}
                                        </span>
                                    </div>

                                    <h4 className="text-sm font-black text-gray-900 mb-1">{vaccine.fallacy_type}</h4>
                                    <p className="text-[10px] font-medium text-gray-400 mb-6">Generated from Jury Consensus 0.92</p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="block text-[8px] font-black uppercase text-gray-400 mb-1">Potency</span>
                                            <span className="text-xs font-black text-green-600">+{vaccine.potency}</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="block text-[8px] font-black uppercase text-gray-400 mb-1">Severity</span>
                                            <span className="text-xs font-black text-orange-600">{vaccine.severity}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {vaccines.length === 0 && !isLoading && (
                            <div className="text-center py-12 bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                                <Database size={32} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No vaccines deployed yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
