"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Database, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Crystal {
    context_id: string;
    domain: string;
    intent: any;
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
                const { data } = await supabase.from('crystals').select('*').limit(50);
                if (data) setCrystals(data);
                setLoading(false);
            };
            fetchCrystals();
        }
    }, [isOpen]);

    const filtered = crystals.filter(c =>
        c.domain.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(c.intent).toLowerCase().includes(search.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-black italic tracking-tight text-gray-900">INJECT KNOWLEDGE</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search library..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/30">
                    {loading ? (
                        <div className="col-span-2 text-center py-10 text-gray-400 text-xs">Loading lattice...</div>
                    ) : (
                        filtered.map(crystal => {
                            const isSelected = alreadySelected.includes(crystal.context_id);
                            return (
                                <button
                                    key={crystal.context_id}
                                    onClick={() => !isSelected && onSelect(crystal)}
                                    disabled={isSelected}
                                    className={`text-left p-4 rounded-xl border transition-all flex items-start gap-3 group ${isSelected
                                            ? 'bg-blue-50 border-blue-200 opacity-50 cursor-default'
                                            : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                                        {isSelected ? <Check size={14} /> : <Database size={14} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xs font-bold text-gray-900 truncate">{crystal.domain}</h3>
                                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                            {typeof crystal.intent === 'string'
                                                ? crystal.intent
                                                : (crystal.intent?.primary || 'No description')}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
}
