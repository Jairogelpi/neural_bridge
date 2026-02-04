import { supabase } from '../db/supabase';
import { SCPService } from './llm';
import { Attestation } from './attestation';
import { CrystallizationService } from './crystallization';
import { ToonService } from '../../dashboard/src/lib/toon';
import { SemanticHasher } from './semantic_hashing';
import { RLMEngine } from './rlm_engine';
import { Hypervector } from '../math/hypervector';
import type { Crystal } from '../types/crystal_format';

export interface Contradiction {
    crystal_id_a: string;
    crystal_id_b: string;
    claim_a: string;
    claim_b: string;
    explanation: string;
    severity: 'critical' | 'warning';
}

/**
 * The Self-Healing Truth Vault
 * Detects and resolves contradictions across all stored knowledge crystals.
 */
export class TruthVault {

    /**
     * Scan for contradictions between a new crystal and existing ones.
     */
    static async scanForContradictions(newCrystal: Crystal): Promise<Contradiction[]> {
        // 1. Get similar crystals from Supabase (by domain or tags)
        const { data: existingCrystals, error } = await supabase
            .from('crystals')
            .select('*');

        if (error || !existingCrystals) return [];

        const contradictions: Contradiction[] = [];

        // 2. Cross-verify claims using LLM
        for (const existing of existingCrystals) {
            if (existing.context_id === newCrystal.context_id) continue;

            // Only compare if domains match or are related
            if (existing.domain !== newCrystal.domain) continue;

            const systemPrompt = `You are the Neural Bridge Truth Arbiter.
Analyze two TOON manifolds and detect if they contain CONTRADICTING information.
Contradictions are direct logical conflicts between Axioms (e.g., MUST [X] vs NEVER [X]).

Return TOON:
@has_contradiction(true/false)
MUST [Explanation of conflict]
!claim_a(conflicting claim from A)
!claim_b(conflicting claim from B)
@severity(critical|warning)
`;

            const prompt = `Manifold A (New): ${newCrystal.raw_toon}
Manifold B (Existing): ${existing.raw_toon}

Do these conflict?`;

            try {
                const response = await SCPService.callLLM(prompt, 'nvidia/nemotron-3-nano-30b-a3b:free', systemPrompt);
                const result = ToonService.parse(response.content);

                if (result.metadata.has_contradiction === 'true') {
                    contradictions.push({
                        crystal_id_a: newCrystal.context_id,
                        crystal_id_b: existing.context_id,
                        claim_a: result.proofs.claim_a,
                        claim_b: result.proofs.claim_b,
                        explanation: result.constraints[0]?.value || 'Conflict detected',
                        severity: (result.metadata.severity as any) || 'warning'
                    });
                }
            } catch (e) {
                console.error('Error during contradiction scan:', e);
            }
        }

        return contradictions;
    }

    /**
     * Heal the vault by marking contradictory crystals or generating a resolution crystal.
     * 💉 INTEGRATION: Synthesize Semantic Vaccines from contradictions.
     */
    static async heal(contradictions: Contradiction[]): Promise<void> {
        for (const c of contradictions) {
            console.log(`[SELF-HEALING] Contradiction detected: ${c.explanation}`);

            // 1. Log to contradiction store
            await supabase.from('kv_store').upsert({
                key: `contradiction_${Date.now()}`,
                value: c,
                updated_at: new Date().toISOString()
            });

            // 2. 🧬 DARWINIAN SYNTHESIS
            // Instead of just flagging, we breed the conflicting crystals to find a superior resolution.
            const { EvolutionEngine } = await import('./evolution_engine');
            const { data: crystalA } = await supabase.from('crystals').select('*').eq('context_id', c.crystal_id_a).single();
            const { data: crystalB } = await supabase.from('crystals').select('*').eq('context_id', c.crystal_id_b).single();

            if (crystalA && crystalB) {
                console.log(`[TruthVault] 🧬 Breeding resolution for contradiction: ${c.crystal_id_a} x ${c.crystal_id_b}`);
                const child = EvolutionEngine.breed(crystalA as unknown as Crystal, crystalB as unknown as Crystal);

                // Save the evolved child as a new verified truth
                await this.saveTruth(child);

                // Mark parents as "superseded" or "reconciled"
                await supabase.from('crystals').update({ status: 'archived' }).in('context_id', [c.crystal_id_a, c.crystal_id_b]);
            }

            // 3. 💉 SYNTHESIZE VACCINE (Immunization against the error pattern)
            const { VaccineEngine } = await import('./vaccine_engine');
            if (crystalA) {
                await VaccineEngine.synthesizeFromContradiction(crystalA as unknown as Crystal, c);
            }
        }
    }
    /**
     * Retrieve the best Crystal for a given query/domain.
     * This replaces RAG vector search with deterministic key/tag lookup.
     */
    static async retrieveBestCrystal(params: { domain: string; tags?: string[] }): Promise<Crystal | null> {
        // 1. Try exact match by domain (simplest deterministic retrieval)
        let query = supabase
            .from('crystals')
            .select('*');

        const { data: candidates, error } = await query;

        if (error || !candidates || candidates.length === 0) return null;

        // 2. Filter by domain in code (or use .eq('domain', params.domain) in query)
        const filtered = candidates.filter(c => c.domain === params.domain);

        if (filtered.length === 0) return null;



        // ... (existing code for search logic)

        // 3. Score by tag overlap (Deterministic Ranking)
        if (params.tags && params.tags.length > 0) {
            filtered.sort((a, b) => {
                const aMatches = (a.tags || []).filter((t: string) => params.tags?.includes(t)).length;
                const bMatches = (b.tags || []).filter((t: string) => params.tags?.includes(t)).length;
                return bMatches - aMatches;
            });
        }

        let best = filtered[0] || null;

        // ⚡ SUBLIMATION PROTOCOL
        // If we hit a "Proto-Crystal" (Regex/Flash), we must refine it Just-In-Time.
        if (best && (best.tier === 'community' || (best as any).type === 'proto')) {
            // Check heuristics (if it looks like a crude regex dump)
            // or simply trust the sublimate function to check id/tier
            best = await CrystallizationService.sublimateCrystal(best);
        }



        // ... (existing imports)

        // Return the highest-fidelity crystal
        return best;
    }

    /**
     * FUZZY RETRIEVAL (The RAG Killer) 🔫
     * Uses LSH Hamming Distance to find semantically similar crystals WITHOUT embeddings.
     * + RLM (Active Inference): Re-ranks based on learned utility.
     */
    static async retrieveSemanticallySimilar(query: string, domain: string): Promise<Crystal[]> {
        // 1. Compute SimHash of the user's query
        const queryHash = SemanticHasher.computeSimHash(query);

        // 2. Fetch all candidates in domain
        const { data: candidates, error } = await supabase
            .from('crystals')
            .select('*')
            .eq('domain', domain);

        if (error || !candidates) return [];

        const scored: { crystal: Crystal; score: number }[] = [];

        for (const raw of candidates) {
            const crystal = raw as unknown as Crystal;
            const lshTag = (crystal.tags || []).find((t: string) => t.startsWith('lsh:'));
            if (!lshTag) continue;

            const storedHash = lshTag.replace('lsh:', '');

            // 3. Compare with Hamming Distance
            const distance = SemanticHasher.hammingDistance(queryHash, storedHash);
            let score = 1 - (distance / 64);

            // 🌌 SEMANTIC GRAVITY (Mass-Based Priority)
            // Crystals with high bit density (Axioms) exert more pull.
            const hv = Hypervector.fromString(crystal.verification?.canonical_hash || '');
            const density = hv.getFisherInformation(); // Certainty acts as mass
            score += (density * 0.15); // Boost foundational truths

            if (score > 0.4) {
                scored.push({ crystal, score });
            }
        }

        const topCrystals = scored
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(s => s.crystal);

        // 4. ACTIVE INFERENCE (RLM RANKING) 🧠
        // Re-ranks based on learned utility, exploration bonus, and Fisher certainty.
        const { data: usageData } = await supabase.from('crystals').select('usage_count');
        const totalSystemUsage = (usageData || []).reduce((sum, c) => sum + (c.usage_count || 0), 0) || 1000;

        const { RLMEngine } = await import('./rlm_engine');
        return RLMEngine.rankCandidates(topCrystals, totalSystemUsage, domain);
    }

    /**
     * Checks if the incoming text contradicts previously verified truths.
     * Use LSH/HDC Similarity to find relevant truths quickly.
     */
    static async checkReality(text: string, domain: string): Promise<{ is_conflict: boolean; contradiction_reason?: string; conflicting_entry?: any }> {
        console.log(`[TruthVault] 🛡️ Defending reality for domain: ${domain}...`);

        // 1. Compute Semantic Hash of the input to find candidates
        const queryHash = SemanticHasher.computeSimHash(text);

        // 2. Fetch candidates in domain
        const { data: candidates, error } = await supabase
            .from('crystals')
            .select('*')
            .eq('domain', domain)
            .limit(10); // Check top 10 most relevant

        if (error || !candidates || candidates.length === 0) return { is_conflict: false };

        // 3. Perform Logic Scan using LLM Arbiter (The Truth Arbiter)
        for (const raw of candidates) {
            const crystal = raw as unknown as Crystal;

            // Check relevance via Hamming Distance first (Geometric gate)
            const lshTag = (crystal.tags || []).find((t: string) => t.startsWith('lsh:'));
            const storedHash = lshTag ? lshTag.replace('lsh:', '') : crystal.verification?.canonical_hash;

            if (storedHash) {
                const distance = SemanticHasher.hammingDistance(queryHash, storedHash);
                if (distance > 32) continue; // Too semantically distant to conflict
            }

            const arbiterPrompt = `
            REALITY ARBITRATION
            ---
            You are a Neural Bridge Truth Arbiter. Verify if the NEW TEXT contradicts the established FOUNDATION TRUTH.
            
            FOUNDATION TRUTH (Crystal):
            "${JSON.stringify(crystal.constraints)}"
            
            NEW TEXT:
            "${text}"
            
            TASK: Identify if the new text has a logic-level contradiction with the truth.
            
            Return TOON:
            @is_conflict(true/false)
            MUST [precise explanation of the logic failure]
            `;

            try {
                const res = await SCPService.resilientCallLLM(arbiterPrompt, 'nvidia/nemotron-3-nano-30b-a3b:free', 'Arbiter of Reality');
                const result = ToonService.parse(res.content);

                if (result.metadata.is_conflict === 'true') {
                    return {
                        is_conflict: true,
                        contradiction_reason: result.constraints[0]?.value || 'Undefined logic conflict',
                        conflicting_entry: crystal
                    };
                }
            } catch (e) {
                console.warn("[TruthVault] Arbitration failed for candidate:", crystal.context_id);
            }
        }

        return { is_conflict: false };
    }

    /**
     * Corrects a conflicting reality based on the Truth Vault's source of truth.
     */
    static async healReality(text: string, conflict: { reason: string, entry: any }): Promise<string> {
        console.log(`[TruthVault] 💉 Healing reality conflict: "${conflict.reason}"...`);

        const healingPrompt = `
        ONTOLOGICAL HEALING
        ---
        The following text contains a contradiction with the Truth Vault.
        
        ERROR: "${conflict.reason}"
        TRUTH: "${conflict.entry.raw_toon || JSON.stringify(conflict.entry.constraints)}"
        ORIGINAL TEXT: "${text}"
        
        TASK: Rewrite the ORIGINAL TEXT so that it is factually consistent with the TRUTH.
        Keep the user's intent but remove the contradiction.
        
        Return ONLY the healed text.
        `;

        const res = await SCPService.resilientCallLLM(healingPrompt, 'google/gemini-2.0-flash-exp:free', 'Time-Traveling Truth Healer');
        return res.content.trim();
    }

    /**
     * Crystallizes a new truth into the global archive.
     */
    static async saveTruth(crystal: Crystal): Promise<void> {
        console.log(`[TruthVault] 💎 Crystallizing new truth: ${crystal.context_id.substring(0, 8)}`);

        // Add LSH tag for fast future retrieval
        const queryHash = SemanticHasher.computeSimHash(crystal.intent.primary);
        const tags = [...(crystal.tags || []), `lsh:${queryHash}`];

        const { error } = await supabase
            .from('crystals')
            .upsert({
                context_id: crystal.context_id,
                domain: crystal.domain,
                intent: crystal.intent,
                constraints: crystal.constraints,
                entities: crystal.entities,
                verification: crystal.verification,
                raw_toon: crystal.raw_toon, // TOON SATURATION
                tags: tags,
                usage_count: (crystal as any).usage_count || 1,
                author: crystal.author,
                source: crystal.source,
                created_at: crystal.created_at || new Date().toISOString()
            });

        if (error) {
            console.error('[TruthVault] ❌ Failed to save truth:', error.message);
        } else {
            console.log('[TruthVault] ✅ Knowledge persistent in collective lattice.');
        }
    }
}

export const truthVault = TruthVault;
