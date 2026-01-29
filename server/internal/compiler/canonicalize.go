package compiler

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"sort"
)

func stableJSON(v any) ([]byte, error) {
	switch t := v.(type) {
	case map[string]any:
		keys := make([]string, 0, len(t))
		for k := range t { keys = append(keys, k) }
		sort.Strings(keys)
		out := make(map[string]any, len(t))
		for _, k := range keys { out[k] = t[k] }
		b, err := json.Marshal(out)
		if err != nil { return nil, err }
		var again any
		if err := json.Unmarshal(b, &again); err != nil { return nil, err }
		return stableJSON(again)
	case []any:
		arr := make([]any, len(t))
		for i := range t { arr[i] = t[i] }
		b, err := json.Marshal(arr)
		return b, err
	default:
		return json.Marshal(v)
	}
}

func CanonicalHash(crystal any) (string, error) {
	b, err := stableJSON(crystal)
	if err != nil { return "", err }
	h := sha256.Sum256(b)
	return hex.EncodeToString(h[:]), nil
}
