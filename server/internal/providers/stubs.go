package providers

import "encoding/json"

type Stub struct {
	Provider string
	Model    string
}

func (s Stub) Name() string { return s.Provider }

func (s Stub) GenerateJSON(req JSONCall) (JSONResult, error) {
	out := map[string]any{
		"intent": map[string]any{"primary": "Continuar con el trabajo manteniendo el contexto", "status": "active"},
		"constraints": []any{},
		"state": map[string]any{
			"summary": "Estado compilado por backend (stub).",
			"open_items": []any{},
			"next_actions": []any{"Continuar"},
		},
		"entities":  []any{},
		"evidence":  []any{},
		"decisions": []any{},
	}
	b, _ := json.Marshal(out)
	return JSONResult{
		Text:         string(b),
		ProviderName: s.Provider,
		Model:        s.Model,
		InputTokens:  200,
		OutputTokens: 120,
		CostUSDEst:   0.0001,
	}, nil
}
