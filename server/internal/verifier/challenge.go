package verifier

import (
	"encoding/json"
	"fmt"
	"strings"
)

// BuildChallenge creates the verification prompt to inject into the target LLM
func BuildChallenge(invariants []InvariantV2, level LadderLevel, canonicalHash string) (Challenge, error) {
	switch level {
	case LadderCompact:
		return buildCompactChallenge(invariants)
	case LadderRedundant:
		return buildRedundantChallenge(invariants)
	case LadderSectioned:
		return buildSectionedChallenge(invariants, canonicalHash)
	default:
		return buildCompactChallenge(invariants)
	}
}

func buildCompactChallenge(invariants []InvariantV2) (Challenge, error) {
	// Minimal format - fast verification
	checks := []map[string]any{}
	for _, inv := range invariants {
		checks = append(checks, map[string]any{
			"id":            inv.ID,
			"prompt":        inv.Prompt,
			"expected_type": inv.Expected.Type,
		})
	}

	b, _ := json.Marshal(checks)

	sys := "You are a verification agent. Output ONLY valid JSON. No markdown. No extra text."
	user := fmt.Sprintf(`Answer these verification checks based on your current context state.
Return JSON with answers matching the expected_type.

Checks:
%s

Output format:
{
  "answers": { "<id>": <value> },
  "short_summary": "one sentence summary of the context"
}`, string(b))

	return Challenge{System: sys, User: strings.TrimSpace(user)}, nil
}

func buildRedundantChallenge(invariants []InvariantV2) (Challenge, error) {
	// Duplicate questions with reformulations + allow null for unknowns
	redundant := []map[string]any{}
	for _, inv := range invariants {
		redundant = append(redundant, map[string]any{
			"id":            inv.ID,
			"prompt":        inv.Prompt,
			"expected_type": inv.Expected.Type,
		})
		// Add reformulated version
		redundant = append(redundant, map[string]any{
			"id":            inv.ID + "_alt",
			"prompt":        "Rephrase: " + inv.Prompt,
			"expected_type": inv.Expected.Type,
		})
	}

	b, _ := json.Marshal(redundant)

	sys := "You are a verification agent. Output ONLY valid JSON. No markdown. No extra text. If unknown, use null."
	user := fmt.Sprintf(`Answer these verification checks (redundant format for consistency).
Return JSON with answers. Use null if you genuinely don't know.

Checks:
%s

Output format:
{
  "answers": { "<id>": <value|null> },
  "consistency": { "conflicts": [] },
  "short_summary": "one sentence summary of the context"
}`, string(b))

	return Challenge{System: sys, User: strings.TrimSpace(user)}, nil
}

func buildSectionedChallenge(invariants []InvariantV2, canonicalHash string) (Challenge, error) {
	// Maximum robustness - structured sections with hash anchor
	checks := []map[string]any{}
	for _, inv := range invariants {
		checks = append(checks, map[string]any{
			"id":            inv.ID,
			"prompt":        inv.Prompt,
			"expected_type": inv.Expected.Type,
		})
	}

	b, _ := json.Marshal(checks)

	sys := "You are a verification agent. Output ONLY valid JSON. No markdown. No extra text."
	user := fmt.Sprintf(`Complete this SECTIONED verification based on your memory crystal state.
Return EXACTLY this structure:

{
  "canonical_hash": "%s",
  "intent_state": {
    "intent": "primary goal in one sentence",
    "state_summary": "current state in one sentence"
  },
  "constraints": {
    "hard": ["..."],
    "soft": ["..."]
  },
  "answers": { "<id>": <value|null> },
  "short_summary": "one line context summary"
}

Checks:
%s`, canonicalHash, string(b))

	return Challenge{System: sys, User: strings.TrimSpace(user)}, nil
}

// BuildVisiblePromptForInjection creates the full prompt to inject into target LLM
func BuildVisiblePromptForInjection(crystalJSON string, challenge Challenge) string {
	return fmt.Sprintf(`You are resuming a session from a transferred memory crystal.
INSTRUCTIONS: First complete the verification before proceeding.

MEMORY CRYSTAL:
%s

VERIFICATION:
%s
`, crystalJSON, challenge.User)
}
