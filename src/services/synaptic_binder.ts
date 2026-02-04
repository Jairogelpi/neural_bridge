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

        // 2. Discover Autonomous Synapses (Semantic & Logical Neighbors)
        const semanticSynapses = await this.discoverSemanticSynapses(crystal);
        const logicalSynapses = await this.discoverPredicateSynapses(crystal);

        // 3. Merge new synapses into the crystal
        const allNewSynapses = [...semanticSynapses, ...logicalSynapses];
        const existingSynapses = crystal.synapses || [];

        // Avoid duplicates (Prefer higher strength)
        const merged = new Map<string, any>();
        existingSynapses.forEach(s => merged.set(s.target, s));
        allNewSynapses.forEach(s => {
            const existing = merged.get(s.target);
            if (!existing || s.strength > existing.strength) {
                merged.set(s.target, s);
            }
        });

        crystal.synapses = Array.from(merged.values());

        console.log(`[SynapticBinder] 🧬 Formed ${allNewSynapses.length} new synaptic connections.`);
        return crystal;
    }

    /**
     * Fractalize: Create a child crystal from a parent, preserving lineage.
     */
    static async fractalize(parent: Crystal, newContent: string, mutationType: 'REFINEMENT' | 'BRANCH'): Promise<Crystal> {
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
        console.log(`[SynapticBinder] 🔎 Scanning Talamic Index for semantic neighbors...`);

        const queryText = crystal.intent.primary || "";
        if (!queryText) return [];

        const neighbors = await TalamicIndex.search(queryText, 3);
        const synapses: NonNullable<Crystal['synapses']> = [];

        for (const neighbor of neighbors) {
            if (neighbor.node.metadata.source_id.includes(crystal.context_id)) continue;

            const neighborId = neighbor.node.metadata.source_id;
            if (neighborId) {
                synapses.push({
                    target: neighborId,
                    type: 'RELATED_TO',
                    strength: neighbor.score,
                    discovered_at: new Date().toISOString(),
                    justification: `Semantic vector proximity detected by Talamic Index (${(neighbor.score * 100).toFixed(1)}%)`
                });
            }
        }

        return synapses;
    }

    /**
     * Logical Predicate Matching: SPO Triple overlap discovery.
     */
    private static async discoverPredicateSynapses(crystal: Crystal): Promise<NonNullable<Crystal['synapses']>> {
        if (!crystal.raw_toon) return [];

        const { ToonService } = await import('../lib/toon');
        const toon = ToonService.parse(crystal.raw_toon);
        const synapses: NonNullable<Crystal['synapses']> = [];

        for (const rel of toon.graph) {
            const predicateBucket = `pred_${rel.subject}_${rel.predicate}_${rel.object}`;
            // @ts-ignore
            const candidateIds = TalamicIndex.spatialIndex.get(predicateBucket);

            if (candidateIds) {
                candidateIds.forEach((nodeId: string) => {
                    const node = TalamicIndex.atlas.get(nodeId);
                    if (node && !node.metadata.source_id.includes(crystal.context_id)) {
                        synapses.push({
                            target: node.metadata.source_id,
                            type: 'LOGICAL_OVERLAP',
                            strength: 1.0, // Truth is binary
                            discovered_at: new Date().toISOString(),
                            justification: `Deterministic TOON Overlap: shared predicate ([${rel.subject}] -[${rel.predicate}]-> [${rel.object}])`
                        });
                    }
                });
            }
        }

        return synapses;
    }
}
