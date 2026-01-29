package verifier

import (
	"fmt"
)

// GenerateInvariants creates semantic invariants from a Crystal
// This is the automated extraction of verifiable properties
func GenerateInvariants(crystal map[string]any) []Invariant {
	invariants := []Invariant{}
	invCount := 0

	// Extract from intent
	if intent, ok := crystal["intent"].(map[string]any); ok {
		if primary, ok := intent["primary"].(string); ok && primary != "" {
			invCount++
			invariants = append(invariants, Invariant{
				ID:       fmt.Sprintf("inv_intent_%d", invCount),
				Type:     InvariantTypeIntent,
				Prompt:   "¿Cuál es el objetivo principal del trabajo actual?",
				Expected: primary,
				Weight:   0.25,
				Strict:   false,
			})
		}
	}

	// Extract from constraints
	if constraints, ok := crystal["constraints"].([]any); ok {
		for i, c := range constraints {
			if constraint, ok := c.(map[string]any); ok {
				desc, _ := constraint["description"].(string)
				if desc != "" {
					invCount++
					invariants = append(invariants, Invariant{
						ID:       fmt.Sprintf("inv_constraint_%d", i+1),
						Type:     InvariantTypeConstraint,
						Prompt:   fmt.Sprintf("¿Se aplica la restricción: %s?", desc),
						Expected: "sí",
						Weight:   0.2,
						Strict:   true, // Constraints are strict
					})
				}
			}
		}
	}

	// Extract from state
	if state, ok := crystal["state"].(map[string]any); ok {
		if summary, ok := state["summary"].(string); ok && summary != "" {
			invCount++
			invariants = append(invariants, Invariant{
				ID:       fmt.Sprintf("inv_state_%d", invCount),
				Type:     InvariantTypeState,
				Prompt:   "¿Cuál es el estado actual del trabajo?",
				Expected: summary,
				Weight:   0.15,
				Strict:   false,
			})
		}
	}

	// Extract key entities as facts
	if entities, ok := crystal["entities"].([]any); ok {
		for i, e := range entities {
			if i >= 3 {
				break // Limit to top 3 entities
			}
			if entity, ok := e.(map[string]any); ok {
				name, _ := entity["name"].(string)
				etype, _ := entity["type"].(string)
				if name != "" && etype != "" {
					invCount++
					invariants = append(invariants, Invariant{
						ID:       fmt.Sprintf("inv_fact_%d", i+1),
						Type:     InvariantTypeFact,
						Prompt:   fmt.Sprintf("¿Qué es %s en el contexto actual?", name),
						Expected: etype,
						Weight:   0.1,
						Strict:   false,
					})
				}
			}
		}
	}

	// Extract from decisions (consistency check)
	if decisions, ok := crystal["decisions"].([]any); ok {
		for i, d := range decisions {
			if i >= 2 {
				break // Limit to 2 decisions
			}
			if decision, ok := d.(map[string]any); ok {
				what, _ := decision["what"].(string)
				if what != "" {
					invCount++
					invariants = append(invariants, Invariant{
						ID:       fmt.Sprintf("inv_consistency_%d", i+1),
						Type:     InvariantTypeConsistency,
						Prompt:   fmt.Sprintf("¿Se mantiene la decisión: %s?", what),
						Expected: "sí",
						Weight:   0.15,
						Strict:   false,
					})
				}
			}
		}
	}

	// Add a general context check
	if source, ok := crystal["source"].(map[string]any); ok {
		if platform, ok := source["platform"].(string); ok && platform != "" {
			invariants = append(invariants, Invariant{
				ID:       "inv_platform",
				Type:     InvariantTypeFact,
				Prompt:   "¿En qué plataforma se originó este contexto?",
				Expected: platform,
				Weight:   0.05,
				Strict:   false,
			})
		}
	}

	// Normalize weights to sum to 1.0
	totalWeight := 0.0
	for _, inv := range invariants {
		totalWeight += inv.Weight
	}
	if totalWeight > 0 && totalWeight != 1.0 {
		for i := range invariants {
			invariants[i].Weight = invariants[i].Weight / totalWeight
		}
	}

	return invariants
}

// GenerateVerificationPrompt creates the prompt to inject into the target LLM
func GenerateVerificationPrompt(invariants []Invariant) string {
	prompt := `Responde en JSON exacto. Para cada pregunta, da la respuesta más concisa posible.

{
`
	for i, inv := range invariants {
		comma := ","
		if i == len(invariants)-1 {
			comma = ""
		}
		prompt += fmt.Sprintf(`  "%s": "[tu respuesta]"%s
`, inv.ID, comma)
	}
	prompt += `}

Preguntas:
`
	for _, inv := range invariants {
		prompt += fmt.Sprintf("- %s: %s\n", inv.ID, inv.Prompt)
	}

	return prompt
}
