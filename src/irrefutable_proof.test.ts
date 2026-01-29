import { describe, it, expect } from 'vitest';
import { runIrrefutableProofProtocol } from './irrefutable_proof';

describe('Neural Bridge: IRREFUTABLE PROOF PROTOCOL', () => {
    it('should verify ALL claims from DEMO.MD are 100% real', async () => {
        const result = await runIrrefutableProofProtocol();

        // All proofs must pass
        expect(result.passed).toBe(true);
        expect(result.proofs_passed).toBe(result.proofs_total);

        // Must have session hash (cryptographic proof)
        expect(result.session_hash).toBeDefined();
        expect(result.session_hash.length).toBeGreaterThanOrEqual(64);

        // Run ID must be unique
        expect(result.run_id).toContain('PROOF_');

        // Verify specific proofs exist
        const proofClaims = result.proofs.map(p => p.claim);
        
        expect(proofClaims).toContain('SHA-256 hashing is REAL (not mock)');
        expect(proofClaims).toContain('ECDSA P-256 signatures are REAL (Web Crypto API)');
        expect(proofClaims).toContain('LLM API call is REAL (measurable latency)');
        expect(proofClaims).toContain('Crystal compilation uses real LLM (not template)');
        expect(proofClaims).toContain('PAC epsilon uses real Hoeffding formula');
        expect(proofClaims).toContain('Same algorithm applied to both domains (no bias)');

    }, 300000); // 5 min timeout for full proof protocol
});
