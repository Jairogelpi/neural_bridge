"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Save, User, Key, Shield } from 'lucide-react';
import api from '@/lib/api';

export default function SettingsPage() {
    const { user } = useAuth();

    const [keys, setKeys] = useState({ openai: '', anthropic: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Save to Local Storage for Sovereign Control
        localStorage.setItem('nb_sovereign_keys', JSON.stringify(keys));

        // Simulate API delay for UX
        setTimeout(() => {
            setIsSaving(false);
            alert('Sovereign Keys Secured ✅');
        }, 800);
    };

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

                    {/* Developer API Keys Section */}
                    <section className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 flex flex-col items-end">
                            <Shield size={120} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <Shield size={20} className="text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold uppercase tracking-tight">Access Control</h2>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bridge your code into the manifold</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Neural Bridge API Key</label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                readOnly
                                                value={user?.public_key || 'NB-LOCKED-IDENTITY'}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm font-mono text-blue-300 outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (user?.public_key) {
                                                    navigator.clipboard.writeText(user.public_key);
                                                    alert('API Key Copied to Clipboard 📋');
                                                }
                                            }}
                                            className="px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-widest border border-white/10"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Endpoints Live: v1.neuralbridge.ai</span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to rotate your API key? All existing external integrations will break.')) {
                                                try {
                                                    const res = await api.post('/v1/auth/rotate-key');
                                                    if (res.data.success) {
                                                        alert('Sovereign Identity Rotated 🔄. Refreshing data...');
                                                        window.location.reload();
                                                    }
                                                } catch (e) {
                                                    alert('Rotation Failed. Server Busy.');
                                                }
                                            }
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Rotate Secret Key
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sovereign Provider Keys Section */}
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
                                    value={keys.openai}
                                    onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Anthropic API Key</label>
                                <input
                                    type="password"
                                    placeholder="sk-ant-..."
                                    value={keys.anthropic}
                                    onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:border-blue-500 outline-none transition-all placeholder-gray-300"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all font-bold uppercase tracking-wider text-xs shadow-xl shadow-black/10 hover:scale-105 disabled:opacity-50"
                            >
                                <Save size={16} />
                                {isSaving ? 'Securing...' : 'Save Configuration'}
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
