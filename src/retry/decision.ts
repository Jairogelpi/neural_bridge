// Decision Engine for Retry Ladder
// Determines ACCEPT / RETRY / FAIL based on score and strict failures

import type { LadderLevel, RetryDecision } from "./types";

export interface DecisionInput {
    score: number;
    acceptThreshold: number;
    strictFailures: string[];
    level: LadderLevel;
    attemptIndex: number;
}

export interface DecisionResult {
    decision: RetryDecision;
    reason: string;
    nextLevel?: LadderLevel;
}

export function decide(input: DecisionInput): DecisionResult {
    const { score, acceptThreshold, strictFailures, level, attemptIndex } = input;

    // Strict failures → escalate or fail
    if (strictFailures.length > 0) {
        if (level === "sectioned") {
            return { decision: "FAIL", reason: "strict_invariants_failed_on_max_level" };
        }
        return {
            decision: "RETRY",
            reason: "strict_failures_escalate",
            nextLevel: nextLevel(level)
        };
    }

    // Score above threshold → accept
    if (score >= acceptThreshold) {
        return { decision: "ACCEPT", reason: "score_above_threshold" };
    }

    // Borderline score → retry same level once
    const retrySameThreshold = acceptThreshold - 0.08;
    if (score >= retrySameThreshold && attemptIndex === 0) {
        return {
            decision: "RETRY",
            reason: "borderline_retry_same_level",
            nextLevel: level
        };
    }

    // On max level → fail
    if (level === "sectioned") {
        return { decision: "FAIL", reason: "score_below_threshold_on_max_level" };
    }

    // Escalate to next level
    return {
        decision: "RETRY",
        reason: "score_low_escalate",
        nextLevel: nextLevel(level)
    };
}

function nextLevel(level: LadderLevel): LadderLevel {
    if (level === "compact") return "redundant";
    if (level === "redundant") return "sectioned";
    return "sectioned";
}
