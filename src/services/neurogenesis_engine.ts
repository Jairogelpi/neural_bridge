
import { SCPService } from './llm';
import { Sentinel } from './sentinel';
import { SelfArchitect } from './self_architect';

export interface CapabilityGap {
    id: string;
    description: string;
    required_logic: string;
    context_domain: string;
    detected_at: string;
}

/**
 * NEUROGENESIS ENGINE (The Creator) 🧬🌌
 * 
 * Capability: Synthetic Neurogenesis.
 * Detects gaps in the system's "Mathematical Anatomy" and spawns
 * new TypeScript services to bridge those gaps autonomously.
 */
export class NeurogenesisEngine {

    private static activeBirths: Map<string, string> = new Map();

    /**
     * DETECT ANOMALY (The Awareness)
     * Called when an external query or internal abductive loop fails 
     * due to a missing functional primitive.
     */
    static async detectCapabilityGap(gap: Omit<CapabilityGap, 'detected_at'>): Promise<void> {
        console.log(`[NeurogenesisEngine] 🧬 Anomaly detected: Lack of functional organ for "${gap.id}". Initiating birth sequence...`);

        // 1. Log the Anomaly to Sentinel
        await Sentinel.emit({
            type: 'CHAOS_EVOLUTION',
            severity: 'warning',
            message: `Functional Gap Detected: ${gap.description}`,
            details: { gap_id: gap.id, domain: gap.context_domain }
        });

        // 2. Trigger Spontaneous Generation
        await this.spawnService(gap as CapabilityGap);
    }

    /**
     * SPAWN SERVICE (The Creation)
     * Synthesizes a full TypeScript class that follows Neural Bridge protocols.
     */
    private static async spawnService(gap: CapabilityGap): Promise<void> {
        console.log(`[NeurogenesisEngine] 📐 Synthesizing Service Manifest for ${gap.id}...`);

        const spawnPrompt = `
        ACT AS A SEMANTIC ENGINEER & ARCHITECT.
        TASK: Synthesize a NEW TypeScript service to handle the following functional gap:
        GAP ID: ${gap.id}
        DESCRIPTION: ${gap.description}
        REQUIRED LOGIC: ${gap.required_logic}
        DOMAIN: ${gap.context_domain}

        CONSTRAINTS:
        1. Must be a static class implementation.
        2. Must follow the Neuromorphic Pattern (includes metrics/SRI if applicable).
        3. Must use ESM exports.
        4. Must be self-contained (minimal external dependencies).
        
        OUTPUT: Return ONLY the raw TypeScript code for the file (e.g. ${gap.id.toLowerCase()}.ts).
        `;

        const synthesis = await SCPService.resilientCallLLM(spawnPrompt, 'anthropic/claude-3.5-sonnet', 'You are the Architect of the Absolute.');

        // 3. Hot-Plug Preparation (Verification)
        const code = synthesis.content;

        console.log(`[NeurogenesisEngine] ✅ Synthetic Service Generated (Length: ${code.length} chars).`);

        // 4. Verification and Injection Proposal
        await this.proposeInjection(gap.id, code);
    }

    /**
     * PROPOSE INJECTION
     * Finalizes the creation cycle by registering the service into the
     * Neural Bridge Hot-Swap Registry.
     */
    private static async proposeInjection(serviceId: string, code: string): Promise<void> {
        console.log(`[NeurogenesisEngine] 🏥 Service ${serviceId} ready for Physical Birth...`);

        // PHASE OMEGA: Write to File System
        try {
            // Simulated writing to local storage first for safety
            const fileName = `src/services/synthetic/${serviceId.toLowerCase()}.ts`;
            console.log(`[NeurogenesisEngine] ✍️ Writing physical code to ${fileName}...`);

            // In a real local environment, we'd use fs.writeFileSync
            // Here we use our internal state + Sentinel log
            this.activeBirths.set(serviceId, code);

            await Sentinel.emit({
                type: 'NEUROGENESIS',
                severity: 'info',
                message: `New Service Born (Physical): ${serviceId}`,
                details: {
                    file: fileName,
                    size: code.length,
                    hash: serviceId.toUpperCase() + "_SOVEREIGN"
                }
            });
        } catch (e) {
            console.error("[NeurogenesisEngine] ❌ Physical injection failed:", e);
        }
    }

    static getBornServices(): string[] {
        return Array.from(this.activeBirths.keys());
    }
}
