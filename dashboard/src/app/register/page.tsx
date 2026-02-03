"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
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
            await register(name, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-900 font-sans">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black italic tracking-tighter text-gray-900">INIT PROTOCOL</h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Forge a new sovereign identity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Sovereign Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300"
                                    placeholder="Sentinel One"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Email Identity</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300"
                                    placeholder="agent@neuralbridge.ai"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Secure Passkey</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-wider text-xs hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Initialize <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-xs font-medium text-gray-400">
                        Already active? <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">Identify yourself</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
