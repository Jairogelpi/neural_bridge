
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Database, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
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
            whileHover={{ scale: 1.02, translateY: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={twMerge(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-shadow hover:shadow-[0_0_20px_rgba(0,242,255,0.15)]",
                className
            )}
        >
            {/* Decorative Gradient Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{domain}</h3>
                        <p className="text-[10px] text-white/40 font-mono">{id.substring(0, 8)}...</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-400/5 px-2 py-1 rounded-full border border-cyan-400/20">
                    <Shield size={10} />
                    <span>VERIFIED</span>
                </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-6 line-clamp-3">
                {intent}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase">Fidelity</span>
                        <span className="text-xs font-bold text-white">{(reputation * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] text-white/30 uppercase">Tier</span>
                        <span className="text-xs font-bold text-cyan-400">Sovereign</span>
                    </div>
                </div>
                <button
                    onClick={onClick}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </motion.div>
    );
};
