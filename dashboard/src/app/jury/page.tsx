"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import {
    Gavel,
    RefreshCcw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Shield
} from 'lucide-react';
import api from '@/lib/api';

interface JuryCase {
    case_id: string;
    context_id: string;
    issue_description: string;
    consensus_score_ai: number;
    status: 'pending' | 'resolved' | 'failed';
    created_at: string;
}

export default function JuryPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [cases, setCases] = useState<JuryCase[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [votingId, setVotingId] = useState<string | null>(null);

    const fetchCases = useCallback(async () => {
        try {
            setIsRefreshing(true);
            const res = await api.get<{ cases: JuryCase[] }>('/v1/jury/cases');
            setCases(res.data.cases);
        } catch (err) {
            console.error('Failed to fetch jury cases', err);
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    const castVote = async (caseId: string, decision: 'ACCEPT' | 'FAIL') => {
        try {
            setVotingId(caseId);
            const signature = `NB_SIG_${Math.random().toString(36).substring(7)}`;

            await api.post('/v1/jury/vote', {
                case_id: caseId,
                decision,
                signature
            });

            setCases(prev => prev.filter(c => c.case_id !== caseId));
        } catch (err) {
            console.error('Failed to cast vote', err);
            // In a real scenario, we might show a toast notification here
        } finally {
            setVotingId(null);
        }
    };

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="inline-flex items-center px-4 py-1.5 bg-red-500/10 rounded-full mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <Gavel size={12} className="text-red-400 mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Sovereign Decision Node</span>
                        </div>
                        <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] text-white">
                            JURY_<span className="text-red-500/30">PROTOCOL.</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mt-4">Adjudicate truth conflicts in the neural lattice</p>
                    </div>

                    <button
                        onClick={fetchCases}
                        disabled={isRefreshing}
                        className="h-12 flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
                    >
                        <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Rescan_Lattice</span>
                    </button>
                </header>

                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                        {cases.map((juryCase) => (
                            <motion.div
                                key={juryCase.case_id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass-panel rounded-[3rem] p-10 group relative overflow-hidden"
                            >
                                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-500/5 blur-[100px]" />

                                <div className="flex flex-col xl:flex-row xl:items-center gap-12 relative z-10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-500/30">
                                                CONTRADICTION_DETECTED
                                            </span>
                                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                                                NODE_HEX: {juryCase.context_id.substring(0, 12)}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-6 leading-tight italic">
                                            {juryCase.issue_description}
                                        </h3>

                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">AI_CONSENSUS</span>
                                                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${juryCase.consensus_score_ai * 100}%` }}
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                    />
                                                </div>
                                                <span className="text-xs font-black text-white">{(juryCase.consensus_score_ai * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-px h-4 bg-white/10" />
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                {new Date(juryCase.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'ACCEPT')}
                                            disabled={!!votingId}
                                            className="px-8 py-5 bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-400 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>Accept_Truth</span>
                                        </button>
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'FAIL')}
                                            disabled={!!votingId}
                                            className="px-8 py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3"
                                        >
                                            <XCircle size={16} />
                                            <span>Reject_Entry</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                                        <span className="flex items-center gap-2">
                                            <Shield size={12} className="text-indigo-400" /> ECDSA_HANDSHAKE_REQUIRED
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <AlertTriangle size={12} className="text-red-400" /> IRREVERSIBLE_ACTION
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {cases.length === 0 && !isRefreshing && (
                        <div className="flex flex-col items-center justify-center py-40 rounded-[4rem] bg-white/[0.01] border border-white/5 border-dashed">
                            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(16,185,129,0.1)] border border-emerald-500/20">
                                <CheckCircle2 size={40} className="text-emerald-400" />
                            </div>
                            <h3 className="font-bebas text-4xl italic tracking-wider text-white mb-2">ALL_TRUTHS_ANCHORED.</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">The knowledge lattice is stable. No conflicts detected.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
