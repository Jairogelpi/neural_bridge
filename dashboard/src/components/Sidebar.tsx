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
    Award
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-200 bg-white fixed h-full z-20 hidden md:flex flex-col">
            <div className="p-8 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900">Neural Bridge</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Home" active={pathname === '/dashboard'} />
                <NavItem href="/library" icon={Database} label="My Memories" active={pathname === '/library'} />
                <NavItem href="/chat" icon={MessageSquare} label="Ask AI" active={pathname === '/chat'} />
                <NavItem href="/ingest" icon={FilePlus} label="Add Knowledge" active={pathname === '/ingest'} />
                <NavItem href="/expert" icon={Award} label="My Reputation" active={pathname === '/expert'} />
                <NavItem href="/cortex" icon={Brain} label="Brain Map" active={pathname === '/cortex'} />
                <NavItem href="/nexus" icon={Network} label="Live Activity" active={pathname === '/nexus'} />
                <NavItem href="/vaccines" icon={ShieldCheck} label="Safety Shield" active={pathname === '/vaccines'} />
                <NavItem href="/multimodal" icon={Film} label="Video Vision" active={pathname === '/multimodal'} />
                <NavItem href="/jury" icon={Gavel} label="Truth Jury" active={pathname === '/jury'} />
                <NavItem href="/turbo" icon={Zap} label="System Status" active={pathname === '/turbo'} />
                <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all w-full">
                    <LogOut size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Disconnect</span>
                </button>
            </div>
        </aside>
    );
}

function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all group ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon size={16} className={`transition-transform group-hover:scale-105 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
        </Link>
    );
}
