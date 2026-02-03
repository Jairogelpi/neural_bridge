export const API_BASE_URL: string =
    (globalThis as unknown as Record<string, string>).NEURAL_BRIDGE_API_BASE_URL ||
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE ||
    "https://neural-bridge-backend.onrender.com"; // Production Render Backend

export const API_TIMEOUT_MS = 20_000;

/**
 * PHASE UPSILON: BUDGET & POTENCY MODES 💎
 */
export type BudgetMode = 'sovereign' | 'balanced' | 'performance';

export const CONFIG = {
    budget_mode: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_BUDGET_MODE as BudgetMode || 'balanced',

    // FREE TIER LIMITS (Daily)
    free_tier_limits: {
        max_premium_calls: 5,        // Escalation cap
        max_free_tokens: 100_000,   // OpenRouter :free limit
        force_local_if_offline: true
    },

    // MODEL PRIORITY (Potency Escalation)
    model_stack: {
        local: 'gemma-2b-nb-q4',      // WebLLM / WebGPU (Local Sovereign)
        free: 'nvidia/nemotron-3-nano-30b-a3b:free', // Zero-cost fallback
        flash: 'google/gemini-2.0-flash-exp:free',    // High speed, high intel
        premium: 'anthropic/claude-3.5-sonnet'        // Platinum Escalation
    }
};
