import { SemanticHasher } from './semantic_hashing';
import { Hypervector } from '../math/hypervector';
import type { Crystal } from '../types/crystal_format';

export type KnowledgeDomain = string;

export interface DomainScore {
    domain: KnowledgeDomain;
    confidence: number;
}

export const DomainHeuristics = {
    /**
     * Analyze text to detect the knowledge domain using SEMANTIC ANCHORS.
     * No hardcoded word lists. Pure mathematical resonance.
     */
    async detect(text: string): Promise<DomainScore> {
        const hv = Hypervector.fromString(SemanticHasher.computeHolographicHash(text));

        // Generate Domain Anchors (Deterministc projections of domain concepts)
        const anchors: Record<string, Hypervector> = {
            medicine: Hypervector.fromString(SemanticHasher.computeHolographicHash("medical clinical patient health treatment")),
            law: Hypervector.fromString(SemanticHasher.computeHolographicHash("legal contract regulation law justice")),
            tech: Hypervector.fromString(SemanticHasher.computeHolographicHash("code programming software technology system")),
            finance: Hypervector.fromString(SemanticHasher.computeHolographicHash("finance money market investment capital")),
            education: Hypervector.fromString(SemanticHasher.computeHolographicHash("education student learning teaching academic")),
            creative: Hypervector.fromString(SemanticHasher.computeHolographicHash("art design creativity media visual")),
            corporate: Hypervector.fromString(SemanticHasher.computeHolographicHash("business management company corporate strategy"))
        };

        const resonance: Record<string, number> = {};
        for (const [domain, anchor] of Object.entries(anchors)) {
            resonance[domain] = hv.similarity(anchor);
        }

        // Find max resonance
        let bestDomain = 'general';
        let maxResonance = 0.45; // Threshold for specialization

        for (const [domain, score] of Object.entries(resonance)) {
            if (score > maxResonance) {
                maxResonance = score;
                bestDomain = domain;
            }
        }

        return {
            domain: bestDomain,
            confidence: maxResonance
        };
    },

    /**
     * EXTENDED HARMONY: Verify domain using LLM if confidence is low
     */
    async verifyDomainWithLLM(text: string, currentDomain: KnowledgeDomain): Promise<KnowledgeDomain> {
        // High-integrity fallback for critical decisions
        try {
            const { SCPService } = await import('./llm');
            const prompt = `Analyze the following text and classify its knowledge domain.
            
            TEXT: "${text.substring(0, 500)}..."
            
            Return ONLY the domain name in lowercase (e.g., medicine, law, quantum_physics, ancient_history, etc).`;

            const response = await SCPService.callLLM(prompt, 'liquid/lfm-2.5-1.2b-instruct:free');
            const detected = response.content.toLowerCase().trim().replace(/[^a-z0-9_]/g, '');

            if (detected && detected.length > 2) {
                return detected as KnowledgeDomain;
            }
            return currentDomain;
        } catch (e) {
            console.warn('Failed to verify domain with LLM, falling back to heuristic', e);
            return currentDomain;
        }
    },

    /**
     * TURBO OPTIMIZATION: Quick Safety Check (Deterministic, Zero LLM Cost)
     * Detects obvious constraint violations without calling LLM
     * Returns immediately if a clear violation is found
     */
    quickSafetyCheck(crystal: Crystal, answer: string): {
        obviousViolation: boolean;
        reason: string;
        violatedConstraint?: string;
        confidence: number;
    } {
        const answerLower = answer.toLowerCase();
        const constraints = crystal.constraints || [];

        // Safety violation patterns by domain
        const dangerPatterns = {
            // Medical safety violations
            medical: [
                { pattern: /you can safely|is safe to|no problem/i, violation: 'Unsafe medical advice' },
                { pattern: /combine|mix|together.*(?:maoi|ssri|medication)/i, violation: 'Dangerous drug combination' },
                { pattern: /touch.*capacitor|bare hands.*electric/i, violation: 'Electrical safety violation' }
            ],
            // Tech safety violations  
            tech: [
                { pattern: /safely touch|can touch.*capacitor/i, violation: 'Electrical safety violation' },
                { pattern: /without.*ground|no need.*safety/i, violation: 'Safety equipment bypass' },
                { pattern: /power.*off.*safe.*touch/i, violation: 'False safety assumption' }
            ],
            // General constraint violations
            general: [
                { pattern: /yes.*you can|go ahead|no problem/i, violation: 'Permissive response to safety question' }
            ]
        };

        // Check NEVER constraints
        for (const constraint of constraints) {
            if (constraint.rule === 'NEVER') {
                const constraintKeywords = constraint.value.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

                // Check if answer suggests doing the forbidden thing
                const suggestsViolation = constraintKeywords.some((keyword: string) => {
                    // Check for permissive language about the forbidden action
                    const permissivePatterns = [
                        new RegExp(`you can.*${keyword}`, 'i'),
                        new RegExp(`safe.*${keyword}`, 'i'),
                        new RegExp(`${keyword}.*is fine`, 'i'),
                        new RegExp(`yes.*${keyword}`, 'i')
                    ];
                    return permissivePatterns.some(p => p.test(answerLower));
                });

                if (suggestsViolation) {
                    return {
                        obviousViolation: true,
                        reason: `Answer violates NEVER constraint: "${constraint.value}"`,
                        violatedConstraint: constraint.id,
                        confidence: 0.9
                    };
                }
            }
        }

        // Check domain-specific danger patterns
        const domain = crystal.domain || 'general';
        const patterns = [...(dangerPatterns[domain as keyof typeof dangerPatterns] || []), ...dangerPatterns.general];

        for (const { pattern, violation } of patterns) {
            if (pattern.test(answer)) {
                return {
                    obviousViolation: true,
                    reason: violation,
                    confidence: 0.85
                };
            }
        }

        // No obvious violation found
        return {
            obviousViolation: false,
            reason: 'No obvious violation detected',
            confidence: 0.5
        };
    },

    /**
     * SILENT GUARDIAN: Detect if a text block contains a "Source of Truth"
     * (Rules, constraints, protocols that should be protected)
     */
    detectSourceOfTruth(text: string): { isSOT: boolean; confidence: number; type: string } {
        const triggers = {
            protocol: [/protocol/i, /procedimiento/i, /pasos a seguir/i, /checklist/i],
            rules: [/rules/i, /reglas/i, /normativa/i, /mandatory/i, /obligatorio/i, /prohibido/i],
            constraints: [/never/i, /always/i, /siempre/i, /nunca/i, /limitación/i, /restricción/i],
            contract: [/agreement/i, /contrato/i, /conditions/i, /términos/i, /cláusula/i],
            medical: [/treatment/i, /dosis/i, /contraindicación/i, /paciente/i]
        };

        let score = 0;
        let detectedType = 'general';

        for (const [type, patterns] of Object.entries(triggers)) {
            const matches = patterns.filter(p => p.test(text)).length;
            if (matches > 0) {
                score += matches * 0.25;
                if (matches > 1) detectedType = type;
            }
        }

        return {
            isSOT: score > 0.4,
            confidence: Math.min(score, 1.0),
            type: detectedType
        };
    }
};
