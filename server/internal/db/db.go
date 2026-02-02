package db

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	Pool *pgxpool.Pool
}

func Connect(ctx context.Context, postgresURL string) (*DB, error) {
	if postgresURL == "" {
		return nil, errors.New("DATABASE_URL is required")
	}

	var pool *pgxpool.Pool
	var err error

	// Retry connection for up to 5 times (useful in containerized environments)
	for i := 0; i < 5; i++ {
		pool, err = pgxpool.New(ctx, postgresURL)
		if err == nil {
			if err = pool.Ping(ctx); err == nil {
				return &DB{Pool: pool}, nil
			}
		}
		
		fmt.Printf("Database connection failed (attempt %d/5): %v. Retrying in 2s...\n", i+1, err)
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(2 * time.Second):
		}
	}

	return nil, fmt.Errorf("failed to connect to database after 5 attempts: %w", err)
}
