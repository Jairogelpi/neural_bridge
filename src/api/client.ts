import { API_BASE_URL } from "../config";
import { fetchJSON, ApiError } from "./http";
import { getOrCreateInstallId, getSession, isExpired, setSession } from "./storage";
import type {
    SessionBootstrapRequest,
    SessionBootstrapResponse,
    HostProfile,
    CompileRequest,
    CompileResponse,
    VerifyTelemetryRequest,
    Platform,
    VerifyRequest,
    VerifyResponse,
    Crystal,
    GenerateInvariantsResponse
} from "./types";

function idempotencyKey(): string {
    const hasRandomUUID = typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof (crypto as any).randomUUID === 'function';
    return hasRandomUUID
        ? (crypto as any).randomUUID()
        : `idem_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function browserInfo(): { name: "chrome" | "edge" | "brave" | "other"; version: string } {
    if (typeof navigator === 'undefined') return { name: "other", version: "nodejs" };
    const ua = navigator.userAgent.toLowerCase();
    const versionMatch = ua.match(/(chrome|edg|brave)\/([\d.]+)/);
    const version = versionMatch?.[2] ?? "0";
    if (ua.includes("edg/")) return { name: "edge", version };
    if (ua.includes("brave")) return { name: "brave", version };
    if (ua.includes("chrome/")) return { name: "chrome", version };
    return { name: "other", version };
}

/** Ensure we have a valid session token. Refresh if expired. */
export async function ensureSession(extensionVersion: string): Promise<string> {
    const s = await getSession();
    if (s.token && !isExpired(s.expiresAt)) return s.token;

    const install_id = await getOrCreateInstallId();
    const req: SessionBootstrapRequest = {
        install_id,
        extension_version: extensionVersion,
        browser: browserInfo(),
        locale: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
        timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    };

    const resp = await fetchJSON<SessionBootstrapResponse>(`${API_BASE_URL}/v1/session/bootstrap`, {
        method: "POST",
        body: JSON.stringify(req),
        timeoutMs: 15_000,
    });

    await setSession(resp.session_token, resp.expires_at, resp.policy);
    return resp.session_token;
}

export async function getHostProfile(params: {
    platform: Platform;
    extensionVersion: string;
}): Promise<HostProfile> {
    const token = await ensureSession(params.extensionVersion);
    return await fetchJSON<HostProfile>(
        `${API_BASE_URL}/v1/profiles/host?platform=${encodeURIComponent(params.platform)}&extension_version=${encodeURIComponent(params.extensionVersion)}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
    );
}

export async function compile(params: {
    req: CompileRequest;
    extensionVersion: string;
    idemKey?: string;
}): Promise<CompileResponse> {
    const token = await ensureSession(params.extensionVersion);
    const idem = params.idemKey ?? idempotencyKey();

    try {
        return await fetchJSON<CompileResponse>(`${API_BASE_URL}/v1/compile`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Idempotency-Key": idem,
            },
            body: JSON.stringify(params.req),
            timeoutMs: 30_000,
        });
    } catch (e: unknown) {
        if (e instanceof ApiError && e.status === 401) {
            await setSession("", "", null);
            const token2 = await ensureSession(params.extensionVersion);
            return await fetchJSON<CompileResponse>(`${API_BASE_URL}/v1/compile`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token2}`,
                    "Idempotency-Key": idem,
                },
                body: JSON.stringify(params.req),
                timeoutMs: 30_000,
            });
        }
        throw e;
    }
}

export async function reportVerifyTelemetry(params: {
    body: VerifyTelemetryRequest;
    extensionVersion: string;
}): Promise<{ ok: boolean }> {
    const token = await ensureSession(params.extensionVersion);
    return await fetchJSON<{ ok: boolean }>(`${API_BASE_URL}/v1/telemetry/verify_result`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(params.body),
        timeoutMs: 10_000,
    });
}

export async function verify(params: {
    req: VerifyRequest;
    extensionVersion: string;
}): Promise<VerifyResponse> {
    const token = await ensureSession(params.extensionVersion);
    return await fetchJSON<VerifyResponse>(`${API_BASE_URL}/v1/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(params.req),
        timeoutMs: 15_000,
    });
}

export async function generateInvariants(params: {
    crystal: Crystal;
    extensionVersion: string;
}): Promise<GenerateInvariantsResponse> {
    const token = await ensureSession(params.extensionVersion);
    return await fetchJSON<GenerateInvariantsResponse>(`${API_BASE_URL}/v1/invariants`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ crystal: params.crystal }),
        timeoutMs: 10_000,
    });
}

import { Attestation } from "../services/attestation";

export async function registerAuthor(params: {
    name: string;
    handle: string;
    extensionVersion: string;
}): Promise<{ author_id: string; status: string }> {
    const token = await ensureSession(params.extensionVersion);

    // Generate real cryptographic identity
    const keyPair = await Attestation.generateKeyPair();
    const publicKey = await Attestation.exportPublicKey(keyPair.publicKey);

    return await fetchJSON<{ author_id: string; status: string }>(`${API_BASE_URL}/v1/authors`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: params.name, handle: params.handle, public_key: publicKey }),
        timeoutMs: 15_000,
    });
}

export async function getAuthor(params: {
    authorId: string;
    extensionVersion: string;
}): Promise<{ id: string; name: string; reputation: number; tier: string }> {
    const token = await ensureSession(params.extensionVersion);
    return await fetchJSON<{ id: string; name: string; reputation: number; tier: string }>(`${API_BASE_URL}/v1/authors?id=${params.authorId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        timeoutMs: 10_000,
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PCK (Proof-Carrying Knowledge) API - Zero-Cost Local Verification
// ═══════════════════════════════════════════════════════════════════════════════

import { PCKRuntime, PCKVerifier, type ProofCarryingKnowledge } from '../pck';

/**
 * Compile source into PCK locally - NO API call needed.
 * This runs entirely in the browser/node with zero network cost.
 */
export function compilePCKLocal(
    source: string,
    domain: string
): ProofCarryingKnowledge {
    return PCKRuntime.compile(source, {
        domain,
        extract_numbers: true,
        extract_entities: true,
        extract_temporals: true
    });
}

/**
 * Verify answer against PCK locally - ZERO API calls.
 * This is the revolutionary part: verification without external services.
 */
export function verifyWithPCKLocal(
    pck: ProofCarryingKnowledge,
    answer: string
): {
    valid: boolean;
    confidence: number;
    supported_claims: string[];
    unsupported_claims: string[];
    contradictions: string[];
    llm_calls_made: 0;
    verification_time_ms: number;
    cost_saved: string;  // Human-readable cost saving
} {
    const result = PCKRuntime.verifyAnswer(pck, answer);

    // Calculate estimated cost saved (vs. calling LLM for verification)
    const estimatedLLMCost = 0.002; // ~$0.002 per verification call

    return {
        ...result,
        cost_saved: `$${estimatedLLMCost.toFixed(4)} (LLM call avoided)`
    };
}

/**
 * Verify PCK integrity - ensure proofs haven't been tampered with.
 */
export function verifyPCKIntegrity(pck: ProofCarryingKnowledge): {
    valid: boolean;
    checks_performed: number;
    failed_checks: string[];
} {
    return PCKVerifier.verify(pck);
}

export type { ProofCarryingKnowledge };

