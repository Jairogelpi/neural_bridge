export const API_BASE_URL =
    (globalThis as any).NEURAL_BRIDGE_API_BASE_URL ||
    (import.meta as any).env?.VITE_API_BASE ||
    "http://localhost:8080"; // Real-world default

export const API_TIMEOUT_MS = 20_000;
