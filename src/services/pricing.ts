// Real-Time Dynamic Pricing & Model Stats Service
// Fetches live data from OpenRouter API to ensure 0% hardcoded data

const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

export interface ModelPricing {
    id: string;
    name: string;
    context_length: number;
    prompt_usd: number;
    completion_usd: number;
    image_usd: number;
    request_usd: number;
}

export interface ModelStats {
    id: string;
    name: string;
    pricing: ModelPricing;
    top_provider: string;
    description: string;
}

// Global cache for live pricing
let pricingCache: Record<string, ModelPricing> = {};
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function fetchLivePricing(): Promise<Record<string, ModelPricing>> {
    if (Date.now() - lastFetch < CACHE_TTL && Object.keys(pricingCache).length > 0) {
        return pricingCache;
    }

    try {
        const response = await fetch(OPENROUTER_MODELS_URL);
        if (!response.ok) throw new Error('Failed to fetch OpenRouter models');

        const { data } = await response.json();
        const newCache: Record<string, ModelPricing> = {};

        data.forEach((model: any) => {
            newCache[model.id] = {
                id: model.id,
                name: model.name || model.id,
                context_length: model.context_length || 0,
                prompt_usd: parseFloat(model.pricing?.prompt || '0'),
                completion_usd: parseFloat(model.pricing?.completion || '0'),
                image_usd: parseFloat(model.pricing?.image || '0'),
                request_usd: parseFloat(model.pricing?.request || '0')
            };
        });

        pricingCache = newCache;
        lastFetch = Date.now();

        // Persist to local storage for extension use
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ 'nb_pricing_cache': pricingCache, 'nb_pricing_timestamp': lastFetch });
        }

        return pricingCache;
    } catch (err) {
        console.error('Error fetching live pricing:', err);
        // Fallback to stored cache if available
        return pricingCache;
    }
}

export function calculateRealCost(modelId: string, promptTokens: number, completionTokens: number): number {
    const model = pricingCache[modelId];
    if (!model) return 0;

    return (promptTokens * model.prompt_usd) + (completionTokens * model.completion_usd);
}

export async function getModelPricing(modelId: string): Promise<ModelPricing | null> {
    const pricing = await fetchLivePricing();
    return pricing[modelId] || null;
}

export const PricingService = {
    fetchLivePricing,
    calculateRealCost,
    getModelPricing
};
