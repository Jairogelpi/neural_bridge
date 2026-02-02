import { vi, describe, it, expect } from 'vitest';

vi.mock('../db/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: null }),
                    order: vi.fn(() => ({
                        limit: vi.fn().mockResolvedValue({ data: [], error: null })
                    })),
                })),
            })),
            insert: vi.fn().mockResolvedValue({ error: null }),
            rpc: vi.fn().mockResolvedValue({ error: null }),
            upsert: vi.fn().mockResolvedValue({ error: null }),
        })),
    }
}));

vi.mock('../services/sentinel', () => ({
    Sentinel: {
        emit: vi.fn().mockResolvedValue(true),
        triggerEntanglement: vi.fn().mockResolvedValue(true)
    }
}));

vi.mock('../services/llm', () => {
    const mockResilientCall = vi.fn(async () => ({
        content: JSON.stringify({
            fallacy: "Semantic Discontinuity",
            rule: "Maintain topological consistency",
            logical_constraint: "Similarity > 0.8",
            pattern_to_block: "Sudden phase shift"
        }),
        model: "mock-sovereign",
        tokens: { prompt: 0, completion: 0, total: 0 },
        cost: 0,
        latency: 0
    }));

    return {
        SCPService: {
            resilientCallLLM: mockResilientCall,
            getOptimalModel: vi.fn(() => 'mock-model'),
        },
        getOptimalModel: vi.fn(() => 'mock-model'),
    };
});

import { StochasticEngine } from '../services/stochastic_engine';
import { FractalCompressor } from '../services/fractal_compressor';
import { VaccineEngine } from '../services/vaccine_engine';
import { Hypervector } from '../math/hypervector';

describe('🌌 Transfinite Singularity Proof', () => {

    it('should purify entropy using Shannon Bit-Entropy', async () => {
        const input = "Reality is a mathematical construct of high-dimensional invariants.";
        const result = await StochasticEngine.processChaos(input);

        console.log(`[Test] Bit-Entropy: ${result.entropy}`);
        // Shannon Entropy for balanced HDC should be near 1.0 (maximum information density)
        // Since we use SemanticHasher which tries to spread information.
        expect(result.entropy).toBeGreaterThan(0.5);
        expect(result.semanticPotential).toBeGreaterThan(0);
    });

    it('should shard reality at topological inflection points', async () => {
        // Construct a text with a sharp semantic shift
        const text = "Philosophy is the study of general and fundamental questions. ".repeat(100) +
            "QUANTUM PHYSICS IS THE STUDY OF MATTER AND ENERGY AT THE MOST FUNDAMENTAL LEVEL. ".repeat(100);

        // This should trigger at least one phase shift shard
        const shards = await (FractalCompressor as any).shardReality(text);

        console.log(`[Test] Shards generated: ${shards.length}`);
        expect(shards.length).toBeGreaterThan(1);
    });

    it('should generate geometric invariant vaccine signatures', async () => {
        const contradiction = {
            claim_a: "The sky is blue because of Rayleigh scattering.",
            claim_b: "The sky is red because of atmospheric oxygen."
        };

        // We mock crystal for minimal dependencies
        const crystal: any = { context_id: 'test_context', domain: 'science' };

        const vaccine = await VaccineEngine.synthesizeFromContradiction(crystal, contradiction);

        expect(vaccine).not.toBeNull();
        expect(vaccine?.error_signature_hash).toBeDefined();
        // The hash should be derived from the HDC relationship vector
        expect(vaccine?.error_signature_hash.length).toBe(64);
    });

});
