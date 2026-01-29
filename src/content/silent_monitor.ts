import { DomainHeuristics } from '../services/domain_heuristics';
import { FirewallAgent } from './firewall_agent';
import { FirewallOverlay } from '../ui/firewall_overlay';
import { ContextObserver } from "./context_observer";

/**
 * SILENT MONITOR & FIREWALL AGENT
 * Orchestrates background detection and reasoning protection.
 */

let agent: FirewallAgent | null = null;
let observer: ContextObserver | null = null;

export function runDetection() {
    const pageText = document.body.innerText.slice(0, 10000);
    const result = DomainHeuristics.detect(pageText);

    chrome.storage.local.set({
        nb_active_domain: result.domain,
        nb_domain_confidence: result.confidence,
        nb_last_detected_url: window.location.href,
        nb_detection_ts: new Date().toISOString()
    });

    console.log(`[Neural Bridge] Domain Detected: ${result.domain} (${Math.round(result.confidence * 100)}%)`);
}

export function initSilentMonitor() {
    console.log("[NeuralBridge] Initializing Absolute Harmony flow...");

    if (!agent) {
        agent = new FirewallAgent();
        FirewallOverlay.render();
        agent.startSilentMonitoring((verdict) => {
            FirewallOverlay.update(verdict.state, verdict.sri, verdict.reason);
        });
    }

    if (!observer) {
        observer = new ContextObserver();
        observer.start();
    }

    runDetection();
}

// Listen for config updates from Popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "NB_UPDATE_CONFIG" && agent) {
        agent.setConfig(msg.config);
        console.log("[NeuralBridge] Config updated:", msg.config);
    }
});

// Global initialization
if (document.readyState === 'complete') {
    initSilentMonitor();
} else {
    window.addEventListener('load', initSilentMonitor);
}

// Periodic update for SPAs
setInterval(runDetection, 15000);
