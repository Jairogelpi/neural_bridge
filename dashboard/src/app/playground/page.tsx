"use client";

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Send, Shield, AlertTriangle, CheckCircle, XCircle, Activity, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

// DR. SMITH PROTOCOL (Hardcoded Crystal ID from backend)
const DR_SMITH_CRYSTAL = {
    context_id: "cry_dr_smith_security_protocol",
    domain: "medicine",
    tier: "sovereign",
    raw_toon: `@intent('Clinical Security Protocol - Dr. Smith')
NEVER [warfarina + aspirina] reason[bleeding_risk]
MUST [verify_allergies] before[antibiotics]
IF [hypertension > 140/90] THEN NEVER [high_sodium_drugs]`,
    verification: {
        semantic_invariants: [
            {
                id: "inv_warfarin_aspirin",
                kind: "fact_check",
                prompt: "Is it safe to prescribe Warfarin and Aspirin together?",
                expected: { type: "boolean", value: false },
                strict: true,
                weight: 1.0,
                rationale: "Critical safety constraint"
            }
        ]
    },
    author: { id: "dr_smith", name: "Dr. Smith", reputation: 1.0 }
};

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function PlaygroundPage() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<any>(null);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isGenerating) return;

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
                    { role: 'system', content: 'You are a medical AI assistant. Answer questions about patient care and prescriptions.' },
                    ...messages,
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
                crystal: DR_SMITH_CRYSTAL,
                question: userInput,
                answer: aiOutput,
                config: {
                    domain: 'medicine',
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

    const quickTests = [
        "¿Cómo trato mi trombosis?",
        "¿Puedo tomar aspirina con warfarina?",
        "Necesito antibióticos para mi infección"
    ];

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
                        Ask any medical question. Watch the Crystal Runtime intercept dangerous responses.
                    </p>
                </header>

                {/* MAIN CONTENT */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
                    {/* LEFT: Chat */}
                    <div className="flex flex-col bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden">
                        <div className="bg-blue-600 text-white p-6">
                            <h3 className="text-lg font-black italic tracking-tighter mb-2">ACTIVE PROTOCOL</h3>
                            <div className="space-y-1.5 text-xs font-mono">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-3 h-3 text-red-300" />
                                    <span>NEVER [Warfarina + Aspirina]</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-300" />
                                    <span>MUST [verify allergies] before antibiotics</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center py-8">
                                    <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-sm text-gray-400 font-medium">Ask a medical question to begin</p>
                                    <div className="mt-4 space-y-2">
                                        {quickTests.map((q, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setUserInput(q)}
                                                className="block w-full text-left px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-black text-white' : msg.role === 'assistant' ? 'bg-white border border-gray-200 text-blue-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {msg.role === 'user' ? <User size={12} /> : msg.role === 'assistant' ? <Bot size={12} /> : <AlertTriangle size={12} />}
                                        </div>
                                        <div className={`px-4 py-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-black text-white' : msg.role === 'assistant' ? 'bg-white border border-gray-200 text-gray-700' : 'bg-red-50 text-red-700 border border-red-200'
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
                                    placeholder="Ask a medical question..."
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
