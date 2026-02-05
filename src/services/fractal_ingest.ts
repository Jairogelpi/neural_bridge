
import { CrystallizationService } from './crystallization';
import { type Crystal } from '../types/crystal_format';
import { supabase } from '../db/supabase';

export interface IngestProgress {
    totalChunks: number;
    processedChunks: number;
    status: string;
}

/**
 * FRACTAL INGEST SERVICE 🌀
 * 
 * Outperforms classic LLM context windows (1M tokens) by transforming 
 * massive data into a persistent, navigable, holographic Knowledge Tree.
 */
export class FractalIngestService {

    /**
     * Ingest a large corpus of text fractally.
     */
    static async ingest(
        text: string,
        domain: string = 'general',
        onProgress?: (p: IngestProgress) => void
    ): Promise<string> {
        console.log(`[FractalIngest] 🌀 Starting Fractal Synthesis for ${text.length} characters...`);

        // 1. CHUNKING (Generation 0 - Atomic Reality)
        const chunkSize = 1500; // Optimal for high-density crystals
        const chunks: string[] = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, i + chunkSize));
        }

        if (onProgress) onProgress({ totalChunks: chunks.length, processedChunks: 0, status: 'Atomic Mining' });

        // 2. MINT ATOMIC CRYSTALS (PARALLEL BATCHES) ⚡
        const atomicCrystals: Crystal[] = [];
        const BATCH_SIZE = 10; // Process 10 chunks in parallel

        const { CrystallizationService } = await import('./crystallization');

        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);

            // Parallel crystallization using Flash tier (instant)
            const batchCrystals = await Promise.all(
                batch.map(async (chunk, idx) => {
                    const crystal = await CrystallizationService.crystallize(chunk, {
                        tier: 'flash', // Instant math-based crystallization
                        domain,
                        autoUpgrade: true // Upgrade to Deep in background
                    });

                    crystal.genealogy = { generation: 0, parents: [] };
                    crystal.tags = (crystal.tags || []).concat([
                        'fractal_layer:0',
                        `source_index:${i + idx}`,
                        'parallel_batch:true'
                    ]);

                    return crystal;
                })
            );

            // Persist batch
            for (const crystal of batchCrystals) {
                await this.persist(crystal);
                atomicCrystals.push(crystal);
            }

            if (onProgress) onProgress({
                totalChunks: chunks.length,
                processedChunks: i + batch.length,
                status: `Mining Layer 0: ${i + batch.length}/${chunks.length} (${BATCH_SIZE} parallel)`
            });
        }

        // 3. RECURSIVE SYNTHESIS (Generation 1+)
        let currentLayer = atomicCrystals;
        let generation = 1;

        while (currentLayer.length > 1) {
            const nextLayer: Crystal[] = [];
            const groupSize = 5; // Every 5 crystals form a parent

            for (let i = 0; i < currentLayer.length; i += groupSize) {
                const group = currentLayer.slice(i, i + groupSize);
                const parentText = group.map(c => c.intent.primary + ": " + (c.constraints?.map(con => con.value).join(', ') || '')).join('\n\n');

                const { CrystallizationService } = await import('./crystallization');

                // Use Smart Crystallization for parent nodes (fast but good quality)
                const parentCrystal = await CrystallizationService.crystallize(parentText, {
                    tier: 'smart', // Fast AI-based synthesis
                    domain: domain,
                    autoUpgrade: true // Will upgrade to Deep in background
                });

                parentCrystal.genealogy = {
                    generation: generation,
                    parents: group.map(c => c.context_id)
                };
                parentCrystal.tags = (parentCrystal.tags || []).concat([`fractal_layer:${generation}`]);

                await this.persist(parentCrystal);
                nextLayer.push(parentCrystal);

                if (onProgress) onProgress({
                    totalChunks: -1,
                    processedChunks: generation,
                    status: `Synthesizing Layer ${generation}: ${nextLayer.length} meta-nodes`
                });
            }
            currentLayer = nextLayer;
            generation++;
        }

        const rootId = currentLayer[0]?.context_id || '';
        console.log(`[FractalIngest] ✅ Fractal Ingest Complete. Root Crystal: ${rootId}`);
        return rootId;
    }

    /**
     * Persist Crystal to Supabase.
     */
    private static async persist(crystal: Crystal) {
        // Map to DB Schema
        const { error } = await supabase.from('crystals').insert({
            context_id: crystal.context_id,
            domain: crystal.domain,
            intent: crystal.intent,
            author: crystal.author,
            constraints: crystal.constraints,
            created_at: crystal.created_at,
            origin_app: 'FRACTAL_INGEST_ENGINE',
            metadata: {
                genealogy: crystal.genealogy,
                tags: crystal.tags
            }
        });

        if (error) {
            console.error(`[FractalIngest] ❌ Failed to persist crystal ${crystal.context_id}:`, error);
        }
    }
}
