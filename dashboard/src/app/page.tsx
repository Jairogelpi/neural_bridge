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
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* QUANTUM MESH BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* MINIMALIST NAV - DARK MODE */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-10 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-[1px]">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 rotate-45 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-white/90">Neural Bridge</span>
        </div>

        <div className="flex items-center space-x-10">
          <Link href="/library" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Manifesto</Link>
          <Link href="/nexus" className="hidden md:block text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Technology</Link>
          {!user ? (
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 active:scale-95">Infiltrate</Link>
            </div>
          ) : (
            <Link href="/dashboard" className="px-8 py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/10 transition-all backdrop-blur-xl">Terminal</Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION - REVOLUTIONARY COPY */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-8 z-10">
        <div className="text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-12 backdrop-blur-3xl"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-4 shadow-[0_0_10px_rgba(99,102,241,1)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 italic">Sovereign Intelligence Era v1.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-8xl md:text-[11rem] font-black italic tracking-tighter mb-10 leading-[0.8] text-white uppercase"
          >
            STOP COPY-PASTING. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">START CRYSTALLIZING.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-white/40 font-bold max-w-4xl mx-auto mb-16 leading-tight tracking-tight uppercase"
          >
            Stop being a passenger in someone else's model. Own your knowledge.
            <span className="text-white"> Permanent, algebraic knowledge transfer </span>
            that never hallucinates and costs $0 to run.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <button
              onClick={() => router.push('/ingest')}
              className="w-full md:w-auto flex items-center justify-center space-x-4 px-12 py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-[0_20px_50px_rgba(99,102,241,0.3)] group"
            >
              <Chrome size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Install Neural Extension</span>
            </button>

            <Link
              href="/register"
              className="w-full md:w-auto flex items-center justify-center space-x-4 px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-3xl"
            >
              <UserPlus size={20} />
              <span>Create Sovereign ID</span>
            </Link>
          </motion.div>
        </div>

        {/* Floating Stat Pills */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl w-full">
          {[
            { label: 'Latency', val: '0.0ms' },
            { label: 'Token Cost', val: '$0.00' },
            { label: 'Truth Fidelity', val: '100%' },
            { label: 'Neural Density', val: '∞' }
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-center backdrop-blur-3xl">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{s.label}</p>
              <p className="text-2xl font-black italic text-white/80">{s.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE COMPETITOR KILLER SECTION */}
      <section className="py-60 px-8 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-[12px] font-black uppercase tracking-[0.8em] text-indigo-500 mb-8">Competitive Dominance</h2>
          <h3 className="font-bebas text-[10rem] md:text-[15rem] leading-[0.75] italic tracking-tighter uppercase">
            WHY WE <span className="text-white/10">WIN.</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <CompetitiveMatrix
            target="CHAT_GPT / NOTEBOOK_LM"
            weakness="Manual Copy-Paste & Data Silos"
            strength="Instant Neural Synthesis"
            desc="While they trap your knowledge in a chat box, we crystallize it into a portable, localized asset that works everywhere."
          />
          <CompetitiveMatrix
            target="TRADITIONAL RAG"
            weakness=" Hallucination-Prone Vectors"
            strength="Algebraic Proof (PCK)"
            desc="RAG is just 'best guess' search. Our Proof-Carrying Knowledge (PCK) is mathematical law. If it's in the Bridge, it's 100% true."
          />
          <CompetitiveMatrix
            target="LANGCHAIN / GUARDRAILS"
            weakness="Fragile Prompt-Based Logic"
            strength="Native Verification (PCK)"
            desc="Prompt engineering is a band-aid. We use semantic compilers and crystalline protocols to ensure integrity at the bit level."
          />
        </div>
      </section>

      {/* PROTOCOL DOMINANCE LEDGER */}
      <section className="py-60 px-8 relative z-10 bg-black overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-32 border-b border-white/5 pb-16">
            <div className="max-w-2xl">
              <h2 className="text-[12px] font-black uppercase tracking-[0.8em] text-cyan-400 mb-8">Proprietary Inventions</h2>
              <h3 className="font-bebas text-8xl md:text-9xl leading-[0.85] italic tracking-tighter uppercase">
                THE SCIENTIFIC <span className="text-white/20">LEDGER.</span>
              </h3>
            </div>
            <p className="text-white/30 font-bold max-w-sm text-sm mt-8 md:mt-0 uppercase tracking-widest leading-relaxed">
              We didn't just build an app. We invented the protocols that define the next century of intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <ProtocolCard
              code="SCP"
              name="Semantic Continuity Protocol"
              impact="REVOLUTIONARY"
              desc="Forget 'Chat History'. SCP ensures 100% context persistence by crystallizing knowledge into immutable, portable manifolds."
              benefit="Universal portability between every AI model on Earth."
            />
            <ProtocolCard
              code="PCK"
              name="Proof-Carrying Knowledge"
              impact="MATHEMATICAL LAW"
              desc="Algebraic verification of every claim. If the proof doesn't carry, the knowledge doesn't crystallize. Zero Hallucination."
              benefit="100% verifiable truth without manual checking."
            />
            <ProtocolCard
              code="ZKV"
              name="Zero-Knowledge Verification"
              impact="SOVEREIGN PRIVACY"
              desc="Verify knowledge fidelity without ever revealing the underlying data. Your mind remains your own."
              benefit="Enterprise-grade privacy at the data-packet level."
            />
            <ProtocolCard
              code="SMT"
              name="Semantic Merkle Trees"
              impact="INFINITE SCALE"
              desc="Self-healing data structures that anchor billions of crystals with cryptographic integrity at 0ms latency."
              benefit="Infinite memory that never slows down or degrades."
            />
            <ProtocolCard
              code="JURY"
              name="Decentralized Truth Consensus"
              impact="NON-CUSTODIAL"
              desc="The democratic protocol that resolves semantic conflicts and updates the global truth index via human-AI synergy."
              benefit="Biased-free, transparent information integrity."
            />
            <ProtocolCard
              code="Ω"
              name="The Pulse of Omega"
              impact="SYNCHRONICITY"
              desc="The real-time synchronization layer that binds the entire lattice into a single, living intelligence engine."
              benefit="Instant availability of any crystal across all devices."
            />
          </div>
        </div>
      </section>

      {/* TECHNOLOGY STACK - OBSIDIAN STYLE */}
      <section className="py-60 bg-black relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-8">Deep Tech Architecture</h2>
              <h3 className="font-bebas text-8xl italic mb-12">CRYSTALLINE <span className="text-white/20">GRID.</span></h3>
              <p className="text-xl text-white/40 font-bold mb-12 uppercase leading-relaxed">
                We don't use "prompts" or "scripts". We build sovereign knowledge objects called <span className="text-white">Crystals</span>.
                Verified by the <span className="text-white">Jury Protocol</span> and secured by <span className="text-emerald-500">Zero-Knowledge Proofs</span>.
              </p>
              <div className="space-y-6">
                <TechLine label="Algebraic Ingestion" val="Verified" color="text-indigo-500" />
                <TechLine label="Semantic Merkle Tunnels" val="Active" color="text-purple-500" />
                <TechLine label="Local-First Inference" val="0ms" color="text-cyan-500" />
                <TechLine label="Sovereign Identity" val="Encrypted" color="text-emerald-500" />
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[4rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-emerald-500/20 border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <Brain size={280} className="text-white/20 animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full scale-75"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - AGGRESSIVE */}
      <section className="py-60 px-8 text-center bg-gradient-to-b from-black to-indigo-950/20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-bebas text-9xl md:text-[15rem] leading-none mb-12 italic italic">OWN_YOUR_MIND.</h3>
          <p className="text-xl md:text-2xl text-white/30 font-black uppercase tracking-[0.5em] mb-20 max-w-3xl mx-auto">
            Join the 0.01% of users who truly control their intelligence.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-20 py-10 bg-indigo-500 text-white font-black text-2xl uppercase tracking-[0.4em] rounded-[3rem] hover:bg-white hover:text-black transition-all shadow-[0_40px_100px_rgba(99,102,241,0.4)] active:scale-95 italic"
          >
            INFILTRATE_NOW <ArrowRight size={32} className="ml-6" />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER - COMPACT / PREMIUM */}
      <footer className="py-24 px-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="block text-[10px] font-black tracking-[0.6em] uppercase">Neural Bridge</span>
                <span className="block text-[8px] font-black text-white/20 uppercase mt-1">Sovereignty Infrastructure</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-12">
              <Link href="/privacy" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-indigo-400 transition-colors">Privacy_v4</Link>
              <a href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-indigo-400 transition-colors">Technical_Manifesto</a>
              <a href="#" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-indigo-400 transition-colors">The_Cortex_Registry</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/5 pt-12 text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
            <span>© 2026 Neural_Bridge_Protocol // Non-Custodial Intelligence</span>
            <span>Local_Verified_Algebraic_Sovereign</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProtocolCard({ code, name, impact, desc, benefit }: any) {
  return (
    <div className="group relative p-10 rounded-[3rem] bg-indigo-500/[0.02] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/[0.04] transition-all duration-700 overflow-hidden">
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="text-4xl font-black italic tracking-tighter text-indigo-500">{code}</div>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 border border-indigo-500/20">
            {impact}
          </span>
        </div>

        <h4 className="text-xl font-black uppercase tracking-widest text-white mb-4 leading-tight">{name}</h4>
        <p className="text-sm text-white/30 font-medium leading-relaxed mb-8">
          {desc}
        </p>

        <div className="pt-6 border-t border-white/5">
          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] block mb-2">Benefit Synergy</span>
          <p className="text-[10px] font-bold text-white/60 uppercase leading-snug tracking-wider">
            {benefit}
          </p>
        </div>
      </div>
    </div>
  );
}

function CompetitiveMatrix({ target, weakness, strength, desc }: any) {
  return (
    <div className="group p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-700">
      <div className="mb-10">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] block mb-4">Competitor</span>
        <h4 className="text-3xl font-black italic tracking-tighter text-white/90">{target}</h4>
      </div>

      <div className="space-y-8 mb-12">
        <div>
          <span className="text-[8px] font-black text-rose-500 uppercase tracking-[0.4em] block mb-2">The Weakness</span>
          <p className="text-sm font-black text-rose-500/60 uppercase">{weakness}</p>
        </div>
        <div className="w-full h-[1px] bg-white/5" />
        <div>
          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] block mb-2">The Bridge Win</span>
          <p className="text-sm font-black text-emerald-500 uppercase">{strength}</p>
        </div>
      </div>

      <p className="text-sm text-white/30 font-bold uppercase leading-relaxed tracking-wider">
        {desc}
      </p>
    </div>
  );
}

function TechLine({ label, val, color }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 group">
      <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${color}`}>{val}</span>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-10 hover:border-black transition-all hover:-translate-y-2 duration-500">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-2xl font-black italic tracking-tighter mb-4">{title}</h4>
      <p className="text-sm text-gray-500 font-medium leading-relaxed uppercase tracking-wider">{desc}</p>
    </div>
  );
}
