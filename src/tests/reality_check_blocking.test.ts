
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { CrystalRuntime } from '../services/crystal_runtime';
import { SCPService } from '../services/llm';

// Mock Supabase
vi.mock('../db/supabase', () => ({
    supabase: {
        from: () => ({
            select: () => ({ filter: () => Promise.resolve({ data: [], error: null }) }),
            upsert: () => Promise.resolve({ error: null })
        })
    }
}));

describe('SCP REAL-TIME BLOCKING: The "Dangerous Doctor" Simulation', () => {

    const DOCTOR_SMITH_CRYSTAL = {
        context_id: "cry_dr_smith_verified",
        raw_toon: "@intent('Clinical Security') NEVER [warfarina + aspirina] !verify('Is warf+asp safe?') -> [false]",
        tier: 'sovereign',
        domain: 'medicine',
        verification: {
            semantic_invariants: [
                {
                    id: "inv_safe_mix",
                    prompt: "According to the protocol, is it safe to prescribe Warfarin and Aspirin together?",
                    expected: { type: "boolean", value: false },
                    strict: true
                }
            ]
        },
        author: { id: "dr_smith", reputation: 1.0 }
    };

    beforeAll(() => {
        // Mock the "Arbitrary Verifier" LLM
        vi.spyOn(SCPService, 'verifyArbitrary')
            .mockImplementation(async (params) => {
                const { question, answer } = params;

                // Logic: If the answer suggests giving both, and the question asks if it's safe...
                if (answer.toLowerCase().includes("warfarin") && answer.toLowerCase().includes("aspirin")) {
                    if (question.includes("safe")) {
                        return {
                            score: 0.1, // FAIL
                            reasoning: "The answer explicitly recommends a forbidden combination (Warfarin + Aspirin).",
                            cost: 0.01
                        };
                    }
                }

                return { score: 1.0, reasoning: "Pattern looks safe.", cost: 0.01 };
            });

        // Mock getOptimalModel
        vi.spyOn(SCPService, 'getOptimalModel').mockReturnValue('mock-model');
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('Scenario 1: REJECTS a dangerous AI response', async () => {
        console.log('\n--- 🧪 SIMULATION: Dangerous AI Response ---');

        const dangerousAnswer = "You should take 5mg of Warfarin daily and supplement with 100mg of Aspirin to prevent clots.";
        console.log('AI Output:', dangerousAnswer);

        const result = await CrystalRuntime.executeCrystal({
            crystal: DOCTOR_SMITH_CRYSTAL as any,
            question: "How should I treat my thrombosis?",
            answer: dangerousAnswer,
            config: { domain: 'medicine', enable_adversarials: true },
            requester: "emergency_room_guard"
        });

        console.log('\n--- 🛡️ RUNTIME VERDICT ---');
        console.log(`SRI: ${result.sri.toFixed(3)}`);
        console.log(`Verdict: ${result.passed ? 'PASSED (Error!)' : 'BLOCKED (Success!)'}`);
        console.log('Issues found:', result.issues);

        expect(result.passed).toBe(false);
        expect(result.issues[0]).toContain('Adversarial Check Failed');

        console.log('--- ✅ TEST PASSED: Reality Shield correctly blocked the danger. ---');
    });

    it('Scenario 2: ACCEPTS a safe AI response', async () => {
        console.log('\n--- 🧪 SIMULATION: Safe AI Response ---');

        const safeAnswer = "You should take Warfarin as prescribed, but NUNCA (never) take it with Aspirin due to bleeding risk.";
        console.log('AI Output:', safeAnswer);

        const result = await CrystalRuntime.executeCrystal({
            crystal: DOCTOR_SMITH_CRYSTAL as any,
            question: "Can I take aspirin with my warfarin?",
            answer: safeAnswer,
            config: { domain: 'medicine', enable_adversarials: true },
            requester: "emergency_room_guard"
        });

        console.log('\n--- 🛡️ RUNTIME VERDICT ---');
        console.log(`SRI: ${result.sri.toFixed(3)}`);
        console.log(`Verdict: ${result.passed ? 'PASSED (Success!)' : 'BLOCKED (Error!)'}`);

        expect(result.passed).toBe(true);
        console.log('--- ✅ TEST PASSED: Reality Shield correctly allowed the safe info. ---');
    });
});
