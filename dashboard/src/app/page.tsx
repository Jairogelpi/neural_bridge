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
  Moon,
  Search,
  Briefcase,
  Pen,
  Lightbulb,
  Code,
  Target,
  Cloud,
  WifiOff,
  Infinity as InfinityIcon
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LandingHeader } from '@/components/LandingHeader';
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/components/ScrollReveal';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <LandingHeader />

      {/* HERO SECTION - REVOLUTIONARY */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-44 pb-20 px-6 overflow-hidden">
        {/* Modern Background Layers */}
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

        {/* Animated Ambient Orbs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-violet-100/30 rounded-full blur-[120px] pointer-events-none"
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-20 text-center max-w-5xl mx-auto">


          <div className="relative inline-block">
            <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none z-0" />
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.85] text-slate-900 relative z-10"
            >
              Access <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500">Universal</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 animate-gradient-x drop-shadow-sm">Intelligence.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto mt-8 mb-12 leading-relaxed"
          >
            The world's first <strong>Sovereign Second Brain</strong>.
            <br className="hidden md:block" />
            Stop renting intelligence. Start building your own.
            <br />
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <span>Students</span>
              <span className="text-indigo-200">/</span>
              <span>Creators</span>
              <span className="text-indigo-200">/</span>
              <span>Researchers</span>
              <span className="text-indigo-200">/</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md animate-pulse">And Every Sovereign Mind.</span>
            </span>
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
                Go to Dashboard <ArrowRight size={16} />
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
      {/* MARKETING INJECTION 1: UNIVERSAL WEAVER (EXTENSION) */}
      {/* MARKETING INJECTION 1: UNIVERSAL WEAVER (EXTENSION) */}
      <section className="pt-4 pb-24 bg-white relative overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#4f46e5 0.5px, transparent 0.5px), linear-gradient(90deg, #4f46e5 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }} />
        <div className="max-w-7xl mx-auto px-6">
          <div className="md:grid md:grid-cols-12 gap-12 lg:gap-20 items-center mb-20">
            <ScrollReveal direction="left" className="order-2 md:order-1 md:col-span-12 lg:col-span-6 relative group lg:mb-0">
              {/* Max Impact Visual - No frames, pure presence */}
              <div className="relative group/img overflow-visible">
                <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <img
                  src="/uploaded_media_1770202607251.png"
                  alt="Crystal Extraction"
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover/img:scale-[1.03] drop-shadow-[0_40px_80px_rgba(0,0,0,0.12)] relative z-10"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2} className="order-1 md:order-2 md:col-span-12 lg:col-span-6 py-8">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">The Internet is <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 drop-shadow-sm">Your Dataset.</span></h2>
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-12 font-medium max-w-xl">
                Stop copy-pasting into generic chatbots. Our <strong>Neural Crystals Extension</strong> weaves any webpage directly into your brain.
              </p>
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Extension: Active</span>
                </div>
                <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Privacy: Sovereignty</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Symmetrical 8-Card Grid - The Technical Standard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-indigo-600">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Universal Weaver</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Capture any site or local file. If you see it, it's yours.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-purple-600">
                  <Brain className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Neural Mapping</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Extract semantic structures for real understanding.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-amber-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Instant Bio-Sync</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Sync devices in milliseconds. Your brain, everywhere.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-emerald-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Local Sovereignty</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Absolute privacy. Your data never leaves your devices.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-sky-600">
                  <Database className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Zero API Required</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Direct visual extraction without third-party dependencies.</p>
            </div>


            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-violet-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Semantic Crystals</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Visual structures woven into reusable logic units.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-cyan-600">
                  <InfinityIcon className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Infinity Ingestor</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Any signal. Any format. Unified into truth.</p>
            </div>

            <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-indigo-600">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Axiomatic Guard</h4>
              </div>
              <p className="text-slate-500 text-[12px] leading-snug font-medium">Zero-trust verification of every new knowledge unit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION 2: STOP FEEDING THE VOID */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-y border-slate-100">
        {/* Technical Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="md:grid md:grid-cols-12 gap-16 items-center">
            <ScrollReveal direction="left" className="md:col-span-12 lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Build Sovereign Intelligence</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.05] text-slate-900">
                Stop Feeding <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500">The Void.</span>
              </h2>

              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 font-medium max-w-2xl">
                <strong>99% of your AI interactions are lost</strong> the moment you close the tab. You are renting intelligence, not building it.
                Our <span className="relative inline-block group cursor-help underline decoration-indigo-300 decoration-dashed decoration-1 underline-offset-4">
                  <strong>SCP (Sovereign Crystallization Protocol)</strong>
                  {/* Floating Explanation Tab */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[380px] p-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-[#0f172a] rounded-xl shadow-2xl border border-indigo-500/30 overflow-hidden backdrop-blur-xl ring-1 ring-white/10">

                      {/* Header */}
                      <div className="px-5 py-3 bg-indigo-900/30 border-b border-indigo-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-cyan-400" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">System Architecture</span>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-300 bg-cyan-900/30 px-2 py-0.5 rounded border border-cyan-500/20">v0.2 SIGMA</span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h4 className="text-white font-bold text-sm mb-1">Crystallization Engine</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            Interdicts LLM output stream at <code className="bg-slate-800 text-amber-300 px-1 rounded border border-slate-700">t=0</code>, extracting semantic invariants before they dissipate.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Storage</div>
                            <div className="text-xs text-indigo-300 font-mono">Vector + Graph + JSON</div>
                          </div>
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Encryption</div>
                            <div className="text-xs text-emerald-300 font-mono">AES-GSM-256 (Local)</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <Network className="w-3 h-3 text-violet-400" />
                            <span>Transforms <span className="text-slate-300">Unstructured Text</span> → <span className="text-indigo-400 font-bold">Immutable Assets</span></span>
                          </div>
                        </div>
                      </div>

                    </div>
                    {/* Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 border-8 border-transparent border-t-[#0f172a] drop-shadow-lg" />
                  </div>
                </span> turns transient prompts into eternal Digital Organisms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-indigo-200 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                      <Lock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Digital Sovereignty</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Everything is stored locally. You own the logic, not the provider.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-violet-200 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                      <Layers className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Structural Memory</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Crystals preserve semantic depth, eliminating the "reset" of generic LLM sessions.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-emerald-200 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Compound Interest</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">Each crystal breeds higher logic, creating a compounding asset of intelligence.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-rose-200 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Zero RAG Tax</h4>
                      <p className="text-[11px] text-slate-500 leading-snug">HDC vectors eliminate hallucinations with O(1) mathematical certainty.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" className="md:col-span-12 lg:col-span-5 relative">
              <div className="relative aspect-square flex items-center justify-center p-8">
                {/* Paper Texture Background Effect */}
                <div className="absolute inset-0 bg-[#f5f5f0] rounded-sm transform rotate-1 shadow-2xl border border-stone-200 z-0">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] mix-blend-multiply" />
                </div>

                <motion.div
                  className="relative z-10 w-full h-full p-4"
                  animate={{ rotate: [-0.5, 0.5, -0.5] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="/scp_sketch_diagram.png"
                    alt="SCP Protocol Manuscript Sketch"
                    className="w-full h-full object-contain drop-shadow-md mix-blend-multiply opacity-90"
                  />
                </motion.div>

                {/* Annotation Note */}
                <div className="absolute -bottom-6 -right-6 bg-[#fffffa] text-slate-700 px-4 py-3 shadow-lg transform -rotate-2 border border-stone-200 z-20 font-serif text-xs italic">
                  "From chaos to order..."
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PHASE TURBO: SPEED SUPREMACY */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Technical Grid Accent */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#0891b2 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 border border-cyan-200 mb-8">
              <Zap className="w-4 h-4 text-cyan-600" />
              <span className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.2em]">Phase Turbo: Active</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
              Faster Than <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500">Cache-Augmented Generation.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              CAG pre-loads context. We <strong>pre-compile crystals</strong> into instant-response format.
              <br />Sub-5ms queries. Zero LLM cost. Full offline capability.
            </p>
          </ScrollReveal>

          {/* Speed Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <ScrollReveal direction="left">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6">Speed Comparison</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 w-32">RAG (Vector DB)</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-slate-300 rounded-full" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-16 text-right">~500ms</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 w-32">CAG (KV Cache)</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[25%] bg-indigo-300 rounded-full" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 w-16 text-right">~150ms</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-cyan-700 w-32">Neural Turbo</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[2%] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-md" />
                    </div>
                    <span className="text-xs font-mono text-cyan-600 font-bold w-16 text-right">&lt;5ms</span>
                  </div>
                </div>
                <p className="mt-6 text-xs text-slate-400 text-center">Latency for cached crystal queries (lower is better)</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Turbo Feature Cards */}
                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">IndexedDB Cache</h4>
                  <p className="text-xs text-slate-500 leading-snug">100MB local storage. Sub-1ms access. Zero server roundtrips.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Cloud className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">Edge Cached</h4>
                  <p className="text-xs text-slate-500 leading-snug">Render CDN optimized. Pre-warmed TurboContexts at edge nodes.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <WifiOff className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">100% Offline</h4>
                  <p className="text-xs text-slate-500 leading-snug">Full functionality without internet. Your brain, anywhere.</p>
                </div>

                <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-violet-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-2">Lazy Verification</h4>
                  <p className="text-xs text-slate-500 leading-snug">Respond first, verify later. Axiomatic checks in background.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* CTA */}
          <ScrollReveal className="text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-white font-black text-sm uppercase tracking-widest">Turbo Mode Enabled By Default</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PHASE OMEGA PRIME: REAL SUPREMACY */}
      <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-violet-50 relative overflow-hidden border-y border-slate-100">
        {/* Technical Grid Accent */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 mb-8">
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">Phase Omega Prime: Supremacy</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
              What RAG Can&apos;t Do. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500">We Do.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Real, measurable advantages. Not marketing claims.
              <br />Contradiction detection. Provenance tracking. Semantic density metrics.
            </p>
          </ScrollReveal>

          {/* Advantages Grid */}
          <ScrollRevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" staggerDelay={0.1}>
            {/* Performance Tracking */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-cyan-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Real-Time Benchmarks</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Every query measured. Latency, tokens saved, cost avoided—all tracked in real-time.</p>
                <div className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">RAG: No metrics</div>
              </div>
            </ScrollRevealItem>

            {/* Contradiction Detection */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Contradiction Detection</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Detects when two sources conflict. Classifies type. Proposes resolution.</p>
                <div className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">RAG: Impossible</div>
              </div>
            </ScrollRevealItem>

            {/* Semantic Density */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-indigo-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">12x Semantic Density</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Crystals compress meaning, not text. 12x more info per token than RAG chunks.</p>
                <div className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">RAG: 512-token chunks</div>
              </div>
            </ScrollRevealItem>

            {/* Provenance Tracking */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Fingerprint className="w-6 h-6 text-violet-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Full Provenance</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Every claim knows its source. Chain of custody from origin to answer.</p>
                <div className="text-[9px] font-bold text-violet-600 uppercase tracking-widest">RAG: Lost in chunks</div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>

          {/* Comparison CTA */}
          <ScrollReveal className="text-center">
            <Link href="/supremacy" className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-amber-600 to-violet-600 rounded-2xl shadow-xl shadow-violet-500/20 hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-black text-sm uppercase tracking-widest">View Live Supremacy Metrics</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* EVERYDAY USE CASES - UNIVERSAL APPEAL */}
      <section className="pt-12 pb-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">Your Knowledge, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 drop-shadow-sm">Amplified.</span></h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              From research papers to family recipes, meeting notes to creative projects—if you need to remember it, Neural Crystals makes it instantly accessible.
            </p>
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {/* Research & Learning */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                    <Search size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Research & Learning</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Find that article about climate policy you read 6 months ago, or instantly cite lecture notes from last semester.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Instant Retrieval
                </div>
              </div>
            </ScrollRevealItem>

            {/* Work & Projects */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-violet-500 group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Work & Projects</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Reference meeting notes from last quarter during client calls, or query project documentation without interrupting your flow.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-violet-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Professional Context
                </div>
              </div>
            </ScrollRevealItem>

            {/* Creative Work */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                    <Pen size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Creative Work</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Track character arcs across 300 pages, maintain world-building consistency, or recall design decisions from previous projects.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-pink-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Creative Continuity
                </div>
              </div>
            </ScrollRevealItem>

            {/* Personal Knowledge */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
                    <Lightbulb size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Personal Knowledge</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Remember that perfect recipe you saved, book recommendations from friends, or vacation planning notes for your next trip.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Life Organization
                </div>
              </div>
            </ScrollRevealItem>

            {/* Technical Documentation */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-500 group-hover:scale-110 transition-transform">
                    <Code size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Technical Docs</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Query your codebase, API documentation, and Stack Overflow saves without breaking concentration or switching contexts.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Developer Flow
                </div>
              </div>
            </ScrollRevealItem>

            {/* Long-term Projects */}
            <ScrollRevealItem>
              <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all group h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-sky-500 group-hover:scale-110 transition-transform">
                    <Target size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Long-term Projects</h3>
                </div>
                <p className="text-slate-600 leading-snug mb-3 text-xs">
                  Maintain context across years for your thesis, business plans, or passion projects—never lose the thread again.
                </p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-sky-600 uppercase tracking-widest">
                  <CheckCircle2 size={11} /> Persistent Memory
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </div>
      </section >

      {/* MARKETING INJECTION 1.5: COPY/PASTE VS SOVEREIGN */}
      < section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden" >
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Stop Feeding the Void.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              99% of your AI interactions are lost the moment you close the tab. You are renting intelligence, not building it.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 relative">
            {/* LEFT: THE COPY PASTE CHAOS */}
            <ScrollReveal direction="left" className="relative z-10">
              <div className="p-10 bg-white rounded-[2.5rem] md:rounded-r-none border border-slate-200 h-full">
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
            </ScrollReveal>

            {/* RIGHT: THE SOVEREIGN ORDER */}
            <ScrollReveal direction="right" delay={0.15} className="relative z-20">
              <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] md:rounded-l-none md:-ml-8 shadow-2xl shadow-indigo-500/20 md:scale-105 border border-slate-800 relative h-full">
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
            </ScrollReveal>
          </div>
        </div>
      </section >
      <section id="tech" className="py-32 px-6 bg-slate-50 relative overflow-hidden border-y border-slate-200">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

        <div className="max-w-7xl mx-auto">
          {/* THE CRYSTAL: STRUCTURAL TRUTH */}
          <div className="md:grid md:grid-cols-2 gap-24 items-center mb-32">
            <ScrollReveal direction="left">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Unit of Logic</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">The Crystal Structure.</h3>
              <p className="text-xl text-slate-500 leading-relaxed mb-8">
                We don't store "text". We store <strong className="text-indigo-600">Sovereign Axioms</strong>.
                <br /><br />
                A Crystal is a **TOON-native** container that locks the <strong>Vector</strong> (meaning), the <strong>Logic Rules</strong> (MUST/NEVER), and the <strong>Cryptographic Proof</strong> into a single atomic unit.
                The Truth-Oriented Object Notation (TOON) ensures that truth is dense, immutable, and verifiable.
              </p>
              <ul className="space-y-4">
                <ListItem text="Merkle-Proof Verified (Zero-Trust Architecture)" />
                <ListItem text="Immutable hash_id (SHA-256 Signatures)" />
                <ListItem text="Universal Protocol Buffer (Portable Truth)" />
              </ul>
            </ScrollReveal>

            {/* VISUAL: CRYSTAL DATA SCHEMA */}
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative h-[500px] w-full bg-slate-900 rounded-[3rem] border border-slate-800 flex items-center justify-center shadow-2xl shadow-indigo-100 overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-10 bg-slate-800/50 flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs font-mono text-slate-400">knowledge_manifold_v1.toon</span>
                </div>
                <div className="p-8 font-mono text-sm leading-relaxed text-indigo-300 w-full">
                  <span className="text-slate-500">@crystal(0x8f92a) {"{"}</span><br />
                  &nbsp;&nbsp;<span className="text-purple-400">@intent</span>("Sovereign AI is Immutable")<br />
                  &nbsp;&nbsp;<span className="text-blue-400">(Node)</span> -[VerifiedBy]-&gt; <span className="text-blue-400">(Consensus)</span><br />
                  &nbsp;&nbsp;<br />
                  &nbsp;&nbsp;<span className="text-emerald-400">MUST</span> [Logic == Deterministic]<br />
                  &nbsp;&nbsp;<span className="text-red-400">NEVER</span> [Output == Hallucination]<br />
                  &nbsp;&nbsp;<br />
                  &nbsp;&nbsp;<span className="text-slate-500">!proof(sha256:7b...)</span><br />
                  <span className="text-slate-500">{"}"}</span>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-10 w-full bg-indigo-500/10 rounded border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase tracking-widest animate-pulse">
                      Verifying Signature...
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* THE FRACTAL: GRAPH TOPOLOGY */}
          <div className="md:grid md:grid-cols-2 gap-24 items-center">
            <ScrollReveal direction="left" className="order-2 md:order-1">
              <div className="relative h-[500px] w-full bg-white rounded-[3rem] border border-pink-100 flex items-center justify-center shadow-2xl shadow-pink-100 overflow-hidden">
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
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15} className="order-1 md:order-2">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION 2: DREAM PROTOCOL */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
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
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" staggerDelay={0.1}>
            <ScrollRevealItem>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
                  <h4 className="text-white font-bold text-sm">Defragmentation</h4>
                </div>
                <p className="text-xs text-gray-400 leading-snug">Merges overlapping facts into single "Super-Crystals" to save space and speed.</p>
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-yellow-400 shrink-0" />
                  <h4 className="text-white font-bold text-sm">Logic Reinforcement</h4>
                </div>
                <p className="text-xs text-gray-400 leading-snug">Re-tests old pathways. If a crystal isn't useful, it fades. If it is, it glows.</p>
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-6 h-6 text-pink-400 shrink-0" />
                  <h4 className="text-white font-bold text-sm">Recursive Insight</h4>
                </div>
                <p className="text-xs text-gray-400 leading-snug">Generates new connections between previously unrelated concepts.</p>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>
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
                  <span className="text-lg font-bold text-gray-400">Data Format</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold line-through decoration-red-500/50">Bloated JSON</span>
                    <span className="text-green-400 font-black">TOON v0.1</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-lg font-bold text-gray-400">Truth Density</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">50% Noise</span>
                    <span className="text-green-400 font-black">100% Axiomatic</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-lg font-bold text-gray-400">Token Efficiency</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">Standard</span>
                    <span className="text-green-400 font-black">-30% Cost</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-gray-400">Sovereignty</span>
                  <div className="flex gap-8">
                    <span className="text-red-500 font-bold">Shared/Cloud</span>
                    <span className="text-green-400 font-black">Private/Sovereign</span>
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
          <ScrollReveal className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-6">The Omega Protocols</h2>
            <p className="text-slate-500">The engine that makes Neural Crystals mathematically superior.</p>
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
            <ScrollRevealItem>
              <ProtocolCard
                title="PCK"
                subtitle="Proof-Carrying Knowledge"
                desc="Zero-Latency Verification. Embedding proofs directly into the data."
                icon={Shield}
                color="text-indigo-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="ZKV"
                subtitle="Zero-Knowledge Verification"
                desc="Enterprise Privacy. Prove correctness without revealing the source document."
                icon={Lock}
                color="text-violet-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="SMT"
                subtitle="Semantic Merkle Trees"
                desc="Hash of Meaning. Detect paraphrasing and plagiarism instantly."
                icon={Network}
                color="text-sky-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="CLPV"
                subtitle="Cross-LLM Portability"
                desc="Universal Receipts. Verify an answer from GPT-4 using Claude's logic."
                icon={Globe}
                color="text-emerald-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="Hypervectors"
                subtitle="Semantic Hashing"
                desc="We treat meaning as a vector, not a string. Comparison is instant. Math, not Magic."
                icon={Binary}
                color="text-cyan-600"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="Vaccines"
                subtitle="Cognitive Immunity"
                desc="Injecting 'truth antibodies' to prevent logic viruses and hallucinations."
                icon={Activity}
                color="text-rose-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="Omega"
                subtitle="Sovereign Activation"
                desc="You become the source of truth. Decentralized consensus."
                icon={Fingerprint}
                color="text-amber-500"
              />
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ProtocolCard
                title="RLM"
                subtitle="Reinforcement Logic"
                desc="Active Inference. Stability = Wisdom. Measured by Fisher Information."
                icon={Brain}
                color="text-pink-600"
              />
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </div>
      </section>

      {/* MARKETING INJECTION 3: REPUTATION ECONOMY */}
      <section className="py-24 bg-indigo-50 relative overflow-hidden border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="md:grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="inline-flex px-3 py-1 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">Expert Hub</div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Truth Has Value.</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                In the Neural Crystals Network, you aren't just a user. You are a <strong className="text-indigo-600">Sovereign Node</strong>.
                <br /><br />
                When you crystallize verified knowledge, you earn <strong>Reputation</strong>. Your expertise becomes a tradeable asset in the global truth ledger.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                  <div className="text-3xl font-black text-slate-900 mb-1">XP</div>
                  <div className="text-xs uppercase font-bold text-slate-400">Proof of Work</div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-1">REP</div>
                  <div className="text-xs uppercase font-bold text-indigo-400">Social Capital</div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.15}>
              <div className="relative">
                {/* Abstract Visual of Connected Nodes */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 rounded-full blur-[80px]" />
                <div className="relative bg-white p-5 rounded-2xl shadow-xl border border-slate-200/60">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* MARKETING INJECTION: SOVEREIGN DEFENSE (VACCINES & JURY) */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Sovereign Defense Grid.</h2>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Other AIs are fragile. They believe everything they read. Neural Crystals fights back.
              <br />
              We engineered an immune system for your knowledge base.
            </p>
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-12" staggerDelay={0.15}>
            {/* VACCINES */}
            <ScrollRevealItem>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-colors group h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                    <Activity size={28} />
                  </div>
                  <h3 className="text-xl font-black">Semantic Vaccines</h3>
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
            </ScrollRevealItem>

            {/* JURY */}
            <ScrollRevealItem>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-colors group h-full">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-2.5 bg-amber-500/20 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                    <Scale size={28} />
                  </div>
                  <h3 className="text-xl font-black">The Truth Jury</h3>
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
            </ScrollRevealItem>
          </ScrollRevealStagger>
        </div>
      </section>
      <section id="comparison" className="py-32 px-6 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-16 text-center">Stop Renting. Start Owning.</h2>
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32" staggerDelay={0.15}>
            <ScrollRevealItem>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 h-full">
                <h3 className="text-xl font-black uppercase text-slate-400 mb-6">The Old Way (RAG)</h3>
                <ul className="space-y-4">
                  <BadItem text="You upload private files to big tech clouds" />
                  <BadItem text="You pay $20/month + API costs forever" />
                  <BadItem text="It hallucinates (and you can't check why)" />
                  <BadItem text="It forgets your project after 20 messages" />
                </ul>
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="p-6 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden shadow-2xl shadow-indigo-100 h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 overflow-hidden blur-[80px] opacity-30 rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500 overflow-hidden blur-[80px] opacity-30 rounded-full pointer-events-none" />
                <h3 className="text-xl font-black uppercase text-indigo-200 mb-6">Neural Crystals Way</h3>
                <ul className="space-y-4">
                  <GoodItem text="Your Data stays on YOUR laptop. Forever." />
                  <GoodItem text="Free to run. No subscriptions." />
                  <GoodItem text="It proves its answers (Math, not Vibes)." />
                  <GoodItem text="It remembers everything. Even from years ago." />
                </ul>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>

          {/* NEW: COMPETITIVE SUPERIORITY GRID */}
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-6">Why the Others Fail.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We didn't just build a better tool. We changed the entire physics of the problem.</p>
          </ScrollReveal>

          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.1}>
            {/* VS CHATBOTS */}
            <ScrollRevealItem>
              <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-red-200 transition-colors group h-full">
                <div className="inline-flex px-3 py-1 bg-red-100 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">Vs Standard Chatbots</div>
                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-red-600 transition-colors">They Guess. We Know.</h3>
                <p className="text-xs text-slate-500 leading-snug mb-4">
                  Most chatbots are just predicting the next word. They don't actually "know" anything. Neural Crystals stores facts, not probabilities.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <XCircle size={12} className="text-red-400" />
                    <span>Probabilistic Guessing</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                    <CheckCircle size={12} className="text-indigo-500" />
                    <span>Deterministic Facts</span>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>

            {/* VS NOTE APPS */}
            <ScrollRevealItem>
              <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-orange-200 transition-colors group h-full">
                <div className="inline-flex px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">Vs Note Apps</div>
                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">They are Static. We are Alive.</h3>
                <p className="text-xs text-slate-500 leading-snug mb-4">
                  Your notes in Notion or Obsidian are dead text. They don't talk to each other. Neural Crystals connects them into a living web.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <XCircle size={12} className="text-red-400" />
                    <span>Dead Text Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                    <CheckCircle size={12} className="text-indigo-500" />
                    <span>Living Knowledge Graph</span>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>

            {/* VS LANGCHAIN */}
            <ScrollRevealItem>
              <div className="p-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:border-blue-200 transition-colors group h-full">
                <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">Vs LangChain</div>
                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">They are Glue. We are the Engine.</h3>
                <p className="text-xs text-slate-500 leading-snug mb-4">
                  LangChain is endless "chaining" of API calls. It's slow, expensive python spaghetti. We replace the chain with a single mathematical proof.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <XCircle size={12} className="text-red-400" />
                    <span>Python Glue (Slow/Fragile)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800">
                    <CheckCircle size={12} className="text-indigo-500" />
                    <span>Rust Core (Instant/Verified)</span>
                  </div>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>

        </div>
      </section>

      {/* FOOTER (Light Ver) */}
      <footer className="py-12 px-6 bg-white border-t border-slate-100 text-slate-400 text-center">
        <p className="text-xs font-bold uppercase tracking-widest">© 2026 Neural Crystals • Sovereign Intelligence</p>
      </footer>
    </div >
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
    <div className="group p-4 bg-white border border-slate-200/60 shadow-sm hover:border-indigo-100 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform shrink-0`}>
          <Icon size={20} className={color.replace('text-', 'text-')} />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900 leading-none mb-0.5">{title}</h4>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{subtitle}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-snug font-medium group-hover:text-slate-600 transition-colors">{desc}</p>
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


