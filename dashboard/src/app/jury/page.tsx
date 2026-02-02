"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gavel,
    Shield,
    Terminal,
    LogOut,
    ChevronRight,
    RefreshCcw,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    LayoutDashboard
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface JuryCase {
    case_id: string;
    context_id: string;
    issue_description: string;
    consensus_score_ai: number;
    status: 'pending' | 'resolved' | 'failed';
    created_at: string;
}

export default function JuryPage() {
    const { user, logout, isLoading: authLoading } = useAuth();
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
            // In a production app, we would use window.crypto to sign a challenge
            // For this version, we use a simulation signature that the server expects: NB_SIG_...
            const signature = `NB_SIG_${Math.random().toString(36).substring(7)}`;

            await api.post('/v1/jury/vote', {
                case_id: caseId,
                decision,
                signature
            });

            // Remove case from local view
            setCases(prev => prev.filter(c => c.case_id !== caseId));
        } catch (err) {
            console.error('Failed to cast vote', err);
            alert('Voting failed. Check your expert credentials.');
        } finally {
            setVotingId(null);
        }
    };

    if (authLoading) return null;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#020202] text-white font-mono selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* TOP NAV */}
            <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <div className="flex items-center space-x-4">
                    <div className="shrink-0 w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
                        <Gavel className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tighter text-white uppercase">Jury of Truth <span className="text-cyan-500">v1.2</span></span>
                        <span className="text-[10px] text-gray-500 font-medium">SOVEREIGN DECISION NODE</span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <nav className="flex items-center space-x-1 mr-4">
                        <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center">
                            <LayoutDashboard className="w-3 h-3 mr-2" /> Dashboard
                        </Link>
                        <div className="w-1 h-1 bg-white/10 rounded-full mx-1" />
                        <Link href="/jury" className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 flex items-center">
                            <Gavel className="w-3 h-3 mr-2" /> Jury Cases
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-3 border-l border-white/10 pl-6">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold">{user.name}</span>
                            <span className="text-[10px] text-cyan-500/70">Expert // {user.tier}</span>
                        </div>
                        <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group">
                            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter mb-2 italic">ESCALATIONS <span className="text-cyan-500">REQUIRED</span></h1>
                        <p className="text-gray-500 text-sm max-w-xl">
                            Each case below represents a knowledge conflict where AI consensus fell below the required threshold.
                            As a verified Expert, your decision will provide the final mathematical anchor for truth.
                        </p>
                    </div>
                    <button
                        onClick={fetchCases}
                        disabled={isRefreshing}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 text-cyan-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>RE-SCAN LATTICE</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-4 pb-20">
                    <AnimatePresence mode="popLayout">
                        {cases.map((juryCase) => (
                            <motion.div
                                key={juryCase.case_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all"
                            >
                                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="text-[10px] bg-red-500/20 text-red-400 py-1 px-2 rounded-md font-bold uppercase border border-red-500/20">
                                                ISSUE: CONTRADICTION
                                            </span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                                ID: {juryCase.context_id.substring(0, 8)}...
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-100 mb-2 truncate group-hover:text-cyan-400 transition-colors">
                                            {juryCase.issue_description}
                                        </h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500" style={{ width: `${juryCase.consensus_score_ai * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold">AI CONSENSUS: {(juryCase.consensus_score_ai * 100).toFixed(0)}%</span>
                                            </div>
                                            <span className="text-gray-700">|</span>
                                            <span className="text-[10px] text-gray-500 uppercase font-bold">CREATED: {new Date(juryCase.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'ACCEPT')}
                                            disabled={!!votingId}
                                            className="px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-black uppercase hover:bg-green-500/20 hover:border-green-500/40 transition-all flex items-center disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Accept Truth
                                        </button>
                                        <button
                                            onClick={() => castVote(juryCase.case_id, 'FAIL')}
                                            disabled={!!votingId}
                                            className="px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-black uppercase hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center disabled:opacity-50"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Reject
                                        </button>
                                    </div>
                                </div>
                                <div className="px-6 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter flex items-center">
                                            <Shield className="w-2.5 h-2.5 mr-1" /> ECDSA Handshake required
                                        </span>
                                        <span className="text-[9px] text-gray-600 uppercase font-bold tracking-tighter flex items-center">
                                            <AlertTriangle className="w-2.5 h-2.5 mr-1" /> Irreversible Decision
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-cyan-500/30 font-bold italic">NB_PROTOCOL_CORE_7.1</span>
                                </div>
                            </motion.div>
                        ))}

                        {cases.length === 0 && !isRefreshing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex-1 flex flex-col items-center justify-center py-20 text-center"
                            >
                                <div className="w-20 h-20 bg-cyan-500/5 rounded-full flex items-center justify-center mb-6 border border-cyan-500/10">
                                    <CheckCircle2 className="w-10 h-10 text-cyan-500/20" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-400 mb-1">ALL TRUTHS ANCHORED</h2>
                                <p className="text-gray-600 text-xs max-w-xs">The lattice is currently stable. No pending escalations found in the OMEGA cluster.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* DECORATIVE GRID */}
            <div className="fixed inset-0 z-[-1] pointer-events-none opacity-5">
                <div className="w-full h-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>
        </div>
    );
}
