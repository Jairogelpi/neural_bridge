package compiler

import (
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
)

// Random UUID for IDs that must be unique per compile
func NewUUID() string {
	return uuid.NewString()
}

func NowISO() string {
	return time.Now().UTC().Format(time.RFC3339)
}

// Stable IDs derived from install_id for "no-login" bootstrap v1.
// (You can migrate later to real tenant/user identity.)
func DeriveTenantID(installID string) string {
	h := sha256.Sum256([]byte("tenant_v1:" + installID))
	return uuidFromHash(h[:])
}

func DeriveDeviceID(installID string) string {
	h := sha256.Sum256([]byte("device_v1:" + installID))
	return uuidFromHash(h[:])
}

func uuidFromHash(b []byte) string {
	// Use first 16 bytes as UUID-like. This is fine for stable identifiers.
	// Format as UUID v4-ish string for convenience.
	raw := hex.EncodeToString(b[:16])
	return raw[0:8] + "-" + raw[8:12] + "-" + raw[12:16] + "-" + raw[16:20] + "-" + raw[20:32]
}

// ShortHash creates a short 10-char hash
func ShortHash(s string) string {
	h := sha256.Sum256([]byte(s))
	return hex.EncodeToString(h[:])[:10]
}

