
import { EdgeDistillator } from '../services/edge_distillator';
import { TalamicIndex } from '../services/talamic_index';
import { overlay } from './ui/overlay';

/**
 * NAVIGATION AUDITOR (Real-time Truth Check) 🌐⚖️
 * 
 * Capability: Passive Observation.
 * Monitors the current page content and audits it against 
 * the user's Sovereign Crystals via HDC.
 */
export class NavigationAuditor {

    private static auditInterval: any = null;

    /**
     * START AUDIT LOOP
     */
    static start() {
        if (this.auditInterval) return;

        console.log(`[NavigationAuditor] 👁️  Initializing real-time truth audit...`);
        this.auditInterval = setInterval(() => this.performAudit(), 10000); // Every 10s
    }

    /**
     * PERFORM AUDIT: Scans page text and checks for resonance.
     */
    static async performAudit() {
        // 1. Extract visible text (Simplified for MVP)
        const pageText = document.body.innerText.substring(0, 2000);

        // 2. Find most relevant crystal in Atlas
        const neighbors = await TalamicIndex.search(pageText, 1);
        if (neighbors.length === 0) return;

        const anchorNode = neighbors[0];
        const truth = anchorNode.metadata.preview;

        // 3. Check for contradiction via HDC (Zero Cost)
        const audit = EdgeDistillator.checkContradictionHDC(truth, pageText);

        if (audit.contradictory) {
            console.warn(`[NavigationAuditor] 🛡️ TRUTH CONTRADICTION DETECTED! (Distance: ${audit.distance.toFixed(2)})`);

            // 4. Trigger HUD Alert
            overlay.error(`Truth Contradiction: This page conflicts with your verified knowledge on "${anchorNode.metadata.domain}".`, 0, 5000);
        } else {
            console.log(`[NavigationAuditor] ✅ Page content is consistent with local Atlas.`);
        }
    }

    static stop() {
        if (this.auditInterval) {
            clearInterval(this.auditInterval);
            this.auditInterval = null;
        }
    }
}
