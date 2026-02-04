import { SCPService } from './llm';
import type {
    UniversalConstraint,
    uSidResult,
    SystemCapabilities,
    UnsatCoreItem,
    ConflictRepair
} from '../types/usid';
import {
    DEFAULT_CAPABILITIES
} from '../types/usid';
import { ToonService } from '../../dashboard/src/lib/toon';

export class UsidEngine {

    /**
     * COMPILER: Transforms natural language intent into Logic Constraints
     */
    static async compileIntent(intent: string, domain: string = 'general'): Promise<UniversalConstraint[]> {
        console.log(`[uSID] Compiling Intent for domain '${domain}': "${intent}"`);

        // 🎓 DYNAMIC EXPERT SELECTION
        const { ExpertRegistry } = await import('./expert_registry');
        const models = await ExpertRegistry.findBestJudges(domain);
        const model = models[0] || 'anthropic/claude-3.5-sonnet';

        const systemPrompt = `
        You are a LOGIC COMPILER. Translate User Intent into a TOON manifold.
        Return ONLY the TOON code.
        @intent(Goal)
        MUST [Axiom]
        !logic(Constraint)
        `;

        try {
            const response = await SCPService.resilientCallLLM(intent, model, systemPrompt);
            const toon = ToonService.parse(response.content);
            return (toon.constraints || []).map((c: any) => ({
                id: `c_${Math.random().toString(36).substr(2, 4)}`,
                type: 'LOGIC',
                key: 'toon',
                value: c.value,
                desc: c.value
            }));
        } catch (e: unknown) {
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

        const unsatCore: UnsatCoreItem[] = [];
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

        // U3: SEMANTIC & LOGICAL CONSISTENCY (Deep Solve)
        // We rely on the LLM Arbiter (Scientific Logic) to detect non-heuristic contradictions.
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

    static async checkLogicalConsistency(constraints: UniversalConstraint[]): Promise<{ consistent: boolean, conflicts: UnsatCoreItem[], ids: string[] }> {
        const prompt = `
        Start by analyzing these TOON manifolds looking for LOGICAL CONTRADICTIONS.
        ${constraints.map(c => c.value).join('\n')}
        
        If CONTRADICTORY, return TOON:
        @consistent(false)
        MUST [Reason for failure]
        !ids(conflicting_ids)
        
        If CONSISTENT, return TOON: @consistent(true)
        `;

        try {
            const res = await SCPService.resilientCallLLM("Analyze Consistency", 'nvidia/nemotron-3-nano-30b-a3b:free', prompt);
            const parsed = ToonService.parse(res.content);
            return {
                consistent: parsed.metadata.consistent === 'true',
                conflicts: (parsed.constraints || []).map((c: any) => ({
                    constraint_id: 'unknown',
                    constraint_desc: 'Logical Contradiction',
                    conflict_reason: c.value
                })),
                ids: parsed.proofs.ids?.split(',') || []
            };
        } catch (e: unknown) {
            const msg = (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') ? e.message : '';
            if (msg === 'SOVEREIGN_REQUIRED') return { consistent: true, conflicts: [], ids: [] };
            return { consistent: true, conflicts: [], ids: [] };
        }
    }

    static async generateRepairs(unsatCore: UnsatCoreItem[]): Promise<ConflictRepair[]> {
        const prompt = `
        Given these UNSATISFIABLE TOON Axioms, suggest repairs:
        ${JSON.stringify(unsatCore)}
        
        Return TOON:
        MUST [Repair suggested]
        !effect(Expected outcome)
        `;
        const res = await SCPService.callLLM("Suggest Repairs", 'anthropic/claude-3.5-sonnet', prompt);
        try {
            const parsed = ToonService.parse(res.content);
            return (parsed.constraints || []).map((c: any) => ({
                change: c.value,
                effect: parsed.proofs.effect || 'Neutral'
            }));
        } catch {
            return [];
        }
    }
}
