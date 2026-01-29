import { HostAdapterV2 } from "./hosts/v2/types";
import { ChatGPTV2 } from "./hosts/v2/chatgpt";
import { ClaudeV2 } from "./hosts/v2/claude";
import { GeminiV2 } from "./hosts/v2/gemini";
import { DomainHeuristics, KnowledgeDomain } from "../services/domain_heuristics";
import { loadCrystal, loadCards } from "./storage";
import { VerificationService } from "../services/verification_service";

export type TrustState = 'idle' | 'scanning' | 'verified' | 'warning' | 'blocked';

export interface FirewallVerdict {
    state: TrustState;
    sri: number;
    reason?: string;
}

export class FirewallAgent {
    private host: HostAdapterV2 | null = null;
    private activeDomain: KnowledgeDomain = 'general';
    private mountedCrystals: any[] = [];
    private lastProcessedText: string = "";
    private checkInterval: any = null;

    constructor() {
        this.detectHost();
    }

    private detectHost() {
        if (ChatGPTV2.detect()) this.host = ChatGPTV2;
        else if (ClaudeV2.detect()) this.host = ClaudeV2;
        else if (GeminiV2.detect()) this.host = GeminiV2;
    }

    public async mountDomainCrystals() {
        if (!this.host) return;

        const initialText = this.host.getLastAssistantText();
        const detected = DomainHeuristics.detect(initialText || document.title);

        this.activeDomain = detected.domain;
        console.log(`[NeuralFirewall] Domain detected: ${this.activeDomain} (${detected.confidence})`);

        this.mountedCrystals = await VerificationService.harvestCrystals({
            domain: this.activeDomain,
            text: initialText || document.title
        });

        if (this.mountedCrystals.length > 0) {
            chrome.storage.local.set({ nb_active_crystal_id: this.mountedCrystals[0].context_id });
        }
    }

    public startSilentMonitoring(onVerdict: (v: FirewallVerdict) => void) {
        if (!this.host) return;

        console.log(`[NeuralFirewall] Starting silent monitor on ${this.host.name}`);

        this.checkInterval = setInterval(async () => {
            await this.pulse(onVerdict);
        }, 3000);
    }

    public stop() {
        if (this.checkInterval) clearInterval(this.checkInterval);
    }

    private async pulse(onVerdict: (v: FirewallVerdict) => void) {
        if (!this.host) return;

        const currentText = this.host.getLastAssistantText();
        if (!currentText || currentText === this.lastProcessedText || currentText.length < 20) {
            return;
        }

        this.lastProcessedText = currentText;
        onVerdict({ state: 'scanning', sri: 0 });

        const d = DomainHeuristics.detect(currentText);
        if (d.domain !== this.activeDomain && d.confidence > 0.6) {
            this.activeDomain = d.domain;
            await this.mountDomainCrystals();
        }

        if (this.mountedCrystals.length === 0) {
            onVerdict({ state: 'idle', sri: 0, reason: "No crystals mounted" });
            return;
        }

        for (const crystal of this.mountedCrystals) {
            const result = await VerificationService.verify({
                context_id: crystal.context_id,
                domain: this.activeDomain,
                question: "Contextual Interception",
                answer: currentText,
                mode: 'passive',
                requester: "firewall_agent"
            });

            if (result && !result.passed) {
                onVerdict({
                    state: result.sri < 0.5 ? 'blocked' : 'warning',
                    sri: result.sri,
                    reason: result.issues[0] || 'Verification failed'
                });
                return;
            }
        }

        onVerdict({ state: 'verified', sri: 0.95 });
    }
}
