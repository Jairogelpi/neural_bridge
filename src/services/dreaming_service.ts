
import { Crystal, CrystalStatus, ConstraintRule } from '../types/crystal_format';
import { CrystalFuser } from './crystal_fuser';
import { supabase } from '../db/supabase';

/**
 * RECURSIVE DREAMING ENGINE 🌌😴
 * 
 * Periodically scans the knowledge lattice for patterns.
 * Fuses related crystals into higher-order "Sovereign Axioms."
 */
export class DreamingService {
    private static isDreaming = false;

    /**
     * Start the autonomous dreaming loop.
     */
    static async startDreamingLoop(intervalMs: number = 60000) {
        if (this.isDreaming) return;
        this.isDreaming = true;
        console.log("[Dreaming] 🌌 Recursive Dreamer activated.");

        setInterval(async () => {
            try {
                await this.dream();
            } catch (error) {
                console.error("[Dreaming] ⛔ Nightmare detected:", error);
            }
        }, intervalMs);
    }

    /**
     * A single "Dream" cycle. 
     * Finds related crystals and fuses them into universal laws.
     */
    static async dream() {
        // 1. Fetch random crystals from the Global Cortex
        const { data: crystals, error } = await supabase
            .from('crystals')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !crystals || crystals.length < 2) return;

        console.log(`[Dreaming] 😴 Analyzing ${crystals.length} crystals for pattern synthesis...`);

        // 2. Group by Domain
        const domains = [...new Set(crystals.map(c => c.domain))];

        for (const domain of domains) {
            const domainCrystals = crystals.filter(c => c.domain === domain);
            if (domainCrystals.length < 2) continue;

            // 3. Autonomous Fusion (Recursive Synthesis)
            // We fuse the top 2 most recent crystals in the domain
            const c1 = domainCrystals[0]!;
            const c2 = domainCrystals[1]!;

            console.log(`[Dreaming] ⚗️ Fusing ${c1.context_id} + ${c2.context_id} into Axiom...`);

            // Use CrystalFuser to synthesize the weighted truth
            const fused = await CrystalFuser.fuseHolographic([c1, c2]);

            // 4. Elevate to SOVEREIGN Status
            fused.tier = 'sovereign';
            fused.intent.primary = `Universal Law: ${domain.toUpperCase()}`;
            fused.created_at = new Date().toISOString();
            fused.context_id = `axiom_${Date.now()}`;

            // 5. Persist the new Axiom
            await supabase.from('crystals').insert(fused);
            console.log(`[Dreaming] ✨ NEW AXIOM SYNTHESIZED: ${fused.context_id}`);
        }
    }
}
