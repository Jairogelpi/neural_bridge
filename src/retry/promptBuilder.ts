// Prompt Builder for Retry Ladder
// Creates verification challenges for each escalation level

import type { LadderLevel, InvariantV2 } from "./types";

export function buildChallengePrompt(params: {
    level: LadderLevel;
    crystalJSON: string;
    invariants: InvariantV2[];
    canonicalHash: string;
}): string {
    const { level, crystalJSON, invariants, canonicalHash } = params;

    if (level === "compact") {
        const checks = invariants.map(inv => ({
            id: inv.id,
            prompt: inv.prompt,
            expected_type: inv.expected.type,
        }));

        return `
You are resuming from a transferred memory crystal.
Return ONLY valid JSON. No markdown. No extra text.

MEMORY CRYSTAL:
${crystalJSON}

VERIFICATION TASK:
Return:
{
  "answers": { "<id>": <value> },
  "short_summary": "one sentence summary"
}

Checks:
${JSON.stringify(checks, null, 2)}
`.trim();
    }

    if (level === "redundant") {
        // Duplicate questions with reformulations + allow null
        const redundant = invariants.flatMap(inv => ([
            { id: inv.id, prompt: inv.prompt, expected_type: inv.expected.type },
            { id: inv.id + "_alt", prompt: "Rephrase: " + inv.prompt, expected_type: inv.expected.type }
        ]));

        return `
You are resuming from a transferred memory crystal.
Return ONLY valid JSON. If unknown, use null.

MEMORY CRYSTAL:
${crystalJSON}

VERIFICATION (redundant format):
Return:
{
  "answers": { "<id>": <value|null> },
  "consistency": { "conflicts": [] },
  "short_summary": "one sentence summary"
}

Checks:
${JSON.stringify(redundant, null, 2)}
`.trim();
    }

    // sectioned - maximum robustness
    const checks = invariants.map(inv => ({
        id: inv.id,
        prompt: inv.prompt,
        expected_type: inv.expected.type,
    }));

    return `
You are resuming from a transferred memory crystal.
Return ONLY valid JSON. No extra text.

MEMORY CRYSTAL:
${crystalJSON}

SECTIONED VERIFICATION:
Return EXACTLY:
{
  "canonical_hash": "${canonicalHash}",
  "intent_state": {
    "intent": "primary goal",
    "state_summary": "current state"
  },
  "constraints": {
    "hard": ["..."],
    "soft": ["..."]
  },
  "answers": { "<id>": <value|null> },
  "short_summary": "one line summary"
}

Checks:
${JSON.stringify(checks, null, 2)}
`.trim();
}
