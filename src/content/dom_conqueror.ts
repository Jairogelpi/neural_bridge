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
    private observer: MutationObserver | null = null;
    private config: PlatformConfig | null = null;
    private processedNodes = new Set<HTMLElement>();

    constructor() {
        this.detectPlatform();
    }

    private detectPlatform() {
        const host = window.location.hostname;
        if (host.includes('openai') || host.includes('chatgpt')) this.config = PLATFORMS['chatgpt'] || null;
        else {
            // UNIVERSAL MODE (RAG Portable)
            this.config = {
                name: 'Universal Web',
                messageSelector: 'p, article, .content, main', // Broad selector for reading
                textSelector: 'body',
                containerSelector: 'body'
            };
        }

        console.log(`[NeuralBridge] ⚔️ Conquering ${this.config?.name || 'Unknown'} UI...`);
        this.start();
    }

    private start() {
        if (!document.body) {
            // Wait for body to be ready
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                // If readyState is interactive/complete but body is still null (rare but possible in frames), retry shortly
                setTimeout(() => this.start(), 100);
            }
            return;
        }

        try {
            if (!this.observer) {
                this.observer = new MutationObserver(this.handleMutations.bind(this));
            }
            this.observer.observe(document.body, { childList: true, subtree: true });
            this.scanExisting();
        } catch (e) {
            console.warn('[NeuralBridge] Observer failed to start:', e);
            // Retry once after a short delay in case of weird DOM state
            setTimeout(() => {
                if (document.body) {
                    try {
                        if (!this.observer) {
                            this.observer = new MutationObserver(this.handleMutations.bind(this));
                        }
                        this.observer.observe(document.body, { childList: true, subtree: true });
                    } catch (retryError) {
                        console.error('[NeuralBridge] Observer retry failed:', retryError);
                    }
                }
            }, 500);
        }

        // Always attempt to inject FAB, regardless of observer status
        try {
            this.injectFAB();
        } catch (e) {
            console.error('[NeuralBridge] FAB Injection failed:', e);
        }
    }

    private injectFAB() {
        if (document.getElementById('nb-fab')) {
            console.log('[NeuralBridge] FAB already exists.');
            return;
        }
        console.log('[NeuralBridge] Injecting FAB...');
        const fab = document.createElement('div');
        fab.id = 'nb-fab';

        // FAB Style - Icon Only
        Object.assign(fab.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '2147483647',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            filter: 'drop-shadow(0 8px 32px rgba(0, 122, 255, 0.3))'
        });

        // Icon
        const iconUrl = chrome.runtime.getURL('icons/icon128.png');
        fab.innerHTML = `<img src="${iconUrl}" style="width: 100%; height: 100%; object-fit: contain;" alt="NB">`;

        // Hover Effect
        fab.addEventListener('mouseenter', () => fab.style.transform = 'scale(1.1)');
        fab.addEventListener('mouseleave', () => fab.style.transform = 'scale(1)');

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
            iframe.src = chrome.runtime.getURL('src/ui/popup.html');
            Object.assign(iframe.style, {
                position: 'fixed',
                bottom: '114px', // Adjusted for larger FAB
                right: '24px',
                width: '380px',
                height: '520px',
                border: 'none',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
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
