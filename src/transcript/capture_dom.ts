import type { Transcript, Turn } from "./transcript";

function pickMain(): Element {
    return document.querySelector("main") ?? document.body;
}

/**
 * Transcript-aware capture.
 * Identifies messages/turns.
 */
export function captureTranscriptFromDOM(params: { platform: "chatgpt" | "gemini" | "claude" | "other"; capture_method?: string }): Transcript {
    const { platform } = params;
    const main = pickMain();
    // Generate secure random ID
    const randomBytes = new Uint8Array(8);
    crypto.getRandomValues(randomBytes);
    const randomHex = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
    const transcript_id = `tx_${Date.now()}_${randomHex}`;

    // Product-grade: attempt to find message pairs
    // Fallback to role-based filtering if specific selectors fail
    const turns: Turn[] = [];

    // This is a generic heuristic that works across most chat UIs by density and role
    const blocks = Array.from(main.querySelectorAll('[role="article"], article, .message, .chat-line'));

    for (const b of blocks) {
        const text = (b.textContent ?? "").trim();
        if (text.length < 2) continue;

        // Simple speaker detection: often the first few words or a specific class
        let speaker: "user" | "assistant" = "assistant";
        const lower = b.innerHTML.toLowerCase();
        if (lower.includes("user") || lower.includes("you") || b.querySelector('[aria-label*="user"], .user-icon')) {
            speaker = "user";
        }

        turns.push({ speaker, text });
    }

    // Backup if blocks failed: density based
    if (turns.length < 2) {
        const divs = Array.from(main.querySelectorAll("div")).filter(d => d.children.length === 0 && d.textContent?.trim().length! > 20);
        for (const d of divs) {
            turns.push({ speaker: "assistant", text: d.textContent!.trim() });
        }
    }

    return {
        transcript_id,
        source: {
            platform: platform as "chatgpt" | "gemini" | "claude" | "other",
            url: location.href,
            timestamp: new Date().toISOString()
        },
        turns: turns.slice(-50) // Keep last 50 turns
    };
}
