"use client";

import { motion } from 'framer-motion';
import {
  Shield,
  ArrowRight,
  Chrome,
  UserPlus,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
      {/* MINIMALIST NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">Neural Bridge</span>
        </div>

        <div className="flex items-center space-x-8">
          <Link href="/library" className="hidden md:block text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Principles</Link>
          <Link href="/nexus" className="hidden md:block text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Tech</Link>
          {!user ? (
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors uppercase tracking-widest">Login</Link>
              <Link href="/register" className="btn-indigo !px-6 !py-2.5 !text-[10px] !rounded-xl">Start Building</Link>
            </div>
          ) : (
            <Link href="/dashboard" className="btn-secondary !px-6 !py-2.5 !text-[10px] !rounded-xl">Go to Console</Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-10"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">The Sovereign Intelligence Protocol v1.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mb-8"
        >
          Own your knowledge. <br />
          <span className="text-indigo-600">Synthesize reality.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 font-medium"
        >
          Neural Bridge is the mathematical standard for portable knowledge.
          Capture, crystallize, and transfer context between any AI without data silos or hallucinations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-6"
        >
          <button
            onClick={() => router.push('/ingest')}
            className="btn-indigo shadow-xl shadow-indigo-500/10"
          >
            <Chrome size={20} />
            Download Extension
          </button>
          <Link
            href="/register"
            className="btn-secondary"
          >
            Create Your Bridge ID
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Floating Abstract Visual */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full max-w-4xl h-full pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="mb-4">Engineered for Truth.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Proprietary mathematical layers for elite intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-indigo-600" />}
              title="Semantic Merkle Tunnels"
              desc="Immutable data structures that ensure your knowledge remains corruption-free across every chat session."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-indigo-600" />}
              title="Proof-Carrying Knowledge"
              desc="Algebraic verification of every claim. If the bridge can't prove it, it won't suggest it. Zero hallucinations."
            />
            <FeatureCard
              icon={<UserPlus className="w-6 h-6 text-indigo-600" />}
              title="Sovereign Ownership"
              desc="Your data never leaves your local bridge. Use any AI model without giving away your proprietary context."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Shield className="w-5 h-5 text-indigo-600" />
          <span className="text-sm font-bold tracking-tight">Neural Bridge</span>
        </div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          © 2026 Sovereign Infrastructure Group // Algebraic Unity
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 group">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="text-xl mb-4">{title}</h4>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
