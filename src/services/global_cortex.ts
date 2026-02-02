
import { supabase } from '../db/supabase';
import type { Crystal } from '../types/crystal_format';
import { TruthVault } from './truth_vault';

/**
 * GLOBAL CORTEX (Collective Intelligence) 🌌🤝
 * 
 * Goal: A decentralized knowledge network where every verified truth
 * discovered by one user strengthens the entire ecosystem.
 */
export class GlobalCortex {

    /**
     * Publishes a verified Crystal to the Global Ledger.
     * Knowledge is anonymized (author_id removed or masked).
     */
    static async publish(crystal: Crystal): Promise<void> {
        if (!crystal.verification?.canonical_hash) return;

        // Anonymization: Ensure no PII or User IDs are leaked
        const globalCrystal = {
            ...crystal,
            author_id: 'anonymous_contributor',
            tags: [...(crystal.tags || []), 'global_contributed']
        };

        console.log(`[GlobalCortex] 📢 Publishing knowledge to the collective: "${crystal.intent.primary}"`);

        // We use a separate 'global_crystals' table or a flag in the main table
        // For this architecture, we use a 'is_global' flag.
        await supabase
            .from('crystals')
            .upsert({ ...globalCrystal, is_global: true });
    }

    /**
     * Retrieves knowledge from the global pool using Mutual Information.
     * Knowledge is selected if it maximizes Information Gain relative to the query.
     */
    static async globalRetrieve(query: string): Promise<Crystal[]> {
        const { Hypervector } = await import('../math/hypervector');
        const { SemanticHasher } = await import('./semantic_hashing');

        console.log(`[GlobalCortex] 🌌 CONSULTING GALACTIC LEDGER (MI-Retrieval) for: "${query}"...`);

        // 1. Fetch all global candidates
        const { data } = await supabase
            .from('crystals')
            .select('*')
            .eq('is_global', true);

        if (!data || data.length === 0) return [];

        // 2. Compute Query Hypervector
        const queryHv = Hypervector.fromString(SemanticHasher.computeHolographicHash(query));

        // 3. Rank by Mutual Information (Geometric Resonance)
        const ranked = data.map(c => {
            const crystal = c as unknown as Crystal;
            const crystalHv = Hypervector.fromString(crystal.verification?.canonical_hash || '');

            // MI ≈ Resonance Score
            const resonance = queryHv.similarity(crystalHv);

            // 🌀 INFORMATION GAIN: Weight by Fisher Info (Certainty)
            const infoGain = resonance * crystalHv.getFisherInformation();

            return { crystal, infoGain };
        });

        return ranked
            .sort((a, b) => b.infoGain - a.infoGain)
            .slice(0, 5)
            .map(r => r.crystal);
    }
}
