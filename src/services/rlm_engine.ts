
import type { Crystal } from '../types/crystal_format';

/**
 * REINFORCEMENT LOGIC MODELING (RLM) ENGINE 🧠
 * 
 * Implements "Active Inference" for Knowledge Crystals.
 * Converts static data into "Living Wisdom" that evolves based on utility.
 */
export class RLMEngine {

    /**
     * DYNAMIC HYPERPARAMETERS 0️⃣
     * 
     * ALPHA and C react to the domain's Real-Time Stability.
     */
    private static async getDynamicParams(domain: string): Promise<{ alpha: number, c: number }> {
        const { LogicTuner } = await import('./logic_tuner');
        const { supabase } = await import('../db/supabase');

        const { data } = await supabase.from('crystals').select('*').eq('domain', domain);
        const crystals = (data || []) as any;

        const stability = LogicTuner.calculateStability(crystals);

        // Alpha (Learning Rate): More stable = slower learning (wisdom preservation)
        const alpha = 0.2 * (1 - stability); // Scale 0.05 - 0.2

        // C (Exploration): Less stable = higher curiosity
        const c = 1.0 + (1 - stability); // Scale 1.0 - 2.0

        return {
            alpha: Math.max(alpha, 0.05),
            c: Math.min(c, 2.0)
        };
    }

    /**
     * Updates the Crystal's Q-Score based on user feedback.
     * Uses Exponential Moving Average (EMA) approximation for Q-Learning.
     * 
     * @param crystal The crystal to update
     * @param reward +1 (Helpful), -1 (Harmful/Hallucinated), 0 (Neutral)
     */
    static async updateCrystalUtility(crystal: Crystal, reward: number, domain: string = 'general'): Promise<Crystal> {
        // Initialize if missing
        if (!crystal.rlm_stats) {
            crystal.rlm_stats = {
                q_score: 0.5, // Start neutral
                usage_count: 0,
                last_reward_at: new Date().toISOString(),
                volatility: 0.1
            };
        }

        const stats = crystal.rlm_stats;
        stats.usage_count += 1;
        stats.last_reward_at = new Date().toISOString();

        // 0️⃣ ZERO-CONSTANT INFERENCE
        const { alpha } = await this.getDynamicParams(domain);

        const target = (reward + 1) / 2; // Map -1..1 to 0..1

        const oldQ = stats.q_score;
        const newQ = oldQ + alpha * (target - oldQ);

        stats.q_score = parseFloat(newQ.toFixed(4));
        stats.volatility = Math.abs(newQ - oldQ);

        return crystal;
    }

    /**
     * Calculates the Exploration Bonus using UCB1.
     * High bonus for rarely used crystals.
     * Low bonus for well-known crystals.
     */
    static async calculateExplorationBonus(crystal: Crystal, totalSystemUsage: number, domain: string = 'general'): Promise<number> {
        if (!crystal.rlm_stats || crystal.rlm_stats.usage_count === 0) {
            return 1.0; // Max bonus if never seen (Infinite curiosity)
        }

        // 0️⃣ ZERO-CONSTANT INFERENCE
        const { c } = await this.getDynamicParams(domain);

        const bonus = c * Math.sqrt(Math.log(totalSystemUsage) / crystal.rlm_stats.usage_count);

        // Clamp to avoid craziness
        return Math.min(bonus, 1.0);
    }

    /**
     * Rank candidates by combining Exploitation (Q-Score) + Exploration (Bonus) + Certainty (Fisher).
     */
    static async rankCandidates(candidates: Crystal[], totalSystemUsage: number, domain: string = 'general'): Promise<Crystal[]> {
        const { Hypervector } = await import('../math/hypervector');

        const scoredCandidates = await Promise.all(candidates.map(async c => {
            const hv = Hypervector.fromString(c.verification?.canonical_hash || '');
            const fisher = hv.getFisherInformation(); // 0.0 to 1.0 (Certainty)

            const bonus = await this.calculateExplorationBonus(c, totalSystemUsage, domain);

            // Score = (Utility + Bonus) * (1 + Fisher)
            // This penalizes high-entropy (noisy) crystals even if they have high Q
            const score = ((c.rlm_stats?.q_score || 0.5) + bonus) * (1 + fisher);

            return { crystal: c, score };
        }));

        return scoredCandidates
            .sort((a, b) => b.score - a.score)
            .map(sc => sc.crystal);
    }
}
