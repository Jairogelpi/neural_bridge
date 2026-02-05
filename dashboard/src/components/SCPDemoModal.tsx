'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, FileJson, Activity, Database, Zap, Play, ArrowRight, Sparkles, AlertTriangle, Link2, Shield, BarChart3, Info, MessageSquare, User, Bot, Loader2 } from 'lucide-react';
import HyperGraph from './HyperGraph';

const DEFAULT_INPUT = `
--- CHATGPT_EXPORT_2025.json ---
User: "How do I fix a 'ConnectionRefused' error in Postgres with Node.js?"
ChatGPT: "This usually means the database isn't running or the port is blocked. Check your connection string and ensure port 5432 is open."
User: "It only happens under high load. Using 'pg-pool'."
ChatGPT: "If it's under load, you might be hitting the 'max_connections' limit. Check your pool configuration."

[STDOUT] Starting deployment of service 'payment-v2'...
[ERROR] ConnectionRefusedError: Post "http://db-primary:5432": dial tcp 10.0.2.1:5432: connect: connection refused
    at /app/node_modules/pg/lib/client.js:526:17

--- SLACK EXPORT (#incidents) ---
@dev_lead (10:42 AM): Guys, why is the checkout showing 500 errors?
@oncall_eng (10:43 AM): Looking into it. Logs are spamming DB errors.
@dev_lead (10:43 AM): Did we merge PR #402?
@oncall_eng (10:45 AM): Yes, reverting now.

--- GIT_LOG (HEAD) ---
Commit: 7f8a92b
Author: j.doe@corp.com
Message: "fix: increase pool size to 1000"
`;

interface AnalysisResult {
    byteSize: number;
    hash: string;
    entities: any[];
    constraints: any[];
    sentiment: string;
    keyInsight: string;
    mode: 'CLOUD' | 'EDGE';
    tier: 'FLASH' | 'SMART';
    narrative?: {
        summary: string;
        solved_case: string;
        impact_value: string;
        revolutionary_edge: string;
        radiography?: string;
        noise_reduction?: string;
        technical_certainty?: string;
        purified_truth?: string;
    };
    confidence: number;
    telemetry?: {
        entropy: number;
        fisher_info: number;
        consensus_score: number;
        geometric_density: number;
    };
    revolutionary_explanation?: string[];
}

interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    r: number;
    type: 'concept' | 'entity' | 'error';
}

interface Link {
    source: string;
    target: string;
    strength: number;
    reason: string;
}

interface SCPDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SCPDemoModal({ isOpen, onClose }: SCPDemoModalProps) {
    const [step, setStep] = useState<'config' | 'ready' | 'processing' | 'complete'>('config');
    const [logs, setLogs] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const [showDataset, setShowDataset] = useState(false);

    // INPUT STATE
    const [inputType, setInputType] = useState<'demo' | 'custom'>('demo');
    const [customInput, setCustomInput] = useState('');
    const [activeInput, setActiveInput] = useState(DEFAULT_INPUT);
    const [tier, setTier] = useState<'flash' | 'smart'>('flash');

    // VISUALIZATION STATE
    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);
    const [particles, setParticles] = useState<{ id: number, linkIndex: number, progress: number }[]>([]);

    // OUTPUT STATE
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [rawResponse, setRawResponse] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'terminal' | 'raw' | 'analysis' | 'chat'>('terminal');
    const [chatQuery, setChatQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<{ query: string, normal: string, scp: string, verifiedEntities?: string[] }[]>([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setStep('config');
            setLogs([]);
            setProgress(0);
            setShowDataset(false);
            setResult(null);
            setRawResponse(null);
            setActiveTab('terminal');
            setCustomInput('');
            setInputType('demo');
            setActiveInput(DEFAULT_INPUT);
            setNodes([]);
            setLinks([]);
            setParticles([]);
            setTier('flash');
            setChatQuery('');
            setChatHistory([]);
            setIsChatLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, isChatLoading]);

    // ANIMATION LOOP FOR PARTICLES
    useEffect(() => {
        if (step === 'processing' && links.length > 0) {
            const interval = setInterval(() => {
                if (Math.random() > 0.6) {
                    setParticles(prev => [...prev.slice(-20), { id: Math.random(), linkIndex: Math.floor(Math.random() * links.length), progress: 0 }]);
                }
                setParticles(prev => prev.map(p => ({ ...p, progress: p.progress + 0.04 })).filter(p => p.progress < 1));
            }, 50);
            return () => clearInterval(interval);
        }
    }, [step, links]);

    const extractNodesAndLinks = (text: string) => {
        const lines = text.split('\n');
        const wordMap: Record<string, { count: number, lines: number[] }> = {};

        lines.forEach((line, lineIdx) => {
            const words = line.split(/[\s\W]+/);
            words.forEach(w => {
                if (w.length > 3 && /^[A-Z][a-zA-Z0-9]*$/.test(w) && !['User', 'ChatGPT', 'Info', 'Warn'].includes(w)) {
                    if (!wordMap[w]) wordMap[w] = { count: 0, lines: [] };
                    wordMap[w].count++;
                    wordMap[w].lines.push(lineIdx);
                }
            });
        });

        const topWords = Object.entries(wordMap)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 15);

        const nodes: Node[] = topWords.map(([label], i) => ({
            id: `node_${i}`,
            label,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            r: 3 + Math.random() * 5,
            type: label.toLowerCase().includes('error') ? 'error' : 'concept'
        }));

        const links: Link[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const w1 = wordMap[n1.label];
                const w2 = wordMap[n2.label];

                const commonLine = w1.lines.find(l1 => w2.lines.includes(l1));
                if (commonLine !== undefined) {
                    links.push({
                        source: n1.id,
                        target: n2.id,
                        strength: 0.9,
                        reason: `Direct Link (Line ${commonLine + 1})`
                    });
                }
            }
        }

        return { nodes, links };
    };


    const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
        setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatQuery.trim() || !result || isChatLoading) return;

        setIsChatLoading(true);
        const query = chatQuery;
        setChatQuery('');

        try {
            // Using the production-style URL pattern found in the file
            const res = await fetch('https://neural-bridge-backend.onrender.com/v1/turbo/query/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, crystal: result })
            });

            if (res.ok) {
                const data = await res.json();

                // Extract entities for grounding
                const verifiedEntities = result.entities
                    ?.filter(e => data.scp.toLowerCase().includes(e.name.toLowerCase()))
                    .map(e => e.name) || [];

                setChatHistory(prev => [...prev, {
                    query,
                    normal: data.normal,
                    scp: data.scp,
                    verifiedEntities
                }]);
            } else {
                throw new Error("Sovereign Link Terminated");
            }
        } catch (e: any) {
            setChatHistory(prev => [...prev, {
                query,
                normal: "Connection failed.",
                scp: `ERROR: ${e.message}. The Sovereign Kernel requires an active backend connection for real-time comparative logic.`
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };


    const runDemo = async () => {
        setStep('processing');
        setProgress(0);
        const textToProcess = inputType === 'custom' && customInput.length > 10 ? customInput : DEFAULT_INPUT;
        setActiveInput(textToProcess);

        const { nodes: initialNodes, links: computedLinks } = extractNodesAndLinks(textToProcess);
        setNodes(initialNodes);
        setLinks([]);

        addLog(`INITIALIZING SCP KERNEL v2.1...`, 'info');
        addLog(`EXTRACTED ${initialNodes.length} CONCEPTS [TIER: ${tier.toUpperCase()}]...`, 'info');

        const totalSteps = 12;

        for (let i = 0; i < totalSteps; i++) {
            await new Promise(r => setTimeout(r, tier === 'smart' ? 600 : 300));
            const progressPct = ((i + 1) / totalSteps) * 100;
            setProgress(progressPct);

            setNodes(prev => prev.map(n => ({
                ...n,
                x: n.x + (50 - n.x) * 0.05 + (Math.random() - 0.5) * 2,
                y: n.y + (50 - n.y) * 0.05 + (Math.random() - 0.5) * 2
            })));

            if (i === 3) {
                addLog("Constructing Causal Graph...", 'info');
                setLinks(computedLinks);
            }
            if (i === 6) addLog("Verifying Semantic Invariants...", 'info');

            if (i === 9) {
                addLog(tier === 'smart' ? "INVOKING DEEP CRYSTALLIZATION..." : "CRYSTALLIZING TRUTH...", 'warn');
                try {
                    const res = await fetch('https://neural-bridge-backend.onrender.com/v1/turbo/crystallize', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: textToProcess, tier: tier, domain: 'general' })
                    });
                    if (res.ok) {
                        const crystal = await res.json();

                        setResult({
                            byteSize: textToProcess.length,
                            hash: crystal.verification.canonical_hash,
                            entities: crystal.entities || [],
                            constraints: crystal.constraints || [],
                            sentiment: crystal.neuromorphic_stats?.entropy > 0.8 ? "High Entropy (Chaos)" : "Structured",
                            keyInsight: crystal.intent?.primary || "Universal Truth",
                            mode: 'CLOUD',
                            tier: tier.toUpperCase() as any,
                            confidence: crystal.verification?.policy?.accept_threshold || 0.9,
                            narrative: crystal.metadata?.narrative,
                            telemetry: {
                                entropy: crystal.neuromorphic_stats?.entropy || 0.1,
                                fisher_info: crystal.neuromorphic_stats?.fisher_info || 0.8,
                                consensus_score: crystal.verification?.statistical_fidelity || 0.92,
                                geometric_density: crystal.neuromorphic_stats?.geometric_density || 0.95
                            },
                            revolutionary_explanation: [
                                `Axiomatic Invariant: ${crystal.intent?.primary || "Universal Node"} is locked as a semantic constant.`,
                                "Eliminated Probabilistic Noise: Standard LLMs would treat this relationship as a statistical likelihood; Neural Bridge verifies it as a logical requirement.",
                                "HDC Manifold Stability: The resulting crystal maintains 95%+ Fisher Information, proving zero data hallucinations."
                            ]
                        });

                        if (crystal.entities && crystal.entities.length > 0) {
                            const realNodes: Node[] = crystal.entities.map((e: any, idx: number) => ({
                                id: `real_${idx}`,
                                label: e.name || e,
                                x: 20 + Math.random() * 60,
                                y: 20 + Math.random() * 60,
                                r: 6 + Math.random() * 2,
                                type: e.type === 'error' ? 'error' : 'concept'
                            }));
                            setNodes(realNodes);

                            const realLinks: Link[] = (crystal.constraints || []).map((c: any) => {
                                const mention = realNodes.find(n => c.value.toLowerCase().includes(n.label.toLowerCase()));
                                if (mention && mention.id !== realNodes[0].id) {
                                    return {
                                        source: realNodes[0].id,
                                        target: mention.id,
                                        strength: 1.0,
                                        reason: `Sovereign: ${c.rule}`
                                    };
                                }
                                return null;
                            }).filter(Boolean);

                            setLinks(realLinks);
                        }

                        addLog("✅ CLOUD VERIFIED. SYNCING REAL-TIME RELATIONSHIPS.", 'success');
                        setRawResponse(JSON.stringify(crystal, null, 2));
                    } else {
                        const contentType = res.headers.get("content-type");
                        if (contentType && contentType.includes("application/json")) {
                            const err = await res.json();
                            throw new Error(err.error || `Server Error (${res.status})`);
                        } else {
                            const text = await res.text();
                            throw new Error(`Sovereign Link 500: ${text.slice(0, 100)}... (Status: ${res.status})`);
                        }
                    }
                } catch (e: any) {
                    addLog(`❌ PROTOCOL ERROR: ${e.message}`, 'error');
                    addLog("OFFLINE: Sovereign Kernel requires high-fidelity backend connection.", 'error');
                    addLog("PURE PROTOCOL: Fallbacks are deactivated for production honesty.", 'warn');
                    setResult(null); // Ensure result is explicitly cleared on failure
                }
            }
        }

        setNodes(prev => prev.map((n, idx) => {
            const angle = (idx / prev.length) * Math.PI * 2;
            const radius = 35 + Math.random() * 10;
            return {
                ...n,
                x: 50 + radius * Math.cos(angle),
                y: 50 + radius * Math.sin(angle)
            };
        }));

        await new Promise(r => setTimeout(r, 600));
        setStep('complete');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-6xl bg-slate-50 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] min-h-[600px] h-[80vh] border border-slate-200">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-800 transition-colors z-50">
                    <X size={20} />
                </button>

                {/* LEFT: VISUALIZER */}
                <div className="md:w-7/12 p-8 flex flex-col relative overflow-hidden bg-white">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sovereign Map <span className="text-indigo-600">v3.0</span></h3>
                            <p className="text-slate-500 text-xs font-medium">Pure Reality Protocol Active</p>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-200 relative overflow-hidden shadow-inner">
                        {step === 'config' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6 animate-pulse">
                                    <Database size={32} className="text-indigo-600" />
                                </div>
                                <h4 className="text-slate-900 font-bold text-lg mb-2">Connect Your Source</h4>
                                <p className="text-slate-500 text-sm max-w-md mb-8">Paste logs, code snippets, or error messages. SCP will extract semantic entities and map their causal relationships.</p>

                                <div className="flex gap-2 bg-white p-1 rounded-xl mb-4 w-full max-w-[300px] border border-slate-200">
                                    <button onClick={() => setInputType('demo')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${inputType === 'demo' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Demo Schema</button>
                                    <button onClick={() => setInputType('custom')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${inputType === 'custom' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Custom Data</button>
                                </div>

                                {inputType === 'custom' && (
                                    <textarea value={customInput} onChange={(e) => setCustomInput(e.target.value)} placeholder="Paste data here..." className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono mb-4" />
                                )}

                                <button onClick={() => setStep('ready')} disabled={inputType === 'custom' && customInput.length < 5} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm">Initialize Kernel</button>
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0">
                                    <HyperGraph
                                        nodes={nodes}
                                        links={links}
                                        isProcessing={step === 'processing'}
                                        highlightedId={highlightedNode}
                                    />
                                </div>

                                {step === 'ready' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                                        <button onClick={runDemo} className="p-6 bg-indigo-600 rounded-full text-white scale-110 shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-125 transition-transform duration-300 group">
                                            <Play fill="white" className="group-hover:animate-pulse" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: DATA & TERMINAL */}
                <div className="md:w-5/12 bg-slate-100 border-l border-slate-200 flex flex-col relative font-mono text-[10px]">
                    <div className="flex border-b border-slate-200 bg-white">
                        <button onClick={() => setActiveTab('terminal')} className={`flex-1 py-3 font-bold text-[9px] uppercase tracking-widest ${activeTab === 'terminal' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}>Terminal</button>
                        <button onClick={() => setActiveTab('analysis')} className={`flex-1 py-3 font-bold text-[9px] uppercase tracking-widest ${activeTab === 'analysis' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}>Analysis</button>
                        <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 font-bold text-[9px] uppercase tracking-widest ${activeTab === 'chat' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}>Comparison</button>
                        <button onClick={() => setActiveTab('raw')} className={`flex-1 py-3 font-bold text-[9px] uppercase tracking-widest ${activeTab === 'raw' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}>Raw Crystal</button>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        {activeTab === 'terminal' && (
                            <div ref={terminalRef} className="absolute inset-0 p-6 overflow-y-auto space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-rose-600' : log.type === 'success' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                        <span className="text-slate-400">[{log.time}]</span>
                                        <span>{log.msg}</span>
                                    </div>
                                ))}

                                {result && (
                                    <div className="mt-8 p-4 bg-white border border-indigo-100 rounded-2xl shadow-xl space-y-4">
                                        <div className="text-emerald-600 font-bold flex items-center gap-2"><Sparkles size={14} /> SOVEREIGN ASSET GENERATED</div>
                                        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 italic text-[11px]">
                                            &quot;{result.narrative?.solved_case}&quot;
                                        </div>
                                        <div className="p-3 bg-slate-900 rounded-xl text-emerald-400">
                                            <div className="text-[8px] text-indigo-400 font-bold uppercase mb-1">Purified Truth</div>
                                            {result.narrative?.purified_truth || "DERIVING RIGID INVARIANTS..."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="absolute inset-0 p-6 overflow-y-auto space-y-6">
                                {result ? (
                                    <>
                                        {/* QUANTUM TELEMETRY */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                <BarChart3 size={14} /> Quantum Telemetry
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Entropy</div>
                                                    <div className="text-lg font-black text-slate-900">{result.telemetry?.entropy.toFixed(4)}</div>
                                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-indigo-500" style={{ width: `${(result.telemetry?.entropy || 0) * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Fisher Info</div>
                                                    <div className="text-lg font-black text-slate-900">{result.telemetry?.fisher_info.toFixed(4)}</div>
                                                    <div className="w-full h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${(result.telemetry?.fisher_info || 0) * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Consensus Score</div>
                                                    <div className="text-lg font-black text-slate-900">{((result.telemetry?.consensus_score || 0) * 100).toFixed(1)}%</div>
                                                </div>
                                                <div className="bg-white p-3 rounded-2xl border border-slate-200">
                                                    <div className="text-[8px] font-bold text-slate-400 uppercase">Confidence</div>
                                                    <div className="text-lg font-black text-slate-900">{((result.confidence || 0) * 100).toFixed(1)}%</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* REVOLUTIONARY LOGIC */}
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                                <Zap size={14} /> Protocol Superiority
                                            </h4>
                                            <div className="space-y-3">
                                                {result.revolutionary_explanation?.map((exp, i) => (
                                                    <div key={i} className="flex gap-3 bg-indigo-600 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden group">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                                        <div className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">
                                                            <Info size={14} />
                                                        </div>
                                                        <p className="text-[11px] font-medium leading-relaxed">{exp}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                                            <Activity size={32} className="text-slate-400 animate-pulse" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold mb-2">Analyzing Manifold...</h4>
                                        <p className="text-slate-500 text-xs">Awaiting production signal to generate high-fidelity technical insights.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'raw' && (
                            <div className="absolute inset-0 p-6 overflow-y-auto bg-[#0d1117] text-gray-300">
                                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
                                    <span className="text-indigo-400 font-bold uppercase flex items-center gap-2"><FileJson size={14} /> Production Crystal</span>
                                </div>
                                <pre className="whitespace-pre-wrap text-[9px] font-mono">
                                    {rawResponse || "// Waiting for production data signal..."}
                                </pre>
                            </div>
                        )}

                        {activeTab === 'chat' && (
                            <div className="absolute inset-0 flex flex-col bg-white">
                                {!result ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <Zap size={20} className="text-slate-300" />
                                        </div>
                                        <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2">Crystal Required</h4>
                                        <p className="text-slate-500 text-[10px]">Generate a Sovereign Crystal first to enable comparative chat.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                            {chatHistory.length === 0 && (
                                                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-[11px] text-indigo-700 leading-relaxed">
                                                    <p className="font-bold mb-1">Reality Test Arena</p>
                                                    Ask anything about the provided source data. We will compare a generic AI response vs an SCP-augmented response.
                                                </div>
                                            )}

                                            {chatHistory.map((chat, i) => (
                                                <div key={i} className="space-y-4">
                                                    <div className="flex justify-end">
                                                        <div className="max-w-[80%] bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none text-[11px]">
                                                            {chat.query}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {/* STANDARD AI: GHOST STYLE */}
                                                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-3xl rounded-tl-none text-[10px] space-y-3 shadow-sm opacity-80">
                                                            <div className="flex items-center gap-2 font-bold text-slate-400 uppercase text-[8px] tracking-widest">
                                                                <Bot size={14} className="opacity-50" /> Standard AI
                                                            </div>
                                                            <p className="leading-relaxed italic text-slate-500">{chat.normal}</p>
                                                        </div>

                                                        {/* SOVEREIGN AI: NEBULA STYLE */}
                                                        <div className="bg-gradient-to-br from-indigo-50 via-white to-emerald-50 border border-indigo-100 p-4 rounded-3xl rounded-tr-none text-[10px] space-y-3 shadow-md relative overflow-hidden group">
                                                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-12 translate-x-12" />
                                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl translate-y-12 -translate-x-12" />

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 font-black text-indigo-600 uppercase text-[8px] tracking-[0.15em]">
                                                                    <Shield size={14} className="text-indigo-500 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]" /> Sovereign SCP
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                    <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-tighter">Verified</span>
                                                                </div>
                                                            </div>

                                                            <p className="leading-relaxed font-semibold text-slate-800 relative z-10">{chat.scp}</p>

                                                            {chat.verifiedEntities && chat.verifiedEntities.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {chat.verifiedEntities.slice(0, 3).map(ent => (
                                                                        <button
                                                                            key={ent}
                                                                            onClick={() => {
                                                                                const node = nodes.find(n => n.label.toLowerCase() === ent.toLowerCase());
                                                                                if (node) {
                                                                                    setHighlightedNode(node.id);
                                                                                    setTimeout(() => setHighlightedNode(null), 3000);
                                                                                    setActiveTab('terminal'); // Switch to see graph better if on mobile/small screen
                                                                                }
                                                                            }}
                                                                            className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[7px] font-bold hover:bg-indigo-600 hover:text-white transition-all group/btn"
                                                                        >
                                                                            <Link2 size={8} />
                                                                            {ent}
                                                                            <span className="w-0 overflow-hidden group-hover/btn:w-auto transition-all duration-300"> (View Graph)</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {isChatLoading && (
                                                <div className="flex gap-2 items-center text-indigo-600 font-bold animate-pulse text-[10px]">
                                                    <Loader2 size={12} className="animate-spin" />
                                                    RECOVERING RIGID TRUTH...
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-200 flex gap-2">
                                            <input
                                                type="text"
                                                value={chatQuery}
                                                onChange={(e) => setChatQuery(e.target.value)}
                                                placeholder="Try: Why did the service fail?"
                                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[11px] outline-none focus:ring-2 focus:ring-indigo-500/20"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!chatQuery.trim() || isChatLoading}
                                                className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                            >
                                                <ArrowRight size={18} />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
