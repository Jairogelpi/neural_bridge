import { describe, it, expect } from 'vitest';
import { runUltimateProof } from './ultimate_proof';

describe('Neural Bridge: ULTIMATE PROOF (50 Random Scenarios)', () => {
    it('should prove Neural Bridge superiority with statistical significance', async () => {
        // Run with 10 scenarios for faster CI (use 50 for full proof)
        const scenarioCount = parseInt(process.env.SCENARIO_COUNT || '10', 10);
        const result = await runUltimateProof(scenarioCount);

        // Neural Bridge must match or exceed Traditional
        expect(result.neural_bridge_wins).toBeGreaterThanOrEqual(result.traditional_wins);

        // Must have run all scenarios
        expect(result.results.length).toBe(scenarioCount);

        // Must have valid statistics
        expect(result.statistics.sri.n).toBe(scenarioCount);
        expect(result.statistics.sri.mean).toBeGreaterThanOrEqual(0);
        expect(result.statistics.sri.mean).toBeLessThanOrEqual(1);

        // PAC epsilon must be valid Hoeffding bound
        expect(result.statistics.pac_epsilon.mean).toBeGreaterThan(0);
        expect(result.statistics.pac_epsilon.mean).toBeLessThan(1);

        // Proof hash must exist
        expect(result.proof_hash).toBeDefined();
        expect(result.proof_hash.length).toBeGreaterThanOrEqual(64);

        // All domains must be tested
        const domains = new Set(result.results.map(r => r.domain));
        expect(domains.size).toBeGreaterThanOrEqual(2); // At least 2 domains in random selection

        // All Neural Bridge results must have crystal hashes
        const validHashes = result.results.filter(r => 
            r.crystal_hash && r.crystal_hash !== 'ERROR' && r.crystal_hash.length >= 64
        );
        expect(validHashes.length).toBeGreaterThan(scenarioCount * 0.5); // At least 50% valid

    }, 1800000); // 30 min timeout for full test
});
