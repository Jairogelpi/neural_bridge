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
  Infinity as InfinityIcon,
  Users,
  Github,
  Slack,
  FileText,
  MessageSquare,
  Share2,
  Download,
  TrendingUp,
  Code2,
  Plus,
  Terminal,
  Key
} from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/design';
import { LandingHeader } from '@/components/LandingHeader';
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/components/ScrollReveal';

const SCPDemoModal = lazy(() => import('@/components/SCPDemoModal'));


const NOISE_BASE64_PAGE = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjAwIDIwMCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48ZmlsdGVyIGlkPSdub2lzZUZpbHRlcic+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuNjUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2VGaWxsZXIpJyBvcGFjaXR5PScwLjA1Jy8+PC9zdmc+";

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Noise overlay removed for performance */}
      {isDemoOpen && (
        <Suspense fallback={null}>
          <SCPDemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        </Suspense>
      )}
      <LandingHeader />

      {/* UNIFIED HERO & INTRO COMPLEX (Sections 1-3) */}
      <div className="relative bg-white overflow-hidden">
        {/* Consistent Modern Background Layers */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />

        {/* Shared Unified Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(#6366f1 0.5px, transparent 0.5px), linear-gradient(90deg, #6366f1 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

        {/* Static gradient backgrounds (performance optimized) */}
        <div className="absolute top-0 -left-[10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[20%] -right-[15%] w-[70%] h-[70%] bg-violet-100/30 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute top-[40%] -left-[5%] w-[40%] h-[40%] bg-sky-100/20 rounded-full blur-3xl pointer-events-none z-0" />

        {/* Section 1: HERO */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-44 pb-32 px-6">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent" />

          <div className="relative z-20 text-center max-w-5xl mx-auto">


            <div className="relative inline-block">
              <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none z-0" />
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-[0.85] text-slate-900 relative z-10">
                Access <span className="text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-500">Universal</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500">Intelligence.</span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto mt-8 mb-12 leading-relaxed">
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
            </p>


            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
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
            </div>
          </div>
        </section>

        {/* INTERSTITIAL VALUE BADGE */}
        <div className="relative z-20 flex justify-center -mt-12 mb-12">
          <div className="group flex items-center gap-6 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-full border border-slate-200/60 shadow-lg hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-infinity"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" /></svg>
              </span>
              Infinite Context
            </div>

            <div className="w-px h-4 bg-slate-200" />

            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-50 border border-violet-100 text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              </span>
              Absolute Sovereignty
            </div>

            <div className="w-px h-4 bg-slate-200" />

            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-50 border border-sky-100 text-sky-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </span>
              Neural Synthesis
            </div>
          </div>
        </div>

        {/* Section 2: UNIVERSAL INTELLIGENCE ECOSYSTEM */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6"
              >
                <Network className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-[0.2em]">Universal Ecosystem</span>
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                The Internet is <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 drop-shadow-sm">Your Dataset.</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                Every URL, PDF, and repository is now a local knowledge asset. <br />
                <span className="text-indigo-600/80">Neural Bridge handles the intake, you focus on the insight.</span>
              </p>
            </div>

            <div className="relative group">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-sky-500/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              {/* THREE-STAGE ECOSYSTEM MAP */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">

                {/* STAGE 1: THE INTAKE (Sources) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Download className="w-12 h-12" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      Universal Intake
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Github className="w-4 h-4 text-indigo-600" /></div>
                        <span className="text-[11px] font-bold text-slate-700">Repositories</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/5">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center"><Slack className="w-4 h-4 text-sky-600" /></div>
                        <span className="text-[11px] font-bold text-slate-700">Slack Data</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><FileText className="w-4 h-4 text-emerald-600" /></div>
                        <span className="text-[11px] font-bold text-slate-700">Mass PDFs</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-rose-500/5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><Globe className="w-4 h-4 text-rose-600" /></div>
                        <span className="text-[11px] font-bold text-slate-700">Web Research</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-400 text-center px-4">
                    GB-Scale datasets refined in real-time. No memory limits. No OOM.
                  </p>
                </div>

                {/* STAGE 2: THE REFINERY (Neural Bridge) */}
                <div className="lg:col-span-4 flex justify-center relative py-12 lg:py-0">
                  {/* Connection Lines (Simulated with div/css) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-[120%] h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  </div>

                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white shadow-[0_32px_64px_-12px_rgba(79,70,229,0.3)] border border-indigo-100 flex items-center justify-center z-20 group/engine"
                  >
                    <div className="absolute inset-2 rounded-full border border-dashed border-indigo-200 animate-spin-slow opacity-50" />
                    <div className="absolute inset-4 rounded-full border border-indigo-50 animate-pulse" />
                    <div className="relative flex flex-col items-center gap-2">
                      <Brain className="w-12 h-12 text-indigo-600 drop-shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-transform group-hover/engine:scale-110" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-900">Refinery</span>
                    </div>
                  </motion.div>
                </div>

                {/* STAGE 3: THE BRIDGE (Outcomes) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative overflow-hidden">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-violet-500" />
                      Universal Synergy
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-indigo-50/50 to-white border border-indigo-100/30">
                        <span className="text-[11px] font-bold text-slate-700">Connect to GPT-4o</span>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,1)]" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-violet-50/50 to-white border border-violet-100/30">
                        <span className="text-[11px] font-bold text-slate-700">Feed Claude 3.5</span>
                        <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,1)]" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-50/50 to-white border border-sky-100/30">
                        <span className="text-[11px] font-bold text-slate-700">Empower Gemini Pro</span>
                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,1)]" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-slate-50/50 to-white border border-slate-100/30">
                        <span className="text-[11px] font-bold text-slate-700">Local Llama 3</span>
                        <div className="w-2 h-2 rounded-full bg-slate-900 shadow-[0_0_8px_rgba(15,23,42,1)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPARISON BAR: STATUS QUO VS SOVEREIGNTY */}
              <div className="mt-16 group/comparison relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-emerald-500/5 blur-[60px] rounded-full opacity-50" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_32px_64px_-12px_rgba(79,70,229,0.15)] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-12px_rgba(79,70,229,0.2)] hover:-translate-y-1">

                  {/* OLD PARADIGM */}
                  <div className="p-8 md:p-12 space-y-4 border-b md:border-b-0 md:border-r border-slate-100">
                    <h3 className="text-xl font-bold text-slate-400 flex items-center gap-3">
                      <XCircle className="w-6 h-6 text-rose-500" />
                      Old Paradigm
                    </h3>
                    <p className="text-slate-500 text-lg leading-relaxed">
                      Copiar y pegar fragmentos muertos en chats aislados. <br />
                      <span className="text-rose-500/90 font-medium">Información olvidada, renta de inteligencia.</span>
                    </p>
                  </div>

                  {/* NEURAL BRIDGE */}
                  <div className="p-8 md:p-12 space-y-4 bg-gradient-to-br from-indigo-50/50 via-white to-emerald-50/30 h-full flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-emerald-600 flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                      Neural Bridge Sovereignty
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Tu conocimiento es un activo vivo y universal que <br />
                      <span className="text-emerald-600 font-bold">alimenta a todas tus IAs para siempre.</span>
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2.5: FEATURE GRID - THE TECHNICAL STANDARD */}
        <section className="relative py-24 bg-white border-t border-indigo-50/50">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-30">
              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Universal Weaver</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Capture any site. Bridge any AI (OpenAI, Claude, Llama).</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Navegación Natural</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Guarda conocimiento de cualquier hilo de Twitter, Paper científico o Blog sin interrupciones.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center text-[10px] font-bold text-violet-600 border border-violet-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Activación Silenciosa</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Nuestra IA "entiende" la web que estás viendo y, con un solo click, captura la verdad.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-[10px] font-bold text-sky-600 border border-sky-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Cristalización</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">La información se destila en un <span className="text-indigo-600 font-bold">Linked Context</span>: un saber que se conecta automáticamente con todo lo que ya conoces.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Uso Universal</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Tu cerebro digital no olvida. Úsalo como fuente de verdad en cualquier IA, independientemente del proveedor original.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Abre la extensión en cualquier web y pulsa el botón <strong>"Extract Core"</strong>. Verás cómo los conceptos se iluminan en tiempo real.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-purple-600">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Neural Mapping</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Extract semantic structures for real understanding.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-600 border border-purple-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Entendimiento Profundo</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Nuestra IA no lee texto, extrae "conceptos". Entiende la jerarquía y la intención de lo que guardas.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Unión de Puntos</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">El sistema busca automáticamente conexiones: *"Esto que acabas de leer se relaciona con este paper de hace 3 meses"*.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-pink-50 flex items-center justify-center text-[10px] font-bold text-pink-600 border border-pink-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Filtrado de Verdad</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Si hay contradicciones entre fuentes, el sistema las detecta y te avisa. Construye sobre certezas, no sobre ruido.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-600 border border-amber-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Meta-Cristalización</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Crea una unidad de saber que vive en tu Dashboard, lista para ser usada en cualquier conversación futura.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Entra en la pestaña <strong>"Neural Atlas"</strong> del Dashboard. Pincha en cualquier nodo para ver sus conexiones semánticas ocultas.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-amber-600">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Instant Bio-Sync</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Sync devices in milliseconds. Your brain, everywhere.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-[10px] font-bold text-amber-600 border border-amber-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Mente Ubícua</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Lo que guardas en tu laptop aparece en tu móvil y tablet al instante. Sin botones de "guardar".</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-[10px] font-bold text-orange-600 border border-orange-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Cero Latencia</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Usamos WebSockets de alta velocidad. Los "Crystals" viajan a la velocidad del pensamiento.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-yellow-50 flex items-center justify-center text-[10px] font-bold text-yellow-600 border border-yellow-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Bio-Identidad</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Tu identidad digital es única. El sistema reconoce tu "firma neuronal" para sincronizar tus datos de forma segura.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center text-[10px] font-bold text-red-600 border border-red-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Cerebro Colaborativo</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Varios dispositivos (o usuarios) pueden editar el mismo Cristal en tiempo real, como un Google Docs cerebral.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Es automático. Inicia sesión en tu móvil y verás tus <strong>Crystals</strong> aparecer en tiempo real mientras los creas en el PC.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-emerald-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Local Sovereignty</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Absolute privacy. Your data never leaves your devices.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Privacidad Absoluta</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Tus documentos nunca viajan a nuestros servidores. El procesamiento es 100% local por defecto.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[10px] font-bold text-teal-600 border border-teal-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Criptografía PCK</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Usamos Proof-Carrying Knowledge para incrustar la verdad en el archivo sin necesidad de internet.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center text-[10px] font-bold text-cyan-600 border border-cyan-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Zero-Knowledge Proofs</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Puedes demostrar que sabes algo sin revelar el contenido. Inteligencia total, exposición cero.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[10px] font-bold text-green-600 border border-green-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Propiedad Total</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Tus Crystals son tuyos. Exporta tu saber y úsalo con cualquier tecnología sin depender de nuestra infraestructura.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Ve a <strong>Settings &gt; Storage</strong> y activa el modo "Local Only". Todos tus datos se guardarán exclusivamente en tu base de datos local.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-sky-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Zero API Required</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Direct visual extraction without third-party dependencies.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-[10px] font-bold text-sky-600 border border-sky-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Independencia Total</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">No dependemos de APIs externas para procesar tu conocimiento. El sistema está diseñado para ser autosuficiente.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Coste Cero Inmortal</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Una vez guardado, leer y verificar tu conocimiento nunca te costará ni un céntimo en tokens.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Verificación Local</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Nuestra arquitectura permite validar la lógica de cualquier respuesta usando el hardware de tu dispositivo.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center text-[10px] font-bold text-violet-600 border border-violet-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Sostenibilidad Ética</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Al no enviar datos fuera, reducimos la huella de carbono y eliminamos el riesgo de espionaje comercial.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Una vez creado un Cristal, usa el chat del Dashboard. Verás el icono de <strong>"Local-Verify"</strong> activo, indicando que no se usa API externa.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>


              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-violet-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Semantic Crystals</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Visual structures woven into reusable logic units.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center text-[10px] font-bold text-violet-600 border border-violet-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Estructura Viva</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Un "Crystal" no es una carpeta, es un mapa semántico vivo que mantiene el contexto intacto para siempre.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Interoperabilidad SCP</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Basado en el protocolo de cristalización soberana, tus datos son legibles por cualquier IA que respete el estándar.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-600 border border-purple-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Geometría de Datos</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Visualiza tu conocimiento como redes neuronales complejas. Encuentra patrones que antes eran invisibles.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-fuchsia-50 flex items-center justify-center text-[10px] font-bold text-fuchsia-600 border border-fuchsia-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Cero Alucinaciones</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Al usar el Crystal como fuente única, la IA no puede inventar. Funciona en cualquier LLM vía nuestro protocolo CLPV.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Descarga tus Cristales en formato <strong>.crystal</strong>. Son archivos universales: impórtalos en cualquier app que cumpla el estándar de soberanía.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-cyan-600">
                    <InfinityIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Infinite Scale Refinery</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Process GBs or TBs via Axiomatic Wave technology.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center text-[10px] font-bold text-cyan-600 border border-cyan-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Ondas Axiomáticas</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">No cargamos archivos, los "refinamos" en riadas de datos que se procesan sin saturar tu memoria RAM.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-[10px] font-bold text-sky-600 border border-sky-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Refinería en Streaming</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">La información se refina a medida que entra. No esperamos a que termine para empezar a entender.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Unificación de Señal</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Audio, texto, código e imágenes. Todo se convierte en el lenguaje universal de los Cristales.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Cerebro de GBs</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Construye una base de conocimiento de tamaño infinito que responde con la velocidad de una neurona.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Arrastra carpetas enteras a la zona de <strong>"Mass Ingest"</strong>. Verás cómo el sistema procesa miles de archivos sin bloquear la interfaz.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>

              <div className="group/card p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover/card:scale-110 group-hover/card:rotate-3 text-indigo-600">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">Axiomatic Guard</h4>
                </div>
                <p className="text-slate-500 text-[12px] leading-snug font-medium">Zero-trust verification of every new knowledge unit.</p>

                {/* INTERACTIVE FLOW MODAL ON HOVER */}
                <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-80 p-5 bg-white rounded-3xl border border-slate-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible transition-all duration-300 z-[100] origin-bottom scale-95 group-hover/card:scale-100">
                  <div className="relative z-10 space-y-5 text-left">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100">1</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Verificación Zero-Trust</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">No confiamos en la IA por su nombre. Cada átomo de conocimiento es verificado matemáticamente.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center text-[10px] font-bold text-violet-600 border border-violet-100">2</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Detección de Sesgos</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">El sistema identifica automáticamente cuando una fuente intenta manipular la verdad o contiene errores lógicos.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-[10px] font-bold text-purple-600 border border-purple-100">3</div>
                        <div className="w-px h-full bg-slate-100 mt-2" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Axiomas Inmutables</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">La base de tu conocimiento son verdades indiscutibles (axiomas). Nada entra en el sistema sin ser una verdad pura.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-100">4</div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1">Escudo de Integridad</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">Protege tu cerebro digital contra la desinformación. Tu sistema solo aprende lo que es demostrable.</p>
                      </div>
                    </div>

                    {/* USAGE GUIDE SECTION */}
                    <div className="pt-4 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cómo Usarlo</span>
                      </div>
                      <p className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-tight">
                        Busca el sello de <strong>"Axiomatic Truth"</strong> junto a cada respuesta. Haz clic en él para ver la traza lógica de por qué esa respuesta es correcta.
                      </p>
                    </div>
                  </div>
                  {/* Small arrow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 3: STOP FEEDING THE VOID */}
        <section className="relative py-32 border-t border-indigo-50/50">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="md:grid md:grid-cols-12 gap-16 items-center">
              <ScrollReveal direction="left" className="md:col-span-12 lg:col-span-6">
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.05] text-slate-900">
                  Stop Feeding <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500">The Void.</span>
                </h2>

                <div className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 font-medium max-w-2xl">
                  <strong>99% of your AI interactions are lost</strong> the moment you close the tab. You are renting intelligence, not building it.
                  Our <span className="relative inline-block group cursor-help underline decoration-indigo-300 decoration-dashed decoration-1 underline-offset-4">
                    <strong>SCP (Sovereign Crystallization Protocol)</strong>
                    {/* Floating Explanation Tab */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[340px] p-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-50">
                      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_32px_64px_-12px_rgba(79,70,229,0.2)] border border-white overflow-hidden ring-1 ring-slate-200/50">

                        {/* Premium Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/50 to-white border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                              <Brain className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Axiomatic Core</span>
                          </div>
                          <Badge variant="primary" className="text-[9px] border-indigo-100 text-indigo-600 bg-white font-black">ACTIVE</Badge>
                        </div>

                        {/* Simplified Content */}
                        <div className="p-6 space-y-5">
                          <div className="relative">
                            <h4 className="text-slate-900 font-extrabold text-sm mb-1.5 flex items-center gap-2">
                              Truth Extraction
                              <Sparkles className="w-3 h-3 text-amber-400" />
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              Converts raw data into <span className="text-indigo-600 font-bold">Immutable Truths</span> instantly. No guessing, just verified logic.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 transition-colors hover:border-indigo-100 group/item">
                              <div className="text-[9px] text-slate-400 uppercase font-black tracking-tight mb-1">Knowledge</div>
                              <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Linked Graph
                              </div>
                            </div>
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 transition-colors hover:border-emerald-100 group/item">
                              <div className="text-[9px] text-slate-400 uppercase font-black tracking-tight mb-1">Privacy</div>
                              <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                100% Local
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Status</p>
                                <p className="text-[11px] text-slate-900 font-extrabold mt-0.5">Continuous Improvement</p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                      {/* Refined Arrow */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2.5 w-5 h-5 bg-white border-r border-b border-slate-200/50 rotate-45 shadow-[4px_4px_8px_-2px_rgba(0,0,0,0.05)]" />
                    </div>
                  </span> turns transient prompts into eternal Digital Organisms.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Lock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Digital Sovereignty</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Everything is stored locally. You own the logic, not the provider.</p>
                      </div>
                    </div>
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Layers className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Structural Memory</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Crystals preserve semantic depth, eliminating the "reset" of generic LLM sessions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Zap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Compound Interest</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Each crystal breeds higher logic, creating a compounding asset of intelligence.</p>
                      </div>
                    </div>
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
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

              <ScrollReveal direction="right" className="md:col-span-12 lg:col-span-6 relative group">
                <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-900/10 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.1)] transition-all duration-1000 group-hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 overflow-hidden">
                  {/* Subtle internal glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  <motion.div
                    className="relative z-10 w-full h-full p-2"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img
                      src="/scp_sketch_diagram.png"
                      alt="Sovereign Crystallization Protocol (SCP) Diagram - Minimalist V2"
                      className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(79,70,229,0.15)] scale-[1.7] transition-transform duration-1000"
                    />
                  </motion.div>

                  {/* Corner Accent */}
                  <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/50 border border-indigo-100/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500">Omega-Level CAG.</span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Standard CAG pre-loads context. We <strong>Synthesize Axiomatic Crystals</strong> into a Direct-Path resonance manifold.
              <br />Sub-1ms queries. 100% Deterministic. Zero Hallucination.
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
                      <div className="h-full w-[0.5%] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full shadow-md" />
                    </div>
                    <span className="text-xs font-mono text-cyan-600 font-bold w-16 text-right">&lt;1ms</span>
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
      <section className="py-24 bg-gradient-to-br from-amber-50 via-white to-violet-50 relative overflow-hidden border-y border-slate-100" >
        {/* Technical Grid Accent */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#d97706 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10" >
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

            {/* NEW: AXIOMATIC SYNTHESIS */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 transition-all group h-full ring-2 ring-indigo-500/10 ring-offset-2">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <RefreshCw className="w-6 h-6 text-cyan-600 rotate-12" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Axiomatic Synthesis</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Fuses multi-domain truth into singular proofs. Resolves contradictions at source.</p>
                <div className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">BEYOND RAG: Genetic Fusion</div>
              </div>
            </ScrollRevealItem>

            {/* NEW: FRACTAL FOLDING */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Fractal Ingestion</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Processes GB-scale datasets without memory limits using recursive axiomatic folding.</p>
                <div className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">INFINITE SCALE: Axiomatic Waves</div>
              </div>
            </ScrollRevealItem>

            {/* NEW: CONSENSUS MINING */}
            <ScrollRevealItem>
              <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all group h-full">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mb-2">Axiomatic Consensus</h4>
                <p className="text-xs text-slate-500 leading-snug mb-3">Multi-model parallel mining eliminates bias. IQ scales with total model agreement.</p>
                <div className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">HIGHER INTELLIGENCE: Cross-Audit</div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>

          {/* NEW SECTION: THE END OF HALLUCINATION */}
          <ScrollReveal className="mt-24 py-16 px-8 bg-slate-900 rounded-[3rem] text-center overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"
            />

            <Badge variant="primary" className="mb-6 bg-indigo-500/20 text-indigo-400 border-indigo-500/30">Singularity Status: ACHIEVED</Badge>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
              The End of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Hallucination.</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
              Standard LLMs guess the next token. <strong>Neural Bridge Omega</strong> proves the next axiom.
              Our XOR Contradiction Shield ensures that if a fact is unstable, it is never served.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-2xl font-black text-white">0%</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Stochastic Drift</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Logical Fidelity</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-2xl font-black text-white">Sub-1ms</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">Truth Access</p>
              </div>
            </div>
          </ScrollReveal>

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

      {/* STOP FEEDING THE VOID (LIVE DEMO) */}
      <section className="relative py-32 border-t border-indigo-50/50 bg-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="md:grid md:grid-cols-12 gap-16 items-center">
            <div className="md:col-span-12 lg:col-span-6">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Live Protocol Active</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.05] text-slate-900">
                  Stop Feeding <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500">The Void.</span>
                </h2>
                <div className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 font-medium max-w-2xl">
                  <strong>99% of your AI interactions are lost</strong> the moment you close the tab. You are renting intelligence, not building it. Our <span className="relative inline-block group cursor-help underline decoration-indigo-300 decoration-dashed decoration-1 underline-offset-4">
                    <strong>SCP (Sovereign Crystallization Protocol)</strong>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[340px] p-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-50">
                      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_32px_64px_-12px_rgba(79,70,229,0.2)] border border-white overflow-hidden ring-1 ring-slate-200/50">
                        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/50 to-white border-b border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                              <Shield size={14} className="text-white" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Axiomatic Core</span>
                          </div>
                          <span className="bg-purple-100 text-purple-700 ring-purple-500/20 text-[9px] border-indigo-100 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset">ACTIVE</span>
                        </div>
                        <div className="p-6 space-y-5">
                          <div className="relative">
                            <h4 className="text-slate-900 font-extrabold text-sm mb-1.5 flex items-center gap-2">Truth Extraction <Zap size={12} className="text-amber-400" /></h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Converts raw data into <span className="text-indigo-600 font-bold">Immutable Truths</span> instantly. No guessing, just verified logic.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 transition-colors hover:border-indigo-100 group/item">
                              <div className="text-[9px] text-slate-400 uppercase font-black tracking-tight mb-1">Knowledge</div>
                              <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>Linked Graph</div>
                            </div>
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 transition-colors hover:border-emerald-100 group/item">
                              <div className="text-[9px] text-slate-400 uppercase font-black tracking-tight mb-1">Privacy</div>
                              <div className="text-[11px] text-slate-700 font-bold flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>100% Local</div>
                            </div>
                          </div>
                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100">
                                <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin-slow" />
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Status</p>
                                <p className="text-[11px] text-slate-900 font-extrabold mt-0.5">Continuous Improvement</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2.5 w-5 h-5 bg-white border-r border-b border-slate-200/50 rotate-45 shadow-[4px_4px_8px_-2px_rgba(0,0,0,0.05)]"></div>
                    </div>
                  </span> turns transient prompts into eternal Digital Organisms.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <button
                    onClick={() => setIsDemoOpen(true)}
                    className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-indigo-500/25 hover:bg-indigo-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                  >
                    <Zap className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                    Run Live Verification
                    <span className="px-2 py-0.5 bg-indigo-800 rounded text-[10px] text-indigo-200 uppercase tracking-wider font-mono">v2.1</span>
                  </button>
                  <Link href="/nexus" className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center">
                    Read the Whitepaper
                  </Link>
                </div>
              </ScrollReveal>



              <ScrollReveal>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Lock className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Digital Sovereignty</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Everything is stored locally. You own the logic, not the provider.</p>
                      </div>
                    </div>
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Layers className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Structural Memory</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Crystals preserve semantic depth, eliminating the "reset" of generic LLM sessions.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
                        <Zap className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 text-slate-900">Compound Interest</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">Each crystal breeds higher logic, creating a compounding asset of intelligence.</p>
                      </div>
                    </div>
                    <div className="group/card flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover/card:scale-110 group-hover/card:rotate-3">
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
            </div>

            <div className="md:col-span-12 lg:col-span-6 relative group">
              <ScrollReveal direction="left">
                <div className="relative aspect-[4/3] flex items-center justify-center p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-slate-900/10 shadow-[0_24px_48px_-8px_rgba(0,0,0,0.1)] transition-all duration-1000 group-hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] group-hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <div className="relative z-10 w-full h-full p-2 scale-[1.7] group-hover:scale-[1.8] transition-transform duration-1000">
                    <img src="/scp_sketch_diagram.png" alt="Sovereign Crystallization Protocol (SCP)" className="w-full h-full object-contain drop-shadow-xl" />
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50/50 border border-indigo-100/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* EVERYDAY USE CASES - UNIVERSAL APPEAL */}
      <section className="pt-12 pb-24 bg-white relative overflow-hidden border-t border-slate-100" >
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
      </section>



      {/* MARKETING INJECTION 2.0: THE ROI ENGINE (PREMIUM WHITE GLASS REDESIGN) */}
      <section className="py-32 bg-slate-50 text-slate-900 relative overflow-hidden border-y border-slate-200">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] invert" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-indigo-100/50 to-emerald-100/50 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Sovereign Leverage</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-8">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Unfair Advantage</span>.
            </h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              While others rent generic intelligence, you own a specialized expert that knows your entire history.
              <br className="hidden md:block" />
              This isn't just "productivity". This is <strong>Exponential Leverage</strong>.
            </p>
          </ScrollReveal>

          {/* THE IMPOSSIBILITY GRID (HARD DATA COMPARISON) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <ScrollReveal direction="right">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-emerald-100 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity rounded-[2.5rem]" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">The Mathematical Gap</h3>

                    {/* ROW 1: CONTEXT */}
                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Context Memory</div>
                        <div className="text-xs text-slate-400">Recall limitation per session</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-red-500 line-through decoration-red-500/30">128k Tokens (Resets)</div>
                        <div className="text-sm font-bold text-emerald-600">Infinite (Persistent)</div>
                      </div>
                    </div>

                    {/* ROW 2: OWNERSHIP */}
                    <div className="flex items-center justify-between py-4 border-b border-slate-100">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Asset Class</div>
                        <div className="text-xs text-slate-400">Can you sell the model?</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400">Rented API (No)</div>
                        <div className="text-sm font-bold text-indigo-600">Owned File (.crystal)</div>
                      </div>
                    </div>

                    {/* ROW 3: TRUTH */}
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Verification</div>
                        <div className="text-xs text-slate-400">Proof of claim validity</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400">Probabilistic Guess</div>
                        <div className="text-sm font-bold text-amber-600">Cryptographic SHA-256</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* TEXT CONTENT */}
            <ScrollReveal direction="left">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 text-indigo-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Out-Earn the Competition</h3>
                    <p className="text-slate-500 leading-relaxed">
                      Agencies and freelancers using Neural Bridge deliver work <strong>5x faster</strong> because they don't waste time "prompt engineering" context. The AI already knows the client's brand voice, history, and goals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 text-emerald-600">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">The "Senior Dev" Effect</h3>
                    <p className="text-slate-500 leading-relaxed">
                      For developers, it's like pairing with a senior engineer who memorized the entire repo. Fix bugs instantly. Explain legacy code in seconds. Bill for the solution, not the struggle.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* INCOME STREAMS GRID (LIGHT MODE TUTORIALS) */}
          <ScrollRevealStagger className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.1}>
            <ScrollRevealItem>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="mb-6 p-3 bg-indigo-50 rounded-xl w-fit text-indigo-600 group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">The Trust Moat</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 group-hover:opacity-10 transition-opacity duration-300">
                  Don't just promise results. <strong>Prove them.</strong> Embed a cryptographic "Truth Proof" in your client pitch that verifies your claims against public data.
                </p>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2 group-hover:opacity-10 transition-opacity duration-300">
                  <Shield size={12} /> Verifiable Authority
                </div>

                {/* HOVER TUTORIAL: AGENCY WORKFLOW */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-left z-20">
                  <h5 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">How to Monetize</h5>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px]">1</span>
                      <span><strong>Ingest URL:</strong> Drag client's site into "Mass Ingest".</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px]">2</span>
                      <span><strong>Auto-Audit:</strong> Ask "Identify 3 weak claims & prove them wrong".</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px]">3</span>
                      <span><strong>Mint Proof:</strong> Click "Generate Truth Hash" on the report.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-[10px]">4</span>
                      <span className="text-slate-900 font-bold"><strong>Close Deal:</strong> Send irrefutable audit.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="mb-6 p-3 bg-emerald-50 rounded-xl w-fit text-emerald-600 group-hover:scale-110 transition-transform">
                  <Terminal size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">The Infinity Moat</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 group-hover:opacity-10 transition-opacity duration-300">
                  ChatGPT forgets after 30 messages. Neural Bridge holds the <strong>entire project history forever.</strong> Refactor architecture, not just functions.
                </p>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 group-hover:opacity-10 transition-opacity duration-300">
                  <RefreshCw size={12} /> Immortal Context
                </div>

                {/* HOVER TUTORIAL: DEV WORKFLOW */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-left z-20">
                  <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-4">How to Monetize</h5>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-[10px]">1</span>
                      <span><strong>Index Repo:</strong> Link local folder (`/src`). Auto-vectorizes in seconds.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-[10px]">2</span>
                      <span><strong>Query Legacy:</strong> "Why did we add this hack in 2023?"</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-[10px]">3</span>
                      <span><strong>Instant Fix:</strong> AI cites the commit and suggests non-breaking refactor.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 text-[10px]">4</span>
                      <span className="text-slate-900 font-bold"><strong>Bill Client:</strong> 1hr billable work in 5 mins.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollRevealItem>

            <ScrollRevealItem>
              <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="mb-6 p-3 bg-amber-50 rounded-xl w-fit text-amber-600 group-hover:scale-110 transition-transform">
                  <Lightbulb size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">The Asset Moat</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 group-hover:opacity-10 transition-opacity duration-300">
                  Don't sell hours. <strong>Sell the Crystal.</strong> Export your research as a proprietary <code>.crystal</code> file that the client can chat with but cannot copy.
                </p>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2 group-hover:opacity-10 transition-opacity duration-300">
                  <Key size={12} /> IP Monetization
                </div>

                {/* HOVER TUTORIAL: CONSULTANT WORKFLOW */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl p-6 flex flex-col justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-left z-20">
                  <h5 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4">How to Monetize</h5>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0 text-[10px]">1</span>
                      <span><strong>Research:</strong> Ingest 50 PDFs & 200 URLs on a niche topic.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0 text-[10px]">2</span>
                      <span><strong>Curate:</strong> Use "Crystal Refiner" to prune bad data & dupes.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold shrink-0 text-[10px]">3</span>
                      <span><strong>Export:</strong> Save as <code>industry_analysis_2026.crystal</code>.</span>
                    </li>
                    <li className="flex gap-3 items-start text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0 text-[10px]">4</span>
                      <span className="text-slate-900 font-bold"><strong>License:</strong> Sell file for $5k/client.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollRevealStagger>

        </div>
      </section>
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
        <div className="absolute inset-0 z-0 pointer-events-none active-noise-layer">
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_BASE64_PAGE}")` }}></div>
        </div>
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
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_BASE64_PAGE}")` }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
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
            </div>

            <div className="relative bg-gradient-to-br from-[#0a0a0a] to-black border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-xl">
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
            </div>
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


