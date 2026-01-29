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

func GetHostProfile(platform string) HostProfile {
	p := HostProfile{Platform: platform}
	p.Capture.Strategy = "dom"
	p.Capture.MaxTurns = 60
	p.Capture.MaxChars = 12000

	p.Injection.InputMode = "auto"
	p.Injection.SendMode = "auto"

	p.Verification.Ladder = []string{"compact", "redundant", "sectioned"}
	p.Verification.MinChecks = 8
	p.Verification.AcceptThreshold = 0.85
	p.Verification.ResponseFormat = "json_only"

	switch platform {
	case "gemini":
		p.Capture.MaxChars = 14000
	case "claude":
		p.Verification.AcceptThreshold = 0.88
	}
	return p
}
