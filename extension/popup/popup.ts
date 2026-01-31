// Popup Script - Neural Bridge Extension (Production - Dynamic Pricing)
// REAL DATA ONLY

interface Crystal {
    scp_version: string;
    context_id: string;
    metadata: {
        tokens_used: number;
        generation_cost: number;
        compression_ratio: number;
        quality_score: number;
    };
    content: any;
    invariants: any[];
}

export { };

// Build-time injected key (set VITE_OPENROUTER_API_KEY in extension/.env before build)
const OPENROUTER_API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY as string | undefined;

const hostBadge = document.getElementById('current-host')!;
const modeCapture = document.getElementById('mode-capture')!;
const modeInject = document.getElementById('mode-inject')!;
const modeMesh = document.getElementById('mode-mesh')!;
const captureMode = document.getElementById('capture-mode')!;
const injectMode = document.getElementById('inject-mode')!;
const meshMode = document.getElementById('mesh-mode')!;

const statTransfers = document.getElementById('stat-transfers')!;
const statSuccess = document.getElementById('stat-success')!;
const statTokens = document.getElementById('stat-tokens')!;
const statCost = document.getElementById('stat-cost')!;

// Settings elements
const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;
const compilerModel = document.getElementById('compiler-model') as HTMLSelectElement;

const tokenDisplay = document.getElementById('session-token-display') as HTMLInputElement;
const btnBootstrap = document.getElementById('btn-bootstrap') as HTMLButtonElement;

let currentCrystal: Crystal | null = null;

async function init() {
    setupEventListeners();
    await loadSettings();
    await updateSessionToken();
    await loadMetrics();
    await updateHost();

    // Sync live pricing immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_PRICING' }, (res) => {
                if (res?.data) console.log('Live pricing synced:', Object.keys(res.data).length, 'models');
            });
        }
    });
}

async function updateHost() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        if (tab.url.includes('chatgpt.com')) hostBadge.textContent = 'ChatGPT';
        else if (tab.url.includes('claude.ai')) hostBadge.textContent = 'Claude';
        else if (tab.url.includes('gemini.google.com')) hostBadge.textContent = 'Gemini';
    }
}

function setupEventListeners() {
    modeCapture.onclick = () => showMode('capture');
    modeInject.onclick = () => showMode('inject');
    modeMesh.onclick = () => showMode('mesh');

    document.getElementById('btn-capture')!.onclick = handleCapture;
    document.getElementById('btn-transfer')!.onclick = handleTransfer;
    document.getElementById('btn-save-settings')!.onclick = saveSettings;

    document.getElementById('btn-settings')!.onclick = () => document.getElementById('settings-panel')!.classList.add('active');
    document.getElementById('btn-close-settings')!.onclick = () => document.getElementById('settings-panel')!.classList.remove('active');

    btnBootstrap.onclick = handleBootstrap;
}

function showMode(mode: string) {
    [modeCapture, modeInject, modeMesh].forEach(b => b.classList.remove('active'));
    [captureMode, injectMode, meshMode].forEach(m => m.classList.add('hidden'));

    document.getElementById(`mode-${mode}`)!.classList.add('active');
    document.getElementById(`${mode}-mode`)!.classList.remove('hidden');
}

async function handleCapture() {
    const btn = document.getElementById('btn-capture')!;
    btn.innerHTML = '⚡ Fetching Live Rates...';

    const res = await sendToContent('CAPTURE_CONTEXT');
    if (res.success) {
        currentCrystal = res.data;
        document.getElementById('crystal-section')!.classList.remove('hidden');
        document.getElementById('stat-gen-cost')!.textContent = `$${res.data.metadata.generation_cost.toFixed(4)}`;
        await loadMetrics();
    }
    btn.innerHTML = '<span>⚡</span> Capture Context (Real AI)';
}

async function handleTransfer() {
    const btn = document.getElementById('btn-transfer')!;
    btn.innerHTML = '🚀 Calc Real-time Costs...';

    const res = await sendToContent('VERIFY_TRANSFER', currentCrystal);
    if (res.success) {
        document.getElementById('result-section')!.classList.remove('hidden');
        document.getElementById('result-score')!.textContent = `${Math.round(res.data.score * 100)}%`;
        document.getElementById('result-cost')!.textContent = `$${res.data.metrics.total_cost_usd.toFixed(4)}`;
        await loadMetrics();
    }
    btn.innerHTML = '<span>🚀</span> Transfer & Verify';
}

async function sendToContent(action: string, data?: any): Promise<any> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { success: false };
    return new Promise(r => chrome.tabs.sendMessage(tab.id!, { action, data }, r));
}

async function loadSettings() {
    const res = await chrome.storage.local.get(['openrouter_api_key', 'compiler_model']);

    // Prioridad: storage > env build-time
    if (res.openrouter_api_key) {
        apiKeyInput.value = res.openrouter_api_key;
    } else if (OPENROUTER_API_KEY) {
        apiKeyInput.value = OPENROUTER_API_KEY;
        // Guarda en storage para no depender de rebuild
        await chrome.storage.local.set({ openrouter_api_key: OPENROUTER_API_KEY });
    }

    if (res.compiler_model) compilerModel.value = res.compiler_model;
}

async function saveSettings() {
    await chrome.storage.local.set({
        openrouter_api_key: apiKeyInput.value,
        compiler_model: compilerModel.value
    });
    alert('Settings Saved! Live pricing will refresh.');
    document.getElementById('settings-panel')!.classList.remove('active');
}

async function loadMetrics() {
    const res = await chrome.storage.local.get(['scp_metrics']);
    const metrics = res.scp_metrics || [];
    const total = metrics.length;
    const tokens = metrics.reduce((sum: number, m: any) => sum + (m.total_tokens || 0), 0);
    const cost = metrics.reduce((sum: number, m: any) => sum + (m.total_cost_usd || 0), 0);
    
    // Calculate real success rate
    const successful = metrics.filter((m: any) => m.transfer?.success).length;
    const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

    statTransfers.textContent = String(total);
    statSuccess.textContent = `${successRate}%`;
    statTokens.textContent = (tokens / 1000).toFixed(1) + 'K';
    statCost.textContent = `$${cost.toFixed(2)}`;
}

async function updateSessionToken() {
    const res = await chrome.runtime.sendMessage({ action: 'GET_TOKEN' });
    if (res.success && res.data) {
        tokenDisplay.value = res.data;
        btnBootstrap.textContent = 'Active';
        btnBootstrap.disabled = true;
    }
}

async function handleBootstrap() {
    btnBootstrap.textContent = 'Logging...';
    btnBootstrap.disabled = true;

    const res = await chrome.runtime.sendMessage({ action: 'BOOTSTRAP_SESSION' });
    if (res.success) {
        await updateSessionToken();
    } else {
        btnBootstrap.textContent = 'Connection Failed';
        btnBootstrap.disabled = false;
        alert('Failed to connect to Neural Bridge Server. Please ensure the local server is running (npm run server).');
    }
}

init();
