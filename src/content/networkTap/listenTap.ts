// Network Tap Listener
// Receives captured network responses from MAIN world

let lastTapText: string | null = null;
let listenerInstalled = false;

export function startTapListener(): void {
    if (listenerInstalled) return;
    listenerInstalled = true;

    window.addEventListener("message", (ev) => {
        if (!ev?.data || ev.data.source !== "NEURAL_BRIDGE_TAP") return;
        const text = ev.data?.payload?.text;
        if (typeof text === "string" && text.length > 0) {
            lastTapText = text;
        }
    });
}

export function popLastTapText(): string | null {
    const t = lastTapText;
    lastTapText = null;
    return t;
}

export function peekLastTapText(): string | null {
    return lastTapText;
}
