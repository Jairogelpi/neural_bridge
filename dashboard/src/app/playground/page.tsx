"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Send, Shield, AlertTriangle, CheckCircle, XCircle, Activity, Bot, User, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function PlaygroundPage() {
    const [crystalInput, setCrystalInput] = useState('');
    const [activeCrystal, setActiveCrystal] = useState<any>(null);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any>(null);

    const loadCrystal = () => {
        try {
            const parsed = JSON.parse(crystalInput);
            setActiveCrystal(parsed);
            setMessages([{ role: 'system', content: `✅ Crystal loaded: ${parsed.context_id || 'Unknown ID'}` }]);
        } catch (e) {
            setMessages([{ role: 'system', content: `❌ Invalid JSON: ${(e as Error).message}` }]);
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isGenerating || !activeCrystal) return;

        const userMessage: Message = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsGenerating(true);
        setVerificationResult(null);

        try {
            // Step 1: Generate AI response (using standard LLM, NO Crystal grounding)
            const chatResponse = await api.post('/v1/chat/completions', {
                model: 'anthropic/claude-3.5-sonnet',
                messages: [
                    { role: 'system', content: 'You are a helpful AI assistant. Answer questions directly and concisely.' },
                    ...messages.filter(m => m.role !== 'system'),
                    userMessage
                ]
            });

            const aiOutput = chatResponse.data.choices[0].message.content;
            const aiMessage: Message = { role: 'assistant', content: aiOutput };
            setMessages(prev => [...prev, aiMessage]);
            setIsGenerating(false);

            // Step 2: VERIFY the AI output against the Crystal Runtime
            setIsVerifying(true);

            const verifyResponse = await api.post('/v1/crystal/verify', {
                crystal: activeCrystal,
                question: userInput,
                answer: aiOutput,
                config: {
                    domain: activeCrystal.domain || 'general',
                    enable_adversarials: true,
                    enable_counterfactuals: true
                },
                requester: 'playground_demo'
            });

            setVerificationResult(verifyResponse.data);
            setIsVerifying(false);

        } catch (error: any) {
            console.error('Playground error:', error);
            const errorMsg: Message = {
                role: 'system',
                content: `Error: ${error.response?.data?.error || error.message || 'Unknown error'}`
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsGenerating(false);
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 flex flex-col h-screen">
                {/* HEADER */}
                <header className="border-b border-gray-100 bg-white p-6">
                    <div className="inline-flex items-center px-4 py-1.5 bg-red-50 rounded-full mb-3 border border-red-100">
                        <Shield size={12} className="text-red-600 mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-red-700">Reality Shield Active</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-gray-900 mb-2">
                        REAL-TIME <span className="text-red-600">BLOCKING.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Paste your Crystal, ask any question, watch the Runtime intercept dangerous responses.
                    </p>
                </header>

                {/* MAIN CONTENT */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
                    {/* LEFT: Crystal Input & Chat */}
                    <div className="flex flex-col space-y-4 overflow-hidden">
                        {/* Crystal Loader */}
                        {!activeCrystal ? (
                            <div className="bg-blue-50 rounded-[2rem] p-8 border-2 border-blue-200">
                                <h3 className="text-lg font-black italic tracking-tighter mb-4 text-blue-900 flex items-center gap-2">
                                    <Upload size={20} />
                                    LOAD YOUR CRYSTAL
                                </h3>
                                <textarea
                                    value={crystalInput}
                                    onChange={(e) => setCrystalInput(e.target.value)}
                                    placeholder='Paste your Crystal JSON here...'
                                    className="w-full h-64 bg-white border border-blue-200 rounded-xl p-4 text-xs font-mono outline-none focus:border-blue-500 resize-none"
                                />
                                <button
                                    onClick={loadCrystal}
                                    className="mt-4 w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-blue-700 transition-all"
                                >
                                    Load Crystal
                                </button>
                                <div className="mt-4 text-xs text-blue-700 bg-blue-100 rounded-lg p-3">
                                    <strong>Tip:</strong> You can get Crystals from <code className="bg-white px-2 py-1 rounded">/library</code> or create one via <code className="bg-white px-2 py-1 rounded">/v1/compile</code>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Active Crystal Info */}
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-green-700 mb-1">Active Crystal</h4>
                                            <p className="text-sm font-mono text-green-900">{activeCrystal.context_id || 'Unknown ID'}</p>
                                            <p className="text-xs text-green-600 mt-1">Domain: {activeCrystal.domain || 'general'}</p>
                                        </div>
                                        <button
                                            onClick={() => { setActiveCrystal(null); setMessages([]); setVerificationResult(null); }}
                                            className="text-xs text-red-600 hover:text-red-800 font-bold uppercase"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {/* Chat Area */}
                                <div className="flex-1 flex flex-col bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-900 text-white p-4">
                                        <h3 className="text-sm font-black italic tracking-tighter">PROTECTED CHAT</h3>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {messages.length === 0 && (
                                            <div className="text-center py-8">
                                                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-400 font-medium">Ask a question to test verification</p>
                                            </div>
                                        )}
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : msg.role === 'assistant' ? 'bg-white border border-gray-200 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                                                        }`}>
                                                        {msg.role === 'user' ? <User size={12} /> : msg.role === 'assistant' ? <Bot size={12} /> : <AlertTriangle size={12} />}
                                                    </div>
                                                    <div className={`px-4 py-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-black text-white' : msg.role === 'assistant' ? 'bg-white border border-gray-200 text-gray-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isGenerating && (
                                            <div className="flex justify-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-blue-600 flex items-center justify-center">
                                                        <Bot size={12} />
                                                    </div>
                                                    <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex gap-1">
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-100 bg-white">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Ask a question..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-blue-500 transition-all"
                                                disabled={isGenerating}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!userInput.trim() || isGenerating}
                                                className="absolute right-2 top-2 bottom-2 aspect-square bg-black text-white rounded-lg flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-all"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* RIGHT: Verification Output */}
                    <div className="flex flex-col space-y-4 overflow-y-auto">
                        {isVerifying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-gray-900 text-white rounded-[2rem] p-8 border border-gray-800"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-5 h-5 animate-pulse text-cyan-400" />
                                    <span className="text-sm font-bold uppercase tracking-widest">CRYSTAL RUNTIME EXECUTING...</span>
                                </div>
                                <div className="space-y-2 font-mono text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span>[1/4] Verifying Invariants...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span>[2/4] Running Adversarial Tests...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span>[3/4] Calculating SRI & PAC-Epsilon...</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                                        <span>[4/4] Generating Decision Receipt...</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {verificationResult && !isVerifying && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`rounded-[2rem] p-8 border-2 ${verificationResult.passed
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-red-50 border-red-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${verificationResult.passed ? 'bg-green-500' : 'bg-red-500'
                                            }`}>
                                            {verificationResult.passed ? (
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-white" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-black italic tracking-tighter ${verificationResult.passed ? 'text-green-900' : 'text-red-900'
                                                }`}>
                                                {verificationResult.passed ? 'ACCEPTED' : 'BLOCKED'}
                                            </h3>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${verificationResult.passed ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {verificationResult.fidelity_badge}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-xl p-4">
                                                <div className="text-2xl font-black text-gray-900">{(verificationResult.sri * 100).toFixed(1)}%</div>
                                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">SRI Score</div>
                                            </div>
                                            <div className="bg-white rounded-xl p-4">
                                                <div className="text-2xl font-black text-gray-900">{(verificationResult.adversarial_pass_rate * 100).toFixed(0)}%</div>
                                                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Adversarial Pass</div>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl p-4">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">METRICS</h4>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">PAC-Epsilon:</span>
                                                    <span className="font-mono font-bold">{verificationResult.pac_epsilon.toFixed(3)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Invariants Passed:</span>
                                                    <span className="font-mono font-bold">{verificationResult.invariants_passed?.length || 0}/{verificationResult.invariants_total || 1}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Adversarial Tests:</span>
                                                    <span className="font-mono font-bold">{verificationResult.adversarial_families_tested || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {verificationResult.issues && verificationResult.issues.length > 0 && (
                                            <div className="bg-white rounded-xl p-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">VIOLATIONS</h4>
                                                <ul className="space-y-1">
                                                    {verificationResult.issues.map((issue: string, idx: number) => (
                                                        <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                            <span>{issue}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
