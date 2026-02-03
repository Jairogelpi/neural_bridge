import { Crystal } from '../types/crystal_format';
import { supabase } from '../db/supabase';
import { TalamicIndex } from './talamic_index'; // For semantic similarity

export class SynapticBinder {

    /**
     * Main entry point: Bind a new crystal to the existing manifold.
     * Discovers parents, siblings, and semantic kin.
     */
    static async bind(crystal: Crystal): Promise<Crystal> {
        console.log(`[SynapticBinder] 🕸️ Binding Crystal ${crystal.context_id} to the Cortex...`);

        // 1. Identify explicitly defined parents (Genealogy)
        // (Already present if passed in via refinement, but we verify them)

        // 2. Discover Autonomous Synapses (Semantic Neighbors)
        const semanticSynapses = await this.discoverSemanticSynapses(crystal);

        // 3. Merge new synapses into the crystal
        const existingSynapses = crystal.synapses || [];
        // Avoid duplicates
        const newUniqueSynapses = semanticSynapses.filter(
            newSyn => !existingSynapses.some(existing => existing.target === newSyn.target)
        );

        crystal.synapses = [...existingSynapses, ...newUniqueSynapses];

        console.log(`[SynapticBinder] 🧬 Formed ${newUniqueSynapses.length} new synaptic connections.`);
        return crystal;
    }

    /**
     * Fractalize: Create a child crystal from a parent, preserving lineage.
     */
    static async fractalize(parent: Crystal, newContent: string, mutationType: 'REFINEMENT' | 'BRANCH'): Promise<Crystal> {
        // Implement logic to create a new crystal that points to 'parent' as its ancestor
        // This is a helper for the Refinement Engine

        // Setup basic structure (mocking the ID generation for now)
        const childId = `cx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        const child: Crystal = {
            ...parent, // Inherit most traits
            context_id: childId,
            created_at: new Date().toISOString(),
            // Update genealogy
            genealogy: {
                generation: (parent.genealogy?.generation || 0) + 1,
                parents: [...(parent.genealogy?.parents || []), parent.context_id],
                evolved_from: parent.context_id
            },
            // Clear old synapses (new crystal starts fresh but may rediscover them)
            synapses: [
                {
                    target: parent.context_id,
                    type: 'ORIGINATES_FROM',
                    strength: 1.0,
                    discovered_at: new Date().toISOString(),
                    justification: `Direct ${mutationType.toLowerCase()} of parent crystal.`
                }
            ],
            // Reset verification stats since content changed
            verification: {
                ...parent.verification,
                canonical_hash: '', // Needs re-hashing
                retroactive_vaccines: []
            }
        };

        return child;
    }

    /**
     * Uses HDC/Vector Search to find related crystals
     */
    private static async discoverSemanticSynapses(crystal: Crystal): Promise<NonNullable<Crystal['synapses']>> {
        console.log(`[SynapticBinder] 🔎 Scanning Talamic Index for related nodes...`);

        // 1. Get the semantic vector neighbors via Talamic Index
        // Using the crystal's primary intent as the search vector anchor
        // This returns { node: AtlasNode, score: number }[]
        const neighbors = await TalamicIndex.search(crystal.intent.primary || "", 3);

        const synapses: NonNullable<Crystal['synapses']> = [];

        for (const neighbor of neighbors) {
            // Self-check
            if (neighbor.node.metadata.source_id.includes(crystal.context_id)) continue;

            const neighborId = neighbor.node.metadata.source_id;

            // Note: TalamicIndex usually stores a single ID in source_id for simple ingest, 
            // but the metadata type definition might vary. Assuming string here based on usage.

            if (neighborId) {
                synapses.push({
                    target: neighborId,
                    type: 'RELATED_TO',
                    strength: neighbor.score, // Similarity score (0-1)
                    discovered_at: new Date().toISOString(),
                    justification: `Semantic vector proximity detected by Talamic Index (${(neighbor.score * 100).toFixed(1)}%)`
                });
            }
        }

        return synapses;
    }
}
