package compiler

import (
	"encoding/json"
	"fmt"
)

// BuildRewritePrompt creates prompt for challenge rewriting
func BuildRewritePrompt(host, level, failureMode, lastRaw string, crystal map[string]any, invariants any, canonicalHash string) string {
	cr, _ := json.Marshal(crystal)
	inv, _ := json.Marshal(invariants)

	return fmt.Sprintf(`INSTRUCTIONS (highest priority):
- Output ONLY valid JSON. No markdown. No extra text.
- You rewrite a verification prompt so that a web LLM (host=%s) outputs clean JSON reliably.
- Keep it short and strict. Use explicit schema and "NO EXTRA TEXT".

CONTEXT:
failure_mode=%s
ladder_level=%s
canonical_hash=%s

CRYSTAL (compact):
%s

INVARIANTS:
%s

LAST_RAW_ANSWER (for diagnosis):
<<<RAW>>>
%s
<<<END>>>

Return JSON:
{
  "rewrite_id": "rw_<short_id>",
  "prompt": "..."
}`, host, failureMode, level, canonicalHash, string(cr), string(inv), lastRaw)
}

// BuildRegenerateInvariantsPrompt creates prompt for invariant regeneration
func BuildRegenerateInvariantsPrompt(host string, crystal map[string]any, failed []string, previous any, targetK int) string {
	cr, _ := json.Marshal(crystal)
	prev, _ := json.Marshal(previous)
	f, _ := json.Marshal(failed)

	return fmt.Sprintf(`INSTRUCTIONS (highest priority):
- Output ONLY valid JSON. No markdown. No extra text.
- Regenerate %d invariants that are UNIVERSAL, TESTABLE, and ROBUST to paraphrase.
- Prefer expected.type: boolean|enum|set|regex. Avoid short_text unless unavoidable.
- Any invariant marked strict must be boolean|enum|set|regex.
- Avoid duplicates with previous invariants.

HOST=%s

CRYSTAL:
%s

FAILED_INVARIANTS:
%s

PREVIOUS_INVARIANTS:
%s

Output JSON array:
[
  {
    "id":"inv_...",
    "kind":"fact|constraint|objective|state|preference|boundary",
    "prompt":"...",
    "expected":{"type":"boolean|enum|set|regex|short_text","value":...},
    "weight":0.0,
    "strict":true,
    "tags":["domain:universal","host:%s","source:crystal"],
    "rationale":"..."
  }
]`, targetK, host, string(cr), string(f), string(prev), host)
}
