// Semantic Verifier Types and Client
// Used by the extension to verify LLM context alignment

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

export interface VerificationResult {
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
