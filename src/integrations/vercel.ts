// @ts-ignore - Vercel AI SDK types (optional peer dependency)
import { CoreMessage, generateText, streamText } from "ai";
import { NeuralBridge } from "../sdk";
import { Crystal } from "../types/crystal_format";

export interface NeuralBridgeVercelParams {
    apiKey: string;
    crystal: Crystal;
    failOnBlock?: boolean; // If true, throws error. If false, returns blocked response.
}

/**
 * Neural Bridge Middleware for Vercel AI SDK.
 * Wraps the generateText function to add verification.
 */
export async function generateTextWithBridge(
    params: Parameters<typeof generateText>[0] & { bridge: NeuralBridgeVercelParams }
) {
    const { bridge, ...aiParams } = params;
    
    // 1. Generate Content
    const result = await generateText(aiParams);
    
    // 2. Verify
    const nb = new NeuralBridge({ apiKey: bridge.apiKey });
    const lastUserMessage = (aiParams.messages as CoreMessage[])
        .filter(m => m.role === 'user')
        .pop()?.content?.toString() || "Unknown Context";

    const check = await nb.verify({
        crystal: bridge.crystal,
        question: lastUserMessage,
        answer: result.text
    });

    // 3. Enforce
    if (check.sri < 0.85) {
        if (bridge.failOnBlock !== false) {
            throw new Error(`Neural Bridge Blocked: ${check.issues.join(", ")}`);
        }
        // Return blocked state in response object if supported, 
        // or modify text to indicate block.
        return {
            ...result,
            text: "[BLOCKED BY NEURAL BRIDGE] " + check.issues[0],
            finishReason: 'content-filter',
            toolResults: result.toolResults, // Preserve other data
            steps: result.steps,
            response: result.response,
            usage: result.usage,
            warnings: [...(result.warnings || []), { type: 'safety', message: 'Neural Bridge verification failed' }]
        };
    }

    return result;
}

/**
 * Stream wrapper - Verifies AFTER stream completes (Async Verification).
 * Note: Real-time interruption requires chunk-based invariant checking which is advanced.
 * This implementation verifies the FULL response at the end for auditing.
 */
export async function streamTextWithAudit(
    params: Parameters<typeof streamText>[0] & { bridge: NeuralBridgeVercelParams }
) {
    const { bridge, ...aiParams } = params;
    const result = await streamText(aiParams);
    
    // Async verification in background
    (async () => {
        const fullText = await result.text;
        const nb = new NeuralBridge({ apiKey: bridge.apiKey });
        const lastUserMessage = (aiParams.messages as CoreMessage[])
            .filter(m => m.role === 'user')
            .pop()?.content?.toString() || "Unknown Context";

        const check = await nb.verify({
            crystal: bridge.crystal,
            question: lastUserMessage,
            answer: fullText
        });

        // If configured, send telemetry/audit log via SDK
        // (Assuming SDK has telemetry methods exposed in future)
        if (check.sri < 0.85) {
            console.warn(`[NeuralBridge] Stream Violation Detected: ${check.issues.join(", ")}`);
        }
    })();

    return result;
}
