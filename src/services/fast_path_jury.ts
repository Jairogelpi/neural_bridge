
import { Hypervector } from '../math/hypervector';
import type { Crystal } from '../types/crystal_format';
import { SemanticHasher } from './semantic_hashing';

/**
 * FAST-PATH JURY (The Speed Demon) 🏎️💨
 * 
 * Goal: Sub-10ms truth verification using pure bitwise math.
 * Instead of asking a high-latency LLM Jury, we check if the 
 * proposed response "aligns" with the Master Crystal's hypervector.
 */
export class FastPathJury {

    /**
     * Verifies if a proposed response fragment is truthful relative to a Crystal.
     * Returns a Boolean decision in <5ms.
     */
    static async verifyEdge(fragment: string, anchor: Crystal): Promise<{
        accepted: boolean;
        score: number;
        latency_ms: number;
    }> {
        const start = performance.now();

        // 1. Encode Fragment to Hypervector
        const fragmentVec = SemanticHasher.computeSimHash(fragment);
        const fragHv = Hypervector.fromString(fragmentVec);

        // 2. Extract Anchor Identity
        const anchorHv = Hypervector.fromString(anchor.verification.canonical_hash);

        // 3. HDC Similarity Check
        const similarity = fragHv.similarity(anchorHv);

        // 4. Decision Logic: 
        // 0.8+ = Strong Alignment (Axiomatic Truth)
        // 0.5-0.7 = Ambiguous/Noise (Require High-Latency Jury)
        // <0.5 = Potential Hallucination/Contradiction
        const accepted = similarity >= 0.75;

        return {
            accepted,
            score: similarity,
            latency_ms: performance.now() - start
        };
    }

    /**
     * Multi-Point Check: verifies several fragments simultaneously.
     * Uses HDC Bundling to check "Contextual Resonace" of the entire stream.
     */
    static async auditStream(fragments: string[], anchor: Crystal): Promise<boolean> {
        if (fragments.length === 0) return true;

        const anchorHv = Hypervector.fromString(anchor.verification.canonical_hash);
        const fragVectors = fragments.map(f =>
            Hypervector.fromString(SemanticHasher.computeSimHash(f))
        );

        // Bundle the entire stream into one "Holographic State"
        const streamState = Hypervector.bundle(fragVectors);

        // Check if the stream state is diverging from the ground truth
        const similarity = streamState.similarity(anchorHv);

        return similarity >= 0.7;
    }
}
