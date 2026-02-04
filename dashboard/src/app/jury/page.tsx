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
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="inline-flex items-center px-4 py-1.5 bg-red-50 rounded-full mb-4 border border-red-100">
                            <Gavel size={12} className="text-red-600 mr-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">Sovereign Decision Node</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                            JURY <span className="text-red-600">PROTOCOL.</span>
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Adjudicate truth conflicts in the lattice.</p>
                    </div>

                    <button
                        onClick={fetchCases}
                        disabled={isRefreshing}
                        className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>Rescan Lattice</span>
                    </button>
                </header>

                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {cases.map((juryCase) => (
                            <motion.div
                                key={juryCase.case_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all group"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">
                                                TOON Conflict
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                CASE_ID: {juryCase.case_id.substring(0, 8)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                                            {juryCase.issue_description}
                                        </h3>

                                        <div className="bg-red-50/30 rounded-2xl p-4 border border-red-100/50 mb-6 font-mono text-[9px] text-red-900 shadow-inner">
                                            <div className="flex items-center gap-2 mb-2 opacity-50">
                                                <Gavel size={10} />
                                                <span className="uppercase font-black tracking-widest">Conflict.toon</span>
                                            </div>
                                            <pre className="whitespace-pre-wrap italic">
                                                {`NEVER [Axiom A == Axiom B]\n!verify(Is_True?) -> [contradiction]`}
                                            </pre>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">AI Consensus</span>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                                                        style={{ width: `${juryCase.consensus_score_ai * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-black text-gray-900">{(juryCase.consensus_score_ai * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="w-px h-4 bg-gray-200" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {new Date(juryCase.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'ACCEPT')}
                                            disabled={!!votingId}
                                            className="px-6 py-4 bg-green-50 text-green-700 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-green-100 disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>Accept Truth</span>
                                        </button>
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'FAIL')}
                                            disabled={!!votingId}
                                            className="px-6 py-4 bg-red-50 text-red-700 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-red-100 disabled:opacity-50 transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={16} />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Shield size={12} /> ECDSA Handshake Required
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <AlertTriangle size={12} /> Irreversible
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {cases.length === 0 && !isRefreshing && (
                        <div className="text-center py-24 bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-100 text-green-500">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-2">ALL TRUTHS ANCHORED</h3>
                            <p className="text-sm font-medium text-gray-400">The knowledge lattice is stable. No conflicts detected.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
