import type { Crystal } from '../types/crystal_format';

/**
 * REHYDRATION ENGINE
 * Converts a Knowledge Crystal (JSON) into a potent "Primer Prompt"
 * that forces any LLM (Claude, ChatGPT, Llama) to adopt the state.
 */
export class RehydrationEngine {

        static rehydrate(crystal: Crystal): string {
                // 1. HEADER (Psychological Primer)
                // We tell the model it is NOT starting a new chat, but RESUMING an existing one.
                // We use "System Instructions" syntax which is generally respected.
                const header = `
[SYSTEM INSTRUCTION: RESUME CONTEXT STATE]
You are resuming an existing high-context session.
Ignore your default statelessness. You must synchronize your internal state with the following "Knowledge Crystal".
`;

                // 2. DOMAIN & INTENT
                const meta = `
CONTEXT METADATA:
- Domain: ${(crystal.domain || 'general').toUpperCase()}
- Validated Intent: "${crystal.intent.primary}"
- Context ID: ${crystal.context_id}
`;

                // 3. ENTITIES (The "Vocabulary")
                // We list entities so the model "knows" what we are talking about.
                const entities = (crystal.entities || []).map(e => `- ${e.name} (${e.category || 'general'}): ${e.type}`).join('\n');
                const entityBlock = `
ACTIVE ENTITIES:
${entities}
`;

                // 4. CONSTRAINTS (The "Rules")
                const constraints = (crystal.constraints || []).map(c => `- [${c.rule}] ${c.value}`).join('\n');
                const constraintBlock = `
IMMUTABLE CONSTRAINTS:
${constraints}
`;

                // 5. INVARIANTS (The "Test")
                // We warn the model that it will be audited.
                const invariants = crystal.verification.semantic_invariants.map(i => `- ${i.prompt}`).join('\n');
                const invariantBlock = `
VERIFICATION CONTRACT:
The user will verify your understanding using these invariants. FAIL to satisfy them creates a Reality Breach.
${invariants}
`;

                // 6. ACTION (The "continuation")
                const action = `
[INSTRUCTION]
1. Ingest this Crystal.
2. Acknowledge with: "Context Synchronized. Ready to resume [Intent]."
3. Do NOT summarize the Crystal unless asked. Just BECOME the state.
`;

                return `${header}${meta}${entityBlock}${constraintBlock}${invariantBlock}${action}`;
        }
}
