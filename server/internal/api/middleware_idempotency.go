package api

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"neural-bridge-backend/internal/db"
)

func WithIdempotency(database *db.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only for POST /v1/compile
			if r.Method != "POST" || r.URL.Path != "/v1/compile" {
				next.ServeHTTP(w, r)
				return
			}

			idemKey := r.Header.Get("Idempotency-Key")
			if idemKey == "" {
				Error(w, 400, "missing_idempotency_key", "Idempotency-Key header required", nil)
				return
			}

			tenantID := TenantID(r)
			deviceID := DeviceID(r)

			// Try to serve stored response
			var respJSON []byte
			err := database.Pool.QueryRow(r.Context(), `
				select response_json::text
				from idempotency
				where tenant_id::text = $1 and device_id::text = $2 and idem_key = $3
			`, tenantID, deviceID, idemKey).Scan(&respJSON)

			if err == nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(200)
				_, _ = w.Write(respJSON)
				return
			}

			rec := &captureWriter{ResponseWriter: w, buf: &bytes.Buffer{}}
			next.ServeHTTP(rec, r)

			if rec.status >= 200 && rec.status < 300 && rec.buf.Len() > 0 {
				_ = withTx(r, database, func(tx pgx.Tx) error {
					_, e := tx.Exec(r.Context(), `
						insert into idempotency(tenant_id, device_id, idem_key, response_json)
						values($1::uuid, $2::uuid, $3, $4::jsonb)
						on conflict (tenant_id, device_id, idem_key) do nothing
					`, tenantID, deviceID, idemKey, rec.buf.String())
					return e
				})
			}
		})
	}
}

type captureWriter struct {
	http.ResponseWriter
	status int
	buf    *bytes.Buffer
}

func (c *captureWriter) WriteHeader(status int) {
	c.status = status
	c.ResponseWriter.WriteHeader(status)
}

func (c *captureWriter) Write(b []byte) (int, error) {
	if c.status == 0 {
		c.status = 200
	}
	if json.Valid(b) {
		_, _ = c.buf.Write(b)
	}
	return c.ResponseWriter.Write(b)
}

func withTx(r *http.Request, database *db.DB, fn func(pgx.Tx) error) error {
	tx, err := database.Pool.Begin(r.Context())
	if err != nil { return err }
	defer func() { _ = tx.Rollback(r.Context()) }()
	if err := fn(tx); err != nil { return err }
	return tx.Commit(r.Context())
}
