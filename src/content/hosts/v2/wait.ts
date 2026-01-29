// Smart Wait - MutationObserver-based stable text detection

import { sleep, normalizeWS } from "./dom";

/**
 * Wait for text to stabilize (stop changing)
 * Uses polling instead of MutationObserver for reliability across hosts
 */
export async function waitForStableText(
    getText: () => string,
    opts?: { timeoutMs?: number; stableMs?: number }
): Promise<string> {
    const timeoutMs = opts?.timeoutMs ?? 25_000;
    const stableMs = opts?.stableMs ?? 900;

    const start = Date.now();
    let last = normalizeWS(getText());
    let lastChange = Date.now();

    while (Date.now() - start < timeoutMs) {
        await sleep(250);
        const now = normalizeWS(getText());

        if (now !== last) {
            last = now;
            lastChange = Date.now();
        }

        // Text is non-empty and hasn't changed for stableMs
        if (now && Date.now() - lastChange >= stableMs) {
            return now;
        }
    }

    return normalizeWS(getText());
}

/**
 * Wait for new content to appear (different from initial)
 */
export async function waitForNewContent(
    getText: () => string,
    initialText: string,
    opts?: { timeoutMs?: number; stableMs?: number }
): Promise<string> {
    const timeoutMs = opts?.timeoutMs ?? 25_000;
    const stableMs = opts?.stableMs ?? 900;

    const start = Date.now();
    const initial = normalizeWS(initialText);
    let last = initial;
    let lastChange = Date.now();

    while (Date.now() - start < timeoutMs) {
        await sleep(250);
        const now = normalizeWS(getText());

        if (now !== last) {
            last = now;
            lastChange = Date.now();
        }

        // Text is different from initial and stable
        if (now !== initial && now && Date.now() - lastChange >= stableMs) {
            return now;
        }
    }

    return normalizeWS(getText());
}

/**
 * Wait using MutationObserver (more efficient but less reliable)
 */
export function waitForMutation(
    target: Node,
    opts?: { timeoutMs?: number; subtree?: boolean }
): Promise<void> {
    return new Promise((resolve) => {
        const timeout = opts?.timeoutMs ?? 10_000;

        const observer = new MutationObserver(() => {
            observer.disconnect();
            resolve();
        });

        observer.observe(target, {
            childList: true,
            subtree: opts?.subtree ?? true,
            characterData: true,
        });

        setTimeout(() => {
            observer.disconnect();
            resolve();
        }, timeout);
    });
}
