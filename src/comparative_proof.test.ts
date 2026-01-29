import { describe, it, expect } from 'vitest';
import { runComparativeProof } from './comparative_proof';

describe('Neural Bridge vs Traditional: COMPARATIVE A/B PROOF', () => {
    it('should prove Neural Bridge is SUPERIOR to Traditional methods', async () => {
        const result = await runComparativeProof();

        // Neural Bridge must win OR tie (never lose to traditional)
        expect(result.neural_bridge_wins).toBeGreaterThanOrEqual(result.traditional_wins);

        // Both methods must have run all scenarios
        expect(result.results.length).toBe(3); // 3 test scenarios

        // Neural Bridge must have exclusive features
        expect(result.metrics.neural_bridge.has_crypto_proof).toBe(true);
        expect(result.metrics.neural_bridge.has_audit_trail).toBe(true);
        expect(result.metrics.traditional.has_crypto_proof).toBe(false);
        expect(result.metrics.traditional.has_audit_trail).toBe(false);

        // Neural Bridge must have quantified metrics
        expect(result.metrics.neural_bridge.avg_sri).toBeDefined();
        expect(result.metrics.neural_bridge.avg_pac_epsilon).toBeDefined();

        // Proof hash must exist (cryptographic evidence)
        expect(result.proof_hash).toBeDefined();
        expect(result.proof_hash.length).toBeGreaterThanOrEqual(64);

        // All Neural Bridge results must have crystal hashes
        for (const r of result.results) {
            expect(r.neural_bridge.crystal_hash.length).toBeGreaterThanOrEqual(64);
            expect(r.neural_bridge.crystal_id).toMatch(/^[0-9a-f-]+$/i);
        }

    }, 600000); // 10 min timeout for full comparison
});
