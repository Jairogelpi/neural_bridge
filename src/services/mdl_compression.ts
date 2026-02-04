// MDL-Based Intelligent Compression
// Finds the Minimum Description Length - the smallest core that maintains counterfactual pass rate

import type { Crystal, SemanticInvariant } from '../types/crystal_format';

export interface CompressionResult {
    original_tokens: number;
    compressed_tokens: number;
    compression_ratio: number;
    removed_invariants: string[];
    core_invariants: string[];
    counterfactual_pass_rate: number;
    mdl_score: number; // Lower is better
}

export interface AblationTestResult {
    invariant_id: string;
    impact_on_score: number;
    essential: boolean;
}

/**
 * MDL-based Crystal compression
 * Removes invariants until counterfactual pass rate drops below threshold
 */
export async function compressCrystalMDL(params: {
    crystal: Crystal;
    invariants: SemanticInvariant[];
    verifier: (invariants: SemanticInvariant[]) => Promise<{ score: number }>;
    min_pass_rate?: number;
}): Promise<CompressionResult> {
    const { crystal, invariants, verifier, min_pass_rate = 0.85 } = params;

    // Start with all invariants
    let current_invariants = [...invariants];
    const removed: string[] = [];

    // Baseline: test with all invariants
    const baseline = await verifier(current_invariants);
    const baseline_score = baseline.score;

    console.log(`[MDL Compression] Baseline score: ${baseline_score.toFixed(3)} with ${current_invariants.length} invariants`);

    // Ablation: remove invariants one by one
    const ablation_results: AblationTestResult[] = [];

    for (const inv of invariants) {
        // Test without this invariant
        const test_set = current_invariants.filter(i => i.id !== inv.id);
        const result = await verifier(test_set);

        const impact = baseline_score - result.score;
        const essential = result.score < min_pass_rate;

        ablation_results.push({
            invariant_id: inv.id,
            impact_on_score: impact,
            essential
        });

        // If removing this invariant doesn't hurt score, mark for removal
        if (!essential && result.score >= min_pass_rate) {
            removed.push(inv.id);
            current_invariants = test_set;
            console.log(`[MDL Compression] Removed ${inv.id}, score: ${result.score.toFixed(3)}`);
        }
    }

    // Calculate final metrics
    const original_tokens = estimateTokens(JSON.stringify(crystal));

    // 3. [TOON] Prune the Truth Manifold
    let compressedToon = crystal.raw_toon;
    if (crystal.raw_toon) {
        try {
            const { ToonService } = await import('../../dashboard/src/lib/toon');
            const toon = ToonService.parse(crystal.raw_toon);

            // Heuristic: remove predicates where subject/object are not in core entities/constraints
            const entities = crystal.entities || [];
            const coreValues = new Set([
                ...entities.map(e => e.name.toLowerCase()),
                ...(crystal.constraints || []).map(c => c.value.toLowerCase())
            ]);

            const prunedGraph = (toon.graph || []).filter((rel: any) =>
                coreValues.has(rel.subject.toLowerCase()) || coreValues.has(rel.object.toLowerCase())
            );

            compressedToon = ToonService.stringify({
                ...toon,
                graph: prunedGraph
            });
        } catch (e) {
            // Non-critical
        }
    }

    const compressed_crystal = {
        ...crystal,
        raw_toon: compressedToon,
        verification: {
            ...crystal.verification,
            semantic_invariants: current_invariants
        }
    };
    const compressed_tokens = estimateTokens(JSON.stringify(compressed_crystal));

    const final_result = await verifier(current_invariants);

    return {
        original_tokens,
        compressed_tokens,
        compression_ratio: compressed_tokens / original_tokens,
        removed_invariants: removed,
        core_invariants: current_invariants.map((i: SemanticInvariant) => i.id),
        counterfactual_pass_rate: final_result.score,
        mdl_score: compressed_tokens + (1 - final_result.score) * 1000 // Penalty for lost accuracy
    };
}

/**
 * Find the absolute minimum core that maintains counterfactual pass rate
 * Uses greedy algorithm to aggressively remove non-essential invariants
 */
export async function findMinimalCore(params: {
    crystal: Crystal;
    invariants: SemanticInvariant[];
    verifier: (invariants: SemanticInvariant[]) => Promise<{ score: number }>;
    target_pass_rate: number;
}): Promise<{
    core: SemanticInvariant[];
    compression_ratio: number;
    pass_rate: number;
}> {
    const { crystal, invariants, verifier, target_pass_rate } = params;

    // Sort invariants by importance (heuristic: strict > non-strict, high weight > low weight)
    const sorted = [...invariants].sort((a, b) => {
        if (a.strict && !b.strict) return -1;
        if (!a.strict && b.strict) return 1;
        return (b.weight || 1) - (a.weight || 1);
    });

    let core = sorted;
    let best_core = core;
    let best_score = 0;

    // Greedy removal
    for (let i = sorted.length - 1; i >= 0; i--) {
        const candidate = core.slice(0, i);
        const result = await verifier(candidate);

        if (result.score >= target_pass_rate) {
            core = candidate;
            best_core = candidate;
            best_score = result.score;
        } else {
            // Stop when we can't remove more without dropping below threshold
            break;
        }
    }

    const original_tokens = estimateTokens(JSON.stringify({ invariants }));
    const core_tokens = estimateTokens(JSON.stringify({ invariants: best_core }));

    return {
        core: best_core,
        compression_ratio: core_tokens / original_tokens,
        pass_rate: best_score
    };
}

// Helper: estimate token count (rough approximation)
function estimateTokens(text: string): number {
    // Rough heuristic: ~4 characters per token on average
    return Math.ceil(text.length / 4);
}

export const MDL = {
    compressCrystalMDL,
    findMinimalCore
};
