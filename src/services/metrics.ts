// Real Metrics Tracking - Production Analytics
// Tracks all operations with real numbers

export interface TransferMetrics {
    id: string;
    timestamp: string;
    source_model: string;
    target_model: string;

    // Crystal metrics
    crystal_generation: {
        tokens_used: number;
        cost_usd: number;
        latency_ms: number;
        entities_extracted: number;
        invariants_generated: number;
        compression_ratio: number;
        quality_score: number;
    };

    // Transfer metrics
    transfer: {
        success: boolean;
        score: number;
        confidence_interval: [number, number];
        invariants_passed: number;
        invariants_total: number;
        ladder_level: number;
        attempts: number;
    };

    // Verification metrics
    verification: {
        tokens_used: number;
        cost_usd: number;
        latency_ms: number;
    };

    // Totals
    total_tokens: number;
    total_cost_usd: number;
    total_latency_ms: number;
}

export interface AggregateMetrics {
    period: 'hour' | 'day' | 'week' | 'month';

    // Volume
    total_transfers: number;
    successful_transfers: number;
    failed_transfers: number;
    success_rate: number;

    // Cost
    total_cost_usd: number;
    avg_cost_per_transfer: number;
    cost_by_model: Record<string, number>;

    // Performance
    avg_score: number;
    avg_latency_ms: number;
    avg_invariants_passed: number;

    // Tokens
    total_tokens: number;
    avg_tokens_per_transfer: number;

    // Model usage
    source_model_distribution: Record<string, number>;
    target_model_distribution: Record<string, number>;
}

// In-memory store (production would use database)
const metricsStore: TransferMetrics[] = [];

export function recordTransfer(metrics: TransferMetrics): void {
    metricsStore.push(metrics);

    // Also save to localStorage for persistence
    try {
        const stored = localStorage.getItem('scp_metrics') || '[]';
        const all = JSON.parse(stored);
        all.push(metrics);
        // Keep last 1000
        if (all.length > 1000) {
            all.splice(0, all.length - 1000);
        }
        localStorage.setItem('scp_metrics', JSON.stringify(all));
    } catch (e) {
        console.error('Failed to persist metrics:', e);
    }
}

export function getMetrics(): TransferMetrics[] {
    try {
        const stored = localStorage.getItem('scp_metrics') || '[]';
        return JSON.parse(stored);
    } catch (e) {
        return metricsStore;
    }
}

export function getAggregateMetrics(period: 'hour' | 'day' | 'week' | 'month' = 'day'): AggregateMetrics {
    const metrics = getMetrics();

    // Filter by period
    const now = Date.now();
    const periodMs = {
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000
    };

    const filtered = metrics.filter(m =>
        new Date(m.timestamp).getTime() > now - periodMs[period]
    );

    if (filtered.length === 0) {
        return {
            period,
            total_transfers: 0,
            successful_transfers: 0,
            failed_transfers: 0,
            success_rate: 0,
            total_cost_usd: 0,
            avg_cost_per_transfer: 0,
            cost_by_model: {},
            avg_score: 0,
            avg_latency_ms: 0,
            avg_invariants_passed: 0,
            total_tokens: 0,
            avg_tokens_per_transfer: 0,
            source_model_distribution: {},
            target_model_distribution: {}
        };
    }

    const successful = filtered.filter(m => m.transfer.success);
    const failed = filtered.filter(m => !m.transfer.success);

    const costByModel: Record<string, number> = {};
    const sourceModelDist: Record<string, number> = {};
    const targetModelDist: Record<string, number> = {};

    filtered.forEach(m => {
        costByModel[m.target_model] = (costByModel[m.target_model] || 0) + m.total_cost_usd;
        sourceModelDist[m.source_model] = (sourceModelDist[m.source_model] || 0) + 1;
        targetModelDist[m.target_model] = (targetModelDist[m.target_model] || 0) + 1;
    });

    return {
        period,
        total_transfers: filtered.length,
        successful_transfers: successful.length,
        failed_transfers: failed.length,
        success_rate: successful.length / filtered.length,
        total_cost_usd: filtered.reduce((sum, m) => sum + m.total_cost_usd, 0),
        avg_cost_per_transfer: filtered.reduce((sum, m) => sum + m.total_cost_usd, 0) / filtered.length,
        cost_by_model: costByModel,
        avg_score: filtered.reduce((sum, m) => sum + m.transfer.score, 0) / filtered.length,
        avg_latency_ms: filtered.reduce((sum, m) => sum + m.total_latency_ms, 0) / filtered.length,
        avg_invariants_passed: filtered.reduce((sum, m) => sum + m.transfer.invariants_passed, 0) / filtered.length,
        total_tokens: filtered.reduce((sum, m) => sum + m.total_tokens, 0),
        avg_tokens_per_transfer: filtered.reduce((sum, m) => sum + m.total_tokens, 0) / filtered.length,
        source_model_distribution: sourceModelDist,
        target_model_distribution: targetModelDist
    };
}

export function formatCurrency(usd: number): string {
    if (usd < 0.01) return `$${(usd * 100).toFixed(2)}¢`;
    return `$${usd.toFixed(4)}`;
}

export function formatNumber(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toFixed(0);
}

export const MetricsService = {
    recordTransfer,
    getMetrics,
    getAggregateMetrics,
    formatCurrency,
    formatNumber
};
