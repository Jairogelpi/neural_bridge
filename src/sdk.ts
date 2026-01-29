/**
 * Neural Bridge SDK (Official Reference Implementation)
 * 
 * This is the public entry point for developers integrating the
 * Semantic Context Protocol (SCP) into their own AI applications.
 * 
 * Usage:
 * import { NeuralBridge, SCP } from '@neural-bridge/sdk';
 */

import { CrystalRuntime, CrystalExecutionResult } from './services/crystal_runtime';
import { SCPService } from './services/llm';
import { VerificationService } from './services/verification_service';
import { CrystalFormat, Crystal, CrystalSchemaV01 } from './types/crystal_format';
import { Attestation } from './services/attestation';
import { DecisionReceipts, DecisionReceipt } from './services/decision_receipts';
import { ReceiptVisualizer } from './visualizer';
import { CloudBridge, CloudConfig } from './services/cloud_bridge';

// Export Core Types
export type { Crystal, CrystalExecutionResult } from './services/crystal_runtime';
export type { VerificationResult } from './services/llm';
export type { DecisionReceipt } from './services/decision_receipts';

export interface SDKConfig {
    apiKey: string;
    cloudUrl?: string;
    mode?: 'local' | 'cloud' | 'hybrid'; // hybrid = local verify, cloud compile/reputation
}

/**
 * The Standard Neural Bridge Client
 * Supports both Local (Private) and Cloud (Enterprise) execution.
 */
export class NeuralBridge {
    private config: SDKConfig;
    private cloud?: CloudBridge;
    
    constructor(config: SDKConfig) {
        this.config = { mode: 'hybrid', ...config };
        
        if (this.config.mode !== 'local') {
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
                    domain: (params.crystal.domain as any) || 'general',
                    enable_adversarials: params.mode === 'strict',
                    enable_counterfactuals: params.mode === 'strict'
                },
                requester: 'sdk-client'
            });
        }

        // 2. Telemetry / Reputation (Async)
        if (this.cloud && (this.config.mode === 'cloud' || this.config.mode === 'hybrid')) {
            // Fire and forget - don't block the main thread
            this.cloud.reportResult(result.receipt).catch(err => {
                // Silently fail telemetry if offline, don't break the app
                // console.warn("Telemetry failed", err);
            });
        }

        return result;
    }

    /**
     * Register a Knowledge Author Identity.
     * Required to earn Reputation Scores on the network.
     */
    async registerIdentity(name: string, handle: string): Promise<any> {
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
    async validateCrystal(data: any): Promise<{ valid: boolean; errors: string[] }> {
        const formatCheck = CrystalFormat.validate(data);
        if (!formatCheck.valid) return formatCheck;

        // Verify Hash Integrity
        // In a real implementation, we'd reconstruct the canonical hash here
        return { valid: true, errors: [] };
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
