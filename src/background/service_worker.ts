type BridgeState = {
    activeContextId?: string;
    lastHost?: string;
};

const STATE_KEY = "nb_state_v1";

async function getState(): Promise<BridgeState> {
    const res = await chrome.storage.local.get(STATE_KEY);
    return (res[STATE_KEY] ?? {}) as BridgeState;
}

async function setState(patch: Partial<BridgeState>) {
    const prev = await getState();
    await chrome.storage.local.set({ [STATE_KEY]: { ...prev, ...patch } });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("[NeuralBridge] installed");
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
        if (msg?.type === "NB_SET_ACTIVE_CONTEXT") {
            await setState({ activeContextId: msg.contextId, lastHost: msg.host });
            sendResponse({ ok: true });
            return;
        }
        if (msg?.type === "NB_GET_STATE") {
            const state = await getState();
            sendResponse({ ok: true, state });
            return;
        }
        sendResponse({ ok: false, error: "unknown_message" });
    })();
    return true;
});
