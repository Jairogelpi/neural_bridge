package compiler

type HostProfile struct {
	Platform string `json:"platform"`
	Capture struct {
		Strategy  string `json:"strategy"`
		MaxTurns  int    `json:"max_turns"`
		MaxChars  int    `json:"max_chars"`
	} `json:"capture"`
	Injection struct {
		InputMode string `json:"input_mode"`
		SendMode  string `json:"send_mode"`
	} `json:"injection"`
	Verification struct {
		Ladder          []string `json:"ladder"`
		MinChecks       int      `json:"min_checks"`
		AcceptThreshold float64  `json:"accept_threshold"`
		ResponseFormat  string   `json:"response_format"`
	} `json:"verification"`
}

func GetHostProfile(platform string, maxTurns, maxChars int, threshold float64) HostProfile {
	p := HostProfile{Platform: platform}
	p.Capture.Strategy = "dom"
	p.Capture.MaxTurns = maxTurns
	p.Capture.MaxChars = maxChars

	p.Injection.InputMode = "auto"
	p.Injection.SendMode = "auto"

	p.Verification.Ladder = []string{"compact", "redundant", "sectioned"}
	p.Verification.MinChecks = 8
	p.Verification.AcceptThreshold = threshold
	p.Verification.ResponseFormat = "json_only"

	switch platform {
	case "gemini":
		p.Capture.MaxChars = maxChars + 2000 // keeps existing logic relative to config
	case "claude":
		p.Verification.AcceptThreshold = threshold + 0.03
	}
	return p
}
