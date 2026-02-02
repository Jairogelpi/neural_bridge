// Neural Bridge - Crystal OS Logic
import { loginAuthor, registerAuthorV2 } from "../api/client";

const views = {
    live: document.getElementById('view-live')!,
    storage: document.getElementById('view-storage')!,
    auth: document.getElementById('view-auth')!,
    main: document.getElementById('main-content')!
};

const containers = {
    login: document.getElementById('auth-login')!,
    register: document.getElementById('auth-register')!
};

const tabs = {
    live: document.getElementById('tab-live')!,
    storage: document.getElementById('tab-storage')!
};

// State
let activeCrystal: any = null;

// Tab Switching
function switchTab(tab: 'live' | 'storage') {
    tabs.live.classList.remove('active');
    tabs.storage.classList.remove('active');
    views.live.style.display = 'none';
    views.storage.style.display = 'none';

    tabs[tab].classList.add('active');
    views[tab].style.display = 'block';
}

tabs.live.onclick = () => switchTab('live');
tabs.storage.onclick = () => switchTab('storage');

// Live Metrics
async function updateMetrics() {
    try {
        const res = await chrome.runtime.sendMessage({ type: "NB_GET_STATE" });
        if (res && res.runs && res.runs.length > 0) {
            const run = res.runs[0];
            const score = Math.round((run.score || 0) * 100);

            document.getElementById('val-fidelity')!.textContent = `${score}%`;
            document.getElementById('bar-fidelity')!.style.width = `${score}%`;

            // Store for copy
            activeCrystal = run;
        }
    } catch (e) {
        console.log("Not connected");
    }
}

// Storage Logic
document.getElementById('btn-inject')!.onclick = async () => {
    const input = (document.getElementById('crystal-input') as HTMLTextAreaElement).value;
    try {
        const crystal = JSON.parse(input);
        // Send to content script for injection
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            await chrome.tabs.sendMessage(tab.id, {
                type: "NB_INJECT_CRYSTAL",
                crystal
            });
            alert("Crystal Injected Successfully!");
        }
    } catch (e) {
        alert("Invalid Crystal Format");
    }
};

document.getElementById('btn-copy')!.onclick = () => {
    if (activeCrystal) {
        navigator.clipboard.writeText(JSON.stringify(activeCrystal, null, 2));
        const btn = document.getElementById('btn-copy')!;
        const originalText = btn.innerHTML;
        btn.innerHTML = "COPIED!";
        setTimeout(() => btn.innerHTML = originalText, 1500);
    } else {
        alert("No active crystal to copy.");
    }
};

// Redirection to Dashboard
document.getElementById('open-dashboard')!.onclick = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://neural-bridge-dashboard.onrender.com' });
};

// --- AUTH LOGIC ---

const authError = document.getElementById('auth-error')!;

async function checkAuth() {
    const storage = await chrome.storage.local.get(['nb_auth_token', 'nb_user']);
    if (storage.nb_auth_token && storage.nb_user) {
        views.auth.style.display = 'none';
        views.main.style.display = 'block';
        document.getElementById('auth-status')!.textContent = 'SIGNED IN';
        document.getElementById('auth-status')!.style.color = 'var(--crystal-cyan)';
        document.getElementById('user-info')!.textContent = `${storage.nb_user.name} (@${storage.nb_user.handle})`;
        return true;
    } else {
        views.auth.style.display = 'block';
        views.main.style.display = 'none';
        document.getElementById('auth-status')!.textContent = 'NOT SIGNED IN';
        return false;
    }
}

document.getElementById('link-show-register')!.onclick = () => {
    containers.login.style.display = 'none';
    containers.register.style.display = 'block';
};

document.getElementById('link-show-login')!.onclick = () => {
    containers.login.style.display = 'block';
    containers.register.style.display = 'none';
};

document.getElementById('btn-login-submit')!.onclick = async () => {
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    authError.textContent = "";
    try {
        await loginAuthor({ email, password });
        await checkAuth();
    } catch (err: any) {
        authError.textContent = err.message || "Login failed";
    }
};

document.getElementById('btn-register-submit')!.onclick = async () => {
    const name = (document.getElementById('reg-name') as HTMLInputElement).value;
    const handle = (document.getElementById('reg-handle') as HTMLInputElement).value;
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;
    authError.textContent = "";
    try {
        await registerAuthorV2({ name, handle, email, password });
        await checkAuth();
    } catch (err: any) {
        authError.textContent = err.message || "Registration failed";
    }
};

// Init
checkAuth();
setInterval(updateMetrics, 2000);
updateMetrics();
