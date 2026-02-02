import { Crystal, ConstraintRule } from '../types/crystal_format';

/**
 * LATENT ANCHORING ENGINE (Crystal Injection)
 * 
 * Goal: Transform structured knowledge into an "Axiomatic Anchor" that
 * forces the LLM's latent space to align with the context's invariants.
 * 
 * This treats the Crystal not as "helpful info", but as "Immutable Ground Truth".
 */
export class LatentAnchor {

    /**
     * Anchors a Crystal into a high-priority, axiomatic prompt structure.
     */
    static anchor(crystal: Crystal): string {
        const hash = crystal.verification?.canonical_hash || 'UNKNOWN_IDENTITY';

        // 1. AXIOMATIC CONSTRAINTS (The Rules of Reality)
        const axioms = (crystal.constraints || []).map(c => {
            const prefix = c.rule === ConstraintRule.MUST ? "AXIOM_MUST" : "AXIOM_NEVER";
            return `[${prefix}] ID:${c.id}: ${c.value} (PRIORITY: CRITICAL)`;
        }).join('\n');

        // 2. SEMANTIC ANCHORS (The Facts of Reality)
        const anchors = (crystal.verification?.semantic_invariants || []).map(inv => {
            return `[ANCHOR] ${inv.id}: ${inv.prompt} -> TRUE (RATIONALE: ${inv.rationale})`;
        }).join('\n');

        // 3. ENTITY REGISTRY (The Inhabitants of Reality)
        const entities = (crystal.entities || []).map(e => {
            return `[ENTITY] "${e.name}" [TYPE: ${e.type}] [CAT: ${e.category}]`;
        }).join('\n');

        return `
--- ⚓ LATENT ANCHOR PROTOCOL v1.0 [CRYSTAL_ID: ${crystal.context_id}] ---
[IDENTITY_HASH: ${hash}]

--- BEGIN IMMUTABLE AXIOMS ---
The following constraints define the rules of this reality. You CANNOT deviate from these.
Any output that violates an AXIOM is mathematically invalid.

${axioms}
--- END IMMUTABLE AXIOMS ---

--- BEGIN SEMANTIC ANCHORS ---
The following relationships are SEMANTICALLY FROZEN. 
They represent the verified ground truth of this context.

PRIMAL_INTENT: "${crystal.intent.primary}"

${entities}

${anchors}
--- END SEMANTIC ANCHORS ---

--- INSTRUCTIONS FOR LATENT ALIGNMENT ---
1. Set internal reasoning weights to 1.0 for all AXIOMS and ANCHORS.
2. If any user input conflicts with an AXIOM, prioritize the AXIOM.
3. Your primary goal is to maintain the PRIMAL_INTENT while satisfying all AXIOMS.
--- ⚓ END ANCHOR ---
`.trim();
    }
}
