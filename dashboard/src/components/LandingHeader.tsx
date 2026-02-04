"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LandingHeader() {
    const { user } = useAuth();

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-8 lg:px-12 py-5"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500 rounded-full" />
                        <img
                            src="/logo.png"
                            alt="Neural Crystals"
                            className="w-14 h-14 object-contain relative z-10 transition-all duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Neural</span>
                        <span className="text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 leading-none">Crystals</span>
                    </div>
                </Link>

                {/* NAV LINKS - Larger, smoother typography */}
                <div className="hidden lg:flex items-center gap-12">
                    <NavLink href="#revolution">Manifesto</NavLink>
                    <NavLink href="#tech">Technology</NavLink>
                    <NavLink href="#protocols">Protocols</NavLink>
                    <NavLink href="#comparison">Compare</NavLink>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-6">
                    {!user ? (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors duration-300"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="group relative flex items-center gap-2 px-7 py-3 bg-slate-900 text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 active:scale-95"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/40 active:scale-95"
                        >
                            <Sparkles size={16} className="animate-pulse" />
                            Enter Dashboard
                            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="relative text-sm font-semibold text-slate-500 hover:text-slate-900 transition-all duration-300 group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-cyan-500 group-hover:w-full transition-all duration-300" />
        </Link>
    );
}
