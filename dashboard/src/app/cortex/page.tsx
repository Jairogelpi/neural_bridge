"use client";

import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Sidebar } from '@/components/Sidebar';
import { ZoomIn, ZoomOut, Share2, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CortexPage() {
    const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
    const graphRef = useRef<any>(null);

    const fetchGraph = async () => {
        const { data: crystals } = await supabase
            .from('crystals')
            .select('context_id, domain, author, intent');

        if (crystals) {
            // Transform Crystals into Nodes
            const nodes = crystals.map(c => ({
                id: c.context_id,
                group: c.domain === 'CORE_TRUTH' ? 1 : 2,
                label: c.domain,
                val: c.author?.reputation || 1
            }));

            // Create implicit links based on shared domains or intent similarity (naive simulation for now)
            // In a full implementation, we would query a 'synapses' table.
            // For now, we link sequential crystals to form a time-chain and domain clusters.
            const links: any[] = [];
            for (let i = 0; i < nodes.length - 1; i++) {
                // Link temporal sequence
                links.push({ source: nodes[i].id, target: nodes[i + 1].id });

                // Link same group (domain) loosely
                const sameGroup = nodes.filter((n, idx) => idx > i && n.group === nodes[i].group).slice(0, 2);
                sameGroup.forEach(n => links.push({ source: nodes[i].id, target: n.id }));
            }

            // Remove duplicates and self-loops if any
            setGraphData({ nodes: nodes as any, links: links });
        }
    };

    useEffect(() => {
        fetchGraph();

        // Realtime updates
        const channel = supabase
            .channel('cortex_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'crystals' }, () => {
                fetchGraph();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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
                    <h1 className="text-5xl font-black italic tracking-tighter text-gray-900">CORTEX <span className="text-purple-600">GRAPH.</span></h1>
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 right-8 z-10 flex flex-col gap-2">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl shadow-xl hover:bg-gray-50 text-gray-600 hover:text-purple-600 transition-colors" onClick={() => fetchGraph()}>
                        <RefreshCcw size={20} />
                    </button>
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
                        nodeColor={node => (node as any).group === 1 ? '#06b6d4' : '#8b5cf6'}
                        linkColor={() => '#cbd5e1'}
                        backgroundColor="#f8fafc"
                        nodeLabel="label"
                        nodeRelSize={6}
                        linkWidth={1.5}
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
