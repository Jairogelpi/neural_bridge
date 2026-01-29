// Smart Read - Intelligent response extraction
// DOM first, then network tap fallback

import type { HostAdapterV2 } from "./types";

export interface ReadResult {
    source: "dom" | "network" | "none";
    text: string;
}

/**
 * Smart read - tries DOM first, then network tap fallback
 */
export async function smartRead(
    host: HostAdapterV2,
    opts?: { timeoutMs?: number }
): Promise<ReadResult> {
    // 1) Enable network tap as backup
    if (host.enableNetworkTap) {
        await host.enableNetworkTap();
    }

    // 2) Wait for DOM stable text
    const domText = await host.waitForAssistantTurn({
        timeoutMs: opts?.timeoutMs ?? 25_000,
    });

    if (domText && domText.length > 20) {
        return { source: "dom", text: domText };
    }

    // 3) Network tap fallback
    const tap = host.popLastNetworkAnswer?.();
    if (tap && tap.length > 20) {
        return { source: "network", text: tap };
    }

    // 4) Minimal DOM text if available
    if (domText) {
        return { source: "dom", text: domText };
    }

    return { source: "none", text: "" };
}

/**
 * Read with initial baseline (wait for NEW content)
 */
export async function smartReadNew(
    host: HostAdapterV2,
    initialText: string,
    opts?: { timeoutMs?: number }
): Promise<ReadResult> {
    const timeoutMs = opts?.timeoutMs ?? 25_000;
    const start = Date.now();

    // Enable network tap
    if (host.enableNetworkTap) {
        await host.enableNetworkTap();
    }

    // Poll for new content
    while (Date.now() - start < timeoutMs) {
        await new Promise(r => setTimeout(r, 300));

        const current = host.getLastAssistantText();
        if (current && current !== initialText && current.length > initialText.length) {
            // Wait for it to stabilize
            const stable = await host.waitForAssistantTurn({ timeoutMs: 5000 });
            if (stable && stable !== initialText) {
                return { source: "dom", text: stable };
            }
        }
    }

    // Fallback to network tap
    const tap = host.popLastNetworkAnswer?.();
    if (tap && tap.length > 20) {
        return { source: "network", text: tap };
    }

    return { source: "none", text: "" };
}
