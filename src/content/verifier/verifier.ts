// Complete Verifier with Type-Aware Scoring
// Supports: boolean | enum | set | regex | short_text

export type ExpectedType = "boolean" | "enum" | "set" | "regex" | "short_text";

export interface Expected {
    type: ExpectedType;
    value: unknown; // boolean | string | string[] | (regex string)
}

export interface Invariant {
    id: string;
    kind: string;
    prompt: string;
    expected: Expected;
    weight: number;   // sum weights ~ 1.0
    strict: boolean;
    tags?: string[];
    rationale?: string;
}

export interface VerifyResult {
    score: number;               // 0..1
    strictFailures: string[];    // ids
    perInvariant: Array<{ id: string; score: number; reason: string }>;
}

function normalizeString(s: unknown): string {
    if (s == null) return "";
    return String(s).trim().toLowerCase();
}

function isNullish(v: unknown): boolean {
    return v === null || v === undefined;
}

function scoreBoolean(expected: boolean, got: unknown): { s: number; reason: string } {
    if (typeof got === "boolean") {
        return got === expected ? { s: 1, reason: "boolean_exact" } : { s: 0, reason: "boolean_mismatch" };
    }
    const g = normalizeString(got);
    if (g === "true" || g === "yes" || g === "sí" || g === "si") {
        return expected === true ? { s: 1, reason: "boolean_text_true" } : { s: 0, reason: "boolean_text_mismatch" };
    }
    if (g === "false" || g === "no") {
        return expected === false ? { s: 1, reason: "boolean_text_false" } : { s: 0, reason: "boolean_text_mismatch" };
    }
    return { s: 0, reason: "boolean_unparseable" };
}

function scoreEnum(expected: string, got: unknown): { s: number; reason: string } {
    const e = normalizeString(expected);
    const g = normalizeString(got);
    if (!g) return { s: 0, reason: "enum_missing" };
    if (g === e) return { s: 1, reason: "enum_exact" };
    // mild semantic: contains
    if (g.includes(e) || e.includes(g)) return { s: 0.7, reason: "enum_contains" };
    return { s: 0, reason: "enum_mismatch" };
}

function scoreSet(expected: string[], got: unknown): { s: number; reason: string } {
    const E = (expected ?? []).map(normalizeString).filter(Boolean);
    if (E.length === 0) return { s: 1, reason: "set_empty_expected" };

    let G: string[] = [];
    if (Array.isArray(got)) G = got.map(normalizeString).filter(Boolean);
    else if (typeof got === "string") G = got.split(",").map(normalizeString).filter(Boolean);
    else return { s: 0, reason: "set_unparseable" };

    if (G.length === 0) return { s: 0, reason: "set_missing" };

    const setE = new Set(E);
    const setG = new Set(G);

    let inter = 0;
    for (const x of setE) if (setG.has(x)) inter++;
    const union = setE.size + setG.size - inter;

    const j = union === 0 ? 0 : inter / union;

    // map jaccard to score:
    if (j >= 0.9) return { s: 1, reason: "set_jaccard_high" };
    if (j >= 0.6) return { s: 0.7, reason: "set_jaccard_mid" };
    if (j >= 0.3) return { s: 0.3, reason: "set_jaccard_low" };
    return { s: 0, reason: "set_mismatch" };
}

function scoreRegex(pattern: string, got: unknown): { s: number; reason: string } {
    const g = String(got ?? "");
    if (!g) return { s: 0, reason: "regex_missing" };
    try {
        const re = new RegExp(pattern, "i");
        return re.test(g) ? { s: 1, reason: "regex_match" } : { s: 0, reason: "regex_no_match" };
    } catch {
        return { s: 0, reason: "regex_invalid_pattern" };
    }
}

function scoreShortText(expected: string, got: unknown): { s: number; reason: string } {
    const e = normalizeString(expected);
    const g = normalizeString(got);
    if (!g) return { s: 0, reason: "short_text_missing" };
    if (!e) return { s: 0.7, reason: "short_text_no_expected" }; // degrade: can't verify strongly

    // token overlap (cheap semantic)
    const eTok = new Set(e.split(/\s+/).filter(Boolean));
    const gTok = new Set(g.split(/\s+/).filter(Boolean));
    let inter = 0;
    for (const t of eTok) if (gTok.has(t)) inter++;
    const overlap = eTok.size ? inter / eTok.size : 0;

    if (overlap >= 0.8) return { s: 1, reason: "short_text_overlap_high" };
    if (overlap >= 0.5) return { s: 0.7, reason: "short_text_overlap_mid" };
    if (overlap >= 0.25) return { s: 0.3, reason: "short_text_overlap_low" };
    return { s: 0, reason: "short_text_mismatch" };
}

/**
 * Verify LLM answers against invariants
 * @param params.invariants - Array of invariants to check
 * @param params.parsed - Parsed JSON from challenge response { answers: {...}, ... }
 * @returns VerifyResult with score, strictFailures, and per-invariant details
 */
export function verifyAnswers(params: {
    invariants: Invariant[];
    parsed: Record<string, unknown>;
}): VerifyResult {
    const answers = (params.parsed?.answers ?? {}) as Record<string, unknown>;
    const invs = params.invariants ?? [];

    let weighted = 0;
    let sumW = 0;

    const strictFailures: string[] = [];
    const perInvariant: Array<{ id: string; score: number; reason: string }> = [];

    for (const inv of invs) {
        const w = typeof inv.weight === "number" && inv.weight > 0 ? inv.weight : 0.01;
        sumW += w;

        const got = answers?.[inv.id];

        // Missing answer is penalized harder for strict
        if (isNullish(got)) {
            const s = 0;
            perInvariant.push({ id: inv.id, score: s, reason: "missing_answer" });
            if (inv.strict) strictFailures.push(inv.id);
            continue;
        }

        let out: { s: number; reason: string } = { s: 0, reason: "unknown" };

        switch (inv.expected?.type) {
            case "boolean":
                out = scoreBoolean(Boolean(inv.expected.value), got);
                break;
            case "enum":
                out = scoreEnum(String(inv.expected.value ?? ""), got);
                break;
            case "set":
                out = scoreSet(Array.isArray(inv.expected.value) ? inv.expected.value : [], got);
                break;
            case "regex":
                out = scoreRegex(String(inv.expected.value ?? ""), got);
                break;
            case "short_text":
            default:
                out = scoreShortText(String(inv.expected.value ?? ""), got);
                break;
        }

        weighted += out.s * w;
        perInvariant.push({ id: inv.id, score: out.s, reason: out.reason });

        if (inv.strict && out.s < 1) strictFailures.push(inv.id);
    }

    const score = sumW > 0 ? weighted / sumW : 0;

    return { score, strictFailures, perInvariant };
}

/**
 * Calculate scientific metrics for the verification
 * Returns SRI, PAC bounds, and fidelity badge
 */
export function calculateScientificMetrics(result: VerifyResult, invariantCount: number): {
    sri: number;
    pac_epsilon: number;
    fidelity_badge: string;
    pac_delta: number;
} {
    const delta = 0.05; // 95% confidence

    // Calculate PAC-style bound: ε = sqrt(ln(1/δ) / 2n)
    const pac_epsilon = invariantCount > 0
        ? Math.sqrt(Math.log(1 / delta) / (2 * invariantCount))
        : 1.0;

    // SRI = score × (1 - ε)
    const sri = result.score * (1 - pac_epsilon);

    // Determine fidelity badge
    let fidelity_badge: string;
    if (sri > 0.90) {
        fidelity_badge = 'CRYSTAL_CLEAR';
    } else if (sri >= 0.70) {
        fidelity_badge = 'HIGH_FIDELITY';
    } else {
        fidelity_badge = 'LOW_FIDELITY';
    }

    return {
        sri,
        pac_epsilon,
        fidelity_badge,
        pac_delta: delta
    };
}
