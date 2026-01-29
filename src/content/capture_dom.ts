function pickMain(): Element {
    return document.querySelector("main") ?? document.body;
}

/**
 * Best-effort transcript capture.
 * Product-grade approach: don't depend on classes; prefer semantic roles & density.
 */
export function captureRawTranscriptText(): string {
    const main = pickMain();

    // Prefer role-based blocks
    const blocks = Array.from(main.querySelectorAll('[role="article"], [role="listitem"], article, section'));
    const dense = blocks.filter(b => ((b.textContent ?? "").trim().length > 80));

    const chosen = dense.length ? dense : Array.from(main.querySelectorAll("div")).filter(d => ((d.textContent ?? "").trim().length > 200)).slice(0, 50);

    // Join with separators to preserve some structure
    const parts: string[] = [];
    for (const el of chosen) {
        const t = (el.textContent ?? "").trim();
        if (!t) continue;
        // avoid duplicates
        if (parts.length && parts[parts.length - 1] === t) continue;
        parts.push(t);
        if (parts.length >= 40) break;
    }

    // If nothing found, fallback to full main text
    if (!parts.length) {
        const t = (main.textContent ?? "").trim();
        return t;
    }

    return parts.join("\n\n---\n\n");
}
