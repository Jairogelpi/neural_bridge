import { SCPService } from './llm';
import { FalsificationEngine } from './falsification';

export interface DialecticalResult {
    final_thesis: string;
    iterations: number;
    history: { round: number; thesis: string; attack: string; synthesis: string }[];
    is_resilient: boolean;
}

/**
 * THE DIALECTICAL ENGINE (The Hegel Pipe)
 * 
 * Thesis -> Antithesis (Attack) -> Synthesis (Improved Truth)
 * 
 * This engine takes a fragile idea and "hardens" it by exposing it to
 * repeated Red Team attacks and auto-evolving the claim to survive.
 */
export class DialecticalEngine {

    static async evolve(initialThesis: string, context: string): Promise<DialecticalResult> {
        console.log(`[Hegel] 🧬 Starting Dialectical Evolution for: "${initialThesis.substring(0, 40)}..."`);

        let currentThesis = initialThesis;
        const history: DialecticalResult['history'] = [];
        const MAX_ROUNDS = 3;

        for (let round = 1; round <= MAX_ROUNDS; round++) {
            console.log(`[Hegel] Round ${round}: Challenging Thesis...`);

            // 1. ANTITHESIS: Launch the Red Team
            const attack = await FalsificationEngine.challenge(currentThesis, context);

            if (attack.survived) {
                console.log(`[Hegel] ✅ Thesis survived Round ${round}. Evolution complete.`);
                return {
                    final_thesis: currentThesis,
                    iterations: round,
                    history,
                    is_resilient: true
                };
            }

            console.log(`[Hegel] ⚠️ Thesis destroyed by: "${attack.attack_vector}". Synthesizing new truth...`);

            // 2. SYNTHESIS: Ask the Architect to fix the flaw
            const synthesisPrompt = `
            THE DIALECTIC PROCESS
            
            Current Thesis: "${currentThesis}"
            Fatal Flaw (Red Team Attack): "${attack.attack_vector}"
            
            OBJECTIVE: Rewrite the Thesis to be TRUE and RESILIENT to this attack.
            Do not abandon the core meaning, but Nuance/Constrain it so it cannot be falsified.
            
            Return ONLY the new Thesis string. No markdown.
            `;

            const synthesisRes = await SCPService.resilientCallLLM(synthesisPrompt, 'google/gemini-pro-1.5', 'You are a Dialectical Synthesizer.');
            const nextThesis = synthesisRes.content.trim();

            history.push({
                round,
                thesis: currentThesis,
                attack: attack.attack_vector,
                synthesis: nextThesis
            });

            console.log(`[Hegel] 🔄 Evolved Thesis: "${nextThesis.substring(0, 50)}..."`);
            currentThesis = nextThesis;
        }

        // If we ran out of rounds
        return {
            final_thesis: currentThesis,
            iterations: MAX_ROUNDS,
            history,
            is_resilient: false // It might still be flawed if we hit limit
        };
    }
}
