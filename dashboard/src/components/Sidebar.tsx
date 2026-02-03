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
        <aside className="w-72 glass-panel fixed h-[calc(100vh-2rem)] m-4 z-40 hidden md:flex flex-col border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="p-10 border-b border-white/5">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white leading-none block">Neural</span>
                        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30 leading-none block mt-1">Bridge.</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto no-scrollbar">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === '/dashboard'} />
                <NavItem href="/library" icon={Database} label="Library" active={pathname === '/library'} />
                <NavItem href="/chat" icon={MessageSquare} label="Neural_Chat" active={pathname === '/chat'} />
                <NavItem href="/cortex" icon={Brain} label="Cortex_Graph" active={pathname === '/cortex'} />
                <NavItem href="/voice" icon={Mic} label="Voice_Bridge" active={pathname === '/voice'} />
                <NavItem href="/loom" icon={Brain} label="The_Loom" active={pathname === '/loom'} />
                <NavItem href="/nexus" icon={Network} label="Nexus_Bridge" active={pathname === '/nexus'} />
                <NavItem href="/jury" icon={Gavel} label="Jury_Protocol" active={pathname === '/jury'} />
                <NavItem href="/vaccines" icon={ShieldCheck} label="Vaccine_Vault" active={pathname === '/vaccines'} />
                <NavItem href="/expert" icon={Award} label="Expert_Identity" active={pathname === '/expert'} />

                <div className="pt-6 mt-6 border-t border-white/5 opacity-40">
                    <span className="px-4 text-[8px] font-black uppercase tracking-[0.3em] text-white/50 mb-4 block">Experimental</span>
                    <NavItem href="/ingest" icon={FilePlus} label="Neurogenesis" active={pathname === '/ingest'} />
                    <NavItem href="/turbo" icon={Zap} label="Turbo_Stats" active={pathname === '/turbo'} />
                    <NavItem href="/multimodal" icon={Film} label="Multimodal" active={pathname === '/multimodal'} />
                    <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
                </div>
            </nav>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <button onClick={logout} className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all w-full group">
                    <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect</span>
                </button>
            </div>
        </aside>
    );
}

function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${active ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
        >
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-white rounded-full"
                />
            )}
            <Icon size={18} className={`transition-all duration-500 ${active ? 'text-white scale-110' : 'group-hover:scale-110 group-hover:text-indigo-400'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </Link>
    );
}
