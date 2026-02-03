'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Network, GitBranch, Share2, Zap, ZoomIn, ZoomOut, Database } from 'lucide-react';

// Types mirror the backend
interface Synapse {
    target: string;
    type: string;
    strength: number;
}

interface Genealogy {
    generation: number;
    parents: string[];
}

interface CrystalNode {
    context_id: string;
    domain: string;
    intent: { primary: string };
    synapses?: Synapse[];
    genealogy?: Genealogy;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

export default function CortexPage() {
    const [crystals, setCrystals] = useState<CrystalNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<CrystalNode | null>(null);
    const [viewMode, setViewMode] = useState<'neural' | 'genealogy'>('neural');
    const [zoom, setZoom] = useState(1);

    // Canvas/SVG Refs
    const svgRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<number>();

    // 1. Fetch Data
    useEffect(() => {
        async function fetchData() {
            // Fetch everything needed for the graph
            const { data } = await supabase
                .from('crystals')
                .select('context_id, domain, intent, synapses, genealogy, created_at')
                .limit(100); // Verify limits for production

            if (data) {
                // Initialize positions randomly but centered
                const nodes = data.map(d => ({
                    ...d,
                    x: Math.random() * 800 + 100,
                    y: Math.random() * 600 + 100,
                    vx: 0,
                    vy: 0
                })) as CrystalNode[];
                setCrystals(nodes);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    // 2. Physics Engine (Custom Force Directed Simulation)
    useEffect(() => {
        if (loading || crystals.length === 0) return;

        const simulate = () => {
            setCrystals(prevNodes => {
                const nodes = [...prevNodes];
                const width = 1200; // Virtual canvas size
                const height = 800;

                // Constants
                const REPULSION = 800;
                const ATTRACTION = 0.05;
                const CENTER_GRAVITY = 0.005;
                const DAMPING = 0.85;

                for (let i = 0; i < nodes.length; i++) {
                    const nodeA = nodes[i];
                    let fx = 0;
                    let fy = 0;

                    // I. Center Gravity (Keep them on screen)
                    fx += (width / 2 - nodeA.x) * CENTER_GRAVITY;
                    fy += (height / 2 - nodeA.y) * CENTER_GRAVITY;

                    // II. Repulsion (Nodes push apart)
                    for (let j = 0; j < nodes.length; j++) {
                        if (i === j) continue;
                        const nodeB = nodes[j];
                        const dx = nodeA.x - nodeB.x;
                        const dy = nodeA.y - nodeB.y;
                        const distSq = dx * dx + dy * dy;
                        const dist = Math.sqrt(distSq) || 1;

                        if (dist < 400) {
                            const force = REPULSION / distSq;
                            fx += (dx / dist) * force;
                            fy += (dy / dist) * force;
                        }
                    }

                    // III. Attraction (Synapses pull together)
                    if (nodeA.synapses) {
                        nodeA.synapses.forEach(syn => {
                            const targetNode = nodes.find(n => n.context_id === syn.target);
                            if (targetNode) {
                                const dx = targetNode.x - nodeA.x;
                                const dy = targetNode.y - nodeA.y;
                                fx += dx * ATTRACTION * syn.strength;
                                fy += dy * ATTRACTION * syn.strength;
                            }
                        });
                    }
                    if (nodeA.genealogy?.parents) {
                        nodeA.genealogy.parents.forEach(pid => {
                            const parentNode = nodes.find(n => n.context_id === pid);
                            if (parentNode) {
                                const dx = parentNode.x - nodeA.x;
                                const dy = parentNode.y - nodeA.y;
                                fx += dx * ATTRACTION * 1.2; // Strong lineage pull
                                fy += dy * ATTRACTION * 1.2;
                            }
                        });
                    }

                    nodeA.vx = (nodeA.vx + fx) * DAMPING;
                    nodeA.vy = (nodeA.vy + fy) * DAMPING;
                    nodeA.x += nodeA.vx;
                    nodeA.y += nodeA.vy;
                }
                return nodes;
            });

            animationRef.current = requestAnimationFrame(simulate);
        };

        if (viewMode === 'neural') {
            simulate();
        } else {
            // Genealogy Mode: Tree Structure Layout
            // (Simplified tree sorting for demo)
            setCrystals(prev => {
                const sorted = [...prev].sort((a, b) =>
                    (a.genealogy?.generation || 0) - (b.genealogy?.generation || 0)
                );
                return sorted.map((node, i) => ({
                    ...node,
                    x: 600 + (Math.random() * 100 - 50), // Center column ish
                    y: 100 + (node.genealogy?.generation || 0) * 150 + (i % 5) * 50 // Hierarchy down
                }));
            });
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [crystals.length, viewMode, loading]);

    // 3. Visualization
    return (
        <div className="h-screen bg-[#020202] text-white overflow-hidden flex relative">

            {/* HUD / Controls */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-64">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                        <Network size={20} className="text-cyan-400" />
                        THE CORTEX
                    </h1>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                        Active Neurons: {crystals.length}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('neural')}
                        className={`p-3 rounded-xl border transition-all ${viewMode === 'neural' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-white/40 hover:text-white'}`}
                        title="Neural Web Mode"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('genealogy')}
                        className={`p-3 rounded-xl border transition-all ${viewMode === 'genealogy' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-black/40 border-white/10 text-white/40 hover:text-white'}`}
                        title="Fractal Genealogy Mode"
                    >
                        <GitBranch size={18} />
                    </button>
                </div>
            </div>

            {/* Main Viz Area */}
            <motion.div
                className="flex-1 relative cursor-move"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <svg
                    ref={svgRef}
                    className="w-full h-full"
                    viewBox={`0 0 1200 800`}
                >
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Connections */}
                    {crystals.map(node => (
                        <g key={`links-${node.context_id}`}>
                            {node.synapses?.map((syn, i) => {
                                const target = crystals.find(n => n.context_id === syn.target);
                                if (!target) return null;
                                return (
                                    <motion.line
                                        key={`${node.context_id}-${target.context_id}`}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={target.x}
                                        y2={target.y}
                                        stroke={syn.type === 'CONTRADICTS' ? '#ff4d4d' : 'rgba(0, 242, 255, 0.2)'}
                                        strokeWidth={syn.strength || 1}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                    />
                                );
                            })}
                            {/* Lineage Links */}
                            {node.genealogy?.parents?.map(pid => {
                                const parent = crystals.find(n => n.context_id === pid);
                                if (!parent) return null;
                                return (
                                    <line
                                        key={`gen-${node.context_id}-${parent.context_id}`}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={parent.x}
                                        y2={parent.y}
                                        stroke="rgba(168, 85, 247, 0.4)"
                                        strokeWidth={2}
                                        strokeDasharray="4 4"
                                    />
                                );
                            })}
                        </g>
                    ))}

                    {/* Nodes */}
                    {crystals.map(node => (
                        <g
                            key={node.context_id}
                            onClick={() => setSelectedNode(node)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            {/* Glow halo */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={
                                    (node.genealogy?.generation === 0 ? 12 : 6) +
                                    (selectedNode?.context_id === node.context_id ? 10 : 0)
                                }
                                fill={
                                    node.genealogy?.generation === 0 ? 'rgba(0, 242, 255, 0.1)' :
                                        'rgba(168, 85, 247, 0.1)'
                                }
                                filter="url(#glow)"
                            />

                            {/* Core */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={node.genealogy?.generation === 0 ? 6 : 3}
                                fill={
                                    node.genealogy?.generation === 0 ? '#00f2ff' : // Genesis = Cyan
                                        '#a855f7' // Evolutions = Purple
                                }
                            />

                            {/* Label (Only on hover or global setting) */}
                            {selectedNode?.context_id === node.context_id && (
                                <text
                                    x={node.x}
                                    y={node.y - 15}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="10"
                                    fontFamily="sans-serif"
                                    className="uppercase tracking-wider font-bold"
                                >
                                    {node.intent.primary.substring(0, 20)}...
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Info Panel */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="absolute right-0 top-0 h-full w-80 bg-black/60 backdrop-blur-2xl border-l border-white/10 p-6 overflow-y-auto"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                <Database size={20} className="text-white" />
                            </div>
                            <button onClick={() => setSelectedNode(null)} className="text-white/40 hover:text-white">x</button>
                        </div>

                        <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                            {selectedNode.domain}
                        </h2>
                        <p className="text-sm text-white/70 leading-relaxed mb-6">
                            {selectedNode.intent.primary}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="text-[10px] uppercase text-white/40 block">Generation</span>
                                <span className="text-lg font-mono text-purple-400">
                                    Gen {selectedNode.genealogy?.generation || 0}
                                </span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="text-[10px] uppercase text-white/40 block">Synapses</span>
                                <span className="text-lg font-mono text-cyan-400">
                                    {selectedNode.synapses?.length || 0}
                                </span>
                            </div>
                        </div>

                        {/* Synaptic List */}
                        <h3 className="text-xs font-bold uppercase text-white/40 mb-3 tracking-widest flex items-center gap-2">
                            <Zap size={12} /> Synaptic Connections
                        </h3>
                        <div className="space-y-2">
                            {selectedNode.synapses?.map((syn, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <span className="text-xs text-white/60">{syn.type}</span>
                                    <span className="text-[10px] font-mono text-cyan-500/80">{(syn.strength * 100).toFixed()}% Strength</span>
                                </div>
                            )) || <p className="text-xs text-white/20 italic">No synaptic connections yet.</p>}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
