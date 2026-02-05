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

    const constraints: any[] = asArray<any>(draft.constraints).slice(0, 20).map((c, i) => ({
        id: `c${i + 1}`,
        rule: (c.strength === "hard" ? "MUST" : "CUSTOM"),
        value: String(c.text ?? "").trim(),
        rationale: String(c.rationale ?? "Axiomatic constraint extracted by RLM.").trim(),
        severity: (c.strength === "hard" ? "critical" : "medium")
    })).filter(c => c.value.length > 0);

    const entities: any[] = asArray<any>(draft.entities).slice(0, 30).map((e) => ({
        name: String(e.name ?? "").trim(),
        type: String(e.type ?? "concept"),
        attributes: {
            notes: String(e.notes ?? "").slice(0, 200)
        }
    })).filter(e => e.name.length > 0);

    // Evidence mapping
    const evidenceDraft = asArray<any>(draft.evidence).slice(0, 12);
    const evidence: any[] = [];
    for (let i = 0; i < evidenceDraft.length; i++) {
        const ed = evidenceDraft[i];
        const content = String(ed.content_hint ?? "").trim();
        const fp = await computeEvidenceFingerprints(content || `${ed.title ?? ""}\n${ed.ref ?? ""}`);

        evidence.push({
            type: (ed.type === "code" || ed.type === "text" || ed.type === "url" || ed.type === "file") ? ed.type : "text",
            content: content || "Evidence captured via RLM pipeline.",
            source: ed.ref ? String(ed.ref).slice(0, 200) : "Internal Transcript",
            confidence: 0.95
        });
    }

    // Generate Raw TOON Manifold (Required for v0.2)
    let raw_toon = `@context(${context_id})\n`;
    constraints.forEach(c => {
        raw_toon += `${c.rule} [${c.value}]\n`;
    });
    entities.forEach(e => {
        raw_toon += `(${e.name}) -[ISA]-> (${e.type})\n`;
    });

    const crystal: ContextCrystal = {
        raw_toon: raw_toon.trim(),
        scp_version: "0.2",
        context_id,
        created_at,
        version: "1.0.0",
        tier: "verified",
        source: {
            ...transcript.source as any,
            timestamp: created_at
        },
        intent: {
            primary: String(draft.intent?.primary ?? "").trim() || "Continuar la conversación manteniendo el contexto.",
            status: "active" as any
        },
        dynamic_state: {
            summary: String(draft.state?.summary ?? "").trim() || "Estado compilado por RLM.",
            open_items: asArray<string>(draft.state?.open_items).slice(0, 20).map(x => String(x).slice(0, 200)),
            next_actions: asArray<string>(draft.state?.next_actions).slice(0, 12).map(x => String(x).slice(0, 200))
        },
        constraints: constraints as any[],
        entities: entities as any[],
        evidence: evidence as any[],

        // Phase Omega - v0.2 Sigma Fields
        vector_anchor: [0, 0, 0, 0],
        gravity: 0.5,
        rlm_stats: {
            q_score: 0.5,
            use_count: 0,
            last_inferred: created_at,
            logic_bits: "0x0" // Start with empty logic bitmask
        },

        verification: {
            canonical_hash: "PENDING",
            semantic_invariants: [],
            policy: {
                min_checks: 8,
                accept_threshold: 0.85,
                max_retries: 2,
                strategy: "strict" as any
            }
        },

        author: {
            id: "system_rlm_v0.2",
            name: "Neural Bridge RLM",
            reputation: 1.0
        }
    };

    return crystal;
}
