/**
 * TURBO COMPILER - Phase Turbo
 * Pre-compiles Semantic Crystals into inference-ready "TurboContext" blobs.
 * 
 * This eliminates the need for real-time processing, enabling:
 * - Sub-10ms query response (from cache)
 * - Zero LLM cost for cached hits
 * - Full offline capability
 */

import { Crystal } from '../types/crystal_format';
import * as crypto from 'crypto';

// ============================================
// TYPES
// ============================================

export interface TurboContext {
    /** Unique fingerprint for cache invalidation */
    fingerprint: string;

    /** Version of the TurboContext format */
    turbo_version: string;

    /** Compilation timestamp */
    compiled_at: string;

    /** Source crystal IDs */
    source_crystals: string[];

    /** Pre-formatted prompt context (ready for LLM injection) */
    prompt_context: string;

    /** Compressed TOON logic for fast parsing */
    toon_payload: string;

    /** Pre-computed answers for common queries (instant response) */
    cached_responses: Map<string, CachedResponse>;

    /** Total token count estimate */
    token_estimate: number;

    /** Byte size of compiled context */
    byte_size: number;
}

export interface CachedResponse {
    query_fingerprint: string;
    response: string;
    confidence: number;
    verified: boolean;
    cached_at: string;
}

export interface CompilationOptions {
    /** Maximum tokens for the compiled context */
    max_tokens?: number;

    /** Include TOON reasoning chains */
    include_toon?: boolean;

    /** Pre-compute responses for these queries */
    precompute_queries?: string[];

    /** Compression level (0-9) */
    compression_level?: number;
}

const DEFAULT_OPTIONS: CompilationOptions = {
    max_tokens: 16000,
    include_toon: true,
    precompute_queries: [],
    compression_level: 5,
};

// ============================================
// TURBO COMPILER
// ============================================

export class TurboCompiler {

    /**
     * Compile a set of crystals into a TurboContext.
     */
    async compile(crystals: Crystal[], options: CompilationOptions = {}): Promise<TurboContext> {
        const opts = { ...DEFAULT_OPTIONS, ...options };
        const startTime = Date.now();

        console.log(`[TurboCompiler] Compiling ${crystals.length} crystals...`);

        // 1. Extract and format prompt context
        const promptContext = this.buildPromptContext(crystals, opts);

        // 2. Compress TOON logic
        const toonPayload = opts.include_toon
            ? this.extractToonLogic(crystals)
            : '';

        // 3. Pre-compute responses for specified queries
        const cachedResponses = new Map<string, CachedResponse>();
        for (const query of opts.precompute_queries || []) {
            const response = await this.precomputeResponse(query, crystals);
            if (response) {
                cachedResponses.set(this.hashQuery(query), response);
            }
        }

        // 4. Calculate fingerprint for cache invalidation
        const fingerprint = this.computeFingerprint(crystals);

        // 5. Estimate token count
        const tokenEstimate = Math.ceil(promptContext.length / 4);

        const turboContext: TurboContext = {
            fingerprint,
            turbo_version: '1.0.0',
            compiled_at: new Date().toISOString(),
            source_crystals: crystals.map(c => c.context_id),
            prompt_context: promptContext,
            toon_payload: toonPayload,
            cached_responses: cachedResponses,
            token_estimate: tokenEstimate,
            byte_size: new Blob([promptContext]).size,
        };

        const compileTime = Date.now() - startTime;
        console.log(`[TurboCompiler] Compiled in ${compileTime}ms | ${tokenEstimate} tokens | ${turboContext.byte_size} bytes`);

        return turboContext;
    }

    /**
     * Build a prompt-ready context string from crystals.
     */
    private buildPromptContext(crystals: Crystal[], opts: CompilationOptions): string {
        const sections: string[] = [];

        // Header
        sections.push(`<CRYSTAL_CONTEXT version="turbo-1.0" crystals="${crystals.length}">`);

        // Sort crystals by relevance/tier
        const sortedCrystals = [...crystals].sort((a, b) => {
            const tierOrder = { 'singularity': 0, 'sovereign': 1, 'trusted': 2, 'certified': 3, 'verified': 4, 'community': 5 };
            return (tierOrder[a.tier] || 5) - (tierOrder[b.tier] || 5);
        });

        for (const crystal of sortedCrystals) {
            const crystalBlock = this.formatCrystalForPrompt(crystal);
            sections.push(crystalBlock);

            // Check token limit
            const currentTokens = Math.ceil(sections.join('\n').length / 4);
            if (currentTokens > (opts.max_tokens || DEFAULT_OPTIONS.max_tokens!)) {
                console.warn(`[TurboCompiler] Truncating at ${crystals.indexOf(crystal) + 1} crystals due to token limit`);
                break;
            }
        }

        sections.push(`</CRYSTAL_CONTEXT>`);

        return sections.join('\n\n');
    }

    /**
     * Format a single crystal for prompt injection.
     */
    private formatCrystalForPrompt(crystal: Crystal): string {
        const lines: string[] = [];

        lines.push(`<CRYSTAL id="${crystal.context_id}" tier="${crystal.tier}">`);

        // Intent
        if (crystal.intent) {
            lines.push(`  <INTENT>${crystal.intent.semantic_intent || 'GENERAL'}</INTENT>`);
            if (crystal.intent.keywords?.length) {
                lines.push(`  <KEYWORDS>${crystal.intent.keywords.join(', ')}</KEYWORDS>`);
            }
        }

        // Core knowledge (raw_toon)
        if (crystal.raw_toon) {
            lines.push(`  <KNOWLEDGE>`);
            lines.push(`    ${crystal.raw_toon}`);
            lines.push(`  </KNOWLEDGE>`);
        }

        // Invariants (if verified)
        if (crystal.verification?.semantic_invariants?.length) {
            lines.push(`  <INVARIANTS>`);
            for (const inv of crystal.verification.semantic_invariants.slice(0, 5)) {
                lines.push(`    - ${inv.statement} [${inv.status}]`);
            }
            lines.push(`  </INVARIANTS>`);
        }

        // Dynamic state if available
        if (crystal.dynamic_state?.summary) {
            lines.push(`  <CONTEXT>${crystal.dynamic_state.summary}</CONTEXT>`);
        }

        lines.push(`</CRYSTAL>`);

        return lines.join('\n');
    }

    /**
     * Extract and compress TOON logic from crystals.
     */
    private extractToonLogic(crystals: Crystal[]): string {
        const toonStatements: string[] = [];

        for (const crystal of crystals) {
            if (crystal.raw_toon) {
                toonStatements.push(`[${crystal.context_id}] ${crystal.raw_toon}`);
            }
        }

        return toonStatements.join('\n');
    }

    /**
     * Pre-compute a response for a specific query.
     * In production, this would call the LLM during compile time.
     */
    private async precomputeResponse(query: string, crystals: Crystal[]): Promise<CachedResponse | null> {
        // Placeholder: In production, this would invoke the LLM
        // For now, we return a structure showing the concept

        return {
            query_fingerprint: this.hashQuery(query),
            response: `[PRECOMPUTED] Response for: "${query}" based on ${crystals.length} crystals`,
            confidence: 0.85,
            verified: false,
            cached_at: new Date().toISOString(),
        };
    }

    /**
     * Compute a stable fingerprint for cache invalidation.
     */
    private computeFingerprint(crystals: Crystal[]): string {
        const content = crystals
            .map(c => `${c.context_id}:${c.verification?.canonical_hash || 'NONE'}`)
            .sort()
            .join('|');

        return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
    }

    /**
     * Hash a query for lookup.
     */
    private hashQuery(query: string): string {
        return crypto.createHash('md5').update(query.toLowerCase().trim()).digest('hex');
    }

    /**
     * Serialize TurboContext for storage.
     */
    serialize(context: TurboContext): string {
        // Convert Map to object for JSON serialization
        const serializable = {
            ...context,
            cached_responses: Object.fromEntries(context.cached_responses),
        };
        return JSON.stringify(serializable);
    }

    /**
     * Deserialize TurboContext from storage.
     */
    deserialize(data: string): TurboContext {
        const parsed = JSON.parse(data);
        return {
            ...parsed,
            cached_responses: new Map(Object.entries(parsed.cached_responses || {})),
        };
    }
}

// Singleton export
export const turboCompiler = new TurboCompiler();
