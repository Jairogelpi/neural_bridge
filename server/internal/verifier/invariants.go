package verifier

// Enhanced invariant types for industrial-grade verification

// Expected represents the expected value with type information
type Expected struct {
	Type  string `json:"type"`  // enum|set|regex|boolean|short_text
	Value any    `json:"value"` // string | []string | bool
}

// InvariantV2 is the enhanced invariant structure
type InvariantV2 struct {
	ID        string   `json:"id"`
	Kind      string   `json:"kind"` // fact|constraint|objective|state|preference|boundary
	Prompt    string   `json:"prompt"`
	Expected  Expected `json:"expected"`
	Weight    float64  `json:"weight"`
	Strict    bool     `json:"strict"`
	Tags      []string `json:"tags,omitempty"`
	Rationale string   `json:"rationale,omitempty"`
}

// LadderLevel represents the verification ladder escalation level
type LadderLevel string

const (
	LadderCompact    LadderLevel = "compact"
	LadderRedundant  LadderLevel = "redundant"
	LadderSectioned  LadderLevel = "sectioned"
)

// LadderAttempt records a single verification attempt
type LadderAttempt struct {
	Level          LadderLevel `json:"level"`
	AttemptIndex   int         `json:"attempt_index"`
	InjectedAt     string      `json:"injected_at"`
	RawText        string      `json:"raw_text"`
	ParsedJSON     any         `json:"parsed_json,omitempty"`
	ParseOK        bool        `json:"parse_ok"`
	Score          float64     `json:"score"`
	StrictFailures []string    `json:"strict_failures"`
	Decision       string      `json:"decision"` // ACCEPT|RETRY|FAIL
	Reason         string      `json:"reason"`
}

// Challenge is the verification prompt to inject into the target LLM
type Challenge struct {
	System string `json:"system"`
	User   string `json:"user"`
}

// GenerateInvariantsV2Request is the request for LLM-based invariant generation
type GenerateInvariantsV2Request struct {
	Crystal map[string]any `json:"crystal"`
	MinK    int            `json:"min_k"` // minimum invariants (default: 12)
	MaxK    int            `json:"max_k"` // maximum invariants (default: 20)
}

// GenerateInvariantsV2Response is the response from invariant generation
type GenerateInvariantsV2Response struct {
	Invariants      []InvariantV2 `json:"invariants"`
	Challenge       Challenge     `json:"challenge"`
	Cost            any           `json:"cost,omitempty"`
	GeneratedCount  int           `json:"generated_count"`
	RefinedCount    int           `json:"refined_count"`
}
