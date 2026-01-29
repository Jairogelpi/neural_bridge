import { TrustState } from "../content/firewall_agent";

export interface IFirewallOverlay {
    render(): void;
    update(state: TrustState, sri: number, reason?: string): void;
    showProtectInvitation(type: string): void;
    showFixButton(): void;
    applyContentBlur(): void;
    toggleReceipt(): void;
    _lastState: TrustState;
    _lastSri: number;
    _lastInvariants?: Array<{ id: string; passed: boolean; reason?: string }>;
}

export const FirewallOverlay: IFirewallOverlay & { _lastReason?: string, _lastInvariants?: Array<{ id: string; passed: boolean; reason?: string }> } = {
    _lastReason: "",
    _lastInvariants: [],
    _lastState: 'idle' as TrustState,
    _lastSri: 0,
    
    render() {
        if (document.getElementById('nb-firewall-overlay')) return;

        // Inject Design System
        const style = document.createElement('style');
        style.id = 'nb-design-system';
        style.textContent = `
            :root {
                --nb-bg-deep: #050508;
                --nb-bg-surface: #0a0a0f;
                --nb-bg-glass: rgba(20, 20, 25, 0.85);
                --nb-primary-glow: #00F0FF;
                --nb-primary-dim: rgba(0, 240, 255, 0.1);
                --nb-accent-violet: #7000FF;
                --nb-status-success: #00FF94;
                --nb-status-warning: #FFD600;
                --nb-status-error: #FF2E54;
                --nb-text-primary: #FFFFFF;
                --nb-text-secondary: #8F90A6;
                --nb-font-ui: 'Inter', system-ui, sans-serif;
                --nb-font-mono: 'JetBrains Mono', 'Space Mono', monospace;
                --nb-glass-border: 1px solid rgba(255, 255, 255, 0.08);
                --nb-glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                --nb-transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            #nb-firewall-overlay, #nb-receipt-panel, #nb-protect-chip {
                font-family: var(--nb-font-ui);
                -webkit-font-smoothing: antialiased;
            }
        `;
        document.head.appendChild(style);

        const overlay = document.createElement('div');
        overlay.id = 'nb-firewall-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--nb-bg-glass);
            border: var(--nb-glass-border);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2147483647; /* Max Z-Index */
            cursor: pointer;
            transition: transform var(--nb-transition);
            box-shadow: var(--nb-glass-shadow);
            backdrop-filter: blur(12px);
        `;
        
        // Hover effect
        overlay.onmouseenter = () => overlay.style.transform = 'scale(1.1)';
        overlay.onmouseleave = () => overlay.style.transform = 'scale(1)';

        const indicator = document.createElement('div');
        indicator.id = 'nb-trust-indicator';
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--nb-text-secondary);
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            transition: all var(--nb-transition);
        `;

        overlay.appendChild(indicator);
        
        // Interaction: Click to see Proof
        overlay.onclick = (e) => {
            e.stopPropagation();
            this.toggleReceipt();
        };

        document.body.appendChild(overlay);
        overlay.title = "Neural Bridge: Active";
    },

    update(state: TrustState, sri: number, reason?: string, invariants?: Array<{ id: string; passed: boolean; reason?: string }>) {
        this._lastState = state;
        this._lastSri = sri;
        if (reason) this._lastReason = reason;
        if (invariants) this._lastInvariants = invariants;

        const indicator = document.getElementById('nb-trust-indicator');
        const overlay = document.getElementById('nb-firewall-overlay');
        if (!indicator || !overlay) return;

        let color = 'var(--nb-text-secondary)';
        let glow = 'transparent';
        let label = "Idle";

        switch (state) {
            case 'idle':
                color = 'var(--nb-text-secondary)';
                break;
            case 'scanning':
                color = 'var(--nb-primary-glow)';
                glow = 'var(--nb-primary-glow)';
                label = "Scanning Context...";
                indicator.animate([
                    { opacity: 0.3 },
                    { opacity: 1 }
                ], { duration: 1000, iterations: Infinity });
                break;
            case 'verified':
                color = 'var(--nb-status-success)';
                glow = 'var(--nb-status-success)';
                label = "Verified Safe";
                break;
            case 'warning':
                color = 'var(--nb-status-warning)';
                glow = 'var(--nb-status-warning)';
                label = "Warning";
                break;
            case 'blocked':
                color = 'var(--nb-status-error)';
                glow = 'var(--nb-status-error)';
                label = "Blocked";
                this.applyContentBlur();
                this.showFixButton();
                break;
        }

        indicator.style.background = color;
        indicator.style.boxShadow = `0 0 15px ${glow}`;
        overlay.title = `Neural Bridge: ${label}`;
    },

    toggleReceipt() {
        const existing = document.getElementById('nb-receipt-panel');
        if (existing) {
            existing.style.opacity = '0';
            existing.style.transform = 'translateY(10px)';
            setTimeout(() => existing.remove(), 200);
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'nb-receipt-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 84px;
            right: 24px;
            width: 340px;
            background: var(--nb-bg-glass);
            border: var(--nb-glass-border);
            border-radius: 16px;
            padding: 20px;
            color: var(--nb-text-primary);
            z-index: 2147483647;
            box-shadow: var(--nb-glass-shadow);
            backdrop-filter: blur(24px);
            opacity: 0;
            transform: translateY(20px);
            transition: all var(--nb-transition);
        `;

        const statusColor = this._lastState === 'verified' ? 'var(--nb-status-success)' : (this._lastState === 'blocked' ? 'var(--nb-status-error)' : 'var(--nb-status-warning)');
        const statusText = this._lastState === 'verified' ? 'SECURE' : (this._lastState === 'blocked' ? 'BLOCKED' : 'WARNING');
        
        // Render Invariants List
        const invariantsHtml = (this._lastInvariants || []).map(inv => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-size:11px;color:var(--nb-text-secondary);flex:1;font-family:var(--nb-font-mono);">${inv.id.replace(/_/g, ' ')}</span>
                <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;background:${inv.passed ? 'rgba(0,255,148,0.1)' : 'rgba(255,46,84,0.1)'};color:${inv.passed ? 'var(--nb-status-success)' : 'var(--nb-status-error)'};">
                    ${inv.passed ? 'PASS' : 'FAIL'}
                </span>
            </div>
        `).join('');

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                <div style="display:flex;align-items:center;gap:8px;">
                     <div style="width:8px;height:8px;border-radius:50%;background:${statusColor};box-shadow:0 0 10px ${statusColor};"></div>
                     <span style="font-weight:700;font-size:12px;letter-spacing:1px;color:var(--nb-text-primary);">DECISION RECEIPT</span>
                </div>
                <span style="font-size:10px;color:var(--nb-text-secondary);font-family:var(--nb-font-mono);">${new Date().toLocaleTimeString()}</span>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
                <div style="background:rgba(255,255,255,0.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:9px;color:var(--nb-text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">SRI Score</div>
                    <div style="font-size:24px;font-weight:700;color:${statusColor};font-family:var(--nb-font-mono);">${(this._lastSri * 100).toFixed(0)}<span style="font-size:14px;opacity:0.7">%</span></div>
                </div>
                <div style="background:rgba(255,255,255,0.03);padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:9px;color:var(--nb-text-secondary);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Status</div>
                    <div style="font-size:14px;font-weight:600;color:var(--nb-text-primary);margin-top:6px;">${statusText}</div>
                </div>
            </div>

            <div style="margin-bottom:16px;">
                <div style="font-size:9px;color:var(--nb-text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Semantic Checks</div>
                <div style="max-height:140px;overflow-y:auto;padding-right:4px;">
                    ${invariantsHtml || '<div style="font-size:11px;color:var(--nb-text-secondary);font-style:italic;">Initializing checks...</div>'}
                </div>
            </div>
            
            ${this._lastReason ? `
            <div style="background:rgba(255,46,84,0.1);border-radius:8px;padding:10px;margin-bottom:16px;border:1px solid rgba(255,46,84,0.2);">
                <div style="font-size:9px;color:var(--nb-status-error);font-weight:700;margin-bottom:4px;text-transform:uppercase;">VIOLATION DETECTED</div>
                <div style="font-size:11px;color:var(--nb-text-primary);line-height:1.4;">${this._lastReason}</div>
            </div>` : ''}

            <div style="display:flex;align-items:center;justify-content:center;gap:6px;font-size:10px;color:var(--nb-text-secondary);opacity:0.7;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Cryptographically Verified
            </div>
        `;

        // Custom scrollbar style for this panel
        const style = document.createElement('style');
        style.textContent = `
            #nb-receipt-panel ::-webkit-scrollbar { width: 4px; }
            #nb-receipt-panel ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
            #nb-receipt-panel ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        `;
        panel.appendChild(style);

        document.body.appendChild(panel);
        
        // Animate in
        requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });
        
        // Auto-close on click outside
        const closeHandler = (e: MouseEvent) => {
            if (!panel.contains(e.target as Node) && !(e.target as HTMLElement).closest('#nb-firewall-overlay')) {
                panel.style.opacity = '0';
                panel.style.transform = 'translateY(10px)';
                setTimeout(() => panel.remove(), 200);
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 100);
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
