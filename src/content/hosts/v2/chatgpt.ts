// ChatGPT Host Adapter V2
// Robust multi-selector with network tap fallback

import type { HostAdapterV2, HostDebugSnapshot } from "./types";
import { qsa, textContentSafe, normalizeWS, trySelectors } from "./dom";
import { makeTextareaHandle, makeContentEditableHandle } from "./input";
import { waitForStableText } from "./wait";
import { installNetworkTap } from "../../networkTap/installTap";
import { popLastTapText } from "../../networkTap/listenTap";

export const ChatGPTV2: HostAdapterV2 = {
    name: "chatgpt",

    detect(): boolean {
        return location.host.includes("chat.openai.com") || location.host.includes("chatgpt.com");
    },

    async enableNetworkTap(): Promise<void> {
        await installNetworkTap();
    },

    popLastNetworkAnswer(): string | null {
        return popLastTapText();
    },

    findInput() {
        // 1) Textarea (most common)
        const textareaSelectors = [
            "textarea#prompt-textarea",
            "textarea[data-id='prompt-textarea']",
            "textarea",
        ];
        const ta = trySelectors<HTMLTextAreaElement>(textareaSelectors);
        if (ta) return makeTextareaHandle(ta);

        // 2) Contenteditable fallback
        const ceSelectors = [
            '[contenteditable="true"][data-id="prompt-textarea"]',
            '[contenteditable="true"]',
            '[contenteditable=""]',
        ];
        const ce = trySelectors<HTMLElement>(ceSelectors);
        if (ce) return makeContentEditableHandle(ce);

        return null;
    },

    clickSend(): boolean {
        const buttonSelectors = [
            'button[data-testid="send-button"]',
            'button[aria-label="Send prompt"]',
            'button[aria-label="Send"]',
            'button[aria-label*="Send"]',
            'button[type="submit"]',
        ];

        for (const sel of buttonSelectors) {
            const b = trySelectors<HTMLButtonElement>([sel]);
            if (b && !b.disabled) {
                b.click();
                return true;
            }
        }
        return false;
    },

    findAssistantMessages(): HTMLElement[] {
        // Multiple selectors (OpenAI changes often)
        const selectors = [
            '[data-message-author-role="assistant"]',
            'div[data-testid*="conversation-turn"][data-testid*="assistant"]',
            'article [data-testid="conversation-turn"]',
            'div.agent-turn',
            'div[role="presentation"] .markdown',
        ];

        for (const sel of selectors) {
            const els = qsa<HTMLElement>(sel).filter(e => textContentSafe(e).length > 10);
            if (els.length > 0) return els;
        }
        return [];
    },

    getLastAssistantText(): string {
        const msgs = this.findAssistantMessages();
        const last = msgs[msgs.length - 1] ?? null;
        return normalizeWS(textContentSafe(last));
    },

    async waitForAssistantTurn(opts?): Promise<string> {
        return await waitForStableText(
            () => this.getLastAssistantText(),
            { timeoutMs: opts?.timeoutMs ?? 25_000 }
        );
    },

    debugSnapshot(): HostDebugSnapshot {
        const input = this.findInput();
        return {
            host: this.name,
            url: location.href,
            inputKind: input?.kind ?? null,
            lastAssistantLen: this.getLastAssistantText().length,
            assistantCount: this.findAssistantMessages().length,
        };
    },
};
