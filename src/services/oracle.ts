import { SCPService, type LLMResponse } from './llm';
import { Crystal, ConstraintRule } from '../types/crystal_format';

export interface OraclePrediction {
    original_timeline_outcome: 'SUCCESS' | 'FAILURE' | 'CONFUSION';
    predicted_failure?: string;
    intervention?: string;
    optimized_crystal_diff: string;
}

/**
 * THE ORACLE ENGINE (Pre-Cognitive Optimization)
 * 
 * "Fixing mistakes you haven't made yet."
 * 
 * The Oracle runs a "Ghost Simulation" of the interaction.
 * If it detects a likely failure mode (hallucination, refusal, ambiguity),
 * it modifies the Crystal NOW to prevent that future.
 */
export class Oracle {

    static async predictAndOptimize(crystal: Crystal): Promise<OraclePrediction> {
        console.log(`[Oracle] 🔮 Gazing into the future of Context ID: ${crystal.context_id.substring(0, 8)}...`);

        // 1. SIMULATION (The Ghost Run)
        // We use a fast, "anxious" model to simulate a confused AI.
        const simulationPrompt = `
        GHOST SIMULATION
        
        You are a simulator for a target AI (e.g. Claude).
        You received this Context Crystal.
        
        INTENT: "${crystal.intent.primary}"
        CONSTRAINTS: ${JSON.stringify(crystal.constraints)}
        
        Predict: What is the most likely way you would MISINTERPRET or FAIL this request?
        Be pessimistic. Look for ambiguity.
        
        Return JSON:
        {
            "outcome": "SUCCESS" | "FAILURE",
            "failure_reason": "string (e.g. 'Ambiguous constraints on database type')"
        }
        `;

        let simRes: LLMResponse;
        try {
            simRes = await SCPService.resilientCallLLM(simulationPrompt, 'google/gemini-2.0-flash-exp:free', 'You are Murphy\'s Law.');
        } catch (e) {
            console.warn(`[Oracle] ⚠️ Ghost Simulation unavailable (Network/API Error). Proceeding safely.`);
            return { original_timeline_outcome: 'SUCCESS', optimized_crystal_diff: "Oracle Offline - No Intervention." };
        }

        let prediction;
        try {
            prediction = JSON.parse(simRes.content);
        } catch {
            return { original_timeline_outcome: 'SUCCESS', optimized_crystal_diff: "Oracle Parse Error - No Intervention." };
        }

        if (prediction.outcome === 'SUCCESS') {
            console.log(`[Oracle] ✨ The timeline is clear. No failures foreseen.`);
            return {
                original_timeline_outcome: 'SUCCESS',
                optimized_crystal_diff: "Timeline Stable."
            };
        }

        // 2. INTERVENTION & PRE-IMMUNIZATION (Oracle V2: Dreaming Engine)
        console.log(`[Oracle] ⚠️ PREDICTION: Future Failure detected -> "${prediction.failure_reason}"`);
        console.log(`[Oracle] ⏳ Activating Dreaming Engine for Global Pre-Immunization...`);

        // A. Generate PRE-EMPTIVE VACCINE (Network-wide protection)
        const { VaccineEngine } = await import('./vaccine_engine');
        await VaccineEngine.synthesizePrecognitiveVaccine(crystal, prediction.failure_reason);

        // Notify Sentinel
        const { Sentinel } = await import('./sentinel');
        await Sentinel.emit({
            type: 'ORACLE_DREAM',
            severity: 'warning',
            message: `Pre-immunized against future failure: "${prediction.failure_reason}"`,
            details: { crystal_id: crystal.context_id, predicted_fail: prediction.failure_reason }
        });

        // B. Apply Local Patch
        console.log(`[Oracle] ⏳ Rewriting the present to change the future...`);

        const interventionPrompt = `
        TIMELINE CORRECTION
        
        The Oracle predicted that the current Crystal will cause a failure: "${prediction.failure_reason}".
        
        Current Intent: "${crystal.intent.primary}"
        
        Task: Rewrite the Intent or add a Constraint to PREVENT this specific failure.
        Make it foolproof.
        
        Return ONLY the new Intent string.
        `;

        const fixRes = await SCPService.resilientCallLLM(interventionPrompt, 'google/gemini-pro-1.5', 'You are a Time Traveler.');
        const newIntent = fixRes.content.trim();

        // Apply the fix "Retroactively"
        const oldIntent = crystal.intent.primary;
        crystal.intent.primary = newIntent;

        // Add a "Time Scar" (Record of intervention)
        if (!crystal.constraints) crystal.constraints = [];
        crystal.constraints.push({
            id: `oracle_patch_${Date.now()}`,
            rule: ConstraintRule.MUST,
            value: `Avoid ambiguity regarding: ${prediction.failure_reason}`,
            rationale: "Oracle Intervention prevented simulated failure."
        });

        return {
            original_timeline_outcome: 'FAILURE',
            predicted_failure: prediction.failure_reason,
            intervention: `Rewrote Intent to: "${newIntent.substring(0, 50)}..."`,
            optimized_crystal_diff: `CHANGED: "${oldIntent}" -> "${newIntent}"`
        };
    }
}
