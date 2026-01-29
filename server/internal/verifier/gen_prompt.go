package verifier

import "fmt"

// BuildInvariantsGenPrompt creates the LLM prompt for generating invariants
func BuildInvariantsGenPrompt(crystal map[string]any, kMin, kMax int) string {
	// Serialize crystal for context
	crystalStr := serializeForPrompt(crystal)

	return fmt.Sprintf(`INSTRUCCIONES (máxima prioridad):
- Devuelve SOLO JSON válido. Sin markdown. Sin texto extra.
- Genera entre %d y %d invariantes universales para verificar que un LLM destino ha asimilado el "Context Crystal".
- Los invariantes deben ser testables por texto en una respuesta.
- Evita prompts largos o ambiguos.
- Usa expected.type: boolean|enum|set|regex|short_text.
- Marca strict=true SOLO si la verificación puede ser inequívoca (boolean/enum/regex/set).
- Extrae invariantes de: intent, constraints, state, entities, decisions, mathematical_truths, theorems.
- IMPORTANTE: Para contenido matemático, preserva notación LaTeX y define invariantes que verifiquen la consistencia lógica/matemática.

INPUT CRYSTAL:
%s

OUTPUT JSON (array directamente, sin wrapper):
[
  {
    "id": "inv_...",
    "kind": "fact|constraint|objective|state|preference|boundary|mathematical_truth",
    "prompt": "Pregunta corta y clara para el LLM destino",
    "expected": {"type": "boolean|enum|set|regex|short_text", "value": ...},
    "weight": 0.0,
    "strict": true|false,
    "tags": ["source:crystal.X", "domain:universal"],
    "rationale": "Breve explicación de por qué importa"
  }
]`, kMin, kMax, crystalStr)
}

func serializeForPrompt(crystal map[string]any) string {
	// Extract key sections for the prompt
	sections := []string{}

	if intent, ok := crystal["intent"].(map[string]any); ok {
		sections = append(sections, fmt.Sprintf("INTENT: %v", intent))
	}

	if constraints, ok := crystal["constraints"].([]any); ok {
		sections = append(sections, fmt.Sprintf("CONSTRAINTS: %v", constraints))
	}

	if state, ok := crystal["state"].(map[string]any); ok {
		sections = append(sections, fmt.Sprintf("STATE: %v", state))
	}

	if entities, ok := crystal["entities"].([]any); ok {
		sections = append(sections, fmt.Sprintf("ENTITIES: %v", entities))
	}

	if decisions, ok := crystal["decisions"].([]any); ok {
		sections = append(sections, fmt.Sprintf("DECISIONS: %v", decisions))
	}

	if source, ok := crystal["source"].(map[string]any); ok {
		sections = append(sections, fmt.Sprintf("SOURCE: %v", source))
	}

	result := ""
	for _, s := range sections {
		result += s + "\n"
	}
	return result
}
