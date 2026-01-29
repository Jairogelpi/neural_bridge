package api

import (
	"encoding/json"
	"net/http"
)

func JSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func Error(w http.ResponseWriter, status int, code, msg string, details any) {
	resp := map[string]any{
		"error": code,
		"message": msg,
	}
	if details != nil {
		resp["details"] = details
	}
	JSON(w, status, resp)
}
