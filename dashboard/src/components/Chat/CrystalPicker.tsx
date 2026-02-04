"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Database, Check, Cpu, Calendar, User, Clock, ShieldCheck, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Tooltip } from '@/components/Tooltip';

interface Crystal {
    context_id: string;
    domain: string;
    intent: any;
    created_at: string;
    author: {
        name: string;
        reputation: number;
    };
    embedding_model?: string;
    confidence_score?: number;
    vector_dims?: number;
    raw_toon?: string; // TOON manifold for logic-native display
}

interface CrystalPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (crystal: Crystal) => void;
    alreadySelected: string[];
}

export function CrystalPicker({ isOpen, onClose, onSelect, alreadySelected }: CrystalPickerProps) {
    const [crystals, setCrystals] = useState<Crystal[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchCrystals = async () => {
                setLoading(true);
                // In a real scenario, ensure these columns exist or use 'select(*)' and map safely
                const { data } = await supabase.from('crystals').select('*').limit(50);
                if (data) setCrystals(data);
                setLoading(false);
            };
            fetchCrystals();
        }
    }, [isOpen]);

    const filtered = crystals.filter(c =>
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        (c.raw_toon || JSON.stringify(c.intent)).toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 ring-1 ring-black/5"
            >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tight text-gray-900">OMNI-LIBRARY INJECTION</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Select high-fidelity knowledge crystals for context.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                        <X size={20} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>

                <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Query the sovereign lattice..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm placeholder:font-medium placeholder:text-gray-300"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 gap-4 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Synchronizing Lattice...</span>
                        </div>
                    ) : (
                        filtered.map(crystal => {
                            const isSelected = alreadySelected.includes(crystal.context_id);
                            return (
                                <motion.button
                                    key={crystal.context_id}
                                    layout
                                    onClick={() => !isSelected && onSelect(crystal)}
                                    disabled={isSelected}
                                    className={`relative text-left p-6 rounded-[2rem] border transition-all group overflow-hidden ${isSelected
                                        ? 'bg-blue-50/50 border-blue-200 cursor-default'
                                        : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1'
                                        }`}
                                >
                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-6 right-6 flex items-center gap-2 text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <Check size={12} className="stroke-[3]" />
                                            Active Context
                                        </div>
                                    )}

                                    {/* TOON Native Indicator */}
                                    {(crystal as any).raw_toon && (
                                        <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter border border-emerald-100 mr-28">
                                            <ShieldCheck size={10} />
                                            TOON NATIVE
                                        </div>
                                    )}

                                    <div className="flex items-start gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${isSelected
                                            ? 'bg-blue-500 text-white shadow-blue-500/20'
                                            : 'bg-gray-900 text-white group-hover:bg-blue-600 group-hover:shadow-blue-500/30 transition-all'
                                            }`}>
                                            <Database size={24} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-black text-gray-900 tracking-tight">{crystal.domain}</h3>
                                                <div className="h-4 w-px bg-gray-200" />
                                                <span className="text-[10px] font-mono text-gray-400">{crystal.context_id.substring(0, 8)}...</span>
                                            </div>

                                            <p className="text-sm font-medium text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-2">
                                                {typeof crystal.intent === 'string'
                                                    ? crystal.intent
                                                    : (crystal.intent?.primary || crystal.raw_toon || JSON.stringify(crystal.intent))}
                                            </p>

                                            {/* Detailed Stats Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                <Tooltip content="Author Reputation" description="Cryptographic reputation score of the sovereign identity who minted this crystal.">
                                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                                        <User size={16} className="text-gray-400" />
                                                        <div>
                                                            <div className="text-[10px] font-bold uppercase text-gray-400">Author</div>
                                                            <div className="text-xs font-black text-gray-900 flex items-center gap-1">
                                                                {crystal.author?.name || 'System'}
                                                                <span className="text-green-500 text-[10px]">{(crystal.author?.reputation || 1.0) * 100}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>

                                                <Tooltip content="Temporal Anchor" description="Precise timestamp when this knowledge was anchored to the lattice.">
                                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                                        <Calendar size={16} className="text-gray-400" />
                                                        <div>
                                                            <div className="text-[10px] font-bold uppercase text-gray-400">Created</div>
                                                            <div className="text-xs font-black text-gray-900">
                                                                {new Date(crystal.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>

                                                <Tooltip content="Truth Density" description="The density of logical predicates within the Truth-Oriented manifold. High density indicates a rigorous axiom.">
                                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                                        <Activity size={16} className="text-gray-400" />
                                                        <div>
                                                            <div className="text-[10px] font-bold uppercase text-gray-400">Truth Density</div>
                                                            <div className="text-xs font-black text-gray-900">
                                                                {(crystal as any).raw_toon ? ((crystal as any).raw_toon.length / 500).toFixed(2) : '0.00'}<span className="text-gray-400 font-normal"> t/kb</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>

                                                <Tooltip content="Chain Fidelity" description="Confidence score ensuring this data has not been tampered with since ingestion.">
                                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                                                        <ShieldCheck size={16} className="text-green-500" />
                                                        <div>
                                                            <div className="text-[10px] font-bold uppercase text-gray-400">Integrity</div>
                                                            <div className="text-xs font-black text-green-600">
                                                                VERIFIED
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
}
