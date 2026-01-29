package providers

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

// ModelPrice represents pricing for a single model
type ModelPrice struct {
	InputPerToken  float64 `json:"input_per_token"`  // cost per token (not MTok)
	OutputPerToken float64 `json:"output_per_token"` // cost per token
}

// PriceBook holds all model prices with caching
type PriceBook struct {
	mu          sync.RWMutex
	models      map[string]ModelPrice // key: "provider/model"
	lastFetched time.Time
	cacheTTL    time.Duration
}

var globalPriceBook = &PriceBook{
	models:   make(map[string]ModelPrice),
	cacheTTL: 1 * time.Hour, // cache for 1 hour
}

// OpenRouter API response structure
type openRouterModelsResp struct {
	Data []struct {
		ID      string `json:"id"` // e.g. "openai/gpt-4o"
		Pricing struct {
			Prompt     string `json:"prompt"`     // cost per token as string
			Completion string `json:"completion"` // cost per token as string
		} `json:"pricing"`
	} `json:"data"`
}

// FetchFromOpenRouter fetches real-time pricing from OpenRouter API
func FetchFromOpenRouter() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", "https://openrouter.ai/api/v1/models", nil)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", "application/json")

	// Optional: add API key if you have one (not required for public endpoint)
	if key := os.Getenv("OPENROUTER_API_KEY"); key != "" {
		req.Header.Set("Authorization", "Bearer "+key)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return errors.New("openrouter api returned " + resp.Status)
	}

	var data openRouterModelsResp
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return err
	}

	globalPriceBook.mu.Lock()
	defer globalPriceBook.mu.Unlock()

	for _, m := range data.Data {
		promptPrice := parsePrice(m.Pricing.Prompt)
		compPrice := parsePrice(m.Pricing.Completion)
		if promptPrice > 0 || compPrice > 0 {
			globalPriceBook.models[m.ID] = ModelPrice{
				InputPerToken:  promptPrice,
				OutputPerToken: compPrice,
			}
		}
	}

	globalPriceBook.lastFetched = time.Now()
	log.Printf("pricing: fetched %d models from OpenRouter", len(data.Data))
	return nil
}

func parsePrice(s string) float64 {
	s = strings.TrimSpace(s)
	if s == "" || s == "0" {
		return 0
	}
	var f float64
	if err := json.Unmarshal([]byte(s), &f); err == nil {
		return f
	}
	return 0
}

// LoadPriceBook returns the global price book, fetching from OpenRouter if stale
func LoadPriceBook() *PriceBook {
	globalPriceBook.mu.RLock()
	stale := time.Since(globalPriceBook.lastFetched) > globalPriceBook.cacheTTL
	globalPriceBook.mu.RUnlock()

	if stale {
		// Fetch in background, non-blocking
		go func() {
			if err := FetchFromOpenRouter(); err != nil {
				log.Printf("pricing: failed to fetch from OpenRouter: %v (using defaults)", err)
				loadDefaults()
			}
		}()

		// If first load, block briefly
		globalPriceBook.mu.RLock()
		empty := len(globalPriceBook.models) == 0
		globalPriceBook.mu.RUnlock()
		if empty {
			_ = FetchFromOpenRouter()
			globalPriceBook.mu.RLock()
			if len(globalPriceBook.models) == 0 {
				globalPriceBook.mu.RUnlock()
				loadDefaults()
			} else {
				globalPriceBook.mu.RUnlock()
			}
		}
	}

	return globalPriceBook
}

func loadDefaults() {
	globalPriceBook.mu.Lock()
	defer globalPriceBook.mu.Unlock()

	// Fallback defaults (per-token, not MTok) from official pricing
	defaults := map[string]ModelPrice{
		// OpenAI
		"openai/gpt-4.1-mini":      {InputPerToken: 0.4e-6, OutputPerToken: 1.6e-6},
		"openai/gpt-4.1":           {InputPerToken: 2e-6, OutputPerToken: 8e-6},
		"openai/gpt-4o-mini":       {InputPerToken: 0.15e-6, OutputPerToken: 0.6e-6},
		"openai/gpt-4o":            {InputPerToken: 2.5e-6, OutputPerToken: 10e-6},
		// Anthropic
		"anthropic/claude-3.5-sonnet":        {InputPerToken: 3e-6, OutputPerToken: 15e-6},
		"anthropic/claude-3-5-sonnet-latest": {InputPerToken: 3e-6, OutputPerToken: 15e-6},
		"anthropic/claude-3.5-haiku":         {InputPerToken: 0.8e-6, OutputPerToken: 4e-6},
		// Google
		"google/gemini-1.5-flash": {InputPerToken: 0.075e-6, OutputPerToken: 0.3e-6},
		"google/gemini-1.5-pro":   {InputPerToken: 1.25e-6, OutputPerToken: 5e-6},
		"google/gemini-2.0-flash": {InputPerToken: 0.1e-6, OutputPerToken: 0.4e-6},
	}

	for k, v := range defaults {
		if _, exists := globalPriceBook.models[k]; !exists {
			globalPriceBook.models[k] = v
		}
	}
	globalPriceBook.lastFetched = time.Now()
	log.Println("pricing: loaded default fallback prices")
}

// EstimateUSD calculates cost for given tokens
func (pb *PriceBook) EstimateUSD(provider, model string, inTokens, outTokens int) float64 {
	pb.mu.RLock()
	defer pb.mu.RUnlock()

	// Try exact match first
	key := provider + "/" + model
	if p, ok := pb.models[key]; ok {
		return float64(inTokens)*p.InputPerToken + float64(outTokens)*p.OutputPerToken
	}

	// Try normalized/alias
	normalized := NormalizeModelKey(provider, model)
	if p, ok := pb.models[normalized]; ok {
		return float64(inTokens)*p.InputPerToken + float64(outTokens)*p.OutputPerToken
	}

	// Try partial match (model contains substring)
	for k, p := range pb.models {
		if strings.Contains(k, model) || strings.Contains(model, strings.Split(k, "/")[1]) {
			return float64(inTokens)*p.InputPerToken + float64(outTokens)*p.OutputPerToken
		}
	}

	return 0 // no match
}

// GetModelPrice returns the price for a specific model (for debugging/API)
func (pb *PriceBook) GetModelPrice(provider, model string) (ModelPrice, bool) {
	pb.mu.RLock()
	defer pb.mu.RUnlock()
	key := provider + "/" + model
	p, ok := pb.models[key]
	return p, ok
}

// NormalizeModelKey handles common aliases
func NormalizeModelKey(provider, model string) string {
	m := strings.TrimSpace(model)
	if m == "" {
		return ""
	}

	switch provider {
	case "anthropic":
		if strings.Contains(m, "sonnet") && strings.Contains(m, "3.5") {
			return "anthropic/claude-3.5-sonnet"
		}
		if strings.Contains(m, "sonnet") && strings.Contains(m, "3-5") {
			return "anthropic/claude-3.5-sonnet"
		}
		if strings.Contains(m, "haiku") {
			return "anthropic/claude-3.5-haiku"
		}
	case "google":
		if strings.Contains(m, "flash") && strings.Contains(m, "2.0") {
			return "google/gemini-2.0-flash"
		}
		if strings.Contains(m, "flash") {
			return "google/gemini-1.5-flash"
		}
		if strings.Contains(m, "pro") {
			return "google/gemini-1.5-pro"
		}
	case "openai":
		if m == "gpt-4.1-mini" || strings.Contains(m, "4.1-mini") {
			return "openai/gpt-4.1-mini"
		}
		if m == "gpt-4.1" {
			return "openai/gpt-4.1"
		}
		if strings.Contains(m, "4o-mini") {
			return "openai/gpt-4o-mini"
		}
		if strings.Contains(m, "4o") {
			return "openai/gpt-4o"
		}
	}

	return provider + "/" + m
}
