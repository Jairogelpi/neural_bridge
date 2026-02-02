import { describe, it, expect } from 'vitest';
import { runGrandRealityDemo } from './verify_crystal_runtime_logic';

describe('Neural Bridge: TURBO Reality Engine (100% Real)', () => {
    it('should execute parallel pipeline with cryptographic proof', async () => {
        const { tech, medical, proof, sessionHash } = await runGrandRealityDemo();

        // Tech: Should detect unsafe capacitors
        expect(tech.passed).toBe(false);
        expect(tech.sri).toBeLessThan(0.8);

        // Medical: Should detect unsafe MAOI/SSRI
        expect(medical.passed).toBe(false);
        expect(medical.sri).toBeLessThan(0.8);

        // Cryptographic proof must exist
        expect(sessionHash).toBeDefined();
        expect(sessionHash.length).toBeGreaterThanOrEqual(64); // SHA-256 = 64 hex chars (+ optional 0x prefix)

        // Proof must have all required fields
        expect(proof.session_id).toContain('TURBO_');
        expect(proof.crystals.tech.hash).toBeDefined();
        expect(proof.crystals.med.hash).toBeDefined();
        expect(proof.metrics.total_time_ms).toBeGreaterThan(0);
        expect(proof.metrics.llm_calls).toBeGreaterThanOrEqual(2);

    }, 180000); // 180s timeout for parallel real-LLM calls
});
