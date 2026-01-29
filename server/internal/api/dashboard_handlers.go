package api

import (
	"net/http"
	"strconv"
	"strings"

	"neural-bridge-backend/internal/db"
)

func (s *Server) handleDashboardSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		Error(w, 405, "method_not_allowed", "GET required", nil)
		return
	}

	days := 7
	if v := r.URL.Query().Get("days"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n >= 1 && n <= 90 {
			days = n
		}
	}

	tenantID := TenantID(r)

	summary, err := db.GetDashboardSummary(r.Context(), s.DB.Pool, tenantID, days)
	if err != nil {
		Error(w, 500, "db_error", "failed to get summary", map[string]any{"err": err.Error()})
		return
	}
	JSON(w, 200, summary)
}

func (s *Server) handleDashboardBridges(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		Error(w, 405, "method_not_allowed", "GET required", nil)
		return
	}

	limit := 50
	offset := 0

	if v := r.URL.Query().Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n >= 1 && n <= 200 {
			limit = n
		}
	}
	if v := r.URL.Query().Get("offset"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n >= 0 {
			offset = n
		}
	}

	tenantID := TenantID(r)

	rows, err := db.ListBridgeRuns(r.Context(), s.DB.Pool, tenantID, limit, offset)
	if err != nil {
		Error(w, 500, "db_error", "failed to list bridges", map[string]any{"err": err.Error()})
		return
	}
	JSON(w, 200, map[string]any{"items": rows, "limit": limit, "offset": offset})
}

func (s *Server) handleDashboardBridgeDetail(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		Error(w, 405, "method_not_allowed", "GET required", nil)
		return
	}

	tenantID := TenantID(r)

	// Extract context_id from path: /v1/dashboard/bridges/{context_id}
	path := r.URL.Path
	parts := strings.Split(strings.TrimPrefix(path, "/v1/dashboard/bridges/"), "/")
	contextID := ""
	if len(parts) > 0 {
		contextID = parts[0]
	}

	if contextID == "" {
		Error(w, 400, "bad_request", "missing context_id", nil)
		return
	}

	detail, err := db.GetBridgeRunDetail(r.Context(), s.DB.Pool, tenantID, contextID)
	if err != nil {
		Error(w, 500, "db_error", "failed to get detail", map[string]any{"err": err.Error()})
		return
	}
	JSON(w, 200, detail)
}
