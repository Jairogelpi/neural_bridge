package api

import (
	"encoding/json"
	"net/http"
	"time"

	"neural-bridge-backend/internal/auth"
	"neural-bridge-backend/internal/compiler"
	"neural-bridge-backend/internal/config"
	"neural-bridge-backend/internal/db"
	"neural-bridge-backend/internal/providers"
	"neural-bridge-backend/internal/verifier"
)

type Server struct {
	Cfg      config.Config
	DB       *db.DB
	Providers providers.Router
	SigningKey []byte
}

func NewServer(cfg config.Config, database *db.DB, pr providers.Router) *Server {
	return &Server{
		Cfg:        cfg,
		DB:         database,
		Providers:  pr,
		SigningKey: []byte(cfg.JWTSigningKey),
	}
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	// public
	mux.HandleFunc("/healthz", s.handleHealthz)
	mux.HandleFunc("/v1/session/bootstrap", s.handleBootstrap)

	// authed
	authed := http.NewServeMux()
	authed.HandleFunc("/v1/compile", s.handleCompile)
	authed.HandleFunc("/v1/verify", s.handleVerify)
	authed.HandleFunc("/v1/verify/rewrite", s.handleVerifyRewrite)
	authed.HandleFunc("/v1/verify/regenerate", s.handleRegenerateInvariants)
	authed.HandleFunc("/v1/invariants", s.handleGenerateInvariants)
	authed.HandleFunc("/v1/invariants/v2", s.handleGenerateInvariantsV2)
	authed.HandleFunc("/v1/telemetry/verify_result", s.handleVerifyTelemetry)
	authed.HandleFunc("/v1/profiles/host", s.handleHostProfile)
	authed.HandleFunc("/v1/authors", s.handleAuthorAction) // GET/POST

	// Dashboard endpoints
	authed.HandleFunc("/v1/dashboard/summary", s.handleDashboardSummary)
	authed.HandleFunc("/v1/dashboard/bridges", s.handleDashboardBridges)
	authed.HandleFunc("/v1/dashboard/bridges/", s.handleDashboardBridgeDetail)

	// chain: auth -> idempotency -> handlers
	h := http.Handler(authed)
	h = WithIdempotency(s.DB)(h)
	h = WithAuth(s.SigningKey, s.DB)(h)

	mux.Handle("/", h)

	// Final CORS Wrapper
	cors := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		mux.ServeHTTP(w, r)
	})

	return cors
}

func (s *Server) handleHealthz(w http.ResponseWriter, r *http.Request) {
	JSON(w, 200, map[string]any{"ok": true})
}

func (s *Server) handleBootstrap(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}
	var req struct {
		InstallID        string `json:"install_id"`
		ExtensionVersion string `json:"extension_version"`
		Browser          struct {
			Name    string `json:"name"`
			Version string `json:"version"`
		} `json:"browser"`
		Locale   string `json:"locale"`
		Timezone string `json:"timezone"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}
	if len(req.InstallID) < 8 {
		Error(w, 400, "bad_request", "install_id too short", nil)
		return
	}

	tenantID := compiler.DeriveTenantID(req.InstallID, s.Cfg.TenantIDSalt)
	deviceID := compiler.DeriveDeviceID(req.InstallID, s.Cfg.DeviceIDSalt)

	token, exp, err := auth.SignJWT(s.SigningKey, tenantID, deviceID, s.Cfg.JWTTTL)
	if err != nil {
		Error(w, 500, "auth_error", "failed to sign token", nil)
		return
	}
	tokenHash := auth.HashToken(token)

	// Persist tenant/device/session
	tx, err := s.DB.Pool.Begin(r.Context())
	if err != nil {
		Error(w, 500, "db_error", "failed begin tx", nil)
		return
	}
	defer func() { _ = tx.Rollback(r.Context()) }()

	if err := db.UpsertTenantAndDevice(r.Context(), tx, tenantID, deviceID, req.InstallID); err != nil {
		Error(w, 500, "db_error", "failed upsert tenant/device", nil)
		return
	}
	if err := db.InsertSession(r.Context(), tx,
		compiler.NewUUID(), tenantID, deviceID, tokenHash, exp.Format(time.RFC3339),
	); err != nil {
		Error(w, 500, "db_error", "failed insert session", nil)
		return
	}
	if err := tx.Commit(r.Context()); err != nil {
		Error(w, 500, "db_error", "failed commit", nil)
		return
	}

	JSON(w, 200, map[string]any{
		"session_token": token,
		"expires_at":    exp.Format(time.RFC3339),
		"policy": map[string]any{
			"max_compile_calls":      s.Cfg.DefaultMaxCalls,
			"max_tokens_per_compile": s.Cfg.DefaultTokenBudget,
			"retention": map[string]any{
				"store_transcripts":    s.Cfg.DefaultStoreTranscript,
				"transcript_ttl_hours": s.Cfg.DefaultTranscriptTTLH,
			},
			"telemetry_opt_in_default": true,
		},
	})
}

func (s *Server) handleHostProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		Error(w, 405, "method_not_allowed", "GET required", nil)
		return
	}
	platform := r.URL.Query().Get("platform")
	if platform == "" {
		Error(w, 400, "bad_request", "platform query param required", nil)
		return
	}
	p := compiler.GetHostProfile(platform, s.Cfg.ProfileMaxTurns, s.Cfg.ProfileMaxChars, s.Cfg.ProfileAcceptThreshold)
	JSON(w, 200, p)
}

func (s *Server) handleCompile(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req map[string]any
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	tenantID := TenantID(r)
	deviceID := DeviceID(r)

	// ---- BUDGET ENFORCEMENT: Preflight ----
	plan, _ := db.GetTenantPlan(r.Context(), s.DB.Pool, tenantID)
	limits := compiler.LimitsForPlan(plan, s.Cfg.FreeMaxTokens, s.Cfg.FreeMaxDailyUSD, s.Cfg.FreeMaxCompiles)

	// Check daily compile count
	compilesToday, _ := db.GetCompilesToday(r.Context(), s.DB.Pool, tenantID)
	if compilesToday >= limits.MaxCompiles {
		Error(w, 402, "compile_limit_exceeded", "daily compile limit reached", map[string]any{
			"plan": plan, "compiles_today": compilesToday, "max_compiles": limits.MaxCompiles,
		})
		return
	}

	// Check daily USD spend
	spentToday, _ := db.GetSpentUSDToday(r.Context(), s.DB.Pool, tenantID)
	if spentToday >= limits.MaxUSDPerDay {
		Error(w, 402, "budget_exceeded", "daily USD budget exceeded", map[string]any{
			"plan": plan, "spent_usd_today": spentToday, "max_usd_per_day": limits.MaxUSDPerDay,
		})
		return
	}

	compilePolicy := compiler.CompilePolicy{
		Mode:          providers.Mode(safeStringPath(req, "compile_policy.mode", "auto")),
		MaxCalls:      safeIntPath(req, "compile_policy.max_calls", s.Cfg.DefaultMaxCalls),
		TokenBudget:   safeIntPath(req, "compile_policy.token_budget", s.Cfg.DefaultTokenBudget),
		MaxTokensCall: s.Cfg.DefaultMaxTokensCall,
	}

	// Clamp token budget to plan limits
	if compilePolicy.TokenBudget > limits.MaxTokenBudget {
		compilePolicy.TokenBudget = limits.MaxTokenBudget
	}
	if compilePolicy.TokenBudget < 256 {
		compilePolicy.TokenBudget = 256
	}
	if compilePolicy.MaxCalls < 1 {
		compilePolicy.MaxCalls = 1
	}
	if compilePolicy.MaxCalls > 4 {
		compilePolicy.MaxCalls = 4
	}

	transcript, _ := req["transcript"].(map[string]any)
	if transcript == nil {
		Error(w, 400, "bad_request", "missing transcript", nil)
		return
	}

	// Preflight: estimate tokens from transcript
	slice := compiler.DebugSliceForBudget(transcript)
	estTokens := compiler.EstimateTokens(slice)
	if estTokens > compilePolicy.TokenBudget*2 { // allow some headroom
		Error(w, 413, "transcript_too_large", "transcript exceeds token budget", map[string]any{
			"est_tokens": estTokens, "token_budget": compilePolicy.TokenBudget, "plan": plan,
		})
		return
	}

	// ---- COMPILE ----
	out, err := compiler.CompileRLM(s.Providers, transcript, compilePolicy)
	if err != nil {
		Error(w, 500, "compile_error", "failed to compile", map[string]any{"err": err.Error()})
		return
	}

	// ---- BUDGET ENFORCEMENT: Postflight ----
	totalTokens := out.Cost.InputTokens + out.Cost.OutputTokens
	if totalTokens > compilePolicy.TokenBudget {
		Error(w, 402, "token_budget_exceeded", "compile exceeded token budget", map[string]any{
			"total_tokens": totalTokens, "token_budget": compilePolicy.TokenBudget,
		})
		return
	}

	// Check if this compile would exceed daily budget
	if out.Cost.CostUSDEst > 0 && spentToday+out.Cost.CostUSDEst > limits.MaxUSDPerDay {
		Error(w, 402, "budget_exceeded", "daily USD budget would be exceeded", map[string]any{
			"spent_usd_today": spentToday, "next_cost_usd": out.Cost.CostUSDEst,
			"max_usd_per_day": limits.MaxUSDPerDay,
		})
		return
	}

	// ---- PERSIST ----
	authorIDStr := safeString(req, "author_id", "")
	var authorID *string
	if authorIDStr != "" {
		authorID = &authorIDStr
	}

	tx, err := s.DB.Pool.Begin(r.Context())
	if err != nil {
		Error(w, 500, "db_error", "failed to begin tx", nil)
		return
	}
	defer func() { _ = tx.Rollback(r.Context()) }()

	err = db.InsertCrystalV2(r.Context(), tx, out.Crystal, tenantID, deviceID, authorID, out.CanonicalHash, out.QualityScore)
	if err != nil {
		Error(w, 500, "db_error", "failed to store crystal", map[string]any{"err": err.Error()})
		return
	}

	_, _ = s.DB.Pool.Exec(r.Context(), `
		insert into provider_cost_ledger(tenant_id, device_id, context_id, provider, model, input_tokens, output_tokens, cost_usd_est)
		values($1::uuid,$2::uuid,$3::uuid,$4,$5,$6,$7,$8)
	`, tenantID, deviceID, out.Crystal["context_id"], out.Cost.ProviderName, out.Cost.Model, out.Cost.InputTokens, out.Cost.OutputTokens, out.Cost.CostUSDEst)

	JSON(w, 200, map[string]any{
		"context_crystal": out.Crystal,
		"invariants":      out.Invariants,
		"compiler_notes":  out.Notes,
		"cost": map[string]any{
			"provider":      out.Cost.ProviderName,
			"model":         out.Cost.Model,
			"input_tokens":  out.Cost.InputTokens,
			"output_tokens": out.Cost.OutputTokens,
			"cost_usd_est":  out.Cost.CostUSDEst,
		},
		"budget": map[string]any{
			"plan":            plan,
			"spent_usd_today": spentToday + out.Cost.CostUSDEst,
			"max_usd_per_day": limits.MaxUSDPerDay,
			"compiles_today":  compilesToday + 1,
			"max_compiles":    limits.MaxCompiles,
		},
	})
}

func (s *Server) handleVerifyTelemetry(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}
	var req map[string]any
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}
	tenantID := TenantID(r)
	deviceID := DeviceID(r)

	contextID := safeString(req, "context_id", "")
	if contextID == "" {
		Error(w, 400, "bad_request", "context_id required", nil)
		return
	}
	targetHost := safeString(req, "target_host", "other")
	decision := safeString(req, "decision", "ACCEPT")
	score := safeFloat(req, "score", 0)
	ladderSteps := req["ladder_steps"]
	receipt := req["receipt"]
	extVer := safeString(req, "extension_version", "")

	ls, _ := json.Marshal(ladderSteps)
	rc, _ := json.Marshal(receipt)

	// Phase 6: Atomic telemetry + reputation update
	tx, err := s.DB.Pool.Begin(r.Context())
	if err != nil {
		Error(w, 500, "db_error", "failed to begin tx", nil)
		return
	}
	defer func() { _ = tx.Rollback(r.Context()) }()

	var runID int64
	err = tx.QueryRow(r.Context(), `
		insert into bridge_runs(tenant_id, device_id, context_id, target_host, decision, score, ladder_steps, receipt, extension_version)
		values($1::uuid,$2::uuid,$3::uuid,$4,$5,$6,$7::jsonb,$8::jsonb,$9)
		returning run_id
	`, tenantID, deviceID, contextID, targetHost, decision, score, string(ls), string(rc), extVer).Scan(&runID)
	
	if err != nil {
		Error(w, 500, "db_error", "failed telemetry insert", map[string]any{"err": err.Error()})
		return
	}

	// 🛡️ Reputation Slashing/Credit
	authorID := safeString(req, "author_id", "")
	repImpact := safeFloat(req, "reputation_impact", 0)
	
	if authorID != "" && repImpact != 0 {
		reason := "Verification: " + decision + " on " + targetHost
		_, err = db.UpdateAuthorReputation(r.Context(), tx, authorID, runID, repImpact, reason)
		if err != nil {
			// Non-critical if reputation fails? Actually, for real competition it IS critical.
			Error(w, 500, "db_error", "failed reputation update", map[string]any{"err": err.Error()})
			return
		}
	}

	if err := tx.Commit(r.Context()); err != nil {
		Error(w, 500, "db_error", "failed commit", nil)
		return
	}

	JSON(w, 200, map[string]any{"ok": true, "run_id": runID})
}

func (s *Server) handleVerify(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req struct {
		ContextID   string               `json:"context_id"`
		Invariants  []verifier.Invariant `json:"invariants"`
		LLMResponse string               `json:"llm_response"`
		Threshold   float64              `json:"threshold"`
		LadderStep  int                  `json:"ladder_step"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	if len(req.Invariants) == 0 {
		Error(w, 400, "bad_request", "invariants required", nil)
		return
	}
	if req.LLMResponse == "" {
		Error(w, 400, "bad_request", "llm_response required", nil)
		return
	}
	if req.Threshold <= 0 {
		req.Threshold = 0.85
	}

	result := verifier.Verify(verifier.VerifyRequest{
		ContextID:   req.ContextID,
		Invariants:  req.Invariants,
		LLMResponse: req.LLMResponse,
		Threshold:   req.Threshold,
		LadderStep:  req.LadderStep,
	})

	JSON(w, 200, result)
}

func (s *Server) handleGenerateInvariants(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req struct {
		Crystal map[string]any `json:"crystal"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	if req.Crystal == nil {
		Error(w, 400, "bad_request", "crystal required", nil)
		return
	}

	invariants := verifier.GenerateInvariants(req.Crystal)
	prompt := verifier.GenerateVerificationPrompt(invariants)

	JSON(w, 200, map[string]any{
		"invariants":          invariants,
		"verification_prompt": prompt,
		"count":               len(invariants),
	})
}

func (s *Server) handleGenerateInvariantsV2(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req struct {
		Crystal map[string]any `json:"crystal"`
		MinK    int            `json:"min_k"`
		MaxK    int            `json:"max_k"`
		Level   string         `json:"level"` // compact|redundant|sectioned
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	if req.Crystal == nil {
		Error(w, 400, "bad_request", "crystal required", nil)
		return
	}

	if req.MinK <= 0 {
		req.MinK = 12
	}
	if req.MaxK <= 0 {
		req.MaxK = 20
	}

	// Generate candidates via LLM
	candidates, cost, err := verifier.GenerateInvariantCandidates(
		s.Providers,
		providers.ModeAuto,
		req.Crystal,
		req.MinK,
		req.MaxK,
	)
	if err != nil {
		Error(w, 500, "generation_failed", "failed to generate invariants", map[string]any{"err": err.Error()})
		return
	}

	// Refine (score, dedupe, normalize)
	refined := verifier.RefineInvariants(candidates, 10)

	// Get canonical hash
	canonicalHash := ""
	if v, ok := req.Crystal["verification"].(map[string]any); ok {
		if h, ok := v["canonical_hash"].(string); ok {
			canonicalHash = h
		}
	}

	// Build challenge based on level
	level := verifier.LadderCompact
	switch req.Level {
	case "redundant":
		level = verifier.LadderRedundant
	case "sectioned":
		level = verifier.LadderSectioned
	}

	challenge, _ := verifier.BuildChallenge(refined, level, canonicalHash)

	JSON(w, 200, map[string]any{
		"invariants":      refined,
		"challenge":       challenge,
		"generated_count": len(candidates),
		"refined_count":   len(refined),
		"level":           string(level),
		"cost": map[string]any{
			"provider":      cost.ProviderName,
			"model":         cost.Model,
			"input_tokens":  cost.InputTokens,
			"output_tokens": cost.OutputTokens,
			"cost_usd_est":  cost.CostUSDEst,
		},
	})
}

// ---- helpers ----

func safeString(m map[string]any, k, def string) string {
	v, ok := m[k].(string)
	if !ok || v == "" {
		return def
	}
	return v
}

func safeFloat(m map[string]any, k string, def float64) float64 {
	v, ok := m[k].(float64)
	if !ok {
		return def
	}
	return v
}

func safeStringPath(m map[string]any, path, def string) string {
	cur := any(m)
	parts := splitDot(path)
	for _, p := range parts {
		mm, ok := cur.(map[string]any)
		if !ok {
			return def
		}
		cur = mm[p]
	}
	if s, ok := cur.(string); ok && s != "" {
		return s
	}
	return def
}

func safeIntPath(m map[string]any, path string, def int) int {
	cur := any(m)
	parts := splitDot(path)
	for _, p := range parts {
		mm, ok := cur.(map[string]any)
		if !ok {
			return def
		}
		cur = mm[p]
	}
	switch t := cur.(type) {
	case float64:
		return int(t)
	case int:
		return t
	default:
		return def
	}
}

func splitDot(s string) []string {
	out := []string{}
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == '.' {
			out = append(out, s[start:i])
			start = i + 1
		}
	}
	out = append(out, s[start:])
	return out
}

func (s *Server) handleAuthorAction(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		authorID := r.URL.Query().Get("id")
		if authorID == "" {
			Error(w, 400, "bad_request", "id query param required", nil)
			return
		}
		a, err := db.GetAuthor(r.Context(), s.DB.Pool, authorID)
		if err != nil {
			Error(w, 404, "not_found", "author not found", nil)
			return
		}
		JSON(w, 200, a)
		return
	}

	if r.Method == "POST" {
		var req struct {
			Name      string `json:"name"`
			Handle    string `json:"handle"`
			PublicKey string `json:"public_key"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			Error(w, 400, "bad_request", "invalid json", nil)
			return
		}

		// Register new author
		authorID := compiler.NewUUID()
		_, err := s.DB.Pool.Exec(r.Context(), `
			insert into authors(author_id, name, handle, public_key)
			values($1::uuid, $2, $3, $4)
		`, authorID, req.Name, req.Handle, req.PublicKey)
		if err != nil {
			Error(w, 500, "db_error", "failed to register author", map[string]any{"err": err.Error()})
			return
		}

		JSON(w, 201, map[string]any{
			"author_id": authorID,
			"status":    "registered",
		})
		return
	}

	Error(w, 405, "method_not_allowed", "GET or POST required", nil)
}

func (s *Server) handleVerifyRewrite(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req struct {
		Host          string `json:"host"`
		LadderLevel   string `json:"ladder_level"`
		FailureMode   string `json:"failure_mode"`
		LastRaw       string `json:"last_raw_answer"`
		Invariants    []any  `json:"invariants"`
		Crystal       map[string]any `json:"crystal_compact"`
		CanonicalHash string `json:"canonical_hash"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	provs, _ := s.Providers.PickOrder(providers.ModeCheapFirst)
	if len(provs) == 0 {
		Error(w, 500, "no_providers", "no providers available", nil)
		return
	}
	p := provs[0]

	prompt := compiler.BuildRewritePrompt(
		req.Host, req.LadderLevel, req.FailureMode,
		req.LastRaw, req.Crystal, req.Invariants, req.CanonicalHash,
	)

	res, err := p.GenerateJSON(providers.JSONCall{Prompt: prompt, MaxTokens: 900, Temperature: 0})
	if err != nil {
		Error(w, 502, "provider_error", "rewrite provider failed", map[string]any{"err": err.Error()})
		return
	}

	var out map[string]any
	if e := json.Unmarshal([]byte(res.Text), &out); e != nil {
		// Try extraction
		txt, _ := compiler.ExtractFirstJSONObject(res.Text)
		if txt != "" {
			json.Unmarshal([]byte(txt), &out)
		}
	}

	rewriteID := "rw_auto"
	promptOut := ""
	if id, ok := out["rewrite_id"].(string); ok && id != "" {
		rewriteID = id
	}
	if p, ok := out["prompt"].(string); ok {
		promptOut = p
	}

	JSON(w, 200, map[string]any{
		"rewrite_id": rewriteID,
		"prompt":     promptOut,
	})
}

func (s *Server) handleRegenerateInvariants(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		Error(w, 405, "method_not_allowed", "POST required", nil)
		return
	}

	var req struct {
		Host               string         `json:"host"`
		Crystal            map[string]any `json:"crystal"`
		FailedInvariants   []string       `json:"failed_invariants"`
		PreviousInvariants []any          `json:"previous_invariants"`
		TargetK            int            `json:"target_k"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, 400, "bad_request", "invalid json", nil)
		return
	}

	if req.TargetK <= 0 {
		req.TargetK = 10
	}

	provs, _ := s.Providers.PickOrder(providers.ModeHighAccuracy)
	if len(provs) == 0 {
		Error(w, 500, "no_providers", "no providers available", nil)
		return
	}
	p := provs[0]

	prompt := compiler.BuildRegenerateInvariantsPrompt(
		req.Host, req.Crystal, req.FailedInvariants, req.PreviousInvariants, req.TargetK,
	)

	res, err := p.GenerateJSON(providers.JSONCall{Prompt: prompt, MaxTokens: 1200, Temperature: 0})
	if err != nil {
		Error(w, 502, "provider_error", "regen provider failed", map[string]any{"err": err.Error()})
		return
	}

	var candidates []verifier.InvariantV2
	if e := json.Unmarshal([]byte(res.Text), &candidates); e != nil {
		var wrap struct {
			Invariants []verifier.InvariantV2 `json:"invariants"`
		}
		if e2 := json.Unmarshal([]byte(res.Text), &wrap); e2 == nil && len(wrap.Invariants) > 0 {
			candidates = wrap.Invariants
		}
	}

	final := verifier.RefineInvariants(candidates, req.TargetK)

	JSON(w, 200, map[string]any{
		"invariant_set_id": "is_" + compiler.ShortHash(compiler.NowISO()+"|"+req.Host),
		"invariants":       final,
	})
}

