export const API_BASE_URL: string =
    (globalThis as unknown as Record<string, string>).NEURAL_BRIDGE_API_BASE_URL ||
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE ||
    "http://localhost:8080"; // Real-world default

export const API_TIMEOUT_MS = 20_000;
