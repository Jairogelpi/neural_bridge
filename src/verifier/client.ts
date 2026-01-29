// Client-side verifier for the extension
// Integrates with the SaaS backend for semantic verification

import type {
    Invariant,
    VerificationResult,
    GenerateInvariantsResponse
} from "./types";

const MAX_RETRIES = 3;

export interface VerifyOptions {
    contextId: string;
    invariants: Invariant[];
    threshold?: number;
    onRetry?: (step: number, result: VerificationResult) => void;
}

/**
 * Full verification ladder: injects prompt, reads response, verifies with backend
 * Automatically retries with stronger prompts on partial failures
 */
export async function runVerificationLadder(
    options: VerifyOptions,
    injectPrompt: (prompt: string) => Promise<void>,
    readResponse: () => Promise<string>
): Promise<VerificationResult> {
    const threshold = options.threshold ?? 0.85;

    for (let step = 0; step < MAX_RETRIES; step++) {
        // Generate verification prompt
        const prompt = buildVerificationPrompt(options.invariants, step);

        // Inject into LLM
        await injectPrompt(prompt);

        // Read the response
        const llmResponse = await readResponse();

        // Verify via backend
        const result = await verifyViaBackend({
            context_id: options.contextId,
            invariants: options.invariants,
            llm_response: llmResponse,
            threshold,
            ladder_step: step,
        });

        if (result.passed) {
            return result;
        }

        // Callback for UI updates
        options.onRetry?.(step, result);

        // On FAIL (not RETRY), stop immediately
        if (result.decision === "FAIL") {
            return result;
        }
    }

    // Final attempt failed
    return {
        context_id: options.contextId,
        score: 0,
        passed: false,
        decision: "FAIL",
        threshold,
        failures: ["max_retries_exceeded"],
        evaluated: [],
        ladder_step: MAX_RETRIES,
    };
}

/**
 * Build the verification prompt to inject into the LLM
 * Progressively stronger on retries
 */
function buildVerificationPrompt(invariants: Invariant[], step: number): string {
    const strictness = step === 0 ? "" : step === 1
        ? "\n⚠️ IMPORTANTE: Responde con precisión extrema."
        : "\n🚨 CRÍTICO: Verifica tu memoria antes de responder.";

    const questions = invariants.map((inv, i) =>
        `${i + 1}. ${inv.prompt}`
    ).join("\n");

    return `Para verificar tu comprensión del contexto actual, responde estas preguntas de forma concisa:

${questions}
${strictness}

Responde en JSON con este formato exacto:
{
${invariants.map((inv, i) => `  "${inv.id}": "tu respuesta"${i < invariants.length - 1 ? "," : ""}`).join("\n")}
}`;
}

/**
 * Call the backend /v1/verify endpoint
 */
async function verifyViaBackend(req: {
    context_id: string;
    invariants: Invariant[];
    llm_response: string;
    threshold: number;
    ladder_step: number;
}): Promise<VerificationResult> {
    const resp = await chrome.runtime.sendMessage({
        type: "NB_VERIFY",
        req,
    });

    if (!resp?.ok) {
        throw new Error(resp?.error ?? "verification_failed");
    }

    return resp.result as VerificationResult;
}

/**
 * Generate invariants from a crystal via backend
 */
export async function generateInvariants(
    crystal: Record<string, any>
): Promise<GenerateInvariantsResponse> {
    const resp = await chrome.runtime.sendMessage({
        type: "NB_GENERATE_INVARIANTS",
        crystal,
    });

    if (!resp?.ok) {
        throw new Error(resp?.error ?? "invariant_generation_failed");
    }

    return resp.result as GenerateInvariantsResponse;
}

/**
 * Quick local check (no backend) for basic invariants
 * Use for fast UI feedback before full verification
 */
export function quickLocalVerify(
    invariants: Invariant[],
    response: string
): { score: number; passed: boolean } {
    const lower = response.toLowerCase();
    let total = 0;
    let matched = 0;

    for (const inv of invariants) {
        total += inv.weight;
        if (lower.includes(inv.expected.toLowerCase())) {
            matched += inv.weight;
        }
    }

    const score = total > 0 ? matched / total : 0;
    return { score, passed: score >= 0.85 };
}
