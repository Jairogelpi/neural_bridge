"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Database,
    MessageSquare,
    Brain,
    Settings,
    LogOut,
    Shield,
    FilePlus,
    Network,
    Gavel,
    Zap,
    Film,
    ShieldCheck,
    Award,
    Mic
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-white fixed h-[calc(100vh-2rem)] m-4 z-40 hidden md:flex flex-col border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-10 border-b border-slate-50">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-900 leading-none block">Neural</span>
                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-300 leading-none block mt-1">Bridge.</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-1 overflow-y-auto no-scrollbar">
                <div className="mb-4">
                    <span className="px-5 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Navigation</span>
                    <NavItem href="/dashboard" icon={LayoutDashboard} label="Home" active={pathname === '/dashboard'} />
                    <NavItem href="/library" icon={Database} label="My Memory" active={pathname === '/library'} />
                    <NavItem href="/chat" icon={MessageSquare} label="AI Chat" active={pathname === '/chat'} />
                    <NavItem href="/cortex" icon={Brain} label="Idea Map" active={pathname === '/cortex'} />
                </div>

                <div className="mb-4">
                    <span className="px-5 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Knowledge Sync</span>
                    <NavItem href="/nexus" icon={Network} label="Connect AI" active={pathname === '/nexus'} />
                    <NavItem href="/jury" icon={Gavel} label="Trust Center" active={pathname === '/jury'} />
                    <NavItem href="/vaccines" icon={ShieldCheck} label="Privacy Vault" active={pathname === '/vaccines'} />
                </div>

                <div className="pt-6 mt-6 border-t border-slate-50">
                    <span className="px-5 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Tools</span>
                    <NavItem href="/ingest" icon={FilePlus} label="New Capture" active={pathname === '/ingest'} />
                    <NavItem href="/multimodal" icon={Film} label="Media Upload" active={pathname === '/multimodal'} />
                    <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
                </div>
            </nav>

            <div className="p-8 bg-slate-50/50">
                <button onClick={logout} className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all w-full group">
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest leading-none">Disconnect</span>
                </button>
            </div>
        </aside>
    );
}

function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-4 px-6 py-3.5 rounded-2xl transition-all group relative overflow-hidden ${active
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
        >
            <Icon size={18} className={`transition-all duration-300 ${active ? 'text-indigo-600' : 'group-hover:text-indigo-600'}`} />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute right-0 w-1 h-4 bg-indigo-600 rounded-full"
                />
            )}
        </Link>
    );
}
