package db

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// DashboardSummary contains KPIs for the dashboard
type DashboardSummary struct {
	Days int `json:"days"`

	BridgesTotal int     `json:"bridges_total"`
	SuccessRate  float64 `json:"success_rate"`
	CostTotalUSD float64 `json:"cost_total_usd"`
	CostAvgUSD   float64 `json:"cost_avg_usd"`

	ByHost   map[string]any `json:"by_host"`
	ByLadder map[string]any `json:"by_ladder"`
}

// GetDashboardSummary returns KPIs for the given tenant and time period
func GetDashboardSummary(ctx context.Context, pool *pgxpool.Pool, tenantID string, days int) (DashboardSummary, error) {
	since := time.Now().AddDate(0, 0, -days)

	var total int
	var accepted int
	var cost float64

	err := pool.QueryRow(ctx, `
		select
		  count(*)::int as total,
		  count(*) filter (where decision='ACCEPT')::int as accepted,
		  coalesce(sum(cost_usd_est),0) as cost
		from bridge_runs
		where tenant_id::text=$1 and created_at >= $2
	`, tenantID, since).Scan(&total, &accepted, &cost)
	if err != nil {
		return DashboardSummary{}, err
	}

	successRate := 0.0
	if total > 0 {
		successRate = float64(accepted) / float64(total)
	}

	// By host breakdown
	byHost := map[string]any{}
	rows, err := pool.Query(ctx, `
		select target_host, count(*)::int, coalesce(avg(score),0)
		from bridge_runs
		where tenant_id::text=$1 and created_at >= $2
		group by target_host
		order by count(*) desc
	`, tenantID, since)
	if err != nil {
		return DashboardSummary{}, err
	}
	defer rows.Close()
	for rows.Next() {
		var host string
		var c int
		var avgScore float64
		_ = rows.Scan(&host, &c, &avgScore)
		byHost[host] = map[string]any{"count": c, "avg_score": avgScore}
	}

	// By ladder level breakdown
	byLadder := map[string]any{}
	rows2, err := pool.Query(ctx, `
		select coalesce(ladder_last_level,'unknown') as lvl, count(*)::int, coalesce(avg(score),0)
		from bridge_runs
		where tenant_id::text=$1 and created_at >= $2
		group by lvl
		order by count(*) desc
	`, tenantID, since)
	if err != nil {
		return DashboardSummary{}, err
	}
	defer rows2.Close()
	for rows2.Next() {
		var lvl string
		var c int
		var avgScore float64
		_ = rows2.Scan(&lvl, &c, &avgScore)
		byLadder[lvl] = map[string]any{"count": c, "avg_score": avgScore}
	}

	avg := 0.0
	if total > 0 {
		avg = cost / float64(total)
	}

	return DashboardSummary{
		Days:         days,
		BridgesTotal: total,
		SuccessRate:  successRate,
		CostTotalUSD: cost,
		CostAvgUSD:   avg,
		ByHost:       byHost,
		ByLadder:     byLadder,
	}, nil
}

// BridgeRunRow represents a single bridge run for listing
type BridgeRunRow struct {
	ContextID       string  `json:"context_id"`
	CreatedAt       string  `json:"created_at"`
	TargetHost      string  `json:"target_host"`
	Decision        string  `json:"decision"`
	Score           float64 `json:"score"`
	LadderLastLevel string  `json:"ladder_last_level"`
	AuthorName      string  `json:"author_name"`

	Provider string `json:"provider"`
	Model    string `json:"model"`

	InputTokens  int     `json:"input_tokens"`
	OutputTokens int     `json:"output_tokens"`
	CostUSD      float64 `json:"cost_usd_est"`
}

// ListBridgeRuns returns a paginated list of bridge runs
func ListBridgeRuns(ctx context.Context, pool *pgxpool.Pool, tenantID string, limit, offset int) ([]BridgeRunRow, error) {
	rows, err := pool.Query(ctx, `
		select
		  context_id::text,
		  created_at::text,
		  target_host,
		  decision,
		  score,
		  coalesce(ladder_last_level,'unknown'),
		  coalesce(provider,''),
		  coalesce(model,''),
		  input_tokens,
		  output_tokens,
		  cost_usd_est,
		  coalesce(a.name, 'unregistered')
		from bridge_runs br
		left join authors a on br.author_id = a.author_id
		where tenant_id::text=$1
		order by created_at desc
		limit $2 offset $3
	`, tenantID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	out := []BridgeRunRow{}
	for rows.Next() {
		var r BridgeRunRow
		if e := rows.Scan(
			&r.ContextID, &r.CreatedAt, &r.TargetHost, &r.Decision, &r.Score,
			&r.LadderLastLevel, &r.Provider, &r.Model, &r.InputTokens, &r.OutputTokens, &r.CostUSD,
			&r.AuthorName,
		); e != nil {
			return nil, e
		}
		out = append(out, r)
	}
	return out, nil
}

// GetBridgeRunDetail returns detailed info for a specific bridge run
func GetBridgeRunDetail(ctx context.Context, pool *pgxpool.Pool, tenantID, contextID string) (map[string]any, error) {
	var createdAt, host, decision, ladder string
	var score, cost float64
	var inTok, outTok int
	var ladderSteps, receipt string

	err := pool.QueryRow(ctx, `
		select
		  created_at::text, target_host, decision, score, coalesce(ladder_last_level,'unknown'),
		  input_tokens, output_tokens, cost_usd_est,
		  ladder_steps::text, receipt::text
		from bridge_runs
		where tenant_id::text=$1 and context_id::text=$2
		limit 1
	`, tenantID, contextID).Scan(&createdAt, &host, &decision, &score, &ladder, &inTok, &outTok, &cost, &ladderSteps, &receipt)
	if err != nil {
		return nil, err
	}

	return map[string]any{
		"context_id":        contextID,
		"created_at":        createdAt,
		"target_host":       host,
		"decision":          decision,
		"score":             score,
		"ladder_last_level": ladder,
		"input_tokens":      inTok,
		"output_tokens":     outTok,
		"cost_usd_est":      cost,
		"ladder_steps":      ladderSteps, // JSON string (client parses)
		"receipt":           receipt,      // JSON string (client parses)
	}, nil
}

// InsertBridgeRun inserts a new bridge run record
func InsertBridgeRun(ctx context.Context, pool *pgxpool.Pool, tenantID, deviceID, contextID, targetHost, decision string, score float64, ladderLastLevel, provider, model string, inputTokens, outputTokens int, costUSD float64, ladderStepsJSON string) error {
	_, err := pool.Exec(ctx, `
		insert into bridge_runs
		(tenant_id, device_id, context_id, target_host, decision, score, ladder_last_level, provider, model, input_tokens, output_tokens, cost_usd_est, ladder_steps)
		values ($1::uuid, $2::uuid, $3::uuid, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb)
	`, tenantID, deviceID, contextID, targetHost, decision, score, ladderLastLevel, provider, model, inputTokens, outputTokens, costUSD, ladderStepsJSON)
	return err
}
