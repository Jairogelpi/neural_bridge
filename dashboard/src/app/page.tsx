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
  XCircle,
  Brain,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-[#020202] font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* MINIMALIST NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 p-[1.5px]">
            <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-tr from-indigo-600 to-violet-500 rotate-45" />
            </div>
          </div>
          <span className="text-xs font-black tracking-[0.3em] uppercase">Neural Bridge</span>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-8">
          {!user ? (
            <>
              <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors hidden sm:inline-block">Login</Link>
              <Link href="/register" className="px-5 sm:px-6 py-2.5 bg-[#020202] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20">Get Started</Link>
            </>
          ) : (
            <Link href="/dashboard" className="px-6 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all">Go to App</Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 overflow-hidden">
        {/* Soft Background Accents - Floating Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10"
        />

        <div className="relative z-20 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-full mb-8 shadow-sm"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Online • Zero Token Cost</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gray-900"
          >
            Don't Rent Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Intelligence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The first AI memory system that you actually own. Save 87% on API costs by remembering instead of regenerating.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto h-14 flex items-center justify-center px-8 bg-[#020202] text-white rounded-xl font-bold text-sm tracking-wide hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 duration-300"
            >
              Start for Free
            </Link>

            <a
              href="#"
              className="w-full sm:w-auto h-14 flex items-center justify-center space-x-2 px-8 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm tracking-wide hover:border-black transition-all hover:scale-105 active:scale-95 duration-300"
            >
              <Chrome size={18} />
              <span>Add to Browser</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-4">The Truth About AI</h2>
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-gray-900">Why pay for the same answer twice?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Old Way Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
              <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-red-500">
                <XCircle size={24} />
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">The Old Way (RAG)</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-sm">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Uploads your private files to cloud vectors</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Pays API cost for EVERY question</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> AI "hallucinates" answers frequently</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-red-400" /> You own nothing. OpenRouter/OpenAI owns it.</li>
              </ul>
            </motion.div>

            {/* Neural Bridge Way Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-[#020202] p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden text-white transform hover:scale-[1.02] transition-transform duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
              <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                <CheckCircle size={24} />
              </div>
              <h4 className="text-2xl font-bold mb-4">The Neural Bridge Way</h4>
              <ul className="space-y-4 text-gray-300 font-medium text-sm">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> <strong className="text-white">Crystal Storage:</strong> Data stays local & encrypted</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> <strong className="text-white">Zero Cost:</strong> Remembers answers, doesn't regenerate</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> <strong className="text-white">Mathematical Truth:</strong> 100% verified accuracy</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-green-400" /> <strong className="text-white">Sovereign:</strong> You own your specialized brain</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES SIMPLIFIED */}
      <section className="py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureSimple
              icon={Brain}
              title="Crystal Memory"
              desc="Like a zip file for ideas. We compress complex logic into 'Crystals' that any AI can understand instantly."
            />
            <FeatureSimple
              icon={Shield}
              title="Forensic Auditor"
              desc="Our 'Sentinel' AI checks every answer for lies, fallacies, and errors before you even see it."
            />
            <FeatureSimple
              icon={Database}
              title="Expert Hub"
              desc="Build your reputation. The more you contribute to the network, the more powerful your personal AI becomes."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-[2px] rotate-45" />
              </div>
              <span className="text-sm font-black tracking-widest uppercase text-gray-900">Neural Bridge</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              The first sovereign AI memory fabric. Own your intelligence, reduce api costs, and verify truth cryptographically.
            </p>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Platform</h5>
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Sentinel Login</Link></li>
              <li><Link href="/register" className="hover:text-indigo-600 transition-colors">Initialize Protocol</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Download Extension</Link></li>
              <li><Link href="/docs/api" className="hover:text-indigo-600 transition-colors">API Reference</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legal & Privacy</h5>
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Sovereignty</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Data Audit</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">© 2026 Neural Bridge Systems</p>
          <div className="flex items-center space-x-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">System Functional</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureSimple({ icon: Icon, title, desc }: any) {
  return (
    <div className="text-left">
      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
        <Icon size={24} />
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-3">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
