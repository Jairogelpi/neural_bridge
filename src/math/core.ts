/**
 * IRREFUTABLE MATH CORE 📐
 * 
 * Pure mathematical implementations for semantic verification.
 * No mocks. No hallucinations. Just linear algebra and probability.
 */

import crypto from 'crypto';

export class MathCore {

    /**
     * Calculate Cosine Similarity between two text inputs.
     * Used to verify if the LLM's output matches the 'Truth Crystal' intent.
     * Range: [0, 1] (0 = Orthogonal/Unrelated, 1 = Identical)
     */
    static cosineSimilarity(textA: string, textB: string): number {
        const vecA = this.textToVector(textA);
        const vecB = this.textToVector(textB);
        return this.calculateCosine(vecA, vecB);
    }

    /**
     * Calculate Bayesian Confidence Score.
     * probability = (evidence / (evidence + error_margin))
     */
    static bayesianConfidence(evidenceCount: number, contradictions: number): number {
        // Laplace smoothing to avoid division by zero
        const alpha = 1;
        const beta = 1;
        return (evidenceCount + alpha) / (evidenceCount + contradictions + alpha + beta);
    }

    /**
     * Cryptographic Proof of Integrity (SHA-256).
     * Replaces random ID generation.
     */
    static sha256(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    // ════════════════════════════════════════════════════════════════════════
    // PRIVATE LINEAR ALGEBRA HELPERS
    // ════════════════════════════════════════════════════════════════════════

    private static textToVector(text: string): Map<string, number> {
        const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
        const vector = new Map<string, number>();
        words.forEach(word => {
            vector.set(word, (vector.get(word) || 0) + 1);
        });
        return vector;
    }

    private static calculateCosine(vecA: Map<string, number>, vecB: Map<string, number>): number {
        const intersection = new Set([...vecA.keys()].filter(x => vecB.has(x)));

        let dotProduct = 0;
        intersection.forEach(key => {
            dotProduct += (vecA.get(key) || 0) * (vecB.get(key) || 0);
        });

        const magnitudeA = Math.sqrt([...vecA.values()].reduce((acc, val) => acc + val * val, 0));
        const magnitudeB = Math.sqrt([...vecB.values()].reduce((acc, val) => acc + val * val, 0));

        if (magnitudeA === 0 || magnitudeB === 0) return 0;
        return dotProduct / (magnitudeA * magnitudeB);
    }
}
