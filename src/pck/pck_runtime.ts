/**
 * PCK RUNTIME - Production Integration
 * 
 * Connects Proof-Carrying Knowledge to the Neural Bridge system.
 * Enables zero-cost verification in production.
 */

import type { ProofCarryingKnowledge, VerificationResult } from './proof_carrying_knowledge';
import { PCKBuilder, PCKVerifier } from './proof_carrying_knowledge';
import { SMTRuntime } from '../smt';

// ═══════════════════════════════════════════════════════════════════════════════
// PCK RUNTIME - Main API
// ═══════════════════════════════════════════════════════════════════════════════

export interface CompileOptions {
    domain: string;
    extract_numbers?: boolean;
    extract_entities?: boolean;
    extract_temporals?: boolean;
}

export interface VerifyAnswerResult {
    valid: boolean;
    confidence: number;
    supported_claims: string[];
    unsupported_claims: string[];
    contradictions: string[];
    proof_verification: VerificationResult;
    llm_calls_made: 0;  // Always 0
    verification_time_ms: number;
}

export class PCKRuntime {

    /**
     * Compile a source document into Proof-Carrying Knowledge
     * This is done ONCE when you have authoritative source material
     */
    static async compile(source: string, options: CompileOptions): Promise<ProofCarryingKnowledge> {
        const builder = new PCKBuilder();

        // 1. Create axiom from source document
        const axiomId = await builder.addAxiom({
            claim: `Source document for ${options.domain} domain`,
            source_document: `${options.domain.toUpperCase()} Reference`,
            source_content: source
        });

        // 2. Extract facts using UNIVERSAL SMT (No hardcoded regex here!)
        const smt = await SMTRuntime.build(source);
        const extractions: string[] = [];

        // Flatten all features from the SMT into PCK extractions
        const nodes = (smt.nodes instanceof Map ? Array.from(smt.nodes.values()) : Object.values(smt.nodes)) as any[];

        for (const node of nodes) {
            for (const feature of node.features) {
                // If the user disabled specific types, skip them
                if (feature.type === 'number' && options.extract_numbers === false) continue;
                if (feature.type === 'entity' && options.extract_entities === false) continue;
                if (feature.type === 'temporal' && options.extract_temporals === false) continue;

                const extId = await builder.addExtraction({
                    claim: `${feature.type.toUpperCase()}: ${feature.canonical} - "${feature.original}"`,
                    source_text: source, // We still need the original text for regex validation in PCK
                    pattern: new RegExp(this.escapeRegex(feature.original), 'i'),
                    axiom_id: axiomId
                });
                if (extId) extractions.push(extId);
            }
        }

        // 3. Create composite derivation if we have extractions
        let rootId = axiomId;
        if (extractions.length > 0) {
            rootId = await builder.addDerivation({
                claim: `Verified knowledge from ${options.domain} source with ${extractions.length} SMT-derived features`,
                rule: 'logical_and',
                premises: [axiomId, ...extractions],
                justification: `Combined ${extractions.length} verified extractions from source`
            });
        }

        builder.setClaim(
            `Verified ${options.domain} knowledge from authoritative source`,
            options.domain
        );

        const pck = await builder.build(rootId);
        console.log('[PCKRuntime] Compiled PCK:', pck.pck_id, 'has nodes:', !!pck.proof_tree?.nodes);
        return pck;
    }

    /**
     * Verify an LLM answer against a PCK - ZERO API CALLS
     */
    static async verifyAnswer(pck: ProofCarryingKnowledge, answer: string): Promise<VerifyAnswerResult> {
        const startTime = Date.now();

        // 1. First verify the PCK itself is valid
        if (!pck || !pck.proof_tree) {
            console.error('[PCKRuntime] Invalid PCK object passed to verifyAnswer:', pck);
        }
        const proofVerification = await PCKVerifier.verify(pck);

        if (!proofVerification.valid) {
            return {
                valid: false,
                confidence: 0,
                supported_claims: [],
                unsupported_claims: ['PCK proof verification failed'],
                contradictions: [],
                proof_verification: proofVerification,
                llm_calls_made: 0,
                verification_time_ms: Date.now() - startTime
            };
        }

        // 2. Extract claims from the answer
        const answerClaims = this.extractClaims(answer);

        // 3. Check each claim against the PCK
        const supported: string[] = [];
        const unsupported: string[] = [];
        const contradictions: string[] = [];

        for (const claim of answerClaims) {
            const result = PCKVerifier.verifyClaim(pck, claim);

            if (result.supported) {
                supported.push(claim);
            } else {
                // Check if it contradicts anything
                const contradiction = this.checkContradiction(pck, claim);
                if (contradiction) {
                    contradictions.push(`"${claim}" contradicts: "${contradiction}"`);
                } else {
                    unsupported.push(claim);
                }
            }
        }

        // 4. Calculate overall validity
        const totalClaims = answerClaims.length;
        const supportedRatio = totalClaims > 0 ? supported.length / totalClaims : 0;
        const hasContradictions = contradictions.length > 0;

        const valid = supportedRatio >= 0.5 && !hasContradictions;
        const confidence = hasContradictions ? 0 : supportedRatio * pck.claim.confidence;

        return {
            valid,
            confidence,
            supported_claims: supported,
            unsupported_claims: unsupported,
            contradictions,
            proof_verification: proofVerification,
            llm_calls_made: 0,
            verification_time_ms: Date.now() - startTime
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EXTRACTION UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════

    private static extractClaims(text: string): string[] {
        // Split into sentences and filter meaningful ones
        const sentences = text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10 && s.length < 500);

        return sentences;
    }

    private static checkContradiction(pck: ProofCarryingKnowledge, claim: string): string | null {
        const claimLower = claim.toLowerCase();

        // Check for explicit negations
        const negationPatterns = [
            { pattern: /no\s+(?:limit|maximum|restriction)/i, opposite: /maximum|limit|up to/i },
            { pattern: /unlimited/i, opposite: /maximum|limit|up to/i },
            { pattern: /any\s+time/i, opposite: /within|before|after|deadline/i },
            { pattern: /no\s+exceptions?/i, opposite: /except|exception|unless|however/i },
        ];

        for (const { pattern, opposite } of negationPatterns) {
            if (pattern.test(claimLower)) {
                // Check if PCK contains the opposite
                for (const node of pck.proof_tree.nodes.values()) {
                    if (opposite.test(node.claim.toLowerCase())) {
                        return node.claim;
                    }
                }
            }
        }
        return null;
    }

    private static escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
