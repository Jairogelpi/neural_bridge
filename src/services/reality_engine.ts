import { SCPService } from './llm';
import { RealityProof } from '../types/crystal_format';

export class RealityBreachError extends Error {
    constructor(message: string, public attemptedOutput: string) {
        super(message);
        this.name = 'RealityBreachError';
    }
}

export class RealityEngine {

    /**
     * The core primitive of RCI:
     * Transforms an "Attempted Output" into a "Reality Validated Output" OR blocks it.
     */
    static async constrain(
        attemptedOutput: string,
        domain: string,
        constraints: string[]
    ): Promise<RealityProof> {

        console.log(`[RCI] Verifying reality constraint for domain: ${domain}`);
        constraints.forEach(c => console.log(`      - "${c}"`));

        // Metaprompt that FORCES the judge model to be a strict reality checker
        const proofSystemPrompt = `
        You are the REALITY KERNEL. Your job is to prevent AI Hallucinations from existing.
        You will receive an "Attempted Output" and a set of "Reality Constraints".
        
        If the output VIOLATES any constraint, or invents facts outside the constraints, you must REJECT it.
        
        Return ONLY a JSON object:
        {
            "valid": boolean,
            "confidence": number (0.0-1.0),
            "reason": "string explanation"
        }
        `;

        const userPrompt = `
        DOMAIN: ${domain}
        CONSTRAINTS:
        ${constraints.map(c => `- ${c}`).join('\n')}

        ATTEMPTED OUTPUT:
        """${attemptedOutput}"""
        `;

        const response = await SCPService.callLLM(userPrompt, 'anthropic/claude-3.5-sonnet', proofSystemPrompt);

        let verdict;
        try {
            verdict = JSON.parse(response.content);
        } catch (e) {
            // If the kernel fails to speak JSON, we treat it as unsafe
            throw new RealityBreachError("Reality Kernel Integrity Failure", attemptedOutput);
        }

        if (!verdict.valid) {
            throw new RealityBreachError(`REALITY CHECK FAILED: ${verdict.reason}`, attemptedOutput);
        }

        // If we get here, the output IS REAL.
        return {
            domain,
            constraints,
            status: 'valid',
            confidence: verdict.confidence,
            checked_at: new Date().toISOString(),
            attestation_id: `por_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        };
    }

    /**
     * ARD (AI Refusal by Design)
     * Checks if the INTENT itself is ontologically possible.
     * Returns a "Proof of Impossibility" if the request cannot exist in reality.
     */
    static async validateIntent(
        intent: string,
        domainModel: string[]
    ): Promise<{ possible: boolean; reason: string; violated_constraints: string[] }> {

        console.log(`[ARD] Testing Ontological Possibility: "${intent}"`);

        const systemPrompt = `
        You are an ONTOLOGICAL ENGINE. Your task is to determine if a user's INTENT is logically or physically possible within the given REALITY MODEL.
        
        You do not check for ethics or safety. You check for EXISTENCE.
        
        REALITY MODEL:
        ${domainModel.map(r => `- ${r}`).join('\n')}
        
        If the intent contradicts the Reality Model, you must declare it IMPOSSIBLE.
        
        Return JSON:
        {
            "possible": boolean,
            "violated_constraints": string[], 
            "reason": "Scientific/Legal explanation of why this state cannot exist"
        }
        `;

        const response = await SCPService.callLLM(`INTENT: ${intent}`, 'anthropic/claude-3.5-sonnet', systemPrompt);

        try {
            return JSON.parse(response.content);
        } catch (e) {
            return { possible: false, reason: "Ontological Kernel Error", violated_constraints: [] };
        }
    }

    /**
     * UNIVERSAL REALITY DISCOVERY
     * Dynamically identifies the domain and its immutable laws based on the intent.
     * This removes the need for hardcoded constraints.
     */
    static async inferRealityModel(intent: string): Promise<{ domain: string; constraints: string[] }> {
        console.log(`[RCI] Discovering Reality Model for: "${intent}"...`);

        const systemPrompt = `
        You are the AXIOM EXTRACTOR. Your job is to identify the governing "Laws of Reality" for a given user intent.
        
        1. Identify the DOMAIN (e.g., "Thermodynamics", "GDPR Compliance", "Structural Engineering").
        2. List 3-5 IMMUTABLE LAWS or AXIOMS that MUST be true in this domain.
           - Do not list output formatting rules.
           - List fundamental truths (e.g., "Energy cannot be created", "Contracts require consideration").
        
        Return JSON:
        {
            "domain": "string",
            "constraints": ["law 1", "law 2", "law 3"]
        }
        `;

        const response = await SCPService.callLLM(`INTENT: ${intent}`, 'anthropic/claude-3.5-sonnet', systemPrompt);

        try {
            return JSON.parse(response.content);
        } catch (e) {
            console.error("Failed to infer reality:", e);
            return { domain: "universal_fallback", constraints: ["Logic must be consistent"] };
        }
    }
}
