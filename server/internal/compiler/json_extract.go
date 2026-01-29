package compiler

import (
	"errors"
	"strings"
)

// ExtractFirstJSONObject finds the first balanced JSON object `{ ... }` in `s`.
// It is robust to:
// - Leading/trailing text
// - Markdown fences ```json ... ```
// - Braces inside quoted strings
// - Escaped quotes inside strings
func ExtractFirstJSONObject(s string) (string, error) {
	if s == "" {
		return "", errors.New("empty input")
	}

	trimmed := strings.TrimSpace(s)
	trimmed = strings.TrimPrefix(trimmed, "```json")
	trimmed = strings.TrimPrefix(trimmed, "```")
	trimmed = strings.TrimSuffix(trimmed, "```")
	trimmed = strings.TrimSpace(trimmed)

	start := strings.Index(trimmed, "{")
	if start < 0 {
		return "", errors.New("no '{' found")
	}

	inString := false
	escape := false
	depth := 0

	for i := start; i < len(trimmed); i++ {
		ch := trimmed[i]

		if inString {
			if escape {
				escape = false
				continue
			}
			if ch == '\\' {
				escape = true
				continue
			}
			if ch == '"' {
				inString = false
				continue
			}
			continue
		}

		if ch == '"' {
			inString = true
			continue
		}

		if ch == '{' {
			depth++
		} else if ch == '}' {
			depth--
			if depth == 0 {
				return trimmed[start : i+1], nil
			}
		}
	}

	return "", errors.New("unterminated json object")
}
