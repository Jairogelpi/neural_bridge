// Host Adapters V2 Index
// Auto-detection and unified exports

import type { HostAdapterV2, HostName } from "./types";
import { ChatGPTV2 } from "./chatgpt";
import { GeminiV2 } from "./gemini";
import { ClaudeV2 } from "./claude";

export const HOSTS_V2: HostAdapterV2[] = [ChatGPTV2, GeminiV2, ClaudeV2];

/**
 * Detect current host and return appropriate adapter
 */
export function detectHostV2(): HostAdapterV2 {
    for (const h of HOSTS_V2) {
        if (h.detect()) return h;
    }

    // Fallback unknown adapter
    return {
        name: "unknown",
        detect: () => true,
        findInput: () => null,
        clickSend: () => false,
        findAssistantMessages: () => [],
        getLastAssistantText: () => "",
        waitForAssistantTurn: async () => "",
        debugSnapshot: () => ({ host: "unknown" as HostName, url: location.href }),
    };
}

/**
 * Get adapter by name
 */
export function getHostByName(name: HostName): HostAdapterV2 | null {
    return HOSTS_V2.find(h => h.name === name) ?? null;
}

// Re-export types and utilities
export * from "./types";
export * from "./dom";
export * from "./input";
export * from "./wait";
export * from "./send";
export * from "./read";
export { ChatGPTV2 } from "./chatgpt";
export { GeminiV2 } from "./gemini";
export { ClaudeV2 } from "./claude";
