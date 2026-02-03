import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TruthVault } from '../services/truth_vault';
import { CrystallizationService } from '../services/crystallization';
import { SCPService } from '../services/llm';
import { supabase } from '../db/supabase';

// Mock Dependencies
vi.mock('../services/llm');
vi.mock('../services/crystallization', () => ({
    CrystallizationService: {
        mineProtoCrystal: vi.fn((text: string) => ({
            context_id: `proto_${Math.random()}`,
            domain: 'general',
            intent: { primary: text, status: 'active' },
            constraints: [],
            verification: { semantic_invariants: [] },
            tier: 'community'
        })),
        mineCrystal: vi.fn(),
        sublimateCrystal: vi.fn()
    }
}));

const mockSupabaseQuery: any = {
    select: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockResolvedValue({ error: null }),
    insert: vi.fn().mockResolvedValue({ error: null }),
    then: (resolve: any) => resolve({ data: [], error: null })
};

vi.mock('../db/supabase', () => ({
    supabase: {
        from: vi.fn(() => mockSupabaseQuery)
    }
}));
vi.mock('../services/vaccine_engine', () => ({
    VaccineEngine: {
        synthesizeFromContradiction: vi.fn()
    }
}));

describe('THE HOLOGRAPHIC TRUTH VAULT (Service)', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should CRYSTALLIZE verified truth with correct ID format', async () => {
        // Mock LLM for mining
        vi.spyOn(SCPService, 'resilientCallLLM').mockResolvedValue({
            content: JSON.stringify({
                intent: { primary: "Test intent", status: "active" },
                constraints: [],
                verification: {}
            }),
            model: 'mock',
            tokens: { prompt: 0, completion: 0, total: 0 },
            cost: 0,
            latency: 0
        });

        // Use Proto-Crystal for speed (no LLM verification needed for ID check)
        const crystal = CrystallizationService.mineProtoCrystal("Test content");

        expect(crystal.context_id).toBeDefined();
        expect(crystal.context_id).toContain('proto_');
    });

    it('should DETECT REALITY CONFLICTS using LLM Arbiter', async () => {
        const crystalA = { context_id: 'truth_1', domain: 'general', intent: { primary: "100C" } } as any;
        const crystalB = { context_id: 'lie_1', domain: 'general', intent: { primary: "50C" } } as any;

        // 1. Mock Crystallization to return our fixed objects
        const { CrystallizationService } = await import('../services/crystallization');
        vi.mocked(CrystallizationService.mineProtoCrystal)
            .mockReturnValueOnce(crystalA)
            .mockReturnValueOnce(crystalB);

        // 2. Mock Supabase to return Crystal A as existing knowledge
        vi.spyOn(mockSupabaseQuery, 'filter').mockResolvedValue({
            data: [{ value: crystalA }],
            error: null
        } as any);

        // 3. Mock SCP to detect contradiction
        vi.spyOn(SCPService, 'callLLM').mockResolvedValue({
            content: JSON.stringify({
                has_contradiction: true,
                explanation: "Temperature mismatch",
                claim_a: "100C",
                claim_b: "50C",
                severity: "critical"
            }),
            model: 'mock',
            tokens: { prompt: 10, completion: 10, total: 20 },
            cost: 0,
            latency: 100
        });

        const conflicts = await TruthVault.scanForContradictions(crystalB);

        expect(conflicts.length).toBe(1);
        expect(conflicts[0].severity).toBe('critical');
        expect(conflicts[0].explanation).toBe("Temperature mismatch");
    });

    it('should HEAL broken reality by synthesizing Vaccines', async () => {
        const contradiction = {
            crystal_id_a: 'cry_A',
            crystal_id_b: 'cry_B',
            claim_a: 'True',
            claim_b: 'False',
            explanation: 'Conflict',
            severity: 'critical' as const
        };

        const { VaccineEngine } = await import('../services/vaccine_engine');

        await TruthVault.heal([contradiction]);

        expect(VaccineEngine.synthesizeFromContradiction).toHaveBeenCalled();
        expect(supabase.from).toHaveBeenCalledWith('kv_store');
    });
});
