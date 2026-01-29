// Retry Engine - Full Verification Ladder
// Injects prompt → reads response → verifies → decides → escalates

import type {
    LadderLevel,
    LadderAttempt,
    InvariantV2,
    RetryDecision
} from "./types";
import { buildChallengePrompt } from "./promptBuilder";
import { decide } from "./decision";
import { extractFirstJSON } from "../shared/jsonExtract";

export interface VerifierFunction {
    (parsedResponse: any): {
        score: number;
        strictFailures: string[];
    };
}

export interface HostBridge {
    send: (prompt: string) => Promise<void>;
    readLastAssistantMessage: () => Promise<string>;
}

export interface RunVerifiedBridgeParams {
    crystal: any;
    invariants: InvariantV2[];
    canonicalHash: string;
    acceptThreshold: number;
    maxTotalAttempts?: number;
    verifier: VerifierFunction;
    host: HostBridge;
    onAttempt?: (attempt: LadderAttempt) => void;
}

export interface RunVerifiedBridgeResult {
    ok: boolean;
    score: number;
    decision: RetryDecision;
    attempts: LadderAttempt[];
    finalParsed?: any;
}

export async function runVerifiedBridge(
    params: RunVerifiedBridgeParams
): Promise<RunVerifiedBridgeResult> {
    const {
        crystal,
        invariants,
        canonicalHash,
        acceptThreshold,
        maxTotalAttempts = 3,
        verifier,
        host,
        onAttempt,
    } = params;

    const attempts: LadderAttempt[] = [];
    let level: LadderLevel = "compact";
    let attemptIndexAtLevel = 0;

    const crystalJSON = JSON.stringify(crystal, null, 2);

    for (let n = 0; n < maxTotalAttempts; n++) {
        // Build the challenge prompt
        const prompt = buildChallengePrompt({
            level,
            crystalJSON,
            invariants,
            canonicalHash,
        });

        // Inject into target LLM
        await host.send(prompt);

        // Read response
        const rawText = await host.readLastAssistantMessage();

        // Parse JSON from response
        let parsedJSON: any = null;
        let parseOK = true;

        try {
            parsedJSON = extractFirstJSON(rawText);
        } catch {
            parseOK = false;
        }

        // Verify
        let score = 0;
        let strictFailures: string[] = [];

        if (parseOK && parsedJSON) {
            const v = verifier(parsedJSON);
            score = v.score;
            strictFailures = v.strictFailures;
        } else {
            score = 0;
            strictFailures = ["parse_fail"];
        }

        // Decide
        const d = decide({
            score,
            acceptThreshold,
            strictFailures,
            level,
            attemptIndex: attemptIndexAtLevel,
        });

        const attempt: LadderAttempt = {
            level,
            attemptIndex: attemptIndexAtLevel,
            injectedAt: new Date().toISOString(),
            rawText,
            parsedJSON,
            parseOK,
            score,
            strictFailures,
            decision: d.decision,
            reason: d.reason,
        };

        attempts.push(attempt);
        onAttempt?.(attempt);

        // Handle decision
        if (d.decision === "ACCEPT") {
            return {
                ok: true,
                score,
                decision: "ACCEPT",
                attempts,
                finalParsed: parsedJSON
            };
        }

        if (d.decision === "FAIL") {
            return {
                ok: false,
                score,
                decision: "FAIL",
                attempts
            };
        }

        // RETRY: update ladder
        if (d.nextLevel === level) {
            attemptIndexAtLevel += 1;
        } else {
            level = d.nextLevel!;
            attemptIndexAtLevel = 0;
        }
    }

    // Max attempts reached
    const lastAttempt = attempts[attempts.length - 1];
    return {
        ok: false,
        score: lastAttempt?.score ?? 0,
        decision: "FAIL",
        attempts
    };
}

// Default verifier implementation using backend
export function createBackendVerifier(
    invariants: InvariantV2[]
): VerifierFunction {
    return (parsed: any) => {
        const answers = parsed?.answers ?? parsed ?? {};
        let totalWeight = 0;
        let weightedScore = 0;
        const strictFailures: string[] = [];

        for (const inv of invariants) {
            const answer = answers[inv.id] ?? answers[inv.id + "_alt"];
            const score = matchExpected(inv, answer);

            totalWeight += inv.weight;
            weightedScore += score * inv.weight;

            if (inv.strict && score < 1.0) {
                strictFailures.push(inv.id);
            }
        }

        const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
        return { score: finalScore, strictFailures };
    };
}

function matchExpected(inv: InvariantV2, answer: any): number {
    if (answer === null || answer === undefined) {
        return 0;
    }

    const expected = inv.expected;

    switch (expected.type) {
        case "boolean": {
            const expBool = expected.value === true || expected.value === "true";
            const ansBool = answer === true || answer === "true" || answer === "yes" || answer === "sí";
            return expBool === ansBool ? 1.0 : 0.0;
        }

        case "enum":
        case "short_text": {
            const expStr = String(expected.value).toLowerCase().trim();
            const ansStr = String(answer).toLowerCase().trim();
            if (expStr === ansStr) return 1.0;
            if (ansStr.includes(expStr) || expStr.includes(ansStr)) return 0.7;
            return 0.0;
        }

        case "set": {
            const expSet = Array.isArray(expected.value)
                ? expected.value.map(s => String(s).toLowerCase())
                : String(expected.value).split(",").map(s => s.toLowerCase().trim());
            const ansSet = Array.isArray(answer)
                ? answer.map((s: any) => String(s).toLowerCase())
                : String(answer).split(",").map(s => s.toLowerCase().trim());

            let matches = 0;
            for (const e of expSet) {
                if (ansSet.some((a: string) => a.includes(e) || e.includes(a))) {
                    matches++;
                }
            }
            const ratio = expSet.length > 0 ? matches / expSet.length : 0;
            if (ratio >= 1.0) return 1.0;
            if (ratio >= 0.5) return 0.7;
            return 0.0;
        }

        case "regex": {
            const pattern = String(expected.value);
            const ansStr = String(answer);
            try {
                const re = new RegExp(pattern, "i");
                return re.test(ansStr) ? 1.0 : 0.0;
            } catch {
                return 0.0;
            }
        }

        default:
            return 0.0;
    }
}
