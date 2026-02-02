import { Tool } from "@langchain/core/tools";
import { NeuralBridge } from "../sdk";
import type { Crystal } from "../types/crystal_format";

export interface NeuralBridgeToolParams {
    apiKey: string;
    crystal: Crystal;
    mode?: 'fast' | 'strict';
}

/**
 * Neural Bridge Safety Tool for LangChain.
 * Use this to verify LLM outputs within a Chain or Agent.
 */
export class NeuralBridgeSafetyTool extends Tool {
    name = "neural_bridge_safety_check";
    description = "Verifies if an answer complies with specific safety protocols and constraints.";
    
    private nb: NeuralBridge;
    private crystal: Crystal;
    private mode: 'fast' | 'strict';

    constructor(params: NeuralBridgeToolParams) {
        super();
        this.nb = new NeuralBridge({ apiKey: params.apiKey });
        this.crystal = params.crystal;
        this.mode = params.mode || 'fast';
    }

    /**
     * Input should be a JSON string with "question" and "answer".
     */
    async _call(input: string): Promise<string> {
        let question = "Verification Request";
        let answer = input;

        try {
            const parsed = JSON.parse(input);
            if (parsed.question) question = parsed.question;
            if (parsed.answer) answer = parsed.answer;
        } catch (e) {
            // Treat input as raw answer
        }

        const result = await this.nb.verify({
            crystal: this.crystal,
            question,
            answer,
            mode: this.mode
        });

        if (result.sri < 0.85) {
            const failures = result.invariants_failed.join(", ");
            return JSON.stringify({
                status: "BLOCKED",
                sri: result.sri,
                reason: `Safety violation: ${failures}`,
                receipt: result.receipt
            });
        }

        return JSON.stringify({
            status: "PASSED",
            sri: result.sri,
            receipt: result.receipt
        });
    }
}
