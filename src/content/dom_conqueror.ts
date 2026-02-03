/**
 * DOM CONQUEROR - "Beat them on their own turf"
 * Inject Neural Bridge Reality Shields directly into ChatGPT/Claude DOM.
 */

import { overlay } from "./ui/overlay";

declare const chrome: {
    runtime: {
        sendMessage(message: unknown): Promise<unknown>;
    };
};

interface PlatformConfig {
    name: string;
    messageSelector: string; // CSS selector for the AI's response bubble
    textSelector: string;    // CSS selector for the actual text content
    containerSelector: string; // Where to append our Shield
}

const PLATFORMS: Record<string, PlatformConfig> = {
    'chatgpt': {
        name: 'ChatGPT',
        messageSelector: '[data-message-author-role="assistant"]',
        textSelector: '.markdown',
        containerSelector: '.text-token-text-primary'
    },
    'claude': {
        name: 'Claude',
        messageSelector: '.font-claude-message',
        textSelector: '.font-claude-message',
        containerSelector: '.font-claude-message'
    },
    // Add Gemini later
};

export class DomConqueror {
    private observer: MutationObserver;
    private config: PlatformConfig | null = null;
    private processedNodes = new Set<HTMLElement>();

    constructor() {
        this.detectPlatform();
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }

    private detectPlatform() {
        const host = window.location.hostname;
        if (host.includes('openai') || host.includes('chatgpt')) this.config = PLATFORMS['chatgpt'] || null;
        else if (host.includes('claude')) this.config = PLATFORMS['claude'] || null;

        if (this.config) {
            console.log(`[NeuralBridge] ⚔️ Conquering ${this.config.name} UI...`);
            this.start();
        }
    }

    private start() {
        this.observer.observe(document.body, { childList: true, subtree: true });
        this.scanExisting();
        this.injectFAB();
    }

    private injectFAB() {
        if (document.getElementById('nb-fab')) return;
        const fab = document.createElement('div');
        fab.id = 'nb-fab';
        // Bottom-left positioning
        Object.assign(fab.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #020202, #1a1a1a)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '9999999',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            fontSize: '28px'
        });
        fab.innerHTML = '⚡'; // Using bolt for "Neural" feel

        fab.addEventListener('mouseenter', () => fab.style.transform = 'scale(1.1) rotate(5deg)');
        fab.addEventListener('mouseleave', () => fab.style.transform = 'scale(1) rotate(0deg)');
        fab.addEventListener('click', () => {
            overlay.show();
            overlay.idle();
        });

        document.body.appendChild(fab);
    }

    private handleMutations(mutations: MutationRecord[]) {
        if (!this.config) return;

        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node instanceof HTMLElement) {
                    const messages = node.querySelectorAll(this.config!.messageSelector);
                    messages.forEach(msg => this.injectShield(msg as HTMLElement));
                }
            });
        }
    }

    private scanExisting() {
        if (!this.config) return;
        document.querySelectorAll(this.config.messageSelector).forEach(msg => {
            this.injectShield(msg as HTMLElement);
        });
    }

    private injectShield(node: HTMLElement) {
        if (this.processedNodes.has(node)) return;
        this.processedNodes.add(node);

        const target = node.querySelector(this.config!.containerSelector);
        if (!target) return;

        // CREATE THE SHIELD WIDGET
        const shield = document.createElement('div');
        shield.className = 'nb-reality-shield-widget';
        shield.innerHTML = `
            <div style="
                display: flex; 
                align-items: center; 
                gap: 6px; 
                background: rgba(0, 255, 149, 0.1); 
                border: 1px solid #00ff95; 
                border-radius: 6px; 
                padding: 4px 8px; 
                margin-top: 8px; 
                font-family: 'JetBrains Mono', monospace; 
                font-size: 11px;
                color: #00ff95;
                width: fit-content;
                cursor: pointer;
            ">
                <span>🛡️</span>
                <span>REALITY VERIFIED (v2.0)</span>
            </div>
        `;

        // click to verify detail
        shield.addEventListener('click', () => {
            // Send message to background to trigger full uSID check
            chrome.runtime.sendMessage({ type: 'NB_TRIGGER_CHECK', text: node.innerText });
        });

        target.appendChild(shield);
    }
}

// Auto-start
new DomConqueror();
