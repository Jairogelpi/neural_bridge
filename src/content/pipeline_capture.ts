import type { Transcript } from "../transcript/transcript";
import { captureTranscriptFromDOM } from "../transcript/capture_dom";
import { computeCanonicalHash } from "../core/canonicalize";
import { saveTranscript, saveCrystal, saveCard } from "./storage";
import type { BridgeCard } from "./storage";

import type { SaaSClient } from "../rlm/saas_client";

function uuid(): string {
    const c = crypto as unknown as { randomUUID?: () => string };
    return c.randomUUID ? c.randomUUID() : `card_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function summarizeTranscript(t: Transcript): { title: string; preview: string } {
    const lastUser = [...t.turns].reverse().find(x => x.speaker === "user" && x.text.trim().length > 0);
    const title = lastUser ? lastUser.text.trim().slice(0, 48) : "Capture";
    const preview = (lastUser?.text ?? t.turns[t.turns.length - 1]?.text ?? "").slice(0, 260);
    return { title, preview };
}

/**
 * Capture and Store using SaaS Engine.
 * This offloads the RLM loop to the cloud.
 */
export async function captureAndStoreSaaS(params: {
    platform: "chatgpt" | "gemini" | "claude" | "other";
    saas: SaaSClient;
}): Promise<{ transcript: Transcript; context_id: string; notes: string[] }> {
    // 1) Capture from local DOM
    const transcript = captureTranscriptFromDOM({ platform: params.platform, capture_method: "dom" });

    // 2) Offload RLM to SaaS
    const compileResponse = await params.saas.compile({
        scp_version: "1.0",
        source: {
            platform: params.platform,
            url: location.href
        },
        transcript,
        compile_policy: {
            max_calls: 2,
            budget_tokens: 2000,
            mode: "auto"
        }
    });

    const crystal = compileResponse.context_crystal;
    const notes = compileResponse.compiler_notes;

    // 3) Local Sealing (Integrity check)
    // Even if SaaS compiles it, the local client re-hashes to ensure local consistency
    const canonical_hash = await computeCanonicalHash(crystal);

    // 4) Persist Locally
    await saveTranscript(transcript);

    // Create the sealed version with the new hash
    const crystalObj = crystal as unknown as Record<string, unknown>;
    const sealedObj: Record<string, unknown> = {
        ...crystalObj,
        verification: {
            ...(crystalObj.verification as Record<string, unknown> || {}),
            canonical_hash
        }
    };

    const sealed = sealedObj as unknown as typeof crystal;
    await saveCrystal(sealed);

    // 5) Create Bridge Card
    const { title, preview } = summarizeTranscript(transcript);
    const card: BridgeCard = {
        id: uuid(),
        created_at: new Date().toISOString(),
        platform: params.platform,
        title,
        preview,
        transcript_id: transcript.transcript_id,
        context_id: String(sealedObj.context_id || crystalObj.context_id || "unknown")
    };
    await saveCard(card);

    return { transcript, context_id: String(sealedObj.context_id || "unknown"), notes };
}
