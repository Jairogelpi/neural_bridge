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
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-[#020202] font-sans overflow-x-hidden selection:bg-cyan-100 selection:text-cyan-900">
      {/* MINIMALIST NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1.5px]">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-tr from-blue-600 to-cyan-400 rotate-45" />
            </div>
          </div>
          <span className="text-xs font-black tracking-[0.3em] uppercase">Neural Bridge</span>
        </div>

        <div className="flex items-center space-x-8">
          {!user ? (
            <>
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Login</Link>
              <Link href="/register" className="px-6 py-2.5 bg-[#020202] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-500 transition-all shadow-xl shadow-black/5">Join Cortex</Link>
            </>
          ) : (
            <Link href="/dashboard" className="px-6 py-2.5 bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-cyan-100 transition-all">Dashboard</Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6">
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] -z-10" />

        <div className="relative z-20 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full mb-10"
          >
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-3" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Omega Protocol Active v4.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black italic tracking-tighter mb-8 leading-[0.85] text-black"
          >
            BRIDGE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">NEW REALITY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed tracking-tight"
          >
            The worlds first Semantic Continuity Protocol. Transfer knowledge crystals perfectly across the neural lattice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center gap-5"
          >
            <a
              href="#"
              className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-[#020202] text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/10 group"
            >
              <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Install Extension</span>
            </a>

            <Link
              href="/register"
              className="w-full md:w-auto flex items-center justify-center space-x-3 px-10 py-5 bg-white border border-gray-200 rounded-full font-black uppercase tracking-widest hover:border-black transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Get Started</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-40 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-gray-100 pb-12">
          <div className="max-w-xl">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Core Technology</h2>
            <h3 className="text-5xl font-black tracking-tighter leading-tight italic">CRYSTALLINE <span className="text-cyan-500">INFRASTRUCTURE.</span></h3>
          </div>
          <p className="text-gray-400 font-medium max-w-sm text-sm mt-6 md:mt-0 italic uppercase tracking-widest">
            Mathematical certainty at scale. No latency. No artifacts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Shield}
            title="PCK Runtime"
            desc="Proof-Carrying Knowledge. Real-time verification without external calls."
          />
          <FeatureCard
            icon={Lock}
            title="ZKV Protocol"
            desc="Zero-Knowledge Verification. Your data stays sovereign and private."
          />
          <FeatureCard
            icon={RefreshCw}
            title="SMT Anchoring"
            desc="Semantic Merkle Trees. Self-healing knowledge structures."
          />
          <FeatureCard
            icon={Globe}
            title="Universal SCP"
            desc="The bridge that connects every neural model on the planet."
          />
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-40 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-20">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Precision</div>
            <div className="text-7xl font-black italic tracking-tighter mb-4">99.9%</div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Semantic Fidelity Verified by PCK</p>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">Latency</div>
            <div className="text-7xl font-black italic tracking-tighter mb-4">0.0ms</div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Local Inference Runtime Speed</p>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-4">Scale</div>
            <div className="text-7xl font-black italic tracking-tighter mb-4">10M+</div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Knowledge Crystals Anchored</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-8 border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#020202] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black tracking-[0.4em] uppercase">Neural Bridge</span>
            </div>
            <div className="flex flex-wrap gap-10">
              <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Privacy Protocol</Link>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Technical Paper</a>
              <a href="#" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Jury Registry</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-50 pt-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] font-mono">
            <span>© 2026 Neural Bridge Protocol</span>
            <span>Designed for Sovereignty // v4.0.0</span>
          </div>
        </div>
      </footer>
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
