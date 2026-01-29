package compiler

import "encoding/json"

// DebugSliceForBudget extracts a sample for preflight token estimation
func DebugSliceForBudget(transcript map[string]any) string {
	b, _ := json.Marshal(transcript)
	if len(b) > 12000 {
		return string(b[len(b)-12000:])
	}
	return string(b)
}

// EstimateTokens provides a rough token count from character length
func EstimateTokens(s string) int {
	if s == "" {
		return 0
	}
	return (len(s) + 3) / 4 // ~4 chars per token
}
