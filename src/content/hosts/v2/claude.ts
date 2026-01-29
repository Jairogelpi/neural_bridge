// Claude Host Adapter V2
// Robust multi-selector with network tap fallback

import type { HostAdapterV2, HostDebugSnapshot } from "./types";
import { qsa, textContentSafe, normalizeWS, trySelectors } from "./dom";
import { makeTextareaHandle, makeContentEditableHandle } from "./input";
import { waitForStableText } from "./wait";
import { installNetworkTap } from "../../networkTap/installTap";
import { popLastTapText } from "../../networkTap/listenTap";

export const ClaudeV2: HostAdapterV2 = {
    name: "claude",

    detect(): boolean {
        return location.host.includes("claude.ai");
    },

    async enableNetworkTap(): Promise<void> {
        await installNetworkTap();
    },

    popLastNetworkAnswer(): string | null {
        return popLastTapText();
    },

    findInput() {
        // Claude typically uses contenteditable
        const ceSelectors = [
            'div[contenteditable="true"][data-placeholder]',
            'div.ProseMirror[contenteditable="true"]',
            'div[contenteditable="true"]',
            'div[contenteditable=""]',
        ];
        const ce = trySelectors<HTMLElement>(ceSelectors);
        if (ce) return makeContentEditableHandle(ce);

        // Fallback to textarea
        const taSelectors = [
            "textarea[placeholder*='message']",
            "textarea",
        ];
        const ta = trySelectors<HTMLTextAreaElement>(taSelectors);
        if (ta) return makeTextareaHandle(ta);

        return null;
    },

    clickSend(): boolean {
        const buttonSelectors = [
            'button[aria-label="Send Message"]',
            'button[aria-label="Send"]',
            'button[aria-label*="Send"]',
            'button[aria-label*="Enviar"]',
            'button[type="submit"]',
            'button.send-button',
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
        const selectors = [
            'div[data-is-streaming]',
            'div[data-testid="message-assistant"]',
            'div[data-is-assistant-message="true"]',
            'div.font-claude-message',
            'article .markdown',
            '[role="article"] .markdown',
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
