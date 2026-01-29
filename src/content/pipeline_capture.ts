import type { Transcript } from "../transcript/transcript";
import { captureTranscriptFromDOM } from "../transcript/capture_dom";
import { computeCanonicalHash } from "../core/canonicalize";
import { saveTranscript, saveCrystal, saveCard, BridgeCard } from "./storage";

import { SaaSClient } from "../rlm/saas_client";

function uuid(): string {
    return (crypto as any).randomUUID ? (crypto as any).randomUUID() : `card_${Date.now()}_${Math.random().toString(16).slice(2)}`;
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

    // Attach the local seal result to the crystal verification
    const sealed = {
        ...crystal,
        verification: {
            ...crystal.verification,
            canonical_hash
        }
    };

    // 4) Persist Locally
    await saveTranscript(transcript);
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
        context_id: sealed.context_id
    };
    await saveCard(card);

    return { transcript, context_id: sealed.context_id, notes };
}
