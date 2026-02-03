
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface CrystalCardProps {
    id: string;
    domain: string;
    intent: string;
    reputation: number;
    className?: string;
    onClick?: () => void;
}

export const CrystalCard: React.FC<CrystalCardProps> = ({
    id,
    domain,
    intent,
    reputation,
    className,
    onClick
}) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className={twMerge(
                "group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 cursor-pointer",
                className
            )}
        >
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">{domain}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{id.substring(0, 8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <Shield size={10} />
                    <span>VERIFIED</span>
                </div>
            </div>

            <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-8 line-clamp-3">
                {intent}
            </p>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Fidelity</span>
                        <span className="text-xs font-black text-slate-900">{(reputation * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Tier</span>
                        <span className="text-xs font-black text-indigo-600">Sovereign</span>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                    <ChevronRight size={18} />
                </div>
            </div>
        </motion.div>
    );
};
