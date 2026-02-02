
import { Hypervector } from '../math/hypervector';
import type { Crystal } from '../types/crystal_format';
import { SemanticHasher } from './semantic_hashing';

/**
 * SEMANTIC ENTROPY AUDIT (The Noise Filter) 🛡️
 * 
 * Goal: Mathematically calculate the "Information Gain" vs "Semantic Noise"
 * of a Crystal relative to a query. This ensures we only inject context
 * that strengthens the "Gravity Well" of the truth.
 */
export class EntropyAudit {

    /**
     * Calculates the Signal-to-Noise Ratio (SNR) of a set of candidates.
     * Returns the "Minimum Sufficient Set" (MSS) of Crystals.
     */
    static audit(query: string, candidates: Crystal[], threshold: number = 0.6): Crystal[] {
        if (candidates.length === 0) return [];

        const queryVec = SemanticHasher.computeSimHash(query);
        const queryHv = Hypervector.fromString(queryVec);

        // 1. Calculate Individual Entropy (Information Gain)
        const audited = candidates.map(c => {
            const crystalHv = Hypervector.fromString(c.verification?.canonical_hash || '');
            const similarity = queryHv.similarity(crystalHv);

            // SNR Calculation: 
            // In HDC, similarity > 0.5 is Signal. Similarity ~0.5 is Noise (Orthogonal).
            // We normalize to a 0.0 - 1.0 range where 0.5 is the noise floor.
            const snr = Math.max(0, (similarity - 0.5) * 2);

            return { crystal: c, snr };
        });

        // 2. Natural Selection: Culling the Noise
        // We filter out any crystal that doesn't meet the SNR threshold
        // This prevents "Context Poisoning" (the competitor's weakness)
        const signal = audited.filter(a => a.snr >= (threshold - 0.5) * 2);

        // 3. Sort by SNR (Best Signal First)
        return signal
            .sort((a, b) => b.snr - a.snr)
            .map(a => a.crystal);
    }

    /**
     * Measures the "Semantic Drift" potential of a context package.
     * High entropy = high hallucination risk.
     */
    static calculateDriftRisk(query: string, context: Crystal[]): number {
        if (context.length === 0) return 1.0;

        const queryVec = Hypervector.fromString(SemanticHasher.computeSimHash(query));
        let totalSim = 0;

        for (const c of context) {
            const h = Hypervector.fromString(c.verification?.canonical_hash || '');
            totalSim += queryVec.similarity(h);
        }

        const avgSim = totalSim / context.length;
        // Risk is high if average similarity is near the 0.5 noise floor
        return Math.max(0, 1.0 - ((avgSim - 0.5) * 2));
    }
}
