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
                .select('context_id, domain, author, intent')
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
                label: c.domain,
                val: (generation + 1) * 2,
                details: c.intent?.primary
            };
        });

        const links: any[] = [];

        // 1. GENEALOGY LINKS (Implicit Fallback)
        for (let i = 0; i < nodes.length - 1; i++) {
            if (nodes[i].group === nodes[i + 1].group) {
                links.push({
                    source: nodes[i].id,
                    target: nodes[i + 1].id,
                    type: 'associative'
                });
            }
        }

        setGraphData({ nodes, links });
    }, [crystals]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex font-sans">
            <Sidebar />

            <main className="flex-1 md:ml-72 relative overflow-hidden h-screen bg-white">
                {/* Overlay Header */}
                <div className="absolute top-12 left-12 z-10 pointer-events-none">
                    <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 rounded-full mb-6 border border-indigo-100 shadow-xl shadow-indigo-500/5">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse mr-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">Live Synaptic Lattice</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tight text-slate-900 uppercase italic">
                        Omni_<span className="text-slate-200">Cortex.</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 ml-2 mt-4">Knowledge Topology Engine</p>
                </div>

                {/* Controls */}
                <div className="absolute bottom-12 right-12 z-10 flex flex-col gap-4">
                    <button className="p-4 bg-white border border-slate-100 rounded-[2rem] text-slate-400 hover:text-indigo-600 hover:shadow-2xl transition-all shadow-xl shadow-slate-200/40" onClick={() => graphRef.current?.zoomIn()}>
                        <ZoomIn size={20} />
                    </button>
                    <button className="p-4 bg-white border border-slate-100 rounded-[2rem] text-slate-400 hover:text-indigo-600 hover:shadow-2xl transition-all shadow-xl shadow-slate-200/40" onClick={() => graphRef.current?.zoomOut()}>
                        <ZoomOut size={20} />
                    </button>
                    <button className="p-5 bg-indigo-600 border border-indigo-500 rounded-[2rem] text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="w-full h-full">
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        nodeColor={node => {
                            const colors = ['#6366f1', '#4f46e5', '#818cf8', '#312e81', '#1e1b4b'];
                            return colors[(node as any).group % colors.length];
                        }}
                        linkColor={() => 'rgba(226, 232, 240, 0.4)'}
                        backgroundColor="transparent"
                        nodeLabel="label"
                        nodeRelSize={7}
                        linkWidth={1.5}
                        enableNodeDrag={true}
                        d3VelocityDecay={0.4}
                        onEngineStop={() => graphRef.current?.zoomToFit(400)}
                    />
                </div>
            </main>
        </div>
    );
}
