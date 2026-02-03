// Neural Bridge - Minimalist Popup Logic
import { loginAuthor, registerAuthorV2 } from "../api/client";

const DASHBOARD_URL = 'https://neural-bridge-dashboard.onrender.com/dashboard';

// State
let activeCrystal: any = null;

// Elements
const views = {
    auth: document.getElementById('view-auth')!,
    main: document.getElementById('main-content')!
};

const containers = {
    login: document.getElementById('auth-login')!,
    register: document.getElementById('auth-register')!
};

// Initialize
async function init() {
    setupEventListeners();
    const isAuth = await checkAuth();
    if (isAuth) {
        updateMetrics();
        setInterval(updateMetrics, 3000);
    }
}

function setupEventListeners() {
    // Crystallize
    document.getElementById('btn-crystallize')!.onclick = handleCrystallize;
    document.getElementById('btn-copy-crystal')!.onclick = handleCopyCrystal;

    // Dashboard
    document.getElementById('open-dashboard')!.onclick = () => {
        chrome.tabs.create({ url: DASHBOARD_URL });
    };

    // Auth toggles
    document.getElementById('link-show-register')!.onclick = (e) => {
        e.preventDefault();
        containers.login.style.display = 'none';
        containers.register.style.display = 'block';
    };

    document.getElementById('link-show-login')!.onclick = (e) => {
        e.preventDefault();
        containers.login.style.display = 'block';
        containers.register.style.display = 'none';
    };

    // Auth submit
    document.getElementById('btn-login-submit')!.onclick = handleLogin;
    document.getElementById('btn-register-submit')!.onclick = handleRegister;
}

// ========== CRYSTALLIZE ==========

async function handleCrystallize() {
    const btn = document.getElementById('btn-crystallize') as HTMLButtonElement;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span class="nb-loading">Crystallizing...</span>`;
    btn.disabled = true;

    try {
        const res = await sendToContent('NB_CRYSTALLIZE');

        if (res.success && res.crystal) {
            activeCrystal = res.crystal;
            showCrystalPreview(res.crystal);
            updateStatus('Crystal Ready', 'success');
        } else {
            updateStatus('Failed', 'error');
            console.error('[NB Popup] Crystallize failed:', res.error);
        }
    } catch (err) {
        updateStatus('Error', 'error');
        console.error('[NB Popup] Crystallize error:', err);
    } finally {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

function showCrystalPreview(crystal: any) {
    const preview = document.getElementById('crystal-preview')!;
    const data = document.getElementById('crystal-data')!;

    preview.style.display = 'block';

    // PCK uses pck_id, claim.domain, claim.confidence, proof_tree.nodes (Map)
    const nodeCount = crystal.proof_tree?.nodes instanceof Map
        ? crystal.proof_tree.nodes.size
        : (typeof crystal.proof_tree?.nodes === 'object' ? Object.keys(crystal.proof_tree.nodes || {}).length : 0);

    data.textContent = JSON.stringify({
        id: crystal.pck_id?.slice(0, 12) + '...' || 'generated',
        domain: crystal.claim?.domain || crystal.domain || 'general',
        nodes: nodeCount,
        confidence: crystal.claim?.confidence || 0.95
    }, null, 2);
}

async function handleCopyCrystal() {
    if (!activeCrystal) return;
    await navigator.clipboard.writeText(JSON.stringify(activeCrystal, null, 2));
    const btn = document.getElementById('btn-copy-crystal')!;
    btn.innerHTML = '✓';
    setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
    }, 1500);
}

// ========== METRICS & STATUS ==========

function updateStatus(text: string, type: 'idle' | 'success' | 'error' = 'idle') {
    const pill = document.getElementById('status-pill')!;
    pill.textContent = text;

    pill.style.background = type === 'success' ? 'rgba(52, 168, 83, 0.1)' :
        type === 'error' ? 'rgba(234, 67, 53, 0.1)' : 'rgba(26, 115, 232, 0.08)';
    pill.style.color = type === 'success' ? '#34a853' :
        type === 'error' ? '#ea4335' : '#1a73e8';
}

async function updateMetrics() {
    try {
        // Get state from background (includes runs)
        const res = await chrome.runtime.sendMessage({ type: "NB_GET_STATE" });
        const integrityEl = document.getElementById('val-integrity')!;
        const fidelityEl = document.getElementById('val-fidelity')!;
        const domainEl = document.getElementById('val-domain')!;

        if (res && res.runs && res.runs.length > 0) {
            const run = res.runs[0];
            const score = Math.round((run.score || 0) * 100);

            fidelityEl.textContent = `${score}%`;

            if (score > 80) {
                integrityEl.textContent = "Verified";
                integrityEl.style.color = "#34a853";
            } else if (score > 40) {
                integrityEl.textContent = "Stable";
                integrityEl.style.color = "#1a73e8";
            } else {
                integrityEl.textContent = "Uncertain";
                integrityEl.style.color = "#ea4335";
            }

            updateStatus('Active', 'success');
        } else {
            integrityEl.textContent = "Scanning...";
            fidelityEl.textContent = "--%";
        }

        // Get domain from storage
        const storage = await chrome.storage.local.get(['nb_active_domain', 'nb_domain_confidence']);
        if (storage.nb_active_domain) {
            const confidence = Math.round((storage.nb_domain_confidence || 0) * 100);
            domainEl.textContent = `${capitalize(storage.nb_active_domain)} (${confidence}%)`;
        }
    } catch (e) {
        // Silent fail
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========== AUTH ==========

async function checkAuth() {
    const storage = await chrome.storage.local.get(['nb_auth_token', 'nb_user']);
    const userInfo = document.getElementById('user-info')!;

    if (storage.nb_auth_token && storage.nb_user) {
        views.auth.style.display = 'none';
        views.main.style.display = 'flex';
        userInfo.textContent = `${storage.nb_user.name}`;
        updateStatus('Connected', 'success');
        return true;
    } else {
        views.auth.style.display = 'flex';
        views.main.style.display = 'none';
        updateStatus('Sign In Required', 'idle');
        return false;
    }
}

async function handleLogin() {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const btn = document.getElementById('btn-login-submit')!;
    const error = document.getElementById('auth-error')!;
    error.textContent = '';

    if (!email || !password) {
        error.textContent = 'Please enter email and password';
        return;
    }

    btn.textContent = 'Signing in...';
    try {
        await loginAuthor({ email, password });
        await checkAuth();
    } catch (err: any) {
        error.textContent = err.message || 'Login failed';
    } finally {
        btn.textContent = 'Continue';
    }
}

async function handleRegister() {
    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
    const handle = (document.getElementById('reg-handle') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;
    const btn = document.getElementById('btn-register-submit')!;
    const error = document.getElementById('auth-error')!;
    error.textContent = '';

    if (!name || !handle || !email || !password) {
        error.textContent = 'All fields are required';
        return;
    }

    btn.textContent = 'Creating...';
    try {
        await registerAuthorV2({ name, handle, email, password });
        await checkAuth();
    } catch (err: any) {
        error.textContent = err.message || 'Registration failed';
    } finally {
        btn.textContent = 'Create';
    }
}

// ========== MESSAGING ==========

async function sendToContent(action: string, data?: any): Promise<any> {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return { success: false, error: 'No active tab' };

    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id!, { type: action, data }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn('[NB Popup] Content connection error:', chrome.runtime.lastError.message);
                resolve({ success: false, error: 'Extension not active on this page' });
            } else {
                resolve(response || { success: false, error: 'No response' });
            }
        });
    });
}

// Start
init();
