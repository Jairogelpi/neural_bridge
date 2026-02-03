"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });
import { Sidebar } from '@/components/Sidebar';
import { ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePagination, useInfiniteScroll } from '@/hooks/usePagination';

const PAGE_SIZE = 100; // Load 100 crystals at a time

export default function CortexPage() {
    const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
    const graphRef = useRef<any>(null);

    // Lazy loading pagination
    const {
        data: crystals,
        loading,
        hasMore,
        loadMore
    } = usePagination({
        fetchPage: async (page, pageSize) => {
            const { data } = await supabase
                .from('crystals')
                .select('context_id, domain, author, intent, metadata')
                .range(page * pageSize, (page + 1) * pageSize - 1)
                .order('created_at', { ascending: false });

            return data || [];
        },
        pageSize: PAGE_SIZE
    });

    // Infinite scroll
    useInfiniteScroll(loadMore, { enabled: hasMore && !loading });

    // Build graph from crystals
    useEffect(() => {
        if (!crystals || crystals.length === 0) return;

        // Transform Crystals into Nodes
        const nodes = crystals.map((c: any) => {
            const generation = c.metadata?.genealogy?.generation || 0;
            return {
                id: c.context_id,
                group: generation,
                label: `[Layer ${generation}] ${c.domain}`,
                val: (generation + 1) * 2, // Bigger nodes for higher generations
                details: c.intent?.primary
            };
        });

        const links: any[] = [];

        // 1. GENEALOGY LINKS (The Fractal Backbone)
        crystals.forEach((c: any) => {
            if (c.metadata?.genealogy?.parents) {
                c.metadata.genealogy.parents.forEach((parentId: string) => {
                    links.push({
                        source: parentId,
                        target: c.context_id,
                        type: 'genealogy'
                    });
                });
            }
        });

        // 2. TEMPORAL/DOMAIN LINKS (Implicit)
        for (let i = 0; i < nodes.length - 1; i++) {
            if (nodes[i].group === nodes[i + 1].group) {
                links.push({
                    source: nodes[i].id,
                    target: nodes[i + 1].id,
                    type: 'temporal'
                });
            }
        }

        setGraphData({ nodes, links });
    }, [crystals]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 selection:text-white flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 relative overflow-hidden h-screen bg-[#050505]">
                {/* Overlay Header */}
                <div className="absolute top-12 left-12 z-10 pointer-events-none">
                    <div className="inline-flex items-center px-4 py-1.5 bg-indigo-500/10 backdrop-blur-3xl rounded-full mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse mr-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Live Synaptic Activity</span>
                    </div>
                    <h1 className="font-bebas text-8xl md:text-9xl italic leading-[0.8] text-white">
                        OMNI_<span className="text-white/20">CORTEX.</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mt-4">Multi-dimensional ontological mapping engine</p>
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 right-12 z-10 flex flex-col gap-3">
                    <button className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-3xl text-white/40 hover:text-indigo-400 hover:bg-white/10 transition-all shadow-2xl" onClick={() => graphRef.current?.zoomIn()}>
                        <ZoomIn size={20} />
                    </button>
                    <button className="p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-3xl text-white/40 hover:text-indigo-400 hover:bg-white/10 transition-all shadow-2xl" onClick={() => graphRef.current?.zoomOut()}>
                        <ZoomOut size={20} />
                    </button>
                    <button className="p-4 bg-indigo-500 border border-indigo-400 rounded-2xl text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-110 active:scale-95 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="w-full h-full">
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        nodeColor={node => {
                            const colors = ['#6366f1', '#22d3ee', '#8b5cf6', '#ec4899', '#10b981'];
                            return colors[(node as any).group % colors.length];
                        }}
                        linkColor={link => (link as any).type === 'genealogy' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)'}
                        backgroundColor="#050505"
                        nodeLabel="label"
                        nodeRelSize={6}
                        linkWidth={link => (link as any).type === 'genealogy' ? 2 : 1}
                        enableNodeDrag={false}
                        d3VelocityDecay={0.6}
                        cooldownTicks={100}
                        onEngineStop={() => graphRef.current?.zoomToFit(400)}
                    />
                </div>
            </main>
        </div>
    );
}
