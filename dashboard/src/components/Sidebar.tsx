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
    Moon
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-gray-200 bg-white fixed h-full z-20 hidden md:flex flex-col overflow-y-auto">
            <div className="p-8 border-b border-gray-100 shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-xs font-black tracking-[0.2em] uppercase text-gray-900 block">Neural Bridge</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Sovereign OS</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-6">
                <div>
                    <h5 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Core</h5>
                    <div className="space-y-1">
                        <NavItem href="/dashboard" icon={LayoutDashboard} label="Command Center" active={pathname === '/dashboard'} />
                        <NavItem href="/library" icon={Database} label="Memory Vault" active={pathname === '/library'} />
                        <NavItem href="/cortex" icon={Brain} label="Cortex Map" active={pathname === '/cortex'} />
                    </div>
                </div>

                <div>
                    <h5 className="px-4 text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Genesis Protocols</h5>
                    <div className="space-y-1">
                        <NavItem href="/ingest" icon={FilePlus} label="Fractal Ingest" active={pathname === '/ingest'} />
                        <NavItem href="/dreams" icon={Moon} label="Dream Lab" active={pathname === '/dreams'} />
                        <NavItem href="/turbo" icon={Zap} label="Turbo Crystallizer" active={pathname === '/turbo'} />
                    </div>
                </div>

                <div>
                    <h5 className="px-4 text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">Sovereignty</h5>
                    <div className="space-y-1">
                        <NavItem href="/expert" icon={Award} label="Reputation" active={pathname === '/expert'} />
                        <NavItem href="/jury" icon={Gavel} label="Truth Jury" active={pathname === '/jury'} />
                        <NavItem href="/vaccines" icon={ShieldCheck} label="Semantic Immunity" active={pathname === '/vaccines'} />
                    </div>
                </div>

                <div>
                    <h5 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">System</h5>
                    <div className="space-y-1">
                        <NavItem href="/nexus" icon={Network} label="Nexus Activity" active={pathname === '/nexus'} />
                        <NavItem href="/multimodal" icon={Film} label="Video Vision" active={pathname === '/multimodal'} />
                        <NavItem href="/settings" icon={Settings} label="Settings" active={pathname === '/settings'} />
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-gray-100 shrink-0">
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
            <span className={`text-[11px] font-bold uppercase tracking-wider ${active ? 'font-black' : 'font-bold'}`}>{label}</span>
        </Link>
    );
}
