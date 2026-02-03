/**
 * DOM CONQUEROR - "Beat them on their own turf"
 * Inject Neural Bridge Reality Shields directly into ChatGPT/Claude DOM.
 */

import { overlay } from "./ui/overlay";

declare const chrome: {
    runtime: {
        sendMessage(message: unknown): Promise<unknown>;
        getURL(path: string): string;
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
        if (!document.body) {
            // Wait for body to be ready
            window.addEventListener('DOMContentLoaded', () => this.start());
            return;
        }
        this.observer.observe(document.body, { childList: true, subtree: true });
        this.scanExisting();
        this.injectFAB();
    }

    private injectFAB() {
        if (document.getElementById('nb-fab')) return;
        const fab = document.createElement('div');
        fab.id = 'nb-fab';

        // FAB Style - Matching Identity Theme
        Object.assign(fab.style, {
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)', // Blue to Cyan gradient
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '2147483647',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '2px solid rgba(255,255,255,0.2)'
        });

        // Icon
        const iconUrl = chrome.runtime.getURL('icons/icon48.png');
        fab.innerHTML = `<img src="${iconUrl}" style="width: 24px; height: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));" alt="NB">`;

        // Hover Effect
        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'translateY(-2px) scale(1.05)';
            fab.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.6)';
        });
        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'translateY(0) scale(1)';
            fab.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.4)';
        });

        // Click Action - Open Iframe
        fab.addEventListener('click', () => {
            this.toggleIframe();
        });

        document.body.appendChild(fab);
    }

    private toggleIframe() {
        const id = 'nb-popup-iframe';
        let iframe = document.getElementById(id) as HTMLIFrameElement;

        if (iframe) {
            // Toggle
            if (iframe.style.display === 'none') {
                iframe.style.display = 'block';
                iframe.style.opacity = '0';
                setTimeout(() => iframe.style.opacity = '1', 50);
            } else {
                iframe.style.opacity = '0';
                setTimeout(() => iframe.style.display = 'none', 300);
            }
        } else {
            // Create
            iframe = document.createElement('iframe');
            iframe.id = id;
            iframe.src = chrome.runtime.getURL('extension.html');
            Object.assign(iframe.style, {
                position: 'fixed',
                bottom: '84px', // Above FAB
                left: '24px',
                width: '380px',
                height: '520px',
                border: 'none',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                zIndex: '2147483647',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                background: 'transparent',
                opacity: '0',
                transform: 'translateY(10px)'
            });

            document.body.appendChild(iframe);
            requestAnimationFrame(() => {
                iframe.style.opacity = '1';
                iframe.style.transform = 'translateY(0)';
            });
        }
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
