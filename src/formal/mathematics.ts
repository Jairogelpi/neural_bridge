// Semantic Distance and Embedding-Based Fidelity
// Mathematical foundation for SCP verification guarantees

import type { Expected, InvariantV2 } from "../retry/types";

/**
 * Calculate PAC bound for verification score
 * 
 * Theorem 2: If we test k invariants with score ≥ θ, then with probability ≥ 1-δ:
 * P(success) ≥ θ - √(ln(1/δ) / 2k)
 * 
 * @param observedScore - The observed invariant score (0-1)
 * @param numInvariants - Number of invariants tested (k)
 * @param confidence - Confidence level (1-δ), e.g., 0.95
 * @returns Lower bound on true success probability
 */
export function pacLowerBound(
    observedScore: number,
    numInvariants: number,
    confidence: number = 0.95
): number {
    const delta = 1 - confidence;
    const epsilon = Math.sqrt(Math.log(2 / delta) / (2 * numInvariants));
    return Math.max(0, observedScore - epsilon);
}

/**
 * Calculate confidence interval for fidelity score
 * 
 * @param score - Observed score (0-1)
 * @param k - Number of invariants
 * @param z - Z-score (1.96 for 95% CI)
 * @returns [lower, upper] bounds
 */
export function confidenceInterval(
    score: number,
    k: number,
    z: number = 1.96
): [number, number] {
    // Standard error assuming binomial distribution
    const sigma = Math.sqrt(score * (1 - score));
    const margin = z * sigma / Math.sqrt(k);

    return [
        Math.max(0, score - margin),
        Math.min(1, score + margin)
    ];
}

/**
 * Calculate optimal threshold based on cost tradeoff
 * 
 * Theorem 3: θ* = β / (α + β) where α = cost of false positive, β = cost of false negative
 * 
 * @param costFalsePositive - Cost of accepting when should reject (α)
 * @param costFalseNegative - Cost of rejecting when should accept (β)
 * @returns Optimal threshold
 */
export function optimalThreshold(
    costFalsePositive: number,
    costFalseNegative: number
): number {
    return costFalseNegative / (costFalsePositive + costFalseNegative);
}

/**
 * Calculate optimal number of ladder levels
 * 
 * Theorem 5: L* = ⌈log(1/δ) / log(1/(1-p₀))⌉
 * 
 * @param baseSuccessRate - Success rate at level 0 (p₀)
 * @param targetConfidence - Target probability of eventual success (1-δ)
 * @returns Optimal number of levels
 */
export function optimalLadderLevels(
    baseSuccessRate: number,
    targetConfidence: number = 0.95
): number {
    const delta = 1 - targetConfidence;
    const numerator = Math.log(1 / delta);
    const denominator = Math.log(1 / (1 - baseSuccessRate));
    return Math.ceil(numerator / denominator);
}

/**
 * Information content of Crystal (bits)
 * Approximation: tokens × log2(vocab_size)
 * 
 * @param crystalTokens - Number of tokens in crystal
 * @param vocabSize - Vocabulary size (default GPT-4: ~100k)
 */
export function crystalEntropy(
    crystalTokens: number,
    vocabSize: number = 100000
): number {
    return crystalTokens * Math.log2(vocabSize);
}

/**
 * Compression ratio relative to original conversation
 * 
 * @param originalTokens - Tokens in original conversation
 * @param crystalTokens - Tokens in crystal
 */
export function compressionRatio(
    originalTokens: number,
    crystalTokens: number
): number {
    return crystalTokens / originalTokens;
}

/**
 * Calculate semantic distance using cosine similarity
 * (To be used with actual embedding vectors)
 * 
 * @param vecA - Embedding vector A
 * @param vecB - Embedding vector B
 * @returns Semantic distance (0 = identical, 1 = orthogonal)
 */
export function semanticDistance(
    vecA: number[],
    vecB: number[]
): number {
    if (vecA.length !== vecB.length) {
        throw new Error("Vectors must have same dimension");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
        const valA = vecA[i]!;
        const valB = vecB[i]!;
        dotProduct += valA * valB;
        normA += valA * valA;
        normB += valB * valB;
    }

    const cosineSimilarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return 1 - cosineSimilarity; // Distance = 1 - similarity
}

/**
 * Verify that invariant score predicts fidelity within bounds
 * 
 * Theorem 4: d_semantic ≤ L * (1 - s) + ε
 * 
 * @param score - Invariant score
 * @param lipschitzConstant - Estimated L (typically 1-2)
 * @param epsilon - Noise floor (typically 0.05)
 * @returns Maximum expected semantic distance
 */
export function maxSemanticDistance(
    score: number,
    lipschitzConstant: number = 1.5,
    epsilon: number = 0.05
): number {
    return lipschitzConstant * (1 - score) + epsilon;
}

/**
 * Calculate invariant completeness score
 * 
 * A complete invariant set should cover all aspects:
 * - Facts (existence of key information)
 * - Constraints (rules that must hold)
 * - Boundaries (things to avoid)
 * - State (current progress/context)
 */
export function invariantCompleteness(invariants: InvariantV2[]): {
    completeness: number;
    coverage: Record<string, number>;
    missing: string[];
} {
    const requiredKinds = ["fact", "constraint", "boundary", "state", "objective", "preference"];
    const coverage: Record<string, number> = {};

    for (const kind of requiredKinds) {
        coverage[kind] = 0;
    }

    for (const inv of invariants) {
        const kind = inv.kind as string;
        if (kind && coverage[kind] !== undefined) {
            (coverage as any)[kind]++;
        }
    }

    const missing = requiredKinds.filter(k => coverage[k] === 0);
    const completeness = (requiredKinds.length - missing.length) / requiredKinds.length;

    return { completeness, coverage, missing };
}

/**
 * Calculate expected success rate for ladder level
 * 
 * Model: p_l = p₀ + Δp * l (linear improvement)
 */
export function ladderLevelSuccessRate(
    level: number,
    baseRate: number = 0.6,
    improvementPerLevel: number = 0.12
): number {
    return Math.min(0.99, baseRate + improvementPerLevel * level);
}

/**
 * Calculate expected cost for ladder level
 * 
 * Model: c_l = c₀ * (1 + μ)^l (exponential cost)
 */
export function ladderLevelCost(
    level: number,
    baseCost: number = 0.001, // USD
    costMultiplier: number = 0.5 // 50% increase per level
): number {
    return baseCost * Math.pow(1 + costMultiplier, level);
}

/**
 * Compute verification summary with formal guarantees
 */
export interface VerificationSummary {
    observedScore: number;
    numInvariants: number;
    pacLowerBound: number;
    confidenceInterval: [number, number];
    maxSemanticDistance: number;
    completeness: number;
    isProvablySound: boolean;
}

export function computeVerificationSummary(
    score: number,
    invariants: InvariantV2[],
    confidence: number = 0.95
): VerificationSummary {
    const k = invariants.length;
    const pacBound = pacLowerBound(score, k, confidence);
    const ci = confidenceInterval(score, k);
    const maxDist = maxSemanticDistance(score);
    const { completeness } = invariantCompleteness(invariants);

    return {
        observedScore: score,
        numInvariants: k,
        pacLowerBound: pacBound,
        confidenceInterval: ci,
        maxSemanticDistance: maxDist,
        completeness,
        // Sound if: high score, complete invariants, and PAC bound above threshold
        isProvablySound: pacBound >= 0.7 && completeness >= 0.5 && score >= 0.85
    };
}
