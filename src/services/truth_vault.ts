import { supabase } from '../db/supabase';
import { SCPService } from './llm';
import { Attestation } from './attestation';
import { CrystallizationService } from './crystallization';
import { SemanticHasher } from './semantic_hashing';
import { RLMEngine } from './rlm_engine';
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
            .from('kv_store')
            .select('value')
            .filter('key', 'like', 'nb_cc_%');

        if (error || !existingCrystals) return [];

        const contradictions: Contradiction[] = [];

        // 2. Cross-verify claims using LLM
        for (const item of existingCrystals) {
            const existing = item.value;
            if (existing.context_id === newCrystal.context_id) continue;

            // Only compare if domains match or are related
            if (existing.domain !== newCrystal.domain) continue;

            const systemPrompt = `You are the Neural Bridge Truth Arbiter.
Analyze two knowledge crystals and detect if they contain CONTRADICTING information.
Contradictions are direct logical conflicts (e.g., A says "X is true", B says "X is false").

Return JSON:
{
  "has_contradiction": boolean,
  "explanation": "why they conflict",
  "claim_a": "conflicting claim from A",
  "claim_b": "conflicting claim from B",
  "severity": "critical|warning"
}`;

            const prompt = `Crystal A (New): ${JSON.stringify(newCrystal.constraints)}
Crystal B (Existing): ${JSON.stringify(existing.constraints)}

Do these conflict?`;

            try {
                const response = await SCPService.callLLM(prompt, 'nvidia/nemotron-3-nano-30b-a3b:free', systemPrompt);
                const result = JSON.parse(response.content.replace(/```json|```/g, '').trim());

                if (result.has_contradiction) {
                    contradictions.push({
                        crystal_id_a: newCrystal.context_id,
                        crystal_id_b: existing.context_id,
                        claim_a: result.claim_a,
                        claim_b: result.claim_b,
                        explanation: result.explanation,
                        severity: result.severity
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

            // 2. 💉 SYNTHESIZE VACCINE
            // Extract the "Logical DNA" to prevent this error globally.
            const { VaccineEngine } = await import('./vaccine_engine');

            // Reconstruct a partial crystal for context
            const { data: crystalData } = await supabase.from('crystals').select('*').eq('context_id', c.crystal_id_a).single();
            if (crystalData) {
                await VaccineEngine.synthesizeFromContradiction(crystalData, c);
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
            .from('kv_store')
            .select('value')
            .filter('key', 'like', 'nb_cc_%') // Filter for crystals

        // In a real DB we'd filter by JSON column, here we filter in memory for MVP
        const { data, error } = await query;

        if (error || !data || data.length === 0) return null;

        // 2. Client-side deterministic filtering (until we index JSONb)
        const candidates: Crystal[] = data
            .map(row => row.value as Crystal)
            .filter(c => c.domain === params.domain);

        if (candidates.length === 0) return null;



        // ... (existing code for search logic)

        // 3. Score by tag overlap (Deterministic Ranking)
        if (params.tags && params.tags.length > 0) {
            candidates.sort((a, b) => {
                const aMatches = (a.tags || []).filter(t => params.tags?.includes(t)).length;
                const bMatches = (b.tags || []).filter(t => params.tags?.includes(t)).length;
                return bMatches - aMatches;
            });
        }

        let best = candidates[0] || null;

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

        // 2. Fetch all candidates in domain (Flash/Proto + Verified)
        // In a real DB, we would use a Bit-Search Index (e.g. pgvector or custom bitmask)
        // Here we fetch all and filter in memory (MVP)
        const { data, error } = await supabase
            .from('kv_store')
            .select('value')
            .filter('key', 'like', 'nb_cc_%');

        if (error || !data) return [];

        let candidates: Crystal[] = [];

        for (const row of data) {
            const crystal = row.value as Crystal;
            if (crystal.domain !== domain) continue;

            // Find LSH tag
            const lshTag = (crystal.tags || []).find(t => t.startsWith('lsh:'));
            if (!lshTag) continue;

            const storedHash = lshTag.replace('lsh:', '');

            // 3. Compare with Hamming Distance
            const distance = SemanticHasher.hammingDistance(queryHash, storedHash);

            // Threshold: < 15 bits difference = Very Semantically Similar
            if (distance <= 15) {
                candidates.push(crystal);
            }
        }

        // 4. RLM RE-RANKING (Brain Upgrade) 🧠
        // Instead of just sorting by distance, we sort by "Wisdom" (Q-Score + Exploration)
        // REAL STATS: Sum of usage of this cohort (Contextual Bandit Horizon)
        const totalSystemUsage = candidates.reduce((sum, c) => sum + (c.rlm_stats?.usage_count || 0), 0) || 1;
        candidates = RLMEngine.rankCandidates(candidates, totalSystemUsage);

        return candidates;
    }
}
