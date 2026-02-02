import { SCPService } from './llm';

export type ModelTier = 'CHEAP' | 'BALANCED' | 'POTENT' | 'OMEGA';

export interface RoutingDecision {
    tier: ModelTier;
    selected_model: string;
    risk_score: number;
    complexity_score: number;
    reasoning: string;
}

/**
 * ECONOMIC STEERING ENGINE (Quantum Routing) 💰⚖️
 * 
 * Goal: Maximize ROI by dynamically selecting models based on:
 * 1. Domain Risk (Medicine/Law = OMEGA)
 * 2. Task Complexity (Brainstorming = CHEAP)
 * 3. Semantic Uncertainty (High Dissent = POTENT)
 */
export class EconomicRouter {

    private static MODEL_TIERS: Record<ModelTier, string[]> = {
        'CHEAP': [
            'google/gemini-2.0-flash-exp:free',
            'meta-llama/llama-3.1-8b-instruct:free'
        ],
        'BALANCED': [
            'openai/gpt-4o-mini',
            'anthropic/claude-3-haiku'
        ],
        'POTENT': [
            'google/gemini-pro-1.5',
            'openai/gpt-4o'
        ],
        'OMEGA': [
            'anthropic/claude-3.5-sonnet',
            'google/gemini-pro-1.5' // Use Pro for deep reasoning fallback
        ]
    };

    /**
     * Determines the optimal model for a given context and task.
     */
    static async route(params: {
        text: string;
        domain: string;
        task: 'compile' | 'verify' | 'repair' | 'dream';
        isCritical?: boolean;
    }): Promise<RoutingDecision> {
        const { text, domain, task, isCritical = false } = params;

        // 1. ANALYZE RISK & COMPLEXITY
        const analysisPrompt = `
        ACT AS A REASONING ARCHITECT.
        Analyze the following request for RISK and COMPLEXITY.
        
        DOMAIN: "${domain}"
        TASK: "${task}"
        CRITICAL_FLAG: ${isCritical}
        TEXT_SAMPLE: "${text.substring(0, 500)}..."
        
        Score:
        - RISK (0.0 - 1.0): Likelihood of severe consequences if the AI fails.
        - COMPLEXITY (0.0 - 1.0): Depth of logical reasoning required.
        
        Return JSON:
        {
            "risk": 0.0,
            "complexity": 0.0,
            "reasoning": "brief explanation"
        }
        `;

        const res = await SCPService.resilientCallLLM(analysisPrompt, 'google/gemini-2.0-flash-exp:free', 'You are a Risk Analyst.');
        let scores = { risk: 0.5, complexity: 0.5, reasoning: "Default due to parse fail" };
        try {
            scores = JSON.parse(res.content);
        } catch { /* use defaults */ }

        // 2. TIER SELECTION LOGIC (Quantum Arbitrage)
        let tier: ModelTier = 'BALANCED';

        const finalRisk = Math.max(scores.risk, isCritical ? 1.0 : 0);

        if (finalRisk > 0.8 || domain === 'medicine' || domain === 'law') {
            tier = 'OMEGA'; // Safety first for critical domains
        } else if (scores.complexity > 0.8 && task === 'compile') {
            tier = 'POTENT'; // High reasoning for complex crystals
        } else if (scores.complexity < 0.3 && task === 'verify') {
            tier = 'CHEAP'; // Fast check for simple tasks
        } else if (finalRisk < 0.2) {
            tier = 'CHEAP'; // Low risk = maximum economy
        }

        const selectedModel = this.MODEL_TIERS[tier][0]!;

        console.log(`[EconomicRouter] 💰 Routing decision: ${tier} (${selectedModel}) | Reason: ${scores.reasoning}`);

        return {
            tier,
            selected_model: selectedModel,
            risk_score: finalRisk,
            complexity_score: scores.complexity,
            reasoning: scores.reasoning
        };
    }
}
