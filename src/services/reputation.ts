import type { Crystal } from '../types/crystal_format';
import { supabase } from '../db/supabase';

export interface ReputationChange {
    author_id: string;
    delta: number;
    reason: string;
    evidence_hash: string;
}

/**
 * Evidence-Backed Reputation System
 * Rewards authors for providing verifiable, high-quality knowledge.
 */
export class ReputationSystem {

    /**
     * Calculate and apply reputation changes based on crystal quality and usage.
     */
    static async rewardQuality(crystal: Crystal): Promise<number> {
        const baseReward = 0.01;
        const qualityBonus = (crystal.verification?.semantic_invariants?.length || 0) * 0.01;
        const totalDelta = baseReward + qualityBonus;

        const { data: author, error: fetchError } = await supabase
            .from('authors')
            .select('reputation')
            .eq('author_id', crystal.author.id)
            .single();

        if (fetchError || !author) return 0;

        const newReputation = Math.min(1.0, author.reputation + totalDelta);

        const { error: updateError } = await supabase
            .from('authors')
            .update({ reputation: newReputation })
            .eq('author_id', crystal.author.id);

        if (updateError) {
            console.error('Error updating reputation:', updateError.message);
            return 0;
        }

        // Log to ledger
        await supabase.from('reputation_ledger').insert({
            author_id: crystal.author.id,
            delta: totalDelta,
            new_reputation: newReputation,
            reason: `High quality crystal compilation: ${crystal.context_id}`,
            created_at: new Date().toISOString()
        });

        return newReputation;
    }

    /**
     * Penalize reputation for detected contradictions or failed verifications.
     */
    static async penalize(authorId: string, reason: string): Promise<number> {
        const penalty = -0.05;

        const { data: author, error: fetchError } = await supabase
            .from('authors')
            .select('reputation')
            .eq('author_id', authorId)
            .single();

        if (fetchError || !author) return 0;

        const newReputation = Math.max(0.0, author.reputation + penalty);

        await supabase
            .from('authors')
            .update({ reputation: newReputation })
            .eq('author_id', authorId);

        await supabase.from('reputation_ledger').insert({
            author_id: authorId,
            delta: penalty,
            new_reputation: newReputation,
            reason: `Penalization: ${reason}`,
            created_at: new Date().toISOString()
        });

        return newReputation;
    }
}
