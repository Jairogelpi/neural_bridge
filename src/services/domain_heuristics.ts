export type KnowledgeDomain = 'medicine' | 'law' | 'tech' | 'finance' | 'education' | 'creative' | 'corporate' | 'general';

export interface DomainScore {
    domain: KnowledgeDomain;
    confidence: number;
}

export const DomainHeuristics = {
    /**
     * Analyze text to detect the knowledge domain
     */
    detect(text: string): DomainScore {
        const t = text.toLowerCase();

        const keywords = {
            medicine: ['patient', 'prescribe', 'drug', 'clinical', 'diagnosis', 'treatment', 'hospital', 'therapy', 'pharmacological', 'paciente', 'dosis', 'médico'],
            law: ['contract', 'legal', 'litigation', 'attorney', 'clause', 'regulation', 'compliance', 'jurisdiction', 'agreement', 'contrato', 'cláusula', 'ley', 'derecho'],
            tech: ['code', 'api', 'server', 'database', 'frontend', 'backend', 'algorithm', 'deployment', 'interface', 'variable', 'código', 'servidor', 'datos'],
            finance: ['investment', 'portfolio', 'asset', 'trading', 'market', 'equity', 'revenue', 'fiduciary', 'capital', 'inversión', 'mercado', 'activo', 'ingresos'],
            education: ['teaching', 'curriculum', 'lesson', 'student', 'educational', 'academic', 'pedagogy', 'learning', 'enseñanza', 'clase', 'estudiante'],
            creative: ['branding', 'design', 'copywriting', 'artistic', 'narrative', 'scripts', 'visual', 'composition', 'diseño', 'arte', 'escritura'],
            corporate: ['strategy', 'logistics', 'operations', 'hr', 'management', 'roadmap', 'stakeholder', 'quarterly', 'estrategia', 'logística', 'gestión']
        };

        const scores: Record<KnowledgeDomain, number> = {
            medicine: 0,
            law: 0,
            tech: 0,
            finance: 0,
            education: 0,
            creative: 0,
            corporate: 0,
            general: 0.1 // Base confidence
        };

        for (const [domain, words] of Object.entries(keywords)) {
            words.forEach(word => {
                if (t.includes(word)) {
                    scores[domain as KnowledgeDomain] += 1;
                }
            });
        }

        // Find max
        let bestDomain: KnowledgeDomain = 'general';
        let maxScore = 0;

        for (const [domain, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                bestDomain = domain as KnowledgeDomain;
            }
        }

        // Normalize confidence (0 to 1)
        const confidence = Math.min(maxScore / 5, 1.0);

        return {
            domain: confidence > 0.2 ? bestDomain : 'general',
            confidence: Math.max(confidence, 0.1)
        };
    },

    /**
     * EXTENDED HARMONY: Verify domain using LLM if confidence is low
     */
    async verifyDomainWithLLM(text: string, currentDomain: KnowledgeDomain): Promise<KnowledgeDomain> {
        // High-integrity fallback for critical decisions
        return currentDomain; // Placeholder for future LLM call implementation
    },

    /**
     * TURBO OPTIMIZATION: Quick Safety Check (Deterministic, Zero LLM Cost)
     * Detects obvious constraint violations without calling LLM
     * Returns immediately if a clear violation is found
     */
    quickSafetyCheck(crystal: any, answer: string): { 
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
