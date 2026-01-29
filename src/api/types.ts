export type Platform = "chatgpt" | "gemini" | "claude" | "perplexity" | "other";

export type Speaker = "user" | "assistant" | "system" | "tool" | "unknown";

export interface TranscriptTurn {
    id: string;
    speaker: Speaker;
    text: string;
    code_blocks?: Array<{ lang?: string; code: string }>;
    urls?: string[];
    ts?: string;
}

export interface Transcript {
    transcript_id: string;
    captured_at: string;
    source: {
        platform: Platform;
        capture_method: "dom" | "network" | "clipboard" | "manual";
        url?: string;
        locale?: string;
    };
    turns: TranscriptTurn[];
}

export interface CompilePolicy {
    mode: "auto" | "cheap_first" | "high_accuracy";
    max_calls: number;
    token_budget: number;
    store_transcript?: boolean;
    transcript_ttl_hours?: number;
}

export interface CompileRequest {
    scp_version: "1.0";
    source: { platform: Platform; url?: string };
    transcript: Transcript;
    compile_policy: CompilePolicy;
}

export interface CompileResponse {
    context_crystal: any;
    invariants?: any[];
    compiler_notes: string[];
    cost: {
        provider: "openai" | "anthropic" | "google" | "other";
        model: string;
        input_tokens: number;
        output_tokens: number;
        cost_usd_est?: number;
    };
}

export interface SessionBootstrapRequest {
    install_id: string;
    extension_version: string;
    browser: { name: "chrome" | "edge" | "brave" | "other"; version: string };
    locale?: string;
    timezone?: string;
}

export interface SessionBootstrapResponse {
    session_token: string;
    expires_at: string; // ISO
    policy: {
        max_compile_calls: number;
        max_tokens_per_compile: number;
        retention: { store_transcripts: boolean; transcript_ttl_hours: number };
        telemetry_opt_in_default?: boolean;
    };
}

export interface HostProfile {
    platform: Platform;
    capture: { strategy: "dom" | "network" | "hybrid"; max_turns: number; max_chars: number };
    injection: { input_mode: "textarea" | "contenteditable" | "auto"; send_mode: "enter" | "click" | "auto" };
    verification: {
        ladder: Array<"compact" | "redundant" | "sectioned">;
        min_checks: number;
        accept_threshold: number;
        response_format: "json_only";
    };
}

export interface VerifyTelemetryRequest {
    context_id: string;
    target_host: Platform | "other";
    decision: "ACCEPT" | "RETRY" | "FAIL";
    score: number;
    ladder_steps: any;
    receipt?: any;
    author_id?: string;
    reputation_impact?: number;
    extension_version?: string;
}

// Verifier types
export type InvariantType = "fact" | "constraint" | "state" | "intent" | "consistency";

export interface Invariant {
    id: string;
    type: InvariantType;
    prompt: string;
    expected: string;
    weight: number;
    strict: boolean;
}

export interface InvariantResult {
    id: string;
    type: string;
    score: number;
    reason: "exact_match" | "semantic_match" | "mismatch" | "contradiction";
    expected: string;
    actual: string;
}

export interface VerifyRequest {
    context_id: string;
    invariants: Invariant[];
    llm_response: string;
    threshold?: number;
    ladder_step?: number;
}

export interface VerifyResponse {
    context_id: string;
    score: number;
    passed: boolean;
    decision: "ACCEPT" | "RETRY" | "FAIL";
    threshold: number;
    failures: string[];
    evaluated: InvariantResult[];
    ladder_step: number;
}

export interface GenerateInvariantsResponse {
    invariants: Invariant[];
    verification_prompt: string;
    count: number;
}

export type Crystal = Record<string, any>;

