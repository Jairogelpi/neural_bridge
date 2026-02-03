
import { TalamicIndex } from './talamic_index';

/**
 * OPENWEBUI BRIDGE (The External Injector) 🌉🔌
 * 
 * Capability: Prompt Augmentation.
 * Injects sovereign knowledge into external LLM interfaces 
 * (OpenWebUI, ChatGPT, etc.) via prompt grounding.
 */
export class OpenWebUIBridge {

    /**
     * PREPARE INJECTION: Calculates the context to be injected into an external prompt.
     */
    static async prepareInjection(userQuery: string, crystalIds: string[]): Promise<string> {
        console.log(`[OpenWebUIBridge] 🔌 Preparing knowledge injection for external LLM...`);

        // 1. Retrieve Geometric Neighbors from Atlas
        const nodes = await TalamicIndex.search(userQuery, 3);

        // 2. Filter by specified Crystals
        const relevantNodes = nodes.filter(n =>
            crystalIds.includes(n.metadata.source_id) || n.metadata.is_crystallized
        );

        if (relevantNodes.length === 0) {
            return ""; // No grounding found
        }

        // 3. Format Grounding Block
        const groundingBlock = `
        --- NEURAL BRIDGE GROUNDING ---
        The following information is from your VERIFIED KNOWLEDGE BASE:
        ${relevantNodes.map(n => `[Axiom]: ${n.metadata.preview}`).join("\n")}
        --- END GROUNDING ---
        
        Note: Prioritize the axioms above for factual accuracy.
        `;

        console.log(`[OpenWebUIBridge] ✅ Injection payload ready (${relevantNodes.length} axioms).`);
        return groundingBlock;
    }

    /**
     * TRIGGER UI INJECTION: Conceptually send message to content script to type into chatbox.
     */
    static async triggerUIInjection(tabId: number, payload: string): Promise<void> {
        // In a real extension: chrome.tabs.sendMessage(tabId, { type: 'INJECT_KNOWLEDGE', payload });
        console.log(`[OpenWebUIBridge] 🚀 Triggering UI Injection into Tab ${tabId}.`);
    }
}
