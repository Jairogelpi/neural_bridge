// Scientific Metrics Module - PAC-style Bounds & SRI
// Implements the scientific framework from the Neural Bridge Omega Technical Specification

export interface PACBounds {
    epsilon: number;          // PAC-style confidence bound
    delta: number;            // Confidence level (typically 0.05 for 95%)
    n: number;                // Number of invariants/samples
}

export interface SRIMetrics {
    raw_score: number;        // Base score from invariant verification
    pac_bounds: PACBounds;
    sri: number;              // Semantic Reliability Index = score * (1 - epsilon)
    fidelity_badge: string;    // Dynamic badge (e.g., 'PLATINUM', 'GOLD', 'FAIL')
    acceptance_status: 'ACCEPT' | 'FAIL' | 'NEEDS_REVIEW';
    statistical_context: {
        mean: number;
        std_dev: number;
        sample_size: number;
        risk_factor: number;
        threshold_applied: number;
    };
    reputation_impact?: number; // Change in author score
}

export interface KnowledgeABI {
    facts: AtomicFact[];
    constraints: LogicalConstraint[];
    derivations: InferenceRule[];
    counterfactuals: CounterfactualTest[];
}

export interface AtomicFact {
    id: string;
    value: string | number | boolean;
    type: 'string' | 'number' | 'boolean' | 'regex';
    deterministic_check?: string; // regex or validator function name
}

export interface LogicalConstraint {
    id: string;
    rule: 'MUST' | 'NEVER' | 'IF_THEN';
    condition: string;
    symbolic_validator?: string; // For external deterministic validation
}

export interface InferenceRule {
    id: string;
    antecedent: string; // A
    consequent: string; // B
    rule: string;       // A → B
}

export interface CounterfactualTest {
    id: string;
    question: string;
    expected_reasoning_path: string[];
    not_in_crystal: boolean; // Must be derivable but not explicit
}

/**
 * Calculate Proxy PAC-style Confidence Bound using Hoeffding inequality
 * Note: This is an OPERATIONAL BOUND, not a theoretical guarantee (LLMs are not i.i.d.)
 */
export function calculatePACBound(params: { n: number; delta?: number }): PACBounds {
    const { n, delta = 0.05 } = params;

    if (n <= 0) {
        return { epsilon: 1.0, delta, n };
    }

    // Hoeffding inequality: ε = sqrt(ln(1/δ) / 2n)
    const epsilon = Math.sqrt(Math.log(1 / delta) / (2 * n));

    return { epsilon, delta, n };
}

/**
 * Calculate dynamic acceptance threshold based on risk factor and statistical confidence
 * Higher risk requires higher confidence (lower epsilon) or higher raw score.
 */
export function calculateAcceptanceThreshold(params: {
    risk_factor: number; // 0.0 to 1.0 (Low to Critical)
    epsilon: number;     // PAC bound
}): number {
    const { risk_factor, epsilon } = params;

    // Base threshold is 0.5 (random guess floor)
    // We add risk-based penalty and epsilon (uncertainty) offset
    const base = 0.5;
    const riskPenalty = risk_factor * 0.3; // Up to 0.3 additional for critical risk
    const uncertaintyOffset = epsilon * 0.5; // Offset based on sample size confidence

    return Math.min(0.99, base + riskPenalty + uncertaintyOffset);
}

/**
 * Calculate Semantic Reliability Index (SRI)
 * This is a REPRODUCIBLE EMPIRICAL INDICATOR, not a mathematical guarantee
 */
export function calculateSRI(params: {
    raw_score: number;
    invariant_count: number;
    risk_factor?: number;
    delta?: number;
    historical_scores?: number[]; // For statistical context
}): SRIMetrics {
    const { raw_score, invariant_count, risk_factor = 0.5, delta = 0.05, historical_scores = [] } = params;

    // Calculate PAC-style bound
    const pac_bounds = calculatePACBound({ n: invariant_count, delta });

    // SRI = score × (1 - ε)
    const sri = raw_score * (1 - pac_bounds.epsilon);

    // Dynamic Threshold Calculation
    const threshold = calculateAcceptanceThreshold({ risk_factor, epsilon: pac_bounds.epsilon });

    // Determine fidelity badge and status
    let fidelity_badge: string;
    let acceptance_status: 'ACCEPT' | 'FAIL' | 'NEEDS_REVIEW';

    if (sri >= threshold) {
        fidelity_badge = sri > 0.95 ? 'PLATINUM' : 'GOLD';
        acceptance_status = 'ACCEPT';
    } else if (sri >= threshold * 0.8) {
        fidelity_badge = 'SILVER';
        acceptance_status = 'NEEDS_REVIEW';
    } else {
        fidelity_badge = 'BRONZE';
        acceptance_status = 'FAIL';
    }

    // Statistical context (for reproducibility)
    const all_scores = [...historical_scores, raw_score];
    const mean = all_scores.reduce((sum, s) => sum + s, 0) / all_scores.length;
    const variance = all_scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / all_scores.length;
    const std_dev = Math.sqrt(variance);

    return {
        raw_score,
        pac_bounds,
        sri,
        fidelity_badge,
        acceptance_status,
        statistical_context: {
            mean,
            std_dev,
            sample_size: all_scores.length,
            risk_factor,
            threshold_applied: threshold
        }
    };
}

/**
 * External Deterministic Verification
 * Reduces "LLM-judging-LLM" bias by using regex, parsers, and constraints
 */
export function externalDeterministicVerification(params: {
    fact: AtomicFact;
    actual_value: unknown;
}): { passed: boolean; method: string } {
    const { fact, actual_value } = params;

    switch (fact.type) {
        case 'regex':
            if (fact.deterministic_check) {
                try {
                    const regex = new RegExp(fact.deterministic_check, 'i');
                    const passed = regex.test(String(actual_value));
                    return { passed, method: 'regex_deterministic' };
                } catch (e) {
                    return { passed: false, method: 'regex_error' };
                }
            }
            break;

        case 'number':
            const expected = Number(fact.value);
            const actual = Number(actual_value);
            const tolerance = 0.01; // 1% tolerance for floating point
            const passed = Math.abs(expected - actual) / expected < tolerance;
            return { passed, method: 'numeric_comparison' };

        case 'boolean':
            const passed_bool = Boolean(fact.value) === Boolean(actual_value);
            return { passed: passed_bool, method: 'boolean_exact' };

        case 'string':
        default:
            // Exact string match (case-insensitive)
            const passed_str = String(fact.value).toLowerCase().trim() ===
                String(actual_value).toLowerCase().trim();
            return { passed: passed_str, method: 'string_exact' };
    }

    return { passed: false, method: 'not_implemented' };
}

/**
 * Format SRI for scientific display
 */
export function formatSRI(sri: SRIMetrics): string {
    return `SRI=${sri.sri.toFixed(3)} (score=${sri.raw_score.toFixed(2)}, ε=${sri.pac_bounds.epsilon.toFixed(3)}, n=${sri.pac_bounds.n}) [${sri.fidelity_badge}]`;
}

/**
 * Calculate reputation impact based on SRI and Tier.
 * High tier authors have more to lose (Higher Slash).
 */
export function calculateReputationImpact(params: {
    sri: number;
    tier: 'community' | 'verified' | 'certified' | 'trusted' | 'sovereign';
    threshold: number;
}): number {
    const { sri, tier, threshold } = params;
    const delta = sri - threshold;

    // Multiplier based on tier
    const multipliers = {
        community: 1.0,
        verified: 1.5,
        certified: 2.0,
        trusted: 3.0,
        sovereign: 5.0
    };

    const m = multipliers[tier] || 1.0;

    // Impact is delta * multiplier, capped at sensible ranges
    // Win: small gain, Loss: heavy penalty (Asymmetric Risk)
    if (delta > 0) {
        return parseFloat((delta * 0.1 * m).toFixed(4));
    } else {
        return parseFloat((delta * 0.5 * m).toFixed(4));
    }
}

export const ScientificMetrics = {
    calculatePACBound,
    calculateAcceptanceThreshold,
    calculateSRI,
    externalDeterministicVerification,
    calculateReputationImpact,
    formatSRI
};
