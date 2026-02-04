"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });
import { Sidebar } from '@/components/Sidebar';
import { ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ToonService } from '@/lib/toon';
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
                .select('context_id, domain, author:authors(name, handle), intent, raw_toon')
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
            const toon = ToonService.parse(c.raw_toon || '');
            const generation = toon.metadata?.generation || 0;
            const predicateCount = toon.graph?.length || 0;
            return {
                id: c.context_id,
                group: generation,
                label: `[Layer ${generation}] ${c.domain}\nTruth Density: ${predicateCount} Predicates\nLogic: ${toon.graph?.[0]?.predicate || 'Pending'}`,
                val: (generation + 1) * 2 + (predicateCount / 2), // Density affects gravity
                details: `[TOON-Verified] ${c.intent?.primary}`
            };
        });

        const links: any[] = [];

        // 1. GENEALOGY LINKS (The Fractal Backbone)
        crystals.forEach((c: any) => {
            const toon = ToonService.parse(c.raw_toon || '');

            // Fractal Parents
            if (toon.metadata?.parents) {
                toon.metadata.parents.split(',').forEach((parentId: string) => {
                    links.push({
                        source: parentId,
                        target: c.context_id,
                        type: 'genealogy'
                    });
                });
            }

            // Logic Synapses (Predicate-Aware)
            const synArray = (c as any).synapses || [];
            synArray.forEach((syn: any) => {
                if (syn.type === 'LOGICAL_OVERLAP') {
                    links.push({
                        source: c.context_id,
                        target: syn.target,
                        type: 'logic',
                        strength: syn.strength
                    });
                }
            });
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
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex">
            <Sidebar />

            <main className="flex-1 md:ml-64 relative overflow-hidden h-screen bg-gray-50">
                {/* Overlay Header */}
                <div className="absolute top-8 left-8 z-10 pointer-events-none">
                    <div className="inline-flex items-center px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full mb-4 border border-gray-200 shadow-lg shadow-gray-200/50">
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">Live Synaptic Activity</span>
                    </div>
                    <h1 className="text-5xl font-black italic tracking-tighter text-gray-900">MY BRAIN <span className="text-purple-600">MAP.</span></h1>
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-xl hover:bg-gray-50 text-gray-600 hover:text-purple-600 transition-colors" onClick={() => graphRef.current?.zoomIn()}>
                        <ZoomIn size={20} />
                    </button>
                    <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-xl hover:bg-gray-50 text-gray-600 hover:text-purple-600 transition-colors" onClick={() => graphRef.current?.zoomOut()}>
                        <ZoomOut size={20} />
                    </button>
                    <button className="p-3 bg-black border border-black rounded-xl shadow-xl hover:bg-gray-800 text-white transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="w-full h-full">
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        nodeColor={node => {
                            const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                            return colors[(node as any).group % colors.length];
                        }}
                        linkColor={link => {
                            const type = (link as any).type;
                            if (type === 'genealogy') return '#8b5cf6'; // Purple backbone
                            if (type === 'logic') return '#10b981'; // Green logic synapse
                            return '#cbd5e1'; // Grey temporal
                        }}
                        linkWidth={link => (link as any).type === 'logic' ? 3 : 1.5}
                        linkDirectionalParticles={link => (link as any).type === 'logic' ? 4 : 0}
                        linkDirectionalParticleSpeed={0.01}
                        backgroundColor="#f8fafc"
                        nodeLabel="label"
                        nodeRelSize={6}
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
