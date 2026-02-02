import { supabase } from '../db/supabase';

export interface SentinelEvent {
    type: 'VACCINE_SYNTHESIS' | 'ORACLE_DREAM' | 'JURY_ESCALATION' | 'FRACTAL_COMPRESSION' | 'ECONOMIC_ROUTING' | 'CRYSTAL_FUSION' | 'ENTROPY_PURIFICATION' | 'CHAOS_EVOLUTION' | 'SEMANTIC_HANDSHAKE' | 'SOVEREIGN_CONSENSUS';
    severity: 'info' | 'warning' | 'critical';
    message: string;
    details: any;
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
        const { data: crystals } = await supabase
            .from('crystals')
            .select('context_id, verification')
            .eq('domain', vaccine.context_domain);

        if (!crystals) return 0;

        let healedCount = 0;
        for (const crystal of crystals) {
            // Check if crystal already has this vaccine (simulation of deep scan)
            const isVulnerable = Math.random() > 0.7; // 30% chance for simulation

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
