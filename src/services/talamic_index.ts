
import { Hypervector } from '../math/hypervector';
import { SemanticHasher } from './semantic_hashing';

export interface AtlasNode {
    id: string;
    vector: Hypervector;
    metadata: {
        source_id: string;
        preview: string;
        domain: string;
        is_crystallized: boolean;
    };
}

const ATLAS_STORAGE_KEY = "nb_talamic_atlas_v1";

/**
 * TALAMIC INDEX (The Holographic Atlas) 🪐📐
 * 
 * Capability: Massive-scale ingestion.
 * Unlike RAG, this doesn't store billions of vectors in a slow database.
 * it projects documents into a "Conceptual Manifold" using HDC.
 */
export class TalamicIndex {

    private static atlas: Map<string, AtlasNode> = new Map();
    private static spatialIndex: Map<string, Set<string>> = new Map(); // Bucket -> [Node IDs]
    private static isInitialized = false;

    /**
     * INITIALIZE: Loads the Atlas from persistent storage.
     */
    /**
     * INITIALIZE: Loads the Atlas from persistent storage.
     */
    static async initialize(): Promise<void> {
        if (this.isInitialized) return;

        console.log(`[TalamicIndex] 🧬 Initializing Holographic Atlas from Supabase...`);
        try {
            const { supabase } = await import('../db/supabase');

            // Fetch all active crystals to rebuild the memory manifold
            const { data: crystals, error } = await supabase
                .from('crystals')
                .select('*')
                .neq('intent->>status', 'deprecated'); // Only active ones

            if (error) {
                console.error("[TalamicIndex] ❌ Failed to fetch crystals:", error);
                return;
            }

            if (crystals && crystals.length > 0) {
                console.log(`[TalamicIndex] 📥 Hydrating ${crystals.length} crystals...`);

                for (const record of crystals) {
                    // Re-project into HDC space
                    // Ideally we should store the vector hash to avoid re-computing, 
                    // but re-computing ensures algorithm updates propagate.
                    const text = record.intent?.primary || record.description || "";
                    if (text) {
                        await this.ingest(text, record.context_id, record.domain || 'general');
                    }
                }
            } else {
                console.log("[TalamicIndex] ℹ️ No existing crystals found. Starting fresh.");
            }

            this.isInitialized = true;
            console.log(`[TalamicIndex] ✅ Atlas is fully hydrated and ready.`);
        } catch (e) {
            console.error("[TalamicIndex] ❌ Initialization critical failure:", e);
        }
    }

    /**
     * INGEST: Projects text into the Geometric Atlas.
     */
    static async ingest(text: string, sourceId: string, domain: string): Promise<void> {
        const hash = SemanticHasher.computeHolographicHash(text);
        const hv = Hypervector.fromString(hash);
        const bucket = hv.getBucketHash();

        const node: AtlasNode = {
            id: TalamicIndex.generateSecureUUID(),
            vector: hv,
            metadata: {
                source_id: sourceId,
                preview: text.substring(0, 500),
                domain: domain,
                is_crystallized: false
            }
        };

        this.atlas.set(node.id, node);

        // Update Spatial Index (Locality Sensitive Hashing)
        if (!this.spatialIndex.has(bucket)) {
            this.spatialIndex.set(bucket, new Set());
        }
        this.spatialIndex.get(bucket)!.add(node.id);

        console.log(`[TalamicIndex] 🪐 Ingested node [${node.id}] into bucket [${bucket}]. Total Nodes: ${this.atlas.size}`);

        // PERSISTENCE SYNC (Omega)
        await this.syncToPersistentStorage(node);
    }

    /**
     * SYNC TO PERSISTENT STORAGE (The Infinite Cache)
     */
    private static async syncToPersistentStorage(node: AtlasNode): Promise<void> {
        try {
            const { supabase } = await import('../db/supabase');
            // Projecting AtlasNode into Supabase 'talamic_atlas' table
            const { error } = await supabase.from('crystals').upsert({
                context_id: `ATLAS_${node.id}`,
                domain: node.metadata.domain,
                tier: 'trusted',
                metadata: {
                    ...node.metadata,
                    is_atlas_node: true,
                    vector_hash: node.vector.toString()
                }
            });
            if (error) console.warn("[TalamicIndex] ⚠️ Persistence sync error:", error.message);
        } catch (e) {
            // Non-blocking
        }
    }

    /**
     * SEARCH: O(1) Retrieval via Spatial Hashing.
     */
    static async search(query: string, topK: number = 3): Promise<{ node: AtlasNode; score: number }[]> {
        const queryHash = SemanticHasher.computeHolographicHash(query);
        const queryHv = Hypervector.fromString(queryHash);
        const bucket = queryHv.getBucketHash();

        // 1. O(1) Bucket Access
        const candidateIds = this.spatialIndex.get(bucket);

        if (!candidateIds || candidateIds.size === 0) {
            // Fast fallback: if map is small, do full scan. If large, return empty.
            if (this.atlas.size < 20) {
                return Array.from(this.atlas.values())
                    .map(node => ({ node, score: queryHv.similarity(node.vector) }))
                    .filter(res => res.score > 0.45)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, topK);
            }
            return [];
        }

        // 2. Local Resonance Ranking
        const results = Array.from(candidateIds)
            .map(id => this.atlas.get(id)!)
            .filter(Boolean)
            .map(node => ({
                node,
                score: queryHv.similarity(node.vector)
            }))
            .filter(res => res.score > 0.45)
            .sort((a, b) => b.score - a.score);

        return results.slice(0, topK);
    }

    /**
     * MARK CRYSTALLIZED
     */
    static setCrystallized(nodeId: string) {
        const node = this.atlas.get(nodeId);
        if (node) node.metadata.is_crystallized = true;
    }

    static getAtlasSize(): number {
        return this.atlas.size;
    }

    private static generateSecureUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
