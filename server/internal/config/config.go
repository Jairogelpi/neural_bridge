package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Env string

	HTTPPort string

	PostgresURL string
	RedisURL    string

	JWTSigningKey string
	JWTTTL        time.Duration

	// Compile policy defaults (server-side guardrails)
	DefaultMaxCalls       int
	DefaultTokenBudget    int
	DefaultMaxTokensCall  int
	DefaultStoreTranscript bool
	DefaultTranscriptTTLH int

	// Provider keys (optional; set when wiring real providers)
	OpenAIKey    string
	AnthropicKey string
	GoogleKey    string
}

func getEnv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}

func getEnvInt(key string, def int) int {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return def
	}
	return n
}

func getEnvBool(key string, def bool) bool {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	if v == "1" || v == "true" || v == "TRUE" {
		return true
	}
	if v == "0" || v == "false" || v == "FALSE" {
		return false
	}
	return def
}

func getEnvDur(key string, def time.Duration) time.Duration {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	d, err := time.ParseDuration(v)
	if err != nil {
		return def
	}
	return d
}

func Load() Config {
	return Config{
		Env:      getEnv("ENV", "dev"),
		HTTPPort: getEnv("PORT", "8080"),

		PostgresURL: getEnv("DATABASE_URL", ""),
		RedisURL:    getEnv("REDIS_URL", ""),

		JWTSigningKey: getEnv("JWT_SIGNING_KEY", "dev-insecure-change-me"),
		JWTTTL:        getEnvDur("JWT_TTL", 24*time.Hour),

		DefaultMaxCalls:        getEnvInt("DEFAULT_MAX_CALLS", 2),
		DefaultTokenBudget:     getEnvInt("DEFAULT_TOKEN_BUDGET", 2000),
		DefaultMaxTokensCall:   getEnvInt("DEFAULT_MAX_TOKENS_PER_CALL", 1200),
		DefaultStoreTranscript: getEnvBool("DEFAULT_STORE_TRANSCRIPT", false),
		DefaultTranscriptTTLH:  getEnvInt("DEFAULT_TRANSCRIPT_TTL_HOURS", 24),

		// Permite usar OpenRouter como proveedor OpenAI-compatible
		OpenAIKey:    getEnv("OPENAI_API_KEY", os.Getenv("OPENROUTER_API_KEY")),
		AnthropicKey: os.Getenv("ANTHROPIC_API_KEY"),
		GoogleKey:    os.Getenv("GOOGLE_API_KEY"),
	}
}
