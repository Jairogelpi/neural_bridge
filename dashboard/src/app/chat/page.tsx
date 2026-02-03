"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, StopCircle, Menu } from 'lucide-react';
import api from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import { Sidebar } from '@/components/Sidebar';
import { ChatList } from '@/components/Chat/ChatList';
import { CrystalContext } from '@/components/Chat/CrystalContext';
import { CrystalPicker } from '@/components/Chat/CrystalPicker';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    thinking?: boolean;
    crystals?: any[];
}

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: number;
    crystals: any[];
    messages: Message[];
}

export default function ChatPage() {
    // Session State
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeCrystals, setActiveCrystals] = useState<any[]>([]);

    // UI State
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const savedSessions = localStorage.getItem('nb_chat_sessions');
        if (savedSessions) {
            const parsed = JSON.parse(savedSessions);
            setSessions(parsed);
            if (parsed.length > 0) {
                // Load most recent
                loadSession(parsed[0]);
            } else {
                createNewSession();
            }
        } else {
            createNewSession();
        }
    }, []);

    // Save on change
    useEffect(() => {
        if (sessions.length > 0) {
            localStorage.setItem('nb_chat_sessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // Update active session when messages/crystals change
    useEffect(() => {
        if (!activeSessionId) return;

        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                return {
                    ...s,
                    messages: messages,
                    crystals: activeCrystals,
                    lastMessage: messages.length > 0 ? messages[messages.length - 1].content : s.lastMessage,
                    timestamp: Date.now()
                };
            }
            return s;
        }));
    }, [messages, activeCrystals, activeSessionId]);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const createNewSession = () => {
        const newSession: ChatSession = {
            id: Date.now().toString(),
            title: 'New Dialogue',
            lastMessage: '',
            timestamp: Date.now(),
            crystals: [],
            messages: [{
                id: '1',
                role: 'assistant',
                content: "I am the Neural Surface. Accessing your Sovereign Knowledge Manifold. How may I assist?",
                timestamp: Date.now()
            }]
        };
        setSessions(prev => [newSession, ...prev]);
        loadSession(newSession);
    };

    const loadSession = (session: ChatSession) => {
        setActiveSessionId(session.id);
        setMessages(session.messages);
        setActiveCrystals(session.crystals);
    };

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);
        if (activeSessionId === id) {
            if (newSessions.length > 0) loadSession(newSessions[0]);
            else createNewSession();
        }
        localStorage.setItem('nb_chat_sessions', JSON.stringify(newSessions));
    };

    const handleSend = async () => {
        if (!input.trim() || isThinking) return;

        // User Message
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Rename session if first user message
        if (messages.length <= 1) {
            setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: input.substring(0, 30) } : s));
        }

        try {
            // Construct Context from Crystals
            let systemContext = "";
            if (activeCrystals.length > 0) {
                systemContext = "You have access to the following Sovereign Knowledge (Crystals):\n" +
                    activeCrystals.map(c => `- [${c.domain}]: ${JSON.stringify(c.intent)}`).join('\n') +
                    "\n\nUse this knowledge to answer the user's query with high fidelity.";
            }

            const apiMessages = [
                ...(systemContext ? [{ role: 'system', content: systemContext }] : []),
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: input }
            ];

            const response = await api.post<any>('/v1/chat/completions', {
                model: "neural-bridge-oracle",
                messages: apiMessages
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.choices[0].message.content,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Connection to Oracle Lost. Retrying...",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 md:ml-64 flex h-screen relative">
                {/* CHAT SESSION SIDEBAR */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 256, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="h-full border-r border-gray-100 bg-gray-50/50 hidden lg:block overflow-hidden"
                        >
                            <ChatList
                                sessions={sessions}
                                activeId={activeSessionId}
                                onSelect={(id) => loadSession(sessions.find(s => s.id === id)!)}
                                onCreate={createNewSession}
                                onDelete={deleteSession}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* MAIN CHAT AREA */}
                <div className="flex-1 flex flex-col min-w-0 bg-white relative">
                    {/* HEADER */}
                    <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 lg:block hidden"
                            >
                                <Menu size={20} />
                            </button>
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black italic tracking-tighter text-gray-900">NEURAL CHAT</h1>
                                <div className="flex items-center space-x-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Oracle Online</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* CRYSTAL CONTEXT */}
                    <CrystalContext
                        crystals={activeCrystals}
                        onRemove={(id) => setActiveCrystals(prev => prev.filter(c => c.context_id !== id))}
                        onAdd={() => setIsPickerOpen(true)}
                    />

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50/30" ref={scrollRef}>
                        <AnimatePresence initial={false}>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-3xl ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                            ? 'bg-black text-white'
                                            : 'bg-white border border-gray-100 text-blue-600 shadow-sm'
                                            }`}>
                                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>

                                        <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-black text-white rounded-tr-none'
                                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                                            }`}>
                                            <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}>
                                                <ReactMarkdown>
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-blue-600 shadow-sm flex items-center justify-center">
                                            <Bot size={14} />
                                        </div>
                                        <div className="px-6 py-4 bg-white border border-gray-100 rounded-[2rem] rounded-tl-none flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* INPUT AREA */}
                    <div className="p-6 bg-white border-t border-gray-100 relative z-20">
                        <div className="max-w-4xl mx-auto relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Interrogate your knowledge manifold..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-6 pr-14 py-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                                disabled={isThinking}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isThinking}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-black text-white rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isThinking ? <StopCircle size={18} className="animate-pulse" /> : <Send size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MODALS */}
                <CrystalPicker
                    isOpen={isPickerOpen}
                    onClose={() => setIsPickerOpen(false)}
                    onSelect={(crystal) => {
                        setActiveCrystals(prev => [...prev, crystal]);
                        setIsPickerOpen(false);
                    }}
                    alreadySelected={activeCrystals.map(c => c.context_id)}
                />

            </main>
        </div>
    );
}
