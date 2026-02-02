import { SCPService } from './llm';

export interface FalsificationResult {
    survived: boolean; // Did the claim survive the attack?
    attack_vector: string; // How the Red Team tried to break it
    defense: string; // Why the claim stood firm (or failed)
    resilience_score: number; // 0.0 to 1.0
}

/**
 * THE FALSIFICATION ENGINE (Popperian Verification)
 * 
 * "Science is not about proving things true. It is about failing to prove them false."
 * - Karl Popper
 * 
 * This engine spins up a hostile "Red Team" AI specifically instructed to find
 * logical fallacies, edge cases, or counter-examples.
 * 
 * If the claim survives this active attack, it is considered "Robust Truth".
 */
export class FalsificationEngine {

    static async challenge(claim: string, context: string): Promise<FalsificationResult> {
        console.log(`[Falsifier] ⚔️ Launching Red Team attack on: "${claim.substring(0, 40)}..."`);

        // STEP 1: THE ATTACK (Red Team)
        // We explicitly tell the model to be a harsh critic / devil's advocate.
        const attackPrompt = `
        You are the RED TEAM. Your goal is to DESTROY the following claim using logic, edge cases, and facts.
        
        CONTEXT: "${context.substring(0, 500)}..."
        CLAIM: "${claim}"
        
        Task: Find a logical flaw, a counter-example, or a context where this claim is FALSE.
        If the claim is strictly true and unbreakable, admit defeat.
        
        Return JSON:
        {
            "successful_attack": boolean,
            "counter_argument": "string (The attack)",
            "severity": "high" | "low" | "none"
        }
        `;

        // Use a "smart" model for the attack
        const attackRes = await SCPService.resilientCallLLM(attackPrompt, 'anthropic/claude-3.5-sonnet', 'You are a Ruthless Logician.');
        let attack;
        try {
            attack = JSON.parse(attackRes.content);
        } catch {
            return { survived: true, attack_vector: "Red Team failed to form coherent attack", defense: "Claim is trivial", resilience_score: 0.5 };
        }

        // STEP 2: THE DEFENSE (Judge)
        // If the Red Team thinks it found a flaw, we evaluate if it's a valid kill.
        if (attack.successful_attack) {
            console.log(`[Falsifier] ⚠️ Attack detected: "${attack.counter_argument}"`);

            const judgePrompt = `
            You are the SUPREME COURT.
            
            Original Claim: "${claim}"
            Red Team Attack: "${attack.counter_argument}"
            
            Is this attack Valid? Does it actually disprove the claim?
            Or is it nitpicking / irrelevant context?
            
            Return JSON:
            {
                "attack_valid": boolean,
                "reason": "explanation",
                "final_verdict_on_claim": "TRUE" | "FALSE" | "NUANCED"
            }
            `;

            const judgeRes = await SCPService.resilientCallLLM(judgePrompt, 'google/gemini-pro-1.5', 'You are an Impartial Judge.');
            try {
                const verdict = JSON.parse(judgeRes.content);

                if (verdict.attack_valid && verdict.final_verdict_on_claim !== 'TRUE') {
                    // THE CLAIM WAS DESTROYED
                    return {
                        survived: false,
                        attack_vector: attack.counter_argument,
                        defense: "None possible. Argument collapsed.",
                        resilience_score: 0.0
                    };
                } else {
                    // THE CLAIM SURVIVED THE ATTACK
                    return {
                        survived: true,
                        attack_vector: attack.counter_argument,
                        defense: `Withstood attack. Judge ruled: ${verdict.reason}`,
                        resilience_score: 0.95 // High score for surviving a valid attempt
                    };
                }
            } catch {
                // Fallback if judge breaks
                return { survived: false, attack_vector: "Judicial Error", defense: "Mistrial", resilience_score: 0.0 };
            }
        }

        // If Red Team couldn't even find an attack
        return {
            survived: true,
            attack_vector: "None found",
            defense: "Claim is self-evidently robust",
            resilience_score: 1.0
        };
    }
}
