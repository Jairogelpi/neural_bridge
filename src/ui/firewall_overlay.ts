import { TrustState } from "../content/firewall_agent";

export interface IFirewallOverlay {
    render(): void;
    update(state: TrustState, sri: number, reason?: string): void;
    showProtectInvitation(type: string): void;
    showFixButton(): void;
    applyContentBlur(): void;
}

export const FirewallOverlay: IFirewallOverlay & { _lastReason?: string } = {
    _lastReason: "",
    render() {
        if (document.getElementById('nb-firewall-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'nb-firewall-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            backdrop-filter: blur(12px);
        `;

        const indicator = document.createElement('div');
        indicator.id = 'nb-trust-indicator';
        indicator.style.cssText = `
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #ffffff;
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
        `;

        overlay.appendChild(indicator);
        document.body.appendChild(overlay);

        // Tooltip logic
        overlay.title = "Neural Bridge: Initializing...";
    },

    update(state: TrustState, sri: number, reason?: string) {
        if (reason) this._lastReason = reason;
        const indicator = document.getElementById('nb-trust-indicator');
        const overlay = document.getElementById('nb-firewall-overlay');
        if (!indicator || !overlay) return;

        let color = '#aaa';
        let glow = '#aaa';
        let label = "Analyzing...";

        switch (state) {
            case 'idle':
                color = '#555';
                glow = 'transparent';
                label = "Idle";
                break;
            case 'scanning':
                color = '#00d4ff';
                glow = '#00d4ff';
                label = "Scanning Context...";
                indicator.animate([
                    { opacity: 0.3 },
                    { opacity: 1 }
                ], { duration: 1000, iterations: Infinity });
                break;
            case 'verified':
                color = '#00ffaa';
                glow = '#00ffaa';
                label = `Reasoning Verified`;
                break;
            case 'warning':
                color = '#ffcc00';
                glow = '#ffcc00';
                label = `Reviewing Reasoning...`;
                break;
            case 'blocked':
                color = '#ff3366';
                glow = '#ff3366';
                label = `Logic Violation Detected`;
                this.applyContentBlur();
                this.showFixButton();
                break;
        }

        indicator.style.background = color;
        indicator.style.boxShadow = `0 0 10px ${glow}`;
        overlay.title = `Neural Bridge: ${label}`;
    },

    showProtectInvitation(type: string) {
        if (document.getElementById('nb-protect-chip')) return;

        const chip = document.createElement('div');
        chip.id = 'nb-protect-chip';
        chip.innerHTML = `
            <img src="https://img.icons8.com/material-rounded/24/ffffff/shield.png" style="width: 14px; margin-right: 8px;">
            Protect ${type} logic?
        `;
        chip.style.cssText = `
            position: fixed;
            bottom: 84px;
            right: 24px;
            background: rgba(0, 229, 255, 0.9);
            color: #000;
            padding: 8px 16px;
            border-radius: 20px;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            cursor: pointer;
            z-index: 100000;
            box-shadow: 0 4px 12px rgba(0, 229, 255, 0.3);
            animation: chipFadeIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transition: all 0.3s;
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes chipFadeIn {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); opacity: 1; }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            #nb-protect-chip:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 229, 255, 0.5);
                filter: brightness(1.1);
            }
        `;
        document.head.appendChild(style);

        chip.onclick = async () => {
            chip.innerHTML = "✨ Context Protected";
            chip.style.background = "#fff";

            // Detect platform
            const host = window.location.host;
            const platform = host.includes('chatgpt') ? 'chatgpt' :
                host.includes('claude') ? 'claude' :
                    host.includes('gemini') ? 'gemini' : 'other';

            const { captureAndStoreSaaS } = await import('../content/pipeline_capture');
            const { SaaSClient } = await import('../rlm/saas_client');
            await captureAndStoreSaaS({ platform: platform as any, saas: new SaaSClient() });

            setTimeout(() => {
                chip.style.opacity = '0';
                setTimeout(() => chip.remove(), 500);
            }, 2000);
        };

        document.body.appendChild(chip);

        // Auto-hide after 10 seconds if not clicked
        setTimeout(() => {
            if (document.body.contains(chip)) {
                chip.style.opacity = '0';
                setTimeout(() => chip.remove(), 500);
            }
        }, 10000);
    },

    showFixButton() {
        if (document.getElementById('nb-fix-button')) return;

        const btn = document.createElement('div');
        btn.id = 'nb-fix-button';
        btn.innerText = "🛠️ FIX WITH AI";
        btn.style.cssText = `
            position: fixed;
            bottom: 84px;
            right: 24px;
            background: #ff3366;
            color: #fff;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            z-index: 100001;
            box-shadow: 0 4px 15px rgba(255, 51, 102, 0.4);
            animation: bounceIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        btn.onclick = async () => {
            btn.innerText = "⏳ Repairing...";
            const containers = document.querySelectorAll('[data-message-author-role="assistant"], .markdown');
            const lastContainer = containers[containers.length - 1] as HTMLElement;
            if (!lastContainer) return;

            const originalText = lastContainer.innerText;

            const { VerificationService } = await import('../services/verification_service');
            const crystal = await VerificationService.getActiveCrystal();

            const repair = await VerificationService.suggestRepair({
                crystal,
                question: "Reflow Request",
                originalAnswer: originalText,
                failedInvariants: ["Reasoning Inconsistency", "Policy Violation", ...(this._lastReason ? [this._lastReason] : [])]
            });

            lastContainer.innerText = repair;
            lastContainer.style.filter = "none";
            lastContainer.style.background = "rgba(0, 255, 170, 0.05)";

            btn.innerText = "✅ REPAIRED";
            setTimeout(() => btn.remove(), 2000);
            this.update('verified', 0.98);
        };

        document.body.appendChild(btn);
    },

    applyContentBlur() {
        const containers = document.querySelectorAll('[data-message-author-role="assistant"], .markdown');
        containers.forEach(el => {
            (el as HTMLElement).style.filter = "blur(10px) grayscale(1)";
            (el as HTMLElement).style.pointerEvents = "none";
        });
    }
};
