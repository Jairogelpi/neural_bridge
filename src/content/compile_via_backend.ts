import type { Transcript, CompileRequest, Platform, CompileResponse } from "../api/types";

export async function compileViaBackend(params: {
    platform: Platform;
    transcript: Transcript;
    sourceUrl?: string;
    mode?: "auto" | "cheap_first" | "high_accuracy";
}): Promise<CompileResponse> {
    const req: CompileRequest = {
        scp_version: "1.0",
        source: {
            platform: params.platform,
            ...(params.sourceUrl ? { url: params.sourceUrl } : {})
        },
        transcript: params.transcript,
        compile_policy: {
            mode: params.mode ?? "auto",
            max_calls: 2,
            token_budget: 2000,
            store_transcript: false,
            transcript_ttl_hours: 24,
        },
    };

    const idemKey = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? (crypto as unknown as { randomUUID: () => string }).randomUUID()
        : `idem_${Date.now()}`;

    const r = await chrome.runtime.sendMessage({ type: "NB_COMPILE", req, idemKey });
    if (!r?.ok) throw new Error(r?.error ?? "compile_failed");
    return r.resp; // CompileResponse
}
