
import { SynapticIngestor, IngestSource } from './synaptic_ingestor';
import { NeurogenesisEngine } from './neurogenesis_engine';
import { Sentinel } from './sentinel';

/**
 * AUTONOMOUS ONBOARDING (Zero-Config Brain) 🧠✨
 * 
 * Capability: Automated Knowledge Expansion.
 * Orchestrates the "One-Click" onboarding process. 
 * It coordinates the ingestor, domain detection, and neurogenesis.
 */
export class AutonomousOnboarding {

    /**
     * UNIVERSAL PLUG: The ultimate zero-friction entry point.
     * 1. Ingest via SynapticIngestor.
     * 2. Analyze for potential Capability Gaps.
     * 3. Trigger spontaneous evolution if needed.
     */
    static async universalPlug(source: IngestSource): Promise<{
        status: 'COMPLETE' | 'EVOLVING' | 'ERROR';
        domain: string;
        stats: any;
    }> {
        console.log(`[AutonomousOnboarding] 🚀 Universal Plug-and-Play started...`);

        try {
            // 1. Ingest and Atlas-project
            const ingestResult = await SynapticIngestor.fastPlug(source);

            // 2. CHECK FOR CAPABILITY GAPS (Phase Psi Integration)
            // If the confidence is low, it might mean the system lacks a specific "organ" for this domain.
            if (ingestResult.resonanceScore < 0.6) {
                console.warn(`[AutonomousOnboarding] 🧬 Low resonance detected for domain ${ingestResult.detectedDomain}. Triggering Neurogenesis...`);

                await NeurogenesisEngine.detectCapabilityGap({
                    id: `${ingestResult.detectedDomain}_optimizer`,
                    description: `Autonomous requirement for ${ingestResult.detectedDomain} logic optimization.`,
                    required_logic: `Specific mathematical invariants for ${ingestResult.detectedDomain} context processing.`,
                    context_domain: ingestResult.detectedDomain
                });

                return {
                    status: 'EVOLVING',
                    domain: ingestResult.detectedDomain,
                    stats: ingestResult
                };
            }

            // 3. Log Success
            await Sentinel.emit({
                type: 'SEMANTIC_HANDSHAKE',
                severity: 'info',
                message: `Autonomous Onboarding Complete for "${source.metadata?.name || 'anonymous source'}"`,
                details: ingestResult
            });

            return {
                status: 'COMPLETE',
                domain: ingestResult.detectedDomain,
                stats: ingestResult
            };

        } catch (error: any) {
            console.error(`[AutonomousOnboarding] ❌ Onboarding failure:`, error);
            return {
                status: 'ERROR',
                domain: 'unknown',
                stats: { error: error.message }
            };
        }
    }
}
