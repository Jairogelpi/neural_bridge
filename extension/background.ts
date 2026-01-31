// Background Service Worker - Neural Bridge Extension
// Handles API calls and persistent state
export { };


const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:8080';

interface StorageData {
    apiToken?: string;
    installId?: string;
}

// Initialize
chrome.runtime.onInstalled.addListener(() => {
    console.log('[Neural Bridge] Extension installed');

    // Generate install ID if not exists
    chrome.storage.local.get(['installId'], (result) => {
        if (!result.installId) {
            const installId = generateUUID();
            chrome.storage.local.set({ installId });
            console.log('[Neural Bridge] Install ID:', installId);
        }
    });
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Async response
});

async function handleMessage(
    message: { action: string; data?: unknown },
    _sender: chrome.runtime.MessageSender
): Promise<{ success: boolean; data?: unknown; error?: string }> {
    switch (message.action) {
        case 'API_CALL':
            const res = await apiCall(message.data as { method: string; path: string; body?: unknown });
            if (!res.success && res.error?.includes('401')) {
                // Si falla por 401, intentamos re-bootstrapear automáticamente
                const boot = await bootstrapSession();
                if (boot.success) {
                    return apiCall(message.data as { method: string; path: string; body?: unknown });
                }
            }
            return res;

        case 'GET_TOKEN':
            return getToken();

        case 'SET_TOKEN':
            return setToken(message.data as string);

        case 'BOOTSTRAP_SESSION':
            return bootstrapSession();

        case 'GET_INSTALL_ID':
            return getInstallId();

        case 'OPENROUTER_CALL':
            return openRouterCall(message.data as any);

        case 'OPENROUTER_MODELS':
            return fetchOpenRouterModels();

        default:
            return { success: false, error: 'Unknown action' };
    }
}

// API call helper
async function apiCall(params: { method: string; path: string; body?: unknown }): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
        const { apiToken } = await chrome.storage.local.get(['apiToken']) as StorageData;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Idempotency-Key': generateUUID()
        };

        if (apiToken) {
            headers['Authorization'] = `Bearer ${apiToken}`;
        }

        const response = await fetch(API_BASE + params.path, {
            method: params.method,
            headers,
            body: params.body ? JSON.stringify(params.body) : undefined
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `API ${response.status}: ${errorText}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

// Token management
async function getToken(): Promise<{ success: boolean; data?: string }> {
    const { apiToken } = await chrome.storage.local.get(['apiToken']) as StorageData;
    return { success: true, data: apiToken };
}

async function setToken(token: string): Promise<{ success: boolean }> {
    await chrome.storage.local.set({ apiToken: token });
    return { success: true };
}

async function getInstallId(): Promise<{ success: boolean; data?: string }> {
    const { installId } = await chrome.storage.local.get(['installId']) as StorageData;
    return { success: true, data: installId };
}

async function bootstrapSession(): Promise<{ success: boolean; data?: any; error?: string }> {
    const { installId } = await chrome.storage.local.get(['installId']) as StorageData;
    const res = await apiCall({
        method: 'POST',
        path: '/v1/session/bootstrap',
        body: {
            install_id: installId,
            platform: 'browser_extension',
            version: '1.0.0'
        }
    });

    if (res.success && (res.data as any).session_token) {
        await setToken((res.data as any).session_token);
    }
    return res;
}

// Utilities
async function openRouterCall(params: { apiKey: string; body: any }): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${params.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://neural-bridge.ai',
                'X-Title': 'Neural Bridge SCP'
            },
            body: JSON.stringify(params.body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `OpenRouter API ${response.status}: ${errorText}` };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

async function fetchOpenRouterModels(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) {
            return { success: false, error: 'Failed to fetch models' };
        }
        const data = await response.json();
        return { success: true, data };
    } catch (e) {
        return { success: false, error: String(e) };
    }
}

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Context menu (optional)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'neural-bridge-capture',
        title: 'Capture with Neural Bridge',
        contexts: ['page'],
        documentUrlPatterns: [
            'https://chat.openai.com/*',
            'https://chatgpt.com/*',
            'https://gemini.google.com/*',
            'https://claude.ai/*'
        ]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'neural-bridge-capture' && tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'CAPTURE_CONTEXT' });
    }
});
