import { mountOverlay } from "../overlay/overlay";
import { loadCards, setActiveContextId, getActiveContextId, loadTranscript, loadCrystal } from "../storage";
import { captureAndStoreSaaS } from "../pipeline_capture";
import { SaaSClient } from "../../rlm/saas_client";

export function initClaude() {
    const saas = new SaaSClient();

    const ui = mountOverlay({
        onCapture: async () => {
            await captureAndStoreSaaS({ platform: "claude", saas });
        },
        onSetActive: async (cardId: string) => {
            const cards = await loadCards();
            const card = cards.find((c) => c.id === cardId);
            if (card) await setActiveContextId(card.context_id);
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

    console.log("[NeuralBridge] Claude SaaS overlay mounted");
}
