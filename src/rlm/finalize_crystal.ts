import type { Transcript } from "../transcript/transcript";
import type { ContextCrystal, Evidence, Constraint, Entity, Decision } from "../core/scp_types";
import { computeEvidenceFingerprints } from "../core/fingerprints";

function uuid(): string {
    return (crypto as any).randomUUID ? (crypto as any).randomUUID() : `cc_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function asArray<T>(x: any): T[] {
    return Array.isArray(x) ? x : [];
}

export async function finalizeCrystal(params: {
    draft: any;
    transcript: Transcript;
}): Promise<ContextCrystal> {
    const { draft, transcript } = params;

    const context_id = uuid();
    const created_at = new Date().toISOString();

    const constraints: Constraint[] = asArray<any>(draft.constraints).slice(0, 20).map((c, i) => ({
        id: `c${i + 1}`,
        strength: (c.strength === "hard" ? "hard" : "soft") as "hard" | "soft",
        text: String(c.text ?? "").trim(),
        priority: typeof c.priority === "number" ? c.priority : (c.strength === "hard" ? 1 : 3),
        tags: asArray<string>(c.tags).slice(0, 8)
    })).filter(c => c.text.length > 0);

    const entities: Entity[] = asArray<any>(draft.entities).slice(0, 30).map((e) => {
        const entity: Entity = {
            name: String(e.name ?? "").trim(),
            type: String(e.type ?? "other"),
        };
        if (e.notes) entity.notes = String(e.notes).slice(0, 200);
        return entity;
    }).filter(e => e.name.length > 0);

    // Evidence: LLM gives refs/hints; we attach fingerprints over hint (or transcript excerpt if ref matches)
    const evidenceDraft = asArray<any>(draft.evidence).slice(0, 12);

    const evidence: Evidence[] = [];
    for (let i = 0; i < evidenceDraft.length; i++) {
        const ed = evidenceDraft[i];
        const content = String(ed.content_hint ?? "").trim(); // we keep hints, not full private content
        const fp = await computeEvidenceFingerprints(content || `${ed.title ?? ""}\n${ed.ref ?? ""}`);

        evidence.push({
            id: `e${i + 1}`,
            type: (ed.type === "code" || ed.type === "text" || ed.type === "url" || ed.type === "file") ? ed.type : "text",
            title: String(ed.title ?? `evidence_${i + 1}`).slice(0, 80),
            ref: ed.ref ? String(ed.ref).slice(0, 200) : undefined,
            content: content || undefined,
            fingerprints: { sha256: fp.sha256, rolling64_dec: fp.rolling64_dec },
            redaction: "partial"
        } as any);
    }

    const decisions: Decision[] = asArray<any>(draft.decisions).slice(0, 20).map((d, i) => ({
        id: `d${i + 1}`,
        statement: String(d.statement ?? "").trim(),
        rationale: d.rationale ? String(d.rationale).slice(0, 300) : undefined,
        timestamp_hint: d.timestamp_hint ? String(d.timestamp_hint).slice(0, 60) : undefined
    })).filter(d => d.statement.length > 0) as any;

    const crystal: ContextCrystal = {
        scp_version: "1.0",
        context_id,
        created_at,
        source: transcript.source as any,

        intent: {
            primary: String(draft.intent?.primary ?? "").trim() || "Continuar la conversación manteniendo el contexto.",
            status: (draft.intent?.status === "blocked" || draft.intent?.status === "done") ? draft.intent.status : "active"
        },

        constraints,
        state: {
            summary: String(draft.state?.summary ?? "").trim() || "Estado compilado por RLM.",
            open_items: asArray<string>(draft.state?.open_items).slice(0, 20).map(x => String(x).slice(0, 200)),
            next_actions: asArray<string>(draft.state?.next_actions).slice(0, 12).map(x => String(x).slice(0, 200))
        },

        entities,
        evidence,
        decisions,

        verification: {
            canonical_hash: "PENDING",
            semantic_invariants: [],
            policy: {
                min_checks: 8,
                accept_threshold: 0.85,
                max_retries: 2,
                strategy: "compact"
            }
        }
    };

    return crystal;
}
