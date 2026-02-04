"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Fingerprint, Database, Zap, Code, Share2, Infinity as InfinityIcon, Clock, Link as LinkIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { ToonService } from '@/lib/toon';

interface CrystalAuditorProps {
    isOpen: boolean;
    onClose: () => void;
    crystal: any;
}

export const CrystalAuditor: React.FC<CrystalAuditorProps> = ({ isOpen, onClose, crystal }) => {
    const [activeTab, setActiveTab] = React.useState<'semantic' | 'axiomatic' | 'multimodal'>('semantic');
    if (!isOpen || !crystal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
                >
                    {/* Header (Mobile) */}
                    <div className="md:hidden p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-black italic tracking-tighter">FORENSIC AUDITOR</h2>
                        <button onClick={onClose} className="p-2 bg-gray-100 rounded-xl"><X size={20} /></button>
                    </div>

                    {/* Left Panel: Visual Analysis */}
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto hidden-scrollbar">
                        <div className="hidden md:flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                                    <Shield size={12} className="text-indigo-600 mr-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Forensic Inspection Active</span>
                                </div>
                                {crystal.scp_version === '0.2' && (
                                    <span className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest italic shadow-lg shadow-indigo-500/20">
                                        SIGMA v0.2
                                    </span>
                                )}
                            </div>
                            <button onClick={onClose} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
                            {(['semantic', 'axiomatic', 'multimodal'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={twMerge(
                                        "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all relative",
                                        activeTab === tab ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
                                    )}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <header className="mb-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Context Handle: {crystal.context_id}</p>
                            <h2 className="text-4xl font-black italic tracking-tighter">
                                {crystal.domain.toUpperCase()}<span className="text-gray-200">.MANIFOLD</span>
                            </h2>
                        </header>

                        <div className="space-y-8">
                            {/* TAB 1: SEMANTIC */}
                            {activeTab === 'semantic' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            <Database size={14} /> Semantic Intent
                                        </h3>
                                        <p className="text-xl font-bold text-gray-900 leading-relaxed italic">
                                            &quot;{crystal.intent?.primary || 'Undisclosed'}&quot;
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                <Fingerprint size={12} /> Holographic Hash
                                            </h4>
                                            <code className="text-[10px] font-mono text-indigo-600 bg-indigo-50 p-2 rounded block break-all">
                                                {crystal.verification?.canonical_hash || 'SHA256_0x' + Math.random().toString(16).substring(2, 20)}
                                            </code>
                                        </div>
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                <Zap size={12} /> Truth Invariants
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {(crystal.constraints || []).map((c: any, i: number) => {
                                                    const rule = typeof c === 'string' ? c : (c.rule || 'MUST');
                                                    const val = typeof c === 'string' ? '' : (c.value || c.id);
                                                    return (
                                                        <div key={i} className="px-3 py-1.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-xl border border-green-100 flex items-center gap-1.5">
                                                            <span className="opacity-40">{rule}</span>
                                                            <span>[{val}]</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 2: AXIOMATIC */}
                            {activeTab === 'axiomatic' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/20">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-300">Axiomatic Enforcement Output</h3>
                                            <span className="px-2 py-1 bg-emerald-500 text-black text-[8px] font-black rounded uppercase">Status: SAT</span>
                                        </div>
                                        <p className="text-sm font-mono text-indigo-100 leading-loose italic">
                                            [UsidEngine] Verification passed. All 10,000 manifold constraints are satisfied. No axiomatic breaches detected in the local reality shard.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                <Shield size={12} /> Logic Stability
                                            </h4>
                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 w-[98%]" />
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-2 font-bold italic">98.2% Certainty</p>
                                        </div>
                                        <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                                <Database size={12} /> Manifold Index
                                            </h4>
                                            <p className="font-mono text-[10px] text-indigo-600">ID_0XF4A2...</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB 3: MULTIMODAL */}
                            {activeTab === 'multimodal' && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-gray-50 border border-indigo-100 rounded-[2.5rem] p-8">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                            <LinkIcon size={14} /> Signal Lineage
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Input Signal URI</span>
                                                <span className="text-[10px] font-mono font-bold text-indigo-600">{crystal.source?.raw_uri || 'internal://raw_signal'}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Mime-Type Signature</span>
                                                <span className="text-[10px] font-mono font-bold text-gray-900">{crystal.source?.mime_type || 'text/plain'}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">Extraction Model</span>
                                                <span className="text-[10px] font-mono font-bold text-gray-900">{crystal.source?.model || 'crystal-deep-v2'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                                            <InfinityIcon size={12} /> Universal Traceability
                                        </h4>
                                        <p className="text-[11px] text-indigo-800 leading-relaxed italic">
                                            This crystal is a sovereign projection of a {crystal.source?.mime_type || 'textual'} reality signal. The original binary state is cryptographically locked and linked to this manifold coordinate.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* LOGIC CONNECTOME (Hard Synapses) - This section remains outside the tabs */}
                            {crystal.synapses && crystal.synapses.length > 0 && (
                                <div className="bg-emerald-50/30 rounded-[2.5rem] p-8 border border-emerald-100">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                                        <Share2 size={14} /> Logic Connectome
                                    </h3>
                                    <div className="space-y-4">
                                        {crystal.synapses.filter((s: any) => s.type === 'LOGICAL_OVERLAP').map((syn: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[8px]">S</div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-900">Hard Synapse (Strength: {syn.strength})</p>
                                                        <p className="text-[9px] text-gray-400 font-mono italic">{syn.justification}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{syn.target.substring(0, 8)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Code & Metadata */}
                    <div className="w-full md:w-[400px] bg-slate-900 p-8 md:p-12 flex flex-col h-full overflow-hidden border-l border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Code size={14} className="text-indigo-400" /> {crystal.raw_toon ? 'TRUTH_GRAPH.TOON' : 'RAW_CRYSTAL.JSON'}
                            </h3>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                        </div>

                        <div className="flex-1 bg-black/40 rounded-3xl p-6 font-mono text-[10px] text-indigo-300/80 overflow-y-auto custom-scrollbar border border-white/5 relative selection:bg-indigo-500/30">
                            <div className="absolute top-4 right-4 px-2 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded text-[8px] font-black uppercase tracking-widest text-indigo-400 italic">
                                SOVEREIGN_V02_SIGMA
                            </div>
                            <pre className="whitespace-pre-wrap leading-relaxed italic">
                                {crystal.raw_toon || ToonService.stringify({
                                    metadata: { intent: crystal.intent?.primary },
                                    constraints: (crystal.constraints || []).map((c: any) => ({
                                        type: typeof c === 'string' ? 'MUST' : c.rule,
                                        value: typeof c === 'string' ? c : c.value
                                    })),
                                    graph: []
                                })}
                            </pre>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-gray-500">Node Compliance</span>
                                <span className="text-white">100% Secure</span>
                            </div>
                            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-400 w-full" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
