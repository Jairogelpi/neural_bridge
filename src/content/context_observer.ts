import { DomainHeuristics } from '../services/domain_heuristics';
import { FirewallOverlay } from '../ui/firewall_overlay';

/**
 * CONTEXT OBSERVER
 * Watches the user's input in ChatGPT, Claude, and Gemini.
 * Triggers the "Silent Guardian" flow when a Source of Truth is detected.
 */
export class ContextObserver {
    private lastDetection: number = 0;
    private detectionCooldown: number = 3000; // 3 seconds

    public start() {
        console.log("[NeuralBridge] Context Observer active.");

        // Use a MutationObserver to find the input field (dynamic loading)
        const observer = new MutationObserver(() => {
            const input = this.findInputField();
            if (input) {
                this.attachListener(input);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Initial check
        const initialInput = this.findInputField();
        if (initialInput) this.attachListener(initialInput);
    }

    private findInputField(): HTMLTextAreaElement | HTMLDivElement | null {
        // ChatGPT: #prompt-textarea
        // Claude: [contenteditable="true"]
        // Gemini: .input-area textarea
        return document.querySelector('#prompt-textarea') ||
            document.querySelector('[contenteditable="true"]') ||
            document.querySelector('.input-area textarea');
    }

    private attachListener(input: HTMLElement) {
        if ((input as any)._nb_observed) return;
        (input as any)._nb_observed = true;

        input.addEventListener('input', (e) => {
            const text = (input instanceof HTMLTextAreaElement) ? input.value : input.innerText;
            if (text.length < 30) return; // Ignore short fragments

            const now = Date.now();
            if (now - this.lastDetection < this.detectionCooldown) return;

            const sot = DomainHeuristics.detectSourceOfTruth(text);
            if (sot.isSOT && sot.confidence > 0.6) {
                this.lastDetection = now;
                console.log(`[NeuralBridge] Source of Truth detected (${sot.type}). Triggering invitation.`);
                FirewallOverlay.showProtectInvitation(sot.type);
            }
        });
    }
}
