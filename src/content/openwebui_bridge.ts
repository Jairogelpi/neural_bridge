
/**
 * OPENWEBUI BRIDGE INJECTION 🌉💎
 * 
 * Capability: Revolutionary UI Integration.
 * Detects OpenWebUI chat interface and injects "Neural Bridge" context.
 */

class OpenWebUIBridge {
    private observer: MutationObserver | null = null;
    private injectButton: HTMLButtonElement | null = null;

    constructor() {
        console.log("[NeuralBridge] 🌉 OpenWebUI Bridge Initialized.");
        this.init();
    }

    private init() {
        this.observer = new MutationObserver(() => this.findChatInput());
        this.observer.observe(document.body, { childList: true, subtree: true });
        this.findChatInput();
    }

    private findChatInput() {
        // OpenWebUI usually has a textarea or a contenteditable div for chat
        const inputContainer = document.querySelector('#chat-textarea')?.parentElement;

        if (inputContainer && !document.querySelector('#nb-inject-btn')) {
            this.injectUI(inputContainer);
        }
    }

    private injectUI(container: Element) {
        console.log("[NeuralBridge] 💉 Injecting Bridge UI...");

        const btn = document.createElement('button');
        btn.id = 'nb-inject-btn';
        btn.innerHTML = `
            <div style="display:flex; align-items:center; gap:5px; padding: 4px 8px; background: rgba(0, 242, 255, 0.1); border: 1px solid rgba(0, 242, 255, 0.3); border-radius: 8px; color: #00f2ff; font-family: sans-serif; font-size: 10px; font-weight: bold; cursor: pointer; transition: all 0.2s;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                INJECT TRUTH
            </div>
        `;
        btn.style.marginRight = '8px';
        btn.style.border = 'none';
        btn.style.background = 'none';
        btn.onclick = (e) => {
            e.preventDefault();
            this.handleInjection();
        };

        // Insert before the textarea
        container.prepend(btn);
    }

    private async handleInjection() {
        const textarea = document.querySelector('#chat-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        console.log("[NeuralBridge] 🕯️ Retrieving active crystals for injection...");

        // Request context from background script
        chrome.runtime.sendMessage({ type: "GET_BRIDGE_PAYLOAD" }, (response) => {
            if (response && response.payload) {
                const currentText = textarea.value;
                textarea.value = `[NEURAL_BRIDGE_GROUNDING]\n---\n${response.payload}\n---\n${currentText}`;

                // Trigger input event to let OpenWebUI know content changed
                textarea.dispatchEvent(new Event('input', { bubbles: true }));

                console.log("[NeuralBridge] ✨ Truth injected successfully. Monitoring for refinement...");

                // Start monitoring for the response to refine knowledge
                this.monitorForResponse();

                // Visual feedback
                const btn = document.querySelector('#nb-inject-btn > div') as HTMLElement;
                if (btn) {
                    btn.style.borderColor = "#00ff88";
                    btn.style.color = "#00ff88";
                    setTimeout(() => {
                        btn.style.borderColor = "rgba(0, 242, 255, 0.3)";
                        btn.style.color = "#00f2ff";
                    }, 2000);
                }
            }
        });
    }

    private monitorForResponse() {
        let lastText = "";
        let stableCount = 0;

        const monitorInterval = setInterval(() => {
            // OpenWebUI usually appends responses to the chat log
            const messages = document.querySelectorAll('.chat-message.assistant');
            const lastMessage = messages[messages.length - 1] as HTMLElement;

            if (lastMessage) {
                const currentText = lastMessage.innerText;
                if (currentText === lastText && currentText.length > 10) {
                    stableCount++;
                } else {
                    stableCount = 0;
                    lastText = currentText;
                }

                // If text hasn't changed for 3 checks (1.5s), consider it finished
                if (stableCount >= 3) {
                    clearInterval(monitorInterval);
                    console.log("[NeuralBridge] 🧬 Interaction stable. Sending for Recursive Refinement.");
                    chrome.runtime.sendMessage({
                        type: "NB_REFINE_KNOWLEDGE",
                        interactionResult: lastText
                    });
                }
            }
        }, 500);
    }
}

new OpenWebUIBridge();
