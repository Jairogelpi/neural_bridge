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
  Scale
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LandingHeader } from '@/components/LandingHeader';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      <LandingHeader />

      {/* HERO SECTION - REVOLUTIONARY */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] -z-10" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-20 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3 shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Omega Protocol Active • Zero Hallucinations</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-white"
          >
            Access <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500">Sovereign</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The first self-evolving knowledge manifold. Beyond RAG. Beyond Vector DBs.
            <br className="hidden md:block" />
            <span className="text-gray-300">Infinite memory that you actually own.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/register"
              className="group w-full sm:w-auto h-16 flex items-center justify-center px-10 bg-white text-black rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Initialize Node <ArrowRight size={16} />
              </span>
            </Link>

            <a
              href="#"
              className="w-full sm:w-auto h-16 flex items-center justify-center space-x-2 px-10 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95 duration-300 backdrop-blur-sm"
            >
              <Chrome size={18} />
              <span>Add to Browser</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* TECH DEEP DIVE - CRYSTALS & FRACTALS */}
      <section id="tech" className="py-32 px-6 bg-[#080808] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        <div className="max-w-7xl mx-auto">
          <div className="md:grid md:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-6">Unit of Logic</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">The Crystal.</h3>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Old AI systems store "text chunks." We store <strong className="text-white">Crystals</strong>.
                An immutable, cryptographically signed unit of meaning. It contains the raw data, the logic, and the context—fused into a single verified block.
              </p>
              <ul className="space-y-4">
                <ListItem text="Validated by PCK Protocols" />
                <ListItem text="Immutable & Signatures" />
                <ListItem text="Zero-Latency Retrieval" />
              </ul>
            </div>
            <div className="relative h-[500px] w-full bg-gradient-to-tr from-indigo-900/20 to-purple-900/20 rounded-[3rem] border border-white/5 flex items-center justify-center backdrop-blur-3xl">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
              <Layers size={120} className="text-indigo-400 relative z-10 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 gap-24 items-center">
            <div className="order-2 md:order-1 relative h-[500px] w-full bg-gradient-to-tr from-pink-900/20 to-purple-900/20 rounded-[3rem] border border-white/5 flex items-center justify-center backdrop-blur-3xl">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="w-64 h-64 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />
              <Binary size={120} className="text-pink-400 relative z-10 drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-6">Infinite Context</h2>
              <h3 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">The Fractal.</h3>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                How do you remember a million pages without cost? <strong className="text-white">Fractal Compression</strong>.
                Using Topological Phase-Shift Analysis, we create a "Knowledge Hologram"—a massive reality condensed into a dense Axiomatic Core.
              </p>
              <ul className="space-y-4">
                <ListItem text="Topological Phase-Shift Analysis" />
                <ListItem text="Meta-Invariant Extraction" />
                <ListItem text="Recursively Scalable Truth" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO: RAG IS DEAD */}
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
                  <strong>Neural Bridge</strong> changes the physics of knowledge.
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

      {/* PROTOCOL GRID */}
      <section id="protocols" className="py-32 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter text-white mb-6">The Omega Protocols</h2>
            <p className="text-gray-400">The engine that makes Neural Bridge mathematically superior.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProtocolCard
              title="PCK"
              subtitle="Proof-Carrying Knowledge"
              desc="Zero-Latency Verification. Embedding proofs directly into the data."
              icon={Shield}
              color="text-indigo-400"
            />
            <ProtocolCard
              title="ZKV"
              subtitle="Zero-Knowledge Verification"
              desc="Enterprise Privacy. Prove correctness without revealing the source document."
              icon={Lock}
              color="text-purple-400"
            />
            <ProtocolCard
              title="SMT"
              subtitle="Semantic Merkle Trees"
              desc="Hash of Meaning. Detect paraphrasing and plagiarism instantly."
              icon={Network}
              color="text-blue-400"
            />
            <ProtocolCard
              title="CLPV"
              subtitle="Cross-LLM Portability"
              desc="Universal Receipts. Verify an answer from GPT-4 using Claude's logic."
              icon={Globe}
              color="text-green-400"
            />
            <ProtocolCard
              title="Hypervectors"
              subtitle="Semantic Hashing"
              desc="We treat meaning as a vector, not a string. Comparison is instant. Math, not Magic."
              icon={Binary}
              color="text-cyan-400"
            />
            <ProtocolCard
              title="Vaccines"
              subtitle="Cognitive Immunity"
              desc="Injecting 'truth antibodies' to prevent logic viruses and hallucinations."
              icon={Activity}
              color="text-red-400"
            />
            <ProtocolCard
              title="Omega"
              subtitle="Sovereign Activation"
              desc="You become the source of truth. Decentralized consensus."
              icon={Fingerprint}
              color="text-amber-400"
            />
            <ProtocolCard
              title="RLM"
              subtitle="Reinforcement Logic"
              desc="Active Inference. Stability = Wisdom. Measured by Fisher Information."
              icon={Brain}
              color="text-pink-400"
            />
          </div>
        </div>
      </section>

      {/* COMPARISON - OLD VS NEW */}
      <section id="comparison" className="py-32 px-6 bg-white text-black relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black tracking-tighter text-black mb-16 text-center">Stop Renting. Start Owning.</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-12 bg-gray-100 rounded-[3rem]">
              <h3 className="text-2xl font-black uppercase text-gray-400 mb-8">The Old Way (RAG)</h3>
              <ul className="space-y-6">
                <BadItem text="You upload private files to someone else's cloud" />
                <BadItem text="You pay API costs for EVERY question (0% Cache)" />
                <BadItem text="Hallucinations are 'features' (No verification)" />
                <BadItem text="Context is forgotten immediately" />
              </ul>
            </div>
            <div className="p-12 bg-black text-white rounded-[3rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 overflow-hidden blur-[100px] opacity-30 rounded-full pointer-events-none" />
              <h3 className="text-2xl font-black uppercase text-indigo-400 mb-8">The Neural Bridge Way</h3>
              <ul className="space-y-6">
                <GoodItem text="Data stays LOCAL. Encrypted. Sovereign." />
                <GoodItem text="Zero Cost. Remember once, run forever." />
                <GoodItem text="Mathematical Truth via PCK & ZKV." />
                <GoodItem text="Evolving Intelligence via RLM." />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-black border-t border-white/10 text-gray-500 text-center">
        <p className="text-xs font-bold uppercase tracking-widest">© 2026 Neural Bridge Systems • Sovereign Intelligence</p>
      </footer>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-gray-300 font-medium">
      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full box-content border-2 border-indigo-500/30" />
      {text}
    </li>
  );
}

function ProtocolCard({ title, subtitle, desc, icon: Icon, color }: any) {
  return (
    <div className="group p-8 bg-white/5 border border-white/5 hover:border-white/10 rounded-3xl transition-all hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${color}`}>
        <Icon size={24} />
      </div>
      <h4 className="text-2xl font-bold text-white mb-1">{title}</h4>
      <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">{subtitle}</p>
      <p className="text-sm text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">{desc}</p>
    </div>
  );
}

function BadItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-gray-500 font-bold">
      <XCircle size={20} className="text-red-500 shrink-0" />
      {text}
    </li>
  );
}

function GoodItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-white font-bold">
      <CheckCircle size={20} className="text-green-500 shrink-0" />
      {text}
    </li>
  );
}
