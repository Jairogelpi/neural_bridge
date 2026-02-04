"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { Moon, Zap, Activity, Brain, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DreamLabPage() {
    const { user } = useAuth();
    const [isDreaming, setIsDreaming] = useState(false);
    const [dreamResult, setDreamResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const triggerDream = async () => {
        setIsDreaming(true);
        setError(null);
        setDreamResult(null);

        try {
            const token = localStorage.getItem('nb_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/genesis/dream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ loop: false }) // Single cycle
            });

            const data = await res.json();
            if (data.success) {
                setDreamResult({
                    message: data.message,
                    timestamp: new Date().toLocaleTimeString(),
                    synthesis: "Successfully fused dormant crystals into new high-order axioms."
                });
            } else {
                setError(data.error || "Nightmare detected.");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsDreaming(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex text-gray-100 selection:bg-purple-900 selection:text-white">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 relative overflow-hidden">
                {/* Background FX */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <header className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md">
                                <Moon className="text-purple-400" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter text-white">GENESIS <span className="text-purple-500">DREAM LAB</span></h1>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Recursive Synthesis Engine (Active Inference)</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Control Panel */}
                        <div className="space-y-6">
                            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Zap size={20} className="text-yellow-400" />
                                    Initiate REM Cycle
                                </h2>
                                <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                    Trigger an immediate Neural Dream cycle. The system will scan your Crystal Lattice for latent patterns, fuse related concepts using Topological Analysis, and generate "Sovereign Axioms".
                                </p>

                                <button
                                    onClick={triggerDream}
                                    disabled={isDreaming}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all relative overflow-hidden group ${isDreaming ? 'bg-purple-900/50 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/50'
                                        }`}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isDreaming ? (
                                            <>
                                                <Activity className="animate-spin" size={20} />
                                                <span>Dreaming...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Brain size={20} />
                                                <span>Begin Synthesis</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Dream Logic Status */}
                            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Core Protocols</h3>
                                <ul className="space-y-3">
                                    <StatusItem label="Recursive Indexing" status="active" />
                                    <StatusItem label="Hegelian Dialectic" status="active" />
                                    <StatusItem label="Axiom Crystallization" status="standby" />
                                </ul>
                            </div>
                        </div>

                        {/* Visualization / Output */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl min-h-[400px] flex flex-col">
                            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Dream Log Output</h2>

                            <div className="flex-1 font-mono text-sm overflow-y-auto space-y-2">
                                <LogEntry time={new Date().toLocaleTimeString()} text="[System] Dream Lab initialized. Waiting for trigger..." />

                                {isDreaming && (
                                    <>
                                        <LogEntry time={new Date().toLocaleTimeString()} text="[Dreamer] Scanning Knowledge Lattice..." color="text-yellow-400" />
                                        <LogEntry time={new Date().toLocaleTimeString()} text="[Dreamer] Identifying semantic clusters..." color="text-blue-400" />
                                    </>
                                )}

                                {dreamResult && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <LogEntry time={dreamResult.timestamp} text="[Success] REM Cycle Complete." color="text-green-400" />
                                        <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={16} />
                                                <div>
                                                    <p className="text-green-300 font-bold text-xs uppercase tracking-wider mb-1">Synthesis Report</p>
                                                    <p className="text-gray-300">{dreamResult.synthesis}</p>

                                                    {/* TOON LOGIC PREVIEW */}
                                                    <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-[10px]">
                                                        <p className="text-purple-400 mb-2 uppercase tracking-widest font-black">Generated Predicates</p>
                                                        <div className="space-y-1">
                                                            <p className="text-gray-500">(Domain) {"--[MANIFESTS_AS]-->"} ({dreamResult.message.split(' ')[0]})</p>
                                                            <p className="text-gray-500">(Axiom) {"--[STRENGTHENS]-->"} (Lattice)</p>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-400 mt-2 text-xs">{dreamResult.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <LogEntry time={new Date().toLocaleTimeString()} text={`[Error] ${error}`} color="text-red-500" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusItem({ label, status }: { label: string, status: 'active' | 'standby' | 'offline' }) {
    const colors = {
        active: 'bg-green-500 shadow-[0_0_8px_#22c55e]',
        standby: 'bg-yellow-500',
        offline: 'bg-red-500'
    };

    return (
        <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
            <span className="text-sm font-bold text-gray-300">{label}</span>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">{status}</span>
            </div>
        </li>
    );
}

function LogEntry({ time, text, color = "text-gray-400" }: { time: string, text: string, color?: string }) {
    return (
        <div className="flex gap-3">
            <span className="text-gray-600 shrink-0">[{time}]</span>
            <span className={`${color} break-all`}>{text}</span>
        </div>
    );
}
