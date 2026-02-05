/**
 * PERFORMANCE TRACKER - Phase Omega Prime
 * Real-time measurement of query performance.
 * 
 * Provides REAL metrics (not mock):
 * - Actual latency in milliseconds
 * - Tokens saved vs sending raw text
 * - USD cost saved based on model pricing
 * - Cache hit/miss statistics
 */

// ============================================
// TYPES
// ============================================

export interface QueryMetrics {
    /** Unique query ID */
    query_id: string;

    /** Actual measured latency in ms */
    latency_ms: number;

    /** Was this served from cache? */
    cache_hit: boolean;

    /** Source of the response */
    source: 'local_cache' | 'edge_cache' | 'llm' | 'precomputed';

    /** Tokens in the original context */
    original_tokens: number;

    /** Tokens actually sent to LLM (0 if cached) */
    tokens_sent: number;

    /** Tokens saved by using crystals */
    tokens_saved: number;

    /** Estimated cost saved in USD */
    cost_saved_usd: number;

    /** Timestamp */
    timestamp: string;
}

export interface AggregateMetrics {
    /** Total queries tracked */
    total_queries: number;

    /** Cache hit rate (0-1) */
    cache_hit_rate: number;

    /** Average latency in ms */
    avg_latency_ms: number;

    /** P50 latency */
    p50_latency_ms: number;

    /** P95 latency */
    p95_latency_ms: number;

    /** P99 latency */
    p99_latency_ms: number;

    /** Total tokens saved */
    total_tokens_saved: number;

    /** Total USD saved */
    total_cost_saved_usd: number;

    /** Metrics since */
    since: string;
}

export interface ModelPricing {
    /** Cost per 1K input tokens in USD */
    input_per_1k: number;

    /** Cost per 1K output tokens in USD */
    output_per_1k: number;
}

// Model pricing (as of 2024)
const MODEL_PRICING: Record<string, ModelPricing> = {
    'gpt-4o': { input_per_1k: 0.005, output_per_1k: 0.015 },
    'gpt-4o-mini': { input_per_1k: 0.00015, output_per_1k: 0.0006 },
    'gpt-4-turbo': { input_per_1k: 0.01, output_per_1k: 0.03 },
    'claude-3-opus': { input_per_1k: 0.015, output_per_1k: 0.075 },
    'claude-3-sonnet': { input_per_1k: 0.003, output_per_1k: 0.015 },
    'claude-3-haiku': { input_per_1k: 0.00025, output_per_1k: 0.00125 },
    'gemini-1.5-pro': { input_per_1k: 0.00125, output_per_1k: 0.005 },
    'gemini-1.5-flash': { input_per_1k: 0.000075, output_per_1k: 0.0003 },
};

// ============================================
// PERFORMANCE TRACKER
// ============================================

export class PerformanceTracker {
    private metrics: QueryMetrics[] = [];
    private maxMetrics: number = 10000;
    private defaultModel: string = 'gpt-4o-mini';

    /**
     * Start tracking a query. Returns a function to call when complete.
     */
    startQuery(queryId: string): () => { elapsed_ms: number } {
        const startTime = performance.now();

        return () => {
            const elapsed_ms = performance.now() - startTime;
            return { elapsed_ms };
        };
    }

    /**
     * Record a completed query with all metrics.
     */
    recordQuery(params: {
        query_id: string;
        latency_ms: number;
        cache_hit: boolean;
        source: QueryMetrics['source'];
        original_tokens: number;
        tokens_sent: number;
        model?: string;
    }): QueryMetrics {
        const model = params.model || this.defaultModel;
        const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o-mini'];

        const tokens_saved = params.original_tokens - params.tokens_sent;
        const cost_saved_usd = (tokens_saved / 1000) * pricing.input_per_1k;

        const metrics: QueryMetrics = {
            query_id: params.query_id,
            latency_ms: Math.round(params.latency_ms * 100) / 100,
            cache_hit: params.cache_hit,
            source: params.source,
            original_tokens: params.original_tokens,
            tokens_sent: params.tokens_sent,
            tokens_saved,
            cost_saved_usd: Math.round(cost_saved_usd * 1000000) / 1000000, // 6 decimal places
            timestamp: new Date().toISOString(),
        };

        this.metrics.push(metrics);

        // Trim old metrics if exceeding limit
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        console.log(`[PerformanceTracker] Query ${params.query_id}: ${metrics.latency_ms}ms | Saved ${tokens_saved} tokens ($${cost_saved_usd.toFixed(6)})`);

        return metrics;
    }

    /**
     * Get aggregate metrics for all tracked queries.
     */
    getAggregateMetrics(): AggregateMetrics {
        if (this.metrics.length === 0) {
            return {
                total_queries: 0,
                cache_hit_rate: 0,
                avg_latency_ms: 0,
                p50_latency_ms: 0,
                p95_latency_ms: 0,
                p99_latency_ms: 0,
                total_tokens_saved: 0,
                total_cost_saved_usd: 0,
                since: new Date().toISOString(),
            };
        }

        const latencies = this.metrics.map(m => m.latency_ms).sort((a, b) => a - b);
        const totalQueries = this.metrics.length;
        const cacheHits = this.metrics.filter(m => m.cache_hit).length;

        return {
            total_queries: totalQueries,
            cache_hit_rate: cacheHits / totalQueries,
            avg_latency_ms: latencies.reduce((a, b) => a + b, 0) / totalQueries,
            p50_latency_ms: this.percentile(latencies, 50),
            p95_latency_ms: this.percentile(latencies, 95),
            p99_latency_ms: this.percentile(latencies, 99),
            total_tokens_saved: this.metrics.reduce((sum, m) => sum + m.tokens_saved, 0),
            total_cost_saved_usd: this.metrics.reduce((sum, m) => sum + m.cost_saved_usd, 0),
            since: this.metrics[0]?.timestamp || new Date().toISOString(),
        };
    }

    /**
     * Get the last N query metrics.
     */
    getRecentMetrics(count: number = 10): QueryMetrics[] {
        return this.metrics.slice(-count);
    }

    /**
     * Compare our performance against RAG baseline.
     */
    getRAGComparison(): {
        neural_bridge: { avg_latency_ms: number; cache_hit_rate: number };
        rag_estimated: { avg_latency_ms: number; cache_hit_rate: number };
        speedup_factor: number;
    } {
        const aggregate = this.getAggregateMetrics();

        // RAG baseline estimates (based on typical performance)
        const ragAvgLatency = 450; // ms for vector search + LLM
        const ragCacheRate = 0; // RAG typically doesn't cache responses

        return {
            neural_bridge: {
                avg_latency_ms: aggregate.avg_latency_ms,
                cache_hit_rate: aggregate.cache_hit_rate,
            },
            rag_estimated: {
                avg_latency_ms: ragAvgLatency,
                cache_hit_rate: ragCacheRate,
            },
            speedup_factor: aggregate.avg_latency_ms > 0
                ? ragAvgLatency / aggregate.avg_latency_ms
                : 100,
        };
    }

    /**
     * Calculate percentile from sorted array.
     */
    private percentile(sorted: number[], p: number): number {
        if (sorted.length === 0) return 0;
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
    }

    /**
     * Clear all metrics.
     */
    reset(): void {
        this.metrics = [];
        console.log('[PerformanceTracker] Metrics reset');
    }

    /**
     * Export metrics as JSON.
     */
    exportMetrics(): string {
        return JSON.stringify({
            aggregate: this.getAggregateMetrics(),
            recent: this.getRecentMetrics(100),
            rag_comparison: this.getRAGComparison(),
        }, null, 2);
    }
}

// Singleton export
export const performanceTracker = new PerformanceTracker();
