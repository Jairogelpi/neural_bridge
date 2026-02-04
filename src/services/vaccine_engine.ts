import { SCPService } from './llm';
import type { Crystal } from '../types/crystal_format';
import { Attestation } from './attestation';
import { supabase } from '../db/supabase';
import { ToonService } from '../lib/toon';


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

export interface Contradiction {
    claim_a: string;
    claim_b: string;
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
        contradiction: Contradiction
    ): Promise<SemanticVaccine | null> {
        console.log(`[VaccineEngine] 💉 Analyzing contradiction for context ${crystal.context_id}...`);

        // 1. GEOMETRIC IMMUNOLOGY: Generate Invariant Signature
        // We hash the HDC Vector resultant of the relationship, not strings.
        const { SemanticHasher } = await import('./semantic_hashing');
        const { Hypervector } = await import('../math/hypervector');

        const hvA = Hypervector.fromString(SemanticHasher.computeHolographicHash(contradiction.claim_a));
        const hvB = Hypervector.fromString(SemanticHasher.computeHolographicHash(contradiction.claim_b));

        // The contradiction is the XOR binding of the two claims (The Relationship Vector)
        const relationship = hvA.bind(hvB);
        const signatureHash = await Attestation.realSHA256(relationship.toString());

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
        
        Task: Identify the underlying LOGICAL FALLACY (e.g., Causal Reversal, Temporal Inconsistency).
        Then, write a UNIVERSAL RULE (Meta-Invariant) that prevents this specific logical error.
        
        Return TOON:
        @fallacy(Name of fallacy)
        MUST [Human readable rule]
        !logic(Precise mathematical/logical constraint)
        !pattern(Semantic pattern that triggers this error)
        `;

        const res = await SCPService.resilientCallLLM(extractionPrompt, 'google/gemini-pro', 'You are a Formal Logician.');
        const dna = ToonService.parse(res.content);
        if (!dna.metadata?.fallacy) return null;

        const vaccine: SemanticVaccine = {
            error_signature_hash: signatureHash,
            fallacy_type: dna.metadata.fallacy,
            meta_invariant: {
                rule: dna.constraints[0]?.value || 'Universal Logic Rule',
                logical_constraint: dna.proofs.logic || 'Logic == True',
                prohibited_pattern: dna.proofs.pattern || 'ANY'
            },
            context_domain: crystal.domain || 'general'
        };

        // 3. Persist to Global Vaccine Store (Inject TOON manifold into metadata for saturation)
        const vaccineToon = ToonService.stringify({
            metadata: { fallacy: dna.metadata.fallacy, domain: crystal.domain },
            graph: [{ subject: dna.metadata.fallacy, predicate: 'IS_BLOCKED_BY', object: dna.constraints[0]?.value }]
        });
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
        await Sentinel.triggerEntanglement(((vaccine as unknown as { vaccine_id?: string }).vaccine_id) || signatureHash);

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
        const signatureHash = await (await import('./attestation')).Attestation.realSHA256(signatureText);

        const extractionPrompt = `
        PRECOGNITIVE DNA EXTRACTION
        
        The Oracle predicted a future failure in an AI knowledge crystal:
        PREDICTED FAILURE: "${predictedFailure}"
        DOMAIN: "${crystal.domain}"
        
        Task: Identify the underlying LOGICAL FALLACY that would cause this.
        Write a UNIVERSAL RULE (Meta-Invariant) to BLOCK this failure before it ever happens.
        
        Return TOON:
        @fallacy(Name of fallacy)
        MUST [High-level human readable rule]
        !logic(Precise mathematical/logical constraint)
        !pattern(Semantic pattern that triggers this error)
        `;

        const res = await SCPService.resilientCallLLM(extractionPrompt, 'google/gemini-pro', 'You are a Precognitive Logician.');
        const dna = ToonService.parse(res.content);
        if (!dna.metadata.fallacy) return null;

        const vaccine: SemanticVaccine = {
            error_signature_hash: signatureHash,
            fallacy_type: dna.metadata.fallacy,
            meta_invariant: {
                rule: dna.constraints[0]?.value || 'Precognitive Rule',
                logical_constraint: dna.proofs.logic || 'Logic == True',
                prohibited_pattern: dna.proofs.pattern || 'ANY'
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
     * Returns relevant vaccines for a given source text using GEOMETRIC SEARCH (HDC)
     */
    static async getActiveGuards(source: string, domain: string): Promise<SemanticVaccine[]> {
        const { SemanticHasher } = await import('./semantic_hashing');

        // 1. Retrieve candidate vaccines for the domain (Broad filter)
        const { data, error } = await supabase
            .from('vaccines')
            .select('*')
            .eq('context_domain', domain)
            .limit(20);

        if (error || !data || data.length === 0) return [];

        // 2. GEOMETRIC FILTERING (HDC)
        // We compute the holographic hash of the source once
        const sourceHash = SemanticHasher.computeHolographicHash(source);

        // 3. Rank vaccines by similarity to the source context
        const ranked = data.map(v => {
            const vaccinePattern = v.meta_invariant?.prohibited_pattern || v.fallacy_type;
            const vaccineHash = SemanticHasher.computeHolographicHash(vaccinePattern);
            const similarity = SemanticHasher.holographicSimilarity(sourceHash, vaccineHash);
            return { vaccine: v as SemanticVaccine, similarity };
        });

        // 4. Return vaccines that cross the resonance threshold (e.g., > 0.4)
        return ranked
            .filter(r => r.similarity > 0.4)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)
            .map(r => r.vaccine);
    }
}
