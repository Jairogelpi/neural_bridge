"use client";

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white text-[#020202] font-sans selection:bg-cyan-100 selection:text-cyan-900">
            {/* NAV */}
            <nav className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-black transition-colors">Back to Lattice</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">Neural Bridge // Privacy</span>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h1 className="text-5xl font-black tracking-tighter mb-4 italic">PRIVACY <span className="text-blue-600">PROTOCOL</span></h1>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">Effective Date: February 2, 2026 // Version 4.0 (Omega)</p>
                </motion.div>

                <div className="space-y-12 text-gray-500 text-sm leading-relaxed">
                    <Section
                        icon={Eye}
                        title="1. DATA COLLECTION ARCHITECTURE"
                        content="Neural Bridge is built on the principle of Zero-Knowledge Verification (ZKV). We do not collect, store, or transmit your private chat history or personal identifying information. The Semantic Continuity Protocol (SCP) operates by creating temporary local hypervectors to verify context integrity."
                    />

                    <Section
                        icon={Lock}
                        title="2. SECURITY & STORAGE"
                        content="All knowledge 'Crystals' are stored locally using the Chrome Storage API. Authentication tokens are encrypted and handled exclusively by our secure Render backend. We utilize ECDSA signatures for all jury-related interactions to ensure irrefutable authorship without compromising anonymity."
                    />

                    <Section
                        icon={Shield}
                        title="3. PERMISSIONS RATIONALE"
                        content="The 'scripting' and 'activeTab' permissions are used solely to inject the verification layer into compatible AI platforms (ChatGPT, Claude, Gemini). No data leaves your browser without your explicit action (e.g., submitting a Crystal to the global cortex)."
                    />

                    <Section
                        icon={FileText}
                        title="4. THIRD-PARTY DISCLOSURE"
                        content="We do not sell, trade, or otherwise transfer your information to outside parties. Your data is yours. The bridge is a sovereign tool for decentralized knowledge verification."
                    />
                </div>

                <div className="mt-24 p-12 bg-gray-50 border border-gray-100 rounded-3xl text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4">Verification Status</p>
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Policy Audited & Verified</span>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-gray-100 text-center mt-20">
                <p className="text-[10px] text-gray-300 font-mono uppercase tracking-widest">
                    Neural Bridge Protocol // v4.0.0
                </p>
            </footer>
        </div>
    );
}

function Section({ icon: Icon, title, content }: any) {
    return (
        <section className="group">
            <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-inherit transition-colors" />
                </div>
                <h2 className="text-black font-black tracking-widest text-xs uppercase">{title}</h2>
            </div>
            <p className="pl-12 border-l border-gray-50 group-hover:border-blue-600 transition-colors">
                {content}
            </p>
        </section>
    );
}
