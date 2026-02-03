import { type Crystal } from '../types/crystal_format';
import { CrystallizationService } from './crystallization';
import { SemanticHasher } from './semantic_hashing';

/**
 * SEMANTIC CACHE 🧠⚡
 * 
 * LSH-based deduplication to avoid re-crystallizing similar content.
 * Returns cached crystals for >95% similarity matches.
 */
export class SemanticCache {
    private static cache = new Map<string, { lsh: string, crystal: Crystal, timestamp: number }>();
    private static readonly SIMILARITY_THRESHOLD = 0.95;
    private static readonly MAX_CACHE_SIZE = 1000;
    private static readonly TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

    /**
     * Check if similar content exists in cache.
     * Returns cached crystal if semantic similarity > 95%.
     */
    static check(text: string): Crystal | null {
        const lsh = SemanticHasher.computeSimHash(text);

        // Exact match (fastest path)
        if (this.cache.has(lsh)) {
            const entry = this.cache.get(lsh)!;
            if (Date.now() - entry.timestamp < this.TTL_MS) {
                console.log(`[SemanticCache] ✅ EXACT HIT for LSH ${lsh.substring(0, 8)}...`);
                return entry.crystal;
            } else {
                this.cache.delete(lsh);
            }
        }

        // Similarity scan (if no exact match)
        for (const [cachedLsh, entry] of this.cache.entries()) {
            const similarity = SemanticHasher.holographicSimilarity(
                SemanticHasher.computeHolographicHash(text),
                SemanticHasher.computeHolographicHash(entry.crystal.intent.primary || '')
            );

            if (similarity >= this.SIMILARITY_THRESHOLD) {
                if (Date.now() - entry.timestamp < this.TTL_MS) {
                    console.log(`[SemanticCache] ✅ SEMANTIC HIT (${(similarity * 100).toFixed(1)}% similar)`);
                    return entry.crystal;
                } else {
                    this.cache.delete(cachedLsh);
                }
            }
        }

        return null;
    }

    /**
     * Store a crystal in the semantic cache.
     */
    static store(text: string, crystal: Crystal): void {
        const lsh = SemanticHasher.computeSimHash(text);

        // Evict oldest if cache is full
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const oldest = Array.from(this.cache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
            if (oldest) {
                this.cache.delete(oldest[0]);
            }
        }

        this.cache.set(lsh, {
            lsh,
            crystal,
            timestamp: Date.now()
        });

        console.log(`[SemanticCache] 💾 Stored crystal ${crystal.context_id} (cache size: ${this.cache.size})`);
    }

    /**
     * Clear expired entries.
     */
    static cleanup(): void {
        const now = Date.now();
        let removed = 0;
        for (const [lsh, entry] of this.cache.entries()) {
            if (now - entry.timestamp >= this.TTL_MS) {
                this.cache.delete(lsh);
                removed++;
            }
        }
        if (removed > 0) {
            console.log(`[SemanticCache] 🧹 Cleaned up ${removed} expired entries`);
        }
    }

    /**
     * Get cache statistics.
     */
    static stats() {
        return {
            size: this.cache.size,
            max_size: this.MAX_CACHE_SIZE,
            ttl_hours: this.TTL_MS / (1000 * 60 * 60)
        };
    }
}

// Auto-cleanup every hour
setInterval(() => SemanticCache.cleanup(), 1000 * 60 * 60);
