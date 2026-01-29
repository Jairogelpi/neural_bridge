package api

import (
	"context"
	"net/http"
	"strings"

	"neural-bridge-backend/internal/auth"
	"neural-bridge-backend/internal/db"
)

type CtxKey string

const (
	CtxTenantID CtxKey = "tenant_id"
	CtxDeviceID CtxKey = "device_id"
)

func WithAuth(signingKey []byte, database *db.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			h := r.Header.Get("Authorization")
			if h == "" || !strings.HasPrefix(h, "Bearer ") {
				Error(w, 401, "unauthorized", "missing bearer token", nil)
				return
			}
			token := strings.TrimPrefix(h, "Bearer ")
			claims, err := auth.ParseJWT(signingKey, token)
			if err != nil {
				Error(w, 401, "unauthorized", "invalid token", nil)
				return
			}

			tokenHash := auth.HashToken(token)
			tid, did, ok, err := db.ValidateSessionTokenHash(r.Context(), database.Pool, tokenHash)
			if err != nil {
				Error(w, 500, "db_error", "failed session validation", nil)
				return
			}
			if !ok || tid != claims.TenantID || did != claims.DeviceID {
				Error(w, 401, "unauthorized", "session not found or revoked", nil)
				return
			}

			ctx := context.WithValue(r.Context(), CtxTenantID, claims.TenantID)
			ctx = context.WithValue(ctx, CtxDeviceID, claims.DeviceID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func TenantID(r *http.Request) string {
	v, _ := r.Context().Value(CtxTenantID).(string)
	return v
}
func DeviceID(r *http.Request) string {
	v, _ := r.Context().Value(CtxDeviceID).(string)
	return v
}
