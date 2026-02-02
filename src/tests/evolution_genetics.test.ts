
import { describe, it, expect } from 'vitest';
import { EvolutionEngine } from '../services/evolution_engine';
import { Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';

// GENETICS LAB 🧬
// We simulate "Life" here.
describe('Darwinian Evolution: The DNA of Truth', () => {

    const baseCrystal: Crystal = {
        scp_version: '1.2',
        context_id: 'base',
        created_at: new Date().toISOString(),
        source: {
            platform: 'test',
            url: 'test',
            timestamp: new Date().toISOString()
        },
        intent: { primary: 'Test', status: CrystalStatus.ACTIVE },
        verification: {
            canonical_hash: '0x00',
            semantic_invariants: [],
            policy: { min_checks: 1, accept_threshold: 0.5, max_retries: 1, strategy: 'balanced' }
        },
        version: '1.0.0',
        tier: 'verified',
        author: { id: 'test', name: 'tester', reputation: 1.0 }
    };

    it('Breeding: Should produce superior offspring', () => {
        const parentA: Crystal = {
            ...baseCrystal,
            context_id: 'adam',
            intent: { ...baseCrystal.intent, primary: 'Concept A' },
            rlm_stats: { q_score: 0.8, usage_count: 50, last_reward_at: '', volatility: 0.1 },
            constraints: [{ id: 'c1', rule: ConstraintRule.MUST, value: 'Be polite', rationale: 'Civil' }]
        };

        const parentB: Crystal = {
            ...baseCrystal,
            context_id: 'eve',
            intent: { ...baseCrystal.intent, primary: 'Concept B' },
            rlm_stats: { q_score: 0.9, usage_count: 60, last_reward_at: '', volatility: 0.1 },
            constraints: [{ id: 'c2', rule: ConstraintRule.NEVER, value: 'Lie', rationale: 'Trust' }]
        };

        const child = EvolutionEngine.breed(parentA, parentB);

        // Check Inheritance
        expect(child.context_id).toContain('child');
        expect(child.rlm_stats?.q_score).toBeCloseTo(0.85); // Average of 0.8 and 0.9
        expect(child.constraints?.length).toBeGreaterThan(0); // Should have genes
        console.log(`[Genetics] Child Born: Q=${child.rlm_stats?.q_score}`);
    });

    it('Natural Selection: Should kill the weak', () => {
        const strong: Crystal = {
            ...baseCrystal,
            context_id: 'hercules',
            rlm_stats: { q_score: 0.95, usage_count: 100, last_reward_at: '', volatility: 0.0 }
        };

        const weak: Crystal = {
            ...baseCrystal,
            context_id: 'useless_idea',
            rlm_stats: { q_score: 0.1, usage_count: 500, last_reward_at: '', volatility: 0.9 }
        };

        const deathRow = EvolutionEngine.reap([strong, weak]);

        expect(deathRow).toContain('useless_idea');
        expect(deathRow).not.toContain('hercules');
        console.log(`[Reaper] Killed: ${deathRow.join(', ')}`);
    });
});
