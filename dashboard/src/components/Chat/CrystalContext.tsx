"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Database, X, Plus, Info } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

interface Crystal {
    context_id: string;
    domain: string;
    intent: any;
}

interface CrystalContextProps {
    crystals: Crystal[];
    onRemove: (id: string) => void;
    onAdd: () => void;
}

export function CrystalContext({ crystals, onRemove, onAdd }: CrystalContextProps) {
    return (
        <div className="p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Tooltip content="Injection Context" description="These crystals are currently active in the neural window. The Oracle uses them as ground truth.">
                        <div className="flex items-center gap-2 cursor-help">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Context</span>
                            <Info size={10} className="text-gray-300" />
                        </div>
                    </Tooltip>
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold">
                        {crystals.length}
                    </span>
                </div>

                <button
                    onClick={onAdd}
                    className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <Plus size={12} />
                    Add Knowledge
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {crystals.length === 0 && (
                        <div className="w-full py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                            <p className="text-[10px] text-gray-400 font-medium">No crystals injected. Chatting with raw model.</p>
                        </div>
                    )}
                    {crystals.map((crystal) => (
                        <motion.div
                            key={crystal.context_id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="group flex items-center bg-white border border-gray-200 pl-3 pr-1 py-1.5 rounded-lg shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
                        >
                            <Database size={10} className="text-blue-500 mr-2" />
                            <span className="text-[10px] font-bold text-gray-700 truncate max-w-[150px] mr-2">
                                {crystal.domain}
                            </span>
                            <span className="px-1 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-tighter mr-2">TOON</span>
                            <button
                                onClick={() => onRemove(crystal.context_id)}
                                className="p-1 hover:bg-red-50 rounded-md text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <X size={10} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
