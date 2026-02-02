import { SCPService } from './llm';

export interface ConsensusResult {
    final_decision: 'CONSENSUS_REACHED' | 'DISSENT' | 'UNCERTAIN';
    consensus_score: number; // 0.0 to 1.0 (Percentage of agreement)
    participants: {
        model: string;
        vote: 'AGREE' | 'DISAGREE';
        reason: string;
    }[];
    jury_case_id?: string | undefined; // Link to human jury if escalated
}

/**
 * CONSENSUS ENGINE (Universal Truth)
 * Instead of trusting one AI, we form a "Jury" of diverse models.
 * If they all agree, the reality is highly probable.
 */
export class ConsensusEngine {

    private static JURY_MODELS = [
        'anthropic/claude-3.5-sonnet',  // The Logician
        'google/gemini-pro-1.5',        // The Creative
        'meta-llama/llama-3-70b-instruct' // The Open Standard
    ];

    static async verify(fact: string, context: string): Promise<ConsensusResult> {
        console.log(`[Consensus] Convening Jury for fact: "${fact.substring(0, 50)}..."`);

        const tasks = this.JURY_MODELS.map(model => this.getVote(model, fact, context));

        // Run parallel votes
        const votes = await Promise.all(tasks);

        const agreeCount = votes.filter(v => v.vote === 'AGREE').length;
        const score = agreeCount / votes.length;

        let decision: ConsensusResult['final_decision'] = 'UNCERTAIN';
        if (score > 0.66) decision = 'CONSENSUS_REACHED';
        if (score < 0.33) decision = 'DISSENT';

        let juryCaseId: string | undefined;

        // AUTOMATIC ESCALATION: If uncertain (e.g. 50/50 split), call humans
        if (decision === 'UNCERTAIN') {
            const { JuryService } = await import('./jury_service');
            const { sovereignSynthesize } = await import('./llm');

            // Synthesize a REAL sovereign crystal for the Jury to review
            const { crystal } = await sovereignSynthesize(context, 'consensus_fallback');
            juryCaseId = await JuryService.escalate(crystal, score, "Uncertain AI Consensus (50/50 split detected).") || undefined;
        }

        return {
            final_decision: decision,
            consensus_score: score,
            participants: votes,
            jury_case_id: juryCaseId
        };
    }

    private static async getVote(model: string, fact: string, context: string): Promise<{ model: string; vote: 'AGREE' | 'DISAGREE'; reason: string }> {
        const prompt = `
        You are a FACT JUROR.
        
        CONTEXT:
        "${context.substring(0, 1000)}"

        CLAIM TO VERIFY:
        "${fact}"
        
        Do you AGREE that this claim is supported by the context and logical reality?
        Return JSON: {"vote": "AGREE" | "DISAGREE", "reason": "brief explanation"}
        `;

        try {
            // We use 'callLLM' asking for specific models. 
            // Note: In a real env, we'd fallback if a specific model isn't active, but here we try.
            const res = await SCPService.resilientCallLLM(prompt, model, 'You are a strict logical juror.');

            // Heuristic Parsing if JSON fails
            let parsed;
            try {
                parsed = JSON.parse(res.content);
            } catch {
                const text = res.content.toUpperCase();
                parsed = {
                    vote: text.includes('AGREE') && !text.includes('DISAGREE') ? 'AGREE' : 'DISAGREE',
                    reason: "Parsed from text"
                };
            }
            return { model, vote: parsed.vote, reason: parsed.reason };
        } catch (e) {
            console.warn(`Jury member ${model} failed to vote.`);
            return { model, vote: 'DISAGREE', reason: 'Jury member failed to appear' };
        }
    }
}
