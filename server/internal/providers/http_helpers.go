package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"time"
)

type HTTPClient struct {
	Client  *http.Client
	Retries int
}

func NewHTTPClient(timeout time.Duration, retries int) *HTTPClient {
	return &HTTPClient{
		Client:  &http.Client{Timeout: timeout},
		Retries: retries,
	}
}

func (c *HTTPClient) doJSON(ctx context.Context, method, url string, headers map[string]string, body any) ([]byte, int, error) {
	var payload []byte
	if body != nil {
		b, err := json.Marshal(body)
		if err != nil {
			return nil, 0, err
		}
		payload = b
	} else {
		payload = []byte("{}")
	}

	var lastErr error
	for attempt := 0; attempt <= c.Retries; attempt++ {
		req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewReader(payload))
		if err != nil {
			return nil, 0, err
		}
		req.Header.Set("Content-Type", "application/json")
		for k, v := range headers {
			req.Header.Set(k, v)
		}

		resp, err := c.Client.Do(req)
		if err != nil {
			lastErr = err
			continue
		}
		defer resp.Body.Close()

		data, _ := io.ReadAll(resp.Body)
		if resp.StatusCode >= 200 && resp.StatusCode < 300 {
			return data, resp.StatusCode, nil
		}

		// Retry on 429/5xx
		if resp.StatusCode == 429 || resp.StatusCode >= 500 {
			lastErr = errors.New(string(data))
			time.Sleep(time.Duration(200*(attempt+1)) * time.Millisecond)
			continue
		}

		return nil, resp.StatusCode, errors.New(string(data))
	}
	return nil, 0, lastErr
}

func approxTokens(s string) int {
	// rough: 1 token ~ 4 chars
	if s == "" {
		return 0
	}
	return (len(s) + 3) / 4
}
