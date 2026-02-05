/**
 * CRYSTAL CACHE - Phase Turbo
 * Client-side IndexedDB cache for instant crystal access.
 * 
 * This provides:
 * - Sub-1ms access to cached TurboContexts
 * - LRU eviction when cache exceeds limits
 * - Full offline capability
 * - Zero server roundtrips for cached hits
 */

import { TurboContext } from '../services/TurboCompiler';

// ============================================
// TYPES
// ============================================

export interface CacheEntry {
    key: string;
    turboContext: TurboContext;
    accessCount: number;
    lastAccessed: number;
    createdAt: number;
}

export interface CacheStats {
    totalEntries: number;
    totalBytes: number;
    hitCount: number;
    missCount: number;
    hitRate: number;
}

export interface CacheConfig {
    dbName: string;
    storeName: string;
    maxEntries: number;
    maxBytes: number;
    ttlMs: number;
}

const DEFAULT_CONFIG: CacheConfig = {
    dbName: 'neural_bridge_turbo',
    storeName: 'crystal_cache',
    maxEntries: 1000,
    maxBytes: 100 * 1024 * 1024, // 100MB
    ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ============================================
// CRYSTAL CACHE
// ============================================

export class CrystalCache {
    private config: CacheConfig;
    private db: IDBDatabase | null = null;
    private stats: CacheStats = {
        totalEntries: 0,
        totalBytes: 0,
        hitCount: 0,
        missCount: 0,
        hitRate: 0,
    };

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Initialize the IndexedDB cache.
     */
    async init(): Promise<void> {
        if (typeof indexedDB === 'undefined') {
            console.warn('[CrystalCache] IndexedDB not available (server-side or unsupported browser)');
            return;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, 1);

            request.onerror = () => {
                console.error('[CrystalCache] Failed to open database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('[CrystalCache] Database initialized');
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                if (!db.objectStoreNames.contains(this.config.storeName)) {
                    const store = db.createObjectStore(this.config.storeName, { keyPath: 'key' });
                    store.createIndex('lastAccessed', 'lastAccessed', { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                    console.log('[CrystalCache] Object store created');
                }
            };
        });
    }

    /**
     * Get a TurboContext from cache.
     * Returns null if not found or expired.
     */
    async get(key: string): Promise<TurboContext | null> {
        if (!this.db) {
            this.stats.missCount++;
            return null;
        }

        const startTime = performance.now();

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                const entry = request.result as CacheEntry | undefined;

                if (!entry) {
                    this.stats.missCount++;
                    this.updateHitRate();
                    resolve(null);
                    return;
                }

                // Check TTL
                if (Date.now() - entry.createdAt > this.config.ttlMs) {
                    store.delete(key);
                    this.stats.missCount++;
                    this.updateHitRate();
                    resolve(null);
                    return;
                }

                // Update access stats
                entry.accessCount++;
                entry.lastAccessed = Date.now();
                store.put(entry);

                this.stats.hitCount++;
                this.updateHitRate();

                const accessTime = performance.now() - startTime;
                console.log(`[CrystalCache] HIT: ${key} in ${accessTime.toFixed(2)}ms`);

                resolve(entry.turboContext);
            };

            request.onerror = () => {
                this.stats.missCount++;
                this.updateHitRate();
                resolve(null);
            };
        });
    }

    /**
     * Store a TurboContext in cache.
     */
    async set(key: string, turboContext: TurboContext): Promise<void> {
        if (!this.db) return;

        // Check if we need to evict
        await this.evictIfNeeded(turboContext.byte_size);

        const entry: CacheEntry = {
            key,
            turboContext,
            accessCount: 0,
            lastAccessed: Date.now(),
            createdAt: Date.now(),
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.put(entry);

            request.onsuccess = () => {
                this.stats.totalEntries++;
                this.stats.totalBytes += turboContext.byte_size;
                console.log(`[CrystalCache] SET: ${key} (${turboContext.byte_size} bytes)`);
                resolve();
            };

            request.onerror = () => {
                console.error('[CrystalCache] Failed to set:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Delete a TurboContext from cache.
     */
    async delete(key: string): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`[CrystalCache] DELETE: ${key}`);
                resolve();
            };

            request.onerror = () => resolve();
        });
    }

    /**
     * Clear all cached entries.
     */
    async clear(): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.clear();

            request.onsuccess = () => {
                this.stats = {
                    totalEntries: 0,
                    totalBytes: 0,
                    hitCount: 0,
                    missCount: 0,
                    hitRate: 0,
                };
                console.log('[CrystalCache] Cache cleared');
                resolve();
            };

            request.onerror = () => resolve();
        });
    }

    /**
     * Evict least-recently-used entries if needed.
     */
    private async evictIfNeeded(incomingBytes: number): Promise<void> {
        if (!this.db) return;

        // Check if eviction is needed
        if (this.stats.totalBytes + incomingBytes < this.config.maxBytes &&
            this.stats.totalEntries < this.config.maxEntries) {
            return;
        }

        console.log('[CrystalCache] Eviction triggered...');

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readwrite');
            const store = transaction.objectStore(this.config.storeName);
            const index = store.index('lastAccessed');

            // Get oldest entries first
            const request = index.openCursor();
            let evictedCount = 0;
            let evictedBytes = 0;
            const targetBytes = this.config.maxBytes * 0.8; // Evict to 80% capacity

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;

                if (!cursor || (this.stats.totalBytes - evictedBytes + incomingBytes < targetBytes)) {
                    this.stats.totalBytes -= evictedBytes;
                    this.stats.totalEntries -= evictedCount;
                    console.log(`[CrystalCache] Evicted ${evictedCount} entries (${evictedBytes} bytes)`);
                    resolve();
                    return;
                }

                const entry = cursor.value as CacheEntry;
                evictedBytes += entry.turboContext.byte_size;
                evictedCount++;
                cursor.delete();
                cursor.continue();
            };

            request.onerror = () => resolve();
        });
    }

    /**
     * Update hit rate statistic.
     */
    private updateHitRate(): void {
        const total = this.stats.hitCount + this.stats.missCount;
        this.stats.hitRate = total > 0 ? this.stats.hitCount / total : 0;
    }

    /**
     * Get cache statistics.
     */
    getStats(): CacheStats {
        return { ...this.stats };
    }

    /**
     * Check if a key exists in cache (without updating access stats).
     */
    async has(key: string): Promise<boolean> {
        if (!this.db) return false;

        return new Promise((resolve) => {
            const transaction = this.db!.transaction(this.config.storeName, 'readonly');
            const store = transaction.objectStore(this.config.storeName);
            const request = store.count(IDBKeyRange.only(key));

            request.onsuccess = () => resolve(request.result > 0);
            request.onerror = () => resolve(false);
        });
    }
}

// Singleton export
export const crystalCache = new CrystalCache();
