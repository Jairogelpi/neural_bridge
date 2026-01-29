package cache

import (
	"context"
	"errors"
	"net/url"
	"time"

	"github.com/redis/go-redis/v9"
)

type Redis struct {
	Client *redis.Client
}

func Connect(redisURL string) (*Redis, error) {
	if redisURL == "" {
		return nil, errors.New("REDIS_URL is required")
	}
	u, err := url.Parse(redisURL)
	if err != nil {
		return nil, err
	}

	opt := &redis.Options{
		Addr: u.Host,
	}
	if u.User != nil {
		pw, _ := u.User.Password()
		opt.Password = pw
	}

	cli := redis.NewClient(opt)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := cli.Ping(ctx).Err(); err != nil {
		return nil, err
	}
	return &Redis{Client: cli}, nil
}
