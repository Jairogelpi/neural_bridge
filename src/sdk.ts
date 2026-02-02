/**
 * Neural Bridge SDK (Official Reference Implementation)
 * 
 * This is the public entry point for developers integrating the
 * Semantic Context Protocol (SCP) into their own AI applications.
 * 
 * Usage:
 * import { NeuralBridge, SCP } from '@neural-bridge/sdk';
 */

import { CrystalRuntime } from './services/crystal_runtime';
import type { CrystalExecutionResult } from './services/crystal_runtime';
import { SCPService } from './services/llm';
import { CrystalFormat, CrystalSchemaV01 } from './types/crystal_format';
import type { Crystal } from './types/crystal_format';
import { Attestation } from './services/attestation';
import { DecisionReceipts } from './services/decision_receipts';
import type { DecisionReceipt } from './services/decision_receipts';
import { ReceiptVisualizer } from './visualizer';
import { CloudBridge } from './services/cloud_bridge';
import type { CloudConfig } from './services/cloud_bridge';
import { PCKRuntime, PCKVerifier, type ProofCarryingKnowledge } from './pck';
import { ZKVRuntime, type ZKProof, type ZKVerificationResult } from './zkv';
import { SMTRuntime, type SemanticMerkleTree, type SemanticComparisonResult } from './smt';
import { CLPVRuntime, type PortableReceipt, type CrossVerificationResult } from './clpv';

// Export Core Types
export type { CrystalExecutionResult } from './services/crystal_runtime';
export type { VerificationResult } from './services/llm';
export type { DecisionReceipt } from './services/decision_receipts';
export type { ProofCarryingKnowledge } from './pck';
export type { ZKProof, ZKVerificationResult } from './zkv';
export type { SemanticMerkleTree, SemanticComparisonResult } from './smt';
export type { PortableReceipt, CrossVerificationResult } from './clpv';

export interface SDKConfig {
    apiKey?: string;  // Optional for local-only PCK mode
    cloudUrl?: string;
    mode?: 'local' | 'cloud' | 'hybrid' | 'pck' | 'zkv'; // pck/zkv = zero-cost local verification
}

/**
 * The Standard Neural Bridge Client
 * Supports both Local (Private) and Cloud (Enterprise) execution.
 */
export class NeuralBridge {
    private config: SDKConfig;
    private cloud?: CloudBridge;

    constructor(config: SDKConfig = {}) {
        this.config = { mode: 'pck', ...config };

        if (this.config.mode !== 'local' && this.config.mode !== 'pck' && config.apiKey) {
            const cloudConfig: CloudConfig = {
                apiKey: config.apiKey
            };
            if (config.cloudUrl) {
                cloudConfig.baseUrl = config.cloudUrl;
            }
            this.cloud = new CloudBridge(cloudConfig);
        }
    }

    /**
     * Compile raw text (PDFs, protocols, laws) into a Verifiable Crystal.
     * Uses Cloud Compiler if available for maximum quality (RLM Loop).
     */
    async compile(content: string, domain?: string): Promise<Crystal> {
        if (this.cloud && this.config.mode !== 'local') {
            return this.cloud.compile(content, domain);
        }
        const { crystal } = await SCPService.generateCrystal(content, 'sdk-compiler');
        return crystal;
    }

    /**
     * Verify an LLM response against a Crystal.
     * This is the "Shield" function to wrap your LLM calls with.
     */
    async verify(params: {
        crystal: Crystal;
        question: string;
        answer: string;
        mode?: 'fast' | 'strict';
    }): Promise<CrystalExecutionResult> {
        let result: CrystalExecutionResult;

        // 1. Execution
        if (this.cloud && this.config.mode === 'cloud') {
            // Full Cloud Verification (Zero Local Compute)
            const cloudRes = await this.cloud.verify(params);
            // Adapt cloud result to local format if needed, or return directly
            // For now, we reconstruct a partial result with the receipt
            return {
                passed: cloudRes.passed,
                sri: cloudRes.sri,
                receipt: cloudRes.receipt,
                pac_epsilon: 0, // In receipt
                fidelity_badge: "CLOUD",
                invariants_passed: [], // In receipt
                invariants_failed: [],
                invariants_total: 0,
                counterfactuals_passed: [],
                counterfactuals_failed: [],
                counterfactuals_total: 0,
                adversarial_families_tested: 0,
                adversarial_pass_rate: 0,
                execution_log: [],
                issues: cloudRes.passed ? [] : ["Cloud verification failed"],
                total_cost: 0
            };
        } else {
            // Local / Hybrid Verification
            result = await CrystalRuntime.executeCrystal({
                crystal: params.crystal,
                question: params.question,
                answer: params.answer,
                config: {
                    domain: (params.crystal.domain as string) || 'general',
                    enable_adversarials: params.mode === 'strict',
                    enable_counterfactuals: params.mode === 'strict'
                },
                requester: 'sdk-client'
            });
        }

        // 2. Telemetry / Reputation (Async)
        if (this.cloud && (this.config.mode === 'cloud' || this.config.mode === 'hybrid')) {
            // Fire and forget - don't block the main thread
            this.cloud.reportResult(result.receipt).catch(_err => {
                // Silently fail telemetry if offline, don't break the app
            });
        }

        return result;
    }

    /**
     * Register a Knowledge Author Identity.
     * Required to earn Reputation Scores on the network.
     */
    async registerIdentity(name: string, handle: string): Promise<unknown> {
        if (!this.cloud) throw new Error("Cloud mode required for Identity Registration");
        // Generate a new keypair for this identity
        const kp = await Attestation.generateKeyPair();
        const pubKey = await Attestation.exportPublicKey(kp.publicKey);

        return this.cloud.registerAuthor(name, handle, pubKey);
    }

    /**
     * Cryptographically verify a Decision Receipt.
     * This proves the verification actually happened and wasn't faked.
     */
    async verifyReceipt(receipt: DecisionReceipt): Promise<boolean> {
        return DecisionReceipts.verifyReceipt(receipt);
    }

    /**
     * Validate if a JSON object is a valid Crystal (Schema Check + Hash Verification)
     */
    async validateCrystal(data: unknown): Promise<{ valid: boolean; errors: string[] }> {
        const formatCheck = CrystalFormat.validate(data);
        if (!formatCheck.valid) return formatCheck;
        return { valid: true, errors: [] };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PROOF-CARRYING KNOWLEDGE (PCK) - Revolutionary Zero-Cost Verification
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Compile source document into Proof-Carrying Knowledge.
     * The PCK contains embedded proofs - verification costs ZERO API calls.
     * 
     * @example
     * const pck = nb.compilePCK(gdprText, 'law');
     * // Later, verify any answer with ZERO cost:
     * const result = nb.verifyWithPCK(pck, llmAnswer);
     */
    compilePCK(source: string, domain: string = 'general'): ProofCarryingKnowledge {
        return PCKRuntime.compile(source, {
            domain,
            extract_numbers: true,
            extract_entities: true,
            extract_temporals: true
        });
    }

    /**
     * Verify an answer using Proof-Carrying Knowledge.
     * THIS IS THE REVOLUTIONARY PART: Zero external API calls.
     * 
     * @returns Verification result with confidence score
     */
    verifyWithPCK(pck: ProofCarryingKnowledge, answer: string): {
        valid: boolean;
        confidence: number;
        supported_claims: string[];
        unsupported_claims: string[];
        contradictions: string[];
        llm_calls_made: 0;  // Always zero - this is the revolution
        verification_time_ms: number;
    } {
        return PCKRuntime.verifyAnswer(pck, answer);
    }

    /**
     * Verify PCK integrity - ensure proofs haven't been tampered with.
     */
    verifyPCKIntegrity(pck: ProofCarryingKnowledge): {
        valid: boolean;
        checks_performed: number;
        failed_checks: string[];
    } {
        return PCKVerifier.verify(pck);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // ZERO-KNOWLEDGE VERIFICATION (ZKV) - Enterprise Privacy
    // Prove answer correctness WITHOUT revealing source documents
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Create a Zero-Knowledge Proof for an answer.
     * ENTERPRISE FEATURE: Verify AI outputs without exposing proprietary data.
     * 
     * @param source - CONFIDENTIAL source document (NEVER leaves your system)
     * @param answer - The LLM answer to verify
     * @param domain - Knowledge domain
     * @returns ZK proof that can be shared without revealing source
     */
    createZKProof(params: {
        source: string;
        answer: string;
        domain: string;
        constraints?: Array<{ type: string; value: unknown }>;
    }): ZKProof {
        return ZKVRuntime.createProof(params);
    }

    /**
     * Verify a ZK proof WITHOUT seeing the source document.
     * The verifier learns ONLY: Is the answer correct? (yes/no + confidence)
     * The verifier does NOT learn: Source content, verification logic
     */
    verifyZKProof(proof: ZKProof, answer?: string): ZKVerificationResult {
        return ZKVRuntime.verifyProof(proof, answer);
    }

    /**
     * Full ZKV workflow: Prove and verify in one call.
     * Demonstrates complete zero-knowledge verification pipeline.
     */
    proveAndVerifyZK(params: {
        source: string;
        answer: string;
        domain: string;
        constraints?: Array<{ type: string; value: unknown }>;
    }): {
        proof: ZKProof;
        verification: ZKVerificationResult;
        source_revealed: false;
        logic_revealed: false;
    } {
        return ZKVRuntime.proveAndVerify(params);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // SEMANTIC MERKLE TREES (SMT) - Hash of Meaning
    // Same meaning = same hash, detects paraphrases & contradictions
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Build a Semantic Merkle Tree from text.
     * Creates a hash of MEANING, not bytes.
     */
    buildSemanticTree(text: string): SemanticMerkleTree {
        return SMTRuntime.build(text);
    }

    /**
     * Compare two documents semantically.
     * Detects paraphrases, contradictions, and plagiarism.
     */
    compareSemantics(text1: string, text2: string): SemanticComparisonResult {
        return SMTRuntime.compare(text1, text2);
    }

    /**
     * Verify a claim against a semantic truth tree.
     */
    verifyClaimAgainstTree(smt: SemanticMerkleTree, claim: string): {
        found: boolean;
        semantic_match: boolean;
        confidence: number;
    } {
        return SMTRuntime.verifyClaim(smt, claim);
    }

    /**
     * Get audit trail for a semantic tree.
     */
    getSemanticAuditTrail(smt: SemanticMerkleTree): {
        tree_id: string;
        root_hash: string;
        claims: Array<{ canonical: string; hash: string }>;
        verification_path: string[];
    } {
        return SMTRuntime.getAuditTrail(smt);
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // CROSS-LLM PORTABLE VERIFICATION (CLPV)
    // Receipts that work with GPT-4, Claude, Gemini, Llama - ANY LLM
    // ═══════════════════════════════════════════════════════════════════════════════

    /**
     * Create a portable receipt from any LLM response.
     * The receipt works with GPT-4, Claude, Gemini, Llama - ANY model.
     */
    createPortableReceipt(params: {
        question: string;
        answer: string;
        llm?: string;
    }): PortableReceipt {
        return CLPVRuntime.createReceipt(params);
    }

    /**
     * Verify a portable receipt.
     * Works regardless of which LLM created the original response.
     */
    verifyPortableReceipt(receipt: PortableReceipt, answer?: string): CrossVerificationResult {
        return CLPVRuntime.verifyReceipt(receipt, answer);
    }

    /**
     * Cross-verify: Compare a receipt from one LLM against another LLM's response.
     * Detects if different LLMs agree on the same facts.
     */
    crossVerifyLLMs(params: {
        original_receipt: PortableReceipt;
        new_answer: string;
        new_llm: string;
    }): CrossVerificationResult {
        return CLPVRuntime.crossVerify(params);
    }

    /**
     * Check if a receipt is portable to a specific LLM.
     */
    isReceiptPortableTo(receipt: PortableReceipt, targetLLM: string): boolean {
        return CLPVRuntime.isPortableTo(receipt, targetLLM);
    }
}

/**
 * Direct access to Protocol Utilities
 */
export const SCP = {
    Schema: CrystalSchemaV01,
    Format: CrystalFormat,
    Visualizer: ReceiptVisualizer,
    Metrics: {
        calculateSRI: (score: number, risk: number) => {
            return score * (1 - risk * 0.1);
        }
    }
};
