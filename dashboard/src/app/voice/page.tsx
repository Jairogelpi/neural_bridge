"use client";

import { useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Mic, MicOff, Volume2, Sparkles, Activity, Loader2, Play, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceBridgePage() {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");

    const handleTogglemic = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTranscript("Synthesizing query from acoustic signals...");
            setTimeout(() => setTranscript("How does the latest vaccine crystal protect against recursive circular logic?"), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 flex flex-col items-center justify-center">
                <header className="absolute top-12 left-12 md:left-[22rem]">
                    <div className="inline-flex items-center px-4 py-1.5 bg-cyan-500/10 rounded-full mb-4 border border-cyan-500/20">
                        <Activity size={12} className="text-cyan-400 mr-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Neural Stream Active</span>
                    </div>
                    <h1 className="font-bebas text-8xl italic leading-none">VOICE_<span className="text-white/20">BRIDGE.</span></h1>
                </header>

                <div className="max-w-2xl w-full flex flex-col items-center gap-16">
                    {/* Pulsing Voice Orb */}
                    <div className="relative">
                        <AnimatePresence>
                            {isListening && (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 0.15 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-cyan-500 rounded-full blur-[80px]"
                                    />
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.2, opacity: 0.1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                                        className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px]"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <motion.button
                            onClick={handleTogglemic}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all ${isListening
                                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_50px_rgba(34,211,238,0.3)]'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                }`}
                        >
                            {isListening ? <MicOff size={48} className="text-cyan-400" /> : <Mic size={48} />}
                        </motion.button>
                    </div>

                    <div className="w-full space-y-8 text-center">
                        <div className="min-h-[60px]">
                            <AnimatePresence mode="wait">
                                {transcript && (
                                    <motion.p
                                        key={transcript}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xl font-bold italic text-white/60"
                                    >
                                        "{transcript}"
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {isListening && (
                            <div className="flex justify-center gap-1">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, Math.random() * 40 + 10, 4] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                        className="w-1 bg-cyan-400 rounded-full"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-8">
                            <div className="bg-white/2 p-6 rounded-3xl border border-white/5">
                                <Volume2 size={24} className="mb-4 text-white/40" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Synthetic Voice</h4>
                                <p className="text-xs font-bold uppercase">Obsidian Alpha</p>
                            </div>
                            <div className="bg-white/2 p-6 rounded-3xl border border-white/5">
                                <Sparkles size={24} className="mb-4 text-white/40" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Lattice Sync</h4>
                                <p className="text-xs font-bold uppercase">Real-Time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
