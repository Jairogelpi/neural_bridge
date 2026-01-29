package verifier

import (
	"encoding/json"
	"regexp"
	"strings"
)

// VerifyV2 evaluates invariants against an LLM response with enhanced V2 types
func VerifyV2(invariants []InvariantV2, llmResponse string, threshold float64) VerificationResult {
	if threshold <= 0 {
		threshold = 0.85
	}

	// Parse the LLM response
	parsed := parseAnswers(llmResponse)

	var totalWeight float64
	var weightedScore float64
	failures := []string{}
	results := []InvariantResult{}

	for _, inv := range invariants {
		score, reason, actual := evaluateV2(inv, parsed, llmResponse)
		totalWeight += inv.Weight
		weightedScore += score * inv.Weight

		results = append(results, InvariantResult{
			ID:       inv.ID,
			Type:     inv.Kind,
			Score:    score,
			Reason:   reason,
			Expected: expectedToString(inv.Expected),
			Actual:   truncateStr(actual, 100),
		})

		if inv.Strict && score < 1.0 {
			failures = append(failures, inv.ID)
		}
	}

	finalScore := 0.0
	if totalWeight > 0 {
		finalScore = weightedScore / totalWeight
	}

	// Decision logic
	var decision string
	var passed bool

	if len(failures) > 0 {
		decision = "FAIL"
		passed = false
	} else if finalScore >= threshold {
		decision = "ACCEPT"
		passed = true
	} else if finalScore >= 0.5 {
		decision = "RETRY"
		passed = false
	} else {
		decision = "FAIL"
		passed = false
	}

	return VerificationResult{
		Score:     finalScore,
		Passed:    passed,
		Decision:  decision,
		Threshold: threshold,
		Failures:  failures,
		Evaluated: results,
	}
}

func parseAnswers(response string) map[string]any {
	// Try to extract JSON from response
	lower := strings.ToLower(response)
	
	// Find the answers object
	if idx := strings.Index(lower, `"answers"`); idx >= 0 {
		// Extract from there
		start := strings.Index(response[idx:], "{")
		if start >= 0 {
			depth := 0
			inStr := false
			esc := false
			for i := idx + start; i < len(response); i++ {
				ch := response[i]
				if inStr {
					if esc {
						esc = false
						continue
					}
					if ch == '\\' {
						esc = true
						continue
					}
					if ch == '"' {
						inStr = false
					}
					continue
				}
				if ch == '"' {
					inStr = true
					continue
				}
				if ch == '{' {
					depth++
				} else if ch == '}' {
					depth--
					if depth == 0 {
						var ans map[string]any
						if err := json.Unmarshal([]byte(response[idx+start:i+1]), &ans); err == nil {
							return ans
						}
						break
					}
				}
			}
		}
	}

	// Try to parse whole response as JSON
	var full map[string]any
	if err := json.Unmarshal([]byte(response), &full); err == nil {
		if ans, ok := full["answers"].(map[string]any); ok {
			return ans
		}
		return full
	}

	return nil
}

func evaluateV2(inv InvariantV2, answers map[string]any, fullResponse string) (score float64, reason string, actual string) {
	// Check if we have a direct answer
	if answers != nil {
		if val, ok := answers[inv.ID]; ok {
			actual = anyToString(val)
			return matchExpected(inv.Expected, val, actual)
		}
		// Check for alt version
		if val, ok := answers[inv.ID+"_alt"]; ok {
			actual = anyToString(val)
			return matchExpected(inv.Expected, val, actual)
		}
	}

	// Fallback: search in full response
	responseLower := strings.ToLower(fullResponse)
	expectedStr := strings.ToLower(expectedToString(inv.Expected))
	actual = responseLower

	if strings.Contains(responseLower, expectedStr) {
		return 0.7, "found_in_text", actual
	}

	return 0.0, "not_found", actual
}

func matchExpected(exp Expected, val any, actual string) (float64, string, string) {
	switch exp.Type {
	case "boolean":
		expBool, _ := exp.Value.(bool)
		valBool := toBool(val)
		if expBool == valBool {
			return 1.0, "exact_match", actual
		}
		return 0.0, "mismatch", actual

	case "enum", "short_text":
		expStr := strings.ToLower(strings.TrimSpace(expectedToString(exp)))
		valStr := strings.ToLower(strings.TrimSpace(anyToString(val)))
		if expStr == valStr {
			return 1.0, "exact_match", actual
		}
		if strings.Contains(valStr, expStr) || strings.Contains(expStr, valStr) {
			return 0.7, "semantic_match", actual
		}
		return 0.0, "mismatch", actual

	case "set":
		expSet := toStringSlice(exp.Value)
		valSet := toStringSlice(val)
		if len(expSet) == 0 {
			return 0.0, "empty_expected", actual
		}
		matches := 0
		for _, e := range expSet {
			for _, v := range valSet {
				if strings.ToLower(e) == strings.ToLower(v) {
					matches++
					break
				}
			}
		}
		ratio := float64(matches) / float64(len(expSet))
		if ratio >= 1.0 {
			return 1.0, "exact_match", actual
		}
		if ratio >= 0.5 {
			return 0.7, "partial_match", actual
		}
		return 0.0, "mismatch", actual

	case "regex":
		expPattern, _ := exp.Value.(string)
		valStr := anyToString(val)
		re, err := regexp.Compile("(?i)" + expPattern)
		if err != nil {
			return 0.0, "invalid_regex", actual
		}
		if re.MatchString(valStr) {
			return 1.0, "regex_match", actual
		}
		return 0.0, "mismatch", actual
	}

	return 0.0, "unknown_type", actual
}

func toBool(v any) bool {
	switch t := v.(type) {
	case bool:
		return t
	case string:
		ls := strings.ToLower(strings.TrimSpace(t))
		return ls == "true" || ls == "yes" || ls == "sí" || ls == "si"
	default:
		return false
	}
}

func toStringSlice(v any) []string {
	switch t := v.(type) {
	case []string:
		return t
	case []any:
		out := []string{}
		for _, x := range t {
			if s, ok := x.(string); ok {
				out = append(out, s)
			}
		}
		return out
	case string:
		return strings.Split(t, ",")
	default:
		return nil
	}
}

func anyToString(v any) string {
	switch t := v.(type) {
	case string:
		return t
	case bool:
		if t {
			return "true"
		}
		return "false"
	case float64:
		// Simple: just marshal to JSON and return
		b, _ := json.Marshal(t)
		return string(b)
	case int:
		b, _ := json.Marshal(t)
		return string(b)
	default:
		b, _ := json.Marshal(v)
		return string(b)
	}
}

func truncateStr(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max] + "..."
}
