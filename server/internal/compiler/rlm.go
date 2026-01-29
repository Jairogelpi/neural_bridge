package compiler

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"neural-bridge-backend/internal/providers"
)

type CompilePolicy struct {
	Mode          providers.Mode `json:"mode"`
	MaxCalls      int            `json:"max_calls"`
	TokenBudget   int            `json:"token_budget"`
	MaxTokensCall int            `json:"max_tokens_per_call"`
}

type CompileOutput struct {
	Crystal       map[string]any       `json:"context_crystal"`
	Invariants    []any               `json:"invariants,omitempty"`
	Notes         []string            `json:"compiler_notes"`
	Cost          providers.JSONResult `json:"cost"`
	QualityScore  float64             `json:"quality_score"`
	CanonicalHash string              `json:"canonical_hash"`
}

func sliceTranscript(transcript map[string]any, maxChars int) string {
	turns, _ := transcript["turns"].([]any)
	if len(turns) == 0 {
		return ""
	}
	start := 0
	if len(turns) > 12 {
		start = len(turns) - 12
	}
	var b strings.Builder
	for i := start; i < len(turns); i++ {
		tm, _ := turns[i].(map[string]any)
		speaker, _ := tm["speaker"].(string)
		text, _ := tm["text"].(string)
		if strings.TrimSpace(text) == "" {
			continue
		}
		b.WriteString("[" + speaker + "] " + text + "\n\n")
	}
	s := b.String()
	if len(s) > maxChars {
		return s[len(s)-maxChars:]
	}
	return s
}

func parseJSONObj(s string) (map[string]any, error) {
	objStr, err := ExtractFirstJSONObject(s)
	if err != nil {
		return nil, err
	}

	var obj map[string]any
	if err := json.Unmarshal([]byte(objStr), &obj); err != nil {
		return nil, err
	}
	if len(obj) == 0 {
		return nil, errors.New("empty json object")
	}
	return obj, nil
}

func CompileRLM(router providers.Router, transcript map[string]any, policy CompilePolicy) (CompileOutput, error) {
	provs, err := router.PickOrder(policy.Mode)
	if err != nil {
		return CompileOutput{}, err
	}
	slice := sliceTranscript(transcript, 6500)
	if slice == "" {
		return CompileOutput{}, errors.New("empty transcript slice")
	}

	notes := []string{}

	// Accumulate costs across all LLM calls
	totalIn := 0
	totalOut := 0
	totalUSD := 0.0
	lastProvider := ""
	lastModel := ""

	callCount := 0
	var draft map[string]any

	// create
	for _, p := range provs {
		if callCount >= policy.MaxCalls {
			break
		}
		prompt := BuildCrystalizePrompt(slice, "create", "", "")
		res, e := p.GenerateJSON(providers.JSONCall{Prompt: prompt, MaxTokens: policy.MaxTokensCall, Temperature: 0})
		callCount++

		// Accumulate cost
		totalIn += res.InputTokens
		totalOut += res.OutputTokens
		totalUSD += res.CostUSDEst
		lastProvider = res.ProviderName
		lastModel = res.Model

		if e != nil {
			notes = append(notes, "create_error:"+p.Name())
			continue
		}
		obj, e := parseJSONObj(res.Text)
		if e != nil {
			notes = append(notes, "create_parse_fail:"+p.Name())
			continue
		}
		draft = obj
		notes = append(notes, "create_provider:"+p.Name())
		break
	}
	if draft == nil {
		return CompileOutput{}, errors.New("failed to create draft")
	}

	issues := ValidateDraft(draft)
	notes = append(notes, "quality_create:"+fmtF(issues.Quality))

	// repair loop
	for issues.Quality < 0.86 && callCount < policy.MaxCalls {
		issuesJSON, _ := json.Marshal(issues)
		cur, _ := json.Marshal(draft)

		p := provs[0] // v1: repair with first provider
		prompt := BuildCrystalizePrompt(slice, "repair", string(issuesJSON), string(cur))
		res, e := p.GenerateJSON(providers.JSONCall{Prompt: prompt, MaxTokens: policy.MaxTokensCall, Temperature: 0})
		callCount++

		// Accumulate cost
		totalIn += res.InputTokens
		totalOut += res.OutputTokens
		totalUSD += res.CostUSDEst
		lastProvider = res.ProviderName
		lastModel = res.Model

		if e != nil {
			notes = append(notes, "repair_error:"+p.Name())
			break
		}
		obj, e := parseJSONObj(res.Text)
		if e != nil {
			notes = append(notes, "repair_parse_fail:"+p.Name())
			break
		}
		draft = obj
		issues = ValidateDraft(draft)
		notes = append(notes, "quality_repair:"+fmtF(issues.Quality))
	}

	// finalize: attach SCP metadata + verification shell
	final := map[string]any{
		"scp_version": "1.0",
		"context_id":  NewUUID(),
		"created_at":  NowISO(),
		"source":      transcript["source"],

		"intent":      draft["intent"],
		"constraints": draft["constraints"],
		"state":       draft["state"],
		"entities":    draft["entities"],
		"evidence":    draft["evidence"],
		"decisions":   draft["decisions"],
		"verification": map[string]any{
			"canonical_hash":      "PENDING",
			"semantic_invariants": []any{},
			"policy": map[string]any{
				"min_checks":       8,
				"accept_threshold": 0.85,
				"max_retries":      2,
				"strategy":         "auto",
			},
		},
	}

	ch, err := CanonicalHash(final)
	if err != nil {
		return CompileOutput{}, err
	}
	final["verification"].(map[string]any)["canonical_hash"] = ch

	return CompileOutput{
		Crystal:    final,
		Invariants: []any{},
		Notes:      notes,
		Cost: providers.JSONResult{
			ProviderName: lastProvider,
			Model:        lastModel,
			InputTokens:  totalIn,
			OutputTokens: totalOut,
			CostUSDEst:   totalUSD,
		},
		QualityScore:  issues.Quality,
		CanonicalHash: ch,
	}, nil
}

func fmtF(x float64) string {
	return strings.TrimRight(strings.TrimRight(fmt.Sprintf("%.2f", x), "0"), ".")
}
