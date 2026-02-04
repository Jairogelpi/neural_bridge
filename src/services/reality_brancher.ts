import type { Crystal } from '../types/crystal_format';
import { Sentinel } from './sentinel';

export interface RealityBranch {
    branch_id: string;
    parent_crystal_id: string;
    branch_name: string;
    status: 'draft' | 'simulating' | 'merged' | 'rejected';
    modifications: Record<string, unknown>;
    created_at: string;
}

/**
 * REALITY BRANCHER (Semantic Git) 🌳
 * 
 * Capability: Allows "Hypothetical Truths" to be developed in isolation
 * without contaminating the Master Lattice. Once validated, branches can
 * be Atomically Merged.
 */
export class RealityBrancher {

    /**
     * Creates a new Reality Branch from an existing Crystal.
     */
    static async createBranch(parent: Crystal, name: string): Promise<RealityBranch> {
        console.log(`[RealityBrancher] 🌳 Branching Reality: "${name}" from ${parent.context_id}...`);

        const branch: RealityBranch = {
            branch_id: `branch_${Date.now()}`,
            parent_crystal_id: parent.context_id,
            branch_name: name,
            status: 'draft',
            modifications: {},
            created_at: new Date().toISOString()
        };

        await Sentinel.emit({
            type: 'CRYSTAL_FUSION', // Using fusion for now
            severity: 'info',
            message: `New Reality Branch created: "${name}" (ID: ${branch.branch_id})`,
            details: { branch_id: branch.branch_id, parent_id: parent.context_id }
        });

        return branch;
    }

    /**
     * Atomically merges a branch back into the Parent Crystal.
     */
    static async merge(branch: RealityBranch, parent: Crystal): Promise<Crystal> {
        if (branch.status !== 'simulating') {
            console.warn(`[RealityBrancher] ⚠️ Merging a branch that hasn't been simulated yet.`);
        }

        console.log(`[RealityBrancher] ⛓️ Merging Branch [${branch.branch_id}] into Master...`);

        const { CrystalFuser } = await import('./crystal_fuser');

        // Reconstruct a temporary crystal from modifications
        const modifiedCrystal: Crystal = {
            ...parent,
            context_id: branch.branch_id,
            ...branch.modifications,
            raw_toon: (branch.modifications as any).raw_toon || parent.raw_toon
        };

        const merged = await CrystalFuser.fuse([parent, modifiedCrystal]);

        branch.status = 'merged';

        await Sentinel.emit({
            type: 'CRYSTAL_FUSION',
            severity: 'critical',
            message: `Reality Branch "${branch.branch_name}" MERGED into Master Lattice.`,
            details: { branch_id: branch.branch_id, master_id: merged.context_id }
        });

        return merged;
    }
}
