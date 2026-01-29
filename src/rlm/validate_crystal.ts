export type CrystalDraft = any;

export interface DraftIssues {
    missing: string[];
    warnings: string[];
    quality: number; // 0..1
    tooLarge: boolean;
}

function tokenEstimate(s: string): number {
    return Math.ceil((s?.length ?? 0) / 4);
}

export function validateDraft(d: CrystalDraft): DraftIssues {
    const missing: string[] = [];
    const warnings: string[] = [];

    if (!d || typeof d !== "object") return { missing: ["root"], warnings: ["not_object"], quality: 0, tooLarge: false };

    if (!d.intent?.primary) missing.push("intent.primary");
    if (!d.state?.summary) missing.push("state.summary");
    if (!Array.isArray(d.state?.next_actions) || d.state.next_actions.length === 0) missing.push("state.next_actions");

    if (!Array.isArray(d.constraints)) warnings.push("constraints_not_array");
    if (Array.isArray(d.constraints) && d.constraints.length < 2) warnings.push("low_constraints");

    if (!Array.isArray(d.entities)) warnings.push("entities_not_array");
    if (!Array.isArray(d.evidence)) warnings.push("evidence_not_array");

    const size = tokenEstimate(JSON.stringify(d));
    const tooLarge = size > 1800; // keep it cheap
    if (tooLarge) warnings.push("too_large");

    let q = 1.0;
    q -= missing.length * 0.2;
    q -= warnings.length * 0.06;
    if (tooLarge) q -= 0.12;
    q = Math.max(0, Math.min(1, q));

    return { missing, warnings, quality: q, tooLarge };
}
