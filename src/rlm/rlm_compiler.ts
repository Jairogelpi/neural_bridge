import type { Transcript } from "../transcript/transcript";
import { sha256Hex } from "../core/fingerprints";
import { buildCrystalizePrompt } from "./prompts/crystalize_prompt";
import type { LLMClient } from "./llm/llm_client";
import { validateDraft } from "./validate_crystal";

export interface Budget {
    maxCalls: number;         // e.g. 2
    maxTokensPerCall: number; // e.g. 1200
}

export interface CompileResult {
    draft: any;
    notes: string[];
    usedCalls: number;
}

function sliceTranscript(t: Transcript, maxChars = 6000): string {
    const tail = t.turns.slice(Math.max(0, t.turns.length - 12));
    const s = tail.map(x => `[${x.speaker}] ${x.text}`).join("\n\n");
    return s.length > maxChars ? s.slice(-maxChars) : s;
}

function safeParseJson(text: string): any | null {
    const s = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
    const start = s.indexOf("{");
    if (start < 0) return null;
    let depth = 0;
    for (let i = start; i < s.length; i++) {
        if (s[i] === "{") depth++;
        if (s[i] === "}") depth--;
        if (depth === 0) {
            const candidate = s.slice(start, i + 1);
            try { return JSON.parse(candidate); } catch { return null; }
        }
    }
    return null;
}

export async function compileCrystalRLM(params: {
    transcript: Transcript;
    llm: LLMClient;
    budget: Budget;
    cacheGet: (key: string) => any | null;
    cacheSet: (key: string, val: any) => void;
}): Promise<CompileResult> {
    const { transcript, llm, budget, cacheGet, cacheSet } = params;
    const notes: string[] = [];

    const slice = sliceTranscript(transcript, 6500);
    const cacheKey = await sha256Hex(`crystalize_v1\n${llm.name}\n${slice}`);
    const cached = cacheGet(cacheKey);
    if (cached) {
        notes.push("cache_hit");
        return { draft: cached, notes, usedCalls: 0 };
    }

    let usedCalls = 0;

    // 1) create
    const prompt = buildCrystalizePrompt({ transcriptSlice: slice, mode: "create" });
    let resp = await llm.call({ prompt, maxTokens: budget.maxTokensPerCall, temperature: 0 });
    usedCalls++;

    let draft = safeParseJson(resp.text);
    if (!draft) {
        notes.push("create_parse_failed");
        draft = {};
    }

    let issues = validateDraft(draft);
    notes.push(`create_quality=${issues.quality.toFixed(2)} missing=${issues.missing.join(",") || "-"}`);

    // 2) repair loop (maxCalls)
    while (usedCalls < budget.maxCalls && issues.quality < 0.86) {
        const current = JSON.stringify(draft);
        const prompt = buildCrystalizePrompt({
            transcriptSlice: slice,
            mode: "repair",
            issues: { missing: issues.missing, warnings: issues.warnings },
            currentCrystalJson: current.length > 7000 ? current.slice(0, 7000) : current
        });

        resp = await llm.call({ prompt, maxTokens: budget.maxTokensPerCall, temperature: 0 });
        usedCalls++;

        const next = safeParseJson(resp.text);
        if (next) draft = next;
        issues = validateDraft(draft);
        notes.push(`repair_quality=${issues.quality.toFixed(2)} missing=${issues.missing.join(",") || "-"}`);
    }

    // 3) minimize (1 call if still allowed and too large)
    if (usedCalls < budget.maxCalls && issues.tooLarge) {
        const current = JSON.stringify(draft);
        const prompt = buildCrystalizePrompt({
            transcriptSlice: "", // minimization doesn't need transcript
            mode: "minimize",
            currentCrystalJson: current.length > 7000 ? current.slice(0, 7000) : current
        });

        resp = await llm.call({ prompt, maxTokens: Math.min(800, budget.maxTokensPerCall), temperature: 0 });
        usedCalls++;

        const next = safeParseJson(resp.text);
        if (next) draft = next;
        notes.push("minimize_done");
    }

    cacheSet(cacheKey, draft);
    return { draft, notes, usedCalls };
}
