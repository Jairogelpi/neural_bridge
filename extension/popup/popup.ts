// Popup Script - Neural Bridge Governance OS v2.0 Titan
// "Titan" UI Integration

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

const hostBadge = document.getElementById('current-host')!;
const modeCaptureBtn = document.getElementById('mode-capture')!;
const modeInjectBtn = document.getElementById('mode-inject')!;
const modeMeshBtn = document.getElementById('mode-mesh')!;

const viewCapture = document.getElementById('capture-mode')!;
const viewInject = document.getElementById('inject-mode')!;
const viewMesh = document.getElementById('mesh-mode')!;

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

// Backend Config
const BACKEND_URL = 'https://neural-bridge-backend.onrender.com'; // Production Server
// const BACKEND_URL = 'http://localhost:10000'; // Local Dev Fallback

async function init() {
    setupEventListeners();
    await loadSettings();
    await updateSessionToken();
    await loadMetrics(); // Tries backend first, fallback to local
    await updateHost();

    // Sync live pricing immediately
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_PRICING' }, (res) => {
                if (chrome.runtime.lastError) return;
                if (res?.data) console.log('Live pricing synced:', Object.keys(res.data).length, 'models');
            });
        }
    });
}

async function updateHost() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
        if (tab.url.includes('chatgpt.com')) hostBadge.textContent = 'ChatGPT';
        else if (tab.url.includes('claud.ai')) hostBadge.textContent = 'Claude';
        else if (tab.url.includes('gemini.google.com')) hostBadge.textContent = 'Gemini';
        else hostBadge.textContent = new URL(tab.url).hostname.replace('www.', '');
    }
}

function setupEventListeners() {
    modeCaptureBtn.onclick = () => showMode('capture');
    modeInjectBtn.onclick = () => showMode('inject');
    modeMeshBtn.onclick = () => showMode('mesh');

    document.getElementById('btn-capture')!.onclick = handleCapture;
    document.getElementById('btn-transfer')!.onclick = handleTransfer;
    document.getElementById('btn-save-settings')!.onclick = saveSettings;
    document.getElementById('btn-copy')!.onclick = handleCopy;
    document.getElementById('btn-paste')!.onclick = handlePaste;

    document.getElementById('btn-settings')!.onclick = () => document.getElementById('settings-panel')!.classList.add('active');
    document.getElementById('btn-close-settings')!.onclick = () => document.getElementById('settings-panel')!.classList.remove('active');

    btnBootstrap.onclick = handleBootstrap;
    document.getElementById('open-dashboard')!.onclick = () => {
        chrome.tabs.create({ url: 'https://neural-bridge-dashboard.onrender.com/dashboard' });
    };
}

function showMode(mode: string) {
    // Buttons (using 'active' class for styling)
    [modeCaptureBtn, modeInjectBtn, modeMeshBtn].forEach(b => b.classList.remove('active'));
    document.getElementById(`mode-${mode}`)!.classList.add('active');

    // Views
    [viewCapture, viewInject, viewMesh].forEach(v => v.classList.add('hidden'));
    document.getElementById(`${mode}-mode`)!.classList.remove('hidden');
}

async function handleCapture() {
    const btn = document.getElementById('btn-capture') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.textContent = 'Synthesizing...';
    btn.disabled = true;

    try {
        const res = await sendToContent('CAPTURE_CONTEXT');
        if (res.success) {
            currentCrystal = res.data;
            updateCrystalDisplay(res.data);
            await loadMetrics(); // Refresh stats
        } else {
            alert('Capture Failed: ' + (res.error || 'Unknown error'));
        }
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function updateCrystalDisplay(crystal: Crystal) {
    const section = document.getElementById('crystal-section')!;
    const details = document.getElementById('crystal-details')!;

    section.classList.remove('hidden');
    details.innerHTML = `
        <div class="detail-row"><span>Context ID</span><span class="detail-value">${crystal.context_id.slice(0, 8)}...</span></div>
        <div class="detail-row"><span>Tokens</span><span class="detail-value">${crystal.metadata.tokens_used}</span></div>
        <div class="detail-row"><span>Compression</span><span class="detail-value">${(crystal.metadata.compression_ratio * 100).toFixed(1)}%</span></div>
        <div class="detail-row"><span>Quality</span><span class="detail-value" style="color: var(--success)">${Math.round(crystal.metadata.quality_score * 100)}%</span></div>
    `;
}

async function handleCopy() {
    if (!currentCrystal) return;
    await navigator.clipboard.writeText(JSON.stringify(currentCrystal));
    const btn = document.getElementById('btn-copy')!;
    btn.textContent = 'Copied to Clipboard!';
    setTimeout(() => btn.textContent = 'Copy Crystal Data', 2000);
}

async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        const crystal = JSON.parse(text);
        if (crystal.scp_version) {
            currentCrystal = crystal;
            document.getElementById('transfer-section')!.classList.remove('hidden');
            const btn = document.getElementById('btn-paste')!;
            btn.textContent = 'Crystal Loaded';
            btn.style.borderColor = 'var(--success)';
            btn.style.color = 'var(--success)';
        }
    } catch (e) {
        alert('Invalid Crystal Format - Please copy a valid Neural Crystal');
    }
}

async function handleTransfer() {
    const btn = document.getElementById('btn-transfer') as HTMLButtonElement;
    btn.textContent = 'Injecting...';
    btn.disabled = true;

    try {
        const res = await sendToContent('VERIFY_TRANSFER', currentCrystal);
        if (res.success) {
            document.getElementById('result-section')!.classList.remove('hidden');
            document.getElementById('result-score')!.textContent = `${Math.round(res.data.score * 100)}%`;
            document.getElementById('result-invariants')!.textContent = `${res.data.metrics.verified_invariants}/${res.data.metrics.total_invariants}`;

            // Re-load global metrics to reflect life cost
            await loadMetrics();
        }
    } finally {
        btn.textContent = 'Execute Injection';
        btn.disabled = false;
    }
}

async function sendToContent(action: string, data?: any): Promise<any> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { success: false, error: 'No active tab' };

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id!, { action, data }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn('[Neural Bridge] Connection error:', chrome.runtime.lastError.message);
                resolve({ success: false, error: 'Extension inactive on this page. Refresh needed.' });
            } else {
                resolve(response || { success: false, error: 'No response from content script' });
            }
        });
    });
}

async function loadSettings() {
    const res = await chrome.storage.local.get(['openrouter_api_key', 'compiler_model']);

    // Prioridad: storage > env build-time
    if (res.openrouter_api_key) {
        apiKeyInput.value = res.openrouter_api_key;
    }

    if (res.compiler_model) compilerModel.value = res.compiler_model;
}

async function saveSettings() {
    await chrome.storage.local.set({
        openrouter_api_key: apiKeyInput.value,
        compiler_model: compilerModel.value
    });
    const btn = document.getElementById('btn-save-settings')!;
    btn.textContent = 'Configuration Applied';
    setTimeout(() => {
        btn.textContent = 'Apply Configuration';
        document.getElementById('settings-panel')!.classList.remove('active');
    }, 1000);
}

/**
 * Loads metrics. Tries Global Backend first (user's total stats), falls back to local.
 */
async function loadMetrics() {
    let globalStats = null;
    const token = tokenDisplay.value;

    if (token) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
            const response = await fetch(`${BACKEND_URL}/v1/analytics/stats`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.stats) {
                    globalStats = data.stats;
                }
            }
        } catch (e) {
            console.warn('Backend unavailable, using local stats.', e);
        }
    }

    if (globalStats) {
        // Use real backend data
        statTransfers.textContent = String(globalStats.crystalsGenerated || 0);
        statSuccess.innerHTML = `${Math.round((globalStats.averageFidelity || 0) * 100)}%`;
        statTokens.innerHTML = `${((globalStats.totalTokens || 0) / 1000).toFixed(1)}k`;
        statCost.innerHTML = `$${(globalStats.savingsUsd || 0).toFixed(2)}`;
    } else {
        // Use local fallback
        const res = await chrome.storage.local.get(['scp_metrics']);
        const metrics = res.scp_metrics || [];
        const total = metrics.length;
        const tokens = metrics.reduce((sum: number, m: any) => sum + (m.total_tokens || 0), 0);
        const cost = metrics.reduce((sum: number, m: any) => sum + (m.total_cost_usd || 0), 0);
        const successful = metrics.filter((m: any) => m.transfer?.success).length;
        const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;

        statTransfers.textContent = String(total);
        statSuccess.innerHTML = `${successRate}%`;
        statTokens.innerHTML = `${(tokens / 1000).toFixed(1)}k`;
        statCost.innerHTML = `$${cost.toFixed(2)}`;
    }
}

// Helper for safe runtime messages
async function sendToBackground(message: any): Promise<any> {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                console.warn('[Neural Bridge] Background connection error:', chrome.runtime.lastError.message);
                resolve({ success: false, error: chrome.runtime.lastError.message });
            } else {
                resolve(response || { success: false, error: 'No response' });
            }
        });
    });
}

async function updateSessionToken() {
    const res = await sendToBackground({ action: 'GET_TOKEN' });
    if (res.success && res.data) {
        tokenDisplay.value = res.data;
        btnBootstrap.textContent = 'Active';
        btnBootstrap.disabled = true;
    }
}

async function handleBootstrap() {
    btnBootstrap.textContent = 'Logging...';
    btnBootstrap.disabled = true;

    const res = await sendToBackground({ action: 'BOOTSTRAP_SESSION' });
    if (res.success) {
        await updateSessionToken();
    } else {
        btnBootstrap.textContent = 'Failed';
        btnBootstrap.disabled = false;
        console.warn('Failed to connect to Neural Bridge Server via Background.');
    }
}

init();
