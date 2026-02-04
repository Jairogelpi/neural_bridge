import { SCPService } from './llm';
import { FalsificationEngine } from './falsification';
import { ToonService } from '../lib/toon';

export interface DialecticalResult {
    final_thesis: string;
    iterations: number;
    history: { round: number; thesis: string; attack: string; synthesis: string }[];
    is_resilient: boolean;
    final_free_energy: number;
    final_accuracy: number;
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
                const fe = await DialecticalEngine.calculateFreeEnergy(currentThesis, context);
                return {
                    final_thesis: currentThesis,
                    iterations: round,
                    history,
                    is_resilient: true,
                    final_free_energy: fe,
                    final_accuracy: 1.0 // Survived all attacks
                };
            }

            console.log(`[Hegel] ⚠️ Thesis destroyed by: "${attack.attack_vector}". Synthesizing new truth...`);

            // 2. SYNTHESIS: Generate candidate syntheses
            // We optimize for Variational Free Energy: F = Complexity - Accuracy
            const synthesisPrompt = `
            THE NEUROMORPHIC DIALECTIC (Active Inference Mode)
            
            Current Thesis (Thesis): "${currentThesis}"
            Prediction Error (Attack): "${attack.attack_vector}"
            Context: "${context.substring(0, 500)}..."
            
            OBJECTIVE: Propose a synthesis that minimizes Variational Free Energy.
            
            Return ONLY a TOON manifold:
            @intent(Propose a synthesis that resolves the conflict)
            (Subject) -[Relationship]-> (Object)
            MUST [Core resilient axiom]
            NEVER [Pattern that caused the attack to succeed]
            `;

            const synthesisRes = await SCPService.resilientCallLLM(synthesisPrompt, 'anthropic/claude-3.5-sonnet', 'You are a Variational Free Energy Optimizer.');
            const nextTOON = synthesisRes.content.trim();
            const nextThesis = ToonService.parse(nextTOON).metadata.intent || nextTOON;

            // 3. FEP EVALUATION: Calculate Free Energy Delta
            const feBefore = await DialecticalEngine.calculateFreeEnergy(currentThesis, context);
            const feAfter = await DialecticalEngine.calculateFreeEnergy(nextThesis, context);
            const feDelta = feAfter - feBefore;

            console.log(`[Hegel] 🧠 Free Energy Delta: ${feDelta.toFixed(4)} (Objective: < 0)`);

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
        const finalFE = await DialecticalEngine.calculateFreeEnergy(currentThesis, context);
        return {
            final_thesis: currentThesis,
            iterations: MAX_ROUNDS,
            history,
            is_resilient: false,
            final_free_energy: finalFE,
            final_accuracy: 0.5 // Hit limit, probably sub-optimal
        };
    }

    /**
     * FREE ENERGY CALCULATION (Semantic FEP Approximation)
     * F = Complexity - Accuracy
     */
    private static async calculateFreeEnergy(thesis: string, context: string): Promise<number> {
        // 1. Complexity (Shannon Entropy / MDL Approximation)
        // Shorter, denser claims have lower complexity cost
        const complexity = Math.log2(thesis.length + 1) * 0.1;

        // 2. Accuracy (Predictive Power)
        // How well the thesis "explains" the context. High accuracy = Low surprise.
        const accuracyPrompt = `
        SCORE THE ACCURACY of this thesis against the provided context.
        Thesis: "${thesis}"
        Context: "${context.substring(0, 1000)}..."
        
        Return a single number between 0 and 1, where 1 is "perfect explanation" 
        and 0 is "irrelevant or wrong".
        RETURN ONLY THE NUMBER.
        `;

        const res = await SCPService.resilientCallLLM(accuracyPrompt, 'google/gemini-2.0-flash-exp:free', 'Semantic Accuracy Scorer');
        const accuracy = parseFloat(res.content.trim()) || 0.1;

        // F = Complexity - Accuracy (Minimizing this value)
        return complexity - accuracy;
    }
}
