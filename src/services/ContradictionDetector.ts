/**
 * CONTRADICTION DETECTOR - Phase Omega Prime
 * Detects and resolves semantic conflicts between crystals.
 * 
 * Something RAG and CAG CANNOT do:
 * - Detect when two sources contradict each other
 * - Classify the type of conflict
 * - Propose automatic resolution
 */

import { Crystal } from '../types/crystal_format';

// ============================================
// TYPES
// ============================================

export type ConflictType =
    | 'FACTUAL'     // Two crystals state conflicting facts
    | 'TEMPORAL'    // Information is outdated
    | 'OPINION'     // Different perspectives (may both be valid)
    | 'NUMERICAL'   // Conflicting numbers/statistics
    | 'DEFINITION'  // Different definitions for same term
    | 'SCOPE'       // One is more specific than other
    ;

export type ResolutionStrategy =
    | 'NEWER_WINS'          // Use the more recent
    | 'HIGHER_TIER_WINS'    // Trust higher verification tier
    | 'HIGHER_CONFIDENCE'   // Trust higher confidence score
    | 'USER_DECIDES'        // Cannot auto-resolve
    | 'MERGE'               // Both can coexist with context
    | 'SUPERSEDED'          // One explicitly supersedes other
    ;

export interface Contradiction {
    /** Unique ID for this contradiction */
    id: string;

    /** First conflicting crystal */
    crystal_a: {
        id: string;
        claim: string;
        confidence: number;
        timestamp: string;
    };

    /** Second conflicting crystal */
    crystal_b: {
        id: string;
        claim: string;
        confidence: number;
        timestamp: string;
    };

    /** Type of conflict */
    conflict_type: ConflictType;

    /** Severity (0-1) */
    severity: number;

    /** Suggested resolution strategy */
    suggested_resolution: ResolutionStrategy;

    /** The winning claim if auto-resolved */
    resolved_claim?: string;

    /** Explanation of the conflict */
    explanation: string;

    /** When detected */
    detected_at: string;

    /** Resolution status */
    status: 'PENDING' | 'AUTO_RESOLVED' | 'USER_RESOLVED' | 'IGNORED';
}

export interface ContradictionCheckResult {
    /** Were any contradictions found? */
    has_contradictions: boolean;

    /** List of contradictions */
    contradictions: Contradiction[];

    /** Summary */
    summary: string;
}

// ============================================
// CONTRADICTION DETECTOR
// ============================================

export class ContradictionDetector {
    private contradictions: Map<string, Contradiction> = new Map();

    /**
     * Check a new crystal against existing crystals for contradictions.
     */
    async checkForContradictions(
        newCrystal: Crystal,
        existingCrystals: Crystal[]
    ): Promise<ContradictionCheckResult> {
        const contradictions: Contradiction[] = [];

        for (const existing of existingCrystals) {
            // Skip self-comparison
            if (existing.context_id === newCrystal.context_id) continue;

            // Check for potential conflict
            const conflict = await this.detectConflict(newCrystal, existing);
            if (conflict) {
                contradictions.push(conflict);
                this.contradictions.set(conflict.id, conflict);
            }
        }

        return {
            has_contradictions: contradictions.length > 0,
            contradictions,
            summary: contradictions.length > 0
                ? `Found ${contradictions.length} potential contradiction(s) with existing knowledge.`
                : 'No contradictions detected.',
        };
    }

    /**
     * Detect if two crystals conflict.
     */
    private async detectConflict(
        crystalA: Crystal,
        crystalB: Crystal
    ): Promise<Contradiction | null> {
        // Extract claims from both crystals
        const claimsA = this.extractClaims(crystalA);
        const claimsB = this.extractClaims(crystalB);

        // Check for semantic overlap
        const overlap = this.findSemanticOverlap(claimsA, claimsB);
        if (!overlap) return null;

        // Determine if overlap is contradictory
        const conflictAnalysis = this.analyzeConflict(overlap, crystalA, crystalB);
        if (!conflictAnalysis.isContradiction) return null;

        // Create contradiction record
        return {
            id: `CONTRA_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
            crystal_a: {
                id: crystalA.context_id,
                claim: overlap.claimA,
                confidence: crystalA.verification?.semantic_invariants?.[0]?.weight || 0.5,
                timestamp: crystalA.created_at || new Date().toISOString(),
            },
            crystal_b: {
                id: crystalB.context_id,
                claim: overlap.claimB,
                confidence: crystalB.verification?.semantic_invariants?.[0]?.weight || 0.5,
                timestamp: crystalB.created_at || new Date().toISOString(),
            },
            conflict_type: conflictAnalysis.type,
            severity: conflictAnalysis.severity,
            suggested_resolution: this.suggestResolution(conflictAnalysis, crystalA, crystalB),
            explanation: conflictAnalysis.explanation,
            detected_at: new Date().toISOString(),
            status: 'PENDING',
        };
    }

    /**
     * Extract verifiable claims from a crystal.
     */
    private extractClaims(crystal: Crystal): string[] {
        const claims: string[] = [];

        // From raw_toon
        if (crystal.raw_toon) {
            claims.push(crystal.raw_toon);
        }

        // From semantic invariants (use prompt as claim)
        if (crystal.verification?.semantic_invariants) {
            for (const inv of crystal.verification.semantic_invariants) {
                claims.push(inv.prompt);
            }
        }

        // From intent primary/secondary
        if (crystal.intent?.primary) {
            claims.push(crystal.intent.primary);
        }
        if (crystal.intent?.secondary) {
            claims.push(...crystal.intent.secondary);
        }

        return claims;
    }

    /**
     * Find semantic overlap between two sets of claims.
     */
    private findSemanticOverlap(
        claimsA: string[],
        claimsB: string[]
    ): { claimA: string; claimB: string; similarity: number } | null {
        // Simple keyword-based overlap detection
        // In production, this would use embeddings or LLM

        for (const claimA of claimsA) {
            const wordsA = this.extractKeywords(claimA);

            for (const claimB of claimsB) {
                const wordsB = this.extractKeywords(claimB);

                const intersection = wordsA.filter(w => wordsB.includes(w));
                const union = [...new Set([...wordsA, ...wordsB])];

                const similarity = union.length > 0 ? intersection.length / union.length : 0;

                // If significant overlap, this might be contradictory
                if (similarity > 0.3 && intersection.length >= 2) {
                    return { claimA, claimB, similarity };
                }
            }
        }

        return null;
    }

    /**
     * Extract keywords from a claim.
     */
    private extractKeywords(text: string): string[] {
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this', 'it', 'be', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might']);

        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 2 && !stopWords.has(w));
    }

    /**
     * Analyze if overlap represents a contradiction.
     */
    private analyzeConflict(
        overlap: { claimA: string; claimB: string; similarity: number },
        crystalA: Crystal,
        crystalB: Crystal
    ): { isContradiction: boolean; type: ConflictType; severity: number; explanation: string } {
        const claimA = overlap.claimA.toLowerCase();
        const claimB = overlap.claimB.toLowerCase();

        // Check for negation patterns
        const negationPatterns = [
            /\bnot\b/, /\bno\b/, /\bnever\b/, /\bwithout\b/, /\bcan't\b/, /\bcannot\b/,
            /\bwon't\b/, /\bisn't\b/, /\baren't\b/, /\bdoesn't\b/, /\bdon't\b/
        ];

        const hasNegationA = negationPatterns.some(p => p.test(claimA));
        const hasNegationB = negationPatterns.some(p => p.test(claimB));

        // Opposite negation = likely contradiction
        if (hasNegationA !== hasNegationB && overlap.similarity > 0.4) {
            return {
                isContradiction: true,
                type: 'FACTUAL',
                severity: 0.8,
                explanation: `One claim asserts while the other negates: "${overlap.claimA}" vs "${overlap.claimB}"`,
            };
        }

        // Check for numerical conflicts (e.g., "costs $10" vs "costs $20")
        const numbersA = claimA.match(/\d+(\.\d+)?/g);
        const numbersB = claimB.match(/\d+(\.\d+)?/g);

        if (numbersA && numbersB && overlap.similarity > 0.5) {
            const numA = parseFloat(numbersA[0]);
            const numB = parseFloat(numbersB[0]);

            if (Math.abs(numA - numB) / Math.max(numA, numB) > 0.1) {
                return {
                    isContradiction: true,
                    type: 'NUMERICAL',
                    severity: 0.6,
                    explanation: `Conflicting numbers: ${numA} vs ${numB} in similar context`,
                };
            }
        }

        // Check for temporal conflict (older vs newer)
        const ageA = crystalA.created_at ? Date.now() - new Date(crystalA.created_at).getTime() : 0;
        const ageB = crystalB.created_at ? Date.now() - new Date(crystalB.created_at).getTime() : 0;
        const ageDiffDays = Math.abs(ageA - ageB) / (1000 * 60 * 60 * 24);

        if (ageDiffDays > 30 && overlap.similarity > 0.5) {
            return {
                isContradiction: true,
                type: 'TEMPORAL',
                severity: 0.5,
                explanation: `Claims from significantly different times (${Math.round(ageDiffDays)} days apart) may reflect outdated information.`,
            };
        }

        return {
            isContradiction: false,
            type: 'SCOPE',
            severity: 0,
            explanation: 'No clear contradiction detected.',
        };
    }

    /**
     * Suggest a resolution strategy.
     */
    private suggestResolution(
        analysis: { type: ConflictType; severity: number },
        crystalA: Crystal,
        crystalB: Crystal
    ): ResolutionStrategy {
        // Temporal conflicts: newer wins
        if (analysis.type === 'TEMPORAL') {
            return 'NEWER_WINS';
        }

        // Compare tiers
        const tierOrder = ['singularity', 'sovereign', 'trusted', 'certified', 'verified', 'community'];
        const tierA = tierOrder.indexOf(crystalA.tier);
        const tierB = tierOrder.indexOf(crystalB.tier);

        if (tierA !== tierB) {
            return 'HIGHER_TIER_WINS';
        }

        // High severity = user decides
        if (analysis.severity > 0.7) {
            return 'USER_DECIDES';
        }

        // Numerical conflicts with low severity might merge
        if (analysis.type === 'NUMERICAL' && analysis.severity < 0.5) {
            return 'MERGE';
        }

        return 'HIGHER_CONFIDENCE';
    }

    /**
     * Get all pending contradictions.
     */
    getPendingContradictions(): Contradiction[] {
        return Array.from(this.contradictions.values())
            .filter(c => c.status === 'PENDING');
    }

    /**
     * Resolve a contradiction.
     */
    resolveContradiction(
        contradictionId: string,
        resolution: ResolutionStrategy,
        winningCrystalId?: string
    ): boolean {
        const contradiction = this.contradictions.get(contradictionId);
        if (!contradiction) return false;

        contradiction.suggested_resolution = resolution;
        contradiction.status = 'USER_RESOLVED';

        if (winningCrystalId) {
            contradiction.resolved_claim =
                winningCrystalId === contradiction.crystal_a.id
                    ? contradiction.crystal_a.claim
                    : contradiction.crystal_b.claim;
        }

        console.log(`[ContradictionDetector] Resolved ${contradictionId} with strategy: ${resolution}`);
        return true;
    }

    /**
     * Get contradiction statistics.
     */
    getStats(): {
        total: number;
        pending: number;
        auto_resolved: number;
        user_resolved: number;
        by_type: Record<ConflictType, number>;
    } {
        const all = Array.from(this.contradictions.values());

        const byType: Record<ConflictType, number> = {
            FACTUAL: 0,
            TEMPORAL: 0,
            OPINION: 0,
            NUMERICAL: 0,
            DEFINITION: 0,
            SCOPE: 0,
        };

        for (const c of all) {
            byType[c.conflict_type]++;
        }

        return {
            total: all.length,
            pending: all.filter(c => c.status === 'PENDING').length,
            auto_resolved: all.filter(c => c.status === 'AUTO_RESOLVED').length,
            user_resolved: all.filter(c => c.status === 'USER_RESOLVED').length,
            by_type: byType,
        };
    }
}

// Singleton export
export const contradictionDetector = new ContradictionDetector();
