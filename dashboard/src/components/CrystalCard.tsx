
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Database, ChevronRight, Infinity as InfinityIcon, Code, Image as ImageIcon, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CrystalCardProps {
    id: string;
    domain: string;
    intent: string;
    reputation: number;
    raw_toon?: string;
    className?: string;
    onClick?: () => void;
    // Phase Infinity / Omega
    scp_version?: string;
    mime_type?: string;
    axiomatic?: boolean;
}

export const CrystalCard: React.FC<CrystalCardProps> = ({
    id,
    domain,
    intent,
    reputation,
    className,
    onClick,
    scp_version,
    mime_type,
    axiomatic
}) => {
    const getIcon = () => {
        if (!mime_type) return <Brain size={20} />;
        if (mime_type.startsWith('image/')) return <ImageIcon size={20} />;
        if (mime_type.startsWith('text/x-typescript') || mime_type.startsWith('application/javascript')) return <Code size={20} />;
        if (mime_type.startsWith('text/')) return <FileText size={20} />;
        return <InfinityIcon size={20} />;
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, translateY: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={twMerge(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-shadow hover:shadow-[0_0_20px_rgba(79,70,229,0.2)]",
                className
            )}
        >
            {/* Decorative Gradient Glow */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${axiomatic ? 'bg-indigo-500/20' : 'bg-cyan-500/10'}`} />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={twMerge(
                        "flex h-10 w-10 items-center justify-center rounded-lg border",
                        axiomatic ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                    )}>
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{domain}</h3>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] text-white/40 font-mono">{id.substring(0, 8)}...</p>
                            {scp_version === '0.2' && (
                                <span className="text-[8px] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-1 rounded font-black italic">SIGMA</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {axiomatic && (
                        <div className="flex items-center gap-1 text-[8px] font-black text-white bg-indigo-600 px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/20">
                            <Shield size={8} />
                            <span>AXIOMATIC</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-400/5 px-2 py-1 rounded-full border border-cyan-400/20">
                        <Shield size={10} />
                        <span>VERIFIED</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-6 line-clamp-3">
                {intent}
            </p>

            {/* LOGIC DENSITY BAR (TOON SATURATION) */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-1 text-[8px] uppercase tracking-widest font-black">
                    <span className="text-white/40">Logic Saturation</span>
                    <span className="text-cyan-400">{(reputation * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${reputation * 100}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    />
                </div>
            </div>

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
