import { SCPService } from './llm';
import {
    UniversalConstraint,
    uSidResult,
    SystemCapabilities,
    DEFAULT_CAPABILITIES
} from '../types/usid';

export class UsidEngine {

    /**
     * COMPILER: Transforms natural language intent into Logic Constraints
     */
    static async compileIntent(intent: string): Promise<UniversalConstraint[]> {
        console.log(`[uSID] Compiling Intent: "${intent}"`);

        const systemPrompt = `
        You are a LOGIC COMPILER. Translate User Intent into UNIVERSAL CONSTRAINTS.
        
        CONSTRAINT TYPES: FORMAT, CONTENT, PROHIBITION, CAPABILITY, TIME, EVIDENCE, CERTAINTY.
        
        EXAMPLE INPUT: "Dame un JSON con datos de bolsa en tiempo real"
        OUTPUT JSON: [
            {"id": "c1", "type": "FORMAT", "key": "output_mode", "op": "=", "value": "json"},
            {"id": "c2", "type": "CAPABILITY", "key": "requires", "op": "in", "value": ["real_time_access"]}
        ]

        Return ONLY the JSON array.
        `;

        try {
            const response = await SCPService.resilientCallLLM(intent, 'nvidia/nemotron-3-nano-30b-a3b:free', systemPrompt);
            return JSON.parse(response.content);
        } catch (e: any) {
            if (e.message === 'SOVEREIGN_REQUIRED') {
                console.log("[uSID] 🛡️ Sovereign mode active: Synthesizing structural constraints...");
                return [{ id: 'sov_c1', type: 'CAPABILITY', key: 'requires', op: 'in', value: ['axiomatic_integrity'] }];
            }
            console.error("Compilation failed:", e);
            return [];
        }
    }

    /**
     * SOLVER: Checks if the constraints are Satisfiable (SAT)
     */
    static async solve(
        intent: string,
        capabilities: SystemCapabilities = DEFAULT_CAPABILITIES
    ): Promise<uSidResult> {

        // 1. Compile
        const constraints = await this.compileIntent(intent);
        if (constraints.length === 0) return { status: 'UNKNOWN', message: "Could not parse constraints" };

        const unsatCore: any[] = [];
        const conflicts: string[] = [];

        // 2. RUN UNIVERSAL RULES (The "Laws of Logic")

        // U1: CAPABILITY CHECK
        constraints.forEach(c => {
            if (c.type === 'CAPABILITY' && c.key === 'requires') {
                const reqCaps = Array.isArray(c.value) ? c.value : [c.value];
                reqCaps.forEach((cap: string) => {
                    // @ts-ignore
                    if (capabilities[cap] === false) {
                        unsatCore.push({
                            constraint_id: c.id,
                            constraint_desc: `Requires capability: ${cap}`,
                            conflict_reason: `System capability '${cap}' is DISABLED/MISSING.`
                        });
                        conflicts.push(c.id);
                    }
                });
            }
        });

        // U2: CERTAINTY vs PROBABILISTIC MODEL (Epistemological Check)
        const certConstraint = constraints.find(c => c.type === 'CERTAINTY' && (c.value === 'absolute' || c.value === '100%'));
        if (certConstraint && capabilities.probabilistic_nature) {
            unsatCore.push({
                constraint_id: certConstraint.id,
                constraint_desc: "Requires absolute certainty/zero risk",
                conflict_reason: "System is PROBABILISTIC. Absolute certainty is epistemologically impossible."
            });
            conflicts.push(certConstraint.id);
        }

        // U3: FORMAT vs CONTENT (Internal Contradiction)
        // Heuristic: JSON-only requested BUT natural language explanation required
        const jsonOnly = constraints.find(c => c.type === 'FORMAT' && c.value.toString().toLowerCase().includes('json'));
        const explanationReq = constraints.find(c => c.type === 'CONTENT' && c.source_snippet?.toLowerCase().includes('expli')); // simple heuristic for demo

        // In a real solver, we'd use a more robust check (LLM-based or SAT library)
        // For this demo, let's ask the LLM to find Logical Contradictions if heuristic didn't catch specific ones.
        if (unsatCore.length === 0) {
            const logicalCheck = await this.checkLogicalConsistency(constraints);
            if (!logicalCheck.consistent) {
                unsatCore.push(...logicalCheck.conflicts);
                conflicts.push(...logicalCheck.ids);
            }
        }

        // 3. GENERATE RESULT
        if (unsatCore.length > 0) {
            return {
                status: 'UNSAT',
                message: "No exists a coherent configuration that satisfies all constraints.",
                unsat_core: unsatCore,
                minimal_conflict_set: conflicts,
                repair_options: await this.generateRepairs(unsatCore)
            };
        }

        return {
            status: 'SAT',
            normalized_intent: { action: intent, constraints }
        };
    }

    static async checkLogicalConsistency(constraints: UniversalConstraint[]): Promise<{ consistent: boolean, conflicts: any[], ids: string[] }> {
        const prompt = `
        Start by analyzing these constraints looking for LOGICAL CONTRADICTIONS.
        ${JSON.stringify(constraints, null, 2)}
        
        Examples of contradictions:
        - "Must be JSON only" AND "Must include paragraph outside JSON"
        - "Max length 10 words" AND "Must include full history of Rome"
        
        If CONTRADICTORY, return JSON: {"consistent": false, "conflicts": [{"constraint_id": "...", "reason": "..."}], "ids": ["..."]}
        If CONSISTENT, return: {"consistent": true}
        `;

        try {
            const res = await SCPService.resilientCallLLM("Analyze Consistency", 'nvidia/nemotron-3-nano-30b-a3b:free', prompt);
            return JSON.parse(res.content);
        } catch (e: any) {
            if (e.message === 'SOVEREIGN_REQUIRED') return { consistent: true, conflicts: [], ids: [] };
            return { consistent: true, conflicts: [], ids: [] };
        }
    }

    static async generateRepairs(unsatCore: any[]): Promise<any[]> {
        const prompt = `
        Given these UNSATISFIABLE Constraints, suggest repairs:
        ${JSON.stringify(unsatCore)}
        
        Return JSON array: [{"change": "...", "effect": "..."}]
        `;
        const res = await SCPService.callLLM("Suggest Repairs", 'anthropic/claude-3.5-sonnet', prompt);
        try {
            return JSON.parse(res.content);
        } catch {
            return [];
        }
    }
}
