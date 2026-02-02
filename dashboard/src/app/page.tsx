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
  Binary
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If already logged in, we could redirect to dashboard, 
  // but usually a landing page should be accessible.
  // Let's keep it accessible but show a "Go to Dashboard" CTA.

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* STICKY NAV */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">Neural Bridge</span>
        </div>

        <div className="flex items-center space-x-6">
          {!user ? (
            <>
              <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">Login</Link>
              <Link href="/register" className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-400 transition-all">Join Cortex</Link>
            </>
          ) : (
            <Link href="/dashboard" className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-500/20 transition-all">Go to Dashboard</Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/80 to-[#020202] z-10" />
          <img
            src="/hero-bg.png"
            alt="Neural Lattice"
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Omega Protocol v4.0 Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 leading-[0.9]"
          >
            UNIFYING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">AI REALITY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The worlds first Semantic Continuity Protocol. Transfer context perfectly across GPT, Claude, and Gemini with mathematical certainty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            {/* Chrome Store Link - Needs actual link if available, otherwise mock */}
            <a
              href="#"
              className="w-full md:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group"
            >
              <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Install Extension</span>
            </a>

            <Link
              href="/register"
              className="w-full md:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Identity</span>
            </Link>
          </motion.div>
        </div>

        {/* SCROLL DECOR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-20 bg-gradient-to-b from-cyan-500 to-transparent"
          />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-4">Core Technology</h2>
          <h3 className="text-4xl font-black tracking-tighter">THE LATTICE FRAMEWORK</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Shield}
            title="PCK Runtime"
            desc="Proof-Carrying Knowledge. Verify AI claims with zero external API calls."
            color="cyan"
          />
          <FeatureCard
            icon={Lock}
            title="ZKV Protocol"
            desc="Zero-Knowledge Verification. Enterprise-grade privacy for knowledge injection."
            color="purple"
          />
          <FeatureCard
            icon={RefreshCw}
            title="SMT Anchoring"
            desc="Semantic Merkle Trees. Detect and heal contradictions in real-time."
            color="blue"
          />
          <FeatureCard
            icon={Layers}
            title="CLPV Engine"
            desc="Cross-LLM Portable Verification. One truth, verified on every model."
            color="emerald"
          />
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-black tracking-tighter text-cyan-400 mb-2">99.9%</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Semantic Purity</div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter text-white mb-2">0.0ms</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">PCK Latency</div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter text-white mb-2">10M+</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Truths Anchored</div>
          </div>
          <div>
            <div className="text-4xl font-black tracking-tighter text-cyan-400 mb-2">Ω-Level</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Consensus Engine</div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-black tracking-tighter mb-8 italic">READY TO ANCHOR <br /> YOUR <span className="text-cyan-500 underline decoration-cyan-500/30">REALITY?</span></h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-5 bg-cyan-500 text-black rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)]"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Authorized Access
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-cyan-500/10 border border-cyan-500/20 rounded flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Neural Bridge</span>
          </div>
          <div className="flex space-x-8">
            <a href="#" className="text-[10px] text-gray-500 hover:text-cyan-400 font-bold uppercase tracking-widest">Technical Paper</a>
            <a href="#" className="text-[10px] text-gray-500 hover:text-cyan-400 font-bold uppercase tracking-widest">Jury Protocols</a>
            <a href="#" className="text-[10px] text-gray-500 hover:text-cyan-400 font-bold uppercase tracking-widest">Security Audit</a>
          </div>
          <div className="text-[10px] text-gray-700 font-mono uppercase">
            © 2026 Neural Bridge Protocol // No Rights Reserved // Open Source Sovereignty
          </div>
        </div>
      </footer>

      {/* GLOBAL DECORATIVE NOISE */}
      <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] contrast-150 brightness-150 grayscale invert mix-blend-overlay">
        <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  const colors: any = {
    cyan: "group-hover:text-cyan-400 group-hover:bg-cyan-500/10 border-cyan-500/10",
    purple: "group-hover:text-purple-400 group-hover:bg-purple-500/10 border-purple-500/10",
    blue: "group-hover:text-blue-400 group-hover:bg-blue-500/10 border-blue-500/10",
    emerald: "group-hover:text-emerald-400 group-hover:bg-emerald-500/10 border-emerald-500/10",
  };

  return (
    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:border-white/20 transition-all group relative overflow-hidden">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 transition-all ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
