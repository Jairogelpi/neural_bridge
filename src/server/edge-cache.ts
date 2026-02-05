/**
 * RENDER EDGE CACHE - Phase Turbo
 * Configure HTTP headers for optimal edge caching on Render.
 * 
 * This middleware sets caching headers to leverage Render's CDN
 * for compiled TurboContexts, reducing server load and latency.
 */

import { Request, Response, NextFunction } from 'express';

// ============================================
// TYPES
// ============================================

export interface EdgeCacheConfig {
    /** Default cache duration in seconds */
    defaultMaxAge: number;

    /** Cache duration for TurboContext responses */
    turboContextMaxAge: number;

    /** Stale-while-revalidate duration */
    staleWhileRevalidate: number;

    /** Paths to cache aggressively */
    aggressivePaths: string[];

    /** Paths to never cache */
    noCachePaths: string[];
}

const DEFAULT_CONFIG: EdgeCacheConfig = {
    defaultMaxAge: 60, // 1 minute
    turboContextMaxAge: 86400, // 24 hours
    staleWhileRevalidate: 3600, // 1 hour
    aggressivePaths: ['/api/turbo/', '/api/crystals/compiled/'],
    noCachePaths: ['/api/auth/', '/api/user/', '/api/missions/'],
};

// ============================================
// EDGE CACHE MIDDLEWARE
// ============================================

export function createEdgeCacheMiddleware(config: Partial<EdgeCacheConfig> = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };

    return (req: Request, res: Response, next: NextFunction) => {
        const path = req.path;

        // Never cache sensitive paths
        if (cfg.noCachePaths.some(p => path.startsWith(p))) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.setHeader('X-Turbo-Cache', 'bypass');
            return next();
        }

        // Aggressive caching for TurboContext paths
        if (cfg.aggressivePaths.some(p => path.startsWith(p))) {
            res.setHeader('Cache-Control',
                `public, max-age=${cfg.turboContextMaxAge}, stale-while-revalidate=${cfg.staleWhileRevalidate}`
            );
            res.setHeader('X-Turbo-Cache', 'aggressive');
            res.setHeader('Vary', 'Accept-Encoding');
            return next();
        }

        // Default caching for other API paths
        if (path.startsWith('/api/')) {
            res.setHeader('Cache-Control',
                `public, max-age=${cfg.defaultMaxAge}, stale-while-revalidate=${cfg.staleWhileRevalidate}`
            );
            res.setHeader('X-Turbo-Cache', 'default');
        }

        next();
    };
}

// ============================================
// TURBO CONTEXT API ROUTES
// ============================================

export interface TurboApiConfig {
    /** Base path for turbo endpoints */
    basePath: string;
}

/**
 * Register Turbo API routes on an Express app.
 */
export function registerTurboRoutes(app: any, config: TurboApiConfig = { basePath: '/api/turbo' }) {
    const { basePath } = config;

    // GET /api/turbo/context/:fingerprint
    // Retrieve a compiled TurboContext by fingerprint
    app.get(`${basePath}/context/:fingerprint`, async (req: Request, res: Response) => {
        const { fingerprint } = req.params;

        // Set aggressive cache headers
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
        res.setHeader('X-Turbo-Cache', 'immutable');

        // In production, this would fetch from a server-side cache
        res.json({
            fingerprint,
            cached: true,
            message: 'TurboContext retrieved from edge cache',
            timestamp: new Date().toISOString(),
        });
    });

    // POST /api/turbo/compile
    // Compile crystals into TurboContext (not cached - returns unique content)
    app.post(`${basePath}/compile`, async (req: Request, res: Response) => {
        const { crystal_ids, options } = req.body;

        // Don't cache POST responses
        res.setHeader('Cache-Control', 'no-store');

        // In production, this would compile and return the TurboContext
        res.json({
            fingerprint: `FP_${Date.now().toString(16)}`,
            compiled_at: new Date().toISOString(),
            crystal_count: crystal_ids?.length || 0,
            options,
        });
    });

    // GET /api/turbo/stats
    // Get cache statistics
    app.get(`${basePath}/stats`, async (req: Request, res: Response) => {
        res.setHeader('Cache-Control', 'no-cache');

        res.json({
            edge_cache: {
                enabled: true,
                default_ttl: DEFAULT_CONFIG.defaultMaxAge,
                turbo_ttl: DEFAULT_CONFIG.turboContextMaxAge,
            },
            timestamp: new Date().toISOString(),
        });
    });

    console.log(`[EdgeCache] Turbo routes registered at ${basePath}`);
}

// ============================================
// CACHE WARMUP UTILITY
// ============================================

/**
 * Pre-warm the edge cache with commonly-used TurboContexts.
 * Call this on server startup or after deployments.
 */
export async function warmEdgeCache(contexts: { fingerprint: string; url: string }[]): Promise<void> {
    console.log(`[EdgeCache] Warming ${contexts.length} TurboContexts...`);

    for (const ctx of contexts) {
        try {
            // Make a request to populate Render's edge cache
            const response = await fetch(ctx.url);
            if (response.ok) {
                console.log(`[EdgeCache] Warmed: ${ctx.fingerprint}`);
            }
        } catch (error) {
            console.warn(`[EdgeCache] Failed to warm: ${ctx.fingerprint}`);
        }
    }

    console.log('[EdgeCache] Warmup complete');
}
