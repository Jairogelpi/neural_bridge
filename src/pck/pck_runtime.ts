/**
 * PCK RUNTIME - Production Integration
 * 
 * Connects Proof-Carrying Knowledge to the Neural Bridge system.
 * Enables zero-cost verification in production.
 */

import type { ProofCarryingKnowledge, VerificationResult } from './proof_carrying_knowledge';
import { PCKBuilder, PCKVerifier } from './proof_carrying_knowledge';
import crypto from 'crypto';

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
    static compile(source: string, options: CompileOptions): ProofCarryingKnowledge {
        const builder = new PCKBuilder();
        
        // 1. Create axiom from source document
        const axiomId = builder.addAxiom({
            claim: `Source document for ${options.domain} domain`,
            source_document: `${options.domain.toUpperCase()} Reference`,
            source_content: source
        });
        
        // 2. Extract facts based on domain
        const extractions: string[] = [];
        
        if (options.extract_numbers !== false) {
            const numbers = this.extractNumbers(source);
            for (const num of numbers) {
                const extId = builder.addExtraction({
                    claim: `Numeric fact: ${num.value}${num.unit ? ' ' + num.unit : ''} - "${num.context}"`,
                    source_text: source,
                    pattern: new RegExp(this.escapeRegex(num.raw), 'i'),
                    axiom_id: axiomId
                });
                if (extId) extractions.push(extId);
            }
        }
        
        if (options.extract_entities !== false) {
            const entities = this.extractEntities(source, options.domain);
            for (const ent of entities) {
                const extId = builder.addExtraction({
                    claim: `Entity: ${ent.name} (${ent.type})`,
                    source_text: source,
                    pattern: new RegExp(this.escapeRegex(ent.name), 'i'),
                    axiom_id: axiomId
                });
                if (extId) extractions.push(extId);
            }
        }
        
        if (options.extract_temporals !== false) {
            const temporals = this.extractTemporals(source);
            for (const temp of temporals) {
                const extId = builder.addExtraction({
                    claim: `Temporal: ${temp.value} - "${temp.context}"`,
                    source_text: source,
                    pattern: new RegExp(this.escapeRegex(temp.value), 'i'),
                    axiom_id: axiomId
                });
                if (extId) extractions.push(extId);
            }
        }
        
        // 3. Create composite derivation if we have extractions
        let rootId = axiomId;
        if (extractions.length > 0) {
            rootId = builder.addDerivation({
                claim: `Verified knowledge from ${options.domain} source with ${extractions.length} extracted facts`,
                rule: 'logical_and',
                premises: [axiomId, ...extractions],
                justification: `Combined ${extractions.length} verified extractions from source`
            });
        }
        
        builder.setClaim(
            `Verified ${options.domain} knowledge from authoritative source`,
            options.domain
        );
        
        return builder.build(rootId);
    }
    
    /**
     * Verify an LLM answer against a PCK - ZERO API CALLS
     */
    static verifyAnswer(pck: ProofCarryingKnowledge, answer: string): VerifyAnswerResult {
        const startTime = Date.now();
        
        // 1. First verify the PCK itself is valid
        const proofVerification = PCKVerifier.verify(pck);
        
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
    
    private static extractNumbers(text: string): Array<{ value: number; unit: string; raw: string; context: string }> {
        const results: Array<{ value: number; unit: string; raw: string; context: string }> = [];
        
        const pattern = /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(mg|g|kg|ml|l|hours?|days?|weeks?|months?|years?|%|dollars?|\$|€|£|million|billion|m|mm|cm|km)?/gi;
        
        let match;
        while ((match = pattern.exec(text)) !== null) {
            if (!match[1]) continue;
            const numStr = match[1].replace(/,/g, '');
            const value = parseFloat(numStr);
            if (isNaN(value)) continue;
            
            const unit = match[2]?.toLowerCase() || '';
            const start = Math.max(0, match.index - 30);
            const end = Math.min(text.length, match.index + match[0].length + 30);
            const context = text.substring(start, end).replace(/\s+/g, ' ').trim();
            
            results.push({ value, unit, raw: match[0], context });
        }
        
        return results;
    }
    
    private static extractEntities(text: string, domain: string): Array<{ name: string; type: string }> {
        const results: Array<{ name: string; type: string }> = [];
        const seen = new Set<string>();
        
        const patterns: Record<string, Array<{ pattern: RegExp; type: string }>> = {
            law: [
                { pattern: /(?:Article|Art\.?)\s*\d+(?:\([a-z]\))?/gi, type: 'legal_article' },
                { pattern: /(?:Section|Sec\.?)\s*\d+(?:\.\d+)?/gi, type: 'legal_section' },
                { pattern: /(GDPR|HIPAA|SOX|SEC|FDA|FTC|CCPA|PCI-DSS|ADA|FERPA)/gi, type: 'regulation' },
            ],
            medicine: [
                { pattern: /(aspirin|ibuprofen|acetaminophen|paracetamol|metformin|lisinopril)/gi, type: 'medication' },
                { pattern: /(\d+(?:\.\d+)?\s*(?:mg|g|ml|mcg)(?:\/(?:day|kg|dose))?)/gi, type: 'dosage' },
                { pattern: /(contraindicated?|hypersensitivity|adverse|side effect)/gi, type: 'warning' },
            ],
            finance: [
                { pattern: /(?:Form|Schedule)\s*\d+-?[A-Z]?/gi, type: 'sec_form' },
                { pattern: /\$\d+(?:,\d{3})*(?:\.\d+)?(?:\s*(?:million|billion|M|B))?/gi, type: 'monetary_value' },
                { pattern: /(Large Accelerated Filer|Accelerated Filer|Non-Accelerated Filer)/gi, type: 'filer_category' },
            ],
            tech: [
                { pattern: /(API|SDK|REST|GraphQL|HTTP|HTTPS|OAuth|JWT)/gi, type: 'technology' },
                { pattern: /v?\d+\.\d+(?:\.\d+)?/gi, type: 'version' },
            ],
            general: []
        };
        
        const domainPatterns = patterns[domain] ?? patterns.general ?? [];
        
        for (const { pattern, type } of domainPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const name = match[0];
                const key = name.toLowerCase();
                if (!seen.has(key)) {
                    seen.add(key);
                    results.push({ name, type });
                }
            }
        }
        
        return results;
    }
    
    private static extractTemporals(text: string): Array<{ value: string; context: string }> {
        const results: Array<{ value: string; context: string }> = [];
        
        const patterns = [
            /(\d+)\s*(hours?|days?|weeks?|months?|years?)/gi,
            /within\s*(\d+)\s*(hours?|days?|weeks?|months?|years?)/gi,
            /(immediately|without delay|promptly)/gi,
            /(?:before|after|within)\s+(?:the\s+)?(?:end\s+of\s+)?(?:fiscal\s+)?year/gi,
        ];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const start = Math.max(0, match.index - 20);
                const end = Math.min(text.length, match.index + match[0].length + 20);
                const context = text.substring(start, end).replace(/\s+/g, ' ').trim();
                results.push({ value: match[0], context });
            }
        }
        
        return results;
    }
    
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
        
        // Check for numeric contradictions
        const claimNumbers = this.extractNumbers(claim);
        for (const claimNum of claimNumbers) {
            for (const node of pck.proof_tree.nodes.values()) {
                const nodeNumbers = this.extractNumbers(node.claim);
                for (const nodeNum of nodeNumbers) {
                    // Same unit but significantly different value
                    if (claimNum.unit === nodeNum.unit && claimNum.unit) {
                        const ratio = claimNum.value / nodeNum.value;
                        if (ratio > 2 || ratio < 0.5) {
                            return `${node.claim} (${nodeNum.value}${nodeNum.unit} vs ${claimNum.value}${claimNum.unit})`;
                        }
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
