package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"neural-bridge-backend/internal/api"
	"neural-bridge-backend/internal/cache"
	"neural-bridge-backend/internal/config"
	"neural-bridge-backend/internal/db"
	"neural-bridge-backend/internal/providers"
)

func main() {
	cfg := config.Load()
	cfg.Validate()

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

	// If no keys, fail (no mock data allowed)
	if openai == nil && anthropic == nil && google == nil {
		log.Fatalf("no provider API keys found; at least one real provider is required")
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
		Addr:         addr,
		Handler:      srv.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	// Channel to listen for signals
	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM)

	// Run server in a goroutine
	go func() {
		if err := httpSrv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	// Wait for shutdown signal
	<-shutdownChan
	log.Println("shutting down server...")

	// Graceful shutdown with 15s timeout
	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancelShutdown()

	if err := httpSrv.Shutdown(shutdownCtx); err != nil {
		log.Printf("graceful shutdown failed: %v", err)
	}

	log.Println("server stopped.")
}
