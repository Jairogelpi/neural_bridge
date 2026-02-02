import { SCPService } from './llm';
import { Crystal, CrystalConstraint, CrystalStatus } from '../types/crystal_format';

/**
 * THE EVOLUTION ENGINE 🧬
 * 
 * Component: Antifragile Optimization Layer
 * Function: When a prompt fails to yield a high-reliability Crystal, this engine
 *           wakes up, analyzes the failure, and "Genetically Mutates" the prompt
 *           to evolve a better strategy.
 * 
 * UPGRADE (Phase 10): Now manages BIOLOGICAL EVOLUTION of Crystals.
 * - Breeding (Sexual Reproduction of Knowledge)
 * - Mutation (Random Variation)
 * - Natural Selection (Reaping Weak Ideas)
 */
export class EvolutionEngine {

    /**
     * BREEDING (Sexual Reproduction) 🌹
     * Combines two high-performing crystals to create a superior offspring.
     * Strategy:
     * - Intent: Synthesis of both.
     * - Constraints: Crossover (Random mix from both).
     * - Evidence: Union of non-duplicate evidence.
     */
    static breed(parentA: Crystal, parentB: Crystal): Crystal {
        console.log(`[EvolutionEngine] 🌹 Breeding Generation ${parentA.version} & ${parentB.version}...`);

        // 1. Crossover Constraints (50/50 Split + Random Mutation)
        const childConstraints = this.crossoverConstraints(parentA.constraints || [], parentB.constraints || []);

        // 2. Synthesize Intent
        const childIntent = {
            ...parentA.intent,
            primary: `${parentA.intent.primary} + ${parentB.intent.primary} [SYNTHESIS]`,
            status: CrystalStatus.ACTIVE
        };

        // 3. Create Child
        const child: Crystal = {
            ...parentA, // Inherit base properties from A
            context_id: `child_${Date.now()}_gen`,
            version: `${parseInt(parentA.version) + 1}.0.0`,
            intent: childIntent,
            constraints: childConstraints,
            // Inherit RLM stats (Start with parents' average potential)
            rlm_stats: {
                q_score: ((parentA.rlm_stats?.q_score || 0.5) + (parentB.rlm_stats?.q_score || 0.5)) / 2,
                usage_count: 0,
                last_reward_at: new Date().toISOString(),
                volatility: 0.1 // High volatility initially (Newborn)
            },
            created_at: new Date().toISOString(),
            verification: {
                ...parentA.verification,
                canonical_hash: "PENDING_REHASH" // Needs re-verification
            }
        };

        return child;
    }

    /**
     * NATURAL SELECTION (The Reaper) 💀
     * Identifies weak crystals that should be culled from the population.
     * Criteria: High Usage but Low Q-Score (Proven to be bad).
     */
    static reap(population: Crystal[]): string[] {
        const weaklings = population.filter(c => {
            const stats = c.rlm_stats || { q_score: 0.5, usage_count: 0 };
            // If used > 10 times and Score < 0.2 (20% utility), it's trash.
            return stats.usage_count > 10 && stats.q_score < 0.2;
        });

        console.log(`[EvolutionEngine] 💀 Reaping ${weaklings.length} weak crystals.`);
        return weaklings.map(c => c.context_id);
    }

    // ========== GENETIC HELPERS ==========

    private static crossoverConstraints(setA: CrystalConstraint[], setB: CrystalConstraint[]): CrystalConstraint[] {
        const genePool = [...setA, ...setB];
        // Deduplicate by ID
        const uniqueGenes = Array.from(new Map(genePool.map(c => [c.id, c])).values());

        // Random Selection (Mutation Chance 10%)
        return uniqueGenes.filter(() => Math.random() > 0.1); // Drop 10% of constraints randomly
    }

    // ========== LEGACY PROMPT EVOLUTION ==========

    /**
     * Evolve a better prompt strategy based on failure context.
     * @param intent The original user intent
     * @param currentPrompt The prompt that failed (or performed poorly)
     * @param reliabilityScore The low score that triggered evolution
     * @returns The mutated, optimized prompt (or null if evolution failed)
     */
    static async evolve(intent: string, currentPrompt: string, reliabilityScore: number): Promise<string | null> {
        console.log(`\n🧬 [EvolutionEngine] DETECTED WEAKNESS (Score: ${reliabilityScore}). Initiating Evolution...`);

        try {
            // Step 1: Diagnosis (Meta-Cognition)
            const analysisPrompt = `
            ACT AS AN AI EVOLUTION ENGINEER.
            
            CONTEXT:
            User Intent: "${intent}"
            Failed Prompt: "${currentPrompt}"
            Reliability Score: ${reliabilityScore} (Too Low)

            TASK:
            Analyze WHY this prompt failed to generate a valid Crystal.
            Is it ambiguous? Missing constraints? Too complex?
            
            Return a single sentence diagnosis.
            `;

            console.log(`🔬 [EvolutionEngine] Diagnosing failure logic...`);
            // Use a smart model for diagnosis (Meta-Cognition)
            const diagnosisRes = await SCPService.resilientCallLLM(analysisPrompt, 'anthropic/claude-3-haiku', 'Evolution Engineer');
            const diagnosis = diagnosisRes.content;
            console.log(`   > Diagnosis: ${diagnosis.substring(0, 100)}...`);

            // Step 2: Genetic Mutation (Rewrite)
            const mutationPrompt = `
            ACT AS A GENETIC ALGORITH FOR PROMPTS.

            DIAGNOSIS: ${diagnosis}
            ORIGINAL PROMPT: "${currentPrompt}"

            TASK:
            Rewrite the ORIGINAL PROMPT to fix the diagnosed issue.
            - Make it more robust.
            - Add explicit constraints if needed.
            - Optimize for machine-readability.

            Return ONLY the new prompt text. Do not explain.
            `;

            console.log(`🧪 [EvolutionEngine] Mutating prompt DNA...`);
            const mutationRes = await SCPService.resilientCallLLM(mutationPrompt, 'google/gemini-2.0-flash-exp:free', 'Genetic Mutation Algo');
            const mutatedPrompt = mutationRes.content;

            if (mutatedPrompt && mutatedPrompt.length > 10) {
                console.log(`✨ [EvolutionEngine] EVOLUTION COMPLETE. New Strategy Generated.`);
                return mutatedPrompt;
            }

            return null;

        } catch (e) {
            console.error(`💀 [EvolutionEngine] Evolution failed:`, e);
            return null;
        }
    }
}
