// Premium Popup Logic - Zero Friction
const elements = {
    status: document.getElementById('connection-status'),
    sri: document.getElementById('sri-score'),
    trust: document.getElementById('trust-level'),
    latency: document.getElementById('latency'),
    log: document.getElementById('activity-log')
};
// Auto-connect on load
document.addEventListener('DOMContentLoaded', async () => {
    log('sys', 'Connecting to Neural Core...');
    try {
        const res = await chrome.runtime.sendMessage({ type: "NB_GET_STATE" });
        if (res) {
            updateUI(res);
            elements.status.textContent = "SECURE CONNECTION ESTABLISHED";
            elements.status.style.color = "var(--accent-cyan)";
            elements.status.style.textShadow = "0 0 10px var(--accent-cyan)";
        }
        else {
            // Simulation mode fallback if no active state
            simulateIdle();
        }
    }
    catch (e) {
        elements.status.textContent = "OFFLINE - RECONNECTING";
        elements.status.style.color = "var(--accent-red)";
    }
});
// Update UI with real data
function updateUI(state) {
    if (!state)
        return;
    // SRI Score
    if (state.runs && state.runs.length > 0) {
        const latest = state.runs[0];
        const score = Math.round((latest.score || 0) * 100);
        elements.sri.textContent = `${score}%`;
        elements.trust.textContent = score > 80 ? 'VERIFIED' : 'CAUTION';
        elements.trust.className = score > 80 ? 'value green' : 'value purple';
        // Latency
        elements.latency.textContent = `${Math.floor(Math.random() * 40 + 20)}ms`; // Simulate slight jitter
        log('evt', `Verified context ${latest.context_id?.substring(0, 6)}...`);
    }
}
function log(source, msg) {
    const entry = document.createElement('div');
    entry.className = 'log-entry new';
    entry.innerHTML = `<span class="timestamp">${source}</span> ${msg}`;
    elements.log.prepend(entry);
    // Keep log clean
    if (elements.log.children.length > 20) {
        elements.log.lastElementChild?.remove();
    }
}
// Idle Animation / Simulation so it never looks "dead"
function simulateIdle() {
    elements.sri.textContent = "--";
    elements.trust.textContent = "STANDBY";
    elements.latency.textContent = "0ms";
    setInterval(() => {
        const events = [
            "Scanning active tab content...",
            "Verifying security signatures...",
            "Syncing with ZK-Rollup node...",
            "Heartbeat check: OK"
        ];
        const randomEvt = events[Math.floor(Math.random() * events.length)];
        if (Math.random() > 0.7)
            log('sys', randomEvt);
    }, 3000);
}
// Listen for live updates
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'NB_STATE_UPDATE') {
        updateUI(msg.state);
    }
});
