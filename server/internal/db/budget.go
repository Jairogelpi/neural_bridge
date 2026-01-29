package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// GetTenantPlan retrieves the plan tier for a tenant
func GetTenantPlan(ctx context.Context, pool *pgxpool.Pool, tenantID string) (string, error) {
	var plan string
	err := pool.QueryRow(ctx, `SELECT COALESCE(plan, 'free') FROM tenants WHERE tenant_id::text = $1`, tenantID).Scan(&plan)
	if err != nil {
		return "free", nil // default fallback
	}
	return plan, nil
}

// GetSpentUSDToday returns the total USD spent by a tenant today
func GetSpentUSDToday(ctx context.Context, pool *pgxpool.Pool, tenantID string) (float64, error) {
	var spent float64
	err := pool.QueryRow(ctx, `
		SELECT COALESCE(SUM(cost_usd_est), 0)
		FROM provider_cost_ledger
		WHERE tenant_id::text = $1 AND created_at::date = CURRENT_DATE
	`, tenantID).Scan(&spent)
	if err != nil {
		return 0, err
	}
	return spent, nil
}

// GetCompilesToday returns the number of compiles by a tenant today
func GetCompilesToday(ctx context.Context, pool *pgxpool.Pool, tenantID string) (int, error) {
	var count int
	err := pool.QueryRow(ctx, `
		SELECT COUNT(*)
		FROM crystals
		WHERE tenant_id::text = $1 AND created_at::date = CURRENT_DATE
	`, tenantID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}
