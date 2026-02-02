// Bridge Flow - Complete End-to-End Integration
// Connects: Crystal → Invariants → Retry Ladder → Verification → Telemetry

import { overlay } from "./ui/overlay";
import { VerificationService } from "../services/verification_service";
import type { Invariant } from "./verifier/verifier";
import type { Platform } from "../api/types";

export interface BridgeFlowParams {
    crystal: Record<string, unknown>;
    invariants: Invariant[];
    canonicalHash: string;
    acceptThreshold?: number;
    platform: Platform;
    extensionVersion: string;
    host: {
        send: (prompt: string) => Promise<void>;
        readLastAssistantMessage: () => Promise<string>;
    };
}

export interface BridgeFlowResult {
    ok: boolean;
    score: number;
    decision: "ACCEPT" | "RETRY" | "FAIL";
    attempts: unknown[];
    finalParsed?: unknown;
}

/**
 * Run the complete Neural Bridge verification flow
 * 1. Show running overlay
 * 2. Execute retry ladder with verification
 * 3. Update overlay based on result
 * 4. Report telemetry to backend
 */
export async function runBridgeFlow(params: BridgeFlowParams): Promise<BridgeFlowResult> {
    const {
        crystal,
        canonicalHash,
        host,
    } = params;

    // Show running state
    overlay.running("Bridging & verifying…", 10);

    try {
        // HARMONY CAPTURE: Wait for and read the actual assistant response
        const answer = await host.readLastAssistantMessage();

        const result = await VerificationService.verify({
            context_id: (crystal.context_id as string) || canonicalHash,
            domain: String((params.crystal as Record<string, unknown>).domain || 'general'),
            question: "Semantic Transfer Verification",
            answer: answer,
            mode: 'active',
            requester: "bridge_flow"
        });

        // Bridge Flow wrapper for legacy compatibility with retry UI
        // In a full refactor, runVerifiedBridge would also use VerificationService
        // but for now we ensure they share the same backend runner.

        if (!result) throw new Error("Verification Service returned null");

        const adapterResult: BridgeFlowResult = {
            ok: result.passed,
            score: result.sri,
            decision: result.passed ? 'ACCEPT' : 'FAIL',
            attempts: result.execution_log,
            finalParsed: result.receipt
        };

        // Update final state
        if (adapterResult.ok) {
            overlay.success(adapterResult.score, "Memory synchronized. You can continue without re-explaining.");
        } else {
            overlay.error(
                "Could not verify the transferred memory. Try again or reduce the crystal.",
                adapterResult.score
            );
        }

        // TELEMETRY HANDLED: VerificationService already reports telemetry centrally.
        // This removes duplicate entries in the Dashboard.

        return adapterResult;
    } catch (error: any) {
        overlay.error(error?.message ?? "Bridge flow failed");
        console.error("[NeuralBridge] Bridge flow error:", error);

        return {
            ok: false,
            score: 0,
            decision: "FAIL",
            attempts: [],
        };
    }
}

/**
 * Quick verification without the full ladder
 * Useful for fast feedback or debugging
 */
export async function quickVerify(params: {
    invariants: Invariant[];
    response: string;
}): Promise<{ score: number; passed: boolean; details: any }> {
    try {
        const result = await VerificationService.verify({
            question: "Quick Validation",
            answer: params.response,
            mode: 'active',
            requester: "quick_verify"
        });

        if (!result) return { score: 0, passed: false, details: { error: "no_crystal" } };

        return {
            score: result.sri,
            passed: result.passed,
            details: result
        };
    } catch (e) {
        return {
            score: 0,
            passed: false,
            details: { error: "verify_failed" },
        };
    }
}
