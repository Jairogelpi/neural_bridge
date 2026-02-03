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
    Gavel
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-100 bg-white fixed h-full z-20 hidden md:flex flex-col">
            <div className="p-8 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900">Neural Bridge</span>
                </div>
            </div>

            <nav className="flex-1 p-6 space-y-2">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === '/dashboard'} />
                <NavItem href="/library" icon={Database} label="Library" active={pathname === '/library'} />
                <NavItem href="/chat" icon={MessageSquare} label="Neural Chat" active={pathname === '/chat'} />
                <NavItem href="/cortex" icon={Brain} label="Cortex Graph" active={pathname === '/cortex'} />
                <NavItem href="/ingest" icon={FilePlus} label="Neurogenesis" active={pathname === '/ingest'} />
                <NavItem href="/nexus" icon={Network} label="Nexus Bridge" active={pathname === '/nexus'} />
                <NavItem href="/jury" icon={Gavel} label="Jury Protocol" active={pathname === '/jury'} />
                <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
            </nav>

            <div className="p-6 border-t border-gray-50">
                <button onClick={logout} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all w-full">
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
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
        >
            <Icon size={18} className={`transition-transform group-hover:scale-110 ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </Link>
    );
}
