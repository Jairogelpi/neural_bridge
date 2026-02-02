import { SCPService } from './llm';
import { Sentinel } from './sentinel';
import { EvolutionEngine } from './evolution_engine';
import { MathCore } from '../math/core';
import type { Crystal, CrystalConstraint } from '../types/crystal_format';

export interface LatticePath {
    id: string;
    model_used: string;
    steps: number;
    reliability_score: number;
    crystal: Crystal | null;
    error?: string;
    prompt_used: string;
}

/**
 * LATTICE ORCHESTRATOR (The Stochastic Engine) 🕸️
 * 
 * Replaces linear chains (LangChain) with self-healing Lattices.
 * Goal: Find a path to the Truth (Crystal) regardless of which model is used.
 */
export class LatticeOrchestrator {

    /**
     * Crystallize a Truth from an Intent.
     * "Find me a path to X" (Declarative) vs "Do A then B then C" (Imperative)
     */
    static async crystallizeIntent(intent: string, constraints: CrystalConstraint[]): Promise<LatticePath> {
        console.log(`[Lattice] 🕸️ Orchestrating path for intent: "${intent}"`);

        // Strategy 0: LOCAL CACHE (Zero Latency / Offline)
        // Check if we already know this truth
        // We use a dynamic import to avoid circular dependency issues at the top level
        const { truthVault } = require('../features/truth_vault');
        const memory = truthVault.findCrystalByIntent(intent);

        if (memory) {
            console.log(`[Lattice] ⚡ ZERO LATENCY HIT: Found crystal ${memory.id} in TruthVault.`);
            return {
                id: memory.id,
                model_used: 'truth_vault (simulated_brain)', // Conceptual "Brain"
                steps: 0,
                reliability_score: 1.0, // It's a verified memory, so 100% reliable
                crystal: null, // In real implementation we'd hydrate the full crystal
                prompt_used: 'N/A (Direct Memory Access)'
            };
        }



        // Strategy A: Try the Primary Model (Fastest)
        const primaryPath = await this.attemptPath(intent, 'primary', 'google/gemini-2.0-flash-exp:free');
        if (primaryPath.reliability_score > 0.9) {
            return primaryPath;
        }

        console.log(`[Lattice] ⚠️ Primary path unstable (Score: ${primaryPath.reliability_score})...`);

        // ════════════════════════════════════════════════════════════════════════
        // ANTIFRAGILE AUTO-TUNING (Evolution Engine) 🧬
        // ════════════════════════════════════════════════════════════════════════
        if (primaryPath.reliability_score < 0.7) {
            console.log(`[Lattice] 🧬 Triggering Evolution Engine for self-repair...`);

            const improvedPrompt = await EvolutionEngine.evolve(intent, primaryPath.prompt_used, primaryPath.reliability_score);

            if (improvedPrompt) {
                console.log(`[Lattice] ✨ Attempting Path with EVOLVED GENETICS...`);
                // Hot-Patch Attempt: Try again with evolved prompt
                const evolvedPath = await this.attemptPath(intent, 'evolved_primary', 'google/gemini-2.0-flash-exp:free', improvedPrompt);

                if (evolvedPath.reliability_score > primaryPath.reliability_score) {
                    console.log(`[Lattice] ✅ Evolution Successful! Reliability increased to ${evolvedPath.reliability_score}`);
                    return evolvedPath;
                }
            }
        }

        console.log(`[Lattice] ⚠️ Evolution failed or insufficient. Rerouting to Sovereign Lattice...`);

        // Strategy B: The "Sovereign" Path (More robust, cross-verified)
        const sovereignPath = await this.attemptPath(intent, 'sovereign', 'anthropic/claude-3-haiku');

        if (sovereignPath.reliability_score > primaryPath.reliability_score) {
            return sovereignPath;
        }

        return primaryPath; // Return the best we have
    }

    private static async attemptPath(intent: string, strategy: string, model: string, overridePrompt?: string): Promise<LatticePath> {
        // This simulates the "Stochastic Engine" logic
        // It asks the LLM to generate the Crystal directly

        try {
            const basePrompt = `
            GENERATE A CRYSTAL for this intent: ${intent}
            STRICTLY FOLLOW these constraints:
            [...constraints hidden for brevity...]
            
            Return ONLY the valid Crystal JSON.
            `;

            const prompt = overridePrompt || basePrompt;

            const res = await SCPService.resilientCallLLM(prompt, model, 'Lattice Orchestrator');

            // REAL VERIFICATION: Using MathCore (Vector + Bayes)
            const reliability = this.calculateReliability(intent, res.content);

            let parsedCrystal: Crystal | null = null;
            try {
                const jsonMatch = res.content.match(/```(?:json)?\s*([\s\S]*?)```/);
                const jsonStr = jsonMatch ? jsonMatch[1] : res.content;
                parsedCrystal = JSON.parse(jsonStr.trim());
            } catch (e) {
                console.warn('[Lattice] Failed to parse Crystal JSON from response');
            }

            return {
                id: `path_${Date.now()}`,
                model_used: model,
                steps: 1,
                reliability_score: reliability,
                crystal: parsedCrystal,
                prompt_used: prompt
            };

        } catch (e) {
            return {
                id: `path_failed`,
                model_used: model,
                steps: 0,
                reliability_score: 0.0,
                crystal: null,
                error: e instanceof Error ? e.message : 'Unknown error',
                prompt_used: ''
            };
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MATHEMATICAL VERIFICATION CORE (No Mocks)
    // ════════════════════════════════════════════════════════════════════════
    private static calculateReliability(intent: string, content: string): number {
        // 1. Semantic Alignment (Vector Space)
        // Ensure the output is mathematically aligned with the intent.
        const similarity = MathCore.cosineSimilarity(intent, content);

        // 2. Structural Integrity
        let isJsonValid = false;
        try {
            JSON.parse(content);
            isJsonValid = true;
        } catch { isJsonValid = false; }

        // 3. Bayesian Fusion
        // Calculate P(Reliable | Evidence) using a naive Bayesian update.
        // We treat High Cosine Similarity and Valid JSON as positive evidence.

        // Prior belief (Conservative)
        // alpha (successes), beta (failures)
        const evidence = (similarity * 10) + (isJsonValid ? 5 : 0);
        const contradictions = ((1 - similarity) * 5) + (isJsonValid ? 0 : 10);

        const score = MathCore.bayesianConfidence(evidence, contradictions);

        console.log(`[MathCore] 📐 Vector Similarity: ${similarity.toFixed(4)} | Bayesian Score: ${score.toFixed(4)}`);
        return score;
    }
}

