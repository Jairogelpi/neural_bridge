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
let extensionContextValid: boolean = true;

/**
 * Check if the extension context is still valid
 */
function isExtensionContextValid(): boolean {
    try {
        // Accessing chrome.runtime.id throws if context is invalidated
        return extensionContextValid && !!chrome.runtime?.id;
    } catch {
        extensionContextValid = false;
        return false;
    }
}

/**
 * Safe wrapper for chrome.runtime.sendMessage
 */
async function safeSendMessage(message: any): Promise<any> {
    if (!isExtensionContextValid()) {
        console.warn('[NeuralBridge] Extension context invalidated, skipping message.');
        return null;
    }
    try {
        return await chrome.runtime.sendMessage(message);
    } catch (err: any) {
        if (err?.message?.includes('Extension context invalidated')) {
            extensionContextValid = false;
            console.warn('[NeuralBridge] Extension was reloaded. Please refresh the page.');
        } else {
            console.warn('[NeuralBridge] sendMessage failed:', err);
        }
        return null;
    }
}

/**
 * UNIVERSAL SEMANTIC DOMAIN DISCOVERY
 * 
 * Pure mathematical approach - ZERO hardcoded keywords, domains, or heuristics.
 * 
 * How it works:
 * 1. Extract semantic features via SMT (entities, numbers, claims, relationships, etc)
 * 2. Compute mathematical measures: entropy, variance, feature ratios
 * 3. Generate emergent domain label from the dominant semantic characteristics
 * 4. Return a semantic profile that DESCRIBES the content mathematically
 * 
 * This is universal because:
 * - No predefined domain categories
 * - No keyword matching
 * - Adapts to ANY content type
 * - The "domain" is derived from the mathematical signature
 */

interface SemanticProfile {
    /** Emergent label generated from dominant features */
    domain: string;
    /** Confidence based on feature concentration */
    confidence: number;
    /** Feature type ratios - the semantic signature */
    signature: Record<string, number>;
    /** Shannon entropy - measures information density */
    entropy: number;
    /** Dominant feature type */
    dominant: string;
}

/**
 * Calculate Shannon entropy of a distribution
 * H = -Σ p(x) * log2(p(x))
 * 
 * Higher entropy = more diverse/uniform feature distribution
 * Lower entropy = features concentrated in fewer types
 */
function calculateEntropy(distribution: Record<string, number>): number {
    const values = Object.values(distribution).filter(v => v > 0);
    if (values.length === 0) return 0;

    let entropy = 0;
    for (const p of values) {
        if (p > 0) {
            entropy -= p * Math.log2(p);
        }
    }
    return entropy;
}

/**
 * Find the dominant feature types (top N by ratio)
 */
function findDominantFeatures(distribution: Record<string, number>, n: number = 2): string[] {
    return Object.entries(distribution)
        .filter(([_, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([k, _]) => k);
}

/**
 * Generate an emergent domain label based on the mathematical signature
 * No hardcoded domains - labels are DERIVED from the feature profile
 */
/**
 * Find the most semantically "heavy" concepts in the distribution.
 * These are the pivots that define the character of the content.
 */
function extractPivotConcepts(features: Array<{ type: string; canonical: string; confidence: number }>): string[] {
    const weights: Record<string, number> = {};

    for (const f of features) {
        // We only care about substantial entities or claims as pivots
        if (f.type === 'entity' || f.type === 'claim') {
            const key = f.canonical.toLowerCase();
            if (key.length > 2) {
                weights[key] = (weights[key] || 0) + f.confidence;
            }
        }
    }

    return Object.entries(weights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([k, _]) => k.charAt(0).toUpperCase() + k.slice(1));
}

/**
 * Generate an emergent domain label based on the mathematical signature
 * No hardcoded domains or concept maps - labels are DERIVED from content gravity.
 */
function generateEmergentLabel(
    distribution: Record<string, number>,
    entropy: number,
    dominants: string[],
    pivots: string[]
): string {
    const primary = dominants[0] || 'mixed';

    // Entropy levels (Logarithmic focus)
    let focusLabel = 'universal';
    if (entropy < 1.0) focusLabel = 'focused';
    else if (entropy < 1.8) focusLabel = 'structured';
    else if (entropy < 2.5) focusLabel = 'diverse';

    // If we have pivots, they define the domain. Otherwise fall back to type character.
    if (pivots.length > 0) {
        return `${focusLabel}: ${pivots.join('-')}`;
    }

    return `${focusLabel}: ${primary}`;
}

async function detectDomainWithSMT(): Promise<SemanticProfile> {
    const pageText = document.body.innerText.slice(0, 12000);

    const fallbackProfile: SemanticProfile = {
        domain: 'emerging',
        confidence: 0.5,
        signature: {},
        entropy: 0,
        dominant: 'content'
    };

    try {
        // 1. Build semantic tree - extracts ALL semantic features
        const tree = await SMTRuntime.build(pageText);

        if (!tree || !tree.nodes) {
            console.log('[NeuralBridge] SMT tree empty');
            return fallbackProfile;
        }

        // 2. Collect all features from all nodes
        const allFeatures: Array<{ type: string; canonical: string; confidence: number; position: number }> = [];

        const nodesIterable = tree.nodes instanceof Map
            ? Array.from(tree.nodes.values())
            : Object.values(tree.nodes);

        for (const node of nodesIterable as any[]) {
            if (node?.features && Array.isArray(node.features)) {
                for (const f of node.features) {
                    allFeatures.push({
                        type: f.type || 'unknown',
                        canonical: f.canonical || f.original || 'concept',
                        confidence: f.confidence || 0.5,
                        position: f.position || 0
                    });
                }
            }
        }

        console.log(`[NeuralBridge] Extracted ${allFeatures.length} semantic features`);

        if (allFeatures.length < 2) {
            return fallbackProfile;
        }

        // 3. Build feature distribution vector (the semantic signature)
        const typeCount: Record<string, number> = {};
        let totalConfidence = 0;

        for (const f of allFeatures) {
            typeCount[f.type] = (typeCount[f.type] || 0) + 1;
            totalConfidence += f.confidence;
        }

        const total = allFeatures.length;
        const distribution: Record<string, number> = {};

        for (const [type, count] of Object.entries(typeCount)) {
            distribution[type] = count / total;
        }

        // 4. Calculate mathematical measures
        const entropy = calculateEntropy(distribution);
        const avgConfidence = totalConfidence / total;
        const dominants = findDominantFeatures(distribution, 3);
        const pivots = extractPivotConcepts(allFeatures);

        // 5. Generate emergent label (no hardcoded domains!)
        const domain = generateEmergentLabel(distribution, entropy, dominants, pivots);

        // 6. Calculate confidence based on feature concentration
        // Lower entropy = higher confidence (more focused content)
        // Higher avg feature confidence = higher overall confidence
        const maxEntropy = Math.log2(Object.keys(distribution).length || 1);
        const entropyRatio = maxEntropy > 0 ? entropy / maxEntropy : 0;
        const confidence = Math.min(0.98, (1 - entropyRatio * 0.5) * avgConfidence + 0.3);

        const profile: SemanticProfile = {
            domain,
            confidence,
            signature: distribution,
            entropy,
            dominant: dominants[0] || 'mixed'
        };

        console.log(`[NeuralBridge] Semantic Profile:`, {
            domain: profile.domain,
            confidence: `${Math.round(profile.confidence * 100)}%`,
            entropy: profile.entropy.toFixed(2),
            dominant: profile.dominant,
            features: total
        });

        return profile;

    } catch (e) {
        console.warn('[NeuralBridge] Semantic analysis failed:', e);
        return fallbackProfile;
    }
}

export async function runDetection() {
    if (!isExtensionContextValid()) return;

    const profile = await detectDomainWithSMT();
    lastDetectedDomain = profile.domain;

    try {
        // Store full semantic profile for popup display
        chrome.storage.local.set({
            nb_active_domain: profile.domain,
            nb_domain_confidence: profile.confidence,
            nb_semantic_entropy: profile.entropy,
            nb_dominant_feature: profile.dominant,
            nb_last_detected_url: window.location.href,
            nb_detection_ts: new Date().toISOString()
        });

        // Sync with agent if it exists
        if (agent) {
            agent.setDomain(profile.domain as any);
        }
    } catch (err: any) {
        if (err?.message?.includes('Extension context invalidated')) {
            extensionContextValid = false;
        }
    }

    console.log(`[Neural Bridge] Semantic Domain: ${profile.domain} | Entropy: ${profile.entropy.toFixed(2)} | Dominant: ${profile.dominant}`);
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
            safeSendMessage({
                type: "NB_PUSH_RUN",
                run: {
                    id: `run_${Date.now()}`,
                    score: verdict.sri / 100,
                    state: verdict.state,
                    reason: verdict.reason,
                    timestamp: new Date().toISOString()
                }
            });
        });
    }

    if (!observer) {
        observer = new ContextObserver();
        observer.start();
    }

    runDetection();
}

// ========== MESSAGE HANDLERS ==========

try {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (!isExtensionContextValid()) return false;

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
                    console.log(`[NeuralBridge] Page text sample: ${pageText.slice(0, 200)}...`);

                    const crystal = await PCKRuntime.compile(pageText, {
                        domain: domain as any,
                        extract_numbers: true,
                        extract_entities: true,
                        extract_temporals: true
                    });

                    // Convert Map to Object for JSON serialization
                    const serializedCrystal = {
                        ...crystal,
                        proof_tree: {
                            ...crystal.proof_tree,
                            nodes: crystal.proof_tree?.nodes instanceof Map
                                ? Object.fromEntries(crystal.proof_tree.nodes)
                                : crystal.proof_tree?.nodes || {}
                        }
                    };

                    const nodeCount = crystal.proof_tree?.nodes instanceof Map
                        ? crystal.proof_tree.nodes.size
                        : Object.keys(crystal.proof_tree?.nodes || {}).length;

                    console.log(`[NeuralBridge] Crystal created: ${crystal.pck_id} with ${nodeCount} nodes`);
                    sendResponse({ success: true, crystal: serializedCrystal });
                } catch (e) {
                    console.error('[NeuralBridge] Crystallize failed:', e);
                    sendResponse({ success: false, error: String(e) });
                }
            })();
            return true; // Keep channel open for async
        }

        return false;
    });
} catch (err: any) {
    if (err?.message?.includes('Extension context invalidated')) {
        extensionContextValid = false;
    }
}

// Global initialization
if (document.readyState === 'complete') {
    initSilentMonitor();
} else {
    window.addEventListener('load', initSilentMonitor);
}

// Periodic update for SPAs (with smart detection)
setInterval(runDetection, 15000);
