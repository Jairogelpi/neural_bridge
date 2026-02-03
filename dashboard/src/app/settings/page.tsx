
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Cpu, Save, Trash2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [keys, setKeys] = useState<{ [key: string]: string }>({
        openrouter: '',
        anthropic: '',
        gemini: '',
    });
    const [saved, setSaved] = useState(false);
    const [model, setModel] = useState('anthropic/claude-3.5-sonnet');

    useEffect(() => {
        // Load keys from storage
        const storedKeys = localStorage.getItem('nb_sovereign_keys');
        if (storedKeys) setKeys(JSON.parse(storedKeys));

        const storedModel = localStorage.getItem('nb_preferred_model');
        if (storedModel) setModel(storedModel);
    }, []);

    const handleSave = () => {
        localStorage.setItem('nb_sovereign_keys', JSON.stringify(keys));
        localStorage.setItem('nb_preferred_model', model);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        console.log("[Settings] 🔐 Sovereign keys and model preferences saved.");
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to delete all sovereign keys?")) {
            localStorage.removeItem('nb_sovereign_keys');
            setKeys({ openrouter: '', anthropic: '', gemini: '' });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] p-8 max-w-4xl mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    <Shield className="text-cyan-400" size={32} />
                    Sovereign Settings
                </h1>
                <p className="text-white/40 text-sm mt-2">Manage your cryptographic keys and model preferences. You are in total control.</p>
            </div>

            <div className="space-y-8">
                {/* API Keys Section */}
                <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="text-cyan-400/60" size={20} />
                        <h2 className="text-lg font-bold text-white">Sovereign API Keys</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase mb-2">OpenRouter Key (Primary Arbitrage)</label>
                            <input
                                type="password"
                                value={keys.openrouter}
                                onChange={(e) => setKeys({ ...keys, openrouter: e.target.value })}
                                placeholder="sk-or-v1-..."
                                className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/40 uppercase mb-2">Anthropic Key (Direct)</label>
                            <input
                                type="password"
                                value={keys.anthropic}
                                onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
                                placeholder="sk-ant-..."
                                className="w-full h-12 rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-cyan-500/50 transition-all font-mono"
                            />
                        </div>
                    </div>
                </section>

                {/* Model Preferences */}
                <section className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <Cpu className="text-cyan-400/60" size={20} />
                        <h2 className="text-lg font-bold text-white">Model Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
                            { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
                            { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', provider: 'Google' },
                            { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', provider: 'Meta' },
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setModel(m.id)}
                                className={twMerge(
                                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                    model === m.id
                                        ? "border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                                        : "border-white/5 bg-white/5 hover:bg-white/10"
                                )}
                            >
                                <div>
                                    <p className="text-sm font-bold text-white">{m.name}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{m.provider}</p>
                                </div>
                                {model === m.id && <CheckCircle2 className="text-cyan-400" size={18} />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm font-bold transition-colors"
                    >
                        <Trash2 size={18} />
                        Purge All Keys
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 text-sm font-bold text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                    >
                        {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {saved ? 'Preferences Secured' : 'Save Sovereign Config'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper for Tailwind Class Merging
function twMerge(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
