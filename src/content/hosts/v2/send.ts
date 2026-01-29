// Smart Send - Intelligent message injection
// Handles both click and keyboard fallbacks

import type { HostAdapterV2 } from "./types";
import { sleep } from "./dom";

export interface SendResult {
    success: boolean;
    method: "click" | "keyboard" | "failed";
    inputKind?: string;
}

/**
 * Smart send - tries multiple methods to send a message
 */
export async function smartSend(
    host: HostAdapterV2,
    text: string
): Promise<SendResult> {
    const input = host.findInput();
    if (!input) {
        return { success: false, method: "failed" };
    }

    // Focus and set text
    input.focus();
    await sleep(50);
    input.setText(text);
    await sleep(100);

    // Method 1: Try click send button
    if (host.clickSend()) {
        return { success: true, method: "click", inputKind: input.kind };
    }

    // Method 2: Keyboard Enter
    await sleep(50);
    const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        key: "Enter",
        code: "Enter",
        keyCode: 13,
    });
    input.el.dispatchEvent(enterEvent);

    // Also try keypress and keyup for compatibility
    input.el.dispatchEvent(new KeyboardEvent("keypress", {
        bubbles: true, key: "Enter", code: "Enter", keyCode: 13
    }));
    input.el.dispatchEvent(new KeyboardEvent("keyup", {
        bubbles: true, key: "Enter", code: "Enter", keyCode: 13
    }));

    return { success: true, method: "keyboard", inputKind: input.kind };
}

/**
 * Clear the input field
 */
export function clearInput(host: HostAdapterV2): boolean {
    const input = host.findInput();
    if (!input) return false;

    input.focus();
    if (input.kind === "textarea") {
        (input.el as HTMLTextAreaElement).value = "";
    } else {
        input.el.textContent = "";
    }
    input.el.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
}
