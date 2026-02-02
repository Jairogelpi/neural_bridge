
import { CrystallizationService } from './services/crystallization';
import { TruthVault } from './services/truth_vault';
import { RLMEngine } from './services/rlm_engine';
import { supabase } from './db/supabase';
import type { Crystal } from './types/crystal_format';

/**
 * 🌉 NEURAL BRIDGE OMEGA
 * The Zero-Friction Universal SDK.
 * 
 * Usage:
 * const nb = new NeuralBridge({ domain: 'medical' });
 * await nb.remember("Patient has penicillin allergy");
 * const advice = await nb.ask("Can I prescribe Amoxicillin?");
 */
export class NeuralBridge {
    private domain: string;

    constructor(config: { domain?: string } = {}) {
        this.domain = config.domain || 'general';
    }

    /**
     * FLASH REMEMBER ⚡
     * Instantly ingests information using Regex+LSH (No Latency).
     * Sublimation happens in background if needed.
     */
    async remember(text: string): Promise<Crystal> {
        // 1. Mine Proto-Crystal (Flash)
        const crystal = await CrystallizationService.mineProtoCrystal(text, this.domain);

        // 2. Persist to Vault
        // In real app, we persist to DB. Here we assume TruthVault handles logic or we invoke upsert directly.
        await supabase.from('kv_store').upsert({
            key: `nb_cc_${crystal.context_id}`,
            value: crystal,
            updated_at: new Date().toISOString()
        });

        // 3. Trigger Sublimation (Async/Background)
        // We don't await this, so the user gets <5ms response
        CrystallizationService.sublimateCrystal(crystal).then(refined => {
            // Update DB with refined version
            supabase.from('kv_store').upsert({
                key: `nb_cc_${refined.context_id}`,
                value: refined,
                updated_at: new Date().toISOString()
            });
        });

        return crystal;
    }

    /**
     * OMEGA ASK 🧠
     * Retrieves truth using LSH (Fuzzy) + RLM (Wisdom).
     * Returns the best Crystal to guide your LLM.
     */
    async ask(query: string): Promise<Crystal | null> {
        // 1. Try Deterministic LSH + RLM Ranking
        const crystals = await TruthVault.retrieveSemanticallySimilar(query, this.domain);

        if (crystals.length > 0) {
            return crystals[0]; // The RLM Winner
        }

        // 2. Fallback to Standard Strict Retrieval if LSH fails
        return TruthVault.retrieveBestCrystal({ domain: this.domain });
    }

    /**
     * REINFORCE (Teach) 🎓
     * Give feedback to the system to improve future answers.
     */
    async learn(crystalId: string, helpful: boolean): Promise<void> {
        const { data } = await supabase.from('kv_store').select('value').eq('key', `nb_cc_${crystalId}`).single();
        if (!data) return;

        let crystal = data.value as Crystal;

        // Update Q-Score
        crystal = RLMEngine.updateCrystalUtility(crystal, helpful ? 1 : -1);

        // Save Wisdom
        await supabase.from('kv_store').upsert({
            key: `nb_cc_${crystalId}`,
            value: crystal,
            updated_at: new Date().toISOString()
        });
    }
}

// Export Types for Consumption
export * from './types/crystal_format';
export { CrystallizationService } from './services/crystallization';
export { TruthVault } from './services/truth_vault';
export { RLMEngine } from './services/rlm_engine';
