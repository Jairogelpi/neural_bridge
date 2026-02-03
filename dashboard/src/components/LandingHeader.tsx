"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export function LandingHeader() {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 sm:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] animate-pulse">
                    <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-gradient-to-tr from-indigo-500 to-purple-500 rotate-45" />
                    </div>
                </div>
                <span className="text-xs font-black tracking-[0.3em] uppercase text-white">Neural Bridge <span className="text-purple-500">OMEGA</span></span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
                <NavLink href="#revolution">Revolution</NavLink>
                <NavLink href="#tech">Crystals & Fractals</NavLink>
                <NavLink href="#protocols">Protocols</NavLink>
                <NavLink href="#comparison">RAG vs Omega</NavLink>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-8">
                {!user ? (
                    <>
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors hidden sm:inline-block">Login</Link>
                        <Link href="/register" className="group relative px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden">
                            <span className="relative z-10">Initialize</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </Link>
                    </>
                ) : (
                    <Link href="/dashboard" className="px-6 py-2.5 bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        Enter Console
                    </Link>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:text-glow transition-all">
            {children}
        </Link>
    );
}
