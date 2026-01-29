package verifier

// InvariantType defines the category of semantic check
type InvariantType string

const (
	InvariantTypeFact        InvariantType = "fact"        // Concrete data points
	InvariantTypeConstraint  InvariantType = "constraint"  // Active restrictions
	InvariantTypeState       InvariantType = "state"       // Current context state
	InvariantTypeIntent      InvariantType = "intent"      // Goal/objective
	InvariantTypeConsistency InvariantType = "consistency" // No contradictions
)

// Invariant represents a single verifiable semantic property
type Invariant struct {
	ID       string        `json:"id"`
	Type     InvariantType `json:"type"`
	Prompt   string        `json:"prompt"`   // Question to ask LLM
	Expected string        `json:"expected"` // Expected answer (or substring)
	Weight   float64       `json:"weight"`   // Importance (0-1)
	Strict   bool          `json:"strict"`   // If true, failure = immediate reject
}

// InvariantResult captures the evaluation of a single invariant
type InvariantResult struct {
	ID       string  `json:"id"`
	Type     string  `json:"type"`
	Score    float64 `json:"score"`    // 0.0, 0.7, or 1.0
	Reason   string  `json:"reason"`   // exact_match, semantic_match, mismatch
	Expected string  `json:"expected"` // What we expected
	Actual   string  `json:"actual"`   // What we got (truncated)
}

// VerificationResult is the complete verification outcome
type VerificationResult struct {
	ContextID  string            `json:"context_id"`
	Score      float64           `json:"score"`      // Weighted average (0-1)
	Passed     bool              `json:"passed"`     // Score >= threshold && no strict failures
	Decision   string            `json:"decision"`   // ACCEPT, RETRY, FAIL
	Threshold  float64           `json:"threshold"`  // The threshold used
	Failures   []string          `json:"failures"`   // IDs of strict invariants that failed
	Evaluated  []InvariantResult `json:"evaluated"`  // Full breakdown
	LadderStep int               `json:"ladder_step"` // Which retry attempt (0 = first)
	
	// Scientific Metrics (PAC-Learning)
	SRI        float64           `json:"sri"`         // Semantic Reliability Index (0-1)
	PACBound   float64           `json:"pac_bound"`   // Statistical error bound (Hoeffding)
	Fidelity   string            `json:"fidelity"`    // Qualitative label (e.g., "CRYSTAL_CLEAR")
}

// VerifyRequest is the input for verification
type VerifyRequest struct {
	ContextID   string      `json:"context_id"`
	Invariants  []Invariant `json:"invariants"`
	LLMResponse string      `json:"llm_response"`
	Threshold   float64     `json:"threshold"`   // Default: 0.85
	LadderStep  int         `json:"ladder_step"` // Current retry count
}
