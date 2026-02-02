// Multi-Crystal Knowledge Graph
// Versioned dependencies creating a Knowledge OS

import type { Crystal } from '../types/crystal_format';

export interface CrystalReference {
    crystal_id: string;
    version: string;        // Semantic versioning (e.g., "1.2.0")
    hash: string;           // SHA3 hash for immutability
}

export interface CrystalDependency {
    ref: CrystalReference;
    type: 'requires' | 'extends' | 'conflicts_with';
    scope: 'domain' | 'client' | 'project' | 'implementation';
}

export interface VersionedCrystal {
    crystal_id: string;
    version: string;
    content: Crystal;           // The actual Crystal
    dependencies: CrystalDependency[];
    created_at: string;
    deprecated?: boolean;
    superseded_by?: CrystalReference;
}

export interface KnowledgeGraph {
    crystals: Map<string, VersionedCrystal[]>; // crystal_id -> versions
    dependency_graph: Map<string, string[]>;    // crystal_id -> dependencies
}

/**
 * Create a versioned Crystal with dependencies
 */
export function createVersionedCrystal(params: {
    crystal: Crystal;
    version: string;
    dependencies?: CrystalDependency[];
}): VersionedCrystal {
    const { crystal, version, dependencies = [] } = params;

    return {
        crystal_id: crystal.context_id,
        version,
        content: crystal,
        dependencies,
        created_at: new Date().toISOString(),
        deprecated: false
    };
}

/**
 * Resolve Crystal dependencies
 * Returns the full dependency tree in topological order
 */
export function resolveDependencies(params: {
    crystal_ref: CrystalReference;
    graph: KnowledgeGraph;
}): { resolved: VersionedCrystal[]; conflicts: string[] } {
    const { crystal_ref, graph } = params;

    const resolved: VersionedCrystal[] = [];
    const visited = new Set<string>();
    const conflicts: string[] = [];

    function resolve(ref: CrystalReference): void {
        const key = `${ref.crystal_id}@${ref.version}`;

        if (visited.has(key)) {
            return;
        }

        visited.add(key);

        // Find the Crystal version
        const versions = graph.crystals.get(ref.crystal_id);
        if (!versions) {
            conflicts.push(`Crystal ${ref.crystal_id} not found`);
            return;
        }

        const crystal = versions.find(v => v.version === ref.version);
        if (!crystal) {
            conflicts.push(`Version ${ref.version} of ${ref.crystal_id} not found`);
            return;
        }

        // Check for deprecation
        if (crystal.deprecated && crystal.superseded_by) {
            console.warn(`[Knowledge Graph] ${key} is deprecated, consider using ${crystal.superseded_by.crystal_id}@${crystal.superseded_by.version}`);
        }

        // Resolve dependencies first (topological order)
        for (const dep of crystal.dependencies) {
            if (dep.type === 'conflicts_with') {
                conflicts.push(`Conflict: ${key} conflicts with ${dep.ref.crystal_id}@${dep.ref.version}`);
            } else {
                resolve(dep.ref);
            }
        }

        resolved.push(crystal);
    }

    resolve(crystal_ref);

    return { resolved, conflicts };
}

/**
 * Merge multiple Crystals into a composite context
 * Useful for combining domain + client + project knowledge
 */
export function mergecrystals(params: {
    crystals: VersionedCrystal[];
    merge_strategy?: 'union' | 'priority' | 'strict';
}): Crystal {
    const { crystals, merge_strategy = 'union' } = params;

    if (crystals.length === 0) {
        throw new Error('Cannot merge empty crystal list');
    }

    // Start with base crystal - ensure it exists
    const baseCrystal = crystals[0];
    if (!baseCrystal || !baseCrystal.content) {
        throw new Error('Base crystal or content is undefined');
    }

    const merged = JSON.parse(JSON.stringify(baseCrystal.content));

    // Merge constraints, entities, evidence
    for (let i = 1; i < crystals.length; i++) {
        const currentCrystal = crystals[i];
        if (!currentCrystal || !currentCrystal.content) {
            console.warn(`[KnowledgeGraph] Crystal at index ${i} is undefined, skipping`);
            continue;
        }

        const current = currentCrystal.content;

        // Conflict Detection
        if (merge_strategy === 'strict') {
            const currentConflicts = detectConflicts(merged, current);
            if (currentConflicts.length > 0) {
                throw new Error(`Knowledge Conflict detected during strict merge: ${currentConflicts.join('; ')}`);
            }
        }

        // Merge constraints
        if (current.constraints) {
            merged.constraints = merged.constraints || [];
            for (const constraint of current.constraints) {
                // Avoid duplicates
                if (!merged.constraints.find((c: { id: string }) => c.id === constraint.id)) {
                    merged.constraints.push(constraint);
                }
            }
        }

        // Merge entities
        if (current.entities) {
            merged.entities = merged.entities || [];
            for (const entity of current.entities) {
                if (!merged.entities.find((e: { name: string }) => e.name === entity.name)) {
                    merged.entities.push(entity);
                }
            }
        }

        // Merge evidence
        if (current.evidence) {
            merged.evidence = merged.evidence || [];
            merged.evidence.push(...current.evidence);
        }
    }

    return merged;
}

/**
 * Version comparison (semantic versioning)
 */
export function compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;

        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }

    return 0;
}

/**
 * Detect semantic or structural conflicts between two Crystals
 */
export function detectConflicts(base: Crystal, incoming: Crystal): string[] {
    const conflicts: string[] = [];

    // 1. Constraint Conflicts
    if (base.constraints && incoming.constraints) {
        for (const inc of incoming.constraints) {
            const existing = base.constraints.find((c: { id: string }) => c.id === inc.id);
            if (existing) {
                // Same ID must have same content
                if (existing.value !== inc.value || existing.rule !== inc.rule) {
                    conflicts.push(`Constraint ID ${inc.id} has contradictory definitions`);
                }
            } else {
                // Search for semantic overlap (same value, different rule)
                const overlap = base.constraints.find((c: { value: string; rule: string }) =>
                    c.value.toLowerCase().trim() === inc.value.toLowerCase().trim() &&
                    c.rule !== inc.rule
                );
                if (overlap) {
                    conflicts.push(`Semantic conflict: "${inc.value}" is defined as ${overlap.rule} and ${inc.rule}`);
                }
            }
        }
    }

    // 2. Intent Status Conflict
    if (base.intent && incoming.intent) {
        if (base.intent.status === 'active' && incoming.intent.status === 'deprecated' && base.context_id === incoming.context_id) {
            conflicts.push(`Status conflict: incoming crystal deprecates active base crystal`);
        }
    }

    return conflicts;
}

export const KnowledgeGraphOS = {
    createVersionedCrystal,
    resolveDependencies,
    mergecrystals,
    detectConflicts,
    compareVersions
};
