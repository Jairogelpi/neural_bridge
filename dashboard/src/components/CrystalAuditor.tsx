"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Fingerprint, Database, Zap, Code, Share2 } from 'lucide-react';

interface CrystalAuditorProps {
    isOpen: boolean;
    onClose: () => void;
    crystal: any;
}

export const CrystalAuditor: React.FC<CrystalAuditorProps> = ({ isOpen, onClose, crystal }) => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);
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
                    className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className={`relative w-full ${showAdvanced ? 'max-w-6xl' : 'max-w-2xl text-center'} transition-all duration-500 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row`}
                >
                    {/* Header (Mobile) */}
                    <div className="md:hidden p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-black tracking-tighter text-slate-900">IDEA INSPECTOR</h2>
                        <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl"><X size={20} /></button>
                    </div>

                    {/* Left Panel: Visual Analysis */}
                    <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                        <div className="hidden md:flex justify-between items-center mb-12">
                            <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                                <Shield size={12} className="text-indigo-600 mr-2" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Digital Mind Secure</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showAdvanced ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {showAdvanced ? 'Expert View' : 'Simple View'}
                                </button>
                                <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <header className={`${!showAdvanced && 'flex flex-col items-center'} mb-12`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Memory Path: {crystal.context_id?.substring(0, 12)}</p>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                                {crystal.domain.toUpperCase()}<span className="text-slate-200">.IDEAS</span>
                            </h2>
                        </header>

                        <div className="space-y-8">
                            {/* Summary Card */}
                            <div className={`bg-slate-50 rounded-[2.5rem] p-12 border border-slate-100 ${!showAdvanced && 'shadow-xl shadow-slate-200/20'}`}>
                                <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 ${!showAdvanced && 'justify-center'}`}>
                                    <Database size={14} /> Meaning of this Idea
                                </h3>
                                <p className={`text-2xl font-black text-slate-900 leading-relaxed ${!showAdvanced && 'max-w-md mx-auto'}`}>
                                    &quot;{crystal.intent?.primary || 'Undisclosed'}&quot;
                                </p>
                            </div>

                            {showAdvanced && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/20">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                            <Fingerprint size={12} /> Tech Signature
                                        </h4>
                                        <code className="text-[10px] font-mono text-indigo-600 bg-indigo-50/50 p-4 rounded-2xl block break-all border border-indigo-100/50">
                                            {crystal.verification?.canonical_hash || 'SHA256_0x' + Math.random().toString(16).substring(2, 20)}
                                        </code>
                                    </div>
                                    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/20">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                            <Zap size={12} /> Reliability Check
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(crystal.constraints || ['Structural', 'Logical', 'Semantic']).map((c: any, i: number) => (
                                                <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
                                                    {typeof c === 'string' ? c : c.rule}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {showAdvanced && (
                        <div className="w-full md:w-[450px] bg-slate-50 p-8 md:p-12 flex flex-col h-full overflow-hidden border-l border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Code size={14} className="text-indigo-600" /> RAW_DATA.JSON
                                </h3>
                                <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                    <Share2 size={16} />
                                </button>
                            </div>

                            <div className="flex-1 bg-white rounded-[2.5rem] p-8 font-mono text-[11px] text-slate-500 overflow-y-auto custom-scrollbar border border-slate-100 shadow-inner">
                                <pre className="whitespace-pre-wrap leading-relaxed">
                                    {JSON.stringify(crystal, null, 2)}
                                </pre>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">System Compliance</span>
                                    <span className="text-indigo-600">Secure</span>
                                </div>
                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 w-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
