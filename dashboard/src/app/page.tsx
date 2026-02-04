"use client";

import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Lock,
  RefreshCw,
  ArrowRight,
  Chrome,
  LogIn,
  UserPlus,
  Activity,
  Layers,
  Binary,
  Globe,
  CheckCircle,
  CheckCircle2,
  Sparkles,
  XCircle,
  Brain,
  Database,
  Cpu,
  Network,
  Fingerprint,
  Scale,
  Moon
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LandingHeader } from '@/components/LandingHeader';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      <LandingHeader />

      {/* HERO SECTION - REVOLUTIONARY */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden">
        {/* Deep Space Background (Light) */}
        <div className="absolute inset-0 bg-white" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />

        {/* Orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

        <div className="relative z-20 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 bg-white border border-indigo-100 rounded-full mb-8 shadow-sm"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-3 shadow-[0_0_10px_#6366f1]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Omega Protocol Active • Zero Hallucinations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-slate-900"
          >
            Access <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500">Sovereign</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 animate-gradient-x">Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The world's first <strong>Sovereign Second Brain</strong>.
            <br className="hidden md:block" />
            Stop renting intelligence. Start building your own.
            <br />
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-4 block">Perfect for Students • Creators • Researchers</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/register"
              className="group w-full sm:w-auto h-16 flex items-center justify-center px-10 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-800 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95 duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Initialize Node <ArrowRight size={16} />
              </span>
            </Link>

            <a
              href="#"
              className="w-full sm:w-auto h-16 flex items-center justify-center space-x-2 px-10 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-slate-50 hover:border-slate-300 transition-all hover:scale-105 active:scale-95 duration-300"
            >
              <Chrome size={18} />
              <span>Add to Browser</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* MARKETING INJECTION 1: UNIVERSAL WEAVER (EXTENSION) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="md:grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-[60px] opacity-20" />
              <div className="relative bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-800 rotate-2 hover:rotate-0 transition-all duration-500">
                {/* Mock Browser Interface */}
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1 bg-white/10 rounded-md h-6 mx-4" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                  <div className="h-32 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle2 className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Crystal Extracted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex px-3 py-1 bg-violet-100 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">The Universal Weaver</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">The Internet is Your Dataset.</h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Don't copy-paste into a chat window. Our <strong>Neural Crystals Extension</strong> weaves any webpage directly into your brain.
                <br /><br />
                From PDF reports to complex dashboards—click "Ingest" and it's crystalized forever. No APIs. No integrations. Just pure capture.
              </p>
              <ul className="space-y-3">
                <ListItem text="Works on Any Website (Local & Public)" />
                <ListItem text="Captures Context, Not Just Text" />
                <ListItem text="Instant Synchronization to Mobile" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION: AUDIENCE TARGETING (MASS APPEAL) */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Universal Utility</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Who is Neural Crystals For?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Whether you are studying for a PhD or writing a novel, your brain needs an upgrade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* STUDENTS */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Student</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                "I possess 50 PDFs of lecture notes. I need to find the specific quote about 'Mitochondria' instantly."
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Instant Citations
              </div>
            </div>

            {/* CREATORS */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Creator</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                "I write sci-fi. I need an AI that remembers the character I killed off in Chapter 3, two years ago."
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-widest">
                <CheckCircle2 size={14} /> plot consistency
              </div>
            </div>

            {/* RESEARCHERS */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm text-sky-500 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">The Professional</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                "I need to query my company's legal docs securely. No data can ever leave my laptop."
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-widest">
                <CheckCircle2 size={14} /> Enterprise Privacy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION 1.5: COPY/PASTE VS SOVEREIGN */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Stop Feeding the Void.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              99% of your AI interactions are lost the moment you close the tab. You are renting intelligence, not building it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 relative">
            {/* LEFT: THE COPY PASTE CHAOS */}
            <div className="p-10 bg-white rounded-[2.5rem] md:rounded-r-none border border-slate-200 z-10 relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <XCircle size={100} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-red-500 mb-8">The Old Way (Copy/Paste)</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="mt-1 min-w-[24px]"><XCircle size={24} className="text-red-300" /></div>
                  <div>
                    <h4 className="font-bold text-slate-700">Ephemeral Context</h4>
                    <p className="text-sm text-slate-400">"Sorry, I forgot what we talked about 5 messages ago."</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="mt-1 min-w-[24px]"><XCircle size={24} className="text-red-300" /></div>
                  <div>
                    <h4 className="font-bold text-slate-700">Privacy Leaks</h4>
                    <p className="text-sm text-slate-400">Your proprietary data is sent to public model training.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <div className="mt-1 min-w-[24px]"><XCircle size={24} className="text-red-300" /></div>
                  <div>
                    <h4 className="font-bold text-slate-700">Repetitive Labor</h4>
                    <p className="text-sm text-slate-400">Pasting the same context file 50 times a day.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: THE SOVEREIGN ORDER */}
            <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] md:rounded-l-none md:-ml-8 z-20 shadow-2xl shadow-indigo-500/20 md:scale-105 border border-slate-800 relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 pointer-events-none rounded-[2.5rem]" />
              <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                <CheckCircle2 size={100} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-widest text-indigo-400 mb-8">Neural Crystals</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 min-w-[24px]"><CheckCircle2 size={24} className="text-indigo-500" /></div>
                  <div>
                    <h4 className="font-bold text-white">Compound Interest</h4>
                    <p className="text-sm text-indigo-200">Every interaction makes the system smarter. Forever.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 min-w-[24px]"><CheckCircle2 size={24} className="text-indigo-500" /></div>
                  <div>
                    <h4 className="font-bold text-white">Local sovereignty</h4>
                    <p className="text-sm text-indigo-200">Data is encrypted locally. Zero leakage to public models.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 min-w-[24px]"><CheckCircle2 size={24} className="text-indigo-500" /></div>
                  <div>
                    <h4 className="font-bold text-white">Instant Recall</h4>
                    <p className="text-sm text-indigo-200">Access verified facts from 2 years ago in 10ms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="tech" className="py-32 px-6 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

        <div className="max-w-7xl mx-auto">
          {/* THE CRYSTAL: STRUCTURAL TRUTH */}
          <div className="md:grid md:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Unit of Logic</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">The Crystal Structure.</h3>
              <p className="text-xl text-slate-500 leading-relaxed mb-8">
                We don't store "text". We store <strong className="text-indigo-600">Verified Objects</strong>.
                <br /><br />
                A Crystal is a JSON-native container that locks the <strong>Vector</strong> (meaning), the <strong>Source Metadata</strong> (origin), and the <strong>Cryptographic Signature</strong> (proof) into a single atomic unit.
                You cannot fake a Crystal. It carries its own truth.
              </p>
              <ul className="space-y-4">
                <ListItem text="Merkle-Proof Verified (Zero-Trust Architecture)" />
                <ListItem text="Immutable hash_id (SHA-256 Signatures)" />
                <ListItem text="Universal Protocol Buffer (Portable Truth)" />
              </ul>
            </div>

            {/* VISUAL: CRYSTAL DATA SCHEMA */}
            <div className="relative h-[500px] w-full bg-slate-900 rounded-[3rem] border border-slate-800 flex items-center justify-center shadow-2xl shadow-indigo-100 overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-10 bg-slate-800/50 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-xs font-mono text-slate-400">crystal_schema_v1.json</span>
              </div>
              <div className="p-8 font-mono text-sm leading-relaxed text-indigo-300 w-full">
                <span className="text-slate-500">{"{"}</span><br />
                &nbsp;&nbsp;<span className="text-purple-400">"id"</span>: <span className="text-green-400">"crys_8f92a..."</span>,<br />
                &nbsp;&nbsp;<span className="text-purple-400">"vector"</span>: [<span className="text-blue-400">0.12, -0.45, ...</span>],<br />
                &nbsp;&nbsp;<span className="text-purple-400">"payload"</span>: <span className="text-slate-300">"Sovereign AI is..."</span>,<br />
                &nbsp;&nbsp;<span className="text-purple-400">"proof"</span>: <span className="text-slate-500">{"{"}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">"hash"</span>: <span className="text-yellow-400">"0x7b..."</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">"signature"</span>: <span className="text-yellow-400">"RSA-4096..."</span>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">"timestamp"</span>: <span className="text-blue-400">1738720</span><br />
                &nbsp;&nbsp;<span className="text-slate-500">{"}"}</span><br />
                <span className="text-slate-500">{"}"}</span>

                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-full bg-indigo-500/10 rounded border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
                    Verifying Signature...
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* THE FRACTAL: GRAPH TOPOLOGY */}
          <div className="md:grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1 relative h-[500px] w-full bg-white rounded-[3rem] border border-pink-100 flex items-center justify-center shadow-2xl shadow-pink-100 overflow-hidden">
              {/* FRACTAL GRAPH VISUAL */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-pink-500 rounded-full shadow-lg shadow-pink-300 z-10 flex items-center justify-center text-white font-black text-xs">CORE</div>

                  {/* Satellite Nodes */}
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <div key={deg} className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-300 rounded-full"
                      style={{ transform: `rotate(${deg}deg) translate(100px) rotate(-${deg}deg)` }}
                    />
                  ))}

                  {/* Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-pink-200" style={{ overflow: 'visible' }}>
                    <line x1="50%" y1="50%" x2="50%" y2="10%" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="90%" y2="30%" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="90%" y2="70%" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="50%" y2="90%" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="10%" y2="70%" strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="10%" y2="30%" strokeWidth="2" />
                  </svg>

                  <div className="absolute top-0 right-0 bg-white/80 p-2 rounded-lg border border-pink-100 shadow-sm text-[10px] font-mono text-pink-500">
                    d_graph = 0.85
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-6">Infinite Context</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Fractal Topology.</h3>
              <p className="text-xl text-slate-500 leading-relaxed mb-8">
                Context windows are finite. Fractals are infinite.
                <br /><br />
                We don't feed the LLM a list of files. We feed it a <strong className="text-pink-600">Graph</strong>.
                When a Crystal is activated, it "pulls" its neighbors via semantic gravity. This allows the AI to traverse your entire knowledge base without loading 1TB of data into RAM.
              </p>
              <ul className="space-y-4">
                <ListItem text="Holographic Compression (Infinite Depth)" />
                <ListItem text="Semantic Geometric Gravity (Auto-Linking)" />
                <ListItem text="O(1) Retrieval vs O(N) Context Window Scanning" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION 2: DREAM PROTOCOL */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">Active Inference</div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
            It Optimizes While You Sleep.
          </h2>
          <p className="text-xl text-indigo-200/80 max-w-3xl mx-auto mb-16 leading-relaxed">
            RAG databases are static graveyards of text. <strong className="text-white">Neural Bridge dreams.</strong>
            <br />
            At night, the <strong>Dream Protocol</strong> wakes up to defragment your logic, merge redundant crystals, and strengthen weak connections.
            It wakes up smarter than it went to bed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
              <Moon className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-white font-bold mb-2">Defragmentation</h4>
              <p className="text-sm text-gray-400">Merges overlapping facts into single "Super-Crystals" to save space and speed.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h4 className="text-white font-bold mb-2">Logic Reinforcement</h4>
              <p className="text-sm text-gray-400">Re-tests old pathways. If a crystal isn't useful, it fades. If it is, it glows.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
              <Brain className="w-8 h-8 text-pink-400 mb-4" />
              <h4 className="text-white font-bold mb-2">Recursive Insight</h4>
              <p className="text-sm text-gray-400">Generates new connections between previously unrelated concepts.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 md:py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 leading-none">
                RAG IS <span className="text-gray-600 line-through decoration-red-600 decoration-4">DEAD.</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CRYSTALS ARE ALIVE.</span>
              </h2>
              <div className="space-y-6 text-xl text-gray-300 font-light leading-relaxed">
                <p>
                  The old world relies on <strong>Vector Soup</strong>—fragmented, hallucinating chunks of text retrieved blindly. It costs you money every time you ask a question. It forgets context. It lies.
                </p>
                <p>
                  <strong>Neural Crystals</strong> changes the physics of knowledge.
                </p>
                <p>
                  We don't just "store" data. We <strong className="text-indigo-400">crystallize</strong> it into self-contained, immutable units of logic. A Crystal is not text—it's a verifiable proof of meaning.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-200">Zero Hallucinations</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-200">Zero Retrieval Cost</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-200">Self-Evolving Logic</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-200">Sovereign Ownership</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles size={120} className="text-white" />
              </div>

              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Competitive Analysis</h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-lg font-bold text-gray-400">Knowledge Type</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold line-through decoration-red-500/50">Loose Text</span>
                    <span className="text-green-400 font-black">Immutable Crystal</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-lg font-bold text-gray-400">Verification</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">Vibe Check</span>
                    <span className="text-green-400 font-black">Mathematical Proof</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-lg font-bold text-gray-400">Cost Model</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">Rent (Per Token)</span>
                    <span className="text-green-400 font-black">Ownership (Free)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-400">Evolution</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">Static</span>
                    <span className="text-green-400 font-black">Darwinian (RLM)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROTOCOL GRID (Light Ver) */}
      <section id="protocols" className="py-32 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">The Omega Protocols</h2>
            <p className="text-slate-500">The engine that makes Neural Crystals mathematically superior.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProtocolCard
              title="PCK"
              subtitle="Proof-Carrying Knowledge"
              desc="Zero-Latency Verification. Embedding proofs directly into the data."
              icon={Shield}
              color="text-indigo-500"
            />
            <ProtocolCard
              title="ZKV"
              subtitle="Zero-Knowledge Verification"
              desc="Enterprise Privacy. Prove correctness without revealing the source document."
              icon={Lock}
              color="text-violet-500"
            />
            <ProtocolCard
              title="SMT"
              subtitle="Semantic Merkle Trees"
              desc="Hash of Meaning. Detect paraphrasing and plagiarism instantly."
              icon={Network}
              color="text-sky-500"
            />
            <ProtocolCard
              title="CLPV"
              subtitle="Cross-LLM Portability"
              desc="Universal Receipts. Verify an answer from GPT-4 using Claude's logic."
              icon={Globe}
              color="text-emerald-500"
            />
            <ProtocolCard
              title="Hypervectors"
              subtitle="Semantic Hashing"
              desc="We treat meaning as a vector, not a string. Comparison is instant. Math, not Magic."
              icon={Binary}
              color="text-cyan-600"
            />
            <ProtocolCard
              title="Vaccines"
              subtitle="Cognitive Immunity"
              desc="Injecting 'truth antibodies' to prevent logic viruses and hallucinations."
              icon={Activity}
              color="text-rose-500"
            />
            <ProtocolCard
              title="Omega"
              subtitle="Sovereign Activation"
              desc="You become the source of truth. Decentralized consensus."
              icon={Fingerprint}
              color="text-amber-500"
            />
            <ProtocolCard
              title="RLM"
              subtitle="Reinforcement Logic"
              desc="Active Inference. Stability = Wisdom. Measured by Fisher Information."
              icon={Brain}
              color="text-pink-600"
            />
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION 3: REPUTATION ECONOMY */}
      <section className="py-24 bg-indigo-50 relative overflow-hidden border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="md:grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex px-3 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">Expert Hub</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Truth Has Value.</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                In the Neural Crystals Network, you aren't just a user. You are a <strong className="text-indigo-600">Sovereign Node</strong>.
                <br /><br />
                When you crystallize verified knowledge, you earn <strong>Reputation</strong>. Your expertise becomes a tradeable asset in the global truth ledger.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-indigo-50 shadow-sm">
                  <div className="text-3xl font-black text-slate-900 mb-1">XP</div>
                  <div className="text-xs uppercase font-bold text-slate-400">Proof of Work</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-indigo-50 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-1">REP</div>
                  <div className="text-xs uppercase font-bold text-indigo-400">Social Capital</div>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Abstract Visual of Connected Nodes */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px]" />
              <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">
                <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Ledger</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-600">Live</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div>
                          <div className="h-2 w-24 bg-slate-200 rounded mb-1" />
                          <div className="h-2 w-16 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="text-emerald-500 text-xs font-black">+50 REP</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION: SOVEREIGN DEFENSE (VACCINES & JURY) */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Sovereign Defense Grid.</h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Other AIs are fragile. They believe everything they read. Neural Crystals fights back.
              <br />
              We engineered an immune system for your knowledge base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* VACCINES */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <Activity size={32} />
                </div>
                <h3 className="text-2xl font-black">Semantic Vaccines</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                When the system detects a recurring hallucination or a logical fallacy, it doesn't just "ignore" it. It creates a <strong>Vaccine</strong>.
                This is a negative-weight vector that actively repels incorrect information from ever touching your answers again.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-emerald-200 font-bold text-sm">
                  <CheckCircle2 size={16} /> Anti-Hallucination Antibodies
                </li>
                <li className="flex items-center gap-3 text-emerald-200 font-bold text-sm">
                  <CheckCircle2 size={16} /> Recursive Virus Protection
                </li>
              </ul>
            </div>

            {/* JURY */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-colors group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                  <Scale size={32} />
                </div>
                <h3 className="text-2xl font-black">The Truth Jury</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Who decides what's true? An opaque update from San Francisco? No.
                <strong>You decide.</strong>
                The Jury Protocol allows a consensus of Sovereign Nodes to vote on the validity of a Crystal. Truth is no longer dictated; it is discovered.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-amber-200 font-bold text-sm">
                  <CheckCircle2 size={16} /> Decentralized Consensus
                </li>
                <li className="flex items-center gap-3 text-amber-200 font-bold text-sm">
                  <CheckCircle2 size={16} /> Proof of Truth (PoT) Mining
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section id="comparison" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-16 text-center">Stop Renting. Start Owning.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            <div className="p-12 bg-slate-50 rounded-[3rem] border border-slate-100">
              <h3 className="text-2xl font-black uppercase text-slate-400 mb-8">The Old Way (RAG)</h3>
              <ul className="space-y-6">
                <BadItem text="You upload private files to big tech clouds" />
                <BadItem text="You pay $20/month + API costs forever" />
                <BadItem text="It hallucinates (and you can't check why)" />
                <BadItem text="It forgets your project after 20 messages" />
              </ul>
            </div>
            <div className="p-12 bg-slate-900 text-white rounded-[3rem] relative overflow-hidden shadow-2xl shadow-indigo-100">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 overflow-hidden blur-[100px] opacity-30 rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500 overflow-hidden blur-[100px] opacity-30 rounded-full pointer-events-none" />
              <h3 className="text-2xl font-black uppercase text-indigo-200 mb-8">Neural Crystals Way</h3>
              <ul className="space-y-6">
                <GoodItem text="Your Data stays on YOUR laptop. Forever." />
                <GoodItem text="Free to run. No subscriptions." />
                <GoodItem text="It proves its answers (Math, not Vibes)." />
                <GoodItem text="It remembers everything. Even from years ago." />
              </ul>
            </div>
          </div>

          {/* NEW: COMPETITIVE SUPERIORITY GRID */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-6">Why the Others Fail.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We didn't just build a better tool. We changed the entire physics of the problem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* VS CHATBOTS */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-red-200 transition-colors group">
              <div className="inline-flex px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Vs Standard Chatbots</div>
              <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-red-600 transition-colors">They Guess. We Know.</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Most chatbots are just predicting the next word. They don't actually "know" anything. Neural Crystals stores facts, not probabilities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <XCircle size={14} className="text-red-400" />
                  <span>Probabilistic Guessing</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  <CheckCircle size={14} className="text-indigo-500" />
                  <span>Deterministic Facts</span>
                </div>
              </div>
            </div>

            {/* VS NOTE APPS */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-orange-200 transition-colors group">
              <div className="inline-flex px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Vs Note Apps</div>
              <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-orange-600 transition-colors">They are Static. We are Alive.</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Your notes in Notion or Obsidian are dead text. They don't talk to each other. Neural Crystals connects them into a living web.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <XCircle size={14} className="text-red-400" />
                  <span>Dead Text Storage</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  <CheckCircle size={14} className="text-indigo-500" />
                  <span>Living Knowledge Graph</span>
                </div>
              </div>
            </div>

            {/* VS LANGCHAIN */}
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">Vs LangChain</div>
              <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">They are Glue. We are the Engine.</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                LangChain is endless "chaining" of API calls. It's slow, expensive python spaghetti. We replace the chain with a single mathematical proof.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                  <XCircle size={14} className="text-red-400" />
                  <span>Python Glue (Slow/Fragile)</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  <CheckCircle size={14} className="text-indigo-500" />
                  <span>Rust Core (Instant/Verified)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER (Light Ver) */}
      <footer className="py-12 px-6 bg-white border-t border-slate-100 text-slate-400 text-center">
        <p className="text-xs font-bold uppercase tracking-widest">© 2026 Neural Crystals • Sovereign Intelligence</p>
      </footer>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-slate-600 font-medium">
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full box-content border-2 border-indigo-100" />
      {text}
    </li>
  );
}

function ProtocolCard({ title, subtitle, desc, icon: Icon, color }: any) {
  return (
    <div className="group p-8 bg-white border border-slate-100 hover:border-indigo-100 rounded-3xl transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50">
      <div className={`w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className={color.replace('text-', 'text-')} />
      </div>
      <h4 className="text-2xl font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{subtitle}</p>
      <p className="text-sm text-slate-500 leading-relaxed font-medium group-hover:text-slate-600 transition-colors">{desc}</p>
    </div>
  );
}

function BadItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-slate-500 font-bold">
      <XCircle size={20} className="text-red-500 shrink-0" />
      {text}
    </li>
  );
}

function GoodItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-emerald-700 font-bold">
      <CheckCircle size={20} className="text-emerald-500 shrink-0" />
      {text}
    </li>
  );
}


