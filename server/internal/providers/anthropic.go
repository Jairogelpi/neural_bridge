package providers

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"time"
)

type AnthropicProvider struct {
	APIKey  string
	Model   string
	BaseURL string
	HTTP    *HTTPClient
	Prices  *PriceBook
}

func NewAnthropicProvider() *AnthropicProvider {
	key := os.Getenv("ANTHROPIC_API_KEY")
	model := os.Getenv("ANTHROPIC_MODEL")
	base := os.Getenv("ANTHROPIC_BASE_URL")
	return &AnthropicProvider{
		APIKey:  key,
		Model:   model,
		BaseURL: base,
		HTTP:    NewHTTPClient(20*time.Second, 1),
		Prices:  LoadPriceBook(),
	}
}

func (p *AnthropicProvider) Name() string { return "anthropic" }

func (p *AnthropicProvider) GenerateJSON(req JSONCall) (JSONResult, error) {
	if p.APIKey == "" {
		return JSONResult{}, errors.New("ANTHROPIC_API_KEY missing")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	body := map[string]any{
		"model":       p.Model,
		"max_tokens":  req.MaxTokens,
		"temperature": req.Temperature,
		"system":      "Return ONLY valid JSON. No markdown. No extra text.",
		"messages": []map[string]any{
			{"role": "user", "content": req.Prompt},
		},
	}

	headers := map[string]string{
		"x-api-key":         p.APIKey,
		"anthropic-version": "2023-06-01",
	}

	raw, _, err := p.HTTP.doJSON(ctx, "POST", p.BaseURL+"/messages", headers, body)
	if err != nil {
		return JSONResult{}, err
	}

	var parsed struct {
		Content []struct {
			Type string `json:"type"`
			Text string `json:"text"`
		} `json:"content"`
		Usage *struct {
			InputTokens  int `json:"input_tokens"`
			OutputTokens int `json:"output_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return JSONResult{}, err
	}

	text := ""
	for _, c := range parsed.Content {
		if c.Type == "text" {
			text += c.Text
		}
	}
	if text == "" {
		return JSONResult{}, errors.New("anthropic: empty text")
	}

	inTok := 0
	outTok := 0
	if parsed.Usage != nil {
		inTok = parsed.Usage.InputTokens
		outTok = parsed.Usage.OutputTokens
	} else {
		inTok = approxTokens(req.Prompt)
		outTok = approxTokens(text)
	}

	// Real-time cost estimation
	cost := p.Prices.EstimateUSD("anthropic", p.Model, inTok, outTok)

	return JSONResult{
		Text:         text,
		ProviderName: "anthropic",
		Model:        p.Model,
		InputTokens:  inTok,
		OutputTokens: outTok,
		CostUSDEst:   cost,
	}, nil
}
