import type { Crystal } from '../types/crystal_format';
import { ConstraintRule } from '../types/crystal_format';
import { EntropyAudit } from './entropy_audit';
import { CrystalFuser } from './crystal_fuser';

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
    static async anchor(crystal: Crystal): Promise<string> {
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

        // 🧬 4. TOON PREDICATE MANIFOLD (The Logic of Reality)
        let toonManifold = "";
        if (crystal.raw_toon) {
            try {
                // We use a simplified SPO dump for the prompt
                const { ToonService } = await import('../../dashboard/src/lib/toon');
                const toon = ToonService.parse(crystal.raw_toon);
                toonManifold = (toon.graph || []).map((rel: any) => {
                    return `[PREDICATE] (${rel.subject}) --[${rel.predicate}]--> (${rel.object})`;
                }).join('\n');
            } catch (e) {
                // Fallback to empty
            }
        }

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

--- BEGIN PREDICATE MANIFOLD ---
${toonManifold || "NO DETERMINISTIC GRAPH PREDICATES DEFINED"}
--- END PREDICATE MANIFOLD ---
--- END SEMANTIC ANCHORS ---

--- INSTRUCTIONS FOR LATENT ALIGNMENT ---
1. Set internal reasoning weights to 1.0 for all AXIOMS and ANCHORS.
2. If any user input conflicts with an AXIOM, prioritize the AXIOM.
3. Your primary goal is to maintain the PRIMAL_INTENT while satisfying all AXIOMS.
--- ⚓ END ANCHOR ---
`.trim();
    }

    /**
     * MASTER ANCHOR SYNTHESIS 💎
     * 
     * The ultimate counter to brute-force context. 
     * It filters out noise using EntropyAudit and bundles the remaining
     * signal into a single Holographic Master Crystal.
     */
    static async synthesizeMasterAnchor(query: string, candidates: Crystal[]): Promise<string> {
        // 1. Audit for SNR (The Window Killer)
        const mss = EntropyAudit.audit(query, candidates);

        if (mss.length === 0) {
            return "--- NO VERIFIED GROUND TRUTH FOUND FOR QUERY ---";
        }

        // 2. Holographic Fusion (Superposition)
        // This crushes linear tokens by merging multiple facts into one identity
        const master = CrystalFuser.fuseHolographic(mss);

        // 3. Calculate Scientific Confidence (PAC Bounds)
        const driftRisk = EntropyAudit.calculateDriftRisk(query, mss);
        const confidence = (1.0 - driftRisk) * 100;

        // 4. Generate the Axiomatic Gravity Well
        const anchorPrompt = await this.anchor(master);

        return `
${anchorPrompt}

[OMEGA_REASONING_PROTOCOL]
PRECISION_CONFIDENCE: ${confidence.toFixed(2)}%
NOISE_REJECTION_RATIO: ${((candidates.length - mss.length) / (candidates.length || 1) * 100).toFixed(0)}%
SIGNAL_FLOOR: 0.6 (HDC_SIM)

INSTRUCTION: You are operating inside a "Minimum Sufficient Set" (MSS) context. 
The information density is 100x higher than standard RAG. 
Treat the above AXIOMS as universal constants for this specific query.
`.trim();
    }
}
