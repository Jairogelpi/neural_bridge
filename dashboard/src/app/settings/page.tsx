"use client";

import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Save, User, Key, Shield } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 p-8 md:p-12 overflow-y-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 mb-2">
                        SYSTEM <span className="text-gray-400">SETTINGS.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Manage your sovereign identity and keys.</p>
                </header>

                <div className="max-w-2xl space-y-8">
                    {/* Profile Section */}
                    <section className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <h2 className="text-lg font-bold uppercase tracking-tight">Identity Matrix</h2>
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Email Identity</label>
                                <input
                                    type="text"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sovereign Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    {/* API Keys Section */}
                    <section className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Key size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold uppercase tracking-tight">Sovereign Keys</h2>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Encrypted at rest. Never shared.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">OpenAI API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Anthropic API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-ant-..."
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold uppercase tracking-wider text-xs shadow-xl shadow-black/10 hover:scale-105">
                                <Save size={16} />
                                Save Configuration
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
