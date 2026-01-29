async function refresh() {
    const res = await chrome.runtime.sendMessage({ type: "NB_GET_STATE" });
    const storage = await chrome.storage.local.get(['nb_active_domain', 'nb_domain_confidence']);

    // Update main state log
    const stateEl = document.getElementById("state")!;
    stateEl.textContent = res ? `[OK] Knowledge Base Active\n[Identity] ${res.tenant_id?.slice(0, 8) || 'unknown'}...\n[Sync] Active Pulse` : "[WAIT] Synchronizing...";

    // Update metrics
    const fidelityEl = document.getElementById("fidelity")!;
    const activeHostEl = document.getElementById("activeHost")!;

    // Priority: Auto-detected Knowledge Domain
    if (storage.nb_active_domain && storage.nb_active_domain !== 'general') {
        activeHostEl.textContent = String(storage.nb_active_domain).toUpperCase();
        activeHostEl.style.color = 'var(--accent-blue)';
    } else if (res && res.active_host) {
        activeHostEl.textContent = String(res.active_host).toUpperCase();
        activeHostEl.style.color = 'var(--text-secondary)';
    } else {
        activeHostEl.textContent = "IDLE";
        activeHostEl.style.color = 'var(--text-secondary)';
    }

    // Average SRI score from recent runs
    if (res && res.runs && res.runs.length > 0) {
        const avg = res.runs.reduce((acc: number, r: any) => acc + (r.score || 0), 0) / res.runs.length;
        fidelityEl.textContent = `${Math.round(avg * 100)}%`;
    } else {
        fidelityEl.textContent = "100%"; // Base state for new crystals
    }
}

document.getElementById("btnRefresh")!.addEventListener("click", () => {
    const btn = document.getElementById("btnRefresh") as HTMLButtonElement;
    btn.textContent = "Mounting...";
    setTimeout(() => {
        void refresh();
        btn.textContent = "Knowledge Crystal Mounted";
        setTimeout(() => btn.textContent = "Mount Knowledge Crystal", 2000);
    }, 800);
});

void refresh();
// Auto-refresh popup every second for "live" feel
setInterval(refresh, 1000);
