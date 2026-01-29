package verifier

import (
	"encoding/json"
	"errors"
	"strings"

	"neural-bridge-backend/internal/compiler"
	"neural-bridge-backend/internal/providers"
)

// GenerateInvariantCandidates uses LLM to generate invariant candidates from crystal
func GenerateInvariantCandidates(router providers.Router, mode providers.Mode, crystal map[string]any, kMin, kMax int) ([]InvariantV2, providers.JSONResult, error) {
	provs, err := router.PickOrder(mode)
	if err != nil {
		return nil, providers.JSONResult{}, err
	}

	if kMin <= 0 {
		kMin = 12
	}
	if kMax <= 0 {
		kMax = 20
	}

	prompt := BuildInvariantsGenPrompt(crystal, kMin, kMax)

	var last providers.JSONResult
	for _, p := range provs {
		res, e := p.GenerateJSON(providers.JSONCall{Prompt: prompt, MaxTokens: 1500, Temperature: 0})
		last = res
		if e != nil {
			continue
		}

		// Robust parse: extract JSON array
		arr, err := parseInvariantArray(res.Text)
		if err == nil && len(arr) > 0 {
			return arr, last, nil
		}
	}

	return nil, last, errors.New("failed to generate invariants from LLM")
}

func parseInvariantArray(text string) ([]InvariantV2, error) {
	// Try to extract JSON using the robust extractor
	text = strings.TrimSpace(text)

	// Try direct array parse
	var arr []InvariantV2
	if err := json.Unmarshal([]byte(text), &arr); err == nil && len(arr) > 0 {
		return arr, nil
	}

	// Try to extract first JSON object/array
	extracted, err := compiler.ExtractFirstJSONObject(text)
	if err == nil {
		// Check if it's a wrapper object
		var wrap struct {
			Invariants []InvariantV2 `json:"invariants"`
		}
		if err := json.Unmarshal([]byte(extracted), &wrap); err == nil && len(wrap.Invariants) > 0 {
			return wrap.Invariants, nil
		}
	}

	// Try to find array brackets
	start := strings.Index(text, "[")
	if start >= 0 {
		// Find matching closing bracket
		depth := 0
		inString := false
		escape := false
		for i := start; i < len(text); i++ {
			ch := text[i]
			if inString {
				if escape {
					escape = false
					continue
				}
				if ch == '\\' {
					escape = true
					continue
				}
				if ch == '"' {
					inString = false
				}
				continue
			}
			if ch == '"' {
				inString = true
				continue
			}
			if ch == '[' {
				depth++
			} else if ch == ']' {
				depth--
				if depth == 0 {
					arrStr := text[start : i+1]
					var result []InvariantV2
					if err := json.Unmarshal([]byte(arrStr), &result); err == nil {
						return result, nil
					}
					break
				}
			}
		}
	}

	return nil, errors.New("could not parse invariant array")
}
