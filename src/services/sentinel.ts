import { supabase } from '../db/supabase';
import { SMTRuntime } from '../smt';
import type { Crystal } from '../types/crystal_format';
import { ToonService } from '../../dashboard/src/lib/toon';

export interface SentinelEvent {
    type: 'VACCINE_SYNTHESIS' | 'ORACLE_DREAM' | 'JURY_ESCALATION' | 'FRACTAL_COMPRESSION' | 'ECONOMIC_ROUTING' | 'CRYSTAL_FUSION' | 'ENTROPY_PURIFICATION' | 'CHAOS_EVOLUTION' | 'SEMANTIC_HANDSHAKE' | 'SOVEREIGN_CONSENSUS' | 'HIVE_DREAM' | 'NEUROGENESIS' | 'COGNITIVE_EVOLUTION';
    severity: 'info' | 'warning' | 'critical';
    message: string;
    details: Record<string, unknown>;
    timestamp: string;
}

/**
 * THE SENTINEL (Global Observability) 👁️
 * 
 * Central hub for monitoring the "Semantic Health" of the Neural Bridge.
 * It tracks all Omega-level events and provides real-time telemetry.
 */
export class Sentinel {

    /**
     * Emits an event to the global observability store.
     */
    static async emit(event: Omit<SentinelEvent, 'timestamp'>): Promise<void> {
        const fullEvent: SentinelEvent = {
            ...event,
            timestamp: new Date().toISOString()
        };

        console.log(`[Sentinel] 👁️  [${fullEvent.type}] ${fullEvent.message}`);

        // Persist to a dedicated table for real-time dashboards
        await supabase.from('sentinel_logs').insert(fullEvent);
    }

    /**
     * SEMANTIC ENTANGLEMENT 🕸️
     * 
     * When a new vaccine is created, the Sentinel scans the entire Knowledge Lattice
     * to find existing Crystals that are "infected" by the newly discovered fallacy.
     */
    static async triggerEntanglement(vaccineId: string): Promise<number> {
        console.log(`[Sentinel] 🕸️  Initiating Semantic Entanglement for Vaccine: ${vaccineId}...`);

        // 1. Get the vaccine details
        const { data: vaccine } = await supabase.from('vaccines').select('*').eq('vaccine_id', vaccineId).single();
        if (!vaccine) return 0;

        // 2. Scan for "infected" crystals (simplified check by domain)
        const { data } = await supabase
            .from('crystals')
            .select('*')
            .eq('domain', vaccine.context_domain);

        const crystals = (data || []) as unknown as Crystal[];

        if (!crystals) return 0;

        // 🏛️ ZERO-CONSTANT REALITY TUNING
        const { LogicTuner } = await import('./logic_tuner');
        const threshold = await LogicTuner.autoCalibrationLoop(vaccine.context_domain, crystals);

        let healedCount = 0;
        for (const crystal of crystals) {
            // REAL SEMANTIC SCAN (Logic-Native)
            const crystalToon = ToonService.parse(crystal.raw_toon || '');
            const comparison = await SMTRuntime.compare(ToonService.stringify(crystalToon), String(vaccine.meta_invariant || ""));
            const isVulnerable = comparison.contradiction_detected || (comparison.semantic_similarity > threshold);

            if (isVulnerable) {
                console.log(`[Sentinel] 🩹 Healing Crystal ${crystal.context_id}: Applying retroactive vaccine armor.`);

                const updatedVerification = {
                    ...crystal.verification,
                    retroactive_vaccines: [
                        ...(crystal.verification.retroactive_vaccines || []),
                        vaccineId
                    ]
                };

                await supabase.from('crystals')
                    .update({ verification: updatedVerification })
                    .eq('context_id', crystal.context_id);

                healedCount++;
            }
        }

        await this.emit({
            type: 'VACCINE_SYNTHESIS',
            severity: 'info',
            message: `Semantic Entanglement healed ${healedCount} crystals for domain "${vaccine.context_domain}".`,
            details: { vaccine_id: vaccineId, healed: healedCount }
        });

        return healedCount;
    }
}
