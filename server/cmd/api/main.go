package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"neural-bridge-backend/internal/api"
	"neural-bridge-backend/internal/cache"
	"neural-bridge-backend/internal/config"
	"neural-bridge-backend/internal/db"
	"neural-bridge-backend/internal/providers"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	database, err := db.Connect(ctx, cfg.PostgresURL)
	if err != nil {
		log.Fatalf("db connect: %v", err)
	}

	// Run migrations
	if err := db.RunMigrations(ctx, database.Pool, "internal/db/migrate.sql"); err != nil {
		log.Fatalf("migrate: %v", err)
	}

	// Redis
	_, redisErr := cache.Connect(cfg.RedisURL)
	if redisErr != nil {
		log.Printf("redis connect warning: %v (idempotency still works via postgres table)", redisErr)
	}

	// Providers: real if keys exist, else nil (or stub for dev)
	var openai providers.Provider
	var anthropic providers.Provider
	var google providers.Provider

	if cfg.OpenAIKey != "" {
		openai = providers.NewOpenAIProvider()
		log.Println("OpenAI provider initialized")
	}
	if cfg.AnthropicKey != "" {
		anthropic = providers.NewAnthropicProvider()
		log.Println("Anthropic provider initialized")
	}
	if cfg.GoogleKey != "" {
		google = providers.NewGoogleProvider()
		log.Println("Google provider initialized")
	}

	// If no keys in dev, fallback to stubs
	if openai == nil && anthropic == nil && google == nil && cfg.Env == "dev" {
		log.Println("No provider keys found, using stubs for dev")
		openai = providers.Stub{Provider: "openai", Model: "stub"}
		anthropic = providers.Stub{Provider: "anthropic", Model: "stub"}
		google = providers.Stub{Provider: "google", Model: "stub"}
	}

	pr := providers.Router{
		OpenAI:    openai,
		Anthropic: anthropic,
		Google:    google,
	}

	srv := api.NewServer(cfg, database, pr)

	addr := ":" + cfg.HTTPPort
	log.Printf("listening on %s env=%s", addr, cfg.Env)
	httpSrv := &http.Server{
		Addr:    addr,
		Handler: srv.Routes(),
	}

	if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Printf("server error: %v", err)
		os.Exit(1)
	}
}
