"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 selection:bg-indigo-500/30 selection:text-white font-sans overflow-hidden relative">
            {/* QUANTUM MESH BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-indigo-500/20 rotate-12 group hover:rotate-0 transition-transform duration-500">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="font-bebas text-6xl italic tracking-tighter text-white uppercase leading-none">SENTINEL_ACCESS.</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mt-4">Initialize Sovereign Lattice Link</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pl-4 block">Identity_Hash</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                        placeholder="agent@neuralbridge.ai"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 pl-4 block">Passkey_Fragment</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Authenticate_Node <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                        New Sentinel? <Link href="/register" className="text-white hover:text-indigo-400 font-black ml-2 transition-colors">Forge Identity</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
