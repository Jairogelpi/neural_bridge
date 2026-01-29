import { API_TIMEOUT_MS } from "../config";

export class ApiError extends Error {
    status?: number | undefined;
    code?: string | undefined;
    details?: any;

    constructor(message: string, opts?: { status?: number; code?: string; details?: any }) {
        super(message);
        this.name = "ApiError";
        this.status = opts?.status;
        this.code = opts?.code;
        this.details = opts?.details;
    }
}

export async function fetchJSON<T>(url: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), init.timeoutMs ?? API_TIMEOUT_MS);

    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                ...(init.headers ?? {}),
            },
        });

        const text = await res.text();
        const isJson = text && (() => { try { JSON.parse(text); return true; } catch { return false; } })();
        const body = isJson ? JSON.parse(text) : null;

        if (!res.ok) {
            throw new ApiError(body?.message ?? `HTTP ${res.status}`, {
                status: res.status,
                code: body?.error,
                details: body?.details,
            });
        }

        return (body ?? ({} as any)) as T;
    } catch (e: any) {
        if (e?.name === "AbortError") throw new ApiError("request_timeout", { code: "timeout" });
        if (e instanceof ApiError) throw e;
        throw new ApiError(e?.message ?? "network_error", { code: "network_error" });
    } finally {
        clearTimeout(t);
    }
}
