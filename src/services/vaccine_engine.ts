import { SCPService } from './llm';
import { Crystal } from '../types/crystal_format';
import { supabase } from '../db/supabase';


export interface SemanticVaccine {
    vaccine_id?: string;
    error_signature_hash: string;
    fallacy_type: string;
    meta_invariant: {
        rule: string;
        logical_constraint: string;
        prohibited_pattern: string;
    };
    context_domain: string;
}

/**
 * SEMANTIC IMMUNITY ENGINE (Vaccine Synthesis)
 * 
 * Logic:
 * 1. Detect: TruthVault identifies a contradiction.
 * 2. Extract: Identify the "Logical DNA" (the abstract reason for the fail).
 * 3. Synthesize: Create a Meta-Invariant that prevents this logical pattern.
 * 4. Immunize: Inject the vaccine into all future verifications in the same domain.
 */
export class VaccineEngine {

    /**
     * Extracts the "Logical DNA" of a contradiction and creates a vaccine.
     */
    static async synthesizeFromContradiction(
        crystal: Crystal,
        contradiction: any
    ): Promise<SemanticVaccine | null> {
        console.log(`[VaccineEngine] 💉 Analyzing contradiction for context ${crystal.context_id}...`);

        // 1. Generate Signature (Based on the semantic clash)
        // We use SMT to hash the relationship between the contradicting claims
        const signatureText = `FAIL_PATTERN: [${contradiction.claim_a}] vs [${contradiction.claim_b}]`;
        const signatureHash = crypto.createHash('sha256').update(signatureText).digest('hex');

        // Check if vaccine already exists
        const { data: existing } = await supabase
            .from('vaccines')
            .select('*')
            .eq('error_signature_hash', signatureHash)
            .single();

        if (existing) {
            console.log(`[VaccineEngine] ⚡ Vaccine already exists for this pattern. Strengthening...`);
            await supabase.rpc('increment_vaccine_potency', { vid: existing.vaccine_id });
            return existing;
        }

        // 2. Extract Logical DNA via LLM
        const extractionPrompt = `
        LOGICAL DNA EXTRACTION
        
        A contradiction was found in an AI-generated knowledge crystal:
        CLAIM A: "${contradiction.claim_a}"
        CLAIM B: "${contradiction.claim_b}"
        
        Task: Identify the underlying LOGICAL FALLACY (e.g., Causal Reversal, Temporal Inconsistency, Scope Creep).
        Then, write a UNIVERSAL RULE (Meta-Invariant) that prevents this specific logical error.
        
        Return JSON:
        {
            "fallacy": "string",
            "rule": "High-level human readable rule",
            "logical_constraint": "Precise mathematical/logical constraint",
            "pattern_to_block": "Semantic pattern that triggers this error"
        }
        `;

        const res = await SCPService.resilientCallLLM(extractionPrompt, 'google/gemini-pro', 'You are a Formal Logician.');
        let dna;
        try {
            dna = JSON.parse(res.content);
        } catch {
            return null;
        }

        const vaccine: SemanticVaccine = {
            error_signature_hash: signatureHash,
            fallacy_type: dna.fallacy,
            meta_invariant: {
                rule: dna.rule,
                logical_constraint: dna.logical_constraint,
                prohibited_pattern: dna.pattern_to_block
            },
            context_domain: crystal.domain || 'general'
        };

        // 3. Persist to Global Vaccine Store
        const { error } = await supabase.from('vaccines').insert({
            ...vaccine,
            meta_invariant: vaccine.meta_invariant
        });

        if (error) {
            console.error('[VaccineEngine] ❌ Failed to store vaccine:', error.message);
            return null;
        }

        console.log(`[VaccineEngine] ✅ New Vaccine synthesized: ${dna.fallacy} ("${dna.rule}")`);

        // 4. THE SENTINEL: Notify and Trigger Entanglement
        const { Sentinel } = await import('./sentinel');
        await Sentinel.emit({
            type: 'VACCINE_SYNTHESIS',
            severity: 'info',
            message: `New Vaccine synthesized for ${dna.fallacy}: "${dna.rule}"`,
            details: { fallacy: dna.fallacy, rule: dna.rule, domain: crystal.domain }
        });

        // Retroactively heal the global lattice
        await Sentinel.triggerEntanglement((vaccine as any).vaccine_id || signatureHash);

        return vaccine;
    }

    /**
     * 🔮 PRECOGNITIVE VACCINATION
     * Synthesizes a vaccine for a failure that hasn't happened yet (predicted by the Oracle).
     */
    static async synthesizePrecognitiveVaccine(
        crystal: Crystal,
        predictedFailure: string
    ): Promise<SemanticVaccine | null> {
        console.log(`[VaccineEngine] 🔮 Precognitive synthesis for predicted error: "${predictedFailure}"`);

        const signatureText = `PRECOGNITIVE_FAILURE: [${predictedFailure}] in DOMAIN: [${crystal.domain}]`;
        const signatureHash = crypto.createHash('sha256').update(signatureText).digest('hex');

        const extractionPrompt = `
        PRECOGNITIVE DNA EXTRACTION
        
        The Oracle predicted a future failure in an AI knowledge crystal:
        PREDICTED FAILURE: "${predictedFailure}"
        DOMAIN: "${crystal.domain}"
        
        Task: Identify the underlying LOGICAL FALLACY that would cause this.
        Write a UNIVERSAL RULE (Meta-Invariant) to BLOCK this failure before it ever happens.
        
        Return JSON:
        {
            "fallacy": "string",
            "rule": "High-level human readable rule",
            "logical_constraint": "Precise mathematical/logical constraint",
            "pattern_to_block": "Semantic pattern that triggers this error"
        }
        `;

        const res = await SCPService.resilientCallLLM(extractionPrompt, 'google/gemini-pro', 'You are a Precognitive Logician.');
        let dna;
        try {
            dna = JSON.parse(res.content);
        } catch {
            return null;
        }

        const vaccine: SemanticVaccine = {
            error_signature_hash: signatureHash,
            fallacy_type: dna.fallacy,
            meta_invariant: {
                rule: dna.rule,
                logical_constraint: dna.logical_constraint,
                prohibited_pattern: dna.pattern_to_block
            },
            context_domain: crystal.domain || 'general'
        };

        await supabase.from('vaccines').insert({
            ...vaccine,
            meta_invariant: vaccine.meta_invariant
        });

        console.log(`[VaccineEngine] 💉 PRE-IMMUNIZED: System is now protected against "${dna.fallacy}" (Oracle Prediction).`);
        return vaccine;
    }

    /**
     * Returns relevant vaccines for a given source text to be used as pre-emptive guards.
     */
    static async getActiveGuards(source: string, domain: string): Promise<SemanticVaccine[]> {
        // In a real system, we'd use vector search to find vaccines with similar 'prohibited_patterns'
        // For this implementation, we pull top vaccines for the domain.
        const { data, error } = await supabase
            .from('vaccines')
            .select('*')
            .eq('context_domain', domain)
            .order('severity', { ascending: false })
            .limit(5);

        if (error || !data) return [];
        return data as SemanticVaccine[];
    }
}

import crypto from 'crypto';
