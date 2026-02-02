
import { SCPService } from './llm';

/**
 * UNIVERSAL EXPERT REGISTRY 🏛️🧠
 * 
 * Goal: No more hardcoded JUDGES.
 * This service finds the most capable models for any given domain 
 * in real-time, optimizing for Intelligence-per-Token.
 */
export class ExpertRegistry {

    private static capabilityCache: Map<string, string[]> = new Map();

    /**
     * Finds the best judges for a specific domain.
     * Uses meta-reasoning to rank available models.
     */
    static async findBestJudges(domain: string, limit: number = 3): Promise<string[]> {
        if (this.capabilityCache.has(domain)) {
            return this.capabilityCache.get(domain)!;
        }

        console.log(`[ExpertRegistry] 🔍 Discovering elite models for domain: [${domain}]...`);

        // Ask the Meta-Router which models are strongest for this specific domain
        const routerPrompt = `
        ACT AS AN AI CAPABILITY ARCHITECT.
        Identify the top 3 LLMs that have the HIGHEST ZERO-SHOT REASONING accuracy for the domain: "${domain}".
        Consider models like: claude-3.5-sonnet, gpt-4o, o1, gemini-1.5-pro, deepseek-v3, nemotron.
        
        Return ONLY a JSON array of OpenRouter model strings.
        `;

        try {
            const res = await SCPService.resilientCallLLM(routerPrompt, 'google/gemini-2.0-flash-exp:free', 'Capability Auditor');
            const models = JSON.parse(res.content.match(/\[[\s\S]*\]/)?.[0] || '[]');

            if (models.length > 0) {
                this.capabilityCache.set(domain, models.slice(0, limit));
                return models.slice(0, limit);
            }
        } catch (e) {
            console.warn(`[ExpertRegistry] Meta-discovery failed. Falling back to robust defaults.`);
        }

        // Robust Defaults if discovery fails
        return [
            'anthropic/claude-3.5-sonnet',
            'openai/gpt-4o',
            'google/gemini-pro-1.5'
        ];
    }

    /**
     * Clears cache for dynamic updates.
     */
    static flush() {
        this.capabilityCache.clear();
    }
}
