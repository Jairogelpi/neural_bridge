package providers

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"time"
)

type OpenAIProvider struct {
	APIKey  string
	Model   string
	BaseURL string
	HTTP    *HTTPClient
	Prices  *PriceBook
}

func NewOpenAIProvider() *OpenAIProvider {
	key := os.Getenv("OPENAI_API_KEY")
	model := os.Getenv("OPENAI_MODEL")
	base := os.Getenv("OPENAI_BASE_URL")
	return &OpenAIProvider{
		APIKey:  key,
		Model:   model,
		BaseURL: base,
		HTTP:    NewHTTPClient(20*time.Second, 1),
		Prices:  LoadPriceBook(),
	}
}

func (p *OpenAIProvider) Name() string { return "openai" }

func (p *OpenAIProvider) GenerateJSON(req JSONCall) (JSONResult, error) {
	if p.APIKey == "" {
		return JSONResult{}, errors.New("OPENAI_API_KEY missing")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	body := map[string]any{
		"model":       p.Model,
		"temperature": req.Temperature,
		"max_tokens":  req.MaxTokens,
		"messages": []map[string]any{
			{"role": "system", "content": "Return ONLY valid JSON. No markdown. No extra text."},
			{"role": "user", "content": req.Prompt},
		},
	}

	headers := map[string]string{
		"Authorization": "Bearer " + p.APIKey,
	}

	raw, _, err := p.HTTP.doJSON(ctx, "POST", p.BaseURL+"/chat/completions", headers, body)
	if err != nil {
		return JSONResult{}, err
	}

	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
		Usage *struct {
			PromptTokens     int `json:"prompt_tokens"`
			CompletionTokens int `json:"completion_tokens"`
			TotalTokens      int `json:"total_tokens"`
		} `json:"usage"`
	}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return JSONResult{}, err
	}
	if len(parsed.Choices) == 0 {
		return JSONResult{}, errors.New("openai: empty choices")
	}

	text := parsed.Choices[0].Message.Content
	inTok := 0
	outTok := 0
	if parsed.Usage != nil {
		inTok = parsed.Usage.PromptTokens
		outTok = parsed.Usage.CompletionTokens
	} else {
		inTok = approxTokens(req.Prompt)
		outTok = approxTokens(text)
	}

	// Real-time cost estimation
	cost := p.Prices.EstimateUSD("openai", p.Model, inTok, outTok)

	return JSONResult{
		Text:         text,
		ProviderName: "openai",
		Model:        p.Model,
		InputTokens:  inTok,
		OutputTokens: outTok,
		CostUSDEst:   cost,
	}, nil
}
