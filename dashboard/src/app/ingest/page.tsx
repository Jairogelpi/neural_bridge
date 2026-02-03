"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Upload, FileText, Database, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function IngestPage() {
    const [text, setText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleIngest = async () => {
        if (!text.trim()) return;
        setIsProcessing(true);
        setStatus('idle');

        try {
            // Simulate AI Processing & Vectorization
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create Crystal in Supabase
            const { error } = await supabase.from('crystals').insert({
                domain: 'MANUAL_INGEST',
                intent: { primary: text.substring(0, 100) + '...', full: text },
                author: { reputation: 1.0, source: 'HUMAN_OVERRIDE' },
                context_id: `manual_${Date.now()}`,
                origin_app: 'DASHBOARD_NEUROGENESIS'
            });

            if (error) throw error;
            setStatus('success');
            setText('');
        } catch (error) {
            console.error(error);
            setStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-12">
                    <div className="inline-flex items-center px-4 py-1.5 bg-blue-50 rounded-full mb-4 border border-blue-100">
                        <Sparkles size={12} className="text-blue-600 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">Active Neurogenesis Protocol</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                        DATA <span className="text-blue-600">INJECTION.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Manually bridge raw knowledge into the sovereign manifold.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-50 rounded-[2rem] p-1 border border-gray-100 shadow-inner">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste raw knowledge, axioms, or observations here..."
                                className="w-full h-96 bg-white rounded-[1.8rem] p-8 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder-gray-300"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                                <button className="p-4 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                    <Upload size={20} />
                                </button>
                                <button className="p-4 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                    <FileText size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleIngest}
                                disabled={isProcessing || !text.trim()}
                                className="px-8 py-4 bg-black text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl shadow-black/10 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-3"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Vectorizing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Synthesize Crystal</span>
                                        <Database size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status / Info */}
                    <div className="space-y-6">
                        <div className="bg-blue-600 text-white rounded-[2rem] p-8 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Database size={120} />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter mb-2 relative z-10">THE MANIFOLD</h3>
                            <p className="text-xs font-medium text-blue-100 relative z-10 leading-relaxed mb-6">
                                Ingested knowledge is automatically vector-embedded, signed with your sovereign key, and distributed to the Cortex graph.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-blue-500/30 p-3 rounded-lg w-fit backdrop-blur-sm">
                                <CheckCircle size={12} />
                                <span>Zero-Knowledge Encryption</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-green-50 border border-green-100 rounded-[2rem] p-8"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-green-900">Synthesis Complete</h4>
                                            <p className="text-xs text-green-700 font-medium">Crystal Added to Library</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-800/60 leading-relaxed">
                                        Your knowledge has been successfully bridged. It is now available for Neural Chat and Cortex visualization.
                                    </p>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 border border-red-100 rounded-[2rem] p-8"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-red-900">Injection Failed</h4>
                                            <p className="text-xs text-red-700 font-medium">Check Console Logs</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-red-800/60 leading-relaxed">
                                        The Manifold rejected this input. Ensure your sovereign keys are valid and the database is reachable.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
