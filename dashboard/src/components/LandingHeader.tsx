"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export function LandingHeader() {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-2xl border-b border-indigo-50/50 px-6 sm:px-8 py-4 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center space-x-4 group cursor-pointer">
                {/* NEW CRYSTAL LOGO */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <img
                        src="/logo.png"
                        alt="Neural Bridge Logo"
                        className="w-10 h-10 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-black tracking-tight uppercase text-slate-900 leading-none">NEURAL</span>
                    <span className="text-sm font-black tracking-[0.1em] uppercase text-indigo-600 leading-none">BRIDGE</span>
                </div>
            </div>

            <div className="hidden md:flex items-center space-x-10">
                <NavLink href="#revolution">Manifesto</NavLink>
                <NavLink href="#tech">The Crystal</NavLink>
                <NavLink href="#protocols">Protocols</NavLink>
                <NavLink href="#comparison">Superiority</NavLink>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-8">
                {!user ? (
                    <>
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors hidden sm:inline-block">Login</Link>
                        <Link href="/register" className="group relative px-6 py-2.5 bg-slate-900 overflow-hidden text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:shadow-xl hover:shadow-indigo-500/20 transition-all active:scale-95">
                            <span className="relative z-10 flex items-center gap-2">
                                Initialize <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                    </>
                ) : (
                    <Link href="/dashboard" className="px-6 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all">
                        Enter Console
                    </Link>
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all">
            {children}
        </Link>
    );
}
