package verifier

import (
	"math"
	"strings"
)

// Verify evaluates all invariants against an LLM response
// Returns a VerificationResult with weighted score and pass/fail decision
func Verify(req VerifyRequest) VerificationResult {
	if req.Threshold <= 0 {
		req.Threshold = 0.85 // Default threshold
	}

	var totalWeight float64
	var weightedScore float64
	failures := []string{}
	results := []InvariantResult{}

	for _, inv := range req.Invariants {
		score, reason, actual := evaluate(inv, req.LLMResponse)
		totalWeight += inv.Weight
		weightedScore += score * inv.Weight

		results = append(results, InvariantResult{
			ID:       inv.ID,
			Type:     string(inv.Type),
			Score:    score,
			Reason:   reason,
			Expected: inv.Expected,
			Actual:   truncate(actual, 100),
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
		// Strict invariant failed → FAIL
		decision = "FAIL"
		passed = false
	} else if finalScore >= req.Threshold {
		// Score meets threshold → ACCEPT
		decision = "ACCEPT"
		passed = true
	} else if finalScore >= 0.5 {
		// Partial match → RETRY
		decision = "RETRY"
		passed = false
	} else {
		// Too low → FAIL
		decision = "FAIL"
		passed = false
	}

	// SCIENTIFIC CALCULATION (PAC-Learning / Hoeffding)
	n := float64(len(req.Invariants))
	if n == 0 {
		n = 1
	}
	delta := 0.05 // 95% Confidence
	pacBound := math.Sqrt(math.Log(1/delta) / (2 * n))
	sri := finalScore * (1 - pacBound)
	if sri < 0 {
		sri = 0
	}

	fidelity := "FRAGMENTED"
	if sri > 0.9 {
		fidelity = "CRYSTAL_CLEAR"
	} else if sri > 0.7 {
		fidelity = "HIGH_FIDELITY"
	} else if sri > 0.4 {
		fidelity = "SEMANTIC_NOISE"
	}

	return VerificationResult{
		ContextID:  req.ContextID,
		Score:      finalScore,
		Passed:     passed,
		Decision:   decision,
		Threshold:  req.Threshold,
		Failures:   failures,
		Evaluated:  results,
		LadderStep: req.LadderStep,
		SRI:        sri,
		PACBound:   pacBound,
		Fidelity:   fidelity,
	}
}

// evaluate checks a single invariant against the LLM response
func evaluate(inv Invariant, answer string) (score float64, reason string, actual string) {
	answerLower := strings.ToLower(strings.TrimSpace(answer))
	expectedLower := strings.ToLower(strings.TrimSpace(inv.Expected))

	// Extract the relevant portion of the answer (if structured)
	actual = extractRelevant(answerLower, inv.Prompt)

	// Exact match (expected is contained in answer)
	if strings.Contains(answerLower, expectedLower) {
		return 1.0, "exact_match", actual
	}

	// Semantic match: check for partial overlap or synonyms
	if semanticMatch(answerLower, expectedLower) {
		return 0.7, "semantic_match", actual
	}

	// Check for negation (contradiction)
	if containsNegation(answerLower, expectedLower) {
		return 0.0, "contradiction", actual
	}

	return 0.0, "mismatch", actual
}

// semanticMatch performs basic semantic similarity
// In production, replace with embedding cosine similarity
func semanticMatch(answer, expected string) bool {
	// Check word overlap
	expectedWords := strings.Fields(expected)
	matchCount := 0
	for _, word := range expectedWords {
		if len(word) > 3 && strings.Contains(answer, word) {
			matchCount++
		}
	}
	if len(expectedWords) > 0 && float64(matchCount)/float64(len(expectedWords)) >= 0.5 {
		return true
	}

	// Check for common synonyms/variations
	synonyms := map[string][]string{
		"yes":    {"sí", "correct", "true", "affirmative", "indeed"},
		"no":     {"false", "negative", "incorrect", "denied"},
		"python": {"py", "python3", "python 3"},
		"error":  {"bug", "issue", "problem", "fallo"},
	}

	for base, syns := range synonyms {
		if strings.Contains(expected, base) {
			for _, syn := range syns {
				if strings.Contains(answer, syn) {
					return true
				}
			}
		}
	}

	return false
}

// containsNegation checks if the answer contradicts the expected
func containsNegation(answer, expected string) bool {
	negators := []string{"no ", "not ", "never ", "cannot ", "don't ", "doesn't ", "isn't ", "aren't "}
	for _, neg := range negators {
		if strings.Contains(answer, neg+expected) {
			return true
		}
	}
	return false
}

// extractRelevant tries to find the answer portion relevant to the prompt
func extractRelevant(answer, prompt string) string {
	// Look for common answer patterns
	patterns := []string{": ", "= ", "es ", "is "}
	for _, p := range patterns {
		if idx := strings.Index(answer, p); idx != -1 && idx < 100 {
			return answer[idx+len(p):]
		}
	}
	return answer
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max] + "..."
}
