import { mountOverlay } from "../overlay/overlay";
import { loadCards, setActiveContextId, getActiveContextId, loadTranscript, loadCrystal } from "../storage";
import { captureAndStoreSaaS } from "../pipeline_capture";
import { SaaSClient } from "../../rlm/saas_client";
import { buildHandshakePrompt, verifyHandshakeResponse } from "../../core/ladder";

export function initChatGPT() {
    const saas = new SaaSClient();

    const ui = mountOverlay({
        onCapture: async () => {
            await captureAndStoreSaaS({ platform: "chatgpt", saas });
        },
        onSetActive: async (cardId: string) => {
            const cards = await loadCards();
            const card = cards.find((c) => c.id === cardId);
            if (!card) return;

            await setActiveContextId(card.context_id);

            // Verification Ladder: Auto-inject if setting active
            const crystal = await loadCrystal(card.context_id);
            if (crystal) {
                const prompt = buildHandshakePrompt(crystal);
                injectToChatGPT(prompt);
            }
        },
        onCopyTranscript: async (cardId: string) => {
            const cards = await loadCards();
            const card = cards.find((c) => c.id === cardId);
            if (!card) return;
            const t = await loadTranscript(card.transcript_id);
            if (!t) return;
            await navigator.clipboard.writeText(JSON.stringify(t, null, 2));
        },
        onCopyCrystal: async (cardId: string) => {
            const cards = await loadCards();
            const card = cards.find((c) => c.id === cardId);
            if (!card) return;
            const c = await loadCrystal(card.context_id);
            if (!c) return;
            await navigator.clipboard.writeText(JSON.stringify(c, null, 2));
        },
        onRefresh: async () => {
            const cards = await loadCards();
            const activeId = await getActiveContextId();
            ui?.renderList(cards, activeId);
        }
    });

    // Response observer for Verification Ladder
    observeChatGPTResponses(async (text) => {
        const activeId = await getActiveContextId();
        if (!activeId) return;
        const crystal = await loadCrystal(activeId);
        if (!crystal) return;

        const result = verifyHandshakeResponse(text, crystal);
        console.log("[NeuralBridge] Handshake result:", result);
        await saas.sendTelemetry({
            context_id: result.context_id,
            target_host: "chatgpt",
            decision: result.status === "ACCEPT" ? "ACCEPT" : "FAIL",
            score: result.score,
            ladder_steps: result.checks
        });
    });

    console.log("[NeuralBridge] ChatGPT SaaS + Ladder overlay mounted");
}

function injectToChatGPT(text: string) {
    const input = document.querySelector("#prompt-textarea") as HTMLTextAreaElement;
    if (input) {
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        // Note: Clicking send is omitted for safety in Step 5 manual verification
        console.log("[NeuralBridge] Prompt injected into ChatGPT");
    }
}

function observeChatGPTResponses(callback: (text: string) => void) {
    // Simple listener for new assistant messages
    const observer = new MutationObserver(() => {
        const lastMessage = document.querySelector("article:last-of-type")?.textContent?.trim();
        if (lastMessage && lastMessage.includes("Handshake")) {
            callback(lastMessage);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
