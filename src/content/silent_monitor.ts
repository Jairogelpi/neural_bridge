import { DomainHeuristics } from '../services/domain_heuristics';
import { FirewallAgent } from './firewall_agent';
import { FirewallOverlay } from '../ui/firewall_overlay';
import { ContextObserver } from "./context_observer";
import { PCKRuntime } from '../pck/pck_runtime';
import { SMTRuntime } from '../smt';

/**
 * SILENT MONITOR & FIREWALL AGENT
 * Orchestrates background detection, reasoning protection, and crystallization.
 */

let agent: FirewallAgent | null = null;
let observer: ContextObserver | null = null;
let lastDetectedDomain: string = 'general';

/**
 * SMART DOMAIN DETECTION - Uses SMT semantic analysis
 */
async function detectDomainWithSMT(): Promise<{ domain: string; confidence: number }> {
    const pageText = document.body.innerText.slice(0, 8000);

    try {
        // Build semantic tree to analyze content structure
        const tree = await SMTRuntime.build(pageText);

        // Analyze semantic patterns for domain inference
        const semanticSignals = {
            medical: ['patient', 'treatment', 'diagnosis', 'clinical', 'drug', 'therapy', 'symptom', 'dose', 'mg', 'prescription'],
            legal: ['contract', 'clause', 'liability', 'jurisdiction', 'party', 'agreement', 'terminate', 'indemnify', 'court', 'attorney'],
            tech: ['api', 'function', 'code', 'server', 'database', 'endpoint', 'request', 'response', 'algorithm', 'deploy'],
            finance: ['investment', 'portfolio', 'asset', 'market', 'equity', 'trading', 'revenue', 'capital', 'dividend', 'stock'],
            education: ['curriculum', 'student', 'learning', 'course', 'teacher', 'academic', 'research', 'university', 'study'],
            science: ['experiment', 'hypothesis', 'data', 'analysis', 'research', 'methodology', 'conclusion', 'peer-reviewed']
        };

        const textLower = pageText.toLowerCase();
        const scores: Record<string, number> = {};

        // Weighted semantic scoring
        for (const [domain, keywords] of Object.entries(semanticSignals)) {
            let score = 0;
            for (const keyword of keywords) {
                const matches = (textLower.match(new RegExp(`\\b${keyword}\\b`, 'gi')) || []).length;
                score += matches;
            }
            scores[domain] = score;
        }

        // Find best domain
        let bestDomain = 'general';
        let maxScore = 0;
        for (const [domain, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                bestDomain = domain;
            }
        }

        // Confidence based on semantic tree metrics and keyword density
        const treeComplexity = tree?.document?.claim_count || tree?.document?.word_count || 1;
        const confidence = Math.min((maxScore / 10) * (1 + treeComplexity / 50), 0.98);

        console.log(`[NeuralBridge] SMT Domain: ${bestDomain} (${Math.round(confidence * 100)}%, ${maxScore} signals)`);

        return {
            domain: confidence > 0.15 ? bestDomain : 'general',
            confidence: Math.max(confidence, 0.1)
        };

    } catch (e) {
        console.warn('[NeuralBridge] SMT detection failed, using fallback:', e);
        return DomainHeuristics.detect(pageText);
    }
}

export async function runDetection() {
    const result = await detectDomainWithSMT();
    lastDetectedDomain = result.domain;

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
        agent.startSilentMonitoring((verdict) => {
            // Update local overlay
            FirewallOverlay.update(
                verdict.state,
                verdict.sri,
                verdict.reason,
                verdict.invariants,
                verdict.features,
                verdict.verification_time_ms
            );

            // Sync with background for Popup persistence
            chrome.runtime.sendMessage({
                type: "NB_PUSH_RUN",
                run: {
                    id: `run_${Date.now()}`,
                    score: verdict.sri / 100,
                    state: verdict.state,
                    reason: verdict.reason,
                    timestamp: new Date().toISOString()
                }
            }).catch(err => console.warn("[NeuralBridge] Background sync failed:", err));
        });
    }

    if (!observer) {
        observer = new ContextObserver();
        observer.start();
    }

    runDetection();
}

// ========== MESSAGE HANDLERS ==========

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    // Config updates
    if (msg.type === "NB_UPDATE_CONFIG" && agent) {
        agent.setConfig(msg.config);
        console.log("[NeuralBridge] Config updated:", msg.config);
        return;
    }

    // CRYSTALLIZE: Compile PCK from current page
    if (msg.type === "NB_CRYSTALLIZE") {
        (async () => {
            try {
                const pageText = document.body.innerText.slice(0, 15000);
                const domain = lastDetectedDomain || 'general';

                console.log(`[NeuralBridge] Crystallizing page (${domain})...`);

                const crystal = await PCKRuntime.compile(pageText, {
                    domain: domain as any,
                    extract_numbers: true,
                    extract_entities: true,
                    extract_temporals: true
                });

                console.log(`[NeuralBridge] Crystal created: ${crystal.pck_id}`);
                sendResponse({ success: true, crystal });
            } catch (e) {
                console.error('[NeuralBridge] Crystallize failed:', e);
                sendResponse({ success: false, error: String(e) });
            }
        })();
        return true; // Keep channel open for async
    }

    return false;
});

// Global initialization
if (document.readyState === 'complete') {
    initSilentMonitor();
} else {
    window.addEventListener('load', initSilentMonitor);
}

// Periodic update for SPAs (with smart detection)
setInterval(runDetection, 15000);
