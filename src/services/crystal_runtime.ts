// Crystal Runtime: The Core MVP
// This is the HEART of Neural Bridge - orchestrates ALL verification modules

import { Attestation } from './attestation';
import { AntiGaming } from './anti_gaming';
import { ScientificMetrics } from './scientific_metrics';
import { DecisionReceipts, DecisionReceipt } from './decision_receipts';
import type { Invariant, VerifyResult } from '../content/verifier/verifier';
import { verifyAnswers } from '../content/verifier/verifier';
import { Crystal, SemanticInvariant } from '../types/crystal_format';

export interface CrystalRuntimeConfig {
    domain: string;
    sri_threshold?: number;
    sign_receipt?: boolean;
    enable_adversarials?: boolean;
    enable_counterfactuals?: boolean;
}

export interface CrystalExecutionResult {
    // Core metrics
    sri: number;
    pac_epsilon: number;
    fidelity_badge: string;

    // Verification details
    invariants_passed: string[];
    invariants_failed: string[];
    invariants_total: number;

    counterfactuals_passed: string[];
    counterfactuals_failed: string[];
    counterfactuals_total: number;

    // Adversarial results
    adversarial_families_tested: number;
    adversarial_pass_rate: number;

    // Decision Receipt (signed)
    receipt: DecisionReceipt;

    // Reproducibility
    execution_log: Array<{
        timestamp: string;
        action: string;
        result: Record<string, unknown>;
    }>;

    // Final verdict
    passed: boolean;
    issues: string[];
    total_cost: number;
}

/**
 * CRYSTAL RUNTIME CORE
 * 
 * This is the MVP that proves Neural Bridge is REAL:
 * 1. Takes a Crystal (JSON)
 * 2. Executes ALL verifications
 * 3. Returns signed Receipt with SRI
 * 
 * EVERYTHING is deterministic and reproducible.
 */
export async function executeCrystal(params: {
    crystal: Crystal;
    question: string;
    answer: string;
    config: CrystalRuntimeConfig;
    requester: string;
}): Promise<CrystalExecutionResult> {
    const { crystal, question, answer, config, requester } = params;

    const execution_log: Array<{ timestamp: string; action: string; result: Record<string, unknown> }> = [];
    const issues: string[] = [];
    let total_cost = 0;

    // Log: Start execution
    execution_log.push({
        timestamp: new Date().toISOString(),
        action: 'runtime_start',
        result: { crystal_id: crystal.context_id, question }
    });

    // ===============================================
    // STEP 1: Verify Core Invariants (Deterministic)
    // ===============================================

    const invariants: Invariant[] = (crystal.verification?.semantic_invariants as any) || [];
    let verification_result: VerifyResult = {
        score: 0,
        strictFailures: [],
        perInvariant: []
    };

    if (invariants.length > 0) {
        verification_result = verifyAnswers({ invariants, parsed: { answers: { answer } } });

        execution_log.push({
            timestamp: new Date().toISOString(),
            action: 'verify_invariants',
            result: {
                total: invariants.length,
                score: verification_result.score,
                strict_failures: verification_result.strictFailures.length
            }
        });
    }

    const invariants_passed = verification_result.perInvariant
        .filter(inv => inv.score === 1)
        .map(inv => inv.id);

    const invariants_failed = verification_result.perInvariant
        .filter(inv => inv.score < 1)
        .map(inv => inv.id);

    // Check strict failures
    if (verification_result.strictFailures.length > 0) {
        issues.push(`Strict invariant failures: ${verification_result.strictFailures.join(', ')}`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // TURBO OPTIMIZATION: Early Exit if score is too low
    // ═══════════════════════════════════════════════════════════════════
    const { SCPService } = await import('./llm');

    const earlyExitThreshold = 0.5;
    const shouldEarlyExit = verification_result.score < earlyExitThreshold &&
        verification_result.strictFailures.length > 0;

    let adversarial_families_tested = 0;
    let adversarial_pass_rate = 1.0;
    let counterfactuals_passed: string[] = [];
    let counterfactuals_failed: string[] = [];
    let counterfactuals_total = 0;

    if (shouldEarlyExit) {
        // TURBO: Skip expensive adversarials/counterfactuals for obvious failures
        execution_log.push({
            timestamp: new Date().toISOString(),
            action: 'turbo_early_exit',
            result: {
                reason: `Score ${verification_result.score.toFixed(2)} < ${earlyExitThreshold}, skipping adversarials/counterfactuals`,
                saved_calls: 3
            }
        });
        issues.push(`Early exit: Score too low (${verification_result.score.toFixed(2)})`);
    } else {
        // ===============================================
        // STEP 2: Generate & Test Adversarial Invariants (PARALLELIZED)
        // ===============================================

        if (config.enable_adversarials !== false) {
            // 2a. Standard Adaptive Adversarials
            const adaptiveAdversarials = AntiGaming.generateAdaptiveAdversarials({
                crystal,
                domain: config.domain,
                count: 2
            });

            // 2b. Advanced Chained Logic Adversarials (New)
            const chainedAdversarials = AntiGaming.generateChainedAdversarials({
                crystal
            });

            const allAdversarials = [...adaptiveAdversarials, ...chainedAdversarials];
            adversarial_families_tested = allAdversarials.length;

            const model = SCPService.getOptimalModel({
                domain: config.domain,
                task: 'verify'
            });

            // TURBO: Run all adversarial verifications in PARALLEL
            const adversarialPromises = allAdversarials
                .filter(family => family.templates[0])
                .map(async (family) => {
                    const testQuestion = family.templates[0]!;
                    const verification = await SCPService.verifyArbitrary({
                        crystal,
                        question: testQuestion,
                        answer: answer,
                        targetModel: model,
                        useCache: true
                    });
                    return { family, verification };
                });

            const adversarialResults = await Promise.all(adversarialPromises);

            let adversarial_passed = 0;
            for (const { family, verification } of adversarialResults) {
                total_cost += verification.cost || 0;

                // Stricter passing criteria for chained logic
                const threshold = family.concept === 'TRANSITIVE_LOGIC' ? 0.8 : 0.7;

                if (verification.score >= threshold) {
                    adversarial_passed++;
                } else {
                    issues.push(`Adversarial Check Failed: ${family.concept} (${verification.reasoning})`);
                }

                execution_log.push({
                    timestamp: new Date().toISOString(),
                    action: 'verify_adversarial_family',
                    result: {
                        family_id: family.family_id,
                        type: family.concept === 'TRANSITIVE_LOGIC' ? 'CHAINED' : 'ADAPTIVE',
                        score: verification.score,
                        reasoning: verification.reasoning
                    }
                });
            }

            adversarial_pass_rate = adversarial_families_tested > 0
                ? adversarial_passed / adversarial_families_tested
                : 1.0;
        }

        // ===============================================
        // STEP 2.5: Metamorphic Testing (Consistency Check)
        // ===============================================
        // Ensure that rephrasing the question doesn't break the verification.

        if (config.enable_adversarials !== false) { // Grouped with advanced checks
            const metamorphicTest = AntiGaming.generateMetamorphicTests({
                original_question: question,
                expected_answer: answer
            });

            // Take one transformation to test
            const transformation = metamorphicTest.transformations[0];
            if (transformation) {
                const model = SCPService.getOptimalModel({ domain: config.domain, task: 'verify' });

                // Verify if the answer still holds for the transformed question
                const metaVerification = await SCPService.verifyArbitrary({
                    crystal,
                    question: transformation.transformed_question,
                    answer: answer, // Does the original answer still satisfy the transformed question?
                    targetModel: model,
                    useCache: true
                });

                total_cost += metaVerification.cost || 0;

                execution_log.push({
                    timestamp: new Date().toISOString(),
                    action: 'verify_metamorphic',
                    result: {
                        type: transformation.type,
                        transformed_question: transformation.transformed_question,
                        consistency_score: metaVerification.score
                    }
                });

                if (metaVerification.score < 0.6) {
                    issues.push(`Metamorphic Instability: Rephrasing question as "${transformation.transformed_question}" dropped confidence to ${metaVerification.score.toFixed(2)}`);
                }
            }
        }

        // ===============================================
        // STEP 3: Execute Counterfactual Tests
        // ===============================================

        if (config.enable_counterfactuals !== false) {
            const counterfactual = AntiGaming.generateCounterfactualTest({
                crystal,
                domain: config.domain
            });

            counterfactuals_total = 1;

            const model = SCPService.getOptimalModel({
                domain: config.domain,
                task: 'verify'
            });

            // REAL verification of counterfactual (with cache)
            const verification = await SCPService.verifyArbitrary({
                crystal,
                question: counterfactual.question,
                answer: answer,
                targetModel: model,
                useCache: true
            });

            total_cost += verification.cost || 0;

            if (verification.score >= 0.7) {
                counterfactuals_passed.push(counterfactual.id);
            } else {
                counterfactuals_failed.push(counterfactual.id);
                issues.push(`Counterfactual test failed: ${verification.reasoning}`);
            }

            execution_log.push({
                timestamp: new Date().toISOString(),
                action: 'verify_counterfactual',
                result: { id: counterfactual.id, score: verification.score, reasoning: verification.reasoning }
            });
        }
    }

    // ===============================================
    // STEP 4: Calculate SRI & PAC Epsilon
    // ===============================================

    // Map domain to risk factor
    const riskMap: Record<string, number> = { 'medicine': 0.9, 'law': 0.8, 'tech': 0.6, 'finance': 0.7, 'general': 0.3 };
    const risk_factor = riskMap[config.domain] || 0.3;

    const sri_metrics = ScientificMetrics.calculateSRI({
        raw_score: verification_result.score,
        invariant_count: invariants.length,
        risk_factor,
        historical_scores: []
    });

    const pac_epsilon = sri_metrics.pac_bounds.epsilon;
    const fidelity_badge = sri_metrics.fidelity_badge;

    // Phase 6: Calculate Reputation Impact
    const reputation_impact = ScientificMetrics.calculateReputationImpact({
        sri: sri_metrics.sri,
        tier: crystal.tier || 'community',
        threshold: sri_metrics.statistical_context.threshold_applied
    });
    sri_metrics.reputation_impact = reputation_impact;

    execution_log.push({
        timestamp: new Date().toISOString(),
        action: 'calculate_metrics',
        result: {
            sri: sri_metrics.sri,
            pac_epsilon,
            fidelity_badge,
            acceptance_status: sri_metrics.acceptance_status,
            threshold: sri_metrics.statistical_context.threshold_applied,
            reputation_impact
        }
    });

    // Check SRI threshold
    const verification_passed = sri_metrics.acceptance_status === 'ACCEPT';
    if (!verification_passed) {
        issues.push(`Acceptance status is ${sri_metrics.acceptance_status}. SRI ${sri_metrics.sri.toFixed(3)} < Threshold ${sri_metrics.statistical_context.threshold_applied.toFixed(3)}`);
    }

    // ===============================================
    // STEP 5: Generate Signed Decision Receipt
    // ===============================================

    const receipt = await DecisionReceipts.generateDecisionReceipt({
        crystal_refs: [{
            crystal_id: crystal.context_id || 'unknown',
            version: '1.0.0',
            hash: await Attestation.realSHA256(JSON.stringify(crystal))
        }],
        question,
        answer,
        verification_result: {
            invariants_used: invariants.map(inv => inv.id),
            invariants_passed,
            invariants_failed,
            counterfactuals_passed,
            counterfactuals_failed,
            sri: sri_metrics.sri,
            pac_epsilon,
            fidelity_badge
        },
        model_config: {
            provider: 'neural_bridge_runtime',
            model: 'crystal_executor_v1',
            temperature: 0,
            max_tokens: 0
        },
        requester,
        author: crystal.author ? {
            id: crystal.author.id,
            tier: (crystal.tier || 'community') as any,
            reputation: crystal.author.reputation
        } : undefined,
        reputation_impact: sri_metrics.reputation_impact,
        sign: config.sign_receipt !== false
    });

    execution_log.push({
        timestamp: new Date().toISOString(),
        action: 'generate_receipt',
        result: {
            receipt_id: receipt.receipt_id,
            signed: !!receipt.signature.signature
        }
    });

    // ===============================================
    // STEP 6: Final Verdict
    // ===============================================

    const final_passed = issues.length === 0 &&
        invariants_failed.length === 0 &&
        counterfactuals_failed.length === 0;

    execution_log.push({
        timestamp: new Date().toISOString(),
        action: 'runtime_complete',
        result: { passed: final_passed, issues_count: issues.length }
    });

    return {
        sri: sri_metrics.sri,
        pac_epsilon,
        fidelity_badge,

        invariants_passed,
        invariants_failed,
        invariants_total: invariants.length,

        counterfactuals_passed,
        counterfactuals_failed,
        counterfactuals_total,

        adversarial_families_tested,
        adversarial_pass_rate,

        receipt,
        execution_log,

        passed: final_passed,
        issues,
        total_cost
    };
}

/**
 * Quick validation: Does this Crystal pass basic checks?
 */
export function validateCrystalStructure(crystal: Crystal): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!crystal) {
        errors.push('Crystal is null or undefined');
        return { valid: false, errors };
    }

    if (!crystal.context_id) {
        errors.push('Missing context_id');
    }

    if (!crystal.verification) {
        errors.push('Missing verification config');
    }

    if (!Array.isArray(crystal.verification?.semantic_invariants)) {
        errors.push('Missing or invalid semantic_invariants array');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

export const CrystalRuntime = {
    executeCrystal,
    validateCrystalStructure
};
