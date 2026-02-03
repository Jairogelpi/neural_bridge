"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [handle, setHandle] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(name, handle, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-700 font-sans relative overflow-hidden">
            {/* SUBTLE BACKGROUND DECOR */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-50 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-lg relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">Create Identity.</h2>
                        <p className="text-slate-500 font-medium">Initialize your sovereign bridge link.</p>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold uppercase tracking-widest text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pl-4 block">Sovereign_Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/2 transition-all placeholder:text-slate-300"
                                            placeholder="Sentinel One"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pl-4 block">Handle</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            type="text"
                                            value={handle}
                                            onChange={(e) => setHandle(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/2 transition-all placeholder:text-slate-300"
                                            placeholder="@sentinel"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pl-4 block">Identity_Hash</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/2 transition-all placeholder:text-slate-300"
                                        placeholder="agent@neuralbridge.ai"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pl-4 block">Secure_Passkey</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-50 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600/20 focus:ring-4 focus:ring-indigo-600/2 transition-all placeholder:text-slate-300"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-indigo justify-center py-5 shadow-xl shadow-indigo-500/10"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Forge Matrix Identity <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="text-center mt-10 text-sm font-medium text-slate-500">
                        Already active? <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">Identify yourself</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
