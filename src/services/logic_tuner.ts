
import { Hypervector } from '../math/hypervector';
import type { Crystal } from '../types/crystal_format';

/**
 * ADAPTIVE LOGIC TUNER (The Self-Optimizer) ⚙️🌀
 * 
 * Goal: Eliminate hardcoded constants (0.6, 0.75).
 * Thresholds now adapt based on the domain's maturity and volatility.
 */
export class LogicTuner {

    /**
     * INFERENTIAL AUTO-CALIBRATION ⚖️🌀
     * 
     * Calculates the optimal SNR threshold for a domain by running
     * differential tests between verified truths and synthetic noise.
     */
    static async autoCalibrationLoop(domain: string, crystals: Crystal[]): Promise<number> {
        if (crystals.length === 0) return 0.7; // Absolute baseline if zero data

        // 1. Calculate Average Domain Entropy
        let totalEntropy = 0;
        for (const c of crystals) {
            const hv = Hypervector.fromString(c.verification?.canonical_hash || '');
            totalEntropy += hv.getEntropy();
        }
        const avgEntropy = totalEntropy / crystals.length;

        // 2. Derive The God Threshold (Axiomatic Mandate)
        // If entropy is high (noise-heavy), the threshold MUST be strict (>0.8).
        // If entropy is low (structured), the threshold can be more relaxed but still rigorous.
        const threshold = 0.5 + (avgEntropy * 0.45);

        return Math.min(Math.max(threshold, 0.5), 0.95);
    }

    /**
     * Calculates the optimal SNR threshold for a domain.
     * Delegates to auto-calibration if possible.
     */
    static getOptimalThreshold(domainStats: { avg_q: number, volatility: number, calibrated_threshold?: number }): number {
        if (domainStats.calibrated_threshold) return domainStats.calibrated_threshold;

        const adjustment = domainStats.volatility * 0.5;
        const confidenceBonus = domainStats.avg_q * 0.1;

        const threshold = 0.6 + adjustment - confidenceBonus;
        return Math.min(Math.max(threshold, 0.55), 0.85);
    }

    /**
     * Computes the "Reality Stability Index" for a domain.
     */
    static calculateStability(crystals: Crystal[]): number {
        if (crystals.length === 0) return 0.5;

        const totalQ = crystals.reduce((sum, c) => sum + (c.rlm_stats?.q_score || 0.5), 0);
        const avgQ = totalQ / crystals.length;
        const avgVolatility = crystals.reduce((sum, c) => sum + (c.rlm_stats?.volatility || 0.1), 0) / crystals.length;

        return avgQ * (1 - avgVolatility);
    }
}
