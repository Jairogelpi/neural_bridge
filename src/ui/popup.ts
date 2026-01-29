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
        fidelityEl.style.color = avg >= 0.85 ? 'var(--accent-green)' : (avg >= 0.5 ? 'var(--accent-amber)' : 'var(--accent-red)');
    } else {
        fidelityEl.textContent = "--"; // Honest state: No data yet
        fidelityEl.style.color = 'var(--text-secondary)';
    }
    // Strict Mode Toggle
    const toggleStrict = document.getElementById("toggleStrict") as HTMLInputElement;
    const strictStorage = await chrome.storage.local.get(['nb_strict_mode']);
    toggleStrict.checked = !!strictStorage.nb_strict_mode;

    toggleStrict.addEventListener("change", async () => {
        await chrome.storage.local.set({ nb_strict_mode: toggleStrict.checked });
        // Notify active tab to update agent config immediately
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                type: "NB_UPDATE_CONFIG", 
                config: { strictMode: toggleStrict.checked } 
            });
        }
    });
    // Identity & Reputation Logic
    const identityPanel = document.getElementById("identity-panel")!;
    const registerCta = document.getElementById("register-cta")!;
    
    // Check if author is registered
    const authRes = await chrome.runtime.sendMessage({ type: "NB_GET_AUTHOR_IDENTITY" });
    
    if (authRes && authRes.ok && authRes.author) {
        // Show Identity Panel
        identityPanel.style.display = "block";
        registerCta.style.display = "none";
        
        document.getElementById("author-handle")!.textContent = authRes.author.handle || "Anonymous";
        document.getElementById("author-tier")!.textContent = (authRes.author.tier || "Community").toUpperCase();
        document.getElementById("author-rep")!.textContent = (authRes.author.reputation || 0).toFixed(2);
    } else {
        // Show Registration CTA
        identityPanel.style.display = "none";
        registerCta.style.display = "block";
        
        // Setup Register Button
        const btnRegister = document.getElementById("btnRegister");
        if (btnRegister) {
            btnRegister.onclick = () => {
                // Simple inline form for MVP
                registerCta.innerHTML = `
                    <div class="card-label" style="margin-bottom: 8px;">Create Identity</div>
                    <input id="reg-name" type="text" placeholder="Display Name" style="width: 100%; padding: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 4px;">
                    <input id="reg-handle" type="text" placeholder="@handle" style="width: 100%; padding: 8px; margin-bottom: 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 4px;">
                    <button id="btnSubmitReg" class="btn-primary" style="width: 100%; padding: 8px;">Create</button>
                `;
                
                document.getElementById("btnSubmitReg")!.onclick = async () => {
                    const name = (document.getElementById("reg-name") as HTMLInputElement).value;
                    const handle = (document.getElementById("reg-handle") as HTMLInputElement).value;
                    
                    if (!name || !handle) return;
                    
                    const regRes = await chrome.runtime.sendMessage({ 
                        type: "NB_REGISTER_AUTHOR", 
                        name, 
                        handle 
                    });
                    
                    if (regRes && regRes.ok) {
                        void refresh(); // Reload state
                    }
                };
            };
        }
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
