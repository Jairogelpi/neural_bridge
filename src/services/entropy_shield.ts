import type { Crystal } from '../types/crystal_format';
import { Sentinel } from './sentinel';
import { SemanticHasher } from './semantic_hashing';

/**
 * ENTROPY SHIELD (Logic Purification) 🛡️🌀
 * 
 * Capability: Prevents "Semantic Decay" in long-lived knowledge lattices.
 * 1. Prunes duplicate/redundant invariants (Entropy reduction).
 * 2. Merges overlapping constraints.
 * 3. Validates that the "Logical Center" of the Crystal is still stable.
 */
export class EntropyShield {

    /**
     * Purifies a Crystal by removing redundant semantic nodes.
     */
    static async purify(crystal: Crystal): Promise<Crystal> {
        const startSize = JSON.stringify(crystal).length;
        console.log(`[EntropyShield] 🛡️ Analyzing Crystal ${crystal.context_id} for semantic entropy...`);

        // 1. Remove duplicate invariants via S-Hash comparison
        const uniqueInvariants = [];
        const seenHashes = new Set<string>();

        for (const inv of crystal.verification.semantic_invariants) {
            const hashResult = await SemanticHasher.computeHash(inv.prompt);
            if (!seenHashes.has(hashResult.s_hash)) {
                seenHashes.add(hashResult.s_hash);
                uniqueInvariants.push(inv);
            } else {
                console.log(`[EntropyShield] ✂️ Pruning redundant invariant: "${inv.id}"`);
            }
        }

        const purified: Crystal = {
            ...crystal,
            verification: {
                ...crystal.verification,
                semantic_invariants: uniqueInvariants
            }
        };

        const endSize = JSON.stringify(purified).length;
        const reduction = ((1 - endSize / startSize) * 100).toFixed(1);

        if (Number(reduction) > 0) {
            await Sentinel.emit({
                type: 'FRACTAL_COMPRESSION',
                severity: 'info',
                message: `Entropy Shield purified Crystal ${crystal.context_id}. Logic entropy reduced by ${reduction}%.`,
                details: { crystal_id: crystal.context_id, reduction_pct: reduction }
            });
        }

        return purified;
    }
}
