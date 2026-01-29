package compiler

type DraftIssues struct {
	Missing  []string `json:"missing"`
	Warnings []string `json:"warnings"`
	Quality  float64  `json:"quality"`
	TooLarge bool     `json:"too_large"`
}

func ValidateDraft(d map[string]any) DraftIssues {
	missing := []string{}
	warnings := []string{}

	intent, _ := d["intent"].(map[string]any)
	if intent == nil || intent["primary"] == nil || intent["primary"] == "" {
		missing = append(missing, "intent.primary")
	}
	state, _ := d["state"].(map[string]any)
	if state == nil || state["summary"] == nil || state["summary"] == "" {
		missing = append(missing, "state.summary")
	}
	if state == nil || state["next_actions"] == nil {
		missing = append(missing, "state.next_actions")
	}

	if _, ok := d["constraints"].([]any); !ok { warnings = append(warnings, "constraints_not_array") }
	if _, ok := d["entities"].([]any); !ok { warnings = append(warnings, "entities_not_array") }
	if _, ok := d["evidence"].([]any); !ok { warnings = append(warnings, "evidence_not_array") }

	q := 1.0
	q -= float64(len(missing)) * 0.2
	q -= float64(len(warnings)) * 0.06
	if q < 0 { q = 0 }
	if q > 1 { q = 1 }

	return DraftIssues{Missing: missing, Warnings: warnings, Quality: q, TooLarge: false}
}
