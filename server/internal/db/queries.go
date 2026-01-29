package db

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5"
)

func ExecSQL(ctx context.Context, pool interface {
	Exec(context.Context, string, ...any) (pgx.BatchResults, error)
}, sql string) error {
	_, err := pool.Exec(ctx, sql)
	return err
}

func UpsertTenantAndDevice(ctx context.Context, q pgx.Tx, tenantID, deviceID, installID string) error {
	_, err := q.Exec(ctx, `
		insert into tenants(tenant_id) values($1)
		on conflict (tenant_id) do nothing
	`, tenantID)
	if err != nil { return err }

	_, err = q.Exec(ctx, `
		insert into devices(device_id, tenant_id, install_id)
		values($1, $2, $3)
		on conflict (install_id) do update set last_seen_at = now()
	`, deviceID, tenantID, installID)
	return err
}

func InsertSession(ctx context.Context, q pgx.Tx, sessionID, tenantID, deviceID, tokenHash string, expiresAt string) error {
	_, err := q.Exec(ctx, `
		insert into sessions(session_id, tenant_id, device_id, session_token_hash, expires_at)
		values($1,$2,$3,$4,$5::timestamptz)
	`, sessionID, tenantID, deviceID, tokenHash, expiresAt)
	return err
}

func ValidateSessionTokenHash(ctx context.Context, pool interface{
	QueryRow(context.Context, string, ...any) pgx.Row
}, tokenHash string) (tenantID, deviceID string, ok bool, err error) {
	var t, d string
	var revoked *string
	err = pool.QueryRow(ctx, `
		select tenant_id::text, device_id::text, revoked_at::text
		from sessions
		where session_token_hash = $1
		  and expires_at > now()
		order by created_at desc
		limit 1
	`, tokenHash).Scan(&t, &d, &revoked)
	if err != nil {
		if err == pgx.ErrNoRows { return "", "", false, nil }
		return "", "", false, err
	}
	if revoked != nil && *revoked != "" {
		return "", "", false, nil
	}
	return t, d, true, nil
}

// Phase 6: Authorship & Reputation

type Author struct {
	AuthorID   string  `json:"author_id"`
	Name       string  `json:"name"`
	Handle     string  `json:"handle"`
	Tier       string  `json:"tier"`
	Reputation float64 `json:"reputation"`
	PublicKey  string  `json:"public_key"`
}

func GetAuthor(ctx context.Context, pool interface {
	QueryRow(context.Context, string, ...any) pgx.Row
}, authorID string) (*Author, error) {
	var a Author
	err := pool.QueryRow(ctx, `
		select author_id::text, name, handle, tier, reputation, public_key
		from authors where author_id = $1
	`, authorID).Scan(&a.AuthorID, &a.Name, &a.Handle, &a.Tier, &a.Reputation, &a.PublicKey)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func UpdateAuthorReputation(ctx context.Context, q pgx.Tx, authorID string, runID int64, delta float64, reason string) (float64, error) {
	var newRep float64
	// 1. Update and get new reputation
	err := q.QueryRow(ctx, `
		update authors
		set reputation = reputation + $1
		where author_id = $2
		returning reputation
	`, delta, authorID).Scan(&newRep)
	if err != nil { return 0, err }

	// 2. Log to ledger
	_, err = q.Exec(ctx, `
		insert into reputation_ledger(author_id, run_id, delta, new_reputation, reason)
		values($1, $2, $3, $4, $5)
	`, authorID, runID, delta, newRep, reason)
	
	return newRep, err
}

func InsertCrystalV2(ctx context.Context, q pgx.Tx, crystal map[string]any, tenantID, deviceID string, authorID *string, canonicalHash string, qualityScore float64) error {
	crystalJSON, _ := json.Marshal(crystal)
	
	authorUUID := interface{}(nil)
	if authorID != nil && *authorID != "" {
		authorUUID = *authorID
	}

	version := "1.0.0"
	if v, ok := crystal["version"].(string); ok { version = v }
	
	tier := "community"
	if t, ok := crystal["tier"].(string); ok { tier = t }

	_, err := q.Exec(ctx, `
		insert into crystals(context_id, tenant_id, device_id, author_id, scp_version, version, tier, canonical_hash, quality_score, compiler_version, crystal_jsonb)
		values($1::uuid, $2::uuid, $3::uuid, $4::uuid, $5, $6, $7, $8, $9, $10, $11::jsonb)
	`, crystal["context_id"], tenantID, deviceID, authorUUID, crystal["scp_version"], version, tier, canonicalHash, qualityScore, "compiler_v1", string(crystalJSON))
	return err
}
