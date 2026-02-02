// Neural Bridge - Crystal OS Logic

const views = {
    live: document.getElementById('view-live')!,
    storage: document.getElementById('view-storage')!
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

document.getElementById('open-dashboard')!.onclick = () => {
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' }); // Assuming dashboard is served here
};

// Init
setInterval(updateMetrics, 1000);
updateMetrics();
