import type { Crystal } from '../types/crystal_format';
import { ConstraintRule } from '../types/crystal_format';
import { SCPService } from './llm';
import { Sentinel } from './sentinel';

/**
 * CRYSTAL FUSION ENGINE (Reality Merging) 💎
 * 
 * Capability: Takes multiple Crystals (possibly from different models or sessions)
 * and fuses them into a single, high-fidelity "Master Crystal" while resolving
 * all semantic conflicts autonomously.
 */
export class CrystalFuser {

    /**
     * Merges an array of Crystals into one.
     */
    static async fuse(crystals: Crystal[]): Promise<Crystal> {
        if (crystals.length === 1) return crystals[0]!;

        console.log(`[CrystalFuser] 💎 Initiating Fusion for ${crystals.length} Reality Crystals...`);

        // 1. Identify Conflicts via LLM
        const fusionPrompt = `
        ACT AS A SEMANTIC ARCHITECT.
        You are merging ${crystals.length} Context Crystals into a single MASTER REALITY.
        
        INPUT CRYSTALS:
        ${crystals.map((c, i) => `CRYSTAL_${i}: ${JSON.stringify({ intent: c.intent, constraints: c.constraints })}`).join('\n\n')}
        
        TASK:
        1. Resolve all conflicts (if A says 'Limit 5' and B says 'Limit 10', choose the more rigorous/safe one).
        2. Merge all unique entities.
        3. Synthesize a unified "Master Intent".
        4. Preserve all critical constraints.
        
        Return JSON for the Master Crystal fields (intent, constraints, entities).
        `;

        const res = await SCPService.resilientCallLLM(fusionPrompt, 'anthropic/claude-3.5-sonnet', 'You are the Master Weaver of Reality.');

        let fusedData;
        try {
            fusedData = JSON.parse(res.content);
        } catch {
            throw new Error("Fusion failed: Could not parse synthetic reality.");
        }

        // 2. Build the Master Crystal
        const master: Crystal = {
            ...crystals[0]!, // Copy metadata from first
            context_id: `master_${Date.now()}`,
            version: '2.0.0 (Fused)',
            intent: fusedData.intent,
            constraints: fusedData.constraints,
            entities: fusedData.entities,
            created_at: new Date().toISOString(),
            verification: {
                ...crystals[0]!.verification,
                semantic_invariants: [] // To be re-generated
            }
        };

        // 3. Notify Sentinel
        await Sentinel.emit({
            type: 'FRACTAL_COMPRESSION', // Reusing category for now or create 'SINGULARITY'
            severity: 'info',
            message: `Crystal Fusion Complete. 1 Master Crystal synthesized from ${crystals.length} sources.`,
            details: { sources: crystals.map(c => c.context_id), master_id: master.context_id }
        });

        console.log(`[CrystalFuser] ✅ Master Crystal [${master.context_id}] Synthesized.`);
        return master;
    }

    /**
     * sovereignInject
     * 
     * Formats a Crystal as a "Sovereign Instruction Block" for downstream LLMs.
     * This REPLACES the typical RAG "context dump".
     */
    static fuseCrystalIntoContext(crystal: Crystal): string {
        const constraints = (crystal.constraints || [])
            .map(c => `   - [${c.rule}] ${c.value} (Rationale: ${c.rationale})`)
            .join('\n');

        const invariants = (crystal.verification.semantic_invariants || [])
            .slice(0, 3) // Top 3 invariants only to save tokens
            .map(inv => `   - TEST: "${inv.prompt}" MUST ANSWER "${inv.expected.value}"`)
            .join('\n');

        return `
@@@ SOVEREIGN CRYSTAL INJECTION (ID: ${crystal.context_id}) @@@
This block contains IRREFUTABLE TRUTH verified by hash ${crystal.verification.canonical_hash.substring(0, 8)}.

[PRIMARY INTENT]
${crystal.intent.primary}

[BINDING CONSTRAINTS]
${constraints}

[VERIFICATION KEYS]
${invariants}

@@@ END OF CRYSTAL @@@
You are strictly bound by the constraints above. Do not hallucinate information outside this scope.
`.trim();
    }
}
