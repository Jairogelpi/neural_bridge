package verifier

import (
	"crypto/sha256"
	"encoding/hex"
	"math"
	"regexp"
	"sort"
	"strings"
)

// RefineInvariants normalizes, scores, deduplicates, and selects top-K invariants
func RefineInvariants(candidates []InvariantV2, targetK int) []InvariantV2 {
	if targetK <= 0 {
		targetK = 10
	}

	// 1) Normalize + score strength
	type scored struct {
		inv      InvariantV2
		strength float64
	}
	sc := []scored{}

	for _, c := range candidates {
		n := normalizeInvariant(c)
		s := strengthScore(n)
		if s < 0.55 {
			continue // discard weak invariants
		}

		// strict only if strongly testable
		if n.Strict && !isStronglyTestable(n.Expected.Type) {
			n.Strict = false
		}

		sc = append(sc, scored{inv: n, strength: s})
	}

	if len(sc) == 0 {
		return []InvariantV2{}
	}

	// 2) Sort by strength descending
	sort.Slice(sc, func(i, j int) bool { return sc[i].strength > sc[j].strength })

	// 3) Dedupe via Jaccard token similarity
	selected := []InvariantV2{}
	for _, item := range sc {
		dup := false
		for _, s := range selected {
			if jaccardSimilarity(tokenize(item.inv), tokenize(s)) > 0.72 {
				dup = true
				break
			}
		}
		if !dup {
			selected = append(selected, item.inv)
		}
		if len(selected) >= targetK {
			break
		}
	}

	// 4) Assign weights (sum to 1.0)
	sum := 0.0
	for i := range selected {
		w := 1.0
		if selected[i].Strict {
			w = 1.6
		}
		if isStronglyTestable(selected[i].Expected.Type) {
			w *= 1.2
		}
		selected[i].Weight = w
		sum += w
	}

	if sum > 0 {
		for i := range selected {
			selected[i].Weight = selected[i].Weight / sum
		}
	}

	// 5) Ensure stable IDs
	for i := range selected {
		if strings.TrimSpace(selected[i].ID) == "" {
			selected[i].ID = "inv_" + shortHashStr(selected[i].Prompt+"|"+expectedToString(selected[i].Expected))
		}
	}

	return selected
}

func normalizeInvariant(inv InvariantV2) InvariantV2 {
	inv.Kind = strings.ToLower(strings.TrimSpace(inv.Kind))
	inv.Prompt = strings.TrimSpace(inv.Prompt)
	inv.Rationale = strings.TrimSpace(inv.Rationale)
	inv.Expected.Type = strings.ToLower(strings.TrimSpace(inv.Expected.Type))

	// Normalize expected value based on type
	switch inv.Expected.Type {
	case "boolean":
		if s, ok := inv.Expected.Value.(string); ok {
			ls := strings.ToLower(strings.TrimSpace(s))
			inv.Expected.Value = (ls == "true" || ls == "yes" || ls == "sí" || ls == "si")
		}
	case "enum", "regex", "short_text":
		if s, ok := inv.Expected.Value.(string); ok {
			inv.Expected.Value = strings.TrimSpace(s)
		}
	case "set":
		if s, ok := inv.Expected.Value.(string); ok {
			parts := strings.Split(s, ",")
			out := []string{}
			for _, p := range parts {
				p = strings.TrimSpace(p)
				if p != "" {
					out = append(out, p)
				}
			}
			inv.Expected.Value = out
		}
	}

	return inv
}

func strengthScore(inv InvariantV2) float64 {
	// Testability (0.4 weight)
	testability := 0.2
	switch inv.Expected.Type {
	case "boolean", "enum", "set", "regex":
		testability = 1.0
	case "short_text":
		testability = 0.5
	}

	// Clarity based on prompt length (0.3 weight)
	clarity := 0.6
	l := len(inv.Prompt)
	if l >= 40 && l <= 140 {
		clarity = 1.0
	} else if l < 20 || l > 220 {
		clarity = 0.2
	}

	// Anchoring based on source tags (0.3 weight)
	anchoring := 0.7
	for _, t := range inv.Tags {
		if strings.Contains(t, "crystal.constraints") ||
			strings.Contains(t, "crystal.state") ||
			strings.Contains(t, "crystal.intent") {
			anchoring = 1.0
			break
		}
	}

	score := 0.4*testability + 0.3*clarity + 0.3*anchoring
	return math.Max(0, math.Min(1, score))
}

func isStronglyTestable(t string) bool {
	return t == "boolean" || t == "enum" || t == "set" || t == "regex"
}

func tokenize(inv InvariantV2) []string {
	s := strings.ToLower(inv.Prompt + " " + expectedToString(inv.Expected))
	re := regexp.MustCompile(`[a-z0-9áéíóúüñ]+`)
	return re.FindAllString(s, -1)
}

func jaccardSimilarity(a, b []string) float64 {
	if len(a) == 0 || len(b) == 0 {
		return 0
	}
	ma := map[string]bool{}
	for _, t := range a {
		ma[t] = true
	}
	mb := map[string]bool{}
	for _, t := range b {
		mb[t] = true
	}

	inter := 0
	for k := range ma {
		if mb[k] {
			inter++
		}
	}
	union := len(ma) + len(mb) - inter
	if union == 0 {
		return 0
	}
	return float64(inter) / float64(union)
}

func shortHashStr(s string) string {
	h := sha256.Sum256([]byte(s))
	return hex.EncodeToString(h[:])[:10]
}

func expectedToString(e Expected) string {
	switch v := e.Value.(type) {
	case string:
		return v
	case []string:
		return strings.Join(v, "|")
	case bool:
		if v {
			return "true"
		}
		return "false"
	case []any:
		parts := []string{}
		for _, x := range v {
			if s, ok := x.(string); ok {
				parts = append(parts, s)
			}
		}
		return strings.Join(parts, "|")
	default:
		return ""
	}
}
