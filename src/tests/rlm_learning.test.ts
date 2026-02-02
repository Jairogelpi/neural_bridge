
import { describe, it, expect } from 'vitest';
import { RLMEngine } from '../services/rlm_engine';
import { CrystalStatus, type Crystal } from '../types/crystal_format';

/**
 * RLM ACTIVE INFERENCE TEST 🧠
 * 
 * Demonstrates:
 * 1. The system LEARNS from feedback.
 * 2. A Crystal with higher utility overtakes a Crystal with lower utility, despite initial parity.
 */
describe('Reinforcement Logic Modeling (RLM)', () => {

    const createCrystal = (id: string, q_score: number): Crystal => ({
        scp_version: '1.0',
        context_id: id,
        created_at: new Date().toISOString(),
        version: '1.0.0',
        tier: 'community',
        source: {} as any,
        intent: { primary: 'Test', status: CrystalStatus.ACTIVE },
        verification: {} as any,
        author: { id: 'test', name: 'test', reputation: 1.0 },
        rlm_stats: {
            q_score: q_score,
            usage_count: 5, // Some usage to reduce exploration bonus massive variance
            last_reward_at: new Date().toISOString(),
            volatility: 0.1
        }
    });

    it('Evolution: Good Crystal climbs to the top', () => {
        console.log('\n--- 🧠 RLM EVOLUTION TEST ---');

        let goodCrystal = createCrystal('good_crystal', 0.5); // Started average
        let badCrystal = createCrystal('bad_crystal', 0.5);   // Started average

        // Simulation: 5 rounds of learning
        for (let i = 0; i < 5; i++) {
            // User accepts Good Crystal (+1)
            goodCrystal = RLMEngine.updateCrystalUtility(goodCrystal, 1);

            // User rejects Bad Crystal (-1)
            badCrystal = RLMEngine.updateCrystalUtility(badCrystal, -1);

            console.log(`[Round ${i + 1}] Good Q: ${goodCrystal.rlm_stats!.q_score.toFixed(3)} | Bad Q: ${badCrystal.rlm_stats!.q_score.toFixed(3)}`);
        }

        expect(goodCrystal.rlm_stats!.q_score).toBeGreaterThan(0.6);
        expect(badCrystal.rlm_stats!.q_score).toBeLessThan(0.4);

        // Ranking Check
        const ranked = RLMEngine.rankCandidates([badCrystal, goodCrystal], 100);
        expect(ranked[0].context_id).toBe('good_crystal'); // Winner
    });

    it('Exploration: New Crystal gets a chance (UCB Boost)', () => {
        const establishedCrystal = createCrystal('old_reliable', 0.8);
        establishedCrystal.rlm_stats!.usage_count = 1000; // Used a lot

        const newCrystal = createCrystal('new_contender', 0.5);
        newCrystal.rlm_stats!.usage_count = 0; // Never used

        // Even though Old Reliable has high score (0.8), New Contender has Infinite Curiosity Bonus
        const ranked = RLMEngine.rankCandidates([establishedCrystal, newCrystal], 1000);

        // First time, the New Crystal should win due to exploration bonus
        console.log(`\nWinner (Exploration): ${ranked[0].context_id}`);
        expect(ranked[0].context_id).toBe('new_contender');
    });

});
