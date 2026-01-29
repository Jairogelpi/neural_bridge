package providers

import (
	"context"
	"encoding/json"
	"errors"
	"os"
	"time"
)

type GoogleProvider struct {
	APIKey  string
	Model   string
	BaseURL string
	HTTP    *HTTPClient
	Prices  *PriceBook
}

func NewGoogleProvider() *GoogleProvider {
	key := os.Getenv("GOOGLE_API_KEY")
	model := os.Getenv("GOOGLE_MODEL")
	if model == "" {
		model = "gemini-1.5-flash"
	}
	base := os.Getenv("GOOGLE_BASE_URL")
	if base == "" {
		base = "https://generativelanguage.googleapis.com/v1beta"
	}
	return &GoogleProvider{
		APIKey:  key,
		Model:   model,
		BaseURL: base,
		HTTP:    NewHTTPClient(20*time.Second, 1),
		Prices:  LoadPriceBook(),
	}
}

func (p *GoogleProvider) Name() string { return "google" }

func (p *GoogleProvider) GenerateJSON(req JSONCall) (JSONResult, error) {
	if p.APIKey == "" {
		return JSONResult{}, errors.New("GOOGLE_API_KEY missing")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	body := map[string]any{
		"contents": []map[string]any{
			{
				"role": "user",
				"parts": []map[string]any{
					{"text": "Return ONLY valid JSON. No markdown. No extra text.\n\n" + req.Prompt},
				},
			},
		},
		"generationConfig": map[string]any{
			"temperature":     req.Temperature,
			"maxOutputTokens": req.MaxTokens,
		},
	}

	url := p.BaseURL + "/models/" + p.Model + ":generateContent?key=" + p.APIKey

	raw, _, err := p.HTTP.doJSON(ctx, "POST", url, map[string]string{}, body)
	if err != nil {
		return JSONResult{}, err
	}

	var parsed struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
		UsageMetadata *struct {
			PromptTokenCount     int `json:"promptTokenCount"`
			CandidatesTokenCount int `json:"candidatesTokenCount"`
			TotalTokenCount      int `json:"totalTokenCount"`
		} `json:"usageMetadata"`
	}
	if err := json.Unmarshal(raw, &parsed); err != nil {
		return JSONResult{}, err
	}
	if len(parsed.Candidates) == 0 {
		return JSONResult{}, errors.New("google: empty candidates")
	}
	text := ""
	for _, part := range parsed.Candidates[0].Content.Parts {
		text += part.Text
	}
	if text == "" {
		return JSONResult{}, errors.New("google: empty text")
	}

	inTok := 0
	outTok := 0
	if parsed.UsageMetadata != nil {
		inTok = parsed.UsageMetadata.PromptTokenCount
		outTok = parsed.UsageMetadata.CandidatesTokenCount
	} else {
		inTok = approxTokens(req.Prompt)
		outTok = approxTokens(text)
	}

	// Real-time cost estimation
	cost := p.Prices.EstimateUSD("google", p.Model, inTok, outTok)

	return JSONResult{
		Text:         text,
		ProviderName: "google",
		Model:        p.Model,
		InputTokens:  inTok,
		OutputTokens: outTok,
		CostUSDEst:   cost,
	}, nil
}
