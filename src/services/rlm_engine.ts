
import type { Crystal } from '../types/crystal_format';

/**
 * REINFORCEMENT LOGIC MODELING (RLM) ENGINE 🧠
 * 
 * Implements "Active Inference" for Knowledge Crystals.
 * Converts static data into "Living Wisdom" that evolves based on utility.
 */
export class RLMEngine {

    // Hyperparameters
    private static ALPHA = 0.1; // Learning Rate (How much recent feedback matters)
    private static C = 1.414;   // Exploration Constant (UCB1 standard)

    /**
     * Updates the Crystal's Q-Score based on user feedback.
     * Uses Exponential Moving Average (EMA) approximation for Q-Learning.
     * 
     * @param crystal The crystal to update
     * @param reward +1 (Helpful), -1 (Harmful/Hallucinated), 0 (Neutral)
     */
    static updateCrystalUtility(crystal: Crystal, reward: number): Crystal {
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

        // Q_new = Q_old + alpha * (Reward - Q_old)
        // We clamp reward impact to keep score between 0 and 1
        // Map reward (-1 to 1) to (0 to 1) signal for Q-update if we want probability-like score.
        // But standard Q can be unbounded. Let's keep it normalized 0-1 for "Probability of Utility".
        // Reward: 1 -> Target 1.0, -1 -> Target 0.0

        const target = (reward + 1) / 2; // Map -1..1 to 0..1

        const oldQ = stats.q_score;
        const newQ = oldQ + RLMEngine.ALPHA * (target - oldQ);

        stats.q_score = parseFloat(newQ.toFixed(4));

        // Volatility tracks how much the "Truth" status is changing
        stats.volatility = Math.abs(newQ - oldQ);

        return crystal;
    }

    /**
     * Calculates the Exploration Bonus using UCB1.
     * High bonus for rarely used crystals.
     * Low bonus for well-known crystals.
     */
    static calculateExplorationBonus(crystal: Crystal, totalSystemUsage: number): number {
        if (!crystal.rlm_stats || crystal.rlm_stats.usage_count === 0) {
            return 1.0; // Max bonus if never seen (Infinite curiosity)
        }

        // UCB1 = C * sqrt(ln(TotalAttempts) / ArmsAttempts)
        const bonus = RLMEngine.C * Math.sqrt(Math.log(totalSystemUsage) / crystal.rlm_stats.usage_count);

        // Clamp to avoid craziness
        return Math.min(bonus, 1.0);
    }

    /**
     * Rank candidates by combining Exploitation (Q-Score) + Exploration (Bonus).
     */
    static rankCandidates(candidates: Crystal[], totalSystemUsage: number): Crystal[] {
        return candidates.sort((a, b) => {
            const scoreA = (a.rlm_stats?.q_score || 0.5) + RLMEngine.calculateExplorationBonus(a, totalSystemUsage);
            const scoreB = (b.rlm_stats?.q_score || 0.5) + RLMEngine.calculateExplorationBonus(b, totalSystemUsage);
            return scoreB - scoreA; // Descending
        });
    }
}
