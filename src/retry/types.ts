// Retry Ladder Types and Client
// Industrial-grade verification with 3-level escalation

export type LadderLevel = "compact" | "redundant" | "sectioned";
export type RetryDecision = "ACCEPT" | "RETRY" | "FAIL";

export interface LadderAttempt {
    level: LadderLevel;
    attemptIndex: number;
    injectedAt: string;
    rawText: string;
    parsedJSON?: any;
    parseOK: boolean;
    score: number;
    strictFailures: string[];
    decision: RetryDecision;
    reason: string;
}

export interface Expected {
    type: "boolean" | "enum" | "set" | "regex" | "short_text";
    value: string | string[] | boolean;
}

export interface InvariantV2 {
    id: string;
    kind: "fact" | "constraint" | "objective" | "state" | "preference" | "boundary";
    prompt: string;
    expected: Expected;
    weight: number;
    strict: boolean;
    tags?: string[];
    rationale?: string;
}

export interface Challenge {
    system: string;
    user: string;
}

export interface GenerateInvariantsV2Response {
    invariants: InvariantV2[];
    challenge: Challenge;
    generated_count: number;
    refined_count: number;
    level: LadderLevel;
    cost: {
        provider: string;
        model: string;
        input_tokens: number;
        output_tokens: number;
        cost_usd_est: number;
    };
}
