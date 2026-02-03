/**
 * SHARING SERVICE 🔗
 * 
 * Enables public sharing and collaboration on crystals:
 * - Generate shareable links
 * - Fork (duplicate) crystals
 * - Public crystal access (without auth)
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export interface ShareLink {
    share_id: string;
    crystal_id: string;
    created_by: string;
    created_at: string;
    expires_at?: string;
    view_count: number;
    is_active: boolean;
}

export class SharingService {
    /**
     * Create a public share link for a crystal
     */
    static async createShareLink(
        crystalId: string,
        createdBy: string,
        expiresInDays?: number
    ): Promise<ShareLink> {
        // Generate unique share ID
        const shareId = randomBytes(8).toString('hex');

        // Calculate expiration
        let expiresAt: string | undefined;
        if (expiresInDays) {
            const date = new Date();
            date.setDate(date.getDate() + expiresInDays);
            expiresAt = date.toISOString();
        }

        // Create share link record
        const shareLink: ShareLink = {
            share_id: shareId,
            crystal_id: crystalId,
            created_by: createdBy,
            created_at: new Date().toISOString(),
            expires_at: expiresAt,
            view_count: 0,
            is_active: true
        };

        // Store in database (you'd need a shares table)
        // For now, we'll return the object
        console.log('[Sharing] Created share link:', shareLink);

        return shareLink;
    }

    /**
     * Get crystal by share ID (public access)
     */
    static async getCrystalByShareId(shareId: string): Promise<any> {
        // In production, you'd check the shares table first
        // For now, we'll just increment view count and return crystal

        // This is a simplified version - you'd need proper database schema
        console.log('[Sharing] Accessing crystal via share:', shareId);

        // Return public crystal data (stripped of sensitive info)
        const { data: crystal } = await supabase
            .from('crystals')
            .select('context_id, domain, intent, constraints, tags, metadata, created_at')
            .limit(1)
            .single();

        return {
            ...crystal,
            share_id: shareId,
            view_count: Math.floor(Math.random() * 100) // Mock for demo
        };
    }

    /**
     * Fork (duplicate) a crystal
     */
    static async forkCrystal(sourceId: string, newAuthor: string): Promise<any> {
        // Get source crystal
        const { data: source } = await supabase
            .from('crystals')
            .select('*')
            .eq('context_id', sourceId)
            .single();

        if (!source) {
            throw new Error('Source crystal not found');
        }

        // Create new crystal with same data but new author
        const forkedCrystal = {
            ...source,
            context_id: `CTX_${Date.now()}_${randomBytes(4).toString('hex')}`,
            author: newAuthor,
            created_at: new Date().toISOString(),
            metadata: {
                ...source.metadata,
                forked_from: sourceId,
                fork_count: 0
            }
        };

        // Save forked crystal
        const { data: newCrystal, error } = await supabase
            .from('crystals')
            .insert(forkedCrystal)
            .select()
            .single();

        if (error) {
            throw new Error(`Fork failed: ${error.message}`);
        }

        // Update source fork count
        const sourceForkCount = source.metadata?.fork_count || 0;
        await supabase
            .from('crystals')
            .update({
                metadata: {
                    ...source.metadata,
                    fork_count: sourceForkCount + 1
                }
            })
            .eq('context_id', sourceId);

        return newCrystal;
    }

    /**
     * Get analytics for a share link
     */
    static async getShareAnalytics(shareId: string): Promise<{
        views: number;
        forks: number;
        created_at: string;
        is_active: boolean;
    }> {
        // Mock analytics - in production, track in database
        return {
            views: Math.floor(Math.random() * 500),
            forks: Math.floor(Math.random() * 20),
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_active: true
        };
    }

    /**
     * Deactivate a share link
     */
    static async deactivateShare(shareId: string): Promise<void> {
        console.log('[Sharing] Deactivated share:', shareId);
        // In production, update shares table
    }
}
