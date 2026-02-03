
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Shield, Sparkles, Database, History, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    isGrounded?: boolean;
}

interface Crystal {
    context_id: string;
    domain: string;
    intent: { primary: string };
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [crystals, setCrystals] = useState<Crystal[]>([]);
    const [selectedCrystals, setSelectedCrystals] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCrystals() {
            const { data } = await supabase.from('crystals').select('context_id, domain, intent');
            setCrystals(data || []);
        }
        fetchCrystals();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // 1. CALL REAL GROUNDED CHAT API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'}/v1/neural/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    prompt: input,
                    crystal_ids: selectedCrystals
                })
            });

            const data = await response.json();
            if (data.success) {
                setSessionId(data.session_id);
                const assistantMsg: Message = {
                    role: 'assistant',
                    content: data.response,
                    isGrounded: selectedCrystals.length > 0
                };
                setMessages(prev => [...prev, assistantMsg]);

                // 2. TRIGGER RECURSIVE REFINEMENT (Asynchronous Background Task)
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000'}/v1/neural/refine`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        session_id: data.session_id,
                        interaction_result: data.response
                    })
                }).then(() => console.log("[Neural Chat] 🧬 Knowledge refined and improved."));

            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: `[Error]: ${(error as Error).message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const toggleCrystal = (id: string) => {
        setSelectedCrystals(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden">
            {/* Sidebar: Knowledge Grounding */}
            <aside className="w-80 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl p-6 flex flex-col">
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Database className="text-cyan-400" size={16} />
                        Grounding Manifold
                    </h2>
                    <p className="text-[10px] text-white/40 mt-1 uppercase">Select truths to anchor the AI</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {crystals.map((c) => (
                        <button
                            key={c.context_id}
                            onClick={() => toggleCrystal(c.context_id)}
                            className={twMerge(
                                "w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group",
                                selectedCrystals.includes(c.context_id)
                                    ? "border-cyan-500/50 bg-cyan-500/10"
                                    : "border-white/5 bg-white/5 hover:bg-white/10"
                            )}
                        >
                            <div className="relative z-10">
                                <span className="text-[8px] font-bold text-cyan-400 uppercase">{c.domain}</span>
                                <p className="text-xs text-white/70 line-clamp-2 mt-1">{c.intent.primary}</p>
                            </div>
                            {selectedCrystals.includes(c.context_id) && (
                                <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,242,255,1)]" />
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                    <button className="w-full flex items-center justify-between text-white/40 hover:text-white transition-colors">
                        <span className="text-xs font-bold uppercase">Session History</span>
                        <History size={16} />
                    </button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative">
                {/* Background Glow */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

                {/* Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white uppercase tracking-tighter">Talk to my Knowledge</h1>
                            <p className="text-[10px] text-white/40 uppercase">Grounded in {selectedCrystals.length} Sovereign Crystals</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/60 px-3 py-1 outline-none hover:border-cyan-500/30 transition-all uppercase">
                            <option>Claude 3.5 Sonnet</option>
                            <option>GPT-4o</option>
                            <option>Llama 3 70B</option>
                        </select>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 z-10" ref={scrollRef}>
                    <AnimatePresence>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={twMerge(
                                    "flex gap-4 max-w-3xl",
                                    m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                )}
                            >
                                <div className={twMerge(
                                    "h-10 w-10 min-w-[40px] rounded-xl flex items-center justify-center border",
                                    m.role === 'user' ? "bg-white/5 border-white/10 text-white/40" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                                )}>
                                    {m.role === 'user' ? <ChevronLeft size={20} /> : <Brain size={20} />}
                                </div>
                                <div className={twMerge(
                                    "space-y-2",
                                    m.role === 'user' ? "text-right" : ""
                                )}>
                                    <div className={twMerge(
                                        "p-4 rounded-2xl text-sm leading-relaxed",
                                        m.role === 'user' ? "bg-white/5 text-white/80" : "bg-white/[0.02] text-white/90 border border-white/5"
                                    )}>
                                        {m.content}
                                    </div>
                                    {m.isGrounded && (
                                        <div className="flex items-center gap-1.5 text-[8px] font-bold text-cyan-400 tracking-widest uppercase px-2 justify-end">
                                            <Shield size={10} />
                                            Grounded by Library
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Brain size={20} className="animate-pulse" />
                            </div>
                            <div className="flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-8 z-10">
                    <div className="max-w-3xl mx-auto relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask your manifold..."
                            className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 pl-6 pr-16 text-sm text-white outline-none focus:border-cyan-500/40 focus:bg-white/[0.08] transition-all"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-cyan-500 flex items-center justify-center text-black hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function twMerge(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
