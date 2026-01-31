import { SCPService } from './llm';

export interface ConsensusResult {
    consensus_score: number; // 0-1
    model_responses: Array<{ model: string; agreement: number; reasoning: string }>;
    final_decision: 'STABLE' | 'UNSTABLE';
}

/**
 * Multi-Model Consensus Engine
 * Ensures that critical claims are verified by different LLM architectures
 * to eliminate single-model bias and hallucinations.
 */
export class ConsensusEngine {
    private static CONSENSUS_MODELS = [
        'anthropic/claude-3.5-sonnet',
        'google/gemini-pro-1.5',
        'meta-llama/llama-3.3-70b-instruct:free'
    ];

    /**
     * Verify a claim across multiple models and return a consensus score.
     */
    static async verify(claim: string, context: string): Promise<ConsensusResult> {
        const results = await Promise.all(
            this.CONSENSUS_MODELS.map(async (model) => {
                const systemPrompt = `You are a strict Consensus Arbiter. 
Verify the claim against the provided context. 
Return JSON: {"agreement": 0.0-1.0, "reasoning": "..."}`;
                
                const prompt = `Context: ${context}\nClaim to verify: ${claim}`;
                
                try {
                    const response = await SCPService.resilientCallLLM(prompt, model, systemPrompt);
                    const parsed = JSON.parse(response.content.replace(/```json|```/g, '').trim());
                    return { model, agreement: parsed.agreement, reasoning: parsed.reasoning };
                } catch (e) {
                    return { model, agreement: 0, reasoning: 'Model failed or returned invalid JSON' };
                }
            })
        );

        const totalAgreement = results.reduce((acc, r) => acc + r.agreement, 0);
        const averageAgreement = totalAgreement / results.length;

        return {
            consensus_score: averageAgreement,
            model_responses: results,
            final_decision: averageAgreement >= 0.8 ? 'STABLE' : 'UNSTABLE'
        };
    }
}
