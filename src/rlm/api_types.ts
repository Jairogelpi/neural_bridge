import type { Transcript } from "../transcript/transcript";
import type { ContextCrystal } from "../core/scp_types";

export interface SessionBootstrapRequest {
    install_id: string;
    extension_version: string;
    browser: {
        name: string;
        version: string;
    };
    locale?: string;
    timezone?: string;
}

export interface SessionBootstrapResponse {
    session_token: string;
    expires_at: string;
    policy: {
        max_compile_calls?: number;
        max_tokens_per_compile?: number;
        max_calls?: number; // Legacy/Comp
        budget_tokens?: number; // Legacy/Comp
        retention: {
            store_transcripts: boolean;
            transcript_ttl_hours: number;
        };
    };
    region: string;
}

export interface CompileRequest {
    scp_version: string;
    source: {
        platform: string;
        url?: string;
    };
    transcript: Transcript;
    compile_policy: {
        max_calls: number;
        budget_tokens: number;
        mode: "auto" | "high_quality" | "fast";
    };
    author_id?: string; // Phase 6: Link to author
}

export interface CompileResponse {
    context_crystal: ContextCrystal;
    invariants: string[];
    compiler_notes: string[];
    cost?: {
        provider: string;
        model: string;
        tokens?: number;
        input_tokens?: number;
        output_tokens?: number;
        cost_usd_est?: number;
    };
}

export interface TelemetryRequest {
    context_id: string;
    target_host: string;
    decision: "ACCEPT" | "FAIL";
    score: number;
    ladder_steps?: any;
    extension_version?: string;
    author_id?: string; // Phase 6: Slashing
    reputation_impact?: number; // Phase 6: Slashing
}

export interface AuthorRegisterRequest {
    name: string;
    handle: string;
    public_key: string;
}

export interface AuthorResponse {
    author_id: string;
    name: string;
    handle: string;
    tier: string;
    reputation: number;
    public_key: string;
}
