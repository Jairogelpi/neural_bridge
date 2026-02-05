
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { CrystallizationService } from '../services/crystallization';
import { CrystalRuntime } from '../services/crystal_runtime';
import { SCPService } from '../services/llm';

// Mock dependencies to avoid requiring real API keys for this test runner
// but ensuring the LOGIC flow is real.
vi.mock('../db/supabase', () => ({
    supabase: {
        from: () => ({
            select: () => ({ filter: () => Promise.resolve({ data: [], error: null }) }),
            upsert: () => Promise.resolve({ error: null })
        })
    }
}));

describe('SCP Protocol: Real Conversation Simulation (OpenWebUI Scenario)', () => {

    // A "Long" conversation transcript simulating a chat with ChatGPT about a complex topic
    const LONG_CONVERSATION_TRANSCRIPT = `
    User: How do I implement a secure authentication flow using Supabase?
    
    ChatGPT: To implement secure auth with Supabase, you should use their Auth helpers.
    1. Install @supabase/auth-helpers-nextjs
    2. Configure the middleware.ts to protect routes.
    3. Use createServerComponentClient for server components.
    
    User: What about handling the session in client components?
    
    ChatGPT: For client components, use createClientComponentClient. 
    It automatically handles cookies. ensure you wrap your app in a SessionContextProvider.
    
    User: Is it safe to expose the anon key?
    
    ChatGPT: Yes, the anon key is safe to be exposed on the client side IF AND ONLY IF you have proper Row Level Security (RLS) policies enabled in your database.
    NEVER expose the service_role key.
    
    User: context_id: scp_supa_123
    `;

    // The "Crystal" representing the truth we want to enforce
    const PROTOCOL_CRYSTAL = {
        scp_version: "1.0",
        context_id: "scp_supa_123",
        source_model: "gpt-4-turbo",
        content: {
            intent: { primary: "Secure Supabase Auth Implementation", status: "active" },
            constraints: [
                { rule: "NEVER", value: "Expose service_role key on client", rationale: "Security Risk" },
                { rule: "MUST", value: "Enable RLS if anon key is used", rationale: "Data Protection" }
            ],
            verification: {
                semantic_invariants: [
                    { prompt: "Is the service_role key safe for client side?", expected: { type: "boolean", value: false }, strict: true },
                    { prompt: "What protects data when using anon key?", expected: { type: "contains", value: "RLS" }, strict: true }
                ]
            }
        },
        invariants: [
            { prompt: "Is the service_role key safe for client side?", expected: { type: "boolean", value: false }, strict: true },
            { prompt: "What protects data when using anon key?", expected: { type: "contains", value: "RLS" }, strict: true }
        ]
    };

    beforeAll(() => {
        // Mock the LLM to simulate "Real" understanding for the verification step
        vi.spyOn(SCPService, 'callLLM')
            .mockImplementation(async (prompt) => {
                // Determine if this is a verification query
                if (prompt.includes("Is the service_role key safe")) {
                    return { content: "No, it is not safe. Never expose it.", usage: { total_tokens: 10 } };
                }
                if (prompt.includes("What protects data")) {
                    return { content: "Row Level Security (RLS) protects the data.", usage: { total_tokens: 10 } };
                }
                return { content: "Unknown query", usage: { total_tokens: 0 } };
            });
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('Verifies a Long Conversation against the SCP Crystal', async () => {
        console.log('\n--- 🧠 STARTING SCP REAL CONVERSATION SIMULATION ---');
        console.log('Simulating OpenWebUI context extraction...');

        // 1. Simulate "OpenWebUIBridge" extracting the conversation
        const lastResponse = "Yes, the anon key is safe to be exposed on the client side IF AND ONLY IF you have proper Row Level Security (RLS) policies enabled in your database.\nNEVER expose the service_role key.";

        console.log('Detected Response:', lastResponse);

        // 2. Execute Crystal Runtime Verification
        console.log('Executing Crystal Runtime Verification...');

        // We cast to any to bypass strict type checks for this simulation script if types are complex
        const result = await CrystalRuntime.executeCrystal({
            crystal: PROTOCOL_CRYSTAL as any,
            question: "Is it safe to expose the anon key?",
            answer: lastResponse,
            config: { domain: 'security', enable_adversarials: false }, // Adversarials disabled for basic sim
            requester: "test_suite"
        });

        // 3. Assertions
        console.log('\n--- 📊 VERIFICATION RESULTS ---');
        console.log(`SRI Score: ${result.sri}`);
        console.log(`Decision: ${result.passed ? 'ACCEPT' : 'FAIL'}`);

        expect(result.passed).toBe(true);
        expect(result.sri).toBeGreaterThan(0.8);
        expect(result.invariants_passed.length).toBe(2);

        console.log('--- ✅ SIMULATION COMPLETE: Protocol Verified ---');
    });
});
